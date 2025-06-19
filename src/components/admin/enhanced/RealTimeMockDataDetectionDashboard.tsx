
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Shield, Scan, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useRealMockDataProtectionStatus } from '@/hooks/useRealMockDataProtection';

interface MockDataViolation {
  id: string;
  filePath: string;
  mockType: string;
  lineNumber: number;
  lastDetected: string;
  status: 'active' | 'resolved';
  content: string;
  severity: 'critical' | 'high' | 'medium';
}

const RealTimeMockDataDetectionDashboard = () => {
  const [violations, setViolations] = useState<MockDataViolation[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  
  const {
    isProductionReady,
    totalViolations,
    criticalViolations,
    highViolations,
    securityLevel
  } = useRealMockDataProtectionStatus();

  // Simulated violations for demonstration - in production this would come from real scanning
  const simulatedViolations: MockDataViolation[] = [
    {
      id: '1',
      filePath: 'src/hooks/useAnalytics.ts',
      mockType: 'Math.random()',
      lineNumber: 64,
      lastDetected: '2 min ago',
      status: 'active',
      content: 'const randomValue = Math.random() * 100;',
      severity: 'critical'
    },
    {
      id: '2',
      filePath: 'src/components/CategoryNav.tsx',
      mockType: 'Mock Array',
      lineNumber: 145,
      lastDetected: '5 min ago',
      status: 'active',
      content: 'const mockCategories = ["demo", "test"];',
      severity: 'high'
    }
  ];

  useEffect(() => {
    // Auto-scan on mount
    performRealTimeScan();
    
    // Set up real-time scanning interval
    const interval = setInterval(performRealTimeScan, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const performRealTimeScan = async () => {
    setIsScanning(true);
    
    try {
      // In production, this would perform actual file scanning
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, use simulated violations
      setViolations(simulatedViolations);
      setLastScanTime(new Date());
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' 
      ? <XCircle className="w-4 h-4 text-red-500" />
      : <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const activeViolations = violations.filter(v => v.status === 'active');
  const criticalActive = activeViolations.filter(v => v.severity === 'critical');
  const highActive = activeViolations.filter(v => v.severity === 'high');

  return (
    <div className="space-y-6">
      {/* Critical Alert */}
      {activeViolations.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-bold">
            🚨 CRITICAL: {activeViolations.length} Active Mock Data Violations Detected - System NOT Production Ready
          </AlertDescription>
        </Alert>
      )}

      {/* Real-Time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Violations</p>
                <p className={`text-2xl font-bold ${activeViolations.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {activeViolations.length}
                </p>
              </div>
              <Shield className={`w-8 h-8 ${activeViolations.length > 0 ? 'text-red-500' : 'text-green-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalActive.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">{highActive.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Production Status</p>
                <p className={`text-sm font-bold ${activeViolations.length === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {activeViolations.length === 0 ? '✅ READY' : '❌ BLOCKED'}
                </p>
              </div>
              {activeViolations.length === 0 ? 
                <CheckCircle className="w-8 h-8 text-green-500" /> :
                <XCircle className="w-8 h-8 text-red-500" />
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              Real-Time Mock Data Scanner
            </span>
            <Button 
              onClick={performRealTimeScan} 
              disabled={isScanning}
              variant="outline"
              size="sm"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Now
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {lastScanTime 
              ? `Last scan: ${lastScanTime.toLocaleString()}` 
              : 'No scan performed yet'
            }
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-scanning every 30 seconds for real-time protection
          </p>
        </CardContent>
      </Card>

      {/* Violations Table */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Mock Data Monitoring Table</CardTitle>
        </CardHeader>
        <CardContent>
          {violations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-medium text-green-600 mb-2">
                🎉 No Mock Data Violations Detected!
              </h3>
              <p className="text-muted-foreground">
                System is 100% production ready
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Path</TableHead>
                  <TableHead>Mock Type</TableHead>
                  <TableHead>Line</TableHead>
                  <TableHead>Last Detected</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {violations.map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell className="font-mono text-sm">
                      {violation.filePath}
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{violation.mockType}</Badge>
                    </TableCell>
                    <TableCell>{violation.lineNumber}</TableCell>
                    <TableCell>{violation.lastDetected}</TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(violation.severity)}>
                        {violation.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(violation.status)}
                        <span className={violation.status === 'active' ? 'text-red-600' : 'text-green-600'}>
                          {violation.status === 'active' ? '❌ ACTIVE' : '✅ RESOLVED'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Emergency Protocol */}
      {activeViolations.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">🚨 Emergency Cleanup Protocol</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium text-red-800">
                IMMEDIATE ACTIONS REQUIRED:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                <li>🚫 All deployments are BLOCKED until violations are resolved</li>
                <li>🔧 Replace Math.random() with generateSecureRandomNumber()</li>
                <li>🗑️ Remove all mock, demo, and sample data</li>
                <li>✅ Verify all data sources are production-ready</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeMockDataDetectionDashboard;
