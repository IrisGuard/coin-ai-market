
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, X, TrendingUp } from 'lucide-react';

interface SearchHistoryProps {
  history: string[];
  trending: string[];
  onSearchClick: (query: string) => void;
  onClearHistory: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  trending,
  onSearchClick,
  onClearHistory
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Search History
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Searches */}
        {history.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Recent Searches</h4>
            <div className="flex flex-wrap gap-2">
              {history.slice(0, 8).map((query, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => onSearchClick(query)}
                >
                  {query}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            Trending Searches
          </h4>
          <div className="flex flex-wrap gap-2">
            {trending.map((query, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 bg-blue-50 text-blue-700"
                onClick={() => onSearchClick(query)}
              >
                {query}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Search Suggestions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Quick Searches</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Error Coins',
              'Gold Coins',
              'Silver Dollars',
              'Ancient Coins',
              'Modern Coins',
              'Commemorative'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSearchClick(suggestion)}
                className="text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
