# DeadlineMate — Product & System Guide

> The **as-built** reference for DeadlineMate: what it does, how it's wired, the
> full feature set, every user flow, and how the app's UI/sidebar is laid out.
> For the original design rationale see [`ARCHITECTURE.md`](./ARCHITECTURE.md);
> for step-by-step deploy instructions see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

---

## 1. What it is

DeadlineMate is a calm, mobile-first web app where a student's every assignment,
exam, and reminder lives in one place — ranked by urgency, with reliable
notifications so nothing slips. It turns a marketing landing page into a real,
deployed product.

**Live:** https://www.deadlinemate.com
**Backend:** Supabase (project `lclxkeppluqsfjenvrmh`) · **Hosting:** Vercel

**Status at a glance**

| Capability | State |
|---|---|
| Email magic-link login | ✅ live |
| Google login | ✅ enabled (publish consent screen to open to everyone) |
| Deadlines, courses, calendar, urgency ranking | ✅ live |
| Email reminder engine (cron dispatcher) | ✅ live, verified with a real send |
| LMS / iCal calendar import + daily re-sync | ✅ live |
| Shared class deadlines (join by code) | ✅ live |
| Web Push reminders | ✅ code live (per-device opt-in) |
| Stripe billing | ⏸️ deployed, off until keys added |
| Custom email domain (Resend) | ⏸️ using test sender until domain verified |

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite + React Router 7 + TanStack Query + Framer Motion |
| Styling | Tailwind v4 + a token-based "Magic Light" design system (CSS variables) |
| Auth | Supabase Auth — email magic-link + Google OAuth (PKCE) |
| Database | Supabase Postgres with Row Level Security on every table |
| Server logic | Supabase Edge Functions (Deno / TypeScript) |
| Scheduling | `pg_cron` + `pg_net` (DB → edge function over HTTP) |
| Email | Resend (REST API) |
| Push | Web Push (VAPID) + a service worker |
| Payments | Stripe (checkout + billing portal + webhooks) |
| Hosting / CDN | Vercel (SPA + rewrites); CI via GitHub Actions |

---

## 3. System architecture

```
┌─────────────────────────────── Browser (PWA) ───────────────────────────────┐
│  Marketing landing ( / )            Product SPA ( /app/* , code-split )       │
│  React + Framer Motion              React Router · TanStack Query · supabase-js│
│                                     Service worker (sw.js) for Web Push        │
└───────────────┬───────────────────────────────┬──────────────────────────────┘
                │ static assets                  │ supabase-js (REST + Auth + Realtime)
                ▼                                 ▼
        ┌──────────────┐            ┌──────────────────────────────────────────┐
        │   Vercel     │            │                 Supabase                 │
        │ CDN + SPA    │            │  Auth (magic-link + Google)               │
        │ rewrites     │            │  Postgres + Row Level Security            │
        └──────────────┘            │  Storage · Realtime                       │
                                    │                                           │
   Edge Functions (Deno) ──────────┤  dispatch-reminders   import-calendar     │
                                    │  sync-feeds           stripe-checkout     │
                                    │  stripe-portal        stripe-webhook      │
                                    │                                           │
   pg_cron ── every minute ───────▶│  → net.http_post → dispatch-reminders     │
           ── daily 06:00 ────────▶│  → net.http_post → sync-feeds             │
                                    └───────┬───────────────┬──────────────────┘
                                            │               │
                                            ▼               ▼
                                     Resend (email)   LMS iCal feeds
                                     Web Push (VAPID)  Stripe (billing)
```

**Design principle:** a solo founder can run this. No servers to babysit —
Supabase is the backend, Vercel hosts the app, and cron lives in the database.

---

## 4. Data model

Eleven tables, **all protected by Row Level Security** so a user can only ever
read/write their own rows (the DB, not the UI, is the security boundary).

| Table | Purpose |
|---|---|
| `profiles` | Mirror of `auth.users` + settings: `timezone`, `plan`, `reminder_offsets`, `reminder_channels`, `onboarded` |
| `courses` | Modules/classes with a colour, to group deadlines |
| `assignments` | The core object — assignments/exams/quizzes with `due_at` (UTC), `status`, `type`, `source` |
| `reminders` | Absolute UTC fire-times generated from an assignment's offsets |
| `calendar_imports` | Saved LMS/iCal feeds, re-synced daily |
| `push_subscriptions` | Web Push endpoints, one per device |
| `subscriptions` | Billing state mirrored from Stripe |
| `notification_log` | Audit trail of every send attempt |
| `shared_classes` | A shared class with a human `join_code` |
| `shared_class_members` | Membership + role (owner/editor/member) |
| `class_deadlines` | Deadlines shared to a class |

Key triggers/functions:
- **`on_auth_user_created`** → creates a `profiles` row the moment someone signs up.
- **`assignments_generate_reminders`** → (re)builds a deadline's reminders whenever its due date or status changes.
- **`dm_claim_due_reminders`** → atomically claims due reminders for the dispatcher (`FOR UPDATE SKIP LOCKED`).
- **`dm_join_class`** → join a shared class by its code (security-definer).

---

