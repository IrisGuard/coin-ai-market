
export const checkRequiredEnvVars = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing);
    console.error('Please check your .env file and ensure all required variables are set');
    return false;
  }
  
  return true;
};

export const validateEnvironment = () => {
  const isValid = checkRequiredEnvVars();
  
  if (!isValid) {
    throw new Error('Required environment variables are missing. Please check your configuration.');
  }
  
  return true;
};
