
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, BarChart3, Settings } from 'lucide-react';
import EnhancedCategoryManager from '../enhanced/EnhancedCategoryManager';
import CategoryAnalyticsDashboard from '../enhanced/CategoryAnalyticsDashboard';
import OriginalCategoryForm from '../forms/OriginalCategoryForm';

const AdminCategoriesTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5" />
            Enhanced Categories Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manager" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manager" className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Category Manager
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics Dashboard
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manager" className="mt-6">
              <EnhancedCategoryManager />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <CategoryAnalyticsDashboard />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <OriginalCategoryForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategoriesTab;
