import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const MSX_API_BASE_URL = Deno.env.get("MSX_API_BASE_URL") ?? "https://lsoxtrynzaxohvlqxpqe.supabase.co/functions/v1/msx-api";
const MSX_TOKEN = Deno.env.get("MSX_TOKEN")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { launchToken, slug } = await req.json();
    if (!launchToken || !slug) {
      return new Response(JSON.stringify({ error: "launchToken and slug required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(`${MSX_API_BASE_URL}/v1/launch/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MSX_TOKEN}`,
      },
      body: JSON.stringify({ launchToken, slug, credential: MSX_TOKEN }),
    });

    const data = await res.json().catch(() => ({}));
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
