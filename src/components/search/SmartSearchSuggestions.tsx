
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Star, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SmartSearchSuggestionsProps {
  searchQuery: string;
  onSuggestionClick: (suggestion: string) => void;
  onTrendingClick: (trend: string) => void;
}

const SmartSearchSuggestions: React.FC<SmartSearchSuggestionsProps> = ({
  searchQuery,
  onSuggestionClick,
  onTrendingClick
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'Morgan Silver Dollar',
    'Mercury Dime',
    'Buffalo Nickel',
    'Walking Liberty Half',
    'Peace Dollar',
    'Indian Head Penny',
    'Standing Liberty Quarter',
    'Barber Dime'
  ]);

  const [popularFilters] = useState([
    { label: 'Graded Coins', filter: 'graded:true', icon: Star },
    { label: 'Under $100', filter: 'price:<100', icon: TrendingUp },
    { label: 'Rare Coins', filter: 'rarity:rare', icon: Zap },
    { label: 'Auction Items', filter: 'auction:true', icon: Clock }
  ]);

  const [recentSearches] = useState([
    '1921 Morgan Dollar',
    'Mercury Dime 1916',
    'Walking Liberty 1943',
    'Indian Head Cent'
  ]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      // Simulate smart suggestions based on query
      const mockSuggestions = [
        `${searchQuery} coin`,
        `${searchQuery} silver`,
        `${searchQuery} dollar`,
        `${searchQuery} cent`,
        `${searchQuery} rare`,
        `${searchQuery} graded`
      ].filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      setSuggestions(mockSuggestions.slice(0, 6));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  return (
    <div className="space-y-4">
      {/* Auto-complete Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm text-gray-600 mb-3 flex items-center">
              <Search className="w-4 h-4 mr-1" />
              Search Suggestions
            </h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between group"
                >
                  <span className="text-gray-700">{suggestion}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Quick Filters */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm text-gray-600 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            Quick Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {popularFilters.map((filter) => (
              <Button
                key={filter.filter}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(filter.filter)}
                className="flex items-center gap-1 text-xs"
              >
                <filter.icon className="w-3 h-3" />
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Searches */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm text-gray-600 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Trending Searches
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {trendingSearches.slice(0, 6).map((trend, index) => (
              <button
                key={trend}
                onClick={() => onTrendingClick(trend)}
                className="text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700 hover:text-blue-600"
              >
                <div className="flex items-center justify-between">
                  <span>{trend}</span>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm text-gray-600 mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Recent Searches
            </h4>
            <div className="space-y-1">
              {recentSearches.map((recent) => (
                <button
                  key={recent}
                  onClick={() => onSuggestionClick(recent)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-600 hover:text-gray-900"
                >
                  {recent}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartSearchSuggestions;
