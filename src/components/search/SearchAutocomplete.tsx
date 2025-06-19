
import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, Tag } from 'lucide-react';
import { AutocompleteResult } from '@/types/searchTypes';

interface SearchAutocompleteProps {
  query: string;
  suggestions: string[];
  history: string[];
  trending: string[];
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  query,
  suggestions,
  history,
  trending,
  onSuggestionClick,
  isVisible
}) => {
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) {
      setResults([]);
      return;
    }

    const autocompleteResults: AutocompleteResult[] = [];

    // Add suggestions based on current query
    if (query.length > 0) {
      suggestions.forEach(suggestion => {
        autocompleteResults.push({
          text: suggestion,
          type: 'suggestion'
        });
      });

      // Add matching history items
      history
        .filter(item => item.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .forEach(item => {
          autocompleteResults.push({
            text: item,
            type: 'history'
          });
        });
    } else {
      // Show trending when no query
      trending.slice(0, 5).forEach(item => {
        autocompleteResults.push({
          text: item,
          type: 'trending'
        });
      });

      // Show recent history
      history.slice(0, 3).forEach(item => {
        autocompleteResults.push({
          text: item,
          type: 'history'
        });
      });
    }

    setResults(autocompleteResults);
  }, [query, suggestions, history, trending, isVisible]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'history':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'history':
        return 'Recent';
      case 'trending':
        return 'Trending';
      default:
        return '';
    }
  };

  if (!isVisible || results.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
    >
      <div className="py-2">
        {results.map((result, index) => (
          <button
            key={`${result.type}-${index}`}
            onClick={() => onSuggestionClick(result.text)}
            className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center gap-3 group"
          >
            {getIcon(result.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate">{result.text}</span>
                {result.type !== 'suggestion' && (
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {getTypeLabel(result.type)}
                  </span>
                )}
              </div>
            </div>
            <Search className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Quick categories footer */}
      <div className="border-t border-gray-100 p-3">
        <div className="text-xs text-gray-500 mb-2">Quick categories:</div>
        <div className="flex flex-wrap gap-2">
          {['Gold', 'Silver', 'Error', 'Ancient'].map(category => (
            <button
              key={category}
              onClick={() => onSuggestionClick(category)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAutocomplete;
