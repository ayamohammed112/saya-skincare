self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(clients.claim()))

self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  event.waitUntil(
    self.registration.showNotification(data.title || '🛍️ طلب جديد | New Order', {
      body: data.body || 'تم استلام طلب جديد!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'new-order',
      renotify: true,
      data: { url: '/admin' },
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const c of list) {
        if (c.url.includes('/admin') && 'focus' in c) return c.focus()
      }
      if (clients.openWindow) return clients.openWindow('/admin')
    })
  )
})
