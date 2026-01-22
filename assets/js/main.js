// CONFIGURATION
const totalImages = 3;
const ENCRYPTED_CONTENT = 'U2FsdGVkX19ldi6C3f2YMmhX4kd83cffq5pckLdF4qT/LNMkdjmvDK9U9pUvvdpp2Lwp2zymf0UJJKV1Xa/g8g==';

// STATE
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let favorites = JSON.parse(localStorage.getItem('babe_favs')) || [];


// Playlist Management
let currentPlaylist = [];
let currentMode = 'chill'; // default

// Theme Logic
let isDarkMode = localStorage.getItem('babe_theme') === 'dark'; // Initial check


// DOM
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const disk = document.getElementById('disk');
const titleEl = document.getElementById('song-title');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currTimeEl = document.getElementById('current-time');
const durTimeEl = document.getElementById('duration');
const favBtn = document.getElementById('fav-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const themeBtn = document.getElementById('theme-toggle');
const listBtn = document.getElementById('list-btn');
const modal = document.getElementById('playlist-modal');
const closeModal = document.getElementById('close-modal');
const playlistContainer = document.getElementById('playlist-container');
const greetingEl = document.getElementById('greeting');
const messageContainer = document.getElementById('message-container');
const messageText = document.getElementById('message-text');
const modeBtns = document.querySelectorAll('.mode-btn');

// SECURITY DOM
const passwordModal = document.getElementById('password-modal');
const closePassModalBtn = document.getElementById('close-password-modal');
const secretInput = document.getElementById('secret-password');
const unlockBtn = document.getElementById('unlock-btn');
const lockSecretBtn = document.getElementById('lock-secret-btn'); // Lock Button
const avatar = document.querySelector('.user-profile'); // Target the profile container
let avatarClickCount = 0;
let avatarClickTimer = null;

// SIDEBAR & NAVIGATION DOM
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const closeSidebarBtn = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');

// DIARY DOM
const moodItems = document.querySelectorAll('.mood-item');
const diaryContent = document.getElementById('diary-content');
const sendDiaryBtn = document.getElementById('send-diary-btn');
let selectedMood = 'vui'; // Default

// INIT
function init() {
    // Determine initial mode based on theme or time logic if needed
    // But user want explict modes. Let's filter first.
    const hour = new Date().getHours();

    // If user hasn't selected a theme, decide based on time
    if (!localStorage.getItem('babe_theme')) {
        isDarkMode = (hour >= 18 || hour < 6);
        currentMode = isDarkMode ? 'suy' : 'chill';
    } else {
        currentMode = isDarkMode ? 'suy' : 'chill';
    }

    setTheme(isDarkMode);
    switchMode(currentMode, false);

    showGreeting();

    setupSidebarEvents();
    setupDiaryEvents();

    // Auto-check secret session
    checkSecretSession();
}

// --- SIDEBAR & NAV LOGIC ---
function setupSidebarEvents() {
    sidebarToggle.addEventListener('click', openSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            switchSection(target);

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            closeSidebar();
        });
    });

    // Easter Egg Logic
    // Easter Egg Logic
    // 1. Click Trigger (3 clicks)
    avatar.addEventListener('click', () => {
        avatarClickCount++;

        if (avatarClickTimer) clearTimeout(avatarClickTimer);

        avatarClickTimer = setTimeout(() => {
            avatarClickCount = 0;
        }, 3000); // Reset if not reached 3 clicks within 3s

        if (avatarClickCount >= 3) {
            avatarClickCount = 0;
            openPasswordModal();
        }
    });

    // 2. Long Press Trigger (2.5 seconds)
    let longPressTimer;

    const startLongPress = () => {
        longPressTimer = setTimeout(() => {
            openPasswordModal();
        }, 2000);
    };

    const cancelLongPress = () => {
        if (longPressTimer) clearTimeout(longPressTimer);
    };

    // Mouse Events
    avatar.addEventListener('mousedown', startLongPress);
    avatar.addEventListener('mouseup', cancelLongPress);
    avatar.addEventListener('mouseleave', cancelLongPress);

    // Touch Events
    avatar.addEventListener('touchstart', (e) => {
        // e.preventDefault(); // Optional: prevent scroll if needed, but might block scrolling page
        startLongPress();
    }, { passive: true });
    avatar.addEventListener('touchend', cancelLongPress);
    avatar.addEventListener('touchcancel', cancelLongPress);
}

// --- SECURITY LOGIC ---
function openPasswordModal() {
    passwordModal.classList.add('open');
    document.getElementById('modal-overlay').classList.add('active');
    secretInput.value = "";
    secretInput.focus();
}

