
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event === 'push') {
    // Trigger Vercel deployment
    const response = await fetch('https://api.vercel.com/v1/integrations/deploy/DEPLOYMENT_HOOK_URL', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`
      }
    });
    
    console.log('Deployment triggered:', response.status);
  }

  res.status(200).json({ received: true });
}
