
export const checkRequiredEnvVars = () => {
  // Only check for VITE_ variables that should be available in the frontend
  const requiredPublicVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = requiredPublicVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required public environment variables:', missing);
    console.error('Please check your Vercel environment configuration');
    return false;
  }
  
  return true;
};

export const validateVercelEnvironment = () => {
  const isValid = checkRequiredEnvVars();
  
  // Check for Vercel-specific environment indicators
  const isVercelEnvironment = import.meta.env.VERCEL || import.meta.env.VITE_VERCEL_ENV;
  
  if (isVercelEnvironment) {
    console.log('🚀 Running on Vercel environment');
    
    // Check for additional Vercel keys (these won't be available in frontend but we log their expected presence)
    const vercelKeys = {
      sentry: import.meta.env.VITE_SENTRY_DSN ? '✅ Set' : '⚠️ Missing',
      errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true' ? '✅ Enabled' : '❌ Disabled',
      appEnv: import.meta.env.VITE_APP_ENV || 'development'
    };
    
    console.log('🔑 Vercel Configuration Status:', vercelKeys);
    
    // Expected server-side keys (not accessible from frontend)
    console.log('📋 Expected Server Keys:', {
      anthropic: 'ANTHROPIC_API_KEY (server-side)',
      transak: 'TRANSAK_API_KEY (server-side)',
      supabaseService: 'SUPABASE_SERVICE_ROLE_KEY (server-side)',
      supabaseJWT: 'SUPABASE_JWT_SECRET (server-side)'
    });
  }
  
  if (!isValid) {
    if (import.meta.env.MODE === 'production') {
      console.error('❌ Missing required environment variables in production');
      return false;
    } else {
      console.warn('⚠️ Some environment variables are missing in development mode');
    }
  }
  
  // Log successful validation
  if (isValid) {
    console.log('✅ Environment variables validated successfully');
  }
  
  return isValid;
};

export const getEnvironmentInfo = () => {
  return {
    mode: import.meta.env.MODE,
    vercelEnv: import.meta.env.VITE_VERCEL_ENV || 'not-vercel',
    isVercel: !!(import.meta.env.VERCEL || import.meta.env.VITE_VERCEL_ENV),
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true' ? '✅ Enabled' : '❌ Disabled',
    sentry: import.meta.env.VITE_SENTRY_DSN ? '✅ Set' : '❌ Missing',
    appEnv: import.meta.env.VITE_APP_ENV || 'development',
    deployment: {
      id: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
      branch: import.meta.env.VITE_VERCEL_GIT_COMMIT_REF || 'unknown',
      timestamp: new Date().toISOString()
    }
  };
};

export const reportEnvironmentToVercel = async () => {
  if (import.meta.env.PROD && import.meta.env.VERCEL) {
    try {
      const envInfo = getEnvironmentInfo();
      
      // Send environment status to Vercel monitoring
      await fetch('/api/vercel-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'environment_status',
          data: envInfo,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {}); // Silent fail for monitoring
      
      console.log('📊 Environment status reported to Vercel');
    } catch (error) {
      console.warn('Failed to report environment status:', error);
    }
  }
};
