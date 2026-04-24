// Mints a real Supabase session for an MSX-launched user.
// 1) Re-verifies the MSX launch token server-side.
// 2) Finds-or-creates a local auth user mapped by msx_user_id.
// 3) Generates a magiclink, exchanges it for an access+refresh token via verifyOtp.
// 4) Validates the access token against /auth/v1/user before returning.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const MSX_API_BASE_URL = Deno.env.get("MSX_API_BASE_URL") ?? "https://lsoxtrynzaxohvlqxpqe.supabase.co/functions/v1/msx-api";
const MSX_TOKEN = Deno.env.get("MSX_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

type Stage =
  | "parse_input"
  | "msx_verify"
  | "find_or_create_user"
  | "generate_link"
  | "exchange_otp"
  | "validate_access_token";

function fail(stage: Stage, status: number, detail: unknown) {
  return new Response(
    JSON.stringify({ ok: false, stage, error: typeof detail === "string" ? detail : JSON.stringify(detail) }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // ---- 1. parse input ----
    const body = await req.json().catch(() => ({}));
    const token = body.token ?? body.launchToken;
    const appSlug = body.appSlug ?? body.slug ?? "hara";
    if (!token) return fail("parse_input", 400, "token required");

    // ---- 2. verify token with MSX ----
    const verifyRes = await fetch(`${MSX_API_BASE_URL}/v1/launch/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${MSX_TOKEN}` },
      body: JSON.stringify({ token, appSlug }),
    });
    const verifyData = await verifyRes.json().catch(() => ({}));
    if (!verifyRes.ok || verifyData?.accessMode !== "full") {
      return fail("msx_verify", verifyRes.status || 401, verifyData);
    }

    const msxUserId: string | undefined = verifyData.msxUserId ?? verifyData.userId ?? verifyData.viewerId;
    const msxEmail: string | undefined = verifyData.email;
    const stableId = msxUserId ?? `viewer-${verifyData.viewerId ?? crypto.randomUUID()}`;
    // Synthetic but stable email so a single MSX user always maps to the same auth account.
    const email = msxEmail ?? `msx_${stableId}@msx.hara.app`.toLowerCase();

    // ---- 3. find or create local user ----
    let userId: string | null = null;
    {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          msx_user_id: stableId,
          msx_app_slug: appSlug,
          msx_entitled: true,
          source: "msx",
        },
      });
      if (created?.user) {
        userId = created.user.id;
      } else if (createErr && /already (registered|exists)/i.test(createErr.message)) {
        // Fall back to lookup
        const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const found = list?.users?.find((u) => u.email?.toLowerCase() === email);
        if (!found) return fail("find_or_create_user", 500, createErr);
        userId = found.id;
      } else if (createErr) {
        return fail("find_or_create_user", 500, createErr);
      }
    }
    if (!userId) return fail("find_or_create_user", 500, "no user id");

    // ---- 4. generate magiclink ----
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr || !linkData) return fail("generate_link", 500, linkErr ?? "no link");
    const hashedToken: string | undefined = (linkData as any).properties?.hashed_token ?? (linkData as any).hashed_token;
    if (!hashedToken) return fail("generate_link", 500, "no hashed_token");

    // ---- 5. exchange OTP for a real session ----
    const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    const { data: otp, error: otpErr } = await anon.auth.verifyOtp({
      type: "magiclink",
      token_hash: hashedToken,
    });
    if (otpErr || !otp.session) return fail("exchange_otp", 500, otpErr ?? "no session");

    // ---- 6. validate access token works ----
    const userCheck = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${otp.session.access_token}`,
      },
    });
    if (!userCheck.ok) {
      return fail("validate_access_token", 500, await userCheck.text());
    }

    return new Response(
      JSON.stringify({
        ok: true,
        accessMode: "full",
        msxEntitled: true,
        userId,
        access_token: otp.session.access_token,
        refresh_token: otp.session.refresh_token,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return fail("parse_input", 500, String(e));
  }
});
