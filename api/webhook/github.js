
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.headers['x-github-event'];
  const payload = req.body;

  console.log(`📡 GitHub webhook event: ${event}`);

  try {
    if (event === 'push') {
      console.log(`🚀 Push to ${payload.ref} by ${payload.pusher?.name}`);
      
      // Trigger Vercel deployment
      if (process.env.VERCEL_DEPLOY_HOOK_URL) {
        const response = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
          }
        });
        
        console.log('✅ Deployment triggered:', response.status);
      }
    }

    if (event === 'workflow_run') {
      const conclusion = payload.workflow_run?.conclusion;
      const workflowName = payload.workflow_run?.name;
      
      console.log(`🔄 Workflow "${workflowName}" completed with: ${conclusion}`);
      
      if (conclusion === 'failure') {
        // Notify admin of workflow failure
        await fetch('/api/notify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'workflow_failure',
            workflow: workflowName,
            details: payload.workflow_run
          })
        }).catch(console.error);
      }
    }

    res.status(200).json({ 
      received: true, 
      event,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ GitHub webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
