
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Eye, 
  TrendingUp, 
  Users, 
  Clock 
} from 'lucide-react';

interface SearchInsightsCardProps {
  totalResults: number;
  relevanceScore: number;
  priceMin: number;
  priceMax: number;
  popularityIndex: number;
  searchTime: number;
}

const SearchInsightsCard: React.FC<SearchInsightsCardProps> = ({
  totalResults,
  relevanceScore,
  priceMin,
  priceMax,
  popularityIndex,
  searchTime
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Search Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-blue-500 mt-0.5" />
            <span>Your search returned {totalResults} relevant results with {relevanceScore}% relevance score.</span>
          </div>
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
            <span>Most results fall in the ${priceMin}-${priceMax} price range.</span>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-purple-500 mt-0.5" />
            <span>This search query has a {popularityIndex}% popularity index among users.</span>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-orange-500 mt-0.5" />
            <span>Search completed in {searchTime} seconds using advanced AI algorithms.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchInsightsCard;
