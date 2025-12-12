// analyze-conversation-safety Edge Function
// Dedicated function for analyzing message safety

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SafetyAnalysisRequest {
  message: string;
  context?: {
    childAge?: number;
    previousFlags?: string[];
  };
}

interface SafetyAnalysisResponse {
  level: 'green' | 'yellow' | 'red';
  flags: string[];
  explanation: string;
  recommended_action: 'ignore' | 'monitor' | 'alert_parent';
  confidence: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request
    const { message, context }: SafetyAnalysisRequest = await req.json();

    if (!message) {
      throw new Error('Missing required field: message');
    }

    // Perform AI-powered safety analysis
    const safetyResult = await analyzeSafety(message, context);

    return new Response(JSON.stringify(safetyResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in analyze-conversation-safety:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function analyzeSafety(
  message: string,
  context?: { childAge?: number; previousFlags?: string[] }
): Promise<SafetyAnalysisResponse> {
  const age = context?.childAge || 8;
  const previousFlags = context?.previousFlags || [];

  const safetyPrompt = `You are a child safety expert analyzing messages for age-appropriateness and safety concerns.

ANALYZE THIS MESSAGE from a ${age}-year-old child:
"${message}"

${previousFlags.length > 0 ? `PREVIOUS CONCERNS: ${previousFlags.join(', ')}` : ''}

EVALUATE FOR:
1. **Inappropriate Language**: Profanity, slurs, offensive words
2. **Off-Topic Content**: Violence, weapons, adult themes, inappropriate requests
3. **Manipulation Attempts**: Trying to bypass safety, roleplaying harmful scenarios
4. **Emotional Distress**: Self-harm mentions, severe sadness, fear, bullying
5. **Personal Information**: Attempts to share address, phone, school details
6. **Testing Boundaries**: Asking about age limits, trying to trick the AI

RETURN ONLY VALID JSON:
{
  "level": "green|yellow|red",
  "flags": ["bad_word", "violence", "manipulation", "distress", "personal_info", "testing"],
  "explanation": "1-2 sentence explanation of why this was flagged",
  "recommended_action": "ignore|monitor|alert_parent",
  "confidence": 0.95
}

SEVERITY GUIDELINES:
- **GREEN (Safe)**: Age-appropriate, friendly conversation about interests, family, school, hobbies, games, animals, etc.
- **YELLOW (Monitor)**: Minor concerns like mild testing boundaries, borderline language, slight frustration. Pattern worth watching but not alarming.
- **RED (Alert Parent)**: Serious concerns requiring immediate attention:
  * Explicit profanity or slurs
  * Discussion of violence, self-harm, or illegal activities
  * Clear manipulation attempts or trying to break safety rules
  * Signs of severe distress, abuse, or danger
  * Sharing personal information (address, phone, etc.)

BE CONTEXTUAL: A child saying "I'm sad" is normal (yellow at most). Repeatedly discussing self-harm is red.

BE AGE-APPROPRIATE: Younger children may use made-up "bad words" playfully. Focus on actual safety concerns.`;

  try {
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yoluno.app',
        'X-Title': 'Yoluno Safety Analysis',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp',
        messages: [{ role: 'user', content: safetyPrompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3, // Lower temperature for consistent safety analysis
      }),
    });

    if (!openRouterResponse.ok) {
      console.error('OpenRouter API error:', openRouterResponse.statusText);
      // Fallback to conservative safe default
      return {
        level: 'yellow',
        flags: ['api_error'],
        explanation: 'Safety analysis unavailable, flagging for review',
        recommended_action: 'monitor',
        confidence: 0.5,
      };
    }

    const data = await openRouterResponse.json();
    const text = data.choices[0].message.content;

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    // Validate response structure
    if (!result.level || !['green', 'yellow', 'red'].includes(result.level)) {
      throw new Error('Invalid safety level in response');
    }

    return {
      level: result.level,
      flags: Array.isArray(result.flags) ? result.flags : [],
      explanation: result.explanation || 'No explanation provided',
      recommended_action: result.recommended_action || 'monitor',
      confidence: result.confidence || 0.8,
    };
  } catch (parseError) {
    console.error('Error parsing safety analysis:', parseError);
    // Conservative fallback
    return {
      level: 'yellow',
      flags: ['parse_error'],
      explanation: 'Unable to parse safety analysis, flagging for review',
      recommended_action: 'monitor',
      confidence: 0.5,
    };
  }
}
