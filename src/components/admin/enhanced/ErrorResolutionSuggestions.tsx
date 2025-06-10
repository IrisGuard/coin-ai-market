
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Wrench, ExternalLink, CheckCircle, Clock } from 'lucide-react';

const ErrorResolutionSuggestions = () => {
  const errorSuggestions = [
    {
      id: '1',
      errorType: 'Database Connection Timeout',
      severity: 'critical',
      occurrences: 15,
      suggestions: [
        {
          title: 'Increase Connection Pool Size',
          description: 'Current pool size may be insufficient for the load',
          effort: 'Low',
          impact: 'High',
          automated: true
        },
        {
          title: 'Optimize Long-Running Queries',
          description: 'Identify and optimize queries taking > 5 seconds',
          effort: 'Medium',
          impact: 'High',
          automated: false
        },
        {
          title: 'Add Database Health Monitoring',
          description: 'Implement proactive monitoring to detect issues early',
          effort: 'Medium',
          impact: 'Medium',
          automated: true
        }
      ]
    },
    {
      id: '2',
      errorType: 'Authentication Service Error',
      severity: 'high',
      occurrences: 8,
      suggestions: [
        {
          title: 'Implement Circuit Breaker',
          description: 'Prevent cascading failures with circuit breaker pattern',
          effort: 'High',
          impact: 'High',
          automated: false
        },
        {
          title: 'Add Retry Logic',
          description: 'Implement exponential backoff for failed auth requests',
          effort: 'Low',
          impact: 'Medium',
          automated: true
        }
      ]
    },
    {
      id: '3',
      errorType: 'API Rate Limit Exceeded',
      severity: 'medium',
      occurrences: 23,
      suggestions: [
        {
          title: 'Implement Request Throttling',
          description: 'Add client-side rate limiting to prevent API overload',
          effort: 'Medium',
          impact: 'High',
          automated: true
        },
        {
          title: 'Cache Frequent Requests',
          description: 'Implement caching for commonly requested data',
          effort: 'Medium',
          impact: 'Medium',
          automated: false
        }
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-purple-600 bg-purple-100';
      case 'Medium': return 'text-blue-600 bg-blue-100';
      case 'Low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI-Powered Resolution Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Our AI has analyzed recent errors and suggests the following solutions to prevent future occurrences.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {errorSuggestions.map((error) => (
              <div key={error.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{error.errorType}</h3>
                    <Badge className={getSeverityColor(error.severity)}>
                      {error.severity}
                    </Badge>
                    <Badge variant="outline">
                      {error.occurrences} occurrences
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  {error.suggestions.map((suggestion, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-3 rounded-r">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Wrench className="w-4 h-4 text-blue-600" />
                            <h4 className="font-medium text-sm">{suggestion.title}</h4>
                            {suggestion.automated && (
                              <Badge variant="outline" className="text-green-600 bg-green-50">
                                Auto-fixable
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={getEffortColor(suggestion.effort)} variant="outline">
                              {suggestion.effort} Effort
                            </Badge>
                            <Badge className={getImpactColor(suggestion.impact)} variant="outline">
                              {suggestion.impact} Impact
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          {suggestion.automated ? (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Auto-Fix
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              <Clock className="w-4 h-4 mr-1" />
                              Schedule
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorResolutionSuggestions;
