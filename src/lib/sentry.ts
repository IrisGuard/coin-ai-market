
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENV || import.meta.env.MODE,
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      
      // Enhanced configuration for Vercel
      beforeSend(event, hint) {
        // Add Vercel deployment info
        if (event.tags) {
          event.tags.deployment_id = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown';
          event.tags.vercel_env = import.meta.env.VITE_VERCEL_ENV || 'unknown';
          event.tags.git_branch = import.meta.env.VITE_VERCEL_GIT_COMMIT_REF || 'unknown';
        } else {
          event.tags = {
            deployment_id: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
            vercel_env: import.meta.env.VITE_VERCEL_ENV || 'unknown',
            git_branch: import.meta.env.VITE_VERCEL_GIT_COMMIT_REF || 'unknown'
          };
        }

        // Filter out non-critical errors in production
        if (import.meta.env.PROD) {
          const error = hint.originalException;
          if (error instanceof Error) {
            // Skip certain non-critical errors
            const skipErrors = [
              'ResizeObserver loop limit exceeded',
              'Non-Error promise rejection captured',
              'Network request failed'
            ];
            
            if (skipErrors.some(skip => error.message.includes(skip))) {
              return null;
            }
          }
        }

        return event;
      },

      integrations: [
        // React error boundary integration
        Sentry.replayIntegration({
          maskAllInputs: true,
          maskAllText: false,
        }),
      ],

      // Sample rate for session replay
      replaysSessionSampleRate: import.meta.env.PROD ? 0.01 : 0.1,
      replaysOnErrorSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    });

    // Set user context for Vercel
    Sentry.setContext('vercel', {
      environment: import.meta.env.VITE_VERCEL_ENV || 'unknown',
      deployment: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
      branch: import.meta.env.VITE_VERCEL_GIT_COMMIT_REF || 'unknown',
      region: import.meta.env.VITE_VERCEL_REGION || 'unknown'
    });

    console.log('✅ Sentry initialized with Vercel integration');
  } else {
    console.warn('⚠️ Sentry DSN not provided - error tracking disabled');
  }
};

export const logErrorToSentry = (error: Error, context?: Record<string, unknown>) => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    // Add Vercel context to error
    const vercelContext = {
      deployment: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
      environment: import.meta.env.VITE_VERCEL_ENV || 'unknown',
      region: import.meta.env.VITE_VERCEL_REGION || 'unknown',
      timestamp: new Date().toISOString(),
      ...context
    };

    Sentry.withScope((scope) => {
      scope.setContext('vercel_error', vercelContext);
      scope.setLevel('error');
      Sentry.captureException(error);
    });

    // Also send to Vercel monitoring
    fetch('/api/vercel-monitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'sentry_error',
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        context: vercelContext,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {}); // Silent fail for monitoring
  }
};

export const setSentryUser = (userId: string, email?: string) => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.setUser({
      id: userId,
      email: email || undefined,
      deployment: import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown'
    });
  }
};

export const addSentryBreadcrumb = (message: string, category: string, data?: any) => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      category,
      data: {
        ...data,
        vercel_env: import.meta.env.VITE_VERCEL_ENV || 'unknown',
        timestamp: new Date().toISOString()
      },
      level: 'info'
    });
  }
};
