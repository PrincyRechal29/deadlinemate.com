// ============================================================================
// stripe-portal — open the Stripe billing portal so a user can manage or
// cancel their subscription.
// ============================================================================
import { adminClient, getUser } from "../_shared/supabase.ts";
import { json, preflight } from "../_shared/cors.ts";
import { APP_URL, stripe } from "../_shared/stripe.ts";

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const user = await getUser(req);
  if (!user) return json({ error: "unauthorized" }, 401);

  const admin = adminClient();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("provider_customer")
    .eq("user_id", user.id)
    .eq("provider", "stripe")
    .maybeSingle();

  if (!sub?.provider_customer) return json({ error: "no billing account yet" }, 404);

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.provider_customer,
    return_url: `${APP_URL}/app/settings/billing`,
  });

  return json({ url: session.url });
});
