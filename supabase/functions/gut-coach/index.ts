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
    } else if (type === "daily_guidance") {
      systemPrompt = `You are a wise gut instinct coach analyzing a user's check-in history. Based on their recent entries, provide personalized daily guidance.

Analyze their patterns:
- Recent gut feelings (aligned, unease, unclear)
- Decisions they made and outcomes
- Body sensations they reported
- How often they honor vs ignore their gut

Provide your response in this format:

**Today's Guidance**
[2-3 sentences of warm, actionable guidance based on their recent patterns]

**What I'm Noticing**
[1-2 observations about patterns in their gut feelings and decisions]

**Try This Today**
[One specific, practical exercise they can do today to strengthen their gut connection]

Be warm, specific, and reference their actual data. Help them trust their intuition more.`;
    } else if (type === "pattern_analysis") {
      systemPrompt = `You are an expert intuition pattern analyst. Analyze the user's gut feeling check-ins and identify 2-3 meaningful patterns.

For each pattern, provide:
- title: Clear, concise name (3-6 words)
- observation: What you notice in their behavior (2-3 sentences)
- intuitionGuide: Specific, actionable advice on what to do about it (2-3 sentences)
- relatedEntries: 1-3 short entry excerpts that show this pattern
- questions: 2-3 reflection questions
`;
    } else if (type === "voice_analysis") {
      systemPrompt = `You are an expert at analyzing voice recordings for gut instinct signals. Analyze the user's spoken words, tone indicators, and emotional state to provide insights about their gut feeling.

Analyze:
- **Tone & Energy**: Identify hesitation, confidence, uncertainty, stress, or conflict in their speech patterns
- **Word Choice**: Note words signaling doubt ("maybe", "I guess", "I don't know"), confidence ("definitely", "clearly"), or confusion
- **Gut vs Logic Conflict**: Distinguish between what their gut is saying vs. what their rational mind is saying
- **Body/Emotional Signals**: Any mentioned physical sensations or emotional states

Provide your response in this EXACT format with markdown:

**Analysis**
[2-3 sentences about their tone, word patterns, and emotional state]

**What Your Gut Is Saying**
[1-2 clear sentences stating what their intuition is actually telling them, separate from logic]

**Actionable Tips**
• [Specific action they can take right now - be concrete]
• [Another specific, practical step - reference their actual situation]
• [Final tip focused on honoring their gut feeling]

Keep it warm, direct, and practical. Help them distinguish gut feeling from rational thought, and give them clear next steps.`;
    } else {
      systemPrompt = `You are a supportive gut instinct guide. Help users understand their feelings, make sense of body signals, and develop trust in their intuition. Be warm, curious, and empowering.`;
    }

    // Special handling for pattern_analysis: use function calling (tools) and return structured JSON
    if (type === "pattern_analysis") {
      const body: any = {
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: false,
        tools: [
          {
            type: "function",
            function: {
              name: "return_patterns",
              description: "Return 2-3 pattern cards with observation, actionable guidance, related entry excerpts, and reflection questions.",
              parameters: {
                type: "object",
                properties: {
                  patterns: {
                    type: "array",
                    minItems: 2,
                    maxItems: 3,
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        observation: { type: "string" },
                        intuitionGuide: { type: "string" },
                        relatedEntries: { type: "array", items: { type: "string" } },
                        questions: { type: "array", items: { type: "string" } }
                      },
                      required: ["title", "observation", "intuitionGuide", "relatedEntries", "questions"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["patterns"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_patterns" } }
      };

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!aiResp.ok) {
        if (aiResp.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResp.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Usage." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await aiResp.text();
        console.error("AI gateway error (pattern_analysis):", aiResp.status, t);
        return new Response(JSON.stringify({ error: "AI service error" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const aiData = await aiResp.json();

      let patterns: unknown = null;
      try {
        const toolCalls = aiData?.choices?.[0]?.message?.tool_calls;
        if (toolCalls && toolCalls.length > 0) {
          const argsStr = toolCalls[0]?.function?.arguments;
          const args = JSON.parse(argsStr);
          patterns = args.patterns;
        } else {
          const content = aiData?.choices?.[0]?.message?.content;
          if (typeof content === "string") {
            patterns = JSON.parse(content);
          }
        }
      } catch (e) {
        console.error("Pattern parse error:", e);
      }

      if (!Array.isArray(patterns)) {
        return new Response(JSON.stringify({ error: "Could not extract patterns" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(patterns), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default: stream responses (daily, insight, daily_guidance, voice_analysis, etc.)
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