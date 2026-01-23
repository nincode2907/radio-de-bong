const CACHE_NAME = 'babe-music-v1';
const ASSETS = [
    './',
    './index.html',
    './assets/css/style.css',
    './assets/js/main.js',
    './assets/js/songs.js',
    './assets/js/diary.js',
    './assets/images/avatar.jpg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
