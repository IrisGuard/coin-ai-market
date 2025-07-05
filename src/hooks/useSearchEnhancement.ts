
import { useCallback } from 'react';

export const useSearchEnhancement = () => {
  const performSearch = useCallback((query: string) => {
    console.log('Enhanced search:', query);
    // Store search in localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('lastSearch', query);
      } catch (error) {
        console.warn('Could not save search to localStorage:', error);
      }
    }
  }, []);

  return { performSearch };
};