## 5. The reminder engine (the core that must never fail)

```
Add / edit a deadline
        │
        ▼
Trigger reads the owner's reminder_offsets (e.g. 1w, 1d, 3h) and channels (email/push)
        │  computes remind_at = due_at − offset  (UTC), skips any already in the past
        ▼
INSERT rows into `reminders` (status = 'pending')
        ┊
        ┊   ── every minute, pg_cron ──▶ dispatch-reminders (edge function)
        ▼
dm_claim_due_reminders(200):  pending → 'sending'  (atomic, skip-locked → no double-send)
        │
        ├─ email  → Resend, templated "Due tomorrow: Research essay"
        ├─ push   → Web Push to every device subscription (prunes dead endpoints)
        └─ sms    → skipped (Pro/Twilio, not wired)
        │
        ▼
success → status 'sent' + notification_log            failure → retry up to 3×, then 'failed'
```

- **Timezone-correct:** everything stored in UTC; formatted in the user's `timezone` for display and email.
- **Idempotent:** a reminder is only ever acted on once because claiming flips it out of `pending` before sending; a crashed run's `sending` rows are requeued after 10 minutes.

---

## 6. Full feature set

**Deadlines**
- Add/edit/delete assignments, exams, quizzes, readings, projects
- Due date & time, notes, priority (1–5 or auto), course + colour
- One-tap complete (with strike-through + "undo")
- Per-deadline view of exactly which reminders are scheduled

**Urgency ranking** — every deadline gets a tone shared across the whole UI:

| Tone | Meaning |
|---|---|
| 🔴 **Due now** | overdue or within 24 h |
| 🟠 **Soon** | within 3 days |
| ⚪ **This week** | within 7 days |
| 🟢 **Upcoming** | more than a week away |
| ✅ **Done** | completed |

**Views** — urgency-sorted dashboard with live stats (Active / Overdue / Due today / Completed) and filters (Active / Today / This week / Done / All); month **calendar** with colour-dot deadlines per day and a day drill-down.

**Courses** — colour-coded modules with an active-deadline count; deadlines inherit the course colour as a left border.

**LMS / calendar import** — paste a Canvas/Moodle/Blackboard/Google Classroom `.ics` link; events parse and upsert as deadlines (de-duped on the iCal UID), and saved feeds re-sync automatically every day. SSRF-guarded (https-only, no private hosts, size/time caps).

**Shared class deadlines** — create a class → get a shareable join code; classmates join by code and see the class's deadlines; pull any shared deadline into your own list (which then gets *your* personal reminders). Roles: owner / editor / member.

**Reminders & notifications** — choose when (1w / 3d / 1d / 3h / 1h before) and how (email always; push & SMS on Pro); enable Web Push per device; a "recent notifications" log.

**Billing (Pro)** — Free vs Pro (£3.49/mo, 14-day trial) with a Stripe checkout + billing portal; `profiles.plan` gates Pro-only channels. *(Off until Stripe keys are added.)*

**Auth & onboarding** — sign in with Google or an email magic link; first run captures name, timezone (auto-detected), and reminder timing.

---

## 7. Primary user flows

**First-time sign-up**
```
Landing (/) → "Get started" → /login → Google / magic link
   → /app/auth/callback → profile auto-created → /app/onboarding
   → (name · timezone · reminder timing) → /app dashboard
```

**Adding a deadline**
```
Dashboard → "New deadline" → title, due date/time, type, course, priority, notes
   → save → reminders auto-generated → appears ranked on dashboard & calendar
   → at each offset the dispatcher emails/pushes you
```

**Importing from an LMS**
```
Import → paste .ics feed URL (+ optional label/course) → "Import feed"
   → events parsed & upserted → daily auto re-sync → re-sync now button anytime
```

**Shared class**
```
Shared classes → Create → share the join code
Classmate → Join → enter code → sees class deadlines → "Add to mine" → personal copy + reminders
```

**Upgrade to Pro**
```
Settings → Plan & billing → "Start 14-day free trial" → Stripe checkout
   → webhook flips profiles.plan → 'pro' → push/SMS channels unlock
```

---

## 8. UI / UX — layout & sidebar

The product uses a **persistent left sidebar** (desktop) that collapses into a
hamburger **drawer** on screens ≤ 820 px. The main content is a centred column
(max ~1080 px) on a soft off-white canvas.

```
┌───────────────────┬───────────────────────────────────────────────────────┐
│  D  DeadlineMate   │                                                         │
│                    │   Hi Alex 👋                            [ + New deadline]│
│  ▸ Dashboard    ◀──┼── active tab: dark text on a soft tint                  │
│  ▸ Calendar        │   ┌──────────┬──────────┬──────────┬──────────┐         │
│  ▸ Courses         │   │ Active 7 │ Overdue 1│ Today 2  │ Done 12  │  stats  │
│  ▸ Shared classes  │   └──────────┴──────────┴──────────┴──────────┘         │
│  ▸ Import          │   [Active][Today][This week][Done][All]        filters  │
│  ▸ Settings        │   ● Research essay draft     Wed 5 Nov, 23:59  🔴 Due now│
│                    │   ● Physics problem set      Fri 7 Nov, 17:00  🟠 Soon   │
│  ✨ Upgrade to Pro │   ● Reading — Chapter 4       Mon 10 Nov        🟢 Upcoming│
│  ───────────────   │                                                         │
│  (A) Alex          │                                                         │
│      Free plan  ⎋  │                                                         │
└───────────────────┴───────────────────────────────────────────────────────┘
```

