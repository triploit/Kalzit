self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Installed');
    skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
  console.log("Service worker activated - claiming clients");
});