import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image, targetLanguage = 'en' } = await req.json();
    
    if (!image) {
      throw new Error('No image provided for OCR analysis');
    }

    console.log('🔤 Multi-Language OCR Processing Started');
    console.log('Target Language:', targetLanguage);

    const startTime = Date.now();
    
    // Phase 1: OCR Text Extraction with Claude AI (supports all languages)
    const ocrResults = await performAdvancedOCR(image);
    
    // Phase 2: Language Detection
    const detectedLanguages = await detectLanguages(ocrResults.extractedText);
    
    // Phase 3: Translation to English (if needed)
    const translationResults = await translateToEnglish(ocrResults.extractedText, detectedLanguages);
    
    // Phase 4: Save to Database
    await saveCoinInscriptions(image, ocrResults, detectedLanguages, translationResults);
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ Multi-Language OCR Complete');
    console.log('Languages Detected:', detectedLanguages);
    console.log('Processing Time:', processingTime + 'ms');

    return new Response(JSON.stringify({
      success: true,
      ocr_results: {
        original_text: ocrResults.extractedText,
        detected_languages: detectedLanguages,
        english_translation: translationResults.translatedText,
        confidence_score: ocrResults.confidence,
        processing_time: processingTime
      },
      supported_languages: [
        'arabic', 'chinese', 'japanese', 'korean', 'russian', 'greek', 
        'persian', 'hindi', 'thai', 'hebrew', 'cyrillic', 'latin'
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Multi-Language OCR Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Multi-Language OCR failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Advanced OCR using Claude AI (supports all scripts)
async function performAdvancedOCR(image: string) {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  
  const ocrPrompt = `
You are an advanced OCR system that can read text in ANY language or script. 
Analyze this coin image and extract ALL visible text, inscriptions, numbers, and symbols.

IMPORTANT: 
- Extract text in its ORIGINAL language/script (Arabic, Chinese, Cyrillic, etc.)
- Include dates, numbers, symbols, even partial or worn text
- If text is unclear, indicate with [unclear] but still provide your best guess
- List each piece of text on a separate line
- Include position information if possible (top, bottom, left, right, center)

Respond in this format:
{
  "extracted_text": ["line 1", "line 2", "etc"],
  "text_positions": {"top": "text at top", "bottom": "text at bottom"},
  "numbers_found": ["1975", "50", "etc"],
  "symbols_found": ["★", "crescents", "etc"],
  "script_types": ["latin", "arabic", "chinese", "etc"],
  "confidence": 0.85,
  "notes": "Any additional observations"
}
`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: [{
          type: 'text',
          text: ocrPrompt
        }, {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: image
          }
        }]
      }]
    })
  });

  const result = await response.json();
  const content = result.content[0]?.text;
  
  let ocrData;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    ocrData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
  } catch {
    ocrData = {
      extracted_text: [],
      confidence: 0.3,
      notes: 'OCR parsing failed'
    };
  }

  return {
    extractedText: ocrData.extracted_text?.join(' ') || '',
    confidence: ocrData.confidence || 0.5,
    details: ocrData
  };
}

// Detect languages in extracted text
async function detectLanguages(text: string) {
  if (!text || text.trim().length === 0) {
    return ['unknown'];
  }

  try {
    // Use Google Translate API for language detection
    const googleApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
    
    if (!googleApiKey) {
      console.warn('Google Translate API key not configured, using basic detection');
      return detectLanguageBasic(text);
    }

    const detectUrl = `https://translation.googleapis.com/language/translate/v2/detect?key=${googleApiKey}`;
    
    const response = await fetch(detectUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text })
    });

    if (response.ok) {
      const data = await response.json();
      const detectedLanguage = data.data.detections[0][0].language;
      const confidence = data.data.detections[0][0].confidence;
      
      console.log('Language detected:', detectedLanguage, 'confidence:', confidence);
      return [detectedLanguage];
    }
  } catch (error) {
    console.warn('Google language detection failed:', error);
  }

  return detectLanguageBasic(text);
}

// Basic language detection fallback
function detectLanguageBasic(text: string) {
  const arabicPattern = /[\u0600-\u06FF]/;
  const chinesePattern = /[\u4e00-\u9fff]/;
  const russianPattern = /[\u0400-\u04FF]/;
  const greekPattern = /[\u0370-\u03FF]/;
  const hebrewPattern = /[\u0590-\u05FF]/;
  
  if (arabicPattern.test(text)) return ['ar'];
  if (chinesePattern.test(text)) return ['zh'];
  if (russianPattern.test(text)) return ['ru'];
  if (greekPattern.test(text)) return ['el'];
  if (hebrewPattern.test(text)) return ['he'];
  
  return ['en']; // Default to English
}

// Translate text to English
async function translateToEnglish(text: string, detectedLanguages: string[]) {
  if (!text || detectedLanguages.includes('en') || detectedLanguages.includes('unknown')) {
    return { translatedText: text, originalLanguage: 'en' };
  }

  try {
    const googleApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
    
    if (!googleApiKey) {
      console.warn('Google Translate API key not configured');
      return { translatedText: text, originalLanguage: detectedLanguages[0] };
    }

    const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`;
    
    const response = await fetch(translateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: 'en',
        source: detectedLanguages[0]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      console.log('Translation successful:', text, '->', translatedText);
      return { 
        translatedText, 
        originalLanguage: detectedLanguages[0] 
      };
    }
  } catch (error) {
    console.warn('Translation failed:', error);
  }

  return { translatedText: text, originalLanguage: detectedLanguages[0] };
}

// Save OCR results to database
async function saveCoinInscriptions(
  image: string, 
  ocrResults: any, 
  detectedLanguages: string[], 
  translationResults: any
) {
  const imageHash = generateImageHash(image);
  
  try {
    await supabase
      .from('coin_inscriptions')
      .insert({
        image_hash: imageHash,
        original_language: detectedLanguages[0] || 'unknown',
        original_text: ocrResults.extractedText,
        english_translation: translationResults.translatedText,
        confidence_score: ocrResults.confidence,
        ocr_engine: 'claude-ai',
        translation_engine: 'google-translate'
      });

    console.log('✅ OCR results saved to database');
  } catch (error) {
    console.warn('⚠️ Failed to save OCR results:', error);
  }
}

function generateImageHash(image: string): string {
  return `ocr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}