/* =============================================
   ALBUMS TAB — Heart Engine + Gallery + Lightbox
   ============================================= */

// --- Configuration ---
const ALBUM_CONFIG = {
    totalImages: 86,
    path: 'https://res.cloudinary.com/dwn9n8bk1/image/upload/v1773891458/babe/',
    ext: '.jpg',
    slideshowInterval: 1500 // 1.5s
};

// --- Mobile detection (top-level) ---
const IS_MOBILE = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase()
);

// =============================================
// HEART ENGINE — Canvas particle heart animation
// =============================================
const HeartEngine = (() => {
    let canvas, ctx;
    let width, height;
    let animationId = null;
    let running = false;
    let time = 0;

    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase()
    );
    const koef = isMobile ? 0.5 : 1;

    // Heart shape math
    function heartPosition(rad) {
        return [
            Math.pow(Math.sin(rad), 3),
            -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
        ];
    }

    function scaleAndTranslate(pos, sx, sy, dx, dy) {
        return [dx + pos[0] * sx, dy + pos[1] * sy];
    }

    let pointsOrigin = [];
    let targetPoints = [];
    let particles = [];
    let heartPointsCount = 0;
    const traceCount = isMobile ? 20 : 50;
    const dr = isMobile ? 0.3 : 0.1;

    function buildPoints() {
        pointsOrigin = [];
        const scales = isMobile
            ? [[150, 9], [100, 6], [60, 3.5]]
            : [[210, 13], [150, 9], [90, 5]];

        for (const [sx, sy] of scales) {
            for (let i = 0; i < Math.PI * 2; i += dr) {
                pointsOrigin.push(scaleAndTranslate(heartPosition(i), sx, sy, 0, 0));
            }
        }
        heartPointsCount = pointsOrigin.length;
    }

    function buildParticles() {
        particles = [];
        const rand = Math.random;
        for (let i = 0; i < heartPointsCount; i++) {
            const x = rand() * width;
            const y = rand() * height;
            const p = {
                vx: 0, vy: 0, R: 2,
                speed: rand() + 5,
                q: ~~(rand() * heartPointsCount),
                D: 2 * (i % 2) - 1,
                force: 0.2 * rand() + 0.7,
                f: `hsla(0,${~~(40 * rand() + 60)}%,${~~(60 * rand() + 20)}%,.3)`,
                trace: []
            };
            for (let k = 0; k < traceCount; k++) {
                p.trace.push({ x, y });
            }
            particles.push(p);
        }
    }

    function pulse(kx, ky) {
        for (let i = 0; i < pointsOrigin.length; i++) {
            if (!targetPoints[i]) targetPoints[i] = [];
            targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
            targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
        }
    }

    const config = { traceK: 0.4, timeDelta: 0.02 };

    function loop() {
        if (!running) return;

        const n = -Math.cos(time);
        pulse((1 + n) * 0.5, (1 + n) * 0.5);
        time += (Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * config.timeDelta;

        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, width, height);

        for (let i = particles.length; i--;) {
            const u = particles[i];
            const q = targetPoints[u.q];
            if (!q) continue;

            const dx = u.trace[0].x - q[0];
            const dy = u.trace[0].y - q[1];
            const length = Math.sqrt(dx * dx + dy * dy);

            if (10 > length) {
                if (0.95 < Math.random()) {
                    u.q = ~~(Math.random() * heartPointsCount);
                } else {
                    if (0.99 < Math.random()) u.D *= -1;
                    u.q += u.D;
                    u.q %= heartPointsCount;
                    if (0 > u.q) u.q += heartPointsCount;
                }
            }

            u.vx += (-dx / length) * u.speed;
            u.vy += (-dy / length) * u.speed;
            u.trace[0].x += u.vx;
            u.trace[0].y += u.vy;
            u.vx *= u.force;
            u.vy *= u.force;

            for (let k = 0; k < u.trace.length - 1;) {
                const T = u.trace[k];
                const N = u.trace[++k];
                N.x -= config.traceK * (N.x - T.x);
                N.y -= config.traceK * (N.y - T.y);
            }

            ctx.fillStyle = u.f;
            for (let k = 0; k < u.trace.length; k++) {
                ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }

        animationId = requestAnimationFrame(loop);
    }

    function onResize() {
        if (!canvas) return;
        width = canvas.width = koef * canvas.parentElement.clientWidth;
        height = canvas.height = koef * canvas.parentElement.clientHeight;
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 0, width, height);
    }

    return {
        start() {
            if (running) return;

            canvas = document.getElementById('albums-heart-canvas');
            if (!canvas) return;
            ctx = canvas.getContext('2d');

            width = canvas.width = koef * canvas.parentElement.clientWidth;
            height = canvas.height = koef * canvas.parentElement.clientHeight;
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.fillRect(0, 0, width, height);

            buildPoints();
            buildParticles();
            targetPoints = [];
            time = 0;

            running = true;
            window.addEventListener('resize', onResize);
            loop();
        },

        stop() {
            running = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            window.removeEventListener('resize', onResize);
        }
    };
})();


