import { useCallback } from 'react';

export const useVoiceSearchProcessor = () => {
  const extractSearchTerms = useCallback((text: string): string => {
    const searchPatterns = [
      /(?:search|find|look for|show me|get me)\s+(.+)/i,
      /(?:coins?|currency|money)\s+(.+)/i,
      /(.+)\s+(?:coins?|currency|money)/i,
      /^(.+)$/i // Fallback: use entire text
    ];

    for (const pattern of searchPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return text.trim();
  }, []);

  const executeVoiceSearch = useCallback((query: string) => {
    const currentPath = window.location.pathname;
    
    if (currentPath === '/') {
      // On homepage: fill search bar and navigate to marketplace
      window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
    } else if (currentPath.includes('/marketplace')) {
      // On marketplace: update search filters
      const url = new URL(window.location.href);
      url.searchParams.set('search', query);
      window.history.pushState({}, '', url.toString());
      window.location.reload();
    } else {
      // Other pages: navigate to marketplace with search
      window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
    }
  }, []);

  return {
    extractSearchTerms,
    executeVoiceSearch
  };
};
