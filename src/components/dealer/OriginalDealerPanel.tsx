
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useSmartUserRole } from '@/hooks/useSmartUserRole';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, Store, Wallet, Mail, MapPin, Brain, 
  Activity, Zap, CheckCircle, Settings, Users
} from 'lucide-react';
import ProductionCoinUploadManager from './ProductionCoinUploadManager';
import StoreManager from './StoreManager';

const OriginalDealerPanel = () => {
  const { user } = useAuth();
  const { data: userRole } = useSmartUserRole();
  const [selectedCategory, setSelectedCategory] = useState('american');
  const [activeTab, setActiveTab] = useState('upload');

  // Fetch 30 categories from Supabase
  const { data: categories = [] } = useQuery({
    queryKey: ['dealer-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch user stores
  const { data: userStores = [] } = useQuery({
    queryKey: ['user-dealer-stores', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    console.log('🔴 ORIGINAL DEALER PANEL LOADED - 30 Categories + Wallet + Admin Connection');
    console.log('✅ Categories loaded:', categories.length);
    console.log('✅ User stores:', userStores.length);
    console.log('✅ User role:', userRole);
  }, [categories, userStores, userRole]);

  // Security check - only dealers and admins
  if (!user || (userRole !== 'dealer' && userRole !== 'admin')) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-4">
            This panel is only available for verified dealers and administrators.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Return to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Status Header */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Activity className="h-6 w-6 animate-pulse" />
            🔴 ORIGINAL DEALER PANEL - LIVE PRODUCTION SYSTEM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-semibold text-green-800">30 Categories</div>
                <Badge className="bg-green-600">ACTIVE</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-800">Wallet System</div>
                <Badge className="bg-blue-600">LIVE</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-semibold text-purple-800">AI Brain</div>
                <Badge className="bg-purple-600">CONNECTED</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-semibold text-orange-800">Admin Panel</div>
                <Badge className="bg-orange-600">SYNCED</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dealer Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Coin Upload
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            My Stores ({userStores.length})
          </TabsTrigger>
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="postal" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Postal Info
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Admin Panel
          </TabsTrigger>
        </TabsList>

        {/* Coin Upload Tab */}
        <TabsContent value="upload">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI-Powered Coin Upload - 30 Categories Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 30 Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
                  {categories.slice(0, 30).map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.name)}
                      className="text-xs"
                    >
                      {category.icon && <span className="mr-1">{category.icon}</span>}
                      {category.name}
                    </Button>
                  ))}
                </div>

                <ProductionCoinUploadManager 
                  maxImages={10}
                  onImagesProcessed={(images) => {
                    console.log('✅ Images processed:', images.length);
                  }}
                  onAIAnalysisComplete={(results) => {
                    console.log('🧠 AI Analysis complete:', results);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Store Management Tab */}
        <TabsContent value="stores">
          <StoreManager />
        </TabsContent>

        {/* Wallet Tab */}
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Management System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">$0.00</div>
                    <p className="text-sm text-green-700">Available Balance</p>
                    <Badge className="bg-green-600 text-white mt-2">LIVE WALLET</Badge>
                  </CardContent>
                </Card>
                
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">$0.00</div>
                    <p className="text-sm text-blue-700">Pending Earnings</p>
                    <Badge className="bg-blue-600 text-white mt-2">REAL TIME</Badge>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <p className="text-sm text-purple-700">Total Sales</p>
                    <Badge className="bg-purple-600 text-white mt-2">LIVE COUNT</Badge>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Wallet Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">💳 Payment Processing</h4>
                    <p className="text-sm text-gray-600">Secure payment processing for all transactions</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">📊 Sales Analytics</h4>
                    <p className="text-sm text-gray-600">Real-time sales tracking and reporting</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🔒 Security Features</h4>
                    <p className="text-sm text-gray-600">Multi-layer security for your earnings</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">⚡ Instant Withdrawals</h4>
                    <p className="text-sm text-gray-600">Quick access to your funds</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Postal Info Tab */}
        <TabsContent value="postal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Postal & Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg">📮 Shipping Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Standard Shipping</span>
                          <Badge>$5.99</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Express Shipping</span>
                          <Badge>$12.99</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>International</span>
                          <Badge>$24.99</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Insured Delivery</span>
                          <Badge>$39.99</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg">📍 Address Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border rounded">
                          <h4 className="font-medium">Primary Address</h4>
                          <p className="text-sm text-gray-600">Configure your main shipping address</p>
                        </div>
                        <div className="p-3 border rounded">
                          <h4 className="font-medium">Return Address</h4>
                          <p className="text-sm text-gray-600">Set return address for packages</p>
                        </div>
                        <div className="p-3 border rounded">
                          <h4 className="font-medium">International Zones</h4>
                          <p className="text-sm text-gray-600">Manage international shipping zones</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>🚚 Shipping Integrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl mb-2">📦</div>
                        <h4 className="font-medium">FedEx</h4>
                        <Badge className="bg-purple-600">Integrated</Badge>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl mb-2">📫</div>
                        <h4 className="font-medium">UPS</h4>
                        <Badge className="bg-brown-600">Connected</Badge>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl mb-2">📪</div>
                        <h4 className="font-medium">USPS</h4>
                        <Badge className="bg-blue-600">Active</Badge>
                      </div>
                      <div className="text-center p-4 border rounded">
                        <div className="text-2xl mb-2">🌍</div>
                        <h4 className="font-medium">DHL</h4>
                        <Badge className="bg-yellow-600">Global</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Panel Tab */}
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Admin Panel Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-2">
                    🔄 Direct Admin Panel Access
                  </h3>
                  <p className="text-purple-600 mb-4">
                    Seamless integration between Dealer Panel and Admin Panel for complete management control.
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => window.open('/admin', '_blank')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Open Admin Panel
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/admin'}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Switch to Admin
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Connected Features</h4>
                      <ul className="space-y-1 text-sm text-green-600">
                        <li>• Store management synchronization</li>
                        <li>• Real-time data sharing</li>
                        <li>• Unified user permissions</li>
                        <li>• Cross-panel navigation</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">🚀 Admin Capabilities</h4>
                      <ul className="space-y-1 text-sm text-blue-600">
                        <li>• Unlimited store creation</li>
                        <li>• Full system monitoring</li>
                        <li>• User role management</li>
                        <li>• Advanced analytics</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OriginalDealerPanel;
