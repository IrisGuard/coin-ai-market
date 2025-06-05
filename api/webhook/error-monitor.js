
export default async function handler(req, res) {
  const { error, stack, url, userAgent } = req.body;
  
  // Log to Vercel
  console.error('Frontend Error:', {
    error,
    stack,
    url,
    userAgent,
    timestamp: new Date().toISOString()
  });
  
  // Optionally send to external monitoring
  // await sendToMonitoring(error, stack);
  
  res.status(200).json({ received: true });
}
