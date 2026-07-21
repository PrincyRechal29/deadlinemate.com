import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.48.1";

/** Service-role client — bypasses RLS. Use only in trusted server paths. */
export function adminClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

/**
 * A client scoped to the caller's JWT — RLS applies as that user. Used by
 * user-invoked functions (import-calendar, stripe-checkout) so we act as them.
 */
export function userClient(req: Request): SupabaseClient {
  const authHeader = req.headers.get("Authorization") ?? "";
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

/** Resolve the authenticated user from the request's JWT, or null. */
export async function getUser(req: Request) {
  const supabase = userClient(req);
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
