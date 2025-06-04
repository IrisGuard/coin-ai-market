
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

const AdminPanelHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-600" />
          CoinVision AI Admin Panel
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Shield className="h-4 w-4 mr-1" />
          VPN Protected
        </Badge>
      </DialogTitle>
    </DialogHeader>
  );
};

export default AdminPanelHeader;
