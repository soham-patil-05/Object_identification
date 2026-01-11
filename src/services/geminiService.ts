import { DetectionResult } from '../App';

const API_ENDPOINT ='https://zxeznbtalwepjgufqkqc.supabase.co/functions/v1/detect-objects';

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function detectObject(
  imageDataUrl: string
): Promise<DetectionResult> {
  try {
    const base64Data = imageDataUrl.split(',')[1];

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY, // correct header used here
      },
      body: JSON.stringify({ image: base64Data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Analysis failed: ${response.status}`);
    }

    const result = await response.json();

    return {
      objectName: result.objectName,
      confidence: result.confidence || 0,
      description: result.description || 'No description available.',
      additionalInfo: result.additionalInfo || [],
    };
  } catch (error) {
    console.error('Detection error:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to analyze image');
  }
}
