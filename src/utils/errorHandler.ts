
import { logErrorToSentry } from '@/lib/sentry';

export const logError = (error: unknown, context?: string) => {
  console.error('Application error:', error, { context });
  
  if (error instanceof Error) {
    logErrorToSentry(error, { context });
  } else {
    logErrorToSentry(new Error(String(error)), { context });
  }
};

export const handleAsyncError = async (
  asyncFn: () => Promise<any>,
  errorMessage: string = 'An error occurred'
) => {
  try {
    return await asyncFn();
  } catch (error) {
    logError(error, errorMessage);
    throw error;
  }
};

export const withErrorHandling = <T extends (...args: any[]) => any>(
  fn: T,
  errorContext?: string
): T => {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          logError(error, errorContext);
          throw error;
        });
      }
      return result;
    } catch (error) {
      logError(error, errorContext);
      throw error;
    }
  }) as T;
};
