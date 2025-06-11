
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Search, Settings, Play, Pause } from 'lucide-react';

interface DataSourcesTableProps {
  dataSources: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sourcesLoading: boolean;
  updateDataSourceMutation: any;
}

const DataSourcesTable: React.FC<DataSourcesTableProps> = ({
  dataSources,
  searchTerm,
  setSearchTerm,
  sourcesLoading,
  updateDataSourceMutation
}) => {
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredDataSources = dataSources.filter(source =>
    source.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Sources Management</CardTitle>
        <CardDescription>Monitor and manage internal data sources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search data sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {sourcesLoading ? (
          <div className="text-center py-8">Loading data sources...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDataSources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell>
                    <div className="font-medium">{source.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-blue-600 hover:underline">
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.url}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{source.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(source.is_active)}>
                      {source.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{((source.success_rate || 0) * 100).toFixed(1)}%</span>
                      <Progress value={(source.success_rate || 0) * 100} className="w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{source.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Configure: {source.name}</DialogTitle>
                            <DialogDescription>
                              Manage data source settings and status
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={source.is_active}
                                onCheckedChange={(checked) => 
                                  updateDataSourceMutation.mutate({
                                    sourceId: source.id,
                                    updates: { is_active: checked },
                                    tableType: 'data_sources'
                                  })
                                }
                              />
                              <Label>Active Status</Label>
                            </div>
                            <div>
                              <Label>Last Used</Label>
                              <p className="text-sm text-gray-600">
                                {source.last_used ? new Date(source.last_used).toLocaleString() : 'Never'}
                              </p>
                            </div>
                            <div>
                              <Label>Rate Limit</Label>
                              <p className="text-sm text-gray-600">{source.rate_limit} requests/hour</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant={source.is_active ? "destructive" : "default"}
                        size="sm"
                        onClick={() => 
                          updateDataSourceMutation.mutate({
                            sourceId: source.id,
                            updates: { is_active: !source.is_active },
                            tableType: 'data_sources'
                          })
                        }
                        disabled={updateDataSourceMutation.isPending}
                      >
                        {source.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default DataSourcesTable;
