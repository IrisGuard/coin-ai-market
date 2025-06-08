
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const googleApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY') || Deno.env.get('GOOGLE_TRANSLATE_API_KEY_BACKUP');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, action, targetLang, sourceLang } = await req.json();

    if (!text || !action) {
      throw new Error('Missing required parameters: text and action');
    }

    if (!googleApiKey) {
      throw new Error('Google Translate API key not configured');
    }

    console.log(`Google Translate ${action}:`, { text, targetLang, sourceLang });

    if (action === 'detect') {
      // Language Detection
      const detectUrl = `https://translation.googleapis.com/language/translate/v2/detect?key=${googleApiKey}`;
      
      const detectResponse = await fetch(detectUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text
        }),
      });

      if (!detectResponse.ok) {
        throw new Error(`Google Detect API error: ${detectResponse.status} ${await detectResponse.text()}`);
      }

      const detectData = await detectResponse.json();
      const detectedLanguage = detectData.data.detections[0][0].language;
      const confidence = detectData.data.detections[0][0].confidence;

      console.log('Detected language:', detectedLanguage, 'confidence:', confidence);

      return new Response(JSON.stringify({
        language: detectedLanguage,
        confidence: confidence
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'translate') {
      // Translation
      const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`;
      
      const translateBody: any = {
        q: text,
        target: targetLang || 'en',
        format: 'text'
      };

      if (sourceLang) {
        translateBody.source = sourceLang;
      }

      const translateResponse = await fetch(translateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translateBody),
      });

      if (!translateResponse.ok) {
        throw new Error(`Google Translate API error: ${translateResponse.status} ${await translateResponse.text()}`);
      }

      const translateData = await translateResponse.json();
      const translatedText = translateData.data.translations[0].translatedText;
      const detectedSourceLanguage = translateData.data.translations[0].detectedSourceLanguage;

      console.log('Translation result:', { translatedText, detectedSourceLanguage });

      return new Response(JSON.stringify({
        translatedText: translatedText,
        detectedLanguage: detectedSourceLanguage || sourceLang,
        originalText: text,
        targetLanguage: targetLang || 'en'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Google Translate function error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Google Translate API integration failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
