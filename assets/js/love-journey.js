// LOVE JOURNEY LOGIC - V3 (Per-Digit Odometer Animation)

const START_DATE = new Date("2026-01-30T08:00:00").getTime();
const TIMELINE_FILE = 'assets/js/timeline.json';

// DOM Elements
const timelineContainer = document.getElementById('love-timeline');
const heartContainer = document.querySelector('.love-counter-container');

// Single View Elements
const normalView = document.getElementById('counter-normal-view');
const singleView = document.getElementById('counter-single-view');
const singleValueEl = document.getElementById('single-value');
const singleUnitEl = document.getElementById('single-unit');

// State
let currentTimeData = { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
let totalSeconds = 0;
let singleViewTimeout = null;

// Per-digit odometer state (stores previous value string for each element)
const prevValues = {
    years: '',
    months: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: ''
};

// --- COUNTER LOGIC ---
function updateCounter() {
    const now = new Date().getTime();
    const distance = now - START_DATE;

    if (distance < 0) return;

    totalSeconds = Math.floor(distance / 1000);

    let startDate = new Date(START_DATE);
    let endDate = new Date(now);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();
    let hours = endDate.getHours() - startDate.getHours();
    let minutes = endDate.getMinutes() - startDate.getMinutes();
    let seconds = endDate.getSeconds() - startDate.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
        let previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += previousMonth.getDate();
        months--;
    }
    if (months < 0) { months += 12; years--; }

    currentTimeData = { years, months, days, hours, minutes, seconds };

    // Update DOM with per-digit odometer
    updateOdometerDigits('years', years);
    updateOdometerDigits('months', months);
    updateOdometerDigits('days', days);
    updateOdometerDigits('hours', hours);
    updateOdometerDigits('minutes', minutes);
    updateOdometerDigits('seconds', seconds);

    // Show/hide based on value >= 1
    toggleRowVisibility('row-years', years);
    toggleRowVisibility('row-months', months);
    toggleRowVisibility('row-days', days);

    // Floating Heart
    createFloatingHeart();
}

function toggleRowVisibility(rowId, value) {
    const row = document.getElementById(rowId);
    if (row) {
        row.style.display = value >= 1 ? 'flex' : 'none';
    }
}

function updateOdometerDigits(elId, newValue) {
    const el = document.getElementById(elId);
    if (!el) return;

    const newStr = String(newValue);
    const oldStr = prevValues[elId] || '';

    // Pad to same length
    const maxLen = Math.max(newStr.length, oldStr.length);
    const paddedNew = newStr.padStart(maxLen, '0');
    const paddedOld = oldStr.padStart(maxLen, '0');

    // Build HTML with per-digit spans
    let html = '';
    for (let i = 0; i < paddedNew.length; i++) {
        const newDigit = paddedNew[i];
        const oldDigit = paddedOld[i] || '';

        if (newDigit !== oldDigit) {
            // This digit changed - animate it
            html += `<span class="digit digit-roll">${newDigit}</span>`;
        } else {
            // Same digit - no animation
            html += `<span class="digit">${newDigit}</span>`;
        }
    }

    el.innerHTML = html;
    prevValues[elId] = newStr;
}

function startCounter() {
    updateCounter();
    setInterval(updateCounter, 1000);
}

// --- CLICK TO CONVERT ---
function setupClickToConvert() {
    const timeRows = document.querySelectorAll('.time-row');
    timeRows.forEach(row => {
        row.addEventListener('click', () => {
            const unit = row.dataset.unit;
            showSingleUnit(unit);
        });
    });
}

