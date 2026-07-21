// ============================================================================
// stripe-checkout — create a Stripe Checkout session for the Pro plan with a
// 14-day trial, tied to the authenticated user's Stripe customer.
// ============================================================================
import { adminClient, getUser } from "../_shared/supabase.ts";
import { json, preflight } from "../_shared/cors.ts";
import { APP_URL, ensureCustomer, STRIPE_PRICE_PRO, stripe } from "../_shared/stripe.ts";

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const user = await getUser(req);
  if (!user) return json({ error: "unauthorized" }, 401);
  if (!STRIPE_PRICE_PRO) return json({ error: "billing not configured" }, 500);

  const admin = adminClient();
  const customer = await ensureCustomer(admin, user.id, user.email ?? null);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer,
    line_items: [{ price: STRIPE_PRICE_PRO, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { supabase_user_id: user.id },
    },
    allow_promotion_codes: true,
    success_url: `${APP_URL}/app/settings/billing?checkout=success`,
    cancel_url: `${APP_URL}/app/settings/billing?checkout=cancelled`,
    metadata: { supabase_user_id: user.id },
  });

  return json({ url: session.url });
});
