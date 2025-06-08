
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event, deployment, project } = req.body;
    
    console.log(`📡 Received Vercel webhook: ${event}`);
    
    if (event === 'deployment.failed' || event === 'deployment.error') {
      console.log(`🚨 Deployment failed for project: ${project.name}`);
      console.log(`🔗 Deployment URL: ${deployment.url}`);
      
      // Trigger auto-fix workflow
      await triggerAutoFix(deployment, project);
    }
    
    if (event === 'deployment.succeeded') {
      console.log(`✅ Deployment succeeded for project: ${project.name}`);
    }
    
    res.status(200).json({ success: true, event });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function triggerAutoFix(deployment, project) {
  try {
    // Get deployment logs
    const logs = await getDeploymentLogs(deployment.id);
    
    // Analyze errors
    const errors = analyzeErrors(logs);
    
    if (errors.length > 0) {
      console.log(`🔧 Found ${errors.length} errors to fix:`, errors);
      
      // Trigger GitHub Action for auto-fix
      await triggerGitHubAction(project.repo, deployment.id, errors);
    }
  } catch (error) {
    console.error('❌ Auto-fix trigger failed:', error);
  }
}

async function getDeploymentLogs(deploymentId) {
  // This would normally call Vercel API to get logs
  // For now, return mock logs
  return `
    Building...
    error TS2322: Type 'string' is not assignable to type 'number'
    ESLint: Unexpected any. Specify a different type
    Error: Command "npm run build" exited with 1
  `;
}

function analyzeErrors(logs) {
  const errors = [];
  
  const patterns = {
    typescript: /error TS\d+: (.+)/g,
    eslint: /ESLint: (.+)/g,
    build: /Error: (.+) exited with \d+/g,
    import: /Module not found: (.+)/g,
    syntax: /SyntaxError: (.+)/g
  };
  
  Object.entries(patterns).forEach(([type, pattern]) => {
    let match;
    while ((match = pattern.exec(logs)) !== null) {
      errors.push({
        type,
        message: match[1],
        fullMatch: match[0]
      });
    }
  });
  
  return errors;
}

async function triggerGitHubAction(repo, deploymentId, errors) {
  console.log(`🚀 Triggering auto-fix for repo: ${repo}`);
  console.log(`📦 Deployment ID: ${deploymentId}`);
  console.log(`🐛 Errors to fix:`, errors);
  
  // This would normally trigger a GitHub Action
  // For now, just log the action
  console.log('✅ Auto-fix workflow triggered');
}
