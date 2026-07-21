// ============================================================================
// stripe-webhook — receive Stripe events, verify their signature, and mirror
// subscription state into public.subscriptions + public.profiles.plan.
// This is the source of truth for what a user is entitled to.
// ============================================================================
import { adminClient } from "../_shared/supabase.ts";
import { json } from "../_shared/cors.ts";
import { STRIPE_WEBHOOK_SECRET, stripe } from "../_shared/stripe.ts";
import type Stripe from "npm:stripe@17.5.0";

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  if (!sig || !STRIPE_WEBHOOK_SECRET) return json({ error: "unsigned" }, 400);

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ error: `signature verification failed: ${msg}` }, 400);
  }

  const admin = adminClient();

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.trial_will_end":
      case "customer.subscription.deleted": {
        await syncSubscription(admin, event.data.object as Stripe.Subscription);
        break;
      }
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.subscription) {
          const sub = await stripe.subscriptions.retrieve(s.subscription as string);
          await syncSubscription(admin, sub);
        }
        break;
      }
      default:
        // Ignore unhandled event types.
        break;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("webhook handler error:", msg);
    return json({ error: msg }, 500);
  }

  return json({ received: true });
});

async function syncSubscription(
  admin: ReturnType<typeof adminClient>,
  sub: Stripe.Subscription,
) {
  // Resolve the Supabase user: prefer metadata, fall back to the customer map.
  let userId = sub.metadata?.supabase_user_id as string | undefined;
  if (!userId) {
    const customer = await stripe.customers.retrieve(sub.customer as string);
    if (customer && !customer.deleted) {
      userId = (customer.metadata as Record<string, string>)?.supabase_user_id;
    }
  }
  if (!userId) {
    console.error("no supabase_user_id for subscription", sub.id);
    return;
  }

  const active = ["active", "trialing"].includes(sub.status);
  const priceId = sub.items.data[0]?.price?.id ?? null;

  await admin.from("subscriptions").upsert({
    user_id: userId,
    provider: "stripe",
    provider_customer: sub.customer as string,
    provider_sub: sub.id,
    price_id: priceId,
    plan: "pro",
    status: sub.status,
    cancel_at_period_end: sub.cancel_at_period_end,
    current_period_end: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null,
    trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
  }, { onConflict: "provider_sub" });

  // Entitlement mirror: profiles.plan drives feature gating in the UI + RLS-safe reads.
  await admin.from("profiles")
    .update({ plan: active ? "pro" : "free" })
    .eq("id", userId);
}
