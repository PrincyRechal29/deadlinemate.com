# Team collaboration — chat & calls

Adds **team chat** and **video/audio calls** (instant + scheduled, with live
headcount and call history) to shared classes. A `shared_class` **is** the team;
its `shared_class_members` are who can chat and call.

Surfaced in the app on **`/app/classes/:id`** as four tabs:
**Deadlines · Chat · Calls · Team**.

## Architecture

```
Browser (React)
  ├─ Chat        supabase-js insert/select on team_messages  ─┐
  ├─ Call meta   RPCs: dm_start_call / dm_schedule_call /     │  Supabase
  │              dm_join_call / dm_leave_call / dm_end_call    │  (Postgres + RLS
  ├─ Realtime    postgres_changes on team_messages, calls,     │   + Realtime)
  │              call_participants  ───────────────────────────┘
  └─ Live A/V    Daily.co prebuilt iframe (@daily-co/daily-js)
                    ▲ url + short-lived token
                    │
        Edge fn  daily-room  ── verifies membership (RLS) ──► Daily REST API
                    (holds DAILY_API_KEY server-side)          create room + mint token
```

- **Chat, scheduling, participant tracking, and history are 100% Supabase** —
  no third party. Writes go through `SECURITY DEFINER` RPCs so membership and
  state transitions are enforced server-side; reads are gated by RLS reusing
  `dm_is_class_member()`.
- **Only the live media** runs on Daily.co. The API key never reaches the
  browser; rooms are `privacy: private` and require a token minted by the
  `daily-room` edge function, which first confirms (via RLS) that the caller is
  a member of that call's team.
- **"How many joined"** is tracked two ways: live headcount from Daily's
  `participant-*` events (shown in the call header and the Calls tab), and a
  durable `peak_participants` + per-session `call_participants` rows for history.
- Calls **auto-end** when the last participant leaves (`dm_leave_call`), or the
  host/owner can end them explicitly (`dm_end_call`).

## Files

| Area | Path |
|---|---|
| Schema, RLS, RPCs, realtime | `supabase/migrations/20260725000000_team_collab.sql` |
| Daily room + token minting | `supabase/functions/daily-room/index.ts` |
| Data hooks (chat/calls/members) | `src/app/lib/teamApi.js` |
| Call surface (Daily) | `src/app/components/CallRoom.jsx` (lazy-loaded) |
| Chat UI | `src/app/components/TeamChat.jsx` |
| Calls UI (start/schedule/history) | `src/app/components/TeamCalls.jsx` |
| Members + invite | `src/app/components/TeamMembers.jsx` |
| Tabs wired in | `src/app/pages/ClassDetail.jsx` |

## Deploy (one-time)

1. **Create a Daily.co account** → Developers → copy your **API key**. Note your
   subdomain (e.g. `deadlinemate` for `deadlinemate.daily.co`).

2. **Apply the migration** to your Supabase project:
   ```bash
   supabase db push
   # or run supabase/migrations/20260725000000_team_collab.sql in the SQL editor
   ```

3. **Deploy the edge function** and set its secrets:
   ```bash
   supabase functions deploy daily-room
   supabase secrets set DAILY_API_KEY=your_daily_api_key
   supabase secrets set DAILY_DOMAIN=your_subdomain   # optional fallback
   ```
   `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
   already available to edge functions.

4. **Ship the frontend** — `@daily-co/daily-js` is already in `package.json`;
   Vercel installs it on the next deploy. No new client env vars are needed.

## Cost

Daily.co has a free tier (participant-minutes/month); past that it's usage-based.
Chat, scheduling, history, and presence are on Supabase and cost nothing extra.
