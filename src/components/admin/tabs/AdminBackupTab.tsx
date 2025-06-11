
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Download, Upload, Calendar, CheckCircle } from 'lucide-react';

const AdminBackupTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Backup & Recovery</h3>
          <p className="text-sm text-muted-foreground">Manage system backups and data recovery</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Create Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a full system backup including all data and configurations
            </p>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Create Full Backup
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Create Data Backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Restore from Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Restore system from a previous backup
            </p>
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Backup File
            </Button>
            <Button variant="secondary" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              View Backup History
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Backups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, date: '2024-01-15 10:30', type: 'Full Backup', size: '2.5 GB', status: 'completed' },
              { id: 2, date: '2024-01-14 10:30', type: 'Data Backup', size: '1.8 GB', status: 'completed' },
              { id: 3, date: '2024-01-13 10:30', type: 'Full Backup', size: '2.4 GB', status: 'completed' }
            ].map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{backup.type}</div>
                  <div className="text-sm text-muted-foreground">{backup.date}</div>
                  <div className="text-xs text-muted-foreground">Size: {backup.size}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {backup.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBackupTab;
