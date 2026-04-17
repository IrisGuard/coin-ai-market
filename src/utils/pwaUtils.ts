// PWA / Service Worker disabled.
// Actively unregisters previously-installed service workers and clears caches
// so a stale homepage cannot be served. Kept as a no-op shim for legacy callers.

class PWAManagerShim {
  constructor() {
    if (typeof window === 'undefined') return;
    this.cleanup();
  }

  private async cleanup() {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {
      /* noop */
    }
  }

  // Backwards-compatible no-op API
  canInstall() { return false; }
  isAppInstalled() { return false; }
  isStandalone() { return false; }
  async addToHomeScreen() { return false; }
  async showInstallPrompt() { return false; }
  async updateApp() { return false; }
  async enableNotifications(): Promise<NotificationPermission> { return 'denied'; }
  async sendNotification(_title: string, _options?: NotificationOptions) { return false; }
  async requestNotificationPermission(): Promise<NotificationPermission> { return 'denied'; }
  async subscribeToPush() { return null; }
  async unsubscribeFromPush() { return false; }
}

export const pwaManager = new PWAManagerShim();
export default pwaManager;
