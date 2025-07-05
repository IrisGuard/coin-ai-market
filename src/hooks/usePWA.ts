import { useState, useEffect } from 'react';
import { pwaManager } from '@/utils/pwaUtils';
import { isTouchDevice } from '@/utils/responsiveUtils';

interface PWAStatus {
  isInstalled: boolean;
  canInstall: boolean;
  isOffline: boolean;
  isUpdateAvailable: boolean;
  installPromptEvent: any;
}

export const usePWA = () => {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    canInstall: false,
    isOffline: !navigator.onLine,
    isUpdateAvailable: false,
    installPromptEvent: null
  });

  useEffect(() => {
    // Initial status check
    updateStatus();

    // Listen for PWA events
    const handlePWAEvent = (event: CustomEvent) => {
      const { type } = event.detail;
      
      switch (type) {
        case 'available':
          setStatus(prev => ({ ...prev, canInstall: true }));
          break;
        case 'installed':
          setStatus(prev => ({ ...prev, isInstalled: true, canInstall: false }));
          break;
        case 'update-available':
          setStatus(prev => ({ ...prev, isUpdateAvailable: true }));
          break;
      }
    };

    // Listen for online/offline events
    const handleOnline = () => setStatus(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOffline: true }));

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setStatus(prev => ({ 
        ...prev, 
        canInstall: true, 
        installPromptEvent: e 
      }));
    };

    window.addEventListener('pwa-install', handlePWAEvent as EventListener);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('pwa-install', handlePWAEvent as EventListener);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const updateStatus = () => {
    setStatus(prev => ({
      ...prev,
      isInstalled: pwaManager.isAppInstalled(),
      canInstall: pwaManager.canInstall(),
      isOffline: !navigator.onLine
    }));
  };

  const installApp = async (): Promise<boolean> => {
    try {
      const success = await pwaManager.showInstallPrompt();
      if (success) {
        setStatus(prev => ({ ...prev, isInstalled: true, canInstall: false }));
      }
      return success;
    } catch (error) {
      console.error('Failed to install app:', error);
      return false;
    }
  };

  const updateApp = async (): Promise<void> => {
    try {
      await pwaManager.updateApp();
      setStatus(prev => ({ ...prev, isUpdateAvailable: false }));
    } catch (error) {
      console.error('Failed to update app:', error);
    }
  };

  const enableNotifications = async (): Promise<NotificationPermission> => {
    try {
      const permission = await pwaManager.enableNotifications();
      return permission;
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      return 'denied';
    }
  };

  const sendNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
    try {
      await pwaManager.sendNotification(title, options);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const addToHomeScreen = (): void => {
    pwaManager.addToHomeScreen();
  };

  // Check if device supports PWA features
  const isPWASupported = (): boolean => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  };

  // Check if we should show install prompt
  const shouldShowInstallPrompt = (): boolean => {
    if (!isTouchDevice()) return false;
    if (status.isInstalled) return false;
    if (!status.canInstall && !isIOS()) return false;
    
    // Check if user has dismissed recently
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return false;
    }
    
    return true;
  };

  const isIOS = (): boolean => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  // Store data for offline use
  const cacheOfflineData = async (key: string, data: any): Promise<void> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.active) {
        registration.active.postMessage({
          type: 'STORE_OFFLINE_DATA',
          data: { key, value: data }
        });
      }
    }
  };

  // Get offline stored data
  const getOfflineData = async (key: string): Promise<any> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.active) {
        return new Promise((resolve) => {
          const messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = (event) => {
            resolve(event.data.success ? event.data.data : null);
          };
          
          registration.active.postMessage({
            type: 'GET_OFFLINE_DATA',
            data: { key }
          }, [messageChannel.port2]);
        });
      }
    }
    return null;
  };

  return {
    ...status,
    isPWASupported: isPWASupported(),
    shouldShowInstallPrompt: shouldShowInstallPrompt(),
    isIOS: isIOS(),
    installApp,
    updateApp,
    enableNotifications,
    sendNotification,
    addToHomeScreen,
    cacheOfflineData,
    getOfflineData,
    updateStatus
  };
};