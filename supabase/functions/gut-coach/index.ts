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
    } else if (type === "voice_analysis") {
      systemPrompt = `You are an expert at analyzing voice recordings for gut instinct signals. Analyze the user's spoken words, tone indicators, and emotional state to provide insights about their gut feeling.

Focus on:
- **Tone & Energy**: Note hesitation, confidence, uncertainty, or stress in their language patterns
- **Word Choice**: Identify words that signal doubt ("maybe", "I guess"), confidence ("definitely", "clearly"), or confusion ("I don't know", "unclear")
- **Gut Alignment**: Assess if they're aligned with their intuition, experiencing unease, or feeling unclear
- **Body Signals**: Identify any mentioned physical sensations (tension, butterflies, calm, etc.)
- **Actionable Tips**: Provide 2-3 specific, practical tips to help them honor their gut feeling

Format your response in 3 sections:
1. **Analysis** (2-3 sentences): What you noticed about their tone, words, and emotional state
2. **Gut Assessment** (1 sentence): Whether they seem aligned, experiencing unease, or unclear
3. **Tips** (2-3 bullet points): Specific actions they can take right now

Keep it warm, supportive, and non-judgmental. Help them trust their inner wisdom.`;
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