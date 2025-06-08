
import React from 'react';
import { usePageView } from '@/hooks/usePageView';
import Navbar from "@/components/Navbar";
import AdminPanel from "@/components/admin/AdminPanel";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database, Users, BarChart3 } from 'lucide-react';

const AdminPanelPage = () => {
  usePageView();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage your CoinVision platform settings, users, and data
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-electric-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-gray-600">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
              <Database className="h-4 w-4 text-electric-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-gray-600">+3 new this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
              <BarChart3 className="h-4 w-4 text-electric-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15,678</div>
              <p className="text-xs text-gray-600">+234 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Settings className="h-4 w-4 text-electric-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-electric-green">Online</div>
              <p className="text-xs text-gray-600">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Panel Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Advanced Admin Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdminPanel isOpen={true} onClose={() => {}} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanelPage;
