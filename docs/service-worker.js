self.addEventListener('install', () => { });
self.addEventListener('activate', () => { });
self.addEventListener('fetch', (event) => { return fetch(event.request) });