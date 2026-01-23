import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    // Check database for payment status
    const { data: payment, error: paymentError } = await supabaseClient
      .from("user_payments")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .eq("payment_type", "lifetime")
      .maybeSingle();

    if (paymentError) {
      console.error("Database error:", paymentError);
      throw new Error("Failed to check payment status");
    }

    if (payment) {
      return new Response(JSON.stringify({ 
        paid: true, 
        payment_id: payment.id,
        created_at: payment.created_at 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If no database record, check Stripe directly
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      return new Response(JSON.stringify({ paid: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;

    // Check for completed checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 10,
    });

    const completedSession = sessions.data.find(
      (s: Stripe.Checkout.Session) => s.payment_status === "paid" && s.status === "complete"
    );

    if (completedSession) {
      // Store in database for future checks
      const { error: insertError } = await supabaseClient
        .from("user_payments")
        .insert({
          user_id: user.id,
          amount: completedSession.amount_total || 499,
          currency: completedSession.currency || "usd",
          status: "completed",
          payment_type: "lifetime",
          stripe_customer_id: customerId,
          stripe_session_id: completedSession.id,
        });

      if (insertError) {
        console.error("Failed to store payment:", insertError);
      }

      return new Response(JSON.stringify({ paid: true, synced: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ paid: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Check payment error:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
