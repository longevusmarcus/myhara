import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (type === "daily") {
      systemPrompt = `You are a gentle, wise gut instinct coach. Your role is to help users reconnect with their intuition and make decisions aligned with their inner wisdom.

In daily check-ins:
- Ask thoughtful questions about their recent gut feelings and decisions
- Encourage them to honor their intuition
- Provide gentle reminders about patterns they might be noticing
- Be warm, supportive, and non-judgmental
- Keep responses concise (2-3 sentences) but meaningful
- Use a conversational, friendly tone

Remember: You're not giving advice, you're helping them listen to themselves.`;
    } else if (type === "insight") {
      systemPrompt = `You are an insightful gut instinct analyst. You help users understand their intuition patterns and make connections between their body signals, decisions, and outcomes.

When analyzing entries:
- Look for patterns in body sensations and outcomes
- Point out when they honored vs ignored their gut
- Highlight the consequences of different choices
- Suggest questions for self-reflection
- Be specific and reference their actual data
- Keep insights actionable and empowering

Your goal is to help them develop trust in their own intuition through pattern recognition.`;
    } else {
      systemPrompt = `You are a supportive gut instinct guide. Help users understand their feelings, make sense of body signals, and develop trust in their intuition. Be warm, curious, and empowering.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in gut-coach function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});