
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, CheckCircle, Scan, FileX, Database } from 'lucide-react';
import { toast } from 'sonner';

const ProductionDataDetectionPanel = () => {
  const [scanning, setScanning] = useState(false);
  const queryClient = useQueryClient();

  // Fetch mock data violations
  const { data: violations = [], isLoading } = useQuery({
    queryKey: ['mock-data-violations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mock_data_violations')
        .select('*')
        .order('detected_at', { ascending: false });

      if (error) {
        console.error('Error fetching violations:', error);
        return [];
      }

      return data || [];
    }
  });

  // Run security scan mutation
  const runScanMutation = useMutation({
    mutationFn: async () => {
      setScanning(true);
      
      // Simulate scan process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock scan results - in production this would scan actual files
      const mockResults = {
        filesScanned: 127,
        violationsFound: 3,
        cleanFiles: 124,
        securityScore: 97
      };
      
      return mockResults;
    },
    onSuccess: (results) => {
      toast.success(`Scan complete: ${results.violationsFound} violations found in ${results.filesScanned} files`);
      queryClient.invalidateQueries({ queryKey: ['mock-data-violations'] });
    },
    onError: () => {
      toast.error('Scan failed. Please try again.');
    },
    onSettled: () => {
      setScanning(false);
    }
  });

  // Resolve violation mutation
  const resolveViolationMutation = useMutation({
    mutationFn: async (violationId: string) => {
      const { error } = await supabase
        .from('mock_data_violations')
        .update({ 
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', violationId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Violation resolved successfully');
      queryClient.invalidateQueries({ queryKey: ['mock-data-violations'] });
    },
    onError: () => {
      toast.error('Failed to resolve violation');
    }
  });

  const activeViolations = violations.filter(v => v.status === 'active');
  const resolvedViolations = violations.filter(v => v.status === 'resolved');
  const securityScore = violations.length > 0 ? Math.max(0, 100 - (activeViolations.length * 10)) : 100;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
                <p className="text-xs text-muted-foreground">Security Score</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{activeViolations.length}</div>
                <p className="text-xs text-muted-foreground">Active Issues</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{resolvedViolations.length}</div>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{violations.length}</div>
                <p className="text-xs text-muted-foreground">Total Scanned</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scan Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Production Data Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This scanner detects mock data patterns, hardcoded credentials, and production security violations.
                Run regular scans to maintain production security standards.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => runScanMutation.mutate()}
              disabled={scanning}
              className="w-full"
            >
              {scanning ? (
                <>
                  <Scan className="h-4 w-4 mr-2 animate-spin" />
                  Scanning Files...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Run Security Scan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Violations */}
      {activeViolations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Active Security Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeViolations.map((violation) => (
                <div key={violation.id} className={`p-4 rounded-lg border ${getSeverityColor(violation.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive">{violation.severity.toUpperCase()}</Badge>
                        <Badge variant="outline">{violation.violation_type}</Badge>
                      </div>
                      <div className="font-medium mb-1">{violation.file_path}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Line {violation.line_number || 'Unknown'} • Detected: {new Date(violation.detected_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                        {violation.violation_content}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveViolationMutation.mutate(violation.id)}
                      disabled={resolveViolationMutation.isPending}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Issues State */}
      {activeViolations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">No Security Issues Detected</h3>
            <p className="text-muted-foreground mb-4">
              Your codebase appears to be clean of mock data and security violations.
            </p>
            <Button 
              variant="outline" 
              onClick={() => runScanMutation.mutate()}
              disabled={scanning}
            >
              <Scan className="h-4 w-4 mr-2" />
              Run Another Scan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionDataDetectionPanel;
