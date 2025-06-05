
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { type, error, stack, url, timestamp } = req.body;
  
  // Enhanced critical error logging
  console.log('🚨🚨🚨 CRITICAL ERROR NOTIFICATION 🚨🚨🚨');
  console.log(`Type: ${type}`);
  console.log(`Error: ${error}`);
  console.log(`URL: ${url}`);
  console.log(`Timestamp: ${timestamp}`);
  if (stack) {
    console.log(`Stack Trace: ${stack}`);
  }
  console.log('🚨🚨🚨 END CRITICAL ERROR 🚨🚨🚨');
  
  // Store critical error in database with high priority
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    await supabase.from('error_logs').insert({
      error_type: 'critical',
      message: error,
      stack_trace: stack,
      page_url: url,
      created_at: timestamp
    });
  } catch (dbError) {
    console.error('Failed to store critical error:', dbError);
  }
  
  // Here you could add integrations with:
  // - Email notifications
  // - Slack webhooks
  // - SMS alerts
  // - Third-party monitoring services
  
  res.status(200).json({ 
    notified: true,
    timestamp: new Date().toISOString()
  });
}
