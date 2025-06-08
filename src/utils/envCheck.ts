
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

export const validateEnvironment = () => {
  const isValid = checkRequiredEnvVars();
  
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
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true' ? '✅ Enabled' : '❌ Disabled',
    appEnv: import.meta.env.VITE_APP_ENV || 'development'
  };
};
