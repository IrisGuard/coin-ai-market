
import { useState } from 'react';

export const useSearchHandlers = (search: any, searchParams: any) => {
  const [activeView, setActiveView] = useState<'search' | 'discover'>('search');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const handleSearch = (searchParams: any) => {
    search(searchParams);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    search({ ...searchParams, query: suggestion });
    setShowSuggestions(false);
  };

  const handleTrendingClick = (trend: string) => {
    search({ ...searchParams, query: trend });
    setShowSuggestions(false);
  };

  const handleCoinClick = (coinId: string) => {
    console.log('Navigate to coin:', coinId);
  };

  return {
    activeView,
    setActiveView,
    showSuggestions,
    setShowSuggestions,
    handleSearch,
    handleSuggestionClick,
    handleTrendingClick,
    handleCoinClick
  };
};
