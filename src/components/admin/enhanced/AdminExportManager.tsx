
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Database, Users, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminExportManager = () => {
  const [exportType, setExportType] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportOptions = [
    { value: 'users', label: 'Users Data', icon: Users, description: 'Export all user profiles and statistics' },
    { value: 'coins', label: 'Coins Data', icon: Database, description: 'Export coin listings and metadata' },
    { value: 'analytics', label: 'Analytics Report', icon: BarChart3, description: 'Export analytics and performance data' },
    { value: 'transactions', label: 'Transactions', icon: FileText, description: 'Export payment and transaction history' }
  ];

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    if (!exportType) {
      toast({
        title: "Selection Required",
        description: "Please select a data type to export",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Export Successful",
        description: `${exportType} data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Data Export Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-3 block">Select Data Type</label>
          <Select value={exportType} onValueChange={setExportType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose data to export" />
            </SelectTrigger>
            <SelectContent>
              {exportOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {exportType && (
            <p className="text-sm text-muted-foreground mt-2">
              {exportOptions.find(opt => opt.value === exportType)?.description}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Export Format</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={isExporting || !exportType}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('json')}
              disabled={isExporting || !exportType}
              className="flex-1"
            >
              <Database className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              disabled={isExporting || !exportType}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {isExporting && (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Preparing export...</p>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Recent Exports</h4>
          <div className="space-y-2">
            {[
              { name: 'users_export_2024.csv', time: '2 hours ago', size: '2.4 MB' },
              { name: 'analytics_report.pdf', time: '1 day ago', size: '1.8 MB' },
              { name: 'coins_data.json', time: '3 days ago', size: '15.2 MB' }
            ].map((file, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded">
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.time} • {file.size}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminExportManager;
