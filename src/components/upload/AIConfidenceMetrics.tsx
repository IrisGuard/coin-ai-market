
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  Eye, 
  TrendingUp, 
  Shield, 
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface AIConfidenceMetricsProps {
  results: any[];
}

const AIConfidenceMetrics: React.FC<AIConfidenceMetricsProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No analysis results available</p>
      </div>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-blue-600 bg-blue-50';
    if (confidence >= 0.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="w-4 h-4" />;
    if (confidence >= 0.6) return <Star className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const averageConfidence = results.reduce((sum, result) => sum + (result.confidence || 0), 0) / results.length;

  return (
    <div className="space-y-6">
      {/* Overall Confidence Score */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-600" />
            Overall Confidence Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {Math.round(averageConfidence * 100)}%
            </div>
            <p className="text-gray-600">Average Analysis Confidence</p>
          </div>
          
          <Progress value={averageConfidence * 100} className="w-full h-3" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {results.filter(r => (r.confidence || 0) >= 0.8).length}
              </div>
              <p className="text-sm text-gray-600">High Confidence</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {results.filter(r => (r.confidence || 0) >= 0.6 && (r.confidence || 0) < 0.8).length}
              </div>
              <p className="text-sm text-gray-600">Medium Confidence</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {results.filter(r => (r.confidence || 0) >= 0.4 && (r.confidence || 0) < 0.6).length}
              </div>
              <p className="text-sm text-gray-600">Low Confidence</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {results.filter(r => (r.confidence || 0) < 0.4).length}
              </div>
              <p className="text-sm text-gray-600">Very Low</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Image Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result, index) => (
          <Card key={index} className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Image {index + 1}
                <Badge className={`ml-auto ${getConfidenceColor(result.confidence || 0)}`}>
                  {getConfidenceIcon(result.confidence || 0)}
                  {Math.round((result.confidence || 0) * 100)}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square w-20 h-20 mx-auto">
                <img
                  src={result.imageUrl}
                  alt={`Analysis ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border"
                />
              </div>

              {result.metrics && (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Image Quality</span>
                      <span>{Math.round((result.metrics.imageQuality || 0) * 100)}%</span>
                    </div>
                    <Progress value={(result.metrics.imageQuality || 0) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Provider Reliability</span>
                      <span>{Math.round((result.metrics.providerReliability || 0) * 100)}%</span>
                    </div>
                    <Progress value={(result.metrics.providerReliability || 0) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Historical Accuracy</span>
                      <span>{Math.round((result.metrics.historicalAccuracy || 0) * 100)}%</span>
                    </div>
                    <Progress value={(result.metrics.historicalAccuracy || 0) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cross Validation</span>
                      <span>{Math.round((result.metrics.crossValidation || 0) * 100)}%</span>
                    </div>
                    <Progress value={(result.metrics.crossValidation || 0) * 100} className="h-2" />
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Provider:</span>
                  <Badge variant="outline" className="text-xs">
                    {result.provider || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confidence Improvement Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Confidence Improvement Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h5 className="font-medium">For Higher Accuracy:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Use high-resolution images (2MP+)</li>
                <li>• Ensure good lighting conditions</li>
                <li>• Capture both sides of the coin</li>
                <li>• Avoid shadows and reflections</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium">AI Enhancement:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Multiple AI providers consulted</li>
                <li>• Cross-validation performed</li>
                <li>• Historical data referenced</li>
                <li>• Confidence metrics calculated</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConfidenceMetrics;
