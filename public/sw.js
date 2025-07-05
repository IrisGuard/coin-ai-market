// CoinAI Market Service Worker - Phase 9 PWA Implementation
const CACHE_NAME = 'coinai-v1';
const OFFLINE_PAGE = '/offline.html';

// Core files to cache immediately
const CORE_CACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API routes that can be cached
const API_CACHE_PATTERNS = [
  /^\/api\/coins/,
  /^\/api\/categories/,
  /^\/api\/marketplace/
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching core files');
        return cache.addAll(CORE_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first for API calls and fresh content
    if (shouldGoNetworkFirst(url)) {
      return await networkFirst(request);
    }
    
    // Cache first for static assets
    return await cacheFirst(request);
  } catch (error) {
    console.error('[SW] Request failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_PAGE);
    }
    
    // Return a basic offline response for other requests
    return new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

function shouldGoNetworkFirst(url) {
  // API calls should go network first
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return true;
  }
  
  // HTML pages should go network first
  if (url.pathname.endsWith('.html') || url.pathname === '/' || !url.pathname.includes('.')) {
    return true;
  }
  
  return false;
}

async function networkFirst(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function cacheFirst(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch from network
  const networkResponse = await fetch(request);
  
  // Cache successful responses
  if (networkResponse.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'coin-upload') {
    event.waitUntil(handleOfflineCoinUpload());
  }
  
  if (event.tag === 'favorite-sync') {
    event.waitUntil(handleOfflineFavorites());
  }
});

async function handleOfflineCoinUpload() {
  // Handle offline coin uploads when back online
  const offlineUploads = await getOfflineData('coin-uploads');
  
  for (const upload of offlineUploads) {
    try {
      await fetch('/api/coins', {
        method: 'POST',
        body: JSON.stringify(upload),
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Remove from offline storage after successful upload
      await removeOfflineData('coin-uploads', upload.id);
    } catch (error) {
      console.error('[SW] Failed to sync coin upload:', error);
    }
  }
}

async function handleOfflineFavorites() {
  // Handle offline favorite actions when back online
  const offlineFavorites = await getOfflineData('favorites');
  
  for (const favorite of offlineFavorites) {
    try {
      await fetch(`/api/favorites/${favorite.coinId}`, {
        method: favorite.action === 'add' ? 'POST' : 'DELETE'
      });
      
      await removeOfflineData('favorites', favorite.id);
    } catch (error) {
      console.error('[SW] Failed to sync favorite:', error);
    }
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'general',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {}
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  const { action, data } = event;
  let url = '/';
  
  // Handle different notification actions
  switch (action) {
    case 'view-coin':
      url = `/coin-details/${data.coinId}`;
      break;
    case 'view-auction':
      url = `/auctions/${data.auctionId}`;
      break;
    case 'open-marketplace':
      url = '/marketplace';
      break;
    default:
      url = data.url || '/';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url.includes(url.split('/')[1]) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if none found
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'STORE_OFFLINE_DATA':
      storeOfflineData(data.key, data.value);
      break;
      
    case 'GET_OFFLINE_DATA':
      getOfflineData(data.key).then(result => {
        event.ports[0].postMessage({ success: true, data: result });
      });
      break;
      
    case 'CLEAR_CACHE':
      caches.delete(CACHE_NAME).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

// Utility functions for offline data storage
async function storeOfflineData(key, data) {
  const cache = await caches.open('offline-data');
  const response = new Response(JSON.stringify(data));
  await cache.put(`/offline/${key}`, response);
}

async function getOfflineData(key) {
  const cache = await caches.open('offline-data');
  const response = await cache.match(`/offline/${key}`);
  
  if (response) {
    return await response.json();
  }
  
  return [];
}

async function removeOfflineData(key, id) {
  const data = await getOfflineData(key);
  const filtered = data.filter(item => item.id !== id);
  await storeOfflineData(key, filtered);
}