**Sidebar tabs (top → bottom)**

| Tab | Icon | Route | What it shows |
|---|---|---|---|
| **Dashboard** | ▤ layout | `/app` | Greeting, 4 stat tiles, urgency filters, ranked deadline list, "New deadline" |
| **Calendar** | 📅 | `/app/calendar` | Month grid with colour-dot deadlines per day + a today marker; click a day to list its deadlines |
| **Courses** | 📖 | `/app/courses` | Colour-coded course cards with active-deadline counts; create/delete |
| **Shared classes** | 👥 | `/app/classes` | Your classes; **Create** or **Join** by code; drill into a class to see & add shared deadlines |
| **Import** | ☁️⬇ | `/app/import` | Paste an iCal feed, manage connected feeds, re-sync now |
| **Settings** | ⚙️ | `/app/settings` | Profile, reminder timing & channels, per-device push toggle, plan, notification log |

**Sidebar footer**
- **✨ Upgrade to Pro** pill — shown only to free users, links to billing.
- **User chip** — avatar initial, display name, current plan, and a sign-out (⎋) button.

**Screens reachable outside the sidebar**
- **Assignment detail** (`/app/assignments/:id`) — full deadline with urgency badge, notes, scheduled-reminder list, edit / mark-done / delete. Opened by clicking any deadline row.
- **Billing** (`/app/settings/billing`) — Free vs Pro comparison, "Start trial" / "Manage subscription".
- **Onboarding** (`/app/onboarding`) — first-run setup gate.
- **Login** (`/login`) and **Auth callback** (`/app/auth/callback`).

**Deadline row anatomy** (used on Dashboard, Calendar day view, class list):
```
[○ complete]  Research essay draft                     in 2 days   🔴 Due now
              Psychology · Wed 5 Nov, 23:59
   ▲ round check toggle   ▲ title + course/date      ▲ relative  ▲ urgency badge
   left border = course colour
```

**Design system ("Magic Light")**
- White canvas washed by a soft **cyan aura**; one cyan brand accent used sparingly.
- **Geist** typeface; hairline borders; barely-there shadows; sharp, premium radii.
- Duolingo-style motion: springy button presses, pop-ins, an animated scroll progress bar.
- Fully **theme-aware** tokens (a `.dm-invert` scope flips any block to the dark variant).
- Urgency colours are consistent everywhere: critical red, high amber, medium grey, low green.

---

## 9. Edge functions

| Function | Trigger | Does |
|---|---|---|
| `dispatch-reminders` | pg_cron, every minute | Claims due reminders, sends email/push, records outcome |
| `import-calendar` | User (from Import page) | Fetches + parses an iCal feed, upserts deadlines, saves the feed |
| `sync-feeds` | pg_cron, daily 06:00 | Re-polls every auto-sync feed |
| `stripe-checkout` | User | Creates a Checkout session (14-day trial) |
| `stripe-portal` | User | Opens the Stripe billing portal |
| `stripe-webhook` | Stripe | Verifies signature, mirrors subscription state → `subscriptions` + `profiles.plan` |

Shared modules: `_shared/supabase.ts` (admin/user clients), `notify.ts` (Resend +
Web Push), `ical.ts` (dependency-free RFC 5545 parser), `fetchFeed.ts` (SSRF-guarded
fetch), `stripe.ts`, `cors.ts`.

---

## 10. Security

- **RLS on all 11 tables** — every policy keys off `auth.uid()`; shared-class reads go through security-definer membership checks.
- **Service-role key** is used *only* inside edge functions, never shipped to the browser.
- **Stripe webhooks** are signature-verified before any DB write.
- **Import endpoint** is SSRF-hardened: https-only, blocks localhost/private/link-local hosts, 5 MB + 12 s caps.
- **Secrets** live in Supabase function secrets and Vercel env vars — never committed (`.env*` is gitignored).

---

## 11. Repository map

```
src/
  App.jsx                     marketing landing page
  main.jsx                    router + providers (product routes are code-split)
  app/
    AppShell.jsx              sidebar + layout
    RequireAuth.jsx           auth gate
    lib/                      supabase client, AuthProvider, api hooks, dates, urgency, push
    components/               Modal, AssignmentForm, DeadlineItem, ui primitives
    pages/                    Login, Onboarding, Dashboard, CalendarPage, Courses,
                              AssignmentDetail, ImportPage, Classes, ClassDetail,
                              Settings, Billing, AuthCallback
supabase/
  migrations/                6 SQL migrations (schema, reminder engine, shared classes, RLS, cron, claim)
  functions/                 6 edge functions + _shared
  post-deploy.sql            cron ↔ function wiring
public/sw.js                 Web Push service worker
vercel.json                  SPA rewrites + headers
```
