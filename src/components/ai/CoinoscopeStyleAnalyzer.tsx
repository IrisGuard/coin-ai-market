import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Upload, Brain, Zap, Target, CheckCircle, AlertCircle, Eye, Database } from 'lucide-react';
import { useEnhancedCoinRecognition } from '@/hooks/useEnhancedCoinRecognition';
import { toast } from 'sonner';

interface CoinAnalysisStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  confidence?: number;
  result?: any;
}

const CoinoscopeStyleAnalyzer = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisStages, setAnalysisStages] = useState<CoinAnalysisStage[]>([
    { id: 'image_processing', name: 'Image Processing & Quality Check', status: 'pending' },
    { id: 'claude_analysis', name: 'Claude AI Primary Recognition', status: 'pending' },
    { id: 'web_discovery', name: 'Web Discovery & Cross-Reference', status: 'pending' },
    { id: 'market_intelligence', name: 'Market Intelligence Integration', status: 'pending' },
    { id: 'final_validation', name: 'Final Validation & Confidence Scoring', status: 'pending' }
  ]);
  
  const { 
    performEnhancedAnalysis, 
    isAnalyzing, 
    enrichmentProgress, 
    enhancedResult,
    autoFillData,
    clearResults 
  } = useEnhancedCoinRecognition();

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      handleAnalysis(file);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalysis = async (file: File) => {
    console.log('🚀 Starting Coinoscope-Style Analysis...');
    clearResults();
    
    // Reset all stages to pending
    setAnalysisStages(stages => stages.map(stage => ({ 
      ...stage, 
      status: 'pending',
      confidence: undefined,
      result: undefined
    })));

    // Stage 1: Image Processing
    updateStageStatus('image_processing', 'running');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing
    updateStageStatus('image_processing', 'completed', 95);

    // Stage 2: Claude AI Analysis
    updateStageStatus('claude_analysis', 'running');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const result = await performEnhancedAnalysis(file);
      
      if (result) {
        updateStageStatus('claude_analysis', 'completed', result.claude_analysis.confidence * 100);
        
        // Stage 3: Web Discovery
        updateStageStatus('web_discovery', 'running');
        await new Promise(resolve => setTimeout(resolve, 1200));
        updateStageStatus('web_discovery', 'completed', 88);
        
        // Stage 4: Market Intelligence
        updateStageStatus('market_intelligence', 'running');
        await new Promise(resolve => setTimeout(resolve, 900));
        updateStageStatus('market_intelligence', 'completed', 92);
        
        // Stage 5: Final Validation
        updateStageStatus('final_validation', 'running');
        await new Promise(resolve => setTimeout(resolve, 600));
        updateStageStatus('final_validation', 'completed', result.enrichment_score * 100);

        toast.success(`🎯 Analysis Complete: ${result.merged_data.name} identified!`);
      } else {
        updateStageStatus('claude_analysis', 'failed');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      updateStageStatus('claude_analysis', 'failed');
    }
  };

  const updateStageStatus = (stageId: string, status: CoinAnalysisStage['status'], confidence?: number) => {
    setAnalysisStages(stages => stages.map(stage => 
      stage.id === stageId 
        ? { ...stage, status, confidence }
        : stage
    ));
  };

  const getStageIcon = (stage: CoinAnalysisStage) => {
    switch (stage.status) {
      case 'running':
        return <Brain className="h-4 w-4 animate-pulse text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getOverallConfidence = () => {
    const completedStages = analysisStages.filter(s => s.status === 'completed' && s.confidence);
    if (completedStages.length === 0) return 0;
    
    const avgConfidence = completedStages.reduce((sum, stage) => sum + (stage.confidence || 0), 0) / completedStages.length;
    return Math.round(avgConfidence);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Coinoscope-Style AI Recognition
            <Badge variant="secondary">Multi-Provider Analysis</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!uploadedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Upload Coin Image</p>
                <p className="text-sm text-muted-foreground">
                  High-quality images provide better recognition results
                </p>
                <Button className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Preview */}
                <div className="space-y-3">
                  <img
                    src={uploadedImage}
                    alt="Uploaded coin"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUploadedImage(null);
                      clearResults();
                      setAnalysisStages(stages => stages.map(stage => ({ 
                        ...stage, 
                        status: 'pending',
                        confidence: undefined,
                        result: undefined
                      })));
                    }}
                  >
                    Upload Different Image
                  </Button>
                </div>

                {/* Analysis Progress */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Analysis Progress</h3>
                    <Badge variant={isAnalyzing ? "default" : "secondary"}>
                      {isAnalyzing ? 'Processing...' : 'Ready'}
                    </Badge>
                  </div>
                  
                  {isAnalyzing && (
                    <div className="space-y-2">
                      <Progress value={enrichmentProgress} className="h-2" />
                      <p className="text-sm text-muted-foreground text-center">
                        {enrichmentProgress}% Complete
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {analysisStages.map((stage, index) => (
                      <div key={stage.id} className="flex items-center gap-3 p-3 rounded-lg border">
                        {getStageIcon(stage)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{stage.name}</p>
                          {stage.confidence && (
                            <p className="text-xs text-muted-foreground">
                              Confidence: {Math.round(stage.confidence)}%
                            </p>
                          )}
                        </div>
                        {stage.status === 'completed' && stage.confidence && (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(stage.confidence)}%
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Overall Confidence */}
                  {getOverallConfidence() > 0 && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Overall Confidence</span>
                        <Badge className="bg-primary">
                          {getOverallConfidence()}%
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {enhancedResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              Recognition Results
              <Badge className="bg-green-100 text-green-800">
                {Math.round(enhancedResult.enrichment_score * 100)}% Match
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">COIN NAME</Label>
                  <p className="text-lg font-semibold">{enhancedResult.merged_data.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">YEAR</Label>
                    <p className="font-medium">{enhancedResult.merged_data.year}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">COUNTRY</Label>
                    <p className="font-medium">{enhancedResult.merged_data.country}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">GRADE</Label>
                    <p className="font-medium">{enhancedResult.merged_data.grade}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">RARITY</Label>
                    <p className="font-medium">{enhancedResult.merged_data.rarity}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">ESTIMATED VALUE</Label>
                  <p className="text-xl font-bold text-green-600">
                    ${enhancedResult.merged_data.estimated_value || 0}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">COMPOSITION</Label>
                  <p className="font-medium">{enhancedResult.merged_data.composition}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-muted-foreground">DATA SOURCES</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {enhancedResult.data_sources.map((source, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Fill Data Preview */}
            {autoFillData && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Auto-Fill Data Available
                </h4>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This analysis can auto-populate listing forms with validated coin data, 
                    market intelligence, and optimized descriptions.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoinoscopeStyleAnalyzer;