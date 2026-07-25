// ============================================================================
// daily-room — mint access to a team call's Daily.co room.
//
// The browser calls this when a member joins a call. We:
//   1. verify the caller is a member of the call's team (RLS on `calls`),
//   2. ensure the private Daily room exists (create it on first join),
//   3. mint a short-lived meeting token scoped to that room + user,
//   4. return { url, token } for the client's Daily iframe.
//
// The Daily API key never leaves the server. Rooms are `privacy: private`, so a
// valid meeting token is required to join — outsiders can't guess their way in.
//
// Secrets (set with `supabase secrets set`):
//   DAILY_API_KEY   — your Daily.co API key
//   DAILY_DOMAIN    — your Daily subdomain (e.g. "deadlinemate" for
//                     deadlinemate.daily.co); optional, used only as a fallback.
// ============================================================================
import { getUser, userClient } from "../_shared/supabase.ts";
import { json, preflight } from "../_shared/cors.ts";

const DAILY_API = "https://api.daily.co/v1";

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const user = await getUser(req);
  if (!user) return json({ error: "Sign in to join the call." }, 401);

  let body: { call_id?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const callId = body.call_id?.trim();
  if (!callId) return json({ error: "call_id is required." }, 400);

  const apiKey = Deno.env.get("DAILY_API_KEY");
  if (!apiKey) {
    return json({ error: "Video calling isn't configured yet. Add DAILY_API_KEY." }, 503);
  }
  const authHeader = { Authorization: `Bearer ${apiKey}` };

  // 1) Look up the call AS THE CALLER — RLS only returns it if they're a member.
  const uc = userClient(req);
  const { data: call, error } = await uc
    .from("calls")
    .select("id, room_name, kind, status")
    .eq("id", callId)
    .single();
  if (error || !call) {
    return json({ error: "Call not found, or you're not on this team." }, 403);
  }
  if (call.status === "ended" || call.status === "cancelled") {
    return json({ error: "This call has already ended." }, 409);
  }

  const roomName: string = call.room_name;

  // 2) Ensure the room exists (idempotent — create on 404).
  let roomUrl = "";
  try {
    const existing = await fetch(`${DAILY_API}/rooms/${roomName}`, { headers: authHeader });
    if (existing.ok) {
      roomUrl = (await existing.json()).url ?? "";
    } else if (existing.status === 404) {
      const created = await fetch(`${DAILY_API}/rooms`, {
        method: "POST",
        headers: { ...authHeader, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roomName,
          privacy: "private",
          properties: {
            // Auto-expire the room 8h after creation so stale rooms clean up.
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
            eject_at_room_exp: true,
            enable_prejoin_ui: true,
            enable_chat: false, // we have our own team chat
            enable_screenshare: true,
            start_video_off: call.kind === "audio",
            start_audio_off: false,
            max_participants: 20,
          },
        }),
      });
      if (!created.ok) {
        return json({ error: "Couldn't open the call room.", detail: await created.text() }, 502);
      }
      roomUrl = (await created.json()).url ?? "";
    } else {
      return json({ error: "Couldn't reach the video service.", detail: await existing.text() }, 502);
    }
  } catch (e) {
    return json({ error: "Couldn't reach the video service.", detail: String(e) }, 502);
  }

  const domain = Deno.env.get("DAILY_DOMAIN");
  if (!roomUrl && domain) roomUrl = `https://${domain}.daily.co/${roomName}`;
  if (!roomUrl) return json({ error: "Room URL unavailable." }, 502);

  // 3) Mint a meeting token scoped to this room + this user.
  const displayName =
    (user.user_metadata?.display_name as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined) ||
    user.email ||
    "Teammate";
  const tokRes = await fetch(`${DAILY_API}/meeting-tokens`, {
    method: "POST",
    headers: { ...authHeader, "Content-Type": "application/json" },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_id: user.id,
        user_name: displayName,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
        start_video_off: call.kind === "audio",
      },
    }),
  });
  if (!tokRes.ok) {
    return json({ error: "Couldn't create your call pass.", detail: await tokRes.text() }, 502);
  }
  const { token } = await tokRes.json();

  return json({ url: roomUrl, token, room_name: roomName, kind: call.kind });
});
