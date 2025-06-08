
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Award, 
  AlertTriangle,
  TrendingUp,
  Scale,
  Ruler,
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

  const primaryResult = results[0];
  const analysis = primaryResult.analysis || primaryResult;

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'extremely rare': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'very rare': return 'bg-red-100 text-red-800 border-red-200';
      case 'rare': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'uncommon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade?.includes('MS') || grade?.includes('PF')) return 'bg-blue-100 text-blue-800';
    if (grade?.includes('AU')) return 'bg-green-100 text-green-800';
    if (grade?.includes('XF') || grade?.includes('EF')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Primary Identification */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-blue-600" />
            Coin Identification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {analysis.name || 'Unknown Coin'}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getRarityColor(analysis.rarity)}>
                {analysis.rarity || 'Common'}
              </Badge>
              <Badge className={getGradeColor(analysis.grade)}>
                {analysis.grade || 'Ungraded'}
              </Badge>
              <Badge variant="outline" className="border-green-300 text-green-700">
                {Math.round((analysis.confidence || 0.5) * 100)}% Confidence
              </Badge>
            </div>
            {analysis.historical_significance && (
              <p className="text-sm text-gray-600 italic">
                {analysis.historical_significance}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Year</p>
                <p className="font-semibold">{analysis.year || 'Unknown'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Country</p>
                <p className="font-semibold">{analysis.country || 'Unknown'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Denomination</p>
                <p className="font-semibold">{analysis.denomination || 'Unknown'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Composition</p>
                <p className="font-semibold">{analysis.composition || 'Unknown'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {analysis.mint && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Mint</p>
                  <p className="font-semibold">{analysis.mint}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Market Trend</p>
                <p className="font-semibold capitalize">
                  {analysis.market_trend || 'Stable'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Physical Specifications */}
      {(analysis.diameter || analysis.weight) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-gray-600" />
              Physical Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {analysis.diameter && (
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Diameter: </span>
                  <span className="font-medium">{analysis.diameter}mm</span>
                </div>
              )}
              {analysis.weight && (
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Weight: </span>
                  <span className="font-medium">{analysis.weight}g</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Valuation */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Estimated Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-green-600">
              ${analysis.estimated_value?.toFixed(2) || '0.00'}
            </div>
            <p className="text-sm text-gray-600">
              Based on current market conditions and coin grade
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Errors and Varieties */}
      {(analysis.errors?.length > 0 || analysis.varieties?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.errors?.length > 0 && (
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-5 h-5" />
                  Mint Errors Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.errors.map((error: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {analysis.varieties?.length > 0 && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Award className="w-5 h-5" />
                  Known Varieties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.varieties.map((variety: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{variety}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Authentication Notes */}
      {analysis.authentication_notes && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Shield className="w-5 h-5" />
              Authentication Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              {analysis.authentication_notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisualAnalysisResults;
