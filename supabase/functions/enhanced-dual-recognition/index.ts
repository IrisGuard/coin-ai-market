
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images, analysisType = 'comprehensive' } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'No images provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Analyze primary image with Claude
    const claudeAnalysis = await analyzeWithClaude(images[0], analysisType);
    
    // Analyze with GPT for comparison
    const gptAnalysis = await analyzeWithGPT(images[0], analysisType);
    
    // Merge and validate results
    const mergedAnalysis = mergeAnalysisResults(claudeAnalysis, gptAnalysis);
    
    // Analyze additional images if provided
    const additionalAnalyses = [];
    if (images.length > 1) {
      for (let i = 1; i < Math.min(images.length, 5); i++) {
        try {
          const additionalAnalysis = await analyzeWithClaude(images[i], 'detail');
          additionalAnalyses.push({
            imageIndex: i,
            analysis: additionalAnalysis,
            imageType: i === 1 ? 'reverse' : `detail_${i-1}`
          });
        } catch (error) {
          console.error(`Failed to analyze image ${i}:`, error);
        }
      }
    }

    const finalResult = {
      success: true,
      primary_analysis: mergedAnalysis,
      additional_analyses: additionalAnalyses,
      total_images_analyzed: 1 + additionalAnalyses.length,
      processing_metadata: {
        claude_confidence: claudeAnalysis.confidence,
        gpt_confidence: gptAnalysis.confidence,
        merged_confidence: mergedAnalysis.confidence,
        analysis_type: analysisType,
        timestamp: new Date().toISOString()
      }
    };

    return new Response(
      JSON.stringify(finalResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Enhanced dual recognition error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Analysis failed',
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

async function analyzeWithClaude(imageData: string, analysisType: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageData.replace(/^data:image\/[a-z]+;base64,/, '')
            }
          },
          {
            type: 'text',
            text: getCoinAnalysisPrompt(analysisType)
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  const analysis = JSON.parse(data.content[0].text);
  
  return {
    ...analysis,
    ai_provider: 'claude-3-sonnet',
    confidence: analysis.confidence || 0.75
  };
}

async function analyzeWithGPT(imageData: string, analysisType: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: imageData
            }
          },
          {
            type: 'text',
            text: getCoinAnalysisPrompt(analysisType)
          }
        ]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const analysis = JSON.parse(data.choices[0].message.content);
  
  return {
    ...analysis,
    ai_provider: 'gpt-4o',
    confidence: analysis.confidence || 0.70
  };
}

function mergeAnalysisResults(claudeResult: any, gptResult: any) {
  const confidence = (claudeResult.confidence + gptResult.confidence) / 2;
  
  return {
    name: claudeResult.name || gptResult.name || 'Unknown Coin',
    year: claudeResult.year || gptResult.year || new Date().getFullYear(),
    country: claudeResult.country || gptResult.country || 'Unknown',
    denomination: claudeResult.denomination || gptResult.denomination || 'Unknown',
    composition: claudeResult.composition || gptResult.composition || 'Unknown',
    grade: claudeResult.grade || gptResult.grade || 'Ungraded',
    estimated_value: Math.max(claudeResult.estimated_value || 0, gptResult.estimated_value || 0),
    rarity: claudeResult.rarity || gptResult.rarity || 'Common',
    mint: claudeResult.mint || gptResult.mint,
    diameter: claudeResult.diameter || gptResult.diameter,
    weight: claudeResult.weight || gptResult.weight,
    errors: [...(claudeResult.errors || []), ...(gptResult.errors || [])],
    confidence: confidence,
    ai_providers: ['claude-3-sonnet', 'gpt-4o'],
    description: claudeResult.description || gptResult.description,
    category: claudeResult.category || gptResult.category || 'WORLD COINS'
  };
}

function getCoinAnalysisPrompt(analysisType: string): string {
  const basePrompt = `Analyze this coin image and provide a comprehensive JSON response with the following structure:
{
  "name": "Full coin name/title",
  "year": integer_year,
  "country": "Country of origin",
  "denomination": "Face value",
  "composition": "Metal composition",
  "grade": "Condition grade",
  "estimated_value": number_in_usd,
  "rarity": "Common|Scarce|Rare|Ultra Rare|Key Date",
  "mint": "Mint mark if visible",
  "diameter": number_in_mm,
  "weight": number_in_grams,
  "errors": ["List any visible errors or variations"],
  "confidence": decimal_0_to_1,
  "description": "Detailed description",
  "category": "Coin category"
}`;

  if (analysisType === 'comprehensive') {
    return basePrompt + `

Focus on:
- Accurate identification of the coin
- Historical context and significance
- Market value assessment
- Condition and grading details
- Any notable features or errors`;
  }

  return basePrompt + `

Provide basic identification focusing on key visible features.`;
}
