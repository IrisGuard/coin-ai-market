
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Shield,
  TrendingUp,
  Star
} from 'lucide-react';

interface MultiProviderComparisonProps {
  results: any[];
  providers: any[];
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

  const getProviderIcon = (providerName: string) => {
    switch (providerName?.toLowerCase()) {
      case 'custom': return <Star className="w-4 h-4" />;
      case 'openai': return <Brain className="w-4 h-4" />;
      case 'anthropic': return <Zap className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getProviderColor = (providerName: string) => {
    switch (providerName?.toLowerCase()) {
      case 'custom': return 'text-purple-600 bg-purple-50';
      case 'openai': return 'text-green-600 bg-green-50';
      case 'anthropic': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (isActive: boolean, reliability: number) => {
    if (!isActive) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (reliability >= 0.9) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Provider Performance Overview */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-blue-600" />
            AI Provider Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providers.map((provider, index) => (
              <Card key={index} className={`border ${getProviderColor(provider.name)} border-opacity-30`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${getProviderColor(provider.name)}`}>
                        {getProviderIcon(provider.name)}
                      </div>
                      <span className="font-medium capitalize">{provider.name}</span>
                    </div>
                    {getStatusIcon(provider.isActive, provider.reliability)}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Reliability</span>
                        <span>{Math.round(provider.reliability * 100)}%</span>
                      </div>
                      <Progress value={provider.reliability * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Avg Response Time</span>
                        <span>{provider.averageResponseTime}ms</span>
                      </div>
                      <Progress 
                        value={Math.max(0, 100 - (provider.averageResponseTime / 30))} 
                        className="h-2" 
                      />
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Confidence Boost:</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(provider.confidenceBoost * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Result Comparisons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Analysis Results by Provider
        </h3>
        
        {results.map((result, index) => (
          <Card key={index} className="border border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                Image {index + 1} - {result.identification?.name || result.name || 'Unidentified'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Primary Result */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${getProviderColor(result.provider)}`}>
                      {getProviderIcon(result.provider)}
                    </div>
                    <span className="font-medium">Primary Analysis</span>
                    <Badge className={getProviderColor(result.provider)}>
                      {result.provider}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-medium">{Math.round((result.confidence || 0) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">${result.estimated_value || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade:</span>
                      <span className="font-medium">{result.grade || 'Ungraded'}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                {result.metrics && (
                  <div className="space-y-3">
                    <h5 className="font-medium">Confidence Metrics</h5>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Image Quality</span>
                          <span>{Math.round((result.metrics.imageQuality || 0) * 100)}%</span>
                        </div>
                        <Progress value={(result.metrics.imageQuality || 0) * 100} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Historical Accuracy</span>
                          <span>{Math.round((result.metrics.historicalAccuracy || 0) * 100)}%</span>
                        </div>
                        <Progress value={(result.metrics.historicalAccuracy || 0) * 100} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Cross Validation</span>
                          <span>{Math.round((result.metrics.crossValidation || 0) * 100)}%</span>
                        </div>
                        <Progress value={(result.metrics.crossValidation || 0) * 100} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Status */}
                <div className="space-y-3">
                  <h5 className="font-medium">Validation Status</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Primary analysis complete</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {result.metrics?.crossValidation > 0.7 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span>Cross-validation performed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Market data integrated</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {(result.confidence || 0) > 0.8 ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span>High confidence threshold</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Star className="w-6 h-6 text-purple-600" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {providers.filter(p => p.isActive).length}
              </div>
              <p className="text-sm text-gray-600">Active Providers</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {results.length}
              </div>
              <p className="text-sm text-gray-600">Images Analyzed</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(providers.reduce((sum, p) => sum + p.reliability, 0) / providers.length * 100)}%
              </div>
              <p className="text-sm text-gray-600">Avg Reliability</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(providers.reduce((sum, p) => sum + p.averageResponseTime, 0) / providers.length)}ms
              </div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiProviderComparison;
