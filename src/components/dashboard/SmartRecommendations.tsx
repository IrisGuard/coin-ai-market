
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Star, 
  TrendingUp, 
  ShoppingCart, 
  Eye, 
  ArrowRight 
} from 'lucide-react';

interface SmartRecommendationsProps {
  portfolioItems: any[];
  isAnalyzing: boolean;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ 
  portfolioItems, 
  isAnalyzing 
}) => {
  const recommendations = [
    {
      id: 1,
      type: "acquisition",
      title: "1916-D Mercury Dime",
      reason: "Complements your Mercury Dime collection",
      expectedReturn: "+24%",
      confidence: 89,
      price: "$1,250",
      rarity: "Key Date",
      image: "/placeholder.svg",
      priority: "high"
    },
    {
      id: 2,
      type: "diversification",
      title: "Ancient Roman Denarius",
      reason: "Expand into ancient coins for better diversification",
      expectedReturn: "+18%",
      confidence: 76,
      price: "$450",
      rarity: "Common",
      image: "/placeholder.svg",
      priority: "medium"
    },
    {
      id: 3,
      type: "upgrade",
      title: "1921 Morgan Dollar MS-65",
      reason: "Upgrade your current MS-63 for better returns",
      expectedReturn: "+31%",
      confidence: 92,
      price: "$890",
      rarity: "Premium Grade",
      image: "/placeholder.svg",
      priority: "high"
    },
    {
      id: 4,
      type: "trending",
      title: "2023 Type 2 Silver Eagle",
      reason: "High demand and limited supply detected",
      expectedReturn: "+12%",
      confidence: 67,
      price: "$75",
      rarity: "Modern",
      image: "/placeholder.svg",
      priority: "low"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'acquisition': return <ShoppingCart className="w-4 h-4" />;
      case 'diversification': return <Target className="w-4 h-4" />;
      case 'upgrade': return <TrendingUp className="w-4 h-4" />;
      case 'trending': return <Star className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Smart Recommendations
          {isAnalyzing && (
            <Badge variant="secondary" className="ml-2 animate-pulse">
              Updating...
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          AI-curated suggestions to optimize your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-blue-600">
                    {getTypeIcon(rec.type)}
                  </div>
                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(rec.priority)}`}
                >
                  {rec.priority.toUpperCase()}
                </Badge>
              </div>

              <p className="text-xs text-gray-600 mb-3">{rec.reason}</p>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div>
                  <span className="text-gray-500">Expected Return:</span>
                  <span className="font-semibold text-green-600 ml-1">
                    {rec.expectedReturn}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <span className="font-semibold ml-1">{rec.price}</span>
                </div>
                <div>
                  <span className="text-gray-500">Confidence:</span>
                  <span className="font-semibold ml-1">{rec.confidence}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Rarity:</span>
                  <span className="font-semibold ml-1">{rec.rarity}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button size="sm" className="flex-1 text-xs">
                  Add to Watchlist
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Target className="w-4 h-4" />
            <span className="font-medium">Portfolio Goal: 15% Annual Growth</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Following these recommendations could help achieve your target return.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