function closePasswordModal() {
    passwordModal.classList.remove('open');
    if (!modal.classList.contains('open')) { // Only remove overlay if plain playlist modal isn't open? 
        // Actually overlay usage is shared. 
        // If playlist modal is open, overlay should stay.
        // But here we assume only one modal at a time usually.
        document.getElementById('modal-overlay').classList.remove('active');
    }
}

// Validate Password
if (unlockBtn) {
    unlockBtn.addEventListener('click', checkPassword);
    closePassModalBtn.addEventListener('click', closePasswordModal);
}
if (lockSecretBtn) {
    lockSecretBtn.addEventListener('click', lockSecretMode);
}

const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 hours
const SECRET_KEY = 'babe_secret_session';

function checkSecretSession() {
    try {
        const encryptedSession = localStorage.getItem(SECRET_KEY);
        if (!encryptedSession) return;

        // Decode: Base64 -> String -> JSON
        const sessionStr = atob(encryptedSession);
        const session = JSON.parse(sessionStr);

        const now = Date.now();
        if (now - session.timestamp < SESSION_DURATION) {
            // Valid Session
            unlockSecretFeatures(false); // false = no alert
        } else {
            // Expired
            lockSecretMode();
        }
    } catch (e) {
        console.error("Session invalid", e);
        lockSecretMode();
    }
}

function lockSecretMode() {
    localStorage.removeItem(SECRET_KEY);
    location.reload();
}

function unlockSecretFeatures(showAlert = true) {
    if (showAlert) alert("Mở khóa thành công! Chào mừng bà chủ về nhà. 🥰");
    closePasswordModal();

    // Reveal Hidden Features
    document.querySelector('.nav-item[data-target="diary-section"]').style.display = 'flex';
    document.getElementById('lock-secret-btn').style.display = 'flex';

    // Switch to Diary if auto?
    if (!showAlert) {
        // Silent unlock
    }
}

function checkPassword() {
    const pass = secretInput.value;
    if (!pass) return;

    try {
        const bytes = CryptoJS.AES.decrypt(ENCRYPTED_CONTENT, pass);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (originalText && originalText.length > 5) { // Simple validation check
            // Success
            alert("Mở khóa thành công! Chào mừng bà chủ về nhà. 🥰");
            // Create Session
            const session = {
                timestamp: Date.now(),
                token: btoa(pass)
            };
            localStorage.setItem(SECRET_KEY, btoa(JSON.stringify(session)));

            unlockSecretFeatures(false); // UI unlock
            return;

        } else {
            alert("Sai mật mã rồi! Chỉ có Dê Bông mới biết thôi. 😝");
        }
    } catch (e) {
        alert("Sai mật mã rồi! Chỉ có Dê Bông mới biết thôi. 😝");
    }
}

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

function switchSection(targetId) {
    contentSections.forEach(section => {
        section.classList.remove('active');
        // Small delay to allow fade out before display:none takes effect? 
        // CSS handles fade in, but display switching is instant. 
        // For simplicity:
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.style.display = 'flex';
        // Force reflow
        void targetSection.offsetWidth;
        targetSection.classList.add('active');
    }
}

// --- DIARY LOGIC ---
const moodPlaceholders = {
    'vui': "Có chuyện gì vui kể anh nghe chung vui với!",
    'buon': "Ai làm bé buồn? Kể đi anh thương.",
    'gian': "Đứa nào chọc điên cô giáo? Khai tên để anh xử!",
    'nho': "Nhớ nhiều không? Để anh phi trâu qua liền?",
    'met': "Vất vả rồi. Muốn ăn gì hay muốn ôm cái nào?"
};

function setupDiaryEvents() {
    // Set initial placeholder
    diaryContent.placeholder = moodPlaceholders[selectedMood];

    moodItems.forEach(item => {
        item.addEventListener('click', () => {
            moodItems.forEach(m => m.classList.remove('selected'));
            item.classList.add('selected');
            selectedMood = item.dataset.mood;

            // Update placeholder with animation
            diaryContent.style.opacity = '0.5';
            setTimeout(() => {
                diaryContent.placeholder = moodPlaceholders[selectedMood] || "Kể cho anh nghe đi...";
                diaryContent.style.opacity = '1';
                diaryContent.focus();
            }, 200);
        });
    });

    sendDiaryBtn.addEventListener('click', async () => {
        const text = diaryContent.value.trim();
        if (!text) {
            alert("Viết đôi dòng tâm sự đã nào! 🥺");
            return;
        }

        // Disable button
        sendDiaryBtn.disabled = true;
        sendDiaryBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';

        try {
            await window.sendToTelegram(selectedMood, text);

            // Success UI
            diaryContent.value = "";
            alert("Đã gửi đến anh thành công! 🥰");
        } catch (error) {
            console.error(error);
            alert("Lỗi rồi do đường truyền đến bị yếu nhá, bé đợi xíu nữa hoặc gọi anh nhé");
        } finally {
            sendDiaryBtn.disabled = false;
            sendDiaryBtn.innerHTML = '<span>Gửi đi</span> <i class="fas fa-paper-plane"></i>';
        }
    });
}


// --- MODE SWITCHING ---
function switchMode(mode, autoSetTheme = true) {
    currentMode = mode;
    const highlight = document.getElementById('mode-highlight');

    // Update Buttons & Sliding Animation
    modeBtns.forEach((btn, index) => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
            // Slide highlight: 0% for first item, 100% (of item width) for second
            // Since it's absolutely positioned, we can use translateX based on index.
            const indexValue = index;
            highlight.style.transform = `translateX(${indexValue * 100}%)`;
        } else {
            btn.classList.remove('active');
        }
    });

    // Filter Playlist
    currentPlaylist = playlist.filter(song => song.type === mode);
    if (currentPlaylist.length === 0) currentPlaylist = [...playlist];

    // Set Theme
    if (autoSetTheme) {
        isDarkMode = (mode !== 'chill');
        setTheme(isDarkMode);
    }

    // Reset Player
    currentIndex = 0;
    loadTrack(currentIndex);
    if (isPlaying) playMusic();
    else renderPlaylist();
}

