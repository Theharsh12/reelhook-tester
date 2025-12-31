import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are an expert Instagram growth strategist.

Analyze the reel hook strictly.

Score from 0–100 based on:
1. Clarity in first 3 seconds
2. Curiosity gap
3. Emotional or problem trigger
4. Scroll-stopping potential

Rules:
- Be honest and strict
- No emojis except in strength label
- Use simple creator language
- Avoid AI or marketing jargon

You MUST respond with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "strength": "<Scroll-Past Risk 😬 | Needs Pattern Break ⚠️ | Scroll-Stopping 🔥 | Viral Potential 🚀>",
  "reasons": ["<clear reason 1>", "<clear reason 2>", "<clear reason 3>"],
  "suggestions": ["<short and punchy hook>", "<curiosity-driven hook>"]
}

Strength levels:
- Scroll-Past Risk 😬: 0-39
- Needs Pattern Break ⚠️: 40-59
- Scroll-Stopping 🔥: 60-79
- Viral Potential 🚀: 80-100

Keep reasons concise and direct. Make suggestions short, punchy, and specific to the hook.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { hook } = await req.json();
    
    // Validate input exists and is a string
    if (!hook || typeof hook !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Hook text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input length (server-side enforcement matching client-side limit)
    if (hook.length > 200 || hook.length < 1) {
      return new Response(
        JSON.stringify({ error: 'Hook must be between 1 and 200 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate trimmed content
    const trimmedHook = hook.trim();
    if (trimmedHook.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Hook cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing hook:', trimmedHook.substring(0, 50) + '...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this Instagram reel hook:\n\n"${trimmedHook}"` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      // Return generic error messages to avoid exposing internal details
      if (response.status === 429 || response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Unable to analyze hook. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response:', data);
      return new Response(
        JSON.stringify({ error: 'Unable to analyze hook. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response from the AI
    let analysis;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1].trim();
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      return new Response(
        JSON.stringify({ error: 'Unable to analyze hook. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analysis complete:', { score: analysis.score, strength: analysis.strength });

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-hook function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});