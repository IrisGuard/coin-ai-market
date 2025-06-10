
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign,
  BarChart3,
  PieChart,
  Filter
} from 'lucide-react';

const AdminReportsTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Get comprehensive report data
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['admin-reports', selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_dashboard_comprehensive');
      if (error) throw error;
      return data;
    },
  });

  const generateReport = async (reportType: string) => {
    console.log(`Generating ${reportType} report for last ${selectedPeriod} days`);
    // Implementation for report generation
  };

  const exportReport = async (format: string) => {
    console.log(`Exporting report as ${format}`);
    // Implementation for report export
  };

  const reportTypes = [
    { id: 'overview', name: 'System Overview', icon: BarChart3 },
    { id: 'users', name: 'User Analytics', icon: Users },
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign },
    { id: 'marketplace', name: 'Marketplace Activity', icon: TrendingUp },
    { id: 'security', name: 'Security Report', icon: FileText },
    { id: 'performance', name: 'Performance Metrics', icon: PieChart }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reports & Analytics</h3>
          <p className="text-sm text-muted-foreground">Generate detailed reports and export data</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <Button
                key={report.id}
                variant={selectedReport === report.id ? "default" : "outline"}
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => setSelectedReport(report.id)}
              >
                <report.icon className="h-6 w-6" />
                <span className="text-sm">{report.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.users?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{reportData?.users?.active_15min || 0} active now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{reportData?.transactions?.revenue?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">lifetime earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.coins?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {reportData?.coins?.featured || 0} featured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={reportData?.system?.health_status === 'healthy' ? 'default' : 'destructive'}>
                {reportData?.system?.health_status || 'Unknown'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData?.system?.errors_24h || 0} errors (24h)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Generate & Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => generateReport(selectedReport)}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={() => exportReport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => exportReport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportReport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsTab;
