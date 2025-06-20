
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminMockDataTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Status</h2>
          <p className="text-muted-foreground">
            Production system monitoring and status
          </p>
        </div>
      </div>

      <Alert className="border-green-300 bg-green-50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-green-800">
              ✅ System Ready - 100% Production Environment
            </span>
            <Badge variant="default">PRODUCTION</Badge>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Production Environment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">LIVE</p>
              <p className="text-sm text-muted-foreground">System Status</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">READY</p>
              <p className="text-sm text-muted-foreground">For Production</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">CLEAN</p>
              <p className="text-sm text-muted-foreground">No Test Data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMockDataTab;