function showSingleUnit(unit) {
    if (singleViewTimeout) clearTimeout(singleViewTimeout);

    let value = 0;
    let label = '';
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalDays = Math.floor(totalSeconds / 86400);
    const totalMonths = totalDays / 30.44;
    const totalYears = totalDays / 365.25;

    switch (unit) {
        case 'years':
            value = totalYears.toFixed(2);
            label = 'Năm';
            break;
        case 'months':
            value = totalMonths.toFixed(1);
            label = 'Tháng';
            break;
        case 'days':
            value = totalDays.toLocaleString('vi-VN');
            label = 'Ngày';
            break;
        case 'hours':
            value = totalHours.toLocaleString('vi-VN');
            label = 'Giờ';
            break;
        case 'minutes':
            value = totalMinutes.toLocaleString('vi-VN');
            label = 'Phút';
            break;
        case 'seconds':
            value = totalSeconds.toLocaleString('vi-VN');
            label = 'Giây';
            break;
    }

    singleValueEl.innerText = value;
    singleUnitEl.innerText = label;

    // Smooth fade transition
    normalView.style.opacity = '0';
    setTimeout(() => {
        normalView.style.display = 'none';
        singleView.style.display = 'flex';
        singleView.style.opacity = '0';
        requestAnimationFrame(() => {
            singleView.style.opacity = '1';
        });
    }, 150);

    singleViewTimeout = setTimeout(() => {
        // Fade back
        singleView.style.opacity = '0';
        setTimeout(() => {
            singleView.style.display = 'none';
            normalView.style.display = 'flex';
            normalView.style.opacity = '0';
            requestAnimationFrame(() => {
                normalView.style.opacity = '1';
            });
        }, 150);
    }, 5000);
}


// --- FLOATING HEARTS (PARTICLES) ---
function createFloatingHeart() {
    if (!heartContainer) return;
    const loveSection = document.getElementById('love-section');
    if (!loveSection || !loveSection.classList.contains('active')) return;

    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = ['❤️', '💕', '💗', '💖'][Math.floor(Math.random() * 4)];

    const left = Math.random() * 100;
    const size = Math.random() * 15 + 8;
    const duration = Math.random() * 3 + 2;

    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDuration = `${duration}s`;

    heartContainer.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
}

// --- TIMELINE LOGIC ---
// DOM Elements for fullpage timeline
const timelineFullpage = document.getElementById('timeline-fullpage');
const timelineFullContent = document.getElementById('timeline-full-content');
const scrollToTimelineBtn = document.getElementById('scroll-to-timeline');
const timelineBackBtn = document.getElementById('timeline-back');
const playJourneyBtn = document.getElementById('play-journey-btn');
const loveContainer = document.querySelector('.love-container');

let isAutoScrolling = false;
let autoScrollInterval = null;

async function loadTimeline() {
    let events = [];
    try {
        const response = await fetch(TIMELINE_FILE);
        if (response.ok) {
            const jsonData = await response.json();
            events = [...jsonData];
        }
    } catch (e) {
        console.error("Error loading timeline json", e);
    }
    // Sort by date ascending (oldest first, newest last)
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    renderTimelineFullpage(events);
    setupTimelineNavigation();
    setupBackToTop();
}

