// Service Worker for Optimum PWA
const CACHE_NAME = 'optimum-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through to network with safe fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
