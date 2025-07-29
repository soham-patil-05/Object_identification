// supabase/functions/detect-objects/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function createResponse(body: any, status: number = 200): Response {
  return new Response(
    typeof body === 'string' ? body : JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  )
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
  }

  if (req.method !== 'POST') {
    return createResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    let requestBody
    try {
      requestBody = await req.json()
    } catch (parseError) {
      return createResponse({ error: 'Invalid JSON in request body' }, 400)
    }

    const { image } = requestBody
    if (!image) {
      return createResponse({ error: 'Image data is required' }, 400)
    }

    // Get Google API key from Deno environment
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!googleApiKey) {
      console.error('GOOGLE_API_KEY not set')
      return createResponse({ error: 'Server misconfiguration' }, 500)
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this image and identify the main object. Return a JSON with:
{
  "objectName": "…",
  "confidence": 0–100,
  "description": "…",
  "additionalInfo": ["…", "…", "…"]
}`,
                },
                {
                  inline_data: { 
                    mime_type: 'image/jpeg', 
                    data: image 
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
        }),
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error('Gemini API error:', errorText)
      return createResponse({ error: 'Failed to analyze image' }, 502)
    }

    const geminiData = await geminiResponse.json()
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!rawText) {
      return createResponse({ 
        error: 'No response from Gemini API',
        objectName: 'Unknown Object',
        confidence: 0,
        description: 'No analysis available',
        additionalInfo: []
      }, 200)
    }

    let result: any
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : rawText
      result = JSON.parse(jsonString)
    } catch (parseError) {
      result = {
        objectName: 'Unknown Object',
        confidence: 30,
        description: 'Could not parse AI response.',
        additionalInfo: [rawText.substring(0, 100) + '...'],
      }
    }

    const sanitizedResult = {
      objectName: result.objectName || 'Unknown Object',
      confidence: typeof result.confidence === 'number' ? 
        Math.max(0, Math.min(100, result.confidence)) : 50,
      description: result.description || '',
      additionalInfo: Array.isArray(result.additionalInfo) ? 
        result.additionalInfo : [],
    }

    return createResponse(sanitizedResult)

  } catch (error: any) {
    console.error('Handler error:', error)
    return createResponse({ 
      error: 'Internal server error',
      details: error.message 
    }, 500)
  }
})