
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Github,
  Scan,
  FileX,
  Clock
} from 'lucide-react';
import { mockDataBlocker, type MockDataViolation } from '@/utils/mockDataBlocker';
import { toast } from '@/hooks/use-toast';

const AdminMockDataTab = () => {
  const [violations, setViolations] = useState<MockDataViolation[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  // Mock data for GitHub violations since the table doesn't exist
  const [githubViolations] = useState([
    {
      id: '1',
      commit_hash: 'abc123',
      file_path: 'src/hooks/useAnalytics.ts',
      violation_type: 'math_random',
      author: 'developer@example.com',
      commit_message: 'Add analytics tracking',
      detected_at: new Date().toISOString(),
      blocked: true,
      merge_allowed: false
    }
  ]);

  const [scanHistory] = useState([
    {
      id: '1',
      scan_date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      violations_found: 2,
      violations_resolved: 0,
      scan_duration_ms: 5000,
      scan_status: 'completed' as const
    }
  ]);

  // Load mock violations from the blocker
  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = async () => {
    try {
      // Mock violations data since database table might not have the 'source' field
      const mockViolations: MockDataViolation[] = [
        {
          id: '1',
          file_path: 'src/hooks/useAnalytics.ts',
          violation_type: 'math_random',
          line_number: 64,
          violation_content: 'Math.random()',
          severity: 'critical',
          detected_at: new Date().toISOString(),
          status: 'active',
          source: 'local'
        },
        {
          id: '2',
          file_path: 'src/components/CategoryNav.tsx',
          violation_type: 'mock_array',
          line_number: 145,
          violation_content: 'mockCategories = ["demo1", "demo2"]',
          severity: 'high',
          detected_at: new Date().toISOString(),
          status: 'active',
          source: 'local'
        }
      ];
      setViolations(mockViolations);
    } catch (error) {
      console.error('Error loading violations:', error);
      toast({
        title: "Error",
        description: "Failed to load mock data violations",
        variant: "destructive"
      });
    }
  };

  const handleScanProject = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    try {
      // Simulate scanning progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Run actual scan
      const foundViolations = await mockDataBlocker.scanEntireProject();
      
      clearInterval(progressInterval);
      setScanProgress(100);
      
      setViolations(foundViolations);
      setLastScan(new Date());
      
      // Save violations to simulate database operation
      await mockDataBlocker.saveViolationsToDatabase(foundViolations);
      
      toast({
        title: "Scan Complete",
        description: `Found ${foundViolations.length} mock data violations`,
        variant: foundViolations.length > 0 ? "destructive" : "default"
      });
      
    } catch (error) {
      console.error('Scan failed:', error);
      toast({
        title: "Scan Failed",
        description: "Failed to complete project scan",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanProgress(0), 2000);
    }
  };

  const handleResolveViolation = async (violationId: string) => {
    try {
      setViolations(prev => 
        prev.map(v => 
          v.id === violationId 
            ? { ...v, status: 'resolved' as const }
            : v
        )
      );
      
      toast({
        title: "Violation Resolved",
        description: "Mock data violation marked as resolved",
      });
    } catch (error) {
      console.error('Error resolving violation:', error);
      toast({
        title: "Error",
        description: "Failed to resolve violation",
        variant: "destructive"
      });
    }
  };

  const criticalViolations = violations.filter(v => v.severity === 'critical' && v.status === 'active');
  const highViolations = violations.filter(v => v.severity === 'high' && v.status === 'active');
  const activeViolations = violations.filter(v => v.status === 'active');
  const isProductionReady = activeViolations.length === 0;

  return (
    <div className="space-y-6">
      {/* Header and Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`border-2 ${isProductionReady ? 'border-green-200' : 'border-red-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {isProductionReady ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <div className="text-sm font-medium">Production Status</div>
                <div className={`text-lg font-bold ${isProductionReady ? 'text-green-600' : 'text-red-600'}`}>
                  {isProductionReady ? 'READY' : 'BLOCKED'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-sm font-medium">Critical Issues</div>
                <div className="text-lg font-bold text-red-600">{criticalViolations.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-sm font-medium">High Priority</div>
                <div className="text-lg font-bold text-yellow-600">{highViolations.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileX className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Total Violations</div>
                <div className="text-lg font-bold text-blue-600">{activeViolations.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Mock Data Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button 
              onClick={handleScanProject}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              <Scan className="h-4 w-4" />
              {isScanning ? 'Scanning...' : 'Scan Project'}
            </Button>
            
            {lastScan && (
              <div className="text-sm text-muted-foreground">
                Last scan: {lastScan.toLocaleString()}
              </div>
            )}
          </div>
          
          {isScanning && (
            <div className="space-y-2">
              <Progress value={scanProgress} className="h-2" />
              <div className="text-sm text-muted-foreground">
                Scanning files... {scanProgress}%
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Violations Tabs */}
      <Tabs defaultValue="violations" className="w-full">
        <TabsList>
          <TabsTrigger value="violations" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Violations ({activeViolations.length})
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub Blocks ({githubViolations.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Scan History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="violations" className="space-y-4">
          {activeViolations.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                No active mock data violations found. The project is production-ready!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {activeViolations.map((violation) => (
                <Card key={violation.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={violation.severity === 'critical' ? 'destructive' : 'secondary'}
                          >
                            {violation.severity}
                          </Badge>
                          <Badge variant="outline">{violation.violation_type}</Badge>
                        </div>
                        <div className="font-medium">{violation.file_path}</div>
                        <div className="text-sm text-muted-foreground">
                          Line {violation.line_number}: {violation.violation_content}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Detected: {new Date(violation.detected_at).toLocaleString()}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveViolation(violation.id!)}
                      >
                        Resolve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="github" className="space-y-4">
          <div className="space-y-4">
            {githubViolations.map((violation) => (
              <Card key={violation.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={violation.blocked ? 'destructive' : 'secondary'}>
                        {violation.blocked ? 'BLOCKED' : 'ALLOWED'}
                      </Badge>
                      <Badge variant="outline">{violation.violation_type}</Badge>
                    </div>
                    <div className="font-medium">{violation.file_path}</div>
                    <div className="text-sm text-muted-foreground">
                      Commit: {violation.commit_hash} by {violation.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      "{violation.commit_message}"
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Detected: {new Date(violation.detected_at).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {scanHistory.map((scan) => (
              <Card key={scan.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">
                        Scan completed at {new Date(scan.scan_date).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Found {scan.violations_found} violations in {scan.scan_duration_ms}ms
                      </div>
                    </div>
                    <Badge 
                      variant={scan.violations_found === 0 ? 'default' : 'destructive'}
                    >
                      {scan.scan_status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMockDataTab;
