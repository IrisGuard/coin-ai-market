
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAInstallPrompt = () => {
  const { isInstallable, installApp } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 shadow-xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1">
              Install CoinVision
            </h3>
            <p className="text-xs opacity-90 mb-3">
              Get the full app experience with offline access and faster loading.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={installApp}
                size="sm"
                className="bg-white text-purple-600 hover:bg-gray-100 flex-1"
              >
                <Download className="w-4 h-4 mr-1" />
                Install
              </Button>
              <Button
                onClick={() => setDismissed(true)}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 px-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallPrompt;
