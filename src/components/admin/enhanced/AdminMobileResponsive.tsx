
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, X, Users, Settings, BarChart3, Shield } from 'lucide-react';

interface MobileAdminProps {
  children: React.ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const AdminMobileResponsive: React.FC<MobileAdminProps> = ({ 
  children, 
  currentTab, 
  onTabChange 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const quickStats = [
    { label: 'Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { label: 'Revenue', value: '€45.2K', icon: BarChart3, color: 'bg-green-500' },
    { label: 'Alerts', value: '3', icon: Shield, color: 'bg-red-500' },
    { label: 'Active', value: '89%', icon: Settings, color: 'bg-purple-500' }
  ];

  const mainTabs = [
    { id: 'system', label: 'System', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
            <p className="text-sm text-gray-600 capitalize">{currentTab} Management</p>
          </div>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Admin Navigation</SheetTitle>
                <SheetDescription>
                  Access all admin functions
                </SheetDescription>
              </SheetHeader>
              
              <ScrollArea className="h-full py-4">
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {quickStats.map((stat) => (
                        <Card key={stat.label} className="p-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full ${stat.color} flex items-center justify-center`}>
                              <stat.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">{stat.label}</div>
                              <div className="text-sm font-semibold">{stat.value}</div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Navigation</h3>
                    <div className="space-y-1">
                      {mainTabs.map((tab) => (
                        <Button
                          key={tab.id}
                          variant={currentTab === tab.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => {
                            onTabChange(tab.id);
                            setIsMenuOpen(false);
                          }}
                        >
                          <tab.icon className="w-4 h-4 mr-2" />
                          {tab.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Quick Stats Bar */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2 overflow-x-auto">
            {quickStats.map((stat) => (
              <div key={stat.label} className="flex-shrink-0">
                <Badge variant="outline" className="whitespace-nowrap">
                  {stat.label}: {stat.value}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Header - Hidden on Mobile */}
      <div className="hidden lg:block p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">CoinVision Admin</h1>
            <p className="text-gray-600">Comprehensive administration dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            {quickStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-sm font-medium">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminMobileResponsive;