function setupBackToTop() {
    const backToTopBtn = document.getElementById('timeline-to-top');
    if (!backToTopBtn || !timelineFullpage) return;

    // Show/Hide on scroll
    timelineFullpage.addEventListener('scroll', () => {
        if (timelineFullpage.scrollTop > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top
    backToTopBtn.addEventListener('click', () => {
        timelineFullpage.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function renderTimelineFullpage(events) {
    if (!timelineFullContent) return;
    timelineFullContent.innerHTML = '';

    events.forEach((event, index) => {
        const card = document.createElement('div');
        card.classList.add('timeline-card');
        card.dataset.index = index;
        card.dataset.hasImage = (event.image && event.image.trim() !== '') ? 'true' : 'false';

        const dateObj = new Date(event.date);
        const dateStr = dateObj.toLocaleDateString('vi-VN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        const timeStr = dateObj.toLocaleTimeString('vi-VN', {
            hour: '2-digit', minute: '2-digit'
        });

        // Build card with flip structure and time on left
        const imageUrl = event.image && event.image.trim() !== '' ? event.image : '';
        const tapHint = imageUrl ? '<div class="timeline-card-hint">👆 Nhấn để xem ảnh</div>' : '';

        card.innerHTML = `
            <div class="timeline-card-time-left">
                <span class="time-date">${dateStr}</span>
                <span class="time-hour">${timeStr}</span>
            </div>
            <div class="timeline-card-icon">${event.icon || '❤️'}</div>
            <div class="timeline-card-flipper">
                <div class="timeline-card-front">
                    <h3>${event.title}</h3>
                    <p>${event.desc}</p>
                    ${tapHint}
                </div>
                <div class="timeline-card-back">
                    ${imageUrl ? `
                        <img src="${imageUrl}" alt="${event.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div style=\\'padding:40px;text-align:center;color:var(--secondary-text)\\'>Không tải được ảnh 😢</div>'">
                        <div class="timeline-card-zoom-icon" title="Xem ảnh đầy đủ"><i class="fas fa-search-plus"></i></div>
                    ` : ''}
                </div>
            </div>
        `;

        // Add click handler for flip/shake
        card.addEventListener('click', () => {
            if (card.dataset.hasImage === 'true') {
                card.classList.toggle('flipped');
            } else {
                // Shake animation
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 500);
            }
        });

        // Add Lightbox trigger for zoom icon ONLY
        const zoomIcon = card.querySelector('.timeline-card-zoom-icon');
        const img = card.querySelector('.timeline-card-back img');

        if (zoomIcon && img) {
            zoomIcon.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card from flipping back
                openLightbox(img.src);
            });
        }

        timelineFullContent.appendChild(card);
    });

    // Setup lazy loading with Intersection Observer
    setupLazyLoading();
}

function setupLazyLoading() {
    const cards = document.querySelectorAll('.timeline-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add stagger delay based on index
                const index = entry.target.dataset.index;
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => observer.observe(card));
}

function setupTimelineNavigation() {
    // Scroll to timeline (down arrow click)
    if (scrollToTimelineBtn) {
        scrollToTimelineBtn.addEventListener('click', () => {
            showTimelineFullpage();
        });
    }

    // Back to top (up arrow click)
    if (timelineBackBtn) {
        timelineBackBtn.addEventListener('click', () => {
            hideTimelineFullpage();
        });
    }

    // Play Journey button
    if (playJourneyBtn) {
        playJourneyBtn.addEventListener('click', () => {
            startPlayJourney();
        });
    }
}

function showTimelineFullpage() {
    if (!timelineFullpage || !loveContainer) return;

    // Hide love container
    loveContainer.style.display = 'none';

    // Show and animate timeline fullpage
    timelineFullpage.style.display = 'block';
    // Force reflow
    void timelineFullpage.offsetWidth;
    timelineFullpage.classList.add('visible');

    // Show Add Memory Button
    const addMemoryBtn = document.getElementById('add-memory-btn');
    if (addMemoryBtn) addMemoryBtn.classList.add('visible');

    // Scroll to top of timeline section
    timelineFullpage.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideTimelineFullpage() {
    if (!timelineFullpage || !loveContainer) return;

    // Stop auto-scroll if running
    stopPlayJourney();

    // Hide timeline
    timelineFullpage.classList.remove('visible');

    // Hide Add Memory Button
    const addMemoryBtn = document.getElementById('add-memory-btn');
    if (addMemoryBtn) addMemoryBtn.classList.remove('visible');

    setTimeout(() => {
        timelineFullpage.style.display = 'none';
        // Show love container
        loveContainer.style.display = 'block';
        loveContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
}

function startPlayJourney() {
    showTimelineFullpage();

    // Wait for transition then start auto-scroll
    setTimeout(() => {
        isAutoScrolling = true;

        // Enable Immersive Mode (Hide UI)
        document.body.classList.add('immersive-mode');

        // Change button to "Stop"
        if (playJourneyBtn) {
            playJourneyBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
            playJourneyBtn.onclick = stopPlayJourney;
        }

        // Get all timeline cards
        const cards = document.querySelectorAll('.timeline-card');
        const scrollContainer = timelineFullpage;

        if (!scrollContainer || cards.length === 0) {
            stopPlayJourney();
            return;
        }

        // Logic to stop on interaction
        const stopOnInteraction = () => {
            if (isAutoScrolling) {
                stopPlayJourney();
            }
        };

        // Add interaction listeners to container
        scrollContainer.addEventListener('wheel', stopOnInteraction);
        scrollContainer.addEventListener('touchmove', stopOnInteraction);
        scrollContainer.addEventListener('click', (e) => {
            // Stop if clicking inside timeline but not on the button itself (which handles stop)
            if (e.target.closest('.timeline-card')) stopOnInteraction();
        });

        // Store handler to remove later
        window._loveJourneyStopHandler = stopOnInteraction;


        // Function to process sequence for a single card
        function processCard(index) {
            if (!isAutoScrolling || index >= cards.length) {
                stopPlayJourney();
                return;
            }

            const card = cards[index];

            // 1. Scroll card into view smoothly
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // 2. Animate visibility
            setTimeout(() => {
                if (!isAutoScrolling) return;
                card.classList.add('visible');
            }, 500);

            // 3. Logic for Auto Flip
            const hasImage = card.dataset.hasImage === 'true';

            // Base time to view card
            let delayForNext = 2500;

            if (hasImage) {
                // Flip after a delay
                setTimeout(() => {
                    if (!isAutoScrolling) return;
                    card.classList.add('flipped');
                }, 2500);

                // Unflip after viewing image
                setTimeout(() => {
                    if (!isAutoScrolling) return;
                    card.classList.remove('flipped');
                }, 4500); // 1.5s start + 3s view

                delayForNext = 5500; // Total time before next card
            }

            // Schedule next card
            autoScrollInterval = setTimeout(() => {
                processCard(index + 1);
            }, delayForNext);
        }

        // Start from first card (or reset visibility if replaying)
        cards.forEach(card => card.classList.remove('visible'));

        processCard(0);

    }, 700);
}

function stopPlayJourney() {
    isAutoScrolling = false;
    if (autoScrollInterval) {
        clearTimeout(autoScrollInterval); // Use clearTimeout for setTimeout
        autoScrollInterval = null;
    }

    // Disable Immersive Mode (Show UI)
    document.body.classList.remove('immersive-mode');

    // Remove interaction listeners
    if (window._loveJourneyStopHandler && timelineFullpage) {
        timelineFullpage.removeEventListener('wheel', window._loveJourneyStopHandler);
        timelineFullpage.removeEventListener('touchmove', window._loveJourneyStopHandler);
        // Note: 'click' listener was anonymous, so it won't be removed here, but that's acceptable as it checks isAutoScrolling
    }

    // Make all remaining cards visible
    const cards = document.querySelectorAll('.timeline-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 50);
    });

    // Reset button
    if (playJourneyBtn) {
        playJourneyBtn.innerHTML = '<i class="fas fa-play"></i> Bắt đầu xem';
        playJourneyBtn.onclick = () => startPlayJourney();
    }
}

// --- ADD MEMORY FEATURE ---
const WORKER_URL = 'https://radio-proxy.services2907.workers.dev';

function setupAddMemory() {
    const addMemoryBtn = document.getElementById('add-memory-btn');
    const addMemoryModal = document.getElementById('add-memory-modal');
    const closeMemoryModalBtn = document.getElementById('close-memory-modal');
    const addMemoryForm = document.getElementById('add-memory-form');

    if (!addMemoryBtn || !addMemoryModal) {
        console.log('Add Memory elements not found');
        return;
    }

    // Open modal
    addMemoryBtn.addEventListener('click', () => {
        addMemoryModal.classList.add('open');
        // Set default date to now
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('memory-date').value = now.toISOString().slice(0, 16);
    });

    // Close modal
    closeMemoryModalBtn.addEventListener('click', closeAddMemoryModal);
    addMemoryModal.addEventListener('click', (e) => {
        if (e.target === addMemoryModal) closeAddMemoryModal();
    });

    // Form submit
    addMemoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitMemory();
    });

    // Button visibility is now handled by showTimelineFullpage/hideTimelineFullpage
}

function closeAddMemoryModal() {
    const addMemoryModal = document.getElementById('add-memory-modal');
    if (addMemoryModal) addMemoryModal.classList.remove('open');
}

async function submitMemory() {
    const titleEl = document.getElementById('memory-title');
    const dateEl = document.getElementById('memory-date');
    const descEl = document.getElementById('memory-desc');
    const iconEl = document.getElementById('memory-icon');
    const submitBtn = document.getElementById('submit-memory-btn');
    const addMemoryForm = document.getElementById('add-memory-form');

    // Validation
    const title = titleEl.value.trim();
    const dateValue = dateEl.value;
    const desc = descEl.value.trim();
    const icon = iconEl.value;

    if (!title || !dateValue) {
        alert('Vui lòng nhập Tiêu đề và Ngày giờ!');
        return;
    }

    // Format date for display
    const dateObj = new Date(dateValue);
    const formattedDate = dateObj.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Generate ID and formatted date string for JSON
    const memoryId = Date.now();
    const jsonDateStr = dateValue + ':00';

    // Build JSON as PLAIN TEXT (no JSON.stringify to avoid Markdown issues)
    const jsonText = `{
    "id": ${memoryId},
    "title": "${title.replace(/"/g, '\\"')}",
    "date": "${jsonDateStr}",
    "desc": "${(desc || '').replace(/"/g, '\\"')}",
    "image": "",
    "icon": "${icon}"
}`;

    // Format Telegram message (Plain text, safe for Telegram)
    const telegramContent = `
💝 KỶ NIỆM MỚI
---------------------------
📌 Tiêu đề: ${title}
📅 Ngày: ${formattedDate}
${icon} Icon: ${icon}
${desc ? `📝 Mô tả: ${desc}` : ''}
---------------------------
JSON Data (Copy vào timeline.json):

${jsonText}
`;

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: telegramContent })
        });

        const data = await response.json();

        // Check both HTTP status and Telegram API response
        if (!response.ok || !data.ok) {
            const errorMsg = data.description || `HTTP ${response.status}`;
            throw new Error(errorMsg);
        }

        // Success
        alert('Anh sẽ thêm vào sớm nhé ❤️');
        closeAddMemoryModal();

        // Reset form
        addMemoryForm.reset();

    } catch (error) {
        console.error('Error submitting memory:', error);
        alert(`❌ Có lỗi xảy ra rồi, báo anh sửa lại nhé`);
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi Kỷ Niệm';
    }
}

// --- LIGHTBOX FEATURE ---
function setupLightbox() {
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxContent = document.querySelector('.lightbox-content');

    if (!lightboxOverlay) return;

    // Close logic
    function closeLightbox() {
        lightboxOverlay.classList.remove('visible');
        setTimeout(() => {
            lightboxOverlay.style.display = 'none';
            document.getElementById('lightbox-img').src = '';
        }, 300);
    }

    // Close on overlay click
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
    });

    // Close on X button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('visible')) {
            closeLightbox();
        }
    });
}

function openLightbox(imageUrl) {
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');

    if (!lightboxOverlay || !lightboxImg) return;

    lightboxImg.src = imageUrl;
    lightboxOverlay.style.display = 'flex';
    // Force reflow
    void lightboxOverlay.offsetWidth;
    lightboxOverlay.classList.add('visible');
}


// --- INIT ---
function initLoveJourney() {
    startCounter();
    loadTimeline();
    setupClickToConvert();
    setupAddMemory();
    setupLightbox(); // Init Lightbox
}

window.initLoveJourney = initLoveJourney;
