
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  Brain, 
  Zap, 
  Camera, 
  Search, 
  Target, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  Shield
} from 'lucide-react';
import { useAdvancedAIBrain } from '@/hooks/useAdvancedAIBrain';
import { useImageHandling } from '@/hooks/useImageHandling';
import AIConfidenceMetrics from './AIConfidenceMetrics';
import VisualAnalysisResults from './VisualAnalysisResults';
import MultiProviderComparison from './MultiProviderComparison';

interface AdvancedVisualAIProps {
  onAnalysisComplete: (results: any) => void;
}

const AdvancedVisualAI: React.FC<AdvancedVisualAIProps> = ({ onAnalysisComplete }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'results'>('upload');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  const { enhancedRecognition, providers, isProcessing } = useAdvancedAIBrain();
  const { uploadImage, compressImage } = useImageHandling();

  const handleImageSelection = useCallback(async (files: FileList) => {
    const validFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size < 10 * 1024 * 1024
    );
    
    if (validFiles.length > 5) {
      validFiles.splice(5);
    }
    
    setSelectedImages(validFiles);
    setCurrentStep('upload');
  }, []);

  const startAdvancedAnalysis = useCallback(async () => {
    if (selectedImages.length === 0) return;
    
    setCurrentStep('analysis');
    setAnalysisProgress(0);
    
    try {
      const results = [];
      
      for (let i = 0; i < selectedImages.length; i++) {
        const file = selectedImages[i];
        setAnalysisProgress((i / selectedImages.length) * 100);
        
        // Compress and upload image
        const compressedFile = await compressImage(file);
        const imageUrl = await uploadImage(compressedFile);
        
        // Calculate image complexity for provider selection
        const imageComplexity = calculateImageComplexity(file);
        
        // Run enhanced AI recognition
        const result = await enhancedRecognition(imageUrl, imageComplexity);
        
        results.push({
          id: i,
          filename: file.name,
          imageUrl,
          ...result
        });
      }
      
      setAnalysisProgress(100);
      setAnalysisResults(results);
      setCurrentStep('results');
      onAnalysisComplete(results);
      
    } catch (error) {
      console.error('Advanced analysis failed:', error);
      setCurrentStep('upload');
      setAnalysisProgress(0);
    }
  }, [selectedImages, enhancedRecognition, uploadImage, compressImage, onAnalysisComplete]);

  const calculateImageComplexity = (file: File): number => {
    // Simple complexity calculation based on file size and estimated resolution
    const sizeScore = Math.min(file.size / (2 * 1024 * 1024), 1); // Normalize to 2MB
    const nameComplexity = file.name.toLowerCase().includes('detailed') ? 0.8 : 0.5;
    return Math.min((sizeScore + nameComplexity) / 2, 1);
  };

  const renderUploadSection = () => (
    <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-blue-600" />
          Advanced Visual AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => e.target.files && handleImageSelection(e.target.files)}
            className="hidden"
            id="advanced-upload"
            max={5}
          />
          <label htmlFor="advanced-upload">
            <div className="p-8 border-2 border-dashed border-blue-400 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
              <Eye className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Upload High-Quality Images
              </h3>
              <p className="text-gray-600 mb-4">
                Upload up to 5 images for advanced AI analysis
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Select Images
              </Button>
            </div>
          </label>
        </div>

        {selectedImages.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold">Selected Images ({selectedImages.length}/5)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Badge className="absolute top-1 right-1 text-xs">
                    {Math.round(file.size / 1024)}KB
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={startAdvancedAnalysis}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Start Advanced AI Analysis
                </>
              )}
            </Button>
          </div>
        )}

        {/* AI Provider Status */}
        <div className="bg-white/80 rounded-lg p-4">
          <h5 className="font-medium mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            AI Provider Status
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {providers.map((provider) => (
              <div key={provider.name} className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  provider.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="capitalize">{provider.name}</span>
                <Badge variant="outline" className="text-xs">
                  {Math.round(provider.reliability * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAnalysisSection = () => (
    <Card className="border-2 border-purple-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-purple-600 animate-pulse" />
          AI Analysis in Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <div className="w-full h-full border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Advanced AI Processing</h3>
          <p className="text-gray-600 mb-4">
            Analyzing images with multiple AI providers for maximum accuracy
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analysis Progress</span>
            <span>{Math.round(analysisProgress)}%</span>
          </div>
          <Progress value={analysisProgress} className="w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Multi-provider verification</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Confidence scoring</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Visual feature analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Market data integration</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderResultsSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-green-600" />
            Advanced Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="confidence">Confidence</TabsTrigger>
              <TabsTrigger value="visual">Visual Analysis</TabsTrigger>
              <TabsTrigger value="comparison">AI Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <VisualAnalysisResults results={analysisResults} />
            </TabsContent>

            <TabsContent value="confidence" className="mt-6">
              <AIConfidenceMetrics results={analysisResults} />
            </TabsContent>

            <TabsContent value="visual" className="mt-6">
              <div className="text-center py-8">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Visual feature analysis coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <MultiProviderComparison results={analysisResults} providers={providers} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {currentStep === 'upload' && renderUploadSection()}
      {currentStep === 'analysis' && renderAnalysisSection()}
      {currentStep === 'results' && renderResultsSection()}
    </motion.div>
  );
};

export default AdvancedVisualAI;
