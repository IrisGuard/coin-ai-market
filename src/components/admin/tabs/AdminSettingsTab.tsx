
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Shield, Download, Zap, Heart } from 'lucide-react';
import AdminSecurityEnhancements from '../enhanced/AdminSecurityEnhancements';
import AdminDarkModeToggle from '../enhanced/AdminDarkModeToggle';
import AdminExportManager from '../enhanced/AdminExportManager';
import AdminPerformanceOptimizer from '../enhanced/AdminPerformanceOptimizer';
import AdminSystemHealth from '../enhanced/AdminSystemHealth';

const AdminSettingsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure and manage system-wide settings
          </p>
        </div>
        <AdminDarkModeToggle />
      </div>

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security">
          <AdminSecurityEnhancements />
        </TabsContent>

        <TabsContent value="export">
          <AdminExportManager />
        </TabsContent>

        <TabsContent value="performance">
          <AdminPerformanceOptimizer />
        </TabsContent>

        <TabsContent value="health">
          <AdminSystemHealth />
        </TabsContent>

        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Application Name</label>
                  <input 
                    type="text" 
                    defaultValue="CoinVision Admin" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option>UTC</option>
                    <option>Europe/Athens</option>
                    <option>America/New_York</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-md">
                    <option>English</option>
                    <option>Ελληνικά</option>
                    <option>Español</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enable Maintenance Mode</span>
                  <input type="checkbox" className="toggle" />
                </div>
                <div>
                  <label className="text-sm font-medium">Maintenance Message</label>
                  <textarea 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    rows={3}
                    defaultValue="System is currently under maintenance. Please check back later."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsTab;
