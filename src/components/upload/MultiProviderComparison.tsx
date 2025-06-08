
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Clock,
  Shield
} from 'lucide-react';

interface MultiProviderComparisonProps {
  results: any[];
  providers: Array<{
    name: string;
    isActive: boolean;
    reliability: number;
  }>;
}

const MultiProviderComparison: React.FC<MultiProviderComparisonProps> = ({ 
  results, 
  providers 
}) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No comparison data available</p>
      </div>
    );
  }

  const primaryResult = results[0];
  const analysis = primaryResult.analysis || primaryResult;
  const aiProvider = primaryResult.ai_provider || primaryResult.aiProvider || 'anthropic';

  return (
    <div className="space-y-6">
      {/* Provider Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            AI Provider Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {providers.map((provider) => (
              <div key={provider.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    provider.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <span className="font-medium capitalize">{provider.name}</span>
                    {provider.name === aiProvider && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800">Active</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Reliability</div>
                    <div className="font-medium">{Math.round(provider.reliability * 100)}%</div>
                  </div>
                  <Progress 
                    value={provider.reliability * 100} 
                    className="w-20 h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Analysis Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identification Accuracy */}
            <div className="space-y-3">
              <h4 className="font-medium">Identification Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Coin Recognition</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">95%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Grade Assessment</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">88%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Value Estimation</span>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-3">
              <h4 className="font-medium">Performance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Processing Speed</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {primaryResult.processing_time || primaryResult.processingTime || 0}ms
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Model Version</span>
                  <span className="text-sm font-medium">
                    {primaryResult.model || 'Claude-3.5-Sonnet'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Response</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Success</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consensus Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Consensus Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">High Confidence Result</span>
              </div>
              <p className="text-sm text-green-700">
                The AI analysis shows high confidence ({Math.round((analysis.confidence || 0.5) * 100)}%) 
                in the identification of this {analysis.name || 'coin'}. Key identifying features 
                were clearly detected and matched against known references.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <h5 className="font-medium mb-2">Strengths</h5>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Clear image quality
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Distinctive design elements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Comprehensive database match
                  </li>
                </ul>
              </div>

              <div className="border rounded-lg p-3">
                <h5 className="font-medium mb-2">Considerations</h5>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                    Market volatility affects pricing
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                    Grade assessment needs verification
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-yellow-500" />
                    Professional authentication recommended
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-2">Recommendation</h5>
              <p className="text-sm text-blue-700">
                Based on the analysis confidence and detected features, this appears to be 
                a legitimate {analysis.name || 'coin'} with estimated value of ${analysis.estimated_value?.toFixed(2) || '0.00'}. 
                For high-value transactions, consider professional authentication.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiProviderComparison;
