
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Link, Zap, Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEnhancedImageProcessing } from '@/hooks/useEnhancedImageProcessing';
import { useEnhancedAIAnalysis } from '@/hooks/useEnhancedAIAnalysis';
import { useCoinUpload } from '@/hooks/useCoinUpload';

const EnhancedCoinUploadManager = () => {
  const [selectedMode, setSelectedMode] = useState<'image' | 'url'>('image');
  const [siteUrl, setSiteUrl] = useState('');
  const [processedImages, setProcessedImages] = useState<any[]>([]);
  
  const { 
    processImage, 
    processBatchImages, 
    isProcessing: isImageProcessing, 
    processingProgress 
  } = useEnhancedImageProcessing();
  
  const {
    analyzeWithAI,
    isAnalyzing,
    analysisProgress,
    results: analysisResults,
    availableCommands
  } = useEnhancedAIAnalysis();

  const {
    images,
    coinData,
    handleFiles,
    handleCoinDataChange,
    handleSubmitListing,
    isSubmitting
  } = useCoinUpload();

  const handleImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    try {
      const processed = await processBatchImages(fileArray);
      setProcessedImages(processed);

      // Automatically analyze the first processed image
      if (processed.length > 0) {
        await analyzeWithAI({
          type: 'image',
          imageUrl: processed[0].processedUrl
        });
      }
    } catch (error) {
      console.error('Failed to process images:', error);
    }
  };

  const handleSiteAnalysis = async () => {
    if (!siteUrl.trim()) return;

    try {
      await analyzeWithAI({
        type: 'site_url',
        siteUrl: siteUrl.trim()
      });
    } catch (error) {
      console.error('Failed to analyze site:', error);
    }
  };

  const handleUseAnalysisResult = (result: any) => {
    handleCoinDataChange({
      ...coinData,
      title: result.coin_type,
      year: result.year.toString(),
      grade: result.grade,
      price: result.estimated_value.replace('$', ''),
      composition: result.metal,
      weight: result.weight?.replace('g', '') || '',
      rarity: result.error ? 'Error Coin' : 'Common'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Enhanced AI Coin Analysis
            <Badge variant="outline" className="ml-2">
              {availableCommands.length} AI Commands Available
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMode} onValueChange={(value: any) => setSelectedMode(value)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Image Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Site URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-4">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">Upload Coin Images</h3>
                <p className="text-gray-600 mb-4">
                  Upload up to 10 images. They will be automatically processed with white background and circle crop.
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <Label htmlFor="image-upload">
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Select Images
                    </span>
                  </Button>
                </Label>
              </div>

              {(isImageProcessing || isAnalyzing) && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
                    <span className="text-sm font-medium">
                      {isImageProcessing ? 'Processing images...' : 'Analyzing with AI...'}
                    </span>
                  </div>
                  <Progress value={isImageProcessing ? processingProgress : analysisProgress} />
                </div>
              )}

              {processedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {processedImages.map((img, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      <img
                        src={img.preview}
                        alt={`Processed ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg border-2 border-green-200"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Processed
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="site-url">Website URL</Label>
                  <Input
                    id="site-url"
                    type="url"
                    placeholder="https://www.ebay.com/itm/..."
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Supported: eBay, Heritage Auctions, NGC, PCGS
                  </p>
                </div>

                <Button
                  onClick={handleSiteAnalysis}
                  disabled={!siteUrl.trim() || isAnalyzing}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Analyzing Site...
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      Analyze Website
                    </>
                  )}
                </Button>

                {isAnalyzing && (
                  <div className="space-y-2">
                    <Progress value={analysisProgress} />
                    <p className="text-sm text-center text-gray-600">
                      Parsing website data...
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Analysis Results */}
          {analysisResults.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">Analysis Results</h3>
              {analysisResults.map((result, index) => (
                <Card key={index} className="border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-green-700">{result.coin_type}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Year:</span> {result.year}
                          </div>
                          <div>
                            <span className="font-medium">Grade:</span> {result.grade}
                          </div>
                          <div>
                            <span className="font-medium">Metal:</span> {result.metal}
                          </div>
                          <div>
                            <span className="font-medium">Value:</span> {result.estimated_value}
                          </div>
                        </div>
                        <Badge variant="outline">
                          Confidence: {Math.round(result.confidence * 100)}%
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleUseAnalysisResult(result)}
                        variant="outline"
                        size="sm"
                      >
                        Use This Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCoinUploadManager;
