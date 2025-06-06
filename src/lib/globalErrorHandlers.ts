
export const setupGlobalErrorHandlers = () => {
  const notifyCriticalError = async (error: Error) => {
    if (error.message.includes('database') || 
        error.message.includes('authentication') ||
        error.message.includes('payment')) {
      
      await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'critical_error',
          error: error.message,
          stack: error.stack,
          url: window.location.href,
          timestamp: new Date().toISOString()
        })
      }).catch(() => {});
    }
  };

  // Global error handlers
  window.addEventListener('error', (event) => {
    if (event.error) {
      notifyCriticalError(event.error);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason) {
      notifyCriticalError(event.reason);
    }
  });
};
