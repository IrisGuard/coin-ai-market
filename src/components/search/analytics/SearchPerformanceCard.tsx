
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface SearchPerformanceCardProps {
  totalResults: number;
  searchTime: number;
  relevanceScore: number;
  popularityIndex: number;
}

const SearchPerformanceCard: React.FC<SearchPerformanceCardProps> = ({
  totalResults,
  searchTime,
  relevanceScore,
  popularityIndex
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Search Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalResults}</div>
            <p className="text-sm text-gray-600">Results Found</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{searchTime}s</div>
            <p className="text-sm text-gray-600">Search Time</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{relevanceScore}%</div>
            <p className="text-sm text-gray-600">Relevance</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{popularityIndex}%</div>
            <p className="text-sm text-gray-600">Popularity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchPerformanceCard;
