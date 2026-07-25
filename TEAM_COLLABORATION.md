# Team Collaboration — Chat & Calls · Build + Deploy Handoff

Adds **team chat** and **video/audio calls** (instant + scheduled, with a live
"who joined" headcount and full call history) to DeadlineMate's shared classes.
A `shared_class` **is** the team; its members can chat and call each other.

Surfaced on **`/app/classes/:id`** as four tabs: **Deadlines · Chat · Calls · Team**.

---

## Status at a glance

| | |
|---|---|
| Code | ✅ Complete — typechecks (`tsc --noEmit`, exit 0) and builds (`vite build`, exit 0) |
| Daily SDK | ✅ Added (`@daily-co/daily-js`), **code-split** — only loads when a call opens |
| Database migration | ⏳ Written, **not yet applied** to Supabase |
| Edge function | ⏳ Written, **not yet deployed** |
| Daily.co account/key | ❌ **Required — must be created by the project owner** |
| Live smoke test | ⏳ Pending deploy (first real call is the smoke test) |

**Two things only the owner can do:** (1) authenticate the Supabase CLI, and
(2) create a Daily.co account + API key. Everything else is ready.

---

## What was built

### Requirements → implementation

| Requirement | How it works |
|---|---|
| Create team + add more than one user | Reuses `shared_classes` + `shared_class_members`; **Team** tab has invite-by-code and a one-click **invite link** (`/app/classes?join=CODE` auto-opens Join) |
| Chat with the team | `team_messages` table + **Supabase Realtime** — live stream, optimistic send, day dividers, avatars |
| Video **or** audio call | Daily.co prebuilt call; audio calls start camera-off |
| Instant **or** scheduled | `dm_start_call` (instant) / `dm_schedule_call` (pick a time); a scheduled call flips to live on first join |
| Clearly show how many joined | Live **"N in call"** (Daily events) in the call header + Calls tab, plus **"M joined so far"**, plus durable `peak_participants` |
| Call history | `calls` + `call_participants`; History shows date, **who/how many joined**, and duration; calls auto-end when the last person leaves |
| Production-grade | RLS on every table; `SECURITY DEFINER` RPCs enforce membership + state server-side; Daily API key stays server-side (private rooms + minted tokens); lazy-loaded SDK |

### Files

| Area | Path |
|---|---|
| Schema · RLS · RPCs · realtime | `supabase/migrations/20260725000000_team_collab.sql` |
| Daily room + token minting (edge fn) | `supabase/functions/daily-room/index.ts` |
| Data hooks (chat / calls / members) | `src/app/lib/teamApi.js` |
| Call surface (Daily, lazy-loaded) | `src/app/components/CallRoom.jsx` |
| Chat UI | `src/app/components/TeamChat.jsx` |
| Calls UI (start / schedule / history) | `src/app/components/TeamCalls.jsx` |
| Members + invite | `src/app/components/TeamMembers.jsx` |
| Tabs wired in | `src/app/pages/ClassDetail.jsx` |
| Invite-link handler | `src/app/pages/Classes.jsx` |

---

## Architecture

```
Browser (React)
  ├─ Chat        supabase-js insert/select on team_messages   ─┐
  ├─ Call meta   RPCs: dm_start_call / dm_schedule_call /       │  Supabase
  │              dm_join_call / dm_leave_call / dm_end_call      │  (Postgres + RLS
  ├─ Realtime    postgres_changes on team_messages, calls,       │   + Realtime)
  │              call_participants  ─────────────────────────────┘
  └─ Live A/V    Daily.co prebuilt iframe (@daily-co/daily-js)
                    ▲ url + short-lived token
                    │
        Edge fn  daily-room  ── verifies membership via RLS ──►  Daily REST API
                    (holds DAILY_API_KEY server-side)             create room + mint token
```

- Chat, scheduling, participant tracking, and history are **100% Supabase** — no
  third party. Only the **live media** runs on Daily.
- The Daily API key never reaches the browser. Rooms are `privacy: private` and
  require a token minted by `daily-room`, which first confirms (via RLS) the
  caller is a member of that call's team.

---

## Deploy — remaining steps

> Order matters: **apply the migration and deploy the function BEFORE shipping the
> frontend**, so the Chat/Calls tabs don't call tables/RPCs that don't exist yet.

### 1. Authenticate the Supabase CLI (owner)

In this project directory:

```bash
supabase login          # opens a browser to authorize the CLI
# — or set a non-interactive token —
export SUPABASE_ACCESS_TOKEN=sbp_xxx   # from Supabase → Account → Access Tokens
```

The project is already linked (`ref: lclxkeppluqsfjenvrmh`).

### 2. Apply the database migration

```bash
supabase db push
# (or paste supabase/migrations/20260725000000_team_collab.sql into the SQL editor)
```

Creates `team_messages`, `calls`, `call_participants`, their RLS policies and
RPCs, and adds all three to the `supabase_realtime` publication.

### 3. Create a Daily.co account + deploy the edge function

1. Sign up at **daily.co** → Developers → copy your **API key**. Note your
   subdomain (e.g. `deadlinemate` → `deadlinemate.daily.co`).
2. Deploy + set secrets:

```bash
supabase functions deploy daily-room
supabase secrets set DAILY_API_KEY=your_daily_api_key
supabase secrets set DAILY_DOMAIN=your_subdomain   # optional fallback
```

`SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` are already
available to edge functions.

### 4. Ship the frontend

`@daily-co/daily-js` is already in `package.json`; Vercel installs it on deploy.
**No new client env vars needed.** Merge the PR (or `git push`) once steps 2–3 are done.

---

## Smoke test (after deploy)

1. Open a class → **Team** tab → copy the invite link; join as a second user
   (second browser / incognito) → both appear in the roster.
2. **Chat** tab: send a message from each side → both see it live.
3. **Calls** tab: **Start video call** → the room opens; join from the second
   user → header shows **"2 in call"**.
4. Leave from both → the call moves to **History** showing **2 joined** + duration.
5. **Schedule** a call for +2 min → it appears under **Upcoming** → **Join now**
   flips it to **Live**.

---

## Cost

Daily.co has a free tier (participant-minutes / month); beyond that it's
usage-based. Chat, scheduling, history, and presence run on Supabase at no extra
cost. See also `docs/team-collaboration.md`.
