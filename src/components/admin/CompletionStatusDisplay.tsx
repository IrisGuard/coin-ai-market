
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { validateFinalProductionReadiness, logFinalValidation, ValidationResult } from '@/lib/finalValidation';

const CompletionStatusDisplay = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const runValidation = async () => {
    setIsValidating(true);
    try {
      const result = await validateFinalProductionReadiness();
      setValidationResult(result);
      await logFinalValidation(result);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    runValidation();
  }, []);

  if (isValidating) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 animate-spin" />
            <span>Validating production readiness...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!validationResult) {
    return null;
  }

  const { isProductionReady, cleanlinessPercentage, issues, recommendations } = validationResult;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isProductionReady ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          )}
          Production Readiness Status
          <Badge variant={isProductionReady ? "default" : "secondary"}>
            {cleanlinessPercentage}% Clean
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${isProductionReady ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <h3 className={`font-semibold ${isProductionReady ? 'text-green-800' : 'text-yellow-800'}`}>
              {isProductionReady ? '✅ System is 100% Production Ready' : '⚠️ Minor Issues Detected'}
            </h3>
            <p className={`text-sm mt-1 ${isProductionReady ? 'text-green-700' : 'text-yellow-700'}`}>
              {isProductionReady 
                ? 'All mock/test data has been cleaned and the system is fully operational'
                : 'System is functional but some cleanup items remain'
              }
            </p>
          </div>

          {issues.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">Issues Found:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                {issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-700 mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-600">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>System Cleanliness</span>
              <span>{cleanlinessPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isProductionReady ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${cleanlinessPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionStatusDisplay;
