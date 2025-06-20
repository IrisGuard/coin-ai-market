
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Eye, 
  Search, 
  Download,
  BarChart3,
  Users,
  Image as ImageIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDualAnalysisTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: analysisData = [], isLoading } = useQuery({
    queryKey: ['admin-dual-analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dual_image_analysis')
        .select(`
          *,
          profiles!dual_image_analysis_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const stats = {
    totalAnalyses: analysisData.length,
    highConfidence: analysisData.filter(a => (a.confidence_score || 0) > 0.8).length,
    errorsDetected: analysisData.filter(a => (a.detected_errors || []).length > 0).length,
    avgConfidence: analysisData.length > 0 
      ? Math.round((analysisData.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / analysisData.length) * 100)
      : 0
  };

  const filteredData = analysisData.filter(analysis => {
    const matchesSearch = !searchTerm || 
      (analysis.analysis_results as any)?.coinName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (analysis.profiles as any)?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'high-confidence' && (analysis.confidence_score || 0) > 0.8) ||
      (statusFilter === 'errors' && (analysis.detected_errors || []).length > 0) ||
      (statusFilter === 'recent' && new Date(analysis.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dual Analysis Management</h2>
          <p className="text-muted-foreground">
            Comprehensive dual-side image analysis results and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Confidence</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highConfidence}</div>
            <p className="text-xs text-muted-foreground">Above 80% confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.errorsDetected}</div>
            <p className="text-xs text-muted-foreground">With error patterns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgConfidence}%</div>
            <p className="text-xs text-muted-foreground">Overall accuracy</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by coin name or user email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              <option value="all">All Results</option>
              <option value="high-confidence">High Confidence (80%+)</option>
              <option value="errors">With Errors</option>
              <option value="recent">Recent (24h)</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredData.map((analysis) => (
              <div key={analysis.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {(analysis.analysis_results as any)?.coinName || 'Unknown Coin'}
                      </h3>
                      <Badge variant="outline">
                        {Math.round((analysis.confidence_score || 0) * 100)}% confidence
                      </Badge>
                      {(analysis.detected_errors || []).length > 0 && (
                        <Badge variant="destructive">
                          {(analysis.detected_errors || []).length} errors
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">User:</span>{' '}
                    {(analysis.profiles as any)?.email || 'Unknown'}
                  </div>
                  <div>
                    <span className="font-medium">Grade:</span>{' '}
                    {analysis.grade_assessment || 'Not assessed'}
                  </div>
                  <div>
                    <span className="font-medium">Value Range:</span>{' '}
                    ${(analysis.estimated_value_range as any)?.min || 0} - 
                    ${(analysis.estimated_value_range as any)?.max || 0}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                    <span className="text-xs text-gray-500">Front</span>
                  </div>
                  <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
                    <span className="text-xs text-gray-500">Back</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No analysis results found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDualAnalysisTab;
