
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCoins } from '@/hooks/useCoins';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { toast } from '@/hooks/use-toast';

const AICoinsSection = () => {
  const { user } = useAuth();
  const { data: allCoins, isLoading } = useCoins();
  const aiRecognition = useRealAICoinRecognition();
  const [selectedCoinForAnalysis, setSelectedCoinForAnalysis] = useState<string | null>(null);

  // Filter coins for current user
  const userCoins = allCoins?.filter(coin => coin.user_id === user?.id) || [];
  
  // Separate coins by AI status - using composition field as indicator of AI analysis
  const aiAnalyzedCoins = userCoins.filter(coin => coin.composition && coin.composition !== '');
  const pendingAnalysisCoins = userCoins.filter(coin => !coin.composition || coin.composition === '');

  const handleAnalyzeCoin = async (coinId: string, imageUrl: string) => {
    if (!imageUrl) {
      toast({
        title: "No Image",
        description: "This coin needs an image to be analyzed",
        variant: "destructive",
      });
      return;
    }

    setSelectedCoinForAnalysis(coinId);
    
    try {
      await aiRecognition.mutateAsync({
        image: imageUrl,
        additionalImages: []
      });
      
      toast({
        title: "Analysis Complete",
        description: "Coin has been analyzed with AI",
      });
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setSelectedCoinForAnalysis(null);
    }
  };

  const handleRescan = async (coinId: string, imageUrl: string) => {
    await handleAnalyzeCoin(coinId, imageUrl);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Coin Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading your coins...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{userCoins.length}</div>
                <div className="text-sm text-gray-600">Total Coins</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{aiAnalyzedCoins.length}</div>
                <div className="text-sm text-gray-600">AI Analyzed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{pendingAnalysisCoins.length}</div>
                <div className="text-sm text-gray-600">Pending Analysis</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coin List with AI Status */}
      <Card>
        <CardHeader>
          <CardTitle>My Coins Collection</CardTitle>
          <CardDescription>
            View and manage AI analysis for your coins
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userCoins.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No coins found. Upload some coins to get started.
            </div>
          ) : (
            userCoins.map((coin) => (
              <div key={coin.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{coin.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {coin.composition && coin.composition !== '' ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            AI Analyzed
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            No AI Analysis
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {coin.composition && coin.composition !== '' ? (
                          <div className="grid grid-cols-2 gap-4">
                            <span>Material: {coin.composition || 'Unknown'}</span>
                            <span>Grade: {coin.grade}</span>
                            <span>Year: {coin.year}</span>
                            <span>Country: {coin.country}</span>
                            <span>Value: ${coin.price}</span>
                            <span>Confidence: 85%</span>
                          </div>
                        ) : (
                          <span>Basic info only - No AI analysis available</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    {coin.composition && coin.composition !== '' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRescan(coin.id, coin.image)}
                        disabled={selectedCoinForAnalysis === coin.id || aiRecognition.isPending}
                      >
                        {selectedCoinForAnalysis === coin.id ? (
                          <>
                            <Zap className="w-4 h-4 mr-1 animate-pulse" />
                            Re-scanning...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-1" />
                            Re-scan
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAnalyzeCoin(coin.id, coin.image)}
                        disabled={selectedCoinForAnalysis === coin.id || aiRecognition.isPending}
                      >
                        {selectedCoinForAnalysis === coin.id ? (
                          <>
                            <Zap className="w-4 h-4 mr-1 animate-pulse" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-1" />
                            Analyze with AI
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AICoinsSection;
