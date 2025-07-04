import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, TrendingUp, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealSearchData } from '@/hooks/useRealSearchData';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFiltersToggle: () => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onFiltersToggle,
  hasActiveFilters,
  activeFiltersCount,
  placeholder = "Search coins, countries, categories...",
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: searchData } = useRealSearchData();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          className={`
            pl-12 pr-24 h-14 text-lg 
            bg-white/95 backdrop-blur-sm
            border-2 border-gray-200 
            focus:border-blue-400 focus:ring-2 focus:ring-blue-100
            rounded-xl shadow-lg
            transition-all duration-200
            ${isFocused ? 'shadow-xl' : ''}
          `}
        />

        {/* Clear button */}
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Filters button */}
        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          onClick={onFiltersToggle}
          className={`
            absolute right-2 top-1/2 transform -translate-y-1/2 h-10
            ${hasActiveFilters 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-white/90 border-gray-200 hover:border-blue-400'
            }
            rounded-lg shadow-sm
          `}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-white/20 text-white text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (isFocused || value) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto"
          >
            {/* Trending Searches */}
            {!value && searchData?.trendingSearches && searchData.trendingSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchData.trendingSearches.slice(0, 6).map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(term)}
                      className="text-xs hover:bg-blue-50 hover:border-blue-200"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Hot Categories */}
            {!value && searchData?.hotCategories && searchData.hotCategories.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Hot Categories</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchData.hotCategories.slice(0, 4).map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                      onClick={() => handleSuggestionClick(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quick suggestions based on input */}
            {value && value.length > 1 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Quick Suggestions</span>
                </div>
                <div className="space-y-1">
                  {[
                    `${value} coins`,
                    `${value} error`,
                    `${value} rare`,
                    `${value} collection`
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="ghost"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full justify-start text-left hover:bg-blue-50"
                    >
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;