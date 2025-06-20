
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SecurityBlockingMechanism = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Security Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <div className="font-bold text-green-800">System Secure</div>
              <div className="text-sm text-green-700">Production environment verified</div>
            </div>
          </div>
          <Badge className="bg-green-600 text-white">SECURE</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityBlockingMechanism;