// =============================================
// ALBUM MANAGER — Gallery + Lightbox + Preload
// =============================================
const AlbumManager = (() => {
    let initialized = false;
    let galleryRendered = false;
    let currentLightboxIndex = 0;
    let validImages = [];

    // DOM refs
    let heartView, galleryView, grid, lightbox, lightboxImg, lightboxCounter;

    // Slideshow state
    let slideshowTimer = null;
    let isSlideshowPlaying = false;

    function getImageSrc(index) {
        return `${ALBUM_CONFIG.path}${index}${ALBUM_CONFIG.ext}`;
    }

    function preloadImages() {
        for (let i = 1; i <= ALBUM_CONFIG.totalImages; i++) {
            const img = new Image();
            img.src = getImageSrc(i);
        }
    }

    function renderGallery() {
        if (galleryRendered) return;
        galleryRendered = true;

        grid = document.getElementById('albums-grid');
        if (!grid) return;
        grid.innerHTML = '';
        validImages = [];

        for (let i = 1; i <= ALBUM_CONFIG.totalImages; i++) {
            const item = document.createElement('div');
            item.className = 'albums-grid-item';

            const img = document.createElement('img');
            img.src = getImageSrc(i);
            img.alt = `Album ${i}`;
            img.loading = 'lazy';
            img.draggable = false;

            const imgIndex = i;

            img.addEventListener('load', () => {
                img.classList.add('loaded');
                item.classList.add('loaded');
                validImages.push({ index: imgIndex, src: img.src });
            });

            img.addEventListener('error', () => {
                item.style.display = 'none';
            });

            img.addEventListener('click', () => {
                const lightboxIdx = validImages.findIndex(v => v.index === imgIndex);
                if (lightboxIdx !== -1) {
                    stopSlideshow();
                    openLightbox(lightboxIdx);
                }
            });

            item.appendChild(img);
            grid.appendChild(item);
        }
    }

    // --- Transitions ---
    function showGallery() {
        renderGallery();

        heartView = document.getElementById('albums-heart-view');
        galleryView = document.getElementById('albums-gallery-view');

        // Heart slides OUT (Down)
        if (heartView) {
            heartView.classList.remove('slide-in-up');
            heartView.classList.add('slide-out-down');
        }

        // Gallery slides IN (Up)
        if (galleryView) {
            galleryView.style.display = 'flex';
            void galleryView.offsetWidth; // Force reflow
            galleryView.classList.remove('view-hidden-down');
            galleryView.classList.add('view-active');
        }

        HeartEngine.stop();
    }

    function showHeart(animate = true) {
        heartView = document.getElementById('albums-heart-view');
        galleryView = document.getElementById('albums-gallery-view');

        stopSlideshow();

        if (animate) {
            // Gallery slides OUT (Down)
            if (galleryView) {
                galleryView.classList.remove('view-active');
                galleryView.classList.add('view-hidden-down');
            }
            // Heart slides IN (Up)
            if (heartView) {
                heartView.classList.remove('slide-out-down');
                heartView.classList.add('slide-in-up');
            }
        } else {
            // Instant reset
            if (galleryView) {
                galleryView.className = 'albums-gallery-view view-hidden-down';
                galleryView.style.display = 'none';
            }
            if (heartView) {
                heartView.className = 'albums-heart-view slide-in-up';
                heartView.style.display = 'flex';
            }
        }

        HeartEngine.start();
    }

    // --- Slideshow ---
    function startSlideshow() {
        if (validImages.length === 0) renderGallery();
        openLightbox(0);
        isSlideshowPlaying = true;

        if (slideshowTimer) clearInterval(slideshowTimer);
        slideshowTimer = setInterval(() => {
            if (!lightbox || !lightbox.classList.contains('active')) {
                stopSlideshow();
                return;
            }
            lightboxNext();
        }, ALBUM_CONFIG.slideshowInterval);
    }

    function stopSlideshow() {
        isSlideshowPlaying = false;
        if (slideshowTimer) {
            clearInterval(slideshowTimer);
            slideshowTimer = null;
        }
    }

    // --- Lightbox ---
    function openLightbox(index) {
        if (validImages.length === 0) return;

        lightbox = document.getElementById('albums-lightbox');
        lightboxImg = document.getElementById('albums-lightbox-img');
        lightboxCounter = document.getElementById('albums-lightbox-counter');

        currentLightboxIndex = index;
        updateLightboxImage();

        if (lightbox) lightbox.classList.add('active');
        document.addEventListener('keydown', handleLightboxKey);
    }

    function closeLightbox() {
        lightbox = document.getElementById('albums-lightbox');
        if (lightbox) lightbox.classList.remove('active');
        document.removeEventListener('keydown', handleLightboxKey);
        stopSlideshow();
    }

    function updateLightboxImage() {
        if (!lightboxImg || validImages.length === 0) return;

        // Loop safety
        if (currentLightboxIndex >= validImages.length) currentLightboxIndex = 0;
        if (currentLightboxIndex < 0) currentLightboxIndex = validImages.length - 1;

        const entry = validImages[currentLightboxIndex];
        if (!entry) return;

        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = entry.src;
            lightboxImg.onload = () => { lightboxImg.style.opacity = '1'; };
        }, 100);

        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${validImages.length}`;
        }
    }

    function lightboxPrev() {
        currentLightboxIndex--;
        updateLightboxImage();
    }

    function lightboxNext() {
        currentLightboxIndex++;
        updateLightboxImage();
    }

    function handleLightboxKey(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            stopSlideshow();
            lightboxPrev();
        }
        if (e.key === 'ArrowRight') {
            stopSlideshow();
            lightboxNext();
        }
    }

    // --- Events ---
    function bindEvents() {
        const viewBtn = document.getElementById('albums-view-btn');
        if (viewBtn) viewBtn.onclick = () => showGallery();

        const backBtn = document.getElementById('albums-back-btn');
        if (backBtn) backBtn.onclick = () => showHeart(true);

        const slideshowBtn = document.getElementById('albums-slideshow-btn');
        if (slideshowBtn) slideshowBtn.onclick = () => startSlideshow();

        const closeBtn = document.getElementById('albums-lightbox-close');
        if (closeBtn) closeBtn.onclick = () => closeLightbox();

        const prevBtn = document.getElementById('albums-lightbox-prev');
        if (prevBtn) prevBtn.onclick = () => {
            stopSlideshow();
            lightboxPrev();
        };

        const nextBtn = document.getElementById('albums-lightbox-next');
        if (nextBtn) nextBtn.onclick = () => {
            stopSlideshow();
            lightboxNext();
        };

        const lb = document.getElementById('albums-lightbox');
        if (lb) {
            let touchStartX = 0;
            let touchCount = 0;
            lb.addEventListener('touchstart', e => {
                touchCount = e.touches.length;
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            lb.addEventListener('touchend', e => {
                // Ignore pinch-to-zoom (multi-touch)
                if (touchCount > 1) return;
                const diff = e.changedTouches[0].screenX - touchStartX;
                if (Math.abs(diff) > 50) {
                    stopSlideshow();
                    if (diff > 0) lightboxPrev();
                    else lightboxNext();
                }
            }, { passive: true });

            lb.onclick = (e) => {
                if (e.target === lb) closeLightbox();
            };
        }
    }

    return {
        init() {
            if (!initialized) {
                bindEvents();
                initialized = true;
            }

            if (IS_MOBILE) {
                // Mobile: skip heart, go straight to gallery
                const hv = document.getElementById('albums-heart-view');
                if (hv) hv.style.display = 'none';

                const gv = document.getElementById('albums-gallery-view');
                if (gv) {
                    gv.style.display = 'flex';
                    gv.classList.remove('view-hidden-down');
                    gv.classList.add('view-active');
                }
                renderGallery();
            } else {
                showHeart(false);
                HeartEngine.start();
            }
            preloadImages();
        },
        stop() {
            HeartEngine.stop();
            closeLightbox();
            stopSlideshow();
        },
        showGallery,
        showHeart
    };
})();

// --- Expose globally for main.js integration ---
window.AlbumManager = AlbumManager;
