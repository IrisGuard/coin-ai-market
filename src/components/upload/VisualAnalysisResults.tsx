
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Coins, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Star, 
  AlertTriangle,
  CheckCircle,
  Eye,
  TrendingUp,
  Shield
} from 'lucide-react';

interface VisualAnalysisResultsProps {
  results: any[];
}

const VisualAnalysisResults: React.FC<VisualAnalysisResultsProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No analysis results available</p>
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'ultra rare': return 'bg-purple-600 text-white';
      case 'rare': return 'bg-red-600 text-white';
      case 'uncommon': return 'bg-yellow-600 text-white';
      default: return 'bg-green-600 text-white';
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'mint': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'near mint': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'excellent': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <Card key={index} className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">{index + 1}</span>
              </div>
              {result.identification?.name || result.name || 'Unidentified Coin'}
              <Badge className={`ml-auto ${getRarityColor(result.rarity)}`}>
                {result.rarity || 'Common'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Image */}
              <div className="space-y-4">
                <div className="aspect-square w-full max-w-xs mx-auto">
                  <img
                    src={result.imageUrl}
                    alt={result.identification?.name || 'Coin'}
                    className="w-full h-full object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                  />
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    Confidence: {Math.round((result.confidence || 0) * 100)}%
                  </Badge>
                </div>
              </div>

              {/* Identification Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Identification
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Year:</span>
                    <span className="font-medium">{result.identification?.year || result.year || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Country:</span>
                    <span className="font-medium">{result.identification?.country || result.country || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Denomination:</span>
                    <span className="font-medium">{result.identification?.denomination || result.denomination || 'Unknown'}</span>
                  </div>
                  
                  {(result.identification?.mint || result.mint) && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Mint:</span>
                      <span className="font-medium">{result.identification?.mint || result.mint}</span>
                    </div>
                  )}
                </div>

                {/* Grading */}
                <div className="pt-4 border-t">
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    {getConditionIcon(result.grading?.condition || result.condition)}
                    Condition & Grading
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Condition:</span>
                      <Badge variant="outline">{result.grading?.condition || result.condition || 'Unknown'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade:</span>
                      <Badge variant="outline">{result.grading?.grade || result.grade || 'Ungraded'}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Valuation & Market Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Valuation
                </h4>
                
                <div className="space-y-3">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      ${result.valuation?.current_value || result.estimated_value || 'N/A'}
                    </div>
                    <p className="text-sm text-green-700">Current Market Value</p>
                  </div>
                  
                  {(result.valuation?.low_estimate && result.valuation?.high_estimate) && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">${result.valuation.low_estimate}</div>
                        <div className="text-gray-600">Low Est.</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">${result.valuation.high_estimate}</div>
                        <div className="text-gray-600">High Est.</div>
                      </div>
                    </div>
                  )}
                  
                  {(result.valuation?.market_trend || result.market_trend) && (
                    <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Market Trend:</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {result.valuation?.market_trend || result.market_trend}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Authentication Notes */}
                {(result.authentication_notes && result.authentication_notes.length > 0) && (
                  <div className="pt-4 border-t">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Authentication
                    </h5>
                    <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                      {result.authentication_notes}
                    </div>
                  </div>
                )}

                {/* Errors & Varieties */}
                {(result.errors && result.errors.length > 0) && (
                  <div className="pt-4 border-t">
                    <h5 className="font-medium mb-2 text-red-600">Mint Errors Detected</h5>
                    <div className="space-y-1">
                      {result.errors.map((error: string, errorIndex: number) => (
                        <Badge key={errorIndex} variant="destructive" className="text-xs mr-1 mb-1">
                          {error}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <Button variant="outline" className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Add to Collection
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VisualAnalysisResults;
