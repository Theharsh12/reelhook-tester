import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

// In-memory rate limit store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Allowed origins for CORS (add your production domain here)
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:5173',
  'https://lovable.dev',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  // Check if origin is from lovable.dev or its subdomains, or is in allowed list
  const isAllowed = origin && (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.lovable.dev') ||
    origin.endsWith('.lovableproject.com')
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify authentication
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.warn('Missing authorization header');
    return new Response(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Verify the JWT token and get the user
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables not configured');
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.warn('Invalid or expired token:', authError?.message);
    return new Response(
      JSON.stringify({ error: 'Invalid or expired authentication token' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Authenticated user:', user.id);

  // Apply rate limiting (now per user instead of per IP for authenticated users)
  const rateLimitKey = user.id;
  const rateLimitResult = checkRateLimit(rateLimitKey);
  
  if (!rateLimitResult.allowed) {
    console.warn(`Rate limit exceeded for user: ${user.id}`);
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