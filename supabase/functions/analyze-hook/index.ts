import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const DEMO_MODE = false; 


// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:5173',
  'https://lovable.dev',
  'https://reelhook-tester.netlify.app',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  // Check if origin is from lovable.dev, lovable.app, or is in allowed list
  const isAllowed = origin && (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.lovable.dev') ||
    origin.endsWith('.lovableproject.com') ||
    origin.endsWith('.lovable.app') ||
    origin.endsWith('.netlify.app')
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function getClientIP(req: Request): string {
  // Try various headers used by proxies/load balancers
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback to a default identifier
  return 'unknown';
}

function checkRateLimit(clientIP: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(clientIP);
  
  // Clean up expired entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now > data.resetTime) {
        rateLimitStore.delete(ip);
      }
    }
  }
  
  if (!record || now > record.resetTime) {
    // New window - reset counter
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Increment counter
  record.count++;
  return { allowed: true };
}

const systemPrompt = `You are a brutally honest Instagram Reel Hook Coach.

Your job is NOT to be polite. Your job is to decide whether a viewer will STOP or SCROLL within the first 2–3 seconds.

Think like a short-form content creator, a viewer with low attention span, someone who has seen 1,000 reels today.

STRICT RULES:
- No AI, marketing, or technical jargon
- Talk like a real creator, not a tool
- Be blunt but helpful
- Assume the hook is spoken in the first line of a reel
- If it's weak, say it clearly

ANALYZE BASED ON:
1. First-3-second clarity
2. Curiosity gap
3. Relatability or pain
4. Scroll-stopping power

You MUST respond with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "verdict": "<🚫 Likely to be Scrolled | ⚠️ Weak Stopper | 🔥 Scroll-Stopping | 🚀 Viral-Ready>",
  "brutalTruth": ["<reason 1 no emoji>", "<reason 2 no emoji>", "<reason 3 no emoji>"],
  "whatsMissing": "<one short sentence>",
  "beforeAfter": {
    "original": "<the original hook>",
    "improved": "<scroll-stopping, specific, curiosity-driven rewrite>"
  },
  "hookVariations": {
    "pain": "<under 12 words>",
    "curiosity": "<under 12 words>",
    "relatable": "<under 12 words>"
  },
  "whenToUse": "<one short line explaining best use case>",
  "commonMistake": "<one warning starting with ⚠️>"
}

Score mapping:
- 🚫 Likely to be Scrolled: 0-39
- ⚠️ Weak Stopper: 40-59
- 🔥 Scroll-Stopping: 60-79
- 🚀 Viral-Ready: 80-100

Be specific to the given hook. Sound like a creator coach, not software.`;

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Apply rate limiting per IP for unauthenticated requests
  const clientIP = getClientIP(req);
  const rateLimitResult = checkRateLimit(clientIP);
  
  console.log('Request from IP:', clientIP);
  
  if (!rateLimitResult.allowed) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      { 
        status: 429, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': String(rateLimitResult.retryAfter || 60)
        } 
      }
    );
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
    
    if (DEMO_MODE) {
      const fakeScore = Math.floor(55 + Math.random() * 30);

      const demoResponse = {
        score: fakeScore,
        verdict:
          fakeScore < 40
            ? "🚫 Likely to be Scrolled"
            : fakeScore < 60
            ? "⚠️ Weak Stopper"
            : fakeScore < 80
            ? "🔥 Scroll-Stopping"
            : "🚀 Viral-Ready",
        brutalTruth: [
          "Hook is clear but lacks a strong curiosity gap",
          "First line doesn't create enough urgency",
          "Could be more specific to the viewer's pain"
        ],
        whatsMissing: "A pattern interrupt that makes viewers feel called out.",
        beforeAfter: {
          original: trimmedHook,
          improved: "Stop posting reels until you fix this one thing"
        },
        hookVariations: {
          pain: "This one mistake is killing your reel reach",
          curiosity: "I found out why my reels never got views",
          relatable: "POV: You just realized your hooks are boring"
        },
        whenToUse: "Best for educational content about content creation or social media growth.",
        commonMistake: "⚠️ Don't start with 'I' or make it about you—make it about THEM."
      };

      return new Response(JSON.stringify(demoResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    console.log('Analysis complete:', { score: analysis.score, verdict: analysis.verdict });

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
