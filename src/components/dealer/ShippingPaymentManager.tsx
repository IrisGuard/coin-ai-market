import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  CreditCard, 
  Globe, 
  Package, 
  Mail, 
  Shield,
  Coins as SolanaIcon,
  DollarSign,
  Euro,
  PoundSterling
} from 'lucide-react';

const ShippingPaymentManager: React.FC = () => {
  const [shippingSettings, setShippingSettings] = useState({
    domestic: { enabled: true, cost: 5.99, freeThreshold: 50 },
    international: { enabled: true, cost: 15.99, freeThreshold: 100 },
    express: { enabled: true, cost: 12.99, days: '1-2' },
    registered: { enabled: true, cost: 8.99, tracking: true }
  });

  const [paymentSettings, setPaymentSettings] = useState({
    traditional: { cards: true, paypal: true, bankTransfer: true },
    crypto: { solana: true, walletAddress: '' },
    currencies: { usd: true, eur: true, gbp: true }
  });

  const shippingProviders = [
    { id: 'dhl', name: 'DHL Express', logo: '🚚', zones: 'Worldwide' },
    { id: 'fedex', name: 'FedEx International', logo: '📦', zones: 'Worldwide' },
    { id: 'ups', name: 'UPS Worldwide', logo: '🚛', zones: 'Worldwide' },
    { id: 'usps', name: 'USPS Priority', logo: '📮', zones: 'USA/International' },
    { id: 'royal', name: 'Royal Mail', logo: '👑', zones: 'UK/Europe' },
    { id: 'deutsche', name: 'Deutsche Post', logo: '🇩🇪', zones: 'Germany/EU' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Shipping & Payment Management</h2>
          <p className="text-gray-600">Configure international shipping and payment options</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Global Ready
        </Badge>
      </div>

      <Tabs defaultValue="shipping" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping Options
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Methods
          </TabsTrigger>
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Courier Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shipping" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domestic Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Domestic Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Domestic Shipping</Label>
                  <Switch 
                    checked={shippingSettings.domestic.enabled}
                    onCheckedChange={(checked) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        domestic: { ...prev.domestic, enabled: checked }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Standard Cost ($)</Label>
                  <Input 
                    type="number" 
                    value={shippingSettings.domestic.cost}
                    onChange={(e) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        domestic: { ...prev.domestic, cost: parseFloat(e.target.value) }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Free Shipping Threshold ($)</Label>
                  <Input 
                    type="number" 
                    value={shippingSettings.domestic.freeThreshold}
                    onChange={(e) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        domestic: { ...prev.domestic, freeThreshold: parseFloat(e.target.value) }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* International Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  International Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable International</Label>
                  <Switch 
                    checked={shippingSettings.international.enabled}
                    onCheckedChange={(checked) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        international: { ...prev.international, enabled: checked }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Standard Cost ($)</Label>
                  <Input 
                    type="number" 
                    value={shippingSettings.international.cost}
                    onChange={(e) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        international: { ...prev.international, cost: parseFloat(e.target.value) }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Free Shipping Threshold ($)</Label>
                  <Input 
                    type="number" 
                    value={shippingSettings.international.freeThreshold}
                    onChange={(e) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        international: { ...prev.international, freeThreshold: parseFloat(e.target.value) }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Express Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  Express Shipping
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Express</Label>
                  <Switch 
                    checked={shippingSettings.express.enabled}
                    onCheckedChange={(checked) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        express: { ...prev.express, enabled: checked }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Express Cost ($)</Label>
                  <Input 
                    type="number" 
                    value={shippingSettings.express.cost}
                    onChange={(e) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        express: { ...prev.express, cost: parseFloat(e.target.value) }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Time</Label>
                  <Select 
                    value={shippingSettings.express.days}
                    onValueChange={(value) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        express: { ...prev.express, days: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 Business Days</SelectItem>
                      <SelectItem value="2-3">2-3 Business Days</SelectItem>
                      <SelectItem value="3-5">3-5 Business Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Registered Mail */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-600" />
                  Registered Mail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable Registered Mail</Label>
                  <Switch 
                    checked={shippingSettings.registered.enabled}
                    onCheckedChange={(checked) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        registered: { ...prev.registered, enabled: checked }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registered Cost ($)</Label>
                  <Input 
                    type="number" 
                    value={shippingSettings.registered.cost}
                    onChange={(e) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        registered: { ...prev.registered, cost: parseFloat(e.target.value) }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Include Tracking</Label>
                  <Switch 
                    checked={shippingSettings.registered.tracking}
                    onCheckedChange={(checked) => 
                      setShippingSettings(prev => ({
                        ...prev,
                        registered: { ...prev.registered, tracking: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Traditional Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Credit/Debit Cards</Label>
                  <Switch 
                    checked={paymentSettings.traditional.cards}
                    onCheckedChange={(checked) => 
                      setPaymentSettings(prev => ({
                        ...prev,
                        traditional: { ...prev.traditional, cards: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>PayPal</Label>
                  <Switch 
                    checked={paymentSettings.traditional.paypal}
                    onCheckedChange={(checked) => 
                      setPaymentSettings(prev => ({
                        ...prev,
                        traditional: { ...prev.traditional, paypal: checked }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Bank Transfer</Label>
                  <Switch 
                    checked={paymentSettings.traditional.bankTransfer}
                    onCheckedChange={(checked) => 
                      setPaymentSettings(prev => ({
                        ...prev,
                        traditional: { ...prev.traditional, bankTransfer: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Crypto Payments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SolanaIcon className="w-5 h-5 text-purple-600" />
                  Solana Crypto Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Accept Solana (SOL)</Label>
                  <Switch 
                    checked={paymentSettings.crypto.solana}
                    onCheckedChange={(checked) => 
                      setPaymentSettings(prev => ({
                        ...prev,
                        crypto: { ...prev.crypto, solana: checked }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Solana Wallet Address</Label>
                  <Input 
                    placeholder="Enter your Solana wallet address"
                    value={paymentSettings.crypto.walletAddress}
                    onChange={(e) => 
                      setPaymentSettings(prev => ({
                        ...prev,
                        crypto: { ...prev.crypto, walletAddress: e.target.value }
                      }))
                    }
                  />
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Solana payments are processed instantly with minimal fees
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Currency Support */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Supported Currencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <Label>USD</Label>
                    </div>
                    <Switch 
                      checked={paymentSettings.currencies.usd}
                      onCheckedChange={(checked) => 
                        setPaymentSettings(prev => ({
                          ...prev,
                          currencies: { ...prev.currencies, usd: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      <Label>EUR</Label>
                    </div>
                    <Switch 
                      checked={paymentSettings.currencies.eur}
                      onCheckedChange={(checked) => 
                        setPaymentSettings(prev => ({
                          ...prev,
                          currencies: { ...prev.currencies, eur: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PoundSterling className="w-4 h-4" />
                      <Label>GBP</Label>
                    </div>
                    <Switch 
                      checked={paymentSettings.currencies.gbp}
                      onCheckedChange={(checked) => 
                        setPaymentSettings(prev => ({
                          ...prev,
                          currencies: { ...prev.currencies, gbp: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Courier Service Integration</CardTitle>
              <p className="text-gray-600">Connect with international shipping providers</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shippingProviders.map((provider) => (
                  <Card key={provider.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{provider.logo}</span>
                        <div>
                          <h4 className="font-semibold">{provider.name}</h4>
                          <p className="text-sm text-gray-500">{provider.zones}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <Badge variant="secondary" className="w-full justify-center">
                      API Integration Available
                    </Badge>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save All Settings</Button>
      </div>
    </div>
  );
};

export default ShippingPaymentManager;
