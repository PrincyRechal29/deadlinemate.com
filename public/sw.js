/* DeadlineMate service worker — receives Web Push messages and shows them. */
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (_e) {
    data = { title: 'DeadlineMate', body: event.data ? event.data.text() : '' };
  }
  const title = data.title || 'DeadlineMate';
  const options = {
    body: data.body || 'You have a deadline coming up.',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    data: { url: data.url || '/app' },
    tag: data.url || 'deadlinemate',
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/app';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});
