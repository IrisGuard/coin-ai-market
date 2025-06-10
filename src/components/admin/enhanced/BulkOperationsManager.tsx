
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Package, Play, Pause, Clock, CheckCircle, AlertTriangle, 
  Download, Upload, Trash2, Users, Database, Settings
} from 'lucide-react';
import { useBulkOperations, useExecuteBulkOperation, useUpdateBulkOperationStatus } from '@/hooks/admin/useBulkOperations';

const BulkOperationsManager = () => {
  const { data: operations, isLoading } = useBulkOperations();
  const executeBulkOperation = useExecuteBulkOperation();
  const updateOperationStatus = useUpdateBulkOperationStatus();
  
  const [newOperation, setNewOperation] = useState({
    operation_type: '',
    operation_name: '',
    target_table: '',
    operation_parameters: {}
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'import': return <Upload className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'update': return <Settings className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleExecuteOperation = async () => {
    if (!newOperation.operation_type || !newOperation.operation_name || !newOperation.target_table) {
      return;
    }

    try {
      await executeBulkOperation.mutateAsync(newOperation);
      setNewOperation({
        operation_type: '',
        operation_name: '',
        target_table: '',
        operation_parameters: {}
      });
    } catch (error) {
      console.error('Failed to execute bulk operation:', error);
    }
  };

  const calculateProgress = (operation: any) => {
    if (operation.total_records === 0) return 0;
    return Math.round((operation.processed_records / operation.total_records) * 100);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading bulk operations...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Operations</TabsTrigger>
          <TabsTrigger value="create">Create Operation</TabsTrigger>
          <TabsTrigger value="history">Operation History</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Active Bulk Operations
                </span>
                <Badge variant="outline">
                  {Array.isArray(operations) ? operations.filter(op => op.status === 'running' || op.status === 'pending').length : 0} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(operations) ? operations.filter(op => op.status === 'running' || op.status === 'pending').map((operation) => (
                  <Card key={operation.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getOperationIcon(operation.operation_type)}
                          <div>
                            <h4 className="font-medium">{operation.operation_name}</h4>
                            <p className="text-sm text-gray-600 capitalize">
                              {operation.operation_type} on {operation.target_table}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(operation.status)}>
                          {operation.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{operation.processed_records} / {operation.total_records} records</span>
                        </div>
                        <Progress value={calculateProgress(operation)} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Started:</span>
                          <div className="font-medium">
                            {new Date(operation.started_at).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Processed:</span>
                          <div className="font-medium text-green-600">
                            {operation.processed_records}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Failed:</span>
                          <div className="font-medium text-red-600">
                            {operation.failed_records}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">ETA:</span>
                          <div className="font-medium">
                            {operation.status === 'running' ? '5 min' : '-'}
                          </div>
                        </div>
                      </div>

                      {operation.status === 'running' && (
                        <div className="flex items-center gap-2 pt-3 border-t mt-4">
                          <Button size="sm" variant="outline">
                            <Pause className="w-3 h-3 mr-1" />
                            Pause
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-3 h-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )) : []}

                {(!operations || !Array.isArray(operations) || operations.filter(op => op.status === 'running' || op.status === 'pending').length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4" />
                    <p>No active bulk operations</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Create Bulk Operation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="operation-type">Operation Type</Label>
                  <Select 
                    value={newOperation.operation_type} 
                    onValueChange={(value) => setNewOperation({...newOperation, operation_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="import">Bulk Import</SelectItem>
                      <SelectItem value="export">Bulk Export</SelectItem>
                      <SelectItem value="update">Bulk Update</SelectItem>
                      <SelectItem value="delete">Bulk Delete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-table">Target Table</Label>
                  <Select 
                    value={newOperation.target_table} 
                    onValueChange={(value) => setNewOperation({...newOperation, target_table: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target table" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coins">Coins</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="stores">Stores</SelectItem>
                      <SelectItem value="transactions">Transactions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operation-name">Operation Name</Label>
                <Input
                  id="operation-name"
                  value={newOperation.operation_name}
                  onChange={(e) => setNewOperation({...newOperation, operation_name: e.target.value})}
                  placeholder="Enter a descriptive name for this operation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operation-params">Operation Parameters (JSON)</Label>
                <Textarea
                  id="operation-params"
                  value={JSON.stringify(newOperation.operation_parameters, null, 2)}
                  onChange={(e) => {
                    try {
                      const params = JSON.parse(e.target.value);
                      setNewOperation({...newOperation, operation_parameters: params});
                    } catch (error) {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='{"filters": {}, "options": {}}'
                  rows={6}
                />
              </div>

              <Button 
                onClick={handleExecuteOperation}
                disabled={executeBulkOperation.isPending || !newOperation.operation_type || !newOperation.operation_name || !newOperation.target_table}
                className="w-full"
              >
                {executeBulkOperation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Starting Operation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Execute Bulk Operation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Operation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.isArray(operations) ? operations.filter(op => op.status === 'completed' || op.status === 'failed').map((operation) => (
                  <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getOperationIcon(operation.operation_type)}
                      <div>
                        <h4 className="font-medium">{operation.operation_name}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {operation.operation_type} on {operation.target_table}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>Started: {new Date(operation.started_at).toLocaleDateString()}</span>
                          {operation.completed_at && (
                            <span>Completed: {new Date(operation.completed_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">
                        {operation.processed_records} / {operation.total_records} records
                      </div>
                    </div>
                  </div>
                )) : []}

                {(!operations || !Array.isArray(operations) || operations.filter(op => op.status === 'completed' || op.status === 'failed').length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4" />
                    <p>No completed operations found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Operation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Array.isArray(operations) ? operations.filter(op => op.status === 'running').length : 0}
            </div>
            <div className="text-sm text-gray-600">Running</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {Array.isArray(operations) ? operations.filter(op => op.status === 'pending').length : 0}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {Array.isArray(operations) ? operations.filter(op => op.status === 'completed').length : 0}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {Array.isArray(operations) ? operations.filter(op => op.status === 'failed').length : 0}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BulkOperationsManager;
