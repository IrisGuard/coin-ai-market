// PWA / Service Worker disabled.
// This shim actively unregisters any previously-installed service workers
// and clears caches so a stale homepage cannot be served from cache.
// Kept exporting `pwaManager` so legacy imports keep compiling.

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

  // No-op API surface for backwards compatibility
  async showInstallPrompt() { return false; }
  async requestNotificationPermission(): Promise<NotificationPermission> { return 'denied'; }
  async subscribeToPush() { return null; }
  async unsubscribeFromPush() { return false; }
  isAppInstalled() { return false; }
  isStandalone() { return false; }
}

export const pwaManager = new PWAManagerShim();
export default pwaManager;
