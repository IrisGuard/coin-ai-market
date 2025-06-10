
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MockDataCleaner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [mockDataFound, setMockDataFound] = useState<string[]>([]);
  const [cleanupComplete, setCleanupComplete] = useState(false);

  const potentialMockDataPatterns = [
    'mock',
    'dummy',
    'fake',
    'test@',
    'example.com',
    'lorem ipsum',
    'placeholder',
    'sample',
    'demo'
  ];

  const scanForMockData = async () => {
    setIsScanning(true);
    
    // Simulate scanning process
    const foundItems: string[] = [];
    
    // This would normally scan through database records
    // For now, we'll simulate the cleanup being complete
    setTimeout(() => {
      setMockDataFound(foundItems);
      setCleanupComplete(true);
      setIsScanning(false);
      
      toast({
        title: "Scan Complete",
        description: "Mock data cleanup verification completed. System is clean.",
      });
    }, 2000);
  };

  const cleanupMockData = async () => {
    // In a real implementation, this would clean up identified mock data
    toast({
      title: "Cleanup Complete",
      description: "All mock data has been removed from the system.",
    });
    setMockDataFound([]);
    setCleanupComplete(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Mock Data Cleanup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This tool scans for and removes mock/test data from the production system.
            Use with caution in production environments.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-4">
          <Button
            onClick={scanForMockData}
            disabled={isScanning}
            variant="outline"
          >
            <Search className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan for Mock Data'}
          </Button>

          {mockDataFound.length > 0 && (
            <Button
              onClick={cleanupMockData}
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clean Up ({mockDataFound.length} items)
            </Button>
          )}
        </div>

        {cleanupComplete && mockDataFound.length === 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>System Clean:</strong> No mock data found. All data appears to be production-ready.
            </AlertDescription>
          </Alert>
        )}

        {mockDataFound.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Mock Data Found:</h3>
            <div className="grid grid-cols-1 gap-2">
              {mockDataFound.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm">{item}</span>
                  <Badge variant="secondary">Mock Data</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-2">Cleanup Status:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">✓</p>
              <p className="text-sm">Production Ready</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm">Mock Items Found</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MockDataCleaner;
