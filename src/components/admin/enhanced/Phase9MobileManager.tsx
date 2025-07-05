import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Download, 
  TouchpadIcon as Touch,
  Zap,
  Gauge,
  CheckCircle,
  RefreshCw,
  Wifi,
  Bell
} from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useIsMobile } from '@/hooks/use-mobile';
import { isTouchDevice, useScreenSize } from '@/utils/responsiveUtils';

const Phase9MobileManager = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const pwa = usePWA();
  const isMobile = useIsMobile();
  const isTouch = isTouchDevice();
  const screenInfo = useScreenSize();

  const handleInstallPWA = async () => {
    const success = await pwa.installApp();
    if (success) {
      console.log('PWA installed successfully');
    }
  };

  const handleEnableNotifications = async () => {
    const permission = await pwa.enableNotifications();
    console.log('Notification permission:', permission);
  };

  const handleSendTestNotification = async () => {
    await pwa.sendNotification('CoinAI Test', {
      body: 'PWA notifications are working!',
      icon: '/icons/icon-192x192.png'
    });
  };

  const getMobileStats = () => ({
    deviceType: isMobile ? 'Mobile' : 'Desktop',
    touchSupport: isTouch ? 'Yes' : 'No',
    screenSize: screenInfo.screenSize,
    orientation: screenInfo.width > screenInfo.height ? 'Landscape' : 'Portrait',
    pwaSupport: pwa.isPWASupported ? 'Yes' : 'No',
    installStatus: pwa.isInstalled ? 'Installed' : pwa.canInstall ? 'Can Install' : 'Not Available',
    offlineStatus: pwa.isOffline ? 'Offline' : 'Online'
  });

  const stats = getMobileStats();

  return (
    <div className="space-y-6">
      {/* Phase 9 Header */}
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-purple-700">Phase 9: Mobile Optimization & PWA</h1>
              <p className="text-muted-foreground mt-1">
                Mobile-first responsive design, Progressive Web App features, and enhanced mobile user experience
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Active
              </Badge>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Device Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Device Type</span>
            </div>
            <div className="text-2xl font-bold">{stats.deviceType}</div>
            <div className="text-xs text-muted-foreground">
              {stats.screenSize} • {stats.orientation}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Touch className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Touch Support</span>
            </div>
            <div className="text-2xl font-bold">{stats.touchSupport}</div>
            <div className="text-xs text-muted-foreground">
              {isTouch ? 'Optimized gestures enabled' : 'Mouse/keyboard input'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">PWA Status</span>
            </div>
            <div className="text-2xl font-bold">{stats.installStatus}</div>
            <div className="text-xs text-muted-foreground">
              {pwa.isPWASupported ? 'PWA features available' : 'Limited PWA support'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium">Connection</span>
            </div>
            <div className="text-2xl font-bold">{stats.offlineStatus}</div>
            <div className="text-xs text-muted-foreground">
              {pwa.isOffline ? 'Offline mode active' : 'Connected to internet'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Mobile Optimization Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pwa" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            PWA Features
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Optimization Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Responsive Design</h4>
                    <p className="text-sm text-purple-700">
                      Mobile-first responsive layout with touch-optimized components and gesture support
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">PWA Integration</h4>
                    <p className="text-sm text-blue-700">
                      Installable app experience with offline functionality and push notifications
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Performance</h4>
                    <p className="text-sm text-green-700">
                      Optimized loading, image compression, and reduced bundle size for mobile
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Mobile Features</h4>
                    <p className="text-sm text-orange-700">
                      Enhanced camera integration, mobile navigation, and touch gestures
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pwa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progressive Web App Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">App Installation</h4>
                      <p className="text-sm text-muted-foreground">
                        {pwa.isInstalled ? 'App is installed' : pwa.canInstall ? 'Ready to install' : 'Not available'}
                      </p>
                    </div>
                    {!pwa.isInstalled && pwa.canInstall && (
                      <Button onClick={handleInstallPWA} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Install
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        {Notification.permission === 'granted' ? 'Enabled' : 'Not enabled'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {Notification.permission !== 'granted' && (
                        <Button onClick={handleEnableNotifications} size="sm" variant="outline">
                          <Bell className="h-4 w-4 mr-2" />
                          Enable
                        </Button>
                      )}
                      {Notification.permission === 'granted' && (
                        <Button onClick={handleSendTestNotification} size="sm">
                          <Bell className="h-4 w-4 mr-2" />
                          Test
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Offline Support</h4>
                      <p className="text-sm text-muted-foreground">
                        {pwa.isOffline ? 'Currently offline' : 'Online with caching'}
                      </p>
                    </div>
                    <Badge variant={pwa.isOffline ? "destructive" : "default"}>
                      {pwa.isOffline ? 'Offline' : 'Online'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">PWA Capabilities</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Add to Home Screen</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Offline Functionality</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Background Sync</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Push Notifications</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Share Target API</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Performance Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Loading Optimizations</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Lazy loading for images and components</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>WebP image format with fallbacks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Code splitting and route-based chunks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Service worker caching strategy</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Mobile UX Enhancements</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Touch-friendly tap targets (44px min)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Swipe gestures for navigation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Safe area insets for notched devices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Reduced motion for accessibility</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Testing & Debugging</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Device Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Screen Size:</span> {screenInfo.width}x{screenInfo.height}
                    </div>
                    <div>
                      <span className="font-medium">Device Pixel Ratio:</span> {window.devicePixelRatio}
                    </div>
                    <div>
                      <span className="font-medium">Touch Points:</span> {navigator.maxTouchPoints}
                    </div>
                    <div>
                      <span className="font-medium">User Agent:</span> {isMobile ? 'Mobile' : 'Desktop'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => console.log('Mobile debug info:', { stats, screenInfo, pwa })}
                    variant="outline"
                    className="w-full"
                  >
                    Log Debug Info
                  </Button>
                  <Button 
                    onClick={handleSendTestNotification}
                    variant="outline"
                    className="w-full"
                    disabled={Notification.permission !== 'granted'}
                  >
                    Test Notification
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Phase 9 Implementation Status */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Phase 9 Implementation Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Progressive Web App (PWA) Implementation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Mobile-First Responsive Design</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Touch-Optimized User Interface</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Offline Functionality & Caching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Push Notifications Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Performance Optimization</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-100 rounded-lg">
            <p className="text-sm text-purple-700">
              <strong>Phase 9 Complete:</strong> Mobile optimization and PWA features fully implemented with 
              responsive design, offline support, push notifications, and enhanced mobile user experience. 
              The platform is now optimized for all device types and screen sizes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase9MobileManager;