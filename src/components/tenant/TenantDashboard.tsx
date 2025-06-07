
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, Settings, Users } from 'lucide-react';

const TenantDashboard = () => {
  // Mock tenant data - in real implementation, this would come from the database
  const tenants = [
    {
      id: '1',
      name: 'CoinVision Main',
      domain: 'coinvision.ai',
      isActive: true,
      users: 1250,
      listings: 450,
      revenue: 45000
    },
    {
      id: '2',
      name: 'Rare Coins Europe',
      domain: 'rarecoins.eu',
      isActive: true,
      users: 340,
      listings: 120,
      revenue: 12000
    },
    {
      id: '3',
      name: 'Ancient Coins Hub',
      domain: 'ancient.coinvision.ai',
      isActive: false,
      users: 85,
      listings: 25,
      revenue: 3500
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Marketplace Tenants
          </CardTitle>
          <CardDescription>
            Manage multiple marketplace instances and their configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{tenant.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      {tenant.domain}
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span>{tenant.users} users</span>
                      <span>{tenant.listings} listings</span>
                      <span>€{tenant.revenue.toLocaleString()} revenue</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={tenant.isActive ? "default" : "secondary"}>
                    {tenant.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Multi-Tenant Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Isolated databases per tenant</li>
              <li>• Custom domain support</li>
              <li>• Individual branding and themes</li>
              <li>• Separate user management</li>
              <li>• Revenue tracking per tenant</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDashboard;
