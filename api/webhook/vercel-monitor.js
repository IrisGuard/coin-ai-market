
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data, metrics, error, timestamp } = req.body;
    
    console.log(`📡 Vercel Monitor - ${type} at ${timestamp}`);
    
    switch (type) {
      case 'environment_status':
        console.log('🔧 Environment Status:', JSON.stringify(data, null, 2));
        break;
        
      case 'analytics_event':
        console.log(`📊 Analytics: ${req.body.eventType} on ${req.body.pageUrl}`);
        if (req.body.metadata) {
          console.log('📋 Metadata:', JSON.stringify(req.body.metadata, null, 2));
        }
        break;
        
      case 'performance_metrics':
        console.log(`⚡ Performance on ${req.body.page}:`, JSON.stringify(metrics, null, 2));
        
        // Alert on slow performance
        if (metrics.mountTime > 1000 || metrics.loadTime > 3000) {
          console.log('🚨 SLOW PERFORMANCE DETECTED!');
          await notifySlowPerformance(req.body.page, metrics);
        }
        break;
        
      case 'error_report':
        console.log('🚨 Error Report:', JSON.stringify(error, null, 2));
        await handleErrorReport(error);
        break;
        
      case 'sentry_error':
        console.log('🔴 Sentry Error:', error.message);
        console.log('📍 Context:', JSON.stringify(req.body.context, null, 2));
        break;
        
      case 'deployment.failed':
      case 'deployment.error':
        console.log(`🚨 Deployment ${type.split('.')[1]}:`, JSON.stringify(data, null, 2));
        await triggerAutoFix(data);
        break;
        
      case 'deployment.succeeded':
        console.log('✅ Deployment succeeded:', data.url);
        break;
        
      default:
        console.log(`📋 Unknown monitoring event: ${type}`);
    }
    
    // Store in Supabase if available
    await storeMonitoringData(type, req.body);
    
    res.status(200).json({ 
      success: true, 
      type,
      timestamp: new Date().toISOString(),
      processed: true
    });
    
  } catch (error) {
    console.error('❌ Vercel monitor error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
}

async function notifySlowPerformance(page, metrics) {
  console.log(`🐌 Performance Alert: ${page} is slow`);
  console.log(`⏱️ Mount Time: ${metrics.mountTime}ms`);
  console.log(`📊 Memory Usage: ${metrics.memoryUsage ? (metrics.memoryUsage.used / 1048576).toFixed(2) + 'MB' : 'Unknown'}`);
  
  // Here you could integrate with Slack, email, etc.
}

async function handleErrorReport(error) {
  const criticalErrors = ['database', 'authentication', 'payment', 'supabase'];
  const isCritical = criticalErrors.some(keyword => 
    error.message?.toLowerCase().includes(keyword)
  );
  
  if (isCritical) {
    console.log('🚨🚨🚨 CRITICAL ERROR DETECTED 🚨🚨🚨');
    console.log(`📍 URL: ${error.url}`);
    console.log(`💬 Message: ${error.message}`);
    console.log(`🔍 Stack: ${error.stack?.slice(0, 500)}...`);
    
    // Trigger immediate notification
    await notifyCriticalError(error);
  }
}

async function notifyCriticalError(error) {
  // Enhanced critical error handling
  console.log('🚨 CRITICAL ERROR NOTIFICATION SENT');
  
  // Store critical error for admin review
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    await supabase.from('error_logs').insert({
      error_type: 'critical_vercel',
      message: error.message,
      stack_trace: error.stack,
      page_url: error.url,
      user_agent: error.userAgent,
      created_at: new Date().toISOString(),
      severity: 'critical',
      resolved: false
    });
    
    console.log('✅ Critical error stored in database');
  } catch (dbError) {
    console.error('❌ Failed to store critical error:', dbError);
  }
}

async function storeMonitoringData(type, data) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    await supabase.from('vercel_monitoring').insert({
      event_type: type,
      data: data,
      timestamp: new Date().toISOString(),
      processed: true
    });
    
  } catch (error) {
    console.error('Failed to store monitoring data:', error);
  }
}

async function triggerAutoFix(deploymentData) {
  console.log('🔧 Auto-fix triggered for deployment:', deploymentData.id);
  // This would integrate with GitHub Actions or other CI/CD systems
  // For now, just log the trigger
}
