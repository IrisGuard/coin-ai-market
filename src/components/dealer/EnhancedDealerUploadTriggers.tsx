
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Bot, TrendingUp, Eye, Bell, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useCoinUpload } from '@/hooks/useCoinUpload';

const EnhancedDealerUploadTriggers = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    images,
    isAnalyzing,
    analysisResults,
    coinData,
    uploadProgress,
    dragActive,
    handleFiles,
    handleDrag,
    handleDrop,
    handleUploadAndAnalyze,
    handleSubmitListing,
    removeImage,
    handleCoinDataChange
  } = useCoinUpload();

  // Auto-trigger scraping for uploaded coins
  const triggerScrapingMutation = useMutation({
    mutationFn: async (coinData: any) => {
      const { data, error } = await supabase.functions.invoke('advanced-web-scraper', {
        body: {
          commandType: 'coin_market_research',
          targetUrl: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(coinData.name + ' ' + coinData.year)}`,
          coinData: coinData,
          scrapingConfig: {
            autoTrigger: true,
            dealerUpload: true,
            analysisDepth: 'comprehensive'
          }
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Auto-scraping triggered:', data);
      setNotifications(prev => [...prev, {
        type: 'scraping_started',
        message: `Market research initiated for ${coinData.title}`,
        timestamp: new Date(),
        status: 'success'
      }]);
    }
  });

  // Auto-trigger visual matching
  const triggerVisualMatchingMutation = useMutation({
    mutationFn: async (imageData: any) => {
      const { data, error } = await supabase.functions.invoke('visual-matching-engine', {
        body: {
          analysisId: imageData.analysisId,
          frontImage: imageData.frontImage,
          backImage: imageData.backImage,
          similarityThreshold: 0.7,
          autoTrigger: true
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('✅ Visual matching triggered:', data);
      setNotifications(prev => [...prev, {
        type: 'visual_matching_started',
        message: `Visual matching analysis started - ${data.matchesFound} matches found`,
        timestamp: new Date(),
        status: 'success'
      }]);
    }
  });

  // Enhanced upload handler with auto-triggers
  const handleEnhancedUpload = useCallback(async () => {
    if (!images.length) return;
    
    setIsProcessing(true);
    
    try {
      // Step 1: Upload and analyze
      await handleUploadAndAnalyze();
      
      // Step 2: Auto-trigger scraping
      if (coinData.title && coinData.year) {
        await triggerScrapingMutation.mutateAsync(coinData);
      }
      
      // Step 3: Auto-trigger visual matching
      if (images.length >= 2) {
        await triggerVisualMatchingMutation.mutateAsync({
          analysisId: 'auto-generated-id',
          frontImage: images[0]?.preview,
          backImage: images[1]?.preview
        });
      }
      
      // Step 4: Real-time notification
      setNotifications(prev => [...prev, {
        type: 'upload_complete',
        message: `Coin analysis complete with automated market research and visual matching`,
        timestamp: new Date(),
        status: 'success'
      }]);
      
      toast({
        title: "Upload Complete",
        description: "Coin uploaded with automated analysis and market research",
      });
      
    } catch (error) {
      console.error('❌ Enhanced upload failed:', error);
      setNotifications(prev => [...prev, {
        type: 'upload_error',
        message: `Upload failed: ${error.message}`,
        timestamp: new Date(),
        status: 'error'
      }]);
    } finally {
      setIsProcessing(false);
    }
  }, [images, coinData, handleUploadAndAnalyze, triggerScrapingMutation, triggerVisualMatchingMutation]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-green-600" />
            Enhanced Dealer Upload with Auto-Triggers
            <Badge className="bg-green-100 text-green-800">Auto-Scraping Active</Badge>
            <Badge className="bg-blue-100 text-blue-800">Visual Matching Enabled</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium">Drop coin images here or click to upload</p>
              <p className="text-sm text-gray-500">Supports JPG, PNG files</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button className="mt-4" asChild>
                  <span>Select Files</span>
                </Button>
              </label>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                    {image.uploaded && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Analyzed
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleEnhancedUpload}
                disabled={!images.length || isAnalyzing || isProcessing}
                className="flex items-center gap-2"
              >
                {isAnalyzing || isProcessing ? (
                  <>
                    <Bot className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4" />
                    Analyze & Auto-Research
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSubmitListing}
                disabled={!coinData.title}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Create Multi-Listing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-600" />
              Real-time Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {notifications.slice(-5).map((notification, index) => (
                <Alert key={index} className={notification.status === 'error' ? 'border-red-200' : 'border-green-200'}>
                  <Bell className="h-4 w-4" />
                  <AlertDescription className="flex justify-between items-center">
                    <span>{notification.message}</span>
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results Display */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-purple-600" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Coin Identification</h4>
                <p><strong>Name:</strong> {analysisResults.name}</p>
                <p><strong>Year:</strong> {analysisResults.year}</p>
                <p><strong>Grade:</strong> {analysisResults.grade}</p>
                <p><strong>Country:</strong> {analysisResults.country}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Market Analysis</h4>
                <p><strong>Estimated Value:</strong> ${analysisResults.estimatedValue}</p>
                <p><strong>Rarity:</strong> {analysisResults.rarity}</p>
                <p><strong>Confidence:</strong> {Math.round(analysisResults.confidence * 100)}%</p>
                <p><strong>AI Provider:</strong> {analysisResults.aiProvider}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedDealerUploadTriggers;
