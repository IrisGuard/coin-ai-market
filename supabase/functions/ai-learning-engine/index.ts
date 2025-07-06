import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AILearningRequest {
  learning_session_id?: string;
  user_corrections?: any;
  accuracy_rating?: number;
  is_correct?: boolean;
  auto_learn?: boolean;
  category?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json() as AILearningRequest;
    console.log('🧠 AI Learning Engine Processing:', body);

    // Step 1: Process user feedback if provided
    let learningResult: any = { success: true };

    if (body.learning_session_id && body.user_corrections) {
      learningResult = await processUserFeedback(supabaseClient, body);
    }

    // Step 2: Auto-learning from all recent sessions
    if (body.auto_learn !== false) {
      await executeAutoLearning(supabaseClient);
    }

    // Step 3: Update AI performance metrics
    await updateAIPerformanceMetrics(supabaseClient, body.category);

    // Step 4: Generate learning insights
    const insights = await generateLearningInsights(supabaseClient);

    const result = {
      success: true,
      learning_applied: learningResult.learning_applied || false,
      auto_learning_executed: body.auto_learn !== false,
      performance_improvement: insights.performance_improvement,
      total_learning_sessions: insights.total_sessions,
      ai_accuracy_improvement: insights.accuracy_improvement,
      categories_improved: insights.categories_improved,
      timestamp: new Date().toISOString()
    };

    console.log('✅ AI Learning Engine Result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ AI Learning Engine Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function processUserFeedback(supabase: any, body: AILearningRequest): Promise<any> {
  try {
    // Update the learning session with user corrections
    const { data: session, error: updateError } = await supabase
      .from('ai_learning_sessions')
      .update({
        user_corrections: body.user_corrections,
        accuracy_score: body.accuracy_rating ? body.accuracy_rating / 5 : 0.5,
        learning_applied: true,
        contribution_score: body.is_correct ? 5 : Math.max(1, body.accuracy_rating || 1),
        updated_at: new Date().toISOString()
      })
      .eq('id', body.learning_session_id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update learning session: ${updateError.message}`);
    }

    // Apply learning to AI models
    await applyLearningToModels(supabase, session);

    return { learning_applied: true, session_updated: true };
  } catch (error) {
    console.error('User feedback processing error:', error);
    return { learning_applied: false, error: error.message };
  }
}

async function executeAutoLearning(supabase: any): Promise<void> {
  console.log('🔄 Executing Auto-Learning...');

  // Get recent learning sessions that haven't been processed
  const { data: sessions, error } = await supabase
    .from('ai_learning_sessions')
    .select('*')
    .eq('learning_applied', false)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .limit(50);

  if (error || !sessions) {
    console.error('Failed to fetch learning sessions:', error);
    return;
  }

  let processedCount = 0;

  for (const session of sessions) {
    try {
      // Apply auto-learning logic
      await processAutoLearningSession(supabase, session);
      
      // Mark as processed
      await supabase
        .from('ai_learning_sessions')
        .update({ learning_applied: true })
        .eq('id', session.id);

      processedCount++;
    } catch (error) {
      console.error(`Failed to process session ${session.id}:`, error);
    }
  }

  console.log(`✅ Auto-learning processed ${processedCount} sessions`);
}

async function processAutoLearningSession(supabase: any, session: any): Promise<void> {
  // Extract learning patterns from the session
  const learningData = {
    category: session.category,
    confidence_improvement: session.accuracy_score > 0.7 ? 0.05 : -0.02,
    pattern_recognition: extractPatterns(session.original_analysis, session.user_corrections),
    error_reduction: session.user_corrections ? calculateErrorReduction(session) : 0
  };

  // Store learning insights
  await supabase
    .from('ai_recognition_cache')
    .upsert({
      image_hash: `learning_${session.id}`,
      recognition_results: learningData,
      confidence_score: session.accuracy_score,
      discovery_version: 'auto_learning_v2.0',
      multi_language_data: { learning: true },
      error_patterns: session.user_corrections || {},
      created_at: new Date().toISOString()
    });

  console.log(`📚 Learning applied for session: ${session.id}`);
}

function extractPatterns(originalAnalysis: any, corrections: any): any {
  if (!corrections || !originalAnalysis) return {};

  const patterns: any = {};
  
  // Identify correction patterns
  Object.keys(corrections).forEach(key => {
    if (originalAnalysis[key] !== corrections[key]) {
      patterns[key] = {
        original: originalAnalysis[key],
        corrected: corrections[key],
        pattern_type: 'user_correction'
      };
    }
  });

  return patterns;
}

function calculateErrorReduction(session: any): number {
  if (!session.user_corrections) return 0;
  
  const correctionCount = Object.keys(session.user_corrections).length;
  return Math.min(correctionCount * 0.1, 0.5); // Max 0.5 improvement
}

async function applyLearningToModels(supabase: any, session: any): Promise<void> {
  // Update AI training data
  await supabase
    .from('ai_training_data')
    .insert({
      image_url: `learning_session_${session.id}`,
      image_hash: `learning_${session.id}`,
      coin_identification: session.user_corrections || session.original_analysis,
      error_annotations: session.user_corrections || {},
      contributed_by: session.user_id,
      training_quality_score: session.accuracy_score,
      validation_status: 'auto_validated'
    });

  console.log(`🎯 Learning model updated for session: ${session.id}`);
}

async function updateAIPerformanceMetrics(supabase: any, category?: string): Promise<void> {
  const categories = category ? [category] : ['coins', 'banknotes', 'bullion', 'error_coins', 'error_banknotes'];

  for (const cat of categories) {
    // Calculate performance metrics for the category
    const { data: sessions } = await supabase
      .from('ai_learning_sessions')
      .select('accuracy_score, contribution_score')
      .eq('category', cat)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

    if (!sessions || sessions.length === 0) continue;

    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy_score, 0) / sessions.length;
    const totalSessions = sessions.length;
    const totalCorrections = sessions.filter(s => s.contribution_score > 3).length;

    // Update or insert performance record
    await supabase
      .from('ai_learning_performance')
      .upsert({
        category: cat,
        accuracy_improvement: avgAccuracy - 0.5, // Baseline is 0.5
        total_learning_sessions: totalSessions,
        user_corrections_applied: totalCorrections,
        confidence_score_avg: avgAccuracy,
        last_learning_update: new Date().toISOString()
      });
  }
}

async function generateLearningInsights(supabase: any): Promise<any> {
  // Get overall performance metrics
  const { data: performance } = await supabase
    .from('ai_learning_performance')
    .select('*')
    .order('last_learning_update', { ascending: false });

  const { data: sessions } = await supabase
    .from('ai_learning_sessions')
    .select('id, accuracy_score, category')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const insights = {
    performance_improvement: performance?.reduce((sum, p) => sum + p.accuracy_improvement, 0) || 0,
    total_sessions: sessions?.length || 0,
    accuracy_improvement: performance?.reduce((sum, p) => sum + p.accuracy_improvement, 0) / (performance?.length || 1) || 0,
    categories_improved: performance?.filter(p => p.accuracy_improvement > 0).length || 0,
    best_performing_category: performance?.sort((a, b) => b.accuracy_improvement - a.accuracy_improvement)[0]?.category || 'coins'
  };

  return insights;
}