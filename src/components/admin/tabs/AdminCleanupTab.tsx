
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Rocket } from 'lucide-react';
import ProductionCleanupButton from '@/components/admin/ProductionCleanupButton';

const AdminCleanupTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Production Optimization</h2>
          <p className="text-muted-foreground">
            Τελική βελτιστοποίηση και ενεργοποίηση πλήρους παραγωγικής λειτουργίας
          </p>
        </div>
      </div>

      <Alert className="border-blue-300 bg-blue-50">
        <Rocket className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-blue-800">
              🚀 Έτοιμος για τελική μετάβαση σε LIVE πλατφόρμα
            </span>
          </div>
        </AlertDescription>
      </Alert>

      <ProductionCleanupButton />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Πληροφορίες Βελτιστοποίησης
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Στοιχεία προς βελτιστοποίηση:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Components και pages</li>
                  <li>• Utilities και debug tools</li>
                  <li>• Images και dummy data</li>
                  <li>• Analytics events</li>
                  <li>• Development-only configurations</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Μετά τη βελτιστοποίηση:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 100% παραγωγική λειτουργία</li>
                  <li>• Μόνο πραγματικά δεδομένα</li>
                  <li>• Βελτιστοποιημένη απόδοση</li>
                  <li>• Ασφαλές production περιβάλλον</li>
                  <li>• Έτοιμο για live χρήση</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCleanupTab;
