self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('push', (e) => {
  if (!e.data) return;
  
  let title = 'Mon Expert Jardin';
  let body = '';
  
  try {
    const data = e.data.json();
    title = data.title || title;
    body = data.body || '';
  } catch {
    body = e.data.text();
  }

  e.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
