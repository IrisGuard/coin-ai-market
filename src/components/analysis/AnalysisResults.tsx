
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  TrendingUp, 
  Globe, 
  AlertTriangle, 
  Eye, 
  BarChart3,
  ExternalLink,
  RefreshCw,
  Star,
  DollarSign
} from 'lucide-react';
import type { DualImageAnalysisResult } from '@/hooks/useDualImageAnalysis';

interface AnalysisResultsProps {
  results: DualImageAnalysisResult;
  onNewAnalysis: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, onNewAnalysis }) => {
  const { analysisResults, webDiscoveryResults, visualMatches, errorPatterns, marketAnalysis } = results;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Images */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Complete Dual-Side Analysis Results
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Confidence: {Math.round(analysisResults.confidence * 100)}%</span>
                  <Badge variant="outline">{analysisResults.grade}</Badge>
                  <Badge variant="secondary">{analysisResults.rarity}</Badge>
                </div>
              </div>
              <Button onClick={onNewAnalysis} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                New Analysis
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Coin Images */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Front Side (Obverse)</h3>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={`data:image/jpeg;base64,${results.frontImage}`}
                      alt="Coin Front"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Back Side (Reverse)</h3>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={`data:image/jpeg;base64,${results.backImage}`}
                      alt="Coin Back"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Coin Information */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">{analysisResults.coinName}</h4>
                <p className="text-blue-700">{analysisResults.year} • {analysisResults.country}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Estimated Value</h4>
                <p className="text-green-700">${analysisResults.estimatedValue.min} - ${analysisResults.estimatedValue.max}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900">Composition</h4>
                <p className="text-purple-700">{analysisResults.composition}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="web-discovery" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Web Discovery ({webDiscoveryResults.length})
            </TabsTrigger>
            <TabsTrigger value="visual-matches" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visual Matches ({visualMatches.length})
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Errors ({errorPatterns.length})
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Market Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Detailed Coin Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Denomination</label>
                      <p className="text-lg">{analysisResults.denomination}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mint</label>
                      <p className="text-lg">{analysisResults.mint || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Grade Assessment</label>
                      <p className="text-lg">{analysisResults.grade}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Diameter</label>
                      <p className="text-lg">{analysisResults.diameter ? `${analysisResults.diameter}mm` : 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Weight</label>
                      <p className="text-lg">{analysisResults.weight ? `${analysisResults.weight}g` : 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Rarity</label>
                      <p className="text-lg">{analysisResults.rarity}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="web-discovery" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Global Web Discovery Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webDiscoveryResults.map((result, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.sourceType.toUpperCase()}</Badge>
                          <span className="text-sm text-gray-600">
                            Match: {Math.round(result.coinMatchConfidence * 100)}%
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">{String(result.extractedData?.title || 'Coin Listing')}</p>
                          <p className="text-sm text-gray-600">{String(result.extractedData?.condition || 'Condition not specified')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            ${result.priceData?.current_price || result.priceData?.realized_price || 'Price not available'}
                          </p>
                          <p className="text-sm text-gray-600">{String(result.priceData?.currency || 'USD')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {webDiscoveryResults.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No web discovery results found yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visual-matches" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Visual Similarity Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visualMatches.map((match, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">
                            {Math.round(match.similarityScore * 100)}% Similar
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Grade: {String(match.coinDetails?.grade || 'Not specified')}</p>
                          <p className="text-sm text-gray-600">Population: {String(match.coinDetails?.population || 'Unknown')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">
                            Guide Value: ${match.priceInfo?.guide_value || 'Not available'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {visualMatches.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No visual matches found yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Error Detection Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {errorPatterns.map((error, index) => (
                    <div key={index} className="p-4 border rounded-lg border-orange-200 bg-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-orange-900">{error.errorType}</h4>
                        <Badge variant="destructive">{Math.round(error.confidenceScore * 100)}% Confidence</Badge>
                      </div>
                      <p className="text-orange-800 mb-2">{error.errorDescription}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Rarity Multiplier:</span> {error.rarityMultiplier}x
                        </div>
                        <div>
                          <span className="font-medium">Estimated Premium:</span> +${error.estimatedPremium}
                        </div>
                      </div>
                    </div>
                  ))}
                  {errorPatterns.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                        <Coins className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-green-600 font-medium">No errors detected - Clean coin!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Market Analysis & Investment Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Current Market Value
                      </h4>
                      <div className="space-y-1">
                        <p>Low: ${marketAnalysis.currentMarketValue?.low || 'N/A'}</p>
                        <p>Average: ${marketAnalysis.currentMarketValue?.average || 'N/A'}</p>
                        <p>High: ${marketAnalysis.currentMarketValue?.high || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Recent Sales Data
                      </h4>
                      <div className="space-y-1">
                        <p>30-day Average: ${marketAnalysis.recentSales?.avg_price_30d || 'N/A'}</p>
                        <p>Volume (30 days): {marketAnalysis.recentSales?.volume_30d || 'N/A'} sales</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Investment Recommendation</h4>
                      <p className="text-purple-800">{marketAnalysis.investmentRecommendation}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Market Outlook</h4>
                      <p className="text-gray-800">{marketAnalysis.marketOutlook}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalysisResults;
