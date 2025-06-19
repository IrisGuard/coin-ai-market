
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Github, Scan, AlertTriangle, CheckCircle, RefreshCw, Shield } from 'lucide-react';
import { useRealTimeGithubScanner } from '@/hooks/useRealTimeGithubScanner';
import { toast } from '@/hooks/use-toast';

const RealTimeGitHubMonitor = () => {
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [githubToken, setGithubToken] = useState('');
  
  const {
    scanGitHubRepository,
    violations,
    activeViolations,
    criticalViolations,
    highViolations,
    mediumViolations,
    lowViolations,
    violationsByType,
    resolveViolation,
    isLoading,
    refetchViolations,
    totalViolations,
    isScanning
  } = useRealTimeGithubScanner();

  const handleScan = async () => {
    if (!repoOwner || !repoName || !githubToken) {
      toast({
        title: "Missing Information",
        description: "Please provide repository owner, name, and GitHub token",
        variant: "destructive"
      });
      return;
    }

    try {
      await scanGitHubRepository.mutateAsync({ repoOwner, repoName, githubToken });
      toast({
        title: "Live Scan Completed",
        description: `Found ${totalViolations} real violations in repository`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Failed to scan repository. Check your credentials.",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scan Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Live GitHub Repository Scanner - Real Violation Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Repository Owner"
              value={repoOwner}
              onChange={(e) => setRepoOwner(e.target.value)}
            />
            <Input
              placeholder="Repository Name"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
            />
            <Input
              type="password"
              placeholder="GitHub Token"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleScan} disabled={isScanning}>
              {isScanning ? (
                <>
                  <Scan className="w-4 h-4 mr-2 animate-spin" />
                  Scanning Live Repository...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Start Live Scan
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => refetchViolations()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Violations</p>
                <p className="text-2xl font-bold text-red-600">{totalViolations}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-700">{criticalViolations.length}</p>
              </div>
              <Shield className="h-8 w-8 text-red-700" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">High</p>
              <p className="text-2xl font-bold text-orange-600">{highViolations.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Medium</p>
              <p className="text-2xl font-bold text-yellow-600">{mediumViolations.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Low</p>
              <p className="text-2xl font-bold text-blue-600">{lowViolations.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Status Alert */}
      <Alert variant={totalViolations > 0 ? "destructive" : "default"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          {totalViolations > 0 ? (
            <span className="font-semibold text-red-700">
              🚫 SYSTEM NOT PRODUCTION READY: {totalViolations} live violations detected in repository
            </span>
          ) : (
            <span className="font-semibold text-green-700">
              ✅ PRODUCTION READY: No violations detected in live repository scan
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Live Violations Table */}
      {activeViolations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Live Active Violations ({activeViolations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Line</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeViolations.slice(0, 50).map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell className="font-mono text-sm">
                      {violation.file_path}
                    </TableCell>
                    <TableCell>{violation.line_number}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{violation.violation_type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm max-w-xs truncate">
                      {violation.violation_content}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(violation.severity)}>
                        {violation.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveViolation.mutate(violation.id)}
                        disabled={resolveViolation.isPending}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {activeViolations.length > 50 && (
              <p className="text-sm text-muted-foreground mt-4">
                Showing 50 of {activeViolations.length} violations. Use filters to view more.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Violations by Type */}
      {Object.keys(violationsByType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Live Violations by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(violationsByType).map(([type, count]) => (
                <div key={type} className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{count}</p>
                  <p className="text-sm text-muted-foreground">{type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealTimeGitHubMonitor;
