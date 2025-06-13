
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, Bot, TrendingUp, Eye, Bell, CheckCircle, Zap } from 'lucide-react';
import { useConnectedSystemFlow } from '@/hooks/useConnectedSystemFlow';
import { useCoinUpload } from '@/hooks/useCoinUpload';

const EnhancedDealerUploadTriggers = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  
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
    removeImage,
    handleCoinDataChange
  } = useCoinUpload();

  const {
    flowStatus,
    isExecuting,
    triggerCompleteFlow,
    error
  } = useConnectedSystemFlow();

  // Calculate overall progress
  const getOverallProgress = () => {
    const steps = Object.values(flowStatus);
    const completedSteps = steps.filter(Boolean).length;
    return (completedSteps / steps.length) * 100;
  };

  // Enhanced upload handler with complete system flow
  const handleEnhancedUpload = useCallback(async () => {
    if (!images.length) {
      setNotifications(prev => [...prev, {
        type: 'error',
        message: 'Please select at least one image to upload',
        timestamp: new Date(),
        status: 'error'
      }]);
      return;
    }
    
    // Convert image objects to File objects
    const fileArray = images.map(img => img.file).filter(Boolean) as File[];
    
    if (fileArray.length === 0) {
      setNotifications(prev => [...prev, {
        type: 'error',
        message: 'No valid files found for upload',
        timestamp: new Date(),
        status: 'error'
      }]);
      return;
    }

    // Add start notification
    setNotifications(prev => [...prev, {
      type: 'flow_started',
      message: 'Starting complete system flow: Upload → AI Analysis → Visual Match → Market Research → Listing',
      timestamp: new Date(),
      status: 'info'
    }]);

    // Trigger the complete connected flow
    triggerCompleteFlow(fileArray, coinData);
  }, [images, coinData, triggerCompleteFlow]);

  // Add real-time flow notifications
  React.useEffect(() => {
    if (flowStatus.upload && !flowStatus.analysis) {
      setNotifications(prev => [...prev, {
        type: 'upload_complete',
        message: 'Images uploaded successfully, starting AI analysis...',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
    
    if (flowStatus.analysis && !flowStatus.visualMatch) {
      setNotifications(prev => [...prev, {
        type: 'analysis_complete',
        message: 'AI analysis complete, searching for visual matches...',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
    
    if (flowStatus.visualMatch && !flowStatus.marketResearch) {
      setNotifications(prev => [...prev, {
        type: 'visual_match_complete',
        message: 'Visual matching complete, conducting market research...',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
    
    if (flowStatus.marketResearch && !flowStatus.listing) {
      setNotifications(prev => [...prev, {
        type: 'market_research_complete',
        message: 'Market research complete, creating marketplace listing...',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
    
    if (flowStatus.listing) {
      setNotifications(prev => [...prev, {
        type: 'flow_complete',
        message: 'Complete system flow executed successfully! Coin is now listed.',
        timestamp: new Date(),
        status: 'success'
      }]);
    }
  }, [flowStatus]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6 text-green-600" />
            Enhanced Dealer Upload with Complete System Flow
            <Badge className="bg-green-100 text-green-800">Fully Connected</Badge>
            <Badge className="bg-blue-100 text-blue-800">Auto-Triggers Active</Badge>
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
              <p className="text-sm text-gray-500">Triggers complete AI analysis and marketplace listing flow</p>
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
                          Ready
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Flow Progress */}
            {isExecuting && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600 animate-pulse" />
                  <span className="font-medium">Executing Complete System Flow</span>
                </div>
                <Progress value={getOverallProgress()} className="h-2" />
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className={`text-center p-2 rounded ${flowStatus.upload ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    Upload
                  </div>
                  <div className={`text-center p-2 rounded ${flowStatus.analysis ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    AI Analysis
                  </div>
                  <div className={`text-center p-2 rounded ${flowStatus.visualMatch ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    Visual Match
                  </div>
                  <div className={`text-center p-2 rounded ${flowStatus.marketResearch ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    Market Research
                  </div>
                  <div className={`text-center p-2 rounded ${flowStatus.listing ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    Listing
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleEnhancedUpload}
              disabled={!images.length || isAnalyzing || isExecuting}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isExecuting ? (
                <>
                  <Bot className="h-5 w-5 mr-2 animate-spin" />
                  Executing Complete Flow...
                </>
              ) : isAnalyzing ? (
                <>
                  <Bot className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Execute Complete System Flow
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-600" />
              Live System Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.slice(-8).map((notification, index) => (
                <Alert key={index} className={
                  notification.status === 'error' ? 'border-red-200 bg-red-50' :
                  notification.status === 'success' ? 'border-green-200 bg-green-50' :
                  'border-blue-200 bg-blue-50'
                }>
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

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error.message || 'An error occurred during the system flow'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedDealerUploadTriggers;
