
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  TrendingUp, 
  Star, 
  AlertTriangle, 
  CheckCircle,
  Camera,
  Zap,
  Focus
} from 'lucide-react';

interface QualityMetrics {
  resolution: number;
  clarity: number;
  brightness: number;
  contrast: number;
  saturation: number;
  noise: number;
  overall: number;
}

interface QualityAnalysis {
  metrics: QualityMetrics;
  recommendations: string[];
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
  professionalReady: boolean;
}

interface ImageQualityAnalyzerProps {
  imageUrl: string;
  onAnalysisComplete?: (analysis: QualityAnalysis) => void;
  className?: string;
}

const ImageQualityAnalyzer: React.FC<ImageQualityAnalyzerProps> = ({
  imageUrl,
  onAnalysisComplete,
  className = ''
}) => {
  const [analysis, setAnalysis] = useState<QualityAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (url: string): Promise<QualityAnalysis> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Advanced quality analysis
        let totalBrightness = 0;
        let totalContrast = 0;
        let totalSaturation = 0;
        let edgeCount = 0;
        let noiseLevel = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Brightness analysis
          const brightness = (r + g + b) / 3;
          totalBrightness += brightness;

          // Saturation analysis
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max > 0 ? (max - min) / max : 0;
          totalSaturation += saturation;

          // Edge detection for clarity (simplified)
          if (i > 0 && i < data.length - 4) {
            const prevBrightness = (data[i-4] + data[i-3] + data[i-2]) / 3;
            const edge = Math.abs(brightness - prevBrightness);
            if (edge > 20) edgeCount++;
          }

          // Noise estimation (simplified)
          if (i > 4 && i < data.length - 4) {
            const variance = Math.abs(brightness - (data[i-4] + data[i+4]) / 2);
            noiseLevel += variance;
          }
        }

        const pixelCount = data.length / 4;
        const avgBrightness = totalBrightness / pixelCount;
        const avgSaturation = totalSaturation / pixelCount;
        const clarityScore = (edgeCount / pixelCount) * 1000;
        const noiseScore = 100 - Math.min((noiseLevel / pixelCount) / 2, 100);

        // Resolution score
        const megapixels = (img.width * img.height) / 1000000;
        const resolutionScore = Math.min(megapixels / 8 * 100, 100); // 8MP = 100%

        // Contrast estimation
        const contrastScore = Math.min(clarityScore * 10, 100);

        const metrics: QualityMetrics = {
          resolution: resolutionScore,
          clarity: Math.min(clarityScore * 15, 100),
          brightness: Math.min(Math.max((avgBrightness / 255) * 120, 40), 100),
          contrast: contrastScore,
          saturation: Math.min(avgSaturation * 150, 100),
          noise: noiseScore,
          overall: (resolutionScore + clarityScore * 15 + contrastScore + noiseScore + (avgSaturation * 150)) / 5
        };

        // Generate recommendations
        const recommendations: string[] = [];
        if (metrics.resolution < 70) recommendations.push('📸 Consider using higher resolution camera');
        if (metrics.clarity < 60) recommendations.push('🔍 Image needs better focus/sharpening');
        if (metrics.brightness < 40) recommendations.push('💡 Increase lighting for better visibility');
        if (metrics.brightness > 90) recommendations.push('🌞 Reduce overexposure');
        if (metrics.contrast < 50) recommendations.push('⚡ Improve contrast for better definition');
        if (metrics.saturation < 30) recommendations.push('🎨 Enhance color saturation');
        if (metrics.noise < 60) recommendations.push('🧹 Apply noise reduction');

        // Determine grade
        let grade: QualityAnalysis['grade'] = 'D';
        if (metrics.overall >= 95) grade = 'A+';
        else if (metrics.overall >= 85) grade = 'A';
        else if (metrics.overall >= 75) grade = 'B+';
        else if (metrics.overall >= 65) grade = 'B';
        else if (metrics.overall >= 55) grade = 'C+';
        else if (metrics.overall >= 45) grade = 'C';

        const professionalReady = metrics.overall >= 80 && 
                                metrics.resolution >= 70 && 
                                metrics.clarity >= 60;

        const analysis: QualityAnalysis = {
          metrics,
          recommendations,
          grade,
          professionalReady
        };

        resolve(analysis);
      };
      img.src = url;
    });
  };

  useEffect(() => {
    if (imageUrl) {
      setIsAnalyzing(true);
      analyzeImage(imageUrl).then((result) => {
        setAnalysis(result);
        setIsAnalyzing(false);
        onAnalysisComplete?.(result);
      });
    }
  }, [imageUrl, onAnalysisComplete]);

  if (!analysis && !isAnalyzing) return null;

  return (
    <Card className={`border-2 ${
      analysis?.professionalReady ? 'border-green-300' : 'border-yellow-300'
    } ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          AI Quality Analysis
          {analysis && (
            <Badge className={`ml-2 ${
              analysis.professionalReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              Grade: {analysis.grade}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">AI analyzing image quality...</p>
          </div>
        ) : analysis && (
          <>
            {/* Overall Score */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {Math.round(analysis.metrics.overall)}%
              </div>
              <div className="text-sm text-gray-600">Overall Quality Score</div>
              {analysis.professionalReady ? (
                <div className="flex items-center justify-center gap-2 mt-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Professional Ready</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 mt-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Needs Enhancement</span>
                </div>
              )}
            </div>

            {/* Detailed Metrics */}
            <div className="space-y-3">
              <h4 className="font-medium">Quality Metrics:</h4>
              
              {Object.entries(analysis.metrics).filter(([key]) => key !== 'overall').map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm capitalize flex items-center gap-2">
                      {key === 'resolution' && <Camera className="h-3 w-3" />}
                      {key === 'clarity' && <Focus className="h-3 w-3" />}
                      {key === 'brightness' && <Star className="h-3 w-3" />}
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-sm font-medium">{Math.round(value)}%</span>
                  </div>
                  <Progress 
                    value={value} 
                    className={`h-2 ${
                      value >= 80 ? 'text-green-600' : 
                      value >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`} 
                  />
                </div>
              ))}
            </div>

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  AI Recommendations:
                </h4>
                <div className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Status */}
            <Card className={`${
              analysis.professionalReady ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  {analysis.professionalReady ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Professional Quality</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Enhancement Recommended</span>
                    </>
                  )}
                </div>
                <p className="text-xs mt-1 text-gray-600">
                  {analysis.professionalReady 
                    ? 'This image meets professional marketplace standards'
                    : 'Consider using our AI enhancement tools for better results'
                  }
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageQualityAnalyzer;