// --- MOBILE VISUALS CYCLE ---
let mobileCycleInterval;
let cycleTimeout;

function startMobileCycle() {
    clearMobileCycle();

    // Initial State: Show Disk (20s)
    updateMobileVisuals(false); // Hide message, show disk

    // Schedule switch to Message after 20s
    cycleTimeout = setTimeout(() => {
        updateMobileVisuals(true); // Show message, hide disk

        // Schedule loop
        mobileCycleInterval = setInterval(() => {
            // Reset to Disk for 20s
            updateMobileVisuals(false);

            cycleTimeout = setTimeout(() => {
                updateMobileVisuals(true);
            }, 20000); // Wait 20s before showing message

        }, 30000); // Total cycle: 20s + 10s = 30s

    }, 20000);
}

function clearMobileCycle() {
    if (mobileCycleInterval) clearInterval(mobileCycleInterval);
    if (cycleTimeout) clearTimeout(cycleTimeout);
}

function updateMobileVisuals(hasMessage) {
    const diskContainer = document.querySelector('.disk-container');
    const messageContainer = document.getElementById('message-container');

    if (hasMessage) {
        diskContainer.classList.add('has-message');
        messageContainer.style.opacity = '1';
    } else {
        diskContainer.classList.remove('has-message');
        messageContainer.style.opacity = '0';
    }
}

// Add Resize Listener
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        const currentTrack = currentPlaylist[currentIndex];
        if (currentTrack && currentTrack.message) {
            startMobileCycle();
        }
    } else {
        clearMobileCycle();
        updateMobileVisuals(false); // Reset to disk view on desktop
        if (currentPlaylist[currentIndex]?.message) {
            document.getElementById('message-container').style.opacity = '1';
        }
    }
});


function showGreeting() {
    const hour = new Date().getHours();
    let greeting = "";
    if (hour >= 4 && hour < 5) greeting = "Dậy sớm thế cô giáo? Cho phép mơ thấy anh để ngủ ngon lại đó ☕";
    else if (hour >= 5 && hour < 12) greeting = "Buổi sáng hảo bé nha! ☀️ Nạp năng lượng đi nào.";
    else if (hour >= 12 && hour < 14) greeting = "Trưa rồi, bé ăn uống đầy đủ rồi ngủ sớm nha! 🍚";
    else if (hour >= 14 && hour < 18) greeting = "Chiều dạy vui nha cô giáo! ☕";
    else if (hour >= 18 && hour < 22) greeting = "Tối ấm áp! Thư giãn xíu đi nè. Anh về với bé giờ 🍵";
    else greeting = "Khuya rồi, nghe nhạc xíu rồi ngủ ngoan nha. 🌙";

    greetingEl.innerText = greeting;
    setTimeout(() => {
        greetingEl.classList.add('show');
    }, 100);
}

// --- CORE FUNCTIONS ---

