
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brain, Upload, Check, X, Search, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AITrainingManager = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: trainingData, isLoading } = useQuery({
    queryKey: ['ai-training-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_training_data')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching AI training data:', error);
        throw error;
      }
      
      console.log('✅ AI training data loaded:', data?.length);
      return data || [];
    }
  });

  const filteredData = trainingData?.filter(data => 
    data.image_hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.validation_status.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalData: trainingData?.length || 0,
    validated: trainingData?.filter(d => d.validation_status === 'validated').length || 0,
    pending: trainingData?.filter(d => d.validation_status === 'pending').length || 0,
    avgQuality: trainingData?.reduce((sum, d) => sum + (d.training_quality_score || 0), 0) / (trainingData?.length || 1)
  };

  // Helper function to safely extract coin identification data
  const getCoinIdentification = (coinId: any) => {
    if (!coinId || typeof coinId !== 'object') return { name: 'Unknown', year: 'N/A', grade: 'N/A' };
    
    const identification = coinId as { [key: string]: any };
    return {
      name: identification.name || 'Unknown',
      year: identification.year || 'N/A',
      grade: identification.grade || 'N/A'
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              AI Training Data Management
            </CardTitle>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Training Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search training data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalData}</div>
              <div className="text-sm text-muted-foreground">Total Samples</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.validated}</div>
              <div className="text-sm text-muted-foreground">Validated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(stats.avgQuality * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Quality</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Data ({filteredData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image Hash</TableHead>
                <TableHead>Identification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quality Score</TableHead>
                <TableHead>Contributor</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((data) => {
                const coinInfo = getCoinIdentification(data.coin_identification);
                
                return (
                  <TableRow key={data.id}>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {data.image_hash.substring(0, 12)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm font-medium">
                          {coinInfo.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {coinInfo.year} • {coinInfo.grade}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(data.validation_status)}>
                        {data.validation_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{Math.round((data.training_quality_score || 0) * 100)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {data.contributed_by ? 'User' : 'System'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(data.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {data.validation_status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITrainingManager;
