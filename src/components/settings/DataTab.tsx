
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const DataTab = () => {
  const { user } = useAuth();

  const exportData = async () => {
    try {
      // Fetch all user data
      const [profileRes, settingsRes, portfolioRes, favoritesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id),
        supabase.from('user_settings').select('*').eq('user_id', user?.id),
        supabase.from('user_portfolios').select('*').eq('user_id', user?.id),
        supabase.from('user_favorites').select('*').eq('user_id', user?.id)
      ]);

      const exportData = {
        profile: profileRes.data,
        settings: settingsRes.data,
        portfolio: portfolioRes.data,
        favorites: favoritesRes.data,
        exported_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coinvision-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error exporting data');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Data Management
        </CardTitle>
        <CardDescription>Export your data and manage your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Export Data</h4>
          <p className="text-sm text-gray-600 mb-4">Download all your data in JSON format</p>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
