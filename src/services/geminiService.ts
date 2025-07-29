import { DetectionResult } from '../App';

// API endpoint for object detection
const API_ENDPOINT = 'https://seeyvlypujlkffbujczu.supabase.co/functions/v1/detect-objects';

// Get your Supabase anon key from your project dashboard
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ;

export async function detectObject(imageDataUrl: string): Promise<DetectionResult> {
  try {
    // Convert data URL to base64
    const base64Data = imageDataUrl.split(',')[1];
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, // This was missing!
      },
      body: JSON.stringify({
        image: base64Data,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.objectName) {
      throw new Error('Could not identify the object. Please try with a clearer image.');
    }

    return {
      objectName: result.objectName,
      confidence: result.confidence || 0,
      description: result.description || 'No description available.',
      additionalInfo: result.additionalInfo || [],
    };
  } catch (error) {
    console.error('Detection error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to analyze the image. Please check your connection and try again.');
  }
}

// Fallback for development/demo purposes
export async function detectObjectDemo(imageDataUrl: string): Promise<DetectionResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Demo response - in production this would come from Gemini Vision API
  return {
    objectName: 'Coffee Mug',
    confidence: 87,
    description: 'A ceramic coffee mug, typically used for serving hot beverages like coffee, tea, or hot chocolate. This appears to be a standard-sized mug with a handle for easy gripping.',
    additionalInfo: [
      'Coffee mugs are usually made from ceramic, porcelain, or stoneware',
      'The handle design helps prevent burns from hot liquids',
      'Standard coffee mugs hold between 8-12 fluid ounces',
      'They can be decorated with various patterns, colors, or designs'
    ],
  };
}
