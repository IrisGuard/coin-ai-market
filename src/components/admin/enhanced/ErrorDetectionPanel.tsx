
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Download,
  Copy,
  Clock
} from 'lucide-react';
import { useCodeErrorDetection } from '@/hooks/useCodeErrorDetection';
import { formatDistanceToNow } from 'date-fns';

const ErrorDetectionPanel = () => {
  const { 
    isScanning, 
    scanResults, 
    lastScanTime, 
    scanForErrors, 
    exportErrors 
  } = useCodeErrorDetection();

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100', 
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-blue-600 bg-blue-100'
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const getReadinessStatus = () => {
    if (!scanResults) return { color: 'text-gray-600', message: 'No scan performed yet' };
    
    const readiness = scanResults.productionReadiness;
    if (readiness >= 95) return { color: 'text-green-600', message: 'Production Ready' };
    if (readiness >= 80) return { color: 'text-yellow-600', message: 'Minor Issues' };
    if (readiness >= 60) return { color: 'text-orange-600', message: 'Moderate Issues' };
    return { color: 'text-red-600', message: 'Critical Issues' };
  };

  const errorCounts = scanResults ? {
    critical: scanResults.errors.filter(e => e.severity === 'critical').length,
    high: scanResults.errors.filter(e => e.severity === 'high').length,
    medium: scanResults.errors.filter(e => e.severity === 'medium').length,
    low: scanResults.errors.filter(e => e.severity === 'low').length
  } : { critical: 0, high: 0, medium: 0, low: 0 };

  const readinessStatus = getReadinessStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-purple-600" />
          Error Detection System
          <Badge variant="outline" className="text-xs">CODE ANALYSIS</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Alert */}
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span className={`font-medium ${readinessStatus.color}`}>
              {readinessStatus.message}
              {scanResults && ` - ${scanResults.productionReadiness}% Production Ready`}
            </span>
            <Badge variant={scanResults?.errors.length === 0 ? "default" : "destructive"}>
              {scanResults?.errors.length || 0} ERRORS
            </Badge>
          </AlertDescription>
        </Alert>

        {/* Control Panel */}
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border">
          <div className="space-y-1">
            <p className="font-medium text-purple-800">
              {lastScanTime ? (
                <>Last scan: {formatDistanceToNow(lastScanTime, { addSuffix: true })}</>
              ) : (
                'No scan performed yet'
              )}
            </p>
            {scanResults && (
              <p className="text-sm text-purple-600">
                Scanned {scanResults.totalFiles} files in {scanResults.scanDuration}ms
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {scanResults && (
              <>
                <Button 
                  onClick={() => exportErrors('json')} 
                  variant="outline" 
                  size="sm"
                  className="text-purple-600"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button 
                  onClick={() => exportErrors('clipboard')} 
                  variant="outline" 
                  size="sm"
                  className="text-purple-600"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </>
            )}
            <Button 
              onClick={scanForErrors} 
              disabled={isScanning}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isScanning ? (
                <>
                  <Search className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  🔍 Code Scan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Statistics Grid */}
        {scanResults && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg border">
              <p className="text-2xl font-bold text-red-600">{errorCounts.critical}</p>
              <p className="text-xs text-red-700">Critical</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border">
              <p className="text-2xl font-bold text-orange-600">{errorCounts.high}</p>
              <p className="text-xs text-orange-700">High</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border">
              <p className="text-2xl font-bold text-yellow-600">{errorCounts.medium}</p>
              <p className="text-xs text-yellow-700">Medium</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border">
              <p className="text-2xl font-bold text-blue-600">{errorCounts.low}</p>
              <p className="text-xs text-blue-700">Low</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border">
              <p className="text-2xl font-bold text-green-600">{scanResults.productionReadiness}%</p>
              <p className="text-xs text-green-700">Ready</p>
            </div>
          </div>
        )}

        {/* Error List */}
        {scanResults && scanResults.errors.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-600">Detected Errors:</h4>
            {scanResults.errors.map((error, index) => (
              <div key={index} className="border rounded-lg p-3 bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {getSeverityIcon(error.severity)}
                    <div className="flex-1">
                      <p className="font-medium text-red-800">{error.message}</p>
                      <p className="text-sm text-red-600">
                        {error.file}:{error.line}
                      </p>
                      <p className="text-xs text-red-500 mt-1">
                        Type: {error.type} • Severity: {error.severity}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(error.severity)}>
                    {error.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : scanResults ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-green-600">No Errors Detected</h3>
              <p className="text-muted-foreground">All code files are clean and production ready</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <Search className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Ready for Error Detection</h3>
              <p className="text-sm text-muted-foreground">
                Click "🔍 Code Scan" to analyze your codebase for errors
              </p>
            </div>
          </div>
        )}

        {/* Final Status */}
        <Alert variant={scanResults?.errors.length === 0 ? "default" : "destructive"}>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>CODE ANALYSIS STATUS:</strong> {
              scanResults?.errors.length === 0 
                ? 'Code is clean and ready for production deployment.'
                : `${scanResults?.errors.length || 0} errors detected - requires attention before production.`
            }
            {lastScanTime && (
              <span className="block text-xs mt-1 text-muted-foreground">
                Last scan: {formatDistanceToNow(lastScanTime, { addSuffix: true })}
              </span>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ErrorDetectionPanel;
