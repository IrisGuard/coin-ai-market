
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, Play, Pause, CheckCircle, XCircle, 
  Clock, Loader2, BarChart3, Settings
} from 'lucide-react';
import { useBulkOperations, useExecuteBulkOperation, useUpdateBulkOperationStatus } from '@/hooks/admin/useBulkOperations';

const BulkOperationsManager = () => {
  const { data: operations } = useBulkOperations();
  const executeBulkOperation = useExecuteBulkOperation();
  const updateOperationStatus = useUpdateBulkOperationStatus();
  
  const [newOperation, setNewOperation] = useState({
    operation_type: '',
    operation_name: '',
    target_table: '',
    operation_parameters: {}
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (operation: any) => {
    if (operation.total_records === 0) return 0;
    return Math.round((operation.processed_records / operation.total_records) * 100);
  };

  const handleCreateOperation = async () => {
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
      console.error('Failed to create bulk operation:', error);
    }
  };

  const operationTypes = [
    { value: 'update', label: 'Bulk Update' },
    { value: 'delete', label: 'Bulk Delete' },
    { value: 'export', label: 'Data Export' },
    { value: 'import', label: 'Data Import' },
    { value: 'cleanup', label: 'Data Cleanup' },
    { value: 'migration', label: 'Data Migration' }
  ];

  const targetTables = [
    { value: 'coins', label: 'Coins' },
    { value: 'profiles', label: 'User Profiles' },
    { value: 'stores', label: 'Stores' },
    { value: 'categories', label: 'Categories' },
    { value: 'transactions', label: 'Transactions' },
    { value: 'external_price_sources', label: 'Price Sources' }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="operations">Active Operations</TabsTrigger>
          <TabsTrigger value="create">Create Operation</TabsTrigger>
          <TabsTrigger value="history">Operation History</TabsTrigger>
        </TabsList>

        <TabsContent value="operations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Bulk Operations Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operations?.filter(op => op.status !== 'completed' && op.status !== 'failed').map((operation) => (
                  <Card key={operation.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(operation.status)}
                          <div>
                            <h4 className="font-medium">{operation.operation_name}</h4>
                            <p className="text-sm text-gray-600">
                              {operation.operation_type} on {operation.target_table}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(operation.status)}>
                            {operation.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Started:</span>
                          <div className="font-medium">
                            {new Date(operation.started_at).toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Progress:</span>
                          <div className="font-medium">
                            {operation.processed_records}/{operation.total_records}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Failed:</span>
                          <div className="font-medium text-red-600">
                            {operation.failed_records}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Completion:</span>
                          <div className="font-medium">
                            {calculateProgress(operation)}%
                          </div>
                        </div>
                      </div>

                      {operation.total_records > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${calculateProgress(operation)}%` }}
                          ></div>
                        </div>
                      )}

                      {operation.error_log && operation.error_log.length > 0 && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                          <span className="text-red-600 font-medium">Recent Errors:</span>
                          <div className="mt-1 max-h-20 overflow-y-auto">
                            {operation.error_log.slice(-3).map((error: any, index: number) => (
                              <div key={index} className="text-xs text-red-700">
                                {error.message || error}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        {operation.status === 'running' && (
                          <Button size="sm" variant="outline">
                            <Pause className="w-3 h-3 mr-1" />
                            Pause
                          </Button>
                        )}
                        {operation.status === 'paused' && (
                          <Button size="sm" variant="outline">
                            <Play className="w-3 h-3 mr-1" />
                            Resume
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!operations || operations.filter(op => op.status !== 'completed' && op.status !== 'failed').length === 0) && (
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
                <Settings className="w-5 h-5" />
                Create New Bulk Operation
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
                      {operationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
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
                      {targetTables.map((table) => (
                        <SelectItem key={table.value} value={table.value}>
                          {table.label}
                        </SelectItem>
                      ))}
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
                  placeholder="Enter a descriptive name for the operation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operation-parameters">Operation Parameters (JSON)</Label>
                <Textarea
                  id="operation-parameters"
                  value={JSON.stringify(newOperation.operation_parameters, null, 2)}
                  onChange={(e) => {
                    try {
                      const params = JSON.parse(e.target.value);
                      setNewOperation({...newOperation, operation_parameters: params});
                    } catch (error) {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='{"conditions": {}, "updates": {}, "options": {}}'
                  rows={6}
                />
              </div>

              <Button 
                onClick={handleCreateOperation}
                disabled={executeBulkOperation.isPending || !newOperation.operation_type || !newOperation.operation_name || !newOperation.target_table}
                className="w-full"
              >
                {executeBulkOperation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Operation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Create & Start Operation
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
                {operations?.filter(op => op.status === 'completed' || op.status === 'failed').map((operation) => (
                  <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(operation.status)}
                      <div>
                        <h4 className="font-medium">{operation.operation_name}</h4>
                        <p className="text-sm text-gray-600">
                          {operation.operation_type} on {operation.target_table}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>Started: {new Date(operation.started_at).toLocaleString()}</span>
                          {operation.completed_at && (
                            <span>Completed: {new Date(operation.completed_at).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">
                        {operation.processed_records}/{operation.total_records} processed
                      </div>
                      {operation.failed_records > 0 && (
                        <div className="text-sm text-red-600">
                          {operation.failed_records} failed
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {(!operations || operations.filter(op => op.status === 'completed' || op.status === 'failed').length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4" />
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
              {operations?.filter(op => op.status === 'running').length || 0}
            </div>
            <div className="text-sm text-gray-600">Running</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {operations?.filter(op => op.status === 'pending').length || 0}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {operations?.filter(op => op.status === 'completed').length || 0}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {operations?.filter(op => op.status === 'failed').length || 0}
            </div>
            <div className="text-sm text-gray-600">Failed</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BulkOperationsManager;
