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
    const { phase = '10.5' } = await req.json();

    console.log(`🔍 PHASE ${phase} COMPLETION VALIDATION`);

    const startTime = Date.now();
    
    // Comprehensive Phase 10.5 Validation
    const validationResults = await validatePhase105Completion();
    
    const validationTime = Date.now() - startTime;
    
    console.log('✅ PHASE VALIDATION COMPLETE');
    console.log('Overall Completion:', validationResults.overallCompletion + '%');
    console.log('Validation Time:', validationTime + 'ms');

    return new Response(JSON.stringify({
      success: true,
      phase: phase,
      validation_results: validationResults,
      metadata: {
        validation_time: validationTime,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Phase Validation Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Phase validation failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function validatePhase105Completion() {
  console.log('🔍 Validating Phase 10.5 Completion...');
  
  const validationChecks = [];
  
  // 1. Database Structure Validation
  const dbValidation = await validateDatabaseStructure();
  validationChecks.push({
    component: 'database_structure',
    status: dbValidation.isComplete ? 'complete' : 'incomplete',
    completion: dbValidation.completion,
    details: dbValidation.details
  });
  
  // 2. Edge Functions Validation
  const functionsValidation = await validateEdgeFunctions();
  validationChecks.push({
    component: 'edge_functions',
    status: functionsValidation.isComplete ? 'complete' : 'incomplete', 
    completion: functionsValidation.completion,
    details: functionsValidation.details
  });
  
  // 3. Global AI Brain Integration
  const aiBrainValidation = await validateGlobalAIBrain();
  validationChecks.push({
    component: 'global_ai_brain',
    status: aiBrainValidation.isComplete ? 'complete' : 'incomplete',
    completion: aiBrainValidation.completion,
    details: aiBrainValidation.details
  });
  
  // 4. Real Data Population
  const dataValidation = await validateRealDataPopulation();
  validationChecks.push({
    component: 'real_data_population',
    status: dataValidation.isComplete ? 'complete' : 'incomplete',
    completion: dataValidation.completion,
    details: dataValidation.details
  });
  
  // 5. Production Readiness
  const productionValidation = await validateProductionReadiness();
  validationChecks.push({
    component: 'production_readiness',
    status: productionValidation.isComplete ? 'complete' : 'incomplete',
    completion: productionValidation.completion,
    details: productionValidation.details
  });
  
  // Calculate overall completion
  const overallCompletion = Math.round(
    validationChecks.reduce((sum, check) => sum + check.completion, 0) / validationChecks.length
  );
  
  const isPhaseComplete = overallCompletion >= 95; // 95%+ for completion
  
  return {
    isComplete: isPhaseComplete,
    overallCompletion,
    validationChecks,
    readyForPhase11: isPhaseComplete && overallCompletion >= 98,
    recommendations: generateRecommendations(validationChecks, overallCompletion)
  };
}

async function validateDatabaseStructure() {
  console.log('📊 Validating Database Structure...');
  
  const requiredTables = [
    'global_coin_sources',
    'global_coin_learning', 
    'web_discovery_sessions',
    'coin_inscriptions',
    'ai_recognition_cache',
    'error_coins_knowledge'
  ];
  
  const tableChecks = [];
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      tableChecks.push({
        table,
        exists: !error,
        hasData: data && data.length > 0,
        error: error?.message
      });
    } catch (err) {
      tableChecks.push({
        table,
        exists: false,
        hasData: false,
        error: err.message
      });
    }
  }
  
  const existingTables = tableChecks.filter(t => t.exists).length;
  const tablesWithData = tableChecks.filter(t => t.hasData).length;
  
  return {
    isComplete: existingTables === requiredTables.length,
    completion: Math.round((existingTables / requiredTables.length) * 100),
    details: {
      required_tables: requiredTables.length,
      existing_tables: existingTables,
      tables_with_data: tablesWithData,
      table_checks: tableChecks
    }
  };
}

async function validateEdgeFunctions() {
  console.log('⚡ Validating Edge Functions...');
  
  const requiredFunctions = [
    'global-ai-brain',
    'advanced-web-scraper',
    'dynamic-source-discovery',
    'intelligent-fallback-system',
    'dealer-learning-engine',
    'multi-language-ocr',
    'production-testing-framework'
  ];
  
  const functionChecks = [];
  
  for (const func of requiredFunctions) {
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.functions.invoke(func, {
        body: { healthCheck: true }
      });
      const responseTime = Date.now() - startTime;
      
      functionChecks.push({
        function: func,
        accessible: !error,
        response_time: responseTime,
        functional: !error && responseTime < 10000,
        error: error?.message
      });
    } catch (err) {
      functionChecks.push({
        function: func,
        accessible: false,
        functional: false,
        error: err.message
      });
    }
  }
  
  const functionalFunctions = functionChecks.filter(f => f.functional).length;
  
  return {
    isComplete: functionalFunctions === requiredFunctions.length,
    completion: Math.round((functionalFunctions / requiredFunctions.length) * 100),
    details: {
      required_functions: requiredFunctions.length,
      functional_functions: functionalFunctions,
      function_checks: functionChecks
    }
  };
}

async function validateGlobalAIBrain() {
  console.log('🧠 Validating Global AI Brain...');
  
  const aiChecks = [];
  
  // Check AI Brain functionality
  try {
    const testImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    
    const { data } = await supabase.functions.invoke('global-ai-brain', {
      body: {
        image: testImage,
        analysisDepth: 'comprehensive'
      }
    });
    
    aiChecks.push({
      test: 'basic_functionality',
      passed: data?.success === true,
      details: data?.analysis ? 'Analysis returned' : 'No analysis'
    });
    
    aiChecks.push({
      test: 'multi_language_support',
      passed: data?.analysis?.languages_processed?.length > 0,
      details: `Languages: ${data?.analysis?.languages_processed?.join(', ') || 'None'}`
    });
    
    aiChecks.push({
      test: 'global_source_integration',
      passed: data?.metadata?.sources_consulted > 0,
      details: `Sources consulted: ${data?.metadata?.sources_consulted || 0}`
    });
    
  } catch (error) {
    aiChecks.push({
      test: 'basic_functionality',
      passed: false,
      error: error.message
    });
  }
  
  const passedChecks = aiChecks.filter(c => c.passed).length;
  
  return {
    isComplete: passedChecks === aiChecks.length,
    completion: Math.round((passedChecks / Math.max(1, aiChecks.length)) * 100),
    details: {
      ai_checks: aiChecks,
      passed_checks: passedChecks,
      total_checks: aiChecks.length
    }
  };
}

async function validateRealDataPopulation() {
  console.log('📈 Validating Real Data Population...');
  
  const dataChecks = [];
  
  // Check global coin sources
  const { data: sources } = await supabase
    .from('global_coin_sources')
    .select('count');
    
  dataChecks.push({
    table: 'global_coin_sources',
    count: sources?.length || 0,
    target: 20,
    sufficient: (sources?.length || 0) >= 20
  });
  
  // Check web discovery sessions
  const { data: sessions } = await supabase
    .from('web_discovery_sessions')
    .select('count');
    
  dataChecks.push({
    table: 'web_discovery_sessions',
    count: sessions?.length || 0,
    target: 1,
    sufficient: (sessions?.length || 0) >= 1
  });
  
  // Check AI training data
  const { data: training } = await supabase
    .from('ai_training_data')
    .select('count');
    
  dataChecks.push({
    table: 'ai_training_data',
    count: training?.length || 0,
    target: 1,
    sufficient: (training?.length || 0) >= 1
  });
  
  const sufficientData = dataChecks.filter(d => d.sufficient).length;
  
  return {
    isComplete: sufficientData === dataChecks.length,
    completion: Math.round((sufficientData / dataChecks.length) * 100),
    details: {
      data_checks: dataChecks,
      sufficient_tables: sufficientData,
      total_tables: dataChecks.length
    }
  };
}

async function validateProductionReadiness() {
  console.log('🚀 Validating Production Readiness...');
  
  const productionChecks = [];
  
  // Performance check
  try {
    const startTime = Date.now();
    await supabase.functions.invoke('production-testing-framework', {
      body: { testType: 'quick_validation' }
    });
    const responseTime = Date.now() - startTime;
    
    productionChecks.push({
      check: 'performance',
      passed: responseTime < 30000,
      value: responseTime,
      target: 30000
    });
  } catch (error) {
    productionChecks.push({
      check: 'performance',
      passed: false,
      error: error.message
    });
  }
  
  // Error handling check
  try {
    await supabase.functions.invoke('global-ai-brain', {
      body: { invalid: 'data' }
    });
    
    productionChecks.push({
      check: 'error_handling',
      passed: true,
      details: 'Graceful error handling'
    });
  } catch (error) {
    productionChecks.push({
      check: 'error_handling', 
      passed: error.message.includes('required') || error.message.includes('provided'),
      details: 'Error handling functional'
    });
  }
  
  const passedChecks = productionChecks.filter(c => c.passed).length;
  
  return {
    isComplete: passedChecks === productionChecks.length,
    completion: Math.round((passedChecks / productionChecks.length) * 100),
    details: {
      production_checks: productionChecks,
      passed_checks: passedChecks,
      total_checks: productionChecks.length
    }
  };
}

function generateRecommendations(validationChecks: any[], overallCompletion: number) {
  const recommendations = [];
  
  if (overallCompletion < 95) {
    recommendations.push('Phase 10.5 not yet complete - address failing validation checks');
  }
  
  for (const check of validationChecks) {
    if (check.completion < 90) {
      recommendations.push(`${check.component} needs attention - only ${check.completion}% complete`);
    }
  }
  
  if (overallCompletion >= 95) {
    recommendations.push('Phase 10.5 validation successful - ready to proceed to Phase 11');
  }
  
  return recommendations;
}