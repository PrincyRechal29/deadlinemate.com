import Stripe from "npm:stripe@17.5.0";

export const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(), // Deno-compatible HTTP client
});

export const APP_URL = Deno.env.get("APP_URL") ?? "https://deadlinemate.com";
export const STRIPE_PRICE_PRO = Deno.env.get("STRIPE_PRICE_PRO") ?? "";
export const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

/** Find or create the Stripe customer for a user, remembering it on subscriptions. */
export async function ensureCustomer(
  admin: { from: (t: string) => any },
  userId: string,
  email: string | null,
): Promise<string> {
  const { data: existing } = await admin
    .from("subscriptions")
    .select("provider_customer")
    .eq("user_id", userId)
    .eq("provider", "stripe")
    .maybeSingle();

  if (existing?.provider_customer) return existing.provider_customer;

  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: { supabase_user_id: userId },
  });
  return customer.id;
}
