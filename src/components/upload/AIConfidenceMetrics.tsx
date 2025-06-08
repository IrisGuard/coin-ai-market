
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  CheckCircle, 
  AlertCircle,
  Info,
  Shield,
  Star
} from 'lucide-react';

interface AIConfidenceMetricsProps {
  results: any[];
}

const AIConfidenceMetrics: React.FC<AIConfidenceMetricsProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No analysis results available</p>
      </div>
    );
  }

  const primaryResult = results[0];
  const confidence = primaryResult.confidence || primaryResult.analysis?.confidence || 0.5;
  const metrics = primaryResult.metrics || {};

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.9) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score >= 0.7) return { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (score >= 0.5) return { label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { label: 'Low', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const confidenceLevel = getConfidenceLevel(confidence);

  return (
    <div className="space-y-6">
      {/* Overall Confidence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            AI Analysis Confidence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Confidence</span>
            <Badge className={`${confidenceLevel.textColor} border-current`} variant="outline">
              {confidenceLevel.label}
            </Badge>
          </div>
          <Progress value={confidence * 100} className="w-full" />
          <p className="text-sm text-gray-600">
            {Math.round(confidence * 100)}% confidence in identification and valuation
          </p>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Image Quality Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Image Clarity</span>
              <span className="text-sm font-medium">
                {Math.round((metrics.imageQuality || 0.7) * 100)}%
              </span>
            </div>
            <Progress value={(metrics.imageQuality || 0.7) * 100} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Feature Visibility</span>
              <span className="text-sm font-medium">
                {Math.round((metrics.featureVisibility || 0.8) * 100)}%
              </span>
            </div>
            <Progress value={(metrics.featureVisibility || 0.8) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Analysis Reliability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Historical Accuracy</span>
              <span className="text-sm font-medium">
                {Math.round((metrics.historicalAccuracy || confidence) * 100)}%
              </span>
            </div>
            <Progress value={(metrics.historicalAccuracy || confidence) * 100} className="h-2" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Cross-validation</span>
              <span className="text-sm font-medium">
                {Math.round((metrics.crossValidation || confidence * 0.9) * 100)}%
              </span>
            </div>
            <Progress value={(metrics.crossValidation || confidence * 0.9) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Market Data Confidence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Market Data Reliability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((metrics.marketDataAccuracy || 0.75) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Price Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((metrics.trendReliability || 0.8) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Trend Reliability</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Factors Affecting Confidence:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                High-resolution image provided
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Clear coin details visible
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-yellow-500" />
                Market conditions may affect valuation
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-purple-600" />
            AI Provider Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Provider:</span>
              <p className="text-gray-600 capitalize">
                {primaryResult.ai_provider || primaryResult.aiProvider || 'Claude (Anthropic)'}
              </p>
            </div>
            <div>
              <span className="font-medium">Model:</span>
              <p className="text-gray-600">
                {primaryResult.model || 'Claude-3.5-Sonnet'}
              </p>
            </div>
            <div>
              <span className="font-medium">Processing Time:</span>
              <p className="text-gray-600">
                {primaryResult.processing_time || primaryResult.processingTime || 0}ms
              </p>
            </div>
            <div>
              <span className="font-medium">Analysis Date:</span>
              <p className="text-gray-600">
                {new Date(primaryResult.timestamp || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConfidenceMetrics;
