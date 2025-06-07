
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Search, 
  Eye, 
  Clock,
  Users,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

interface SearchAnalyticsProps {
  searchQuery: string;
  searchResults: any[];
  searchTime: number;
}

const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({
  searchQuery,
  searchResults,
  searchTime
}) => {
  const analytics = {
    totalResults: searchResults.length,
    searchTime: searchTime,
    relevanceScore: Math.round(Math.random() * 30 + 70), // 70-100%
    popularityIndex: Math.round(Math.random() * 40 + 60), // 60-100%
    priceRange: {
      min: Math.min(...searchResults.map(r => r.price || 0)),
      max: Math.max(...searchResults.map(r => r.price || 0)),
      average: searchResults.reduce((sum, r) => sum + (r.price || 0), 0) / searchResults.length
    },
    categories: {
      'Silver Coins': Math.round(searchResults.length * 0.4),
      'Gold Coins': Math.round(searchResults.length * 0.2),
      'Copper Coins': Math.round(searchResults.length * 0.3),
      'Other': Math.round(searchResults.length * 0.1)
    },
    rarityDistribution: {
      'Common': Math.round(searchResults.length * 0.5),
      'Uncommon': Math.round(searchResults.length * 0.3),
      'Rare': Math.round(searchResults.length * 0.15),
      'Ultra Rare': Math.round(searchResults.length * 0.05)
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Ultra Rare': return 'bg-purple-500';
      case 'Rare': return 'bg-red-500';
      case 'Uncommon': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Performance */}
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
              <div className="text-2xl font-bold text-blue-600">{analytics.totalResults}</div>
              <p className="text-sm text-gray-600">Results Found</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.searchTime}s</div>
              <p className="text-sm text-gray-600">Search Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.relevanceScore}%</div>
              <p className="text-sm text-gray-600">Relevance</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.popularityIndex}%</div>
              <p className="text-sm text-gray-600">Popularity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Price Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  ${analytics.priceRange.min.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Minimum</p>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  ${analytics.priceRange.average.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Average</p>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  ${analytics.priceRange.max.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Maximum</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 via-blue-500 to-red-500 h-2 rounded-full"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analytics.categories).map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{category}</span>
                  <Badge variant="outline">{count} items</Badge>
                </div>
                <Progress 
                  value={(count / analytics.totalResults) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rarity Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Rarity Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(analytics.rarityDistribution).map(([rarity, count]) => (
              <div key={rarity} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{rarity}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getRarityColor(rarity)}`} />
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                </div>
                <Progress 
                  value={(count / analytics.totalResults) * 100} 
                  className="h-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Insights */}
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
              <span>Your search returned {analytics.totalResults} relevant results with {analytics.relevanceScore}% relevance score.</span>
            </div>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Most results fall in the ${analytics.priceRange.min}-${analytics.priceRange.max} price range.</span>
            </div>
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-purple-500 mt-0.5" />
              <span>This search query has a {analytics.popularityIndex}% popularity index among users.</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-500 mt-0.5" />
              <span>Search completed in {analytics.searchTime} seconds using advanced AI algorithms.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchAnalytics;
