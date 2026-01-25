const CACHE_NAME = 'babe-music-v2-5'; // ⚠️ Tăng version mỗi khi thêm bài mới!
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
    // 1. Cho phép browser tự xử lý các file Audio/Video (Range requests)
    if (e.request.destination === 'audio' || e.request.destination === 'video') {
        return;
    }

    // 2. Network First strategy cho HTML / CSS / JS chính để đảm bảo update nhanh nhất
    // (Bỏ qua nếu muốn Offline-First triệt để, nhưng user đang muốn update nhanh)
    if (e.request.mode === 'navigate' ||
        e.request.destination === 'style' ||
        e.request.destination === 'script' ||
        e.request.url.includes('index.html')) {

        e.respondWith(
            fetch(e.request, { cache: 'reload' }) // ⚠️ QUAN TRỌNG: Ép buộc tải từ server, bỏ qua cache trình duyệt
                .then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    return caches.match(e.request);
                })
        );
        return;
    }

    // 3. Cache First (fallback to network) cho ảnh và các assets khác
    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response) return response;
            return fetch(e.request).catch((error) => {
                console.error('Fetch failed:', e.request.url, error);
                throw error;
            });
        })
    );
});
