import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download, Share, Plus } from 'lucide-react';
import { pwaManager } from '@/utils/pwaUtils';
import { isTouchDevice } from '@/utils/responsiveUtils';

interface PWAInstallPromptProps {
  onDismiss?: () => void;
  compact?: boolean;
}

const PWAInstallPrompt = ({ onDismiss, compact = false }: PWAInstallPromptProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstallStatus = () => {
      const installed = pwaManager.isAppInstalled();
      const canInstall = pwaManager.canInstall();
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      setIsInstalled(installed);
      setIsIOS(isIOSDevice);
      setShowPrompt(!installed && (canInstall || isIOSDevice) && isTouchDevice());
    };

    checkInstallStatus();

    // Listen for PWA install events
    const handlePWAEvent = (event: CustomEvent) => {
      const { type } = event.detail;
      
      if (type === 'available') {
        setShowPrompt(true);
      } else if (type === 'installed') {
        setIsInstalled(true);
        setShowPrompt(false);
      }
    };

    window.addEventListener('pwa-install', handlePWAEvent as EventListener);
    
    return () => {
      window.removeEventListener('pwa-install', handlePWAEvent as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // Show iOS install instructions
      pwaManager.addToHomeScreen();
    } else {
      const success = await pwaManager.showInstallPrompt();
      if (success) {
        setShowPrompt(false);
        setIsInstalled(true);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismiss?.();
    
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if dismissed recently
  const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
  if (dismissedTime) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) {
      return null;
    }
  }

  if (!showPrompt || isInstalled) return null;

  if (compact) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Download className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Install CoinAI App</p>
                <p className="text-xs opacity-90">Get the full experience</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleInstall}
                  className="text-xs px-3 py-1"
                >
                  Install
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="p-1 h-auto text-primary-foreground/80 hover:text-primary-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent">
      <Card className="max-w-md mx-auto bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Install CoinAI</h3>
                <p className="text-primary-foreground/80 text-sm">Add to home screen</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="text-primary-foreground/80 hover:text-primary-foreground p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
              <span>Instant access from home screen</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
              <span>Works offline with cached data</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
              <span>Push notifications for auctions</span>
            </div>
          </div>

          {isIOS ? (
            <div className="space-y-4">
              <Button
                onClick={handleInstall}
                className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Share className="h-4 w-4 mr-2" />
                Show Instructions
              </Button>
              <div className="text-xs text-primary-foreground/70 space-y-1">
                <p>To install: Tap Share button in Safari</p>
                <p>Then select "Add to Home Screen"</p>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleInstall}
              className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Home Screen
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;