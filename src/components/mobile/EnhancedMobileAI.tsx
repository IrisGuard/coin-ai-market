import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  Smartphone, 
  WifiOff, 
  Wifi,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  TrendingUp,
  Eye,
  Camera
} from 'lucide-react';
import { useAdvancedAIBrain } from '@/hooks/useAdvancedAIBrain';
import { useRealAICoinRecognition } from '@/hooks/useRealAICoinRecognition';
import { useMobileStats } from '@/hooks/useMobileStats';
import { toast } from '@/hooks/use-toast';

interface EnhancedMobileAIProps {
  imageBase64: string;
  onAnalysisComplete: (results: any) => void;
}

const EnhancedMobileAI = ({ imageBase64, onAnalysisComplete }: EnhancedMobileAIProps) => {
  const [analysisStage, setAnalysisStage] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [confidenceMetrics, setConfidenceMetrics] = useState<any>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);

  const { enhancedRecognition, providers, isProcessing } = useAdvancedAIBrain();
  const aiRecognition = useRealAICoinRecognition();
  const { stats, logAnalysis } = useMobileStats();

  // Listen for online/offline status
  React.useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const runEnhancedAnalysis = useCallback(async () => {
    if (!imageBase64) {
      toast({
        title: "No Image",
        description: "Please capture an image first",
        variant: "destructive",
      });
      return;
    }

    // 🚨 OFFLINE MODE COMPLETELY DISABLED - ONLY LIVE AI ANALYSIS
    if (isOfflineMode) {
      toast({
        title: "Network Required",
        description: "Please connect to internet for AI coin analysis. Offline mode disabled.",
        variant: "destructive",
      });
      setAnalysisStage('idle');
      return;
    }

    setAnalysisStage('analyzing');
    const startTime = Date.now();

    try {
      // Online mode - use enhanced AI analysis ONLY
      const imageComplexity = calculateImageComplexity(imageBase64);
      const result = await enhancedRecognition(imageBase64, imageComplexity);

      setAnalysisResults(result);
      setConfidenceMetrics(result.metrics);

      // Log the analysis for stats
      const analysisTime = Date.now() - startTime;
      await logAnalysis(analysisTime, result.confidence);

      toast({
        title: "Enhanced Analysis Complete",
        description: `${result.name || 'Coin'} identified with ${Math.round(result.confidence * 100)}% confidence`,
      });

      setAnalysisStage('complete');
      onAnalysisComplete(analysisResults);

    } catch (error) {
      console.error('Enhanced analysis failed:', error);
      setAnalysisStage('idle');
      
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the coin. Please try again.",
        variant: "destructive",
      });
    }
  }, [imageBase64, isOfflineMode, enhancedRecognition, logAnalysis, onAnalysisComplete, analysisResults]);

  const calculateImageComplexity = (base64: string): number => {
    const size = base64.length;
    const hasHighRes = size > 500000; // ~500KB suggests high resolution
    return hasHighRes ? 0.8 : 0.5;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-50';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Enhanced Mobile AI
          </div>
          <div className="flex items-center gap-2">
            {isOfflineMode ? (
              <Badge variant="outline" className="text-red-600 border-red-300">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-300">
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {analysisStage === 'idle' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ready for AI Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">
                {isOfflineMode 
                  ? "Network required: Connect to internet for AI analysis"
                  : "Online mode: Full AI analysis with multiple providers"
                }
              </p>
            </div>
            
            <Button 
              onClick={runEnhancedAnalysis}
              disabled={!imageBase64 || isProcessing || isOfflineMode}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isOfflineMode ? 'Network Required' : 'Start Enhanced Analysis'}
            </Button>

            {/* Provider Status */}
            {!isOfflineMode && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium mb-2">AI Providers Available</h4>
                <div className="grid grid-cols-1 gap-2">
                  {providers.filter(p => p.isActive).map((provider) => (
                    <div key={provider.name} className="flex items-center justify-between text-xs">
                      <span className="capitalize">{provider.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{Math.round(provider.reliability * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {analysisStage === 'analyzing' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto relative">
              <div className="w-full h-full border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <Brain className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Enhanced AI Analysis...</h3>
              <p className="text-sm text-gray-600">
                Analyzing with multiple AI providers for maximum accuracy
              </p>
            </div>
            <Progress value={50} className="w-full" />
          </div>
        )}

        {analysisStage === 'complete' && analysisResults && (
          <Tabs defaultValue="results" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="confidence">Confidence</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="results" className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Analysis Complete</span>
                  {analysisResults.offline && (
                    <Badge variant="outline" className="text-xs">Offline</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Coin:</span>
                    <p className="font-medium">{analysisResults.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Year:</span>
                    <p className="font-medium">{analysisResults.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Grade:</span>
                    <p className="font-medium">{analysisResults.grade}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Value:</span>
                    <p className="font-medium">${analysisResults.estimatedValue}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="confidence" className="space-y-3">
              <div className={`rounded-lg p-3 ${getConfidenceColor(analysisResults.confidence)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Confidence</span>
                  <span className="text-lg font-bold">
                    {Math.round(analysisResults.confidence * 100)}%
                  </span>
                </div>
                <Progress value={analysisResults.confidence * 100} className="h-2" />
              </div>

              {confidenceMetrics && (
                <div className="space-y-2">
                  {Object.entries(confidenceMetrics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(value as number) * 100} className="w-16 h-2" />
                        <span className="w-12 text-right">{Math.round((value as number) * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium mb-2">Analysis Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="capitalize">{analysisResults.provider}</span>
                  </div>
                  {!analysisResults.offline && (
                    <>
                      <div className="flex justify-between">
                        <span>Processing Time:</span>
                        <span>{stats.avgAnalysisTime.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Accuracy:</span>
                        <span>{Math.round(stats.aiAccuracy * 100)}%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMobileAI;
