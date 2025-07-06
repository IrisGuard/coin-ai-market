import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, Zap, Eye, RotateCcw, Square, 
  CheckCircle, AlertCircle, Loader2, Sparkles 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAdvancedMobilePWA } from '@/hooks/useAdvancedMobilePWA';

interface EnhancedMobileCameraProps {
  onCoinRecognized: (result: any) => void;
  onImagesCapture: (images: string[]) => void;
}

interface CameraSettings {
  flash: boolean;
  focus: 'auto' | 'macro' | 'continuous';
  resolution: 'high' | 'medium' | 'low';
  aiRealTime: boolean;
}

const EnhancedMobileCamera: React.FC<EnhancedMobileCameraProps> = ({
  onCoinRecognized,
  onImagesCapture
}) => {
  const { recognizeCoinOffline, isOnline, sendNotification } = useAdvancedMobilePWA();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [settings, setSettings] = useState<CameraSettings>({
    flash: false,
    focus: 'auto',
    resolution: 'high',
    aiRealTime: false
  });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start camera with enhanced settings
  const startCamera = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: settings.resolution === 'high' ? 1920 : settings.resolution === 'medium' ? 1280 : 640,
          height: settings.resolution === 'high' ? 1080 : settings.resolution === 'medium' ? 720 : 480
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [settings]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Capture high-quality photo
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) throw new Error('Canvas context not available');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to high-quality base64
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.95);
      
      // Add to captured images
      const newImages = [...capturedImages, imageBase64];
      setCapturedImages(newImages);
      onImagesCapture(newImages);

      // Auto-analyze if real-time AI is enabled
      if (settings.aiRealTime) {
        await analyzeImage(imageBase64);
      }

      toast({
        title: "Photo Captured",
        description: `${newImages.length} photo(s) ready for analysis`,
      });
      
    } catch (error) {
      console.error('Capture error:', error);
      toast({
        title: "Capture Failed",
        description: "Unable to capture photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  }, [capturedImages, settings.aiRealTime, onImagesCapture]);

  // Advanced AI analysis
  const analyzeImage = useCallback(async (imageBase64: string) => {
    setIsAnalyzing(true);
    
    try {
      const result = await recognizeCoinOffline(imageBase64);
      
      // Provide detailed feedback
      const confidence = Math.round((result.analysis?.confidence || 0) * 100);
      const coinName = result.analysis?.name || 'Unknown Coin';
      
      onCoinRecognized(result);
      
      // Enhanced feedback based on confidence
      if (confidence >= 90) {
        await sendNotification('High Confidence Match!', {
          body: `${coinName} identified with ${confidence}% confidence`,
          icon: '/icons/icon-192x192.png'
        });
      } else if (confidence >= 70) {
        await sendNotification('Good Match Found', {
          body: `${coinName} (${confidence}% confidence) - Consider additional photos`,
          icon: '/icons/icon-192x192.png'
        });
      } else {
        toast({
          title: "Analysis Complete",
          description: `${coinName} (${confidence}% confidence). Try different angle for better results.`,
        });
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: isOnline ? "AI analysis error. Please try again." : "Analyzed offline. Will improve when online.",
        variant: isOnline ? "destructive" : "default",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [recognizeCoinOffline, onCoinRecognized, isOnline, sendNotification]);

  // Analyze all captured images
  const analyzeAllImages = useCallback(async () => {
    if (capturedImages.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // Analyze the most recent image with best quality
      const bestImage = capturedImages[capturedImages.length - 1];
      await analyzeImage(bestImage);
      
    } catch (error) {
      console.error('Batch analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [capturedImages, analyzeImage]);

  // Handle file input (for devices without camera)
  const handleFileInput = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const imagePromises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const images = await Promise.all(imagePromises);
    const newImages = [...capturedImages, ...images];
    setCapturedImages(newImages);
    onImagesCapture(newImages);

    if (settings.aiRealTime && images.length > 0) {
      await analyzeImage(images[0]);
    }
  }, [capturedImages, settings.aiRealTime, onImagesCapture, analyzeImage]);

  // Clear all captured images
  const clearImages = useCallback(() => {
    setCapturedImages([]);
    onImagesCapture([]);
  }, [onImagesCapture]);

  return (
    <div className="space-y-4">
      {/* Camera Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Enhanced Mobile Camera
            {!isOnline && <Badge variant="outline">Offline Mode</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Camera Settings */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={settings.aiRealTime ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(prev => ({ ...prev, aiRealTime: !prev.aiRealTime }))}
                className="text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Real-time AI
              </Button>
              <Button
                variant={settings.resolution === 'high' ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(prev => ({ 
                  ...prev, 
                  resolution: prev.resolution === 'high' ? 'medium' : 'high' 
                }))}
                className="text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                {settings.resolution.toUpperCase()}
              </Button>
            </div>

            {/* Camera Preview */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera overlay guide */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-white/50 rounded-full flex items-center justify-center">
                  <Square className="h-16 w-16 text-white/70" />
                </div>
              </div>
              
              {/* Capture button */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Button
                  onClick={capturePhoto}
                  disabled={isCapturing || !stream}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50"
                >
                  {isCapturing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>

            {/* Camera Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={stream ? stopCamera : startCamera}
                variant="outline"
                size="sm"
              >
                {stream ? 'Stop Camera' : 'Start Camera'}
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
              >
                Upload Photo
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Captured Images */}
      {capturedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Captured Images ({capturedImages.length})</span>
              <Button onClick={clearImages} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {capturedImages.slice(-6).map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Captured ${index + 1}`}
                    className="w-full h-full object-cover rounded border"
                  />
                  {index === capturedImages.length - 1 && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle className="h-4 w-4 text-green-600 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              onClick={analyzeAllImages}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Status Indicators */}
      <div className="flex gap-2">
        <Badge variant={stream ? "default" : "outline"} className="text-xs">
          <div className={`w-2 h-2 rounded-full mr-1 ${stream ? 'bg-green-500' : 'bg-gray-400'}`} />
          Camera {stream ? 'Active' : 'Inactive'}
        </Badge>
        <Badge variant={isOnline ? "default" : "outline"} className="text-xs">
          <div className={`w-2 h-2 rounded-full mr-1 ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`} />
          {isOnline ? 'Online AI' : 'Offline Mode'}
        </Badge>
      </div>
    </div>
  );
};

export default EnhancedMobileCamera;