function loadTrack(index) {
    // Safety check
    if (!currentPlaylist[index]) {
        index = 0;
        currentIndex = 0;
    }

    const track = currentPlaylist[index];
    if (!track) return; // Empty list

    audio.src = `assets/musics/${track.file}`;
    titleEl.textContent = track.title;

    // Message Logic
    if (track.message) {
        messageText.innerText = track.message;

        if (window.innerWidth <= 768) {
            startMobileCycle();
        } else {
            // Desktop: Always show message bubble
            messageContainer.style.opacity = '1';
            updateMobileVisuals(false); // Ensure disk is visible on desktop
        }
    } else {
        messageText.innerText = "";
        clearMobileCycle();
        updateMobileVisuals(false);
    }

    // Random image for each track load
    let imgId = Math.floor(Math.random() * totalImages) + 1;

    // Set background image
    disk.style.backgroundImage = `url('assets/images/${imgId}.jpg')`;

    // Reset disk animation
    disk.style.animationPlayState = 'paused';

    updateFavIcon();
    updateActivePlaylistItem();
}

function playMusic() {
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    disk.style.animationPlayState = 'running';
}

function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    disk.style.animationPlayState = 'paused';
}

function nextTrack() {
    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * currentPlaylist.length);
        } while (newIndex === currentIndex && currentPlaylist.length > 1);
        currentIndex = newIndex;
    } else {
        currentIndex++;
        if (currentIndex >= currentPlaylist.length) currentIndex = 0;
    }
    loadTrack(currentIndex);
    playMusic();
}

function prevTrack() {
    currentIndex--;
    if (currentIndex < 0) currentIndex = currentPlaylist.length - 1;
    loadTrack(currentIndex);
    playMusic();
}

// --- CONTROLS EVENTS ---

playBtn.addEventListener('click', () => {
    if (isPlaying) pauseMusic();
    else playMusic();
});

nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

audio.addEventListener('ended', () => {
    if (isRepeat) {
        playMusic();
    } else {
        nextTrack();
    }
});

audio.addEventListener('timeupdate', (e) => {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Time Display
    if (duration) {
        let min = Math.floor(duration / 60);
        let sec = Math.floor(duration % 60);
        if (sec < 10) sec = `0${sec}`;
        durTimeEl.innerText = `${min}:${sec}`;
    }

    let minCurr = Math.floor(currentTime / 60);
    let secCurr = Math.floor(currentTime % 60);
    if (secCurr < 10) secCurr = `0${secCurr}`;
    currTimeEl.innerText = `${minCurr}:${secCurr}`;

    // Save state
    localStorage.setItem('babe_audio_time', currentTime);
});

progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
});

// --- BUTTONS LOGIC ---

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
    repeatBtn.innerHTML = isRepeat ? '<i class="fas fa-redo-alt"></i>' : '<i class="fas fa-redo"></i>';
});

favBtn.addEventListener('click', () => {
    const currentSongId = currentPlaylist[currentIndex].id;
    const index = favorites.indexOf(currentSongId);

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(currentSongId);
    }

    localStorage.setItem('babe_favs', JSON.stringify(favorites));
    updateFavIcon();
    renderPlaylist();
});

function updateFavIcon() {
    if (!currentPlaylist[currentIndex]) return;
    const currentSongId = currentPlaylist[currentIndex].id;
    if (favorites.includes(currentSongId)) {
        favBtn.innerHTML = '<i class="fas fa-heart"></i>';
        favBtn.classList.add('active');
    } else {
        favBtn.innerHTML = '<i class="far fa-heart"></i>';
        favBtn.classList.remove('active');
    }
}

// --- PLAYLIST & FAVS UI ---

// LIST OVERLAY DOM
const modalOverlay = document.getElementById('modal-overlay');

listBtn.addEventListener('click', () => {
    modal.classList.add('open');
    modalOverlay.classList.add('active');
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('open');
    modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', () => {
    modal.classList.remove('open');
    modalOverlay.classList.remove('active');
});

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    currentPlaylist.forEach((track, index) => {
        const item = document.createElement('div');
        item.classList.add('playlist-item');
        if (index === currentIndex) item.classList.add('active');

        const isFav = favorites.includes(track.id) ? '<i class="fas fa-heart" style="color:var(--accent-color); margin-right:8px;"></i>' : '';

        item.innerHTML = `
            ${isFav}
            <span>${track.title}</span>
        `;

        item.addEventListener('click', () => {
            currentIndex = index;
            loadTrack(currentIndex);
            playMusic();
            modal.classList.remove('open');
            modalOverlay.classList.remove('active');
        });

        playlistContainer.appendChild(item);
    });
}

function updateActivePlaylistItem() {
    // Re-render is simplest to ensuring styling update
    renderPlaylist();
}

// --- THEME ---

themeBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    setTheme(isDarkMode);
});

function setTheme(isDark) {
    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('babe_theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('babe_theme', 'light');
    }
}

// BOOT
init();
