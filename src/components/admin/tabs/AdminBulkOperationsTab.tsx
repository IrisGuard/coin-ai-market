
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Upload, 
  Download, 
  Users, 
  Coins, 
  Store, 
  PlayCircle,
  PauseCircle,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

const AdminBulkOperationsTab = () => {
  const [operationType, setOperationType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock bulk operations data
  const recentOperations = [
    {
      id: '1',
      type: 'coin_import',
      status: 'completed',
      total_items: 150,
      processed_items: 150,
      failed_items: 0,
      created_at: new Date().toISOString(),
      duration: '2m 34s'
    },
    {
      id: '2',
      type: 'user_export',
      status: 'in_progress',
      total_items: 500,
      processed_items: 320,
      failed_items: 2,
      created_at: new Date().toISOString(),
      duration: '1m 15s'
    },
    {
      id: '3',
      type: 'store_verification',
      status: 'failed',
      total_items: 25,
      processed_items: 15,
      failed_items: 10,
      created_at: new Date().toISOString(),
      duration: '45s'
    }
  ];

  const operationTypes = [
    { value: 'coin_import', label: 'Bulk Coin Import', icon: Coins },
    { value: 'coin_export', label: 'Bulk Coin Export', icon: Download },
    { value: 'user_import', label: 'Bulk User Import', icon: Users },
    { value: 'user_export', label: 'Bulk User Export', icon: Download },
    { value: 'store_verification', label: 'Bulk Store Verification', icon: Store },
    { value: 'price_update', label: 'Bulk Price Update', icon: Package },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'failed': return <AlertTriangle className="w-4 h-4" />;
      case 'paused': return <PauseCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleStartOperation = () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Bulk Operation Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Operations</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">1,180</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">64</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Bulk Operation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Create New Bulk Operation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Operation Type</label>
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {operationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Drop your CSV file here or <span className="text-blue-600 cursor-pointer">browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports CSV, XLSX formats up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Configuration</label>
                <Textarea
                  placeholder="Enter operation-specific configuration in JSON format..."
                  className="h-32"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleStartOperation}
                  disabled={!operationType || isProcessing}
                  className="flex-1"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Start Operation'}
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Template
                </Button>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing...</span>
                <span className="text-sm text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Recent Bulk Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOperations.map((operation) => (
              <div key={operation.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(operation.status)}`}>
                      {getStatusIcon(operation.status)}
                      {operation.status.replace('_', ' ')}
                    </div>
                    <Badge variant="outline">
                      {operation.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {operation.status === 'in_progress' && (
                      <>
                        <Button size="sm" variant="outline">
                          <PauseCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Items:</span>
                    <span className="ml-1 font-medium">{operation.total_items}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Processed:</span>
                    <span className="ml-1 font-medium text-green-600">{operation.processed_items}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Failed:</span>
                    <span className="ml-1 font-medium text-red-600">{operation.failed_items}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-1 font-medium">{operation.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Started:</span>
                    <span className="ml-1 font-medium">
                      {new Date(operation.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {operation.status === 'in_progress' && (
                  <div className="mt-3">
                    <Progress 
                      value={(operation.processed_items / operation.total_items) * 100} 
                      className="w-full" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <Coins className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Import Coins</div>
                <div className="text-xs opacity-80">Bulk add coins</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <Users className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Export Users</div>
                <div className="text-xs opacity-80">Download user data</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <Store className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Verify Stores</div>
                <div className="text-xs opacity-80">Batch verification</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-16">
              <Package className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Update Prices</div>
                <div className="text-xs opacity-80">Bulk price sync</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBulkOperationsTab;
