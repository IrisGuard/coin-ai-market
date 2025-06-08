
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnhancedSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  placeholder = "Search for coins...",
  onSearch,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useState(['Morgan Dollar', 'Mercury Dime', 'Buffalo Nickel']);
  const [popularSearches] = useState(['Ancient Coins', 'Silver Coins', 'Rare Coins', 'Error Coins']);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    'Morgan Silver Dollar 1921',
    'Mercury Dime 1916',
    'Walking Liberty Half Dollar',
    'Indian Head Penny',
    'Buffalo Nickel 1937'
  ].filter(suggestion => 
    suggestion.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0 || isFocused);
  };

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={inputRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
            if (e.key === 'Escape') {
              setShowSuggestions(false);
              setIsFocused(false);
            }
          }}
          className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all duration-200 ${
            isFocused ? 'shadow-lg' : ''
          }`}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && (isFocused || query.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="border border-gray-200 shadow-lg">
              <CardContent className="p-0">
                {/* Live Suggestions */}
                {suggestions.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                      <Search className="w-4 h-4 mr-1" />
                      Suggestions
                    </div>
                    {suggestions.slice(0, 5).map((suggestion, index) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-50 transition-colors text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Recent Searches */}
                {recentSearches.length > 0 && query.length === 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Recent Searches
                    </div>
                    {recentSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-50 transition-colors text-sm text-gray-600"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular Searches */}
                {query.length === 0 && (
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Popular Searches
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {popularSearches.map((search) => (
                        <Badge
                          key={search}
                          variant="secondary"
                          className="cursor-pointer hover:bg-electric-blue hover:text-white transition-colors text-xs"
                          onClick={() => handleSuggestionClick(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar;
