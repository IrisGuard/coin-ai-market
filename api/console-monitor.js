
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { level, message, timestamp, url, userAgent, stack } = req.body;
  
  // Enhanced logging to Vercel console
  console.log(`[${level.toUpperCase()}] ${timestamp}: ${message}`);
  console.log(`URL: ${url}`);
  console.log(`User Agent: ${userAgent}`);
  if (stack) {
    console.log(`Stack: ${stack}`);
  }
  console.log('---');
  
  // Store in Supabase for persistence
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { error } = await supabase.from('console_errors').insert({
      error_level: level,
      message: message,
      page_url: url,
      user_agent: userAgent,
      source_file: stack ? extractSourceFile(stack) : null,
      line_number: stack ? extractLineNumber(stack) : null,
      created_at: timestamp
    });
    
    if (error) {
      console.error('Failed to store error in database:', error);
    }
  } catch (error) {
    console.error('Failed to store error in database:', error);
  }
  
  // Check for critical errors and notify
  if (isCriticalError(message, level)) {
    await notifyAdminOfCriticalError({
      level,
      message,
      url,
      timestamp,
      userAgent,
      stack
    });
  }
  
  res.status(200).json({ 
    received: true,
    timestamp: new Date().toISOString()
  });
}

function extractSourceFile(stack) {
  const match = stack.match(/at .* \((.*?):\d+:\d+\)/);
  return match ? match[1] : null;
}

function extractLineNumber(stack) {
  const match = stack.match(/:(\d+):\d+\)/);
  return match ? parseInt(match[1]) : null;
}

function isCriticalError(message, level) {
  const criticalKeywords = [
    'database',
    'authentication',
    'payment',
    'supabase',
    'stripe',
    'network error',
    'failed to fetch'
  ];
  
  return level === 'error' && 
         criticalKeywords.some(keyword => 
           message.toLowerCase().includes(keyword)
         );
}

async function notifyAdminOfCriticalError(errorData) {
  try {
    // Log critical error with special formatting
    console.log('🚨 CRITICAL ERROR DETECTED 🚨');
    console.log(JSON.stringify(errorData, null, 2));
    
    // In a real implementation, you might send emails, Slack notifications, etc.
    // For now, we'll just log it prominently
  } catch (error) {
    console.error('Failed to notify admin:', error);
  }
}
