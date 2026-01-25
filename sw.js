const CACHE_NAME = 'babe-music-v2'; // ⚠️ Tăng version mỗi khi thêm bài mới!
const ASSETS = [
    './',
    './index.html',
    './assets/css/style.css',
    './assets/js/main.js',
    './assets/js/songs.js',
    './assets/js/diary.js',
    './assets/images/avatar.jpg'
];

// Cài đặt SW và cache assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting(); // Bỏ qua waiting, kích hoạt SW mới ngay lập tức
});

// Xóa cache cũ khi có version mới
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Xóa cache cũ:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Chiếm quyền kiểm soát tất cả clients
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
