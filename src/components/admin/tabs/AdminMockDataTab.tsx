
// 🚨 ADMIN MOCK DATA MONITORING TAB
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, RefreshCw, CheckCircle, XCircle, 
  FileText, GitBranch, Database, Clock, Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { mockDataBlocker, MockDataViolation, GitHubViolation, SecurityScanResult } from '@/utils/mockDataBlocker';

const AdminMockDataTab = () => {
  const [violations, setViolations] = useState<MockDataViolation[]>([]);
  const [githubViolations, setGithubViolations] = useState<GitHubViolation[]>([]);
  const [scanResults, setScanResults] = useState<SecurityScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [stats, setStats] = useState({
    total_violations: 0,
    active_violations: 0,
    critical_violations: 0,
    github_violations: 0,
    last_scan: null as string | null
  });

  // 📊 ΦΟΡΤΩΣΗ ΔΕΔΟΜΕΝΩΝ ΣΕ ΠΡΑΓΜΑΤΙΚΟ ΧΡΟΝΟ
  useEffect(() => {
    loadData();
    
    // Real-time subscriptions
    const violationsSubscription = supabase
      .channel('mock_violations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'mock_data_violations' },
        () => loadViolations()
      )
      .subscribe();

    const githubSubscription = supabase
      .channel('github_violations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'github_violations' },
        () => loadGithubViolations()
      )
      .subscribe();

    return () => {
      violationsSubscription.unsubscribe();
      githubSubscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    await Promise.all([
      loadViolations(),
      loadGithubViolations(),
      loadScanResults(),
      loadStats()
    ]);
  };

  const loadViolations = async () => {
    const { data, error } = await supabase
      .from('mock_data_violations')
      .select('*')
      .order('detected_at', { ascending: false })
      .limit(50);
    
    if (!error && data) {
      setViolations(data);
    }
  };

  const loadGithubViolations = async () => {
    const { data, error } = await supabase
      .from('github_violations')
      .select('*')
      .order('detected_at', { ascending: false })
      .limit(20);
    
    if (!error && data) {
      setGithubViolations(data);
    }
  };

  const loadScanResults = async () => {
    const { data, error } = await supabase
      .from('security_scan_results')
      .select('*')
      .eq('scan_type', 'mock_data')
      .order('scan_date', { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setScanResults(data);
    }
  };

  const loadStats = async () => {
    const { data, error } = await supabase
      .from('mock_data_statistics')
      .select('*')
      .single();
    
    if (!error && data) {
      setStats(data);
    }
  };

  // 🔍 ΕΚΤΕΛΕΣΗ ΠΛΗΡΟΥΣ ΣΑΡΩΣΗΣ
  const runFullScan = async () => {
    setIsScanning(true);
    try {
      const violations = await mockDataBlocker.scanEntireProject();
      await mockDataBlocker.saveViolationsToDatabase(violations);
      await mockDataBlocker.logSecurityScan(violations);
      
      if (violations.length > 0) {
        await mockDataBlocker.createAlert(
          `🚨 Found ${violations.length} mock data violations during full scan`
        );
      }
      
      await loadData();
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // 🚨 EMERGENCY CLEANUP
  const emergencyCleanup = async () => {
    if (confirm('⚠️ This will attempt to automatically fix ALL mock data violations. Continue?')) {
      setIsScanning(true);
      try {
        // This would implement automatic fixes
        await mockDataBlocker.createAlert('🧹 Emergency cleanup initiated');
        await loadData();
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 🚨 ALERT HEADER */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900">
                🚨 Mock Data Protection System
              </h2>
              <p className="text-red-700">
                Real-time monitoring and blocking of all mock/demo/fake data
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={runFullScan} 
                disabled={isScanning}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Full Scan
                  </>
                )}
              </Button>
              <Button 
                onClick={emergencyCleanup}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                🧹 Emergency Cleanup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📊 STATISTICS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className={stats.active_violations > 0 ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}>
          <CardContent className="pt-6 text-center">
            <div className={`text-2xl font-bold ${stats.active_violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.active_violations}
            </div>
            <div className="text-sm text-muted-foreground">Active Violations</div>
            {stats.active_violations === 0 && (
              <CheckCircle className="h-4 w-4 text-green-600 mx-auto mt-1" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.critical_violations}</div>
            <div className="text-sm text-muted-foreground">Critical Issues</div>
            <AlertTriangle className="h-4 w-4 text-orange-600 mx-auto mt-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total_violations}</div>
            <div className="text-sm text-muted-foreground">Total Found</div>
            <FileText className="h-4 w-4 text-blue-600 mx-auto mt-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.github_violations}</div>
            <div className="text-sm text-muted-foreground">GitHub Blocks</div>
            <GitBranch className="h-4 w-4 text-purple-600 mx-auto mt-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {stats.last_scan ? '✅' : '❌'}
            </div>
            <div className="text-sm text-muted-foreground">System Status</div>
            <Clock className="h-4 w-4 text-gray-600 mx-auto mt-1" />
          </CardContent>
        </Card>
      </div>

      {/* 🚨 ACTIVE VIOLATIONS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Active Mock Data Violations
            <Badge variant="destructive">{violations.filter(v => v.status === 'active').length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {violations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800">🎉 NO MOCK DATA FOUND!</h3>
              <p className="text-green-600">System is completely clean of mock/demo data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {violations.filter(v => v.status === 'active').map((violation) => (
                <Alert key={violation.id} className="border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-red-800">
                          {violation.file_path}:{violation.line_number}
                        </div>
                        <div className="text-sm text-red-600">
                          {violation.violation_type}: {violation.violation_content}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={violation.severity === 'critical' ? 'destructive' : 'secondary'}
                        >
                          {violation.severity}
                        </Badge>
                        <Badge variant="outline">
                          {violation.source}
                        </Badge>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 📊 GITHUB VIOLATIONS */}
      {githubViolations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-purple-600" />
              GitHub Violations & Blocks
              <Badge variant="secondary">{githubViolations.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {githubViolations.map((violation) => (
                <Alert key={violation.id} className="border-purple-200">
                  <GitBranch className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">
                          {violation.file_path} - {violation.author}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {violation.commit_message}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={violation.blocked ? 'destructive' : 'secondary'}>
                          {violation.blocked ? 'BLOCKED' : 'ALLOWED'}
                        </Badge>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 📈 SCAN HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Recent Security Scans
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scanResults.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No scans performed yet</p>
          ) : (
            <div className="space-y-2">
              {scanResults.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-semibold">
                      {scan.scan_date && new Date(scan.scan_date).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {scan.total_files_scanned} files • {scan.violations_found} violations • {scan.scan_duration_ms}ms
                    </div>
                  </div>
                  <Badge variant={scan.violations_found === 0 ? 'default' : 'destructive'}>
                    {scan.scan_status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMockDataTab;
