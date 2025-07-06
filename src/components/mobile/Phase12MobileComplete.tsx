import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, Camera, CreditCard, Zap, 
  CheckCircle, Star, TrendingUp, Settings 
} from 'lucide-react';
import EnhancedMobileCamera from './EnhancedMobileCamera';
import AdvancedMobilePayment from './AdvancedMobilePayment';
import MobilePWAInterface from './MobilePWAInterface';
import { useAdvancedMobilePWA } from '@/hooks/useAdvancedMobilePWA';

interface Phase12MobileCompleteProps {
  coinId?: string;
  coinName?: string;
  coinPrice?: number;
}

const Phase12MobileComplete: React.FC<Phase12MobileCompleteProps> = ({
  coinId = 'demo-coin',
  coinName = 'Demo Coin',
  coinPrice = 99.99
}) => {
  const { isOnline, isInstalled, syncPending } = useAdvancedMobilePWA();
  const [activeTab, setActiveTab] = useState('camera');
  const [recognizedCoin, setRecognizedCoin] = useState<any>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const handleCoinRecognized = (result: any) => {
    setRecognizedCoin(result);
    // Auto-switch to payment tab after successful recognition
    setTimeout(() => setActiveTab('payment'), 1000);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Payment successful:', transactionId);
    // Could navigate to success page or show confirmation
  };

  const features = [
    {
      icon: <Camera className="h-5 w-5" />,
      title: 'Enhanced Camera',
      description: 'Real-time AI recognition with offline capabilities'
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: 'Advanced Payments',
      description: 'Multi-currency support with mobile wallet integration'
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: 'PWA Features',
      description: 'Offline mode, push notifications, and app installation'
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Performance',
      description: 'Optimized for mobile with instant loading'
    }
  ];

  return (
    <div className="max-w-md mx-auto space-y-6 p-4">
      {/* Phase 12 Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            Phase 12: Advanced Mobile & Payment Integration
            <Badge className="bg-green-100 text-green-800">Complete</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Mobile Optimized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {isInstalled ? '✓' : '○'}
              </div>
              <div className="text-sm text-muted-foreground">PWA Ready</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {feature.icon}
                  <span className="font-medium text-sm">{feature.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <div className="flex gap-2">
        <Badge variant={isOnline ? "default" : "outline"} className="text-xs">
          <div className={`w-2 h-2 rounded-full mr-1 ${isOnline ? 'bg-green-500' : 'bg-orange-500'}`} />
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
        <Badge variant={isInstalled ? "default" : "outline"} className="text-xs">
          <Smartphone className="w-3 h-3 mr-1" />
          {isInstalled ? 'Installed' : 'Web App'}
        </Badge>
        {syncPending > 0 && (
          <Badge variant="destructive" className="text-xs">
            {syncPending} Syncing
          </Badge>
        )}
      </div>

      {/* Main Interface Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="camera" className="text-xs">
            <Camera className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="payment" className="text-xs">
            <CreditCard className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="pwa" className="text-xs">
            <Smartphone className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs">
            <TrendingUp className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Enhanced Mobile Camera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedMobileCamera
                onCoinRecognized={handleCoinRecognized}
                onImagesCapture={setCapturedImages}
              />
              
              {recognizedCoin && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Coin Recognized!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    {recognizedCoin.analysis?.name} - {Math.round((recognizedCoin.analysis?.confidence || 0) * 100)}% confidence
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <AdvancedMobilePayment
            coinId={coinId}
            coinName={recognizedCoin?.analysis?.name || coinName}
            coinPrice={recognizedCoin?.analysis?.estimated_value || coinPrice}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </TabsContent>

        <TabsContent value="pwa" className="space-y-4">
          <MobilePWAInterface />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Mobile Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{capturedImages.length}</div>
                    <div className="text-sm text-muted-foreground">Photos Captured</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {recognizedCoin ? '1' : '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">Coins Recognized</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Camera Quality:</span>
                    <Badge variant="default">High</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">AI Processing:</span>
                    <Badge variant={isOnline ? "default" : "outline"}>
                      {isOnline ? 'Real-time' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Payment Methods:</span>
                    <Badge variant="default">4 Available</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">PWA Features:</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Phase12MobileComplete;