# DeadlineMate — Deployment Guide

End-to-end steps to take this repo live: **Supabase** (database, auth, edge
functions, cron reminder engine) + **Vercel** (the SPA) + **Resend** (email) +
**Stripe** (billing) + **Web Push**.

Everything the app needs at runtime is listed in [`.env.example`](./.env.example).

---

## 0. Prerequisites (one-time)

```bash
npm i -g supabase        # Supabase CLI
npm i -g vercel          # Vercel CLI
npm install              # project deps
```

Accounts/keys to gather:

| Service  | Value | Where |
|----------|-------|-------|
| Supabase | Project ref, `anon` key, `service_role` key, DB password | Dashboard → Project Settings → API / Database |
| Supabase | Personal **access token** | Account → Access Tokens |
| Resend   | API key + a **verified sender domain** | resend.com → API Keys / Domains |
| Stripe   | Secret key, a recurring **Price** for Pro, webhook secret | dashboard.stripe.com |
| Google   | OAuth client id + secret (for "Sign in with Google") | console.cloud.google.com |

---

## 1. Database & schema

```bash
supabase login                       # paste your access token
supabase link --project-ref <PROJECT_REF>
supabase db push                     # applies everything in supabase/migrations
```

This creates all tables, RLS policies, the reminder-generation triggers, the
shared-class model, and schedules the pg_cron jobs.

---

## 2. Generate Web Push keys

```bash
npm run gen-vapid
```

Copy the printed `VITE_VAPID_PUBLIC_KEY` (frontend) and the
`VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` pair (functions, next step).

---

## 3. Edge-function secrets

Pick a long random `CRON_SECRET` (e.g. `openssl rand -hex 32`). Then:

```bash
supabase secrets set \
  CRON_SECRET="<random>" \
  APP_URL="https://deadlinemate.com" \
  RESEND_API_KEY="re_..." \
  EMAIL_FROM="DeadlineMate <reminders@deadlinemate.com>" \
  VAPID_PUBLIC_KEY="..." \
  VAPID_PRIVATE_KEY="..." \
  VAPID_SUBJECT="mailto:hello@deadlinemate.com" \
  STRIPE_SECRET_KEY="sk_live_or_test..." \
  STRIPE_WEBHOOK_SECRET="whsec_..." \
  STRIPE_PRICE_PRO="price_..."
```

> `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are
> injected into functions automatically — don't set them here.

Deploy the functions:

```bash
supabase functions deploy dispatch-reminders
supabase functions deploy import-calendar
supabase functions deploy sync-feeds
supabase functions deploy stripe-checkout
supabase functions deploy stripe-portal
supabase functions deploy stripe-webhook
```

---

## 4. Wire up the cron → function bridge

The dispatcher and daily sync run via `pg_cron`, which calls the edge functions
over HTTP. Give it the URL + secret by running
[`supabase/post-deploy.sql`](./supabase/post-deploy.sql) in the SQL editor
(replace `<PROJECT_REF>` and `<CRON_SECRET>` with the same values as above).

Verify:

```sql
select jobname, schedule, active from cron.job;   -- dm-dispatch-reminders (every min), dm-sync-feeds (daily)
select private.dm_dispatch_reminders();           -- manual smoke test
```

---

## 5. Auth configuration (Supabase dashboard)

- **Authentication → URL Configuration**
  - Site URL: `https://deadlinemate.com`
  - Redirect URLs: add `https://deadlinemate.com/app/auth/callback` and
    `http://localhost:5173/app/auth/callback`
- **Authentication → Providers → Google**: enable, paste client id/secret, and
  set the callback to `https://<PROJECT_REF>.supabase.co/auth/v1/callback` in
  the Google Cloud console.
- **Authentication → Email**: magic links work out of the box on Supabase's
  built-in mailer; for volume, plug Resend in as a custom SMTP sender.

---

## 6. Stripe

1. Create a **Product → Price** (recurring, £3.49/mo) → copy its `price_...` into
   `STRIPE_PRICE_PRO`.
2. Add a webhook endpoint pointing at
   `https://<PROJECT_REF>.supabase.co/functions/v1/stripe-webhook`, subscribing
   to `customer.subscription.*` and `checkout.session.completed`. Copy its
   signing secret into `STRIPE_WEBHOOK_SECRET`.
3. Test locally with `stripe listen --forward-to <url>` and `stripe trigger`.

---

## 7. Frontend on Vercel

```bash
vercel login
vercel link                          # link/create the project
```

Set the project's Environment Variables (Production + Preview):

```
VITE_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_APP_URL=https://deadlinemate.com
VITE_VAPID_PUBLIC_KEY=<public vapid key>
```

Deploy:

```bash
vercel --prod
```

Point the `deadlinemate.com` domain at Vercel (Vercel → Domains). CI
(`.github/workflows/ci.yml`) runs typecheck + build on every PR; Vercel's Git
integration auto-deploys `main` and gives preview URLs per PR.

---

## 8. Smoke test the whole loop

1. Sign in with Google / magic link → land on onboarding → dashboard.
2. Add a deadline due in ~3 minutes with a "1 hour"→ change offset to a value
   that fires soon (e.g. temporarily add a `1m`-style test), or insert a
   reminder row with `remind_at = now()`.
3. Watch `dispatch-reminders` logs (`supabase functions logs dispatch-reminders`)
   → you should receive the email.
4. Paste a real Canvas/Google Classroom `.ics` URL in **Import** → deadlines appear.
5. Create a shared class, copy the join code, join from another account.
6. Start the Pro trial → confirm `profiles.plan` flips to `pro` via the webhook.

---

## Architecture

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full system design, data model,
and the reasoning behind the reminder engine.
