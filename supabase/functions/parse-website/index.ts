
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, instructions, commandId } = await req.json();
    
    console.log('🔗 Parsing website:', url);
    console.log('📋 Instructions:', instructions);

    if (!url) {
      throw new Error('URL is required');
    }

    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
    }

    const htmlContent = await response.text();
    
    // Extract text content (basic parsing)
    const textContent = htmlContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract coin-specific information
    const coinAnalysis = analyzeCoinContent(textContent, instructions);

    console.log('✅ Website parsed successfully');
    console.log('🔍 Coin analysis result:', coinAnalysis);

    return new Response(JSON.stringify({
      status: 'completed',
      url: url,
      content_length: textContent.length,
      coin_analysis: coinAnalysis,
      raw_content: textContent.substring(0, 1000), // First 1000 chars for debugging
      parsed_at: new Date().toISOString(),
      command_id: commandId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in parse-website function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      status: 'failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeCoinContent(content: string, instructions: string): any {
  const analysis = {
    metal_detected: null,
    errors_detected: [],
    grade_condition: null,
    year_detected: null,
    mint_mark: null,
    is_gold: false,
    is_silver: false,
    authenticity_markers: [],
    confidence_score: 0
  };

  const lowerContent = content.toLowerCase();
  
  // Detect metal composition
  if (lowerContent.includes('gold') || lowerContent.includes('au ')) {
    analysis.metal_detected = 'gold';
    analysis.is_gold = true;
    analysis.confidence_score += 0.2;
  }
  
  if (lowerContent.includes('silver') || lowerContent.includes('ag ')) {
    analysis.metal_detected = 'silver';
    analysis.is_silver = true;
    analysis.confidence_score += 0.2;
  }

  if (lowerContent.includes('copper') || lowerContent.includes('bronze')) {
    analysis.metal_detected = 'copper';
    analysis.confidence_score += 0.1;
  }

  // Detect common coin errors
  const errors = [
    'double die', 'doubled die', 'off center', 'clipped planchet', 
    'broadstrike', 'lamination', 'die crack', 'cuds', 'filled die'
  ];
  
  errors.forEach(error => {
    if (lowerContent.includes(error)) {
      analysis.errors_detected.push(error);
      analysis.confidence_score += 0.15;
    }
  });

  // Detect grades
  const grades = ['ms-70', 'ms-69', 'ms-68', 'ms-67', 'ms-66', 'ms-65', 'au-58', 'au-55', 'xf-45', 'vf-30', 'f-15', 'vg-10'];
  grades.forEach(grade => {
    if (lowerContent.includes(grade) || lowerContent.includes(grade.replace('-', ' '))) {
      analysis.grade_condition = grade;
      analysis.confidence_score += 0.2;
    }
  });

  // Detect years (1800-2025)
  const yearMatch = content.match(/\b(18|19|20)\d{2}\b/);
  if (yearMatch) {
    analysis.year_detected = yearMatch[0];
    analysis.confidence_score += 0.15;
  }

  // Detect common mint marks
  const mintMarks = ['d', 's', 'o', 'cc', 'w', 'p'];
  mintMarks.forEach(mark => {
    if (lowerContent.includes(`mint mark ${mark}`) || lowerContent.includes(`-${mark} `)) {
      analysis.mint_mark = mark.toUpperCase();
      analysis.confidence_score += 0.1;
    }
  });

  // Detect authenticity markers
  if (lowerContent.includes('pcgs') || lowerContent.includes('ngc')) {
    analysis.authenticity_markers.push('Third-party graded');
    analysis.confidence_score += 0.1;
  }

  if (lowerContent.includes('certified') || lowerContent.includes('authenticated')) {
    analysis.authenticity_markers.push('Certified authentic');
    analysis.confidence_score += 0.05;
  }

  // Ensure confidence score doesn't exceed 1
  analysis.confidence_score = Math.min(analysis.confidence_score, 1);

  return analysis;
}
