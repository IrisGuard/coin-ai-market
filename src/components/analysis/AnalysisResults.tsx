
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  ExternalLink,
  Star,
  DollarSign,
  Calendar,
  MapPin,
  Zap
} from 'lucide-react';
import type { DualImageAnalysisResult } from '@/hooks/useDualImageAnalysis';

interface AnalysisResultsProps {
  results: DualImageAnalysisResult;
  onNewAnalysis?: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, onNewAnalysis }) => {
  const { analysisResults, webDiscoveryResults, visualMatches, errorPatterns, marketAnalysis } = results;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with Coin Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {analysisResults.coinName} ({analysisResults.year})
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {Math.round(analysisResults.confidence * 100)}% Confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coin Images */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-600">Front (Obverse)</label>
                  <img 
                    src={results.frontImage} 
                    alt="Front side" 
                    className="w-full h-32 object-contain bg-gray-50 rounded-lg border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-purple-600">Back (Reverse)</label>
                  <img 
                    src={results.backImage} 
                    alt="Back side" 
                    className="w-full h-32 object-contain bg-gray-50 rounded-lg border"
                  />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Country</label>
                  <div className="font-medium">{analysisResults.country}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Denomination</label>
                  <div className="font-medium">{analysisResults.denomination}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Grade</label>
                  <div className="font-medium">{analysisResults.grade}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Rarity</label>
                  <Badge variant="secondary">{analysisResults.rarity}</Badge>
                </div>
              </div>
            </div>

            {/* Value Info */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Estimated Value</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  ${analysisResults.estimatedValue.min} - ${analysisResults.estimatedValue.max}
                </div>
                <div className="text-sm text-gray-600">
                  Average: ${analysisResults.estimatedValue.average}
                </div>
              </div>

              {analysisResults.errors.length > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-700">Errors Detected</span>
                  </div>
                  <div className="space-y-1">
                    {analysisResults.errors.map((error, index) => (
                      <Badge key={index} variant="destructive" className="mr-1">
                        {error}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results Tabs */}
      <Tabs defaultValue="web-discovery" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="web-discovery" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Web Discovery ({webDiscoveryResults.length})
          </TabsTrigger>
          <TabsTrigger value="visual-matches" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visual Matches ({visualMatches.length})
          </TabsTrigger>
          <TabsTrigger value="error-patterns" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Error Analysis ({errorPatterns.length})
          </TabsTrigger>
          <TabsTrigger value="market-analysis" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Market Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="web-discovery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Global Web Discovery Results
              </CardTitle>
              <p className="text-muted-foreground">
                Found {webDiscoveryResults.length} relevant listings across multiple platforms
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webDiscoveryResults.slice(0, 10).map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="capitalize">
                        {result.sourceType}
                      </Badge>
                      <div>
                        <div className="font-medium">
                          Match Confidence: {Math.round(result.coinMatchConfidence * 100)}%
                        </div>
                        {result.priceData?.current_price && (
                          <div className="text-sm text-gray-600">
                            Price: ${result.priceData.current_price}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={result.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visual-matches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visual Similarity Matches
              </CardTitle>
              <p className="text-muted-foreground">
                Similar coins found through image matching
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visualMatches.slice(0, 9).map((match, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <img 
                      src={match.matchedImageUrl} 
                      alt="Similar coin" 
                      className="w-full h-32 object-contain bg-gray-50 rounded mb-3"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {Math.round(match.similarityScore * 100)}% Similar
                        </Badge>
                        {match.priceInfo?.price && (
                          <span className="text-sm font-medium text-green-600">
                            ${match.priceInfo.price}
                          </span>
                        )}
                      </div>
                      {match.sourceUrl && (
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Source
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="error-patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Error Pattern Analysis
              </CardTitle>
              <p className="text-muted-foreground">
                Detected minting errors and their rarity assessment
              </p>
            </CardHeader>
            <CardContent>
              {errorPatterns.length > 0 ? (
                <div className="space-y-4">
                  {errorPatterns.map((pattern, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="font-medium">{pattern.errorType}</span>
                        </div>
                        <Badge variant="destructive">
                          {Math.round(pattern.confidenceScore * 100)}% Confidence
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{pattern.errorDescription}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">Rarity Multiplier</label>
                          <div className="font-medium text-purple-600">
                            {pattern.rarityMultiplier}x
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Estimated Premium</label>
                          <div className="font-medium text-green-600">
                            +${pattern.estimatedPremium}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No significant minting errors detected
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market-analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Analysis & Investment Outlook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Current Market Value</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      ${marketAnalysis.currentMarketValue?.average || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium mb-2">Investment Recommendation</h4>
                    <p className="text-green-700">
                      {marketAnalysis.investmentRecommendation || 'Analysis in progress...'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium mb-2">Market Outlook</h4>
                    <p className="text-purple-700">
                      {marketAnalysis.marketOutlook || 'Analyzing market trends...'}
                    </p>
                  </div>
                  
                  {marketAnalysis.recentSales && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium mb-2">Recent Sales</h4>
                      <div className="text-sm space-y-1">
                        {Object.entries(marketAnalysis.recentSales).slice(0, 3).map(([date, price], index) => (
                          <div key={index} className="flex justify-between">
                            <span>{date}</span>
                            <span className="font-medium">${price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={onNewAnalysis} variant="outline" className="flex-1">
          <Zap className="h-4 w-4 mr-2" />
          Analyze Another Coin
        </Button>
        <Button className="flex-1">
          <Star className="h-4 w-4 mr-2" />
          Save to Collection
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResults;
