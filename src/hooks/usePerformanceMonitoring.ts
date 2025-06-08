
export const usePerformanceMonitoring = (pageName: string) => {
  const markStart = (label?: string) => {
    console.log('Performance mark start:', label || pageName);
  };

  const markEnd = (label?: string) => {
    console.log('Performance mark end:', label || pageName);
  };

  return {
    markStart,
    markEnd
  };
};
