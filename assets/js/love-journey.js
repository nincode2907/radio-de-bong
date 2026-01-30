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
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderTimeline(events);
}

function renderTimeline(events) {
    if (!timelineContainer) return;
    timelineContainer.innerHTML = '';

    events.forEach(event => {
        const item = document.createElement('div');
        item.classList.add('timeline-item');

        const dateObj = new Date(event.date);
        const dateStr = dateObj.toLocaleDateString('vi-VN', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        item.innerHTML = `
            <div class="timeline-icon">${event.icon || '❤️'}</div>
            <div class="timeline-content">
                <h3>${event.title}</h3>
                <span class="timeline-date">${dateStr}</span>
                <p>${event.desc}</p>
            </div>
        `;
        timelineContainer.appendChild(item);
    });
}

// --- INIT ---
function initLoveJourney() {
    startCounter();
    loadTimeline();
    setupClickToConvert();
}

window.initLoveJourney = initLoveJourney;
