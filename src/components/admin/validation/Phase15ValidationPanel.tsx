
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Play, 
  RefreshCw,
  Shield,
  Database,
  Users,
  Activity
} from 'lucide-react';
import { useProductionValidation } from '@/hooks/useProductionValidation';

const Phase15ValidationPanel = () => {
  const { 
    isValidating, 
    validationResults, 
    runProductionValidation, 
    getOverallStatus,
    systemHealth 
  } = useProductionValidation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'fail': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'fail': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Production Validation System
            <Badge variant="outline">PHASE 15</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(overallStatus)}
                <span className={`font-semibold ${
                  overallStatus === 'pass' ? 'text-green-600' : 
                  overallStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {overallStatus === 'pass' ? 'PRODUCTION READY' : 
                   overallStatus === 'warning' ? 'REVIEW REQUIRED' : 'ISSUES DETECTED'}
                </span>
              </div>
            </div>
            <Button 
              onClick={runProductionValidation} 
              disabled={isValidating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Production Validation
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Health Overview */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Database Records</p>
                  <p className="text-2xl font-bold text-blue-600">{systemHealth.coinsCount}</p>
                </div>
                <Database className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">{systemHealth.usersCount}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">24h Errors</p>
                  <p className="text-2xl font-bold text-red-600">{systemHealth.errorsCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overall Status Alert */}
      <Alert variant={overallStatus === 'pass' ? "default" : "destructive"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          {overallStatus === 'pass' ? (
            <span className="font-semibold text-green-700">
              ✅ PRODUCTION VALIDATION PASSED: System is ready for deployment
            </span>
          ) : overallStatus === 'warning' ? (
            <span className="font-semibold text-yellow-700">
              ⚠️ REVIEW REQUIRED: Some components need attention before production
            </span>
          ) : (
            <span className="font-semibold text-red-700">
              🚫 VALIDATION FAILED: Critical issues must be resolved before production
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Validation Results */}
      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {validationResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <h4 className="font-medium">{result.component}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                        {result.details && (
                          <p className="text-xs text-muted-foreground mt-2">{result.details}</p>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results State */}
      {validationResults.length === 0 && !isValidating && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready for Production Validation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Run a comprehensive validation to ensure your system is production-ready
            </p>
            <Button onClick={runProductionValidation} className="bg-blue-600 hover:bg-blue-700">
              <Play className="h-4 w-4 mr-2" />
              Start Validation
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Phase15ValidationPanel;
