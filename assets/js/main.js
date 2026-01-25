// CONFIGURATION
const totalImages = 3;
const ENCRYPTED_CONTENT = 'U2FsdGVkX19ldi6C3f2YMmhX4kd83cffq5pckLdF4qT/LNMkdjmvDK9U9pUvvdpp2Lwp2zymf0UJJKV1Xa/g8g==';

// STATE
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = 'off'; // 'off', 'one', 'favorites'
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
const searchInput = document.getElementById('search-input');
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

// SLEEP TIMER DOM & STATE
const sleepBtn = document.getElementById('sleep-btn');
const sleepDropdown = document.getElementById('sleep-dropdown');
const sleepBadge = document.getElementById('sleep-badge');
const sleepOptions = document.querySelectorAll('.sleep-option');
let sleepTimerId = null;
let sleepEndTime = null;
let sleepUpdateInterval = null;

// INIT
function init() {
    // Determine initial mode based on saved state or time logic
    const hour = new Date().getHours();
    const savedMode = localStorage.getItem('babe_mode');
    const savedSongId = localStorage.getItem('babe_song_id');
    const savedTime = parseFloat(localStorage.getItem('babe_audio_time')) || 0;

    // Theme: prioritize time of day (day/night) unless user manually selected
    const isNightTime = (hour >= 18 || hour < 6);
    if (!localStorage.getItem('babe_theme')) {
        // No manual theme selection - use time-based
        isDarkMode = isNightTime;
    }
    // isDarkMode is already set from localStorage at line 18 if user selected before

    // Mode: use saved mode if exists, otherwise based on time
    if (savedMode) {
        currentMode = savedMode;
    } else {
        currentMode = isNightTime ? 'suy' : 'chill';
    }

    setTheme(isDarkMode);
    switchMode(currentMode, false);

    // Restore saved song position
    if (savedSongId) {
        const songIndex = currentPlaylist.findIndex(song => song.id === parseInt(savedSongId));
        if (songIndex !== -1) {
            currentIndex = songIndex;
            loadTrack(currentIndex);

            // Restore playback position when audio is ready
            audio.addEventListener('loadedmetadata', function restoreTime() {
                if (savedTime > 0 && savedTime < audio.duration) {
                    audio.currentTime = savedTime;
                }
                audio.removeEventListener('loadedmetadata', restoreTime);
            });
        }
    }

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

    // Filter and Sort Playlist alphabetically by title
    currentPlaylist = playlist.filter(song => song.type === mode);
    if (currentPlaylist.length === 0) currentPlaylist = [...playlist];
    currentPlaylist.sort((a, b) => a.title.localeCompare(b.title, 'vi'));

    // Save current mode
    localStorage.setItem('babe_mode', mode);

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

    // Set audio source (check if already preloaded for optimization)
    const trackUrl = `assets/musics/${track.file}`;
    if (!usePreloadedAudio(track.file)) {
        audio.src = trackUrl;
    }
    // Ensure audio is ready to play
    audio.load();

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

    // Save current song to localStorage
    localStorage.setItem('babe_song_id', track.id);

    // Store current artwork URL globally for Media Session updates
    window.currentArtworkUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}assets/images/${imgId}.jpg`;

    // Update Media Session for lock screen controls
    updateMediaSession();

    // Smart Preload: preload next track after a short delay
    setTimeout(preloadNextTrack, 2000);
}

// --- SMART PRELOAD (Cache bài tiếp theo) ---
let preloadAudio = null;
let preloadedTrackFile = null;

function preloadNextTrack() {
    // Can't predict shuffle, skip preload
    if (isShuffle) {
        return;
    }

    let nextTrack = null;

    // Handle favorites repeat mode
    if (isRepeat === 'favorites' && favorites.length > 0) {
        const currentSongId = currentPlaylist[currentIndex]?.id;
        const currentFavIndex = favorites.indexOf(currentSongId);

        // Find next favorite that exists in current playlist
        for (let i = 0; i < favorites.length; i++) {
            let checkIndex = (currentFavIndex + 1 + i) % favorites.length;
            let nextFavId = favorites[checkIndex];

            const foundIndex = currentPlaylist.findIndex(song => song.id === nextFavId);
            if (foundIndex !== -1) {
                nextTrack = currentPlaylist[foundIndex];
                break;
            }
        }
    } else if (isRepeat !== 'one') {
        // Normal sequential mode (skip if repeat one - same song)
        const nextIndex = (currentIndex + 1) % currentPlaylist.length;
        nextTrack = currentPlaylist[nextIndex];
    }

    if (!nextTrack) return;

    // Already preloaded this track
    if (preloadedTrackFile === nextTrack.file) return;

    // Create or reuse preload audio
    if (!preloadAudio) {
        preloadAudio = new Audio();
        preloadAudio.preload = 'auto';
    }

    // Set source and start preloading
    preloadAudio.src = `assets/musics/${nextTrack.file}`;
    preloadedTrackFile = nextTrack.file;

    // Load enough data (browser will cache it)
    preloadAudio.load();

    console.log(`🎵 Preloaded: ${nextTrack.title}`);
}

// Use preloaded audio if available
function usePreloadedAudio(trackFile) {
    if (preloadedTrackFile === trackFile && preloadAudio) {
        // Swap the preloaded audio to main audio
        audio.src = preloadAudio.src;
        preloadedTrackFile = null;
        return true;
    }
    return false;
}

// Detect mobile for simpler handling (moved up for use in playMusic/pauseMusic)
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function playMusic() {
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    disk.style.animationPlayState = 'running';

    // Fade in effect (desktop only)
    if (!isMobile) {
        audio.volume = 0;
        fadeAudio('in');
    }
}

// --- MEDIA SESSION ---
function updateMediaSession() {
    if (!('mediaSession' in navigator)) return;

    const track = currentPlaylist[currentIndex];
    if (!track) return;

    // Build artist string with sleep timer info
    let artistText = 'Trạm Sạc Pin Dê Bông 🔋';
    if (sleepEndTime) {
        const remaining = Math.max(0, sleepEndTime - Date.now());
        const mins = Math.floor(remaining / 60000);
        if (mins > 0) {
            artistText = `💤 Tắt sau ${mins} phút`;
        } else {
            const secs = Math.floor(remaining / 1000);
            artistText = `💤 Tắt sau ${secs} giây`;
        }
    }

    navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: artistText,
        album: track.type === 'chill' ? 'Chill 🍃' : 'Suy 🌧️',
        artwork: [
            { src: window.currentArtworkUrl || '', sizes: '512x512', type: 'image/jpeg' }
        ]
    });

    // Set action handlers
    navigator.mediaSession.setActionHandler('play', () => playMusic());
    navigator.mediaSession.setActionHandler('pause', () => pauseMusic());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
}

function pauseMusic() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    disk.style.animationPlayState = 'paused';

    // Mobile: pause immediately
    if (isMobile) {
        audio.pause();
        return;
    }

    // Desktop: Fade out effect then pause
    fadeAudio('out', () => {
        audio.pause();
        audio.volume = 1; // Reset volume for next play
    });
}

// --- FADE AUDIO EFFECT ---
let fadeInterval = null;
const FADE_DURATION = 500; // 500ms for smooth fade
const FADE_STEPS = 20;

function fadeAudio(direction, callback) {
    // Clear any existing fade
    if (fadeInterval) {
        clearInterval(fadeInterval);
        fadeInterval = null;
    }

    // On mobile, use simpler/faster fade or skip if audio not playing
    const effectiveDuration = isMobile ? 300 : FADE_DURATION;
    const effectiveSteps = isMobile ? 10 : FADE_STEPS;
    const stepTime = effectiveDuration / effectiveSteps;
    const volumeStep = 1 / effectiveSteps;

    if (direction === 'in') {
        // Fade in: 0 -> 1
        try {
            audio.volume = 0;
        } catch (e) {
            // Some mobile browsers don't allow volume control
            if (callback) callback();
            return;
        }

        fadeInterval = setInterval(() => {
            try {
                if (audio.volume < 1 - volumeStep) {
                    audio.volume = Math.min(1, audio.volume + volumeStep);
                } else {
                    audio.volume = 1;
                    clearInterval(fadeInterval);
                    fadeInterval = null;
                    if (callback) callback();
                }
            } catch (e) {
                clearInterval(fadeInterval);
                fadeInterval = null;
                if (callback) callback();
            }
        }, stepTime);
    } else {
        // Fade out: current -> 0
        fadeInterval = setInterval(() => {
            try {
                if (audio.volume > volumeStep) {
                    audio.volume = Math.max(0, audio.volume - volumeStep);
                } else {
                    audio.volume = 0;
                    clearInterval(fadeInterval);
                    fadeInterval = null;
                    if (callback) callback();
                }
            } catch (e) {
                clearInterval(fadeInterval);
                fadeInterval = null;
                if (callback) callback();
            }
        }, stepTime);
    }
}

function nextTrack() {
    // If in favorites repeat mode, navigate within favorites
    if (isRepeat === 'favorites' && favorites.length > 0) {
        playNextFavorite();
        return;
    }

    // For mobile: switch track immediately to respond to user gesture
    if (isMobile) {
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
        return;
    }

    // Desktop: Fade out then switch
    fadeAudio('out', () => {
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
    });
}

function prevTrack() {
    // If in favorites repeat mode, navigate within favorites
    if (isRepeat === 'favorites' && favorites.length > 0) {
        playPrevFavorite();
        return;
    }

    // For mobile: switch track immediately
    if (isMobile) {
        currentIndex--;
        if (currentIndex < 0) currentIndex = currentPlaylist.length - 1;
        loadTrack(currentIndex);
        playMusic();
        return;
    }

    // Desktop: Fade out then switch
    fadeAudio('out', () => {
        currentIndex--;
        if (currentIndex < 0) currentIndex = currentPlaylist.length - 1;
        loadTrack(currentIndex);
        playMusic();
    });
}

// Play previous song from favorites
function playPrevFavorite() {
    if (favorites.length === 0) {
        // No favorites, play previous regular track
        currentIndex--;
        if (currentIndex < 0) currentIndex = currentPlaylist.length - 1;
        loadTrack(currentIndex);
        playMusic();
        return;
    }

    const currentSongId = currentPlaylist[currentIndex]?.id;
    const currentFavIndex = favorites.indexOf(currentSongId);

    // Try to find a favorite song that exists in current playlist (going backwards)
    for (let i = 0; i < favorites.length; i++) {
        let checkIndex = currentFavIndex - 1 - i;
        if (checkIndex < 0) checkIndex = favorites.length + checkIndex;
        checkIndex = ((checkIndex % favorites.length) + favorites.length) % favorites.length;

        let prevFavId = favorites[checkIndex];

        const prevIndex = currentPlaylist.findIndex(song => song.id === prevFavId);
        if (prevIndex !== -1) {
            currentIndex = prevIndex;
            loadTrack(currentIndex);
            playMusic();
            return;
        }
    }

    // No favorite found in current playlist, just go to last song
    currentIndex = currentPlaylist.length - 1;
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

// Keyboard Controls (Desktop)
document.addEventListener('keydown', (e) => {
    // Ignore if user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
        case 'Space':
            e.preventDefault(); // Prevent page scroll
            if (isPlaying) pauseMusic();
            else playMusic();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextTrack();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            prevTrack();
            break;
    }
});

audio.addEventListener('ended', () => {
    if (isRepeat === 'one') {
        // Repeat current song
        audio.currentTime = 0;
        playMusic();
    } else if (isRepeat === 'favorites') {
        // Play next favorite song
        playNextFavorite();
    } else {
        nextTrack();
    }
});

// Play next song from favorites
function playNextFavorite() {
    if (favorites.length === 0) {
        // No favorites, play next regular track (without calling nextTrack to avoid loop)
        currentIndex++;
        if (currentIndex >= currentPlaylist.length) currentIndex = 0;
        loadTrack(currentIndex);
        playMusic();
        return;
    }

    // Find current song in favorites
    const currentSongId = currentPlaylist[currentIndex]?.id;
    const currentFavIndex = favorites.indexOf(currentSongId);

    // Try to find a favorite song that exists in current playlist
    for (let i = 0; i < favorites.length; i++) {
        let checkIndex = (currentFavIndex + 1 + i) % favorites.length;
        let nextFavId = favorites[checkIndex];

        const nextIndex = currentPlaylist.findIndex(song => song.id === nextFavId);
        if (nextIndex !== -1) {
            currentIndex = nextIndex;
            loadTrack(currentIndex);
            playMusic();
            return;
        }
    }

    // No favorite found in current playlist, just go to first song
    currentIndex = 0;
    loadTrack(currentIndex);
    playMusic();
}

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

    // Save state (throttle to reduce localStorage writes)
    if (Math.floor(currentTime) % 2 === 0) {
        localStorage.setItem('babe_audio_time', currentTime);
    }
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
    const repeatBadge = document.getElementById('repeat-badge');

    // Cycle: off -> one -> favorites -> off
    if (isRepeat === 'off') {
        isRepeat = 'one';
        repeatBtn.classList.add('active');
        repeatBadge.innerHTML = '1';
        repeatBadge.classList.add('show');
        repeatBtn.title = 'Lặp lại 1 bài';
    } else if (isRepeat === 'one') {
        isRepeat = 'favorites';
        repeatBadge.innerHTML = '<i class="fas fa-heart"></i>';
        repeatBtn.title = 'Lặp danh sách yêu thích';
    } else {
        isRepeat = 'off';
        repeatBtn.classList.remove('active');
        repeatBadge.classList.remove('show');
        repeatBadge.innerHTML = '';
        repeatBtn.title = 'Lặp lại';
    }
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
    // Focus search when opening
    if (searchInput) {
        setTimeout(() => searchInput.focus(), 300);
    }
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('open');
    modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', () => {
    modal.classList.remove('open');
    modalOverlay.classList.remove('active');
});

// Search Logic
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

if (searchInput) {
    searchInput.addEventListener('input', throttle((e) => {
        const query = e.target.value;
        renderPlaylist(query);
    }, 200));
}

function highlightText(text, query) {
    if (!query) return text;

    // Normalize to find match positions regardless of accents
    // This is tricky for exact highlighting of original text if lengths differ.
    // Simple regex approach for Vietnamese:
    // Construct regex from query where each char matches all its accent forms.

    const accentMap = {
        'a': '[aàáạảãâầấậẩẫăằắặẳẵAÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]',
        'e': '[eèéẹẻẽêềếệểễEÈÉẸẺẼÊỀẾỆỂỄ]',
        'i': '[iìíịỉĩIÌÍỊỈĨ]',
        'o': '[oòóọỏõôồốộổỗơờớợởỡOÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]',
        'u': '[uùúụủũưừứựửữUÙÚỤỦŨƯỪỨỰỬỮ]',
        'y': '[yỳýỵỷỹYỲÝỴỶỸ]',
        'd': '[dđDĐ]'
    };

    // Remove accents from query for mapping
    const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let regexStr = '';
    for (let char of normalizedQuery) {
        // Escape special regex chars if any (though we normalized, but just in case)
        if (/[.*+?^${}()|[\]\\]/.test(char)) {
            regexStr += '\\' + char;
        } else {
            regexStr += accentMap[char] || char;
        }
    }

    try {
        const regex = new RegExp(`(${regexStr})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    } catch (e) {
        return text;
    }
}

function renderPlaylist(filterText = '') {
    playlistContainer.innerHTML = '';

    let itemsToDisplay = [];
    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (filterText) {
        // Filter Mode
        const query = normalize(filterText);
        itemsToDisplay = currentPlaylist.map((track, index) => ({ track, index }))
            .filter(({ track }) => normalize(track.title).includes(query));
    } else {
        // Default Mode: Current song first, then rest
        if (currentPlaylist[currentIndex]) {
            itemsToDisplay.push({ track: currentPlaylist[currentIndex], index: currentIndex });
        }
        currentPlaylist.forEach((track, index) => {
            if (index !== currentIndex) {
                itemsToDisplay.push({ track, index });
            }
        });
    }

    if (itemsToDisplay.length === 0) {
        playlistContainer.innerHTML = '<div style="text-align:center; color:var(--secondary-text); padding:20px;">Không tìm thấy bài hát nào 🥺</div>';
        return;
    }

    itemsToDisplay.forEach(({ track, index }) => {
        const item = document.createElement('div');
        item.classList.add('playlist-item');
        if (index === currentIndex) item.classList.add('active');

        const isFav = favorites.includes(track.id) ? '<i class="fas fa-heart" style="color:var(--accent-color); margin-right:8px;"></i>' : '';
        const nowPlaying = index === currentIndex ? '<i class="fas fa-volume-up" style="color:var(--accent-color); margin-right:8px;"></i>' : '';

        // Apply highlighting
        const titleHtml = filterText ? highlightText(track.title, filterText) : track.title;

        item.innerHTML = `
            ${nowPlaying}${isFav}
            <span>${titleHtml}</span>
        `;

        // Use the ORIGINAL index to load the correct track!
        item.addEventListener('click', () => {
            currentIndex = index;
            loadTrack(currentIndex);
            playMusic();
            modal.classList.remove('open');
            modalOverlay.classList.remove('active');

            // Clear search if we play a song? Optional. 
            // User might want to keep searching. 
        });

        playlistContainer.appendChild(item);
    });
}

function updateActivePlaylistItem() {
    // Re-render is simplest to ensuring styling update
    // Maintain search state? 
    // If user is searching, and song changes, we should probably keep the search results but update active class.
    // The renderPlaylist() takes args. If we call it without args, it resets.

    // Check if search has value
    const currentSearch = searchInput ? searchInput.value : '';
    renderPlaylist(currentSearch);
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

// --- SLEEP TIMER LOGIC ---

// Toggle dropdown
sleepBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sleepDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!sleepDropdown.contains(e.target) && e.target !== sleepBtn) {
        sleepDropdown.classList.remove('show');
    }
});

// Handle option selection
sleepOptions.forEach(option => {
    option.addEventListener('click', () => {
        const minutes = parseInt(option.dataset.minutes);
        setSleepTimer(minutes);
        sleepDropdown.classList.remove('show');
    });
});

function setSleepTimer(minutes) {
    // Clear existing timer
    if (sleepTimerId) {
        clearTimeout(sleepTimerId);
        sleepTimerId = null;
    }
    if (sleepUpdateInterval) {
        clearInterval(sleepUpdateInterval);
        sleepUpdateInterval = null;
    }

    if (minutes === 0) {
        // Cancel timer
        sleepEndTime = null;
        sleepBadge.classList.remove('show');
        sleepBtn.classList.remove('active');
        updateMediaSession(); // Update lock screen to remove timer info
        return;
    }

    // Set new timer
    sleepEndTime = Date.now() + (minutes * 60 * 1000);
    sleepBtn.classList.add('active');

    // Update badge immediately
    updateSleepBadge();
    sleepBadge.classList.add('show');

    // Update Media Session immediately with timer info
    updateMediaSession();

    // Update badge every second
    sleepUpdateInterval = setInterval(updateSleepBadge, 1000);

    // Set the actual timer to pause music
    sleepTimerId = setTimeout(() => {
        pauseMusic();
        sleepEndTime = null;
        sleepBadge.classList.remove('show');
        sleepBtn.classList.remove('active');
        clearInterval(sleepUpdateInterval);

        // Optional: Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('💤 Ngủ ngon nhé!', {
                body: 'Nhạc đã tắt theo hẹn giờ.',
                icon: 'assets/images/avatar.jpg'
            });
        }
    }, minutes * 60 * 1000);
}

function updateSleepBadge() {
    if (!sleepEndTime) return;

    const remaining = Math.max(0, sleepEndTime - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);

    if (remaining <= 0) {
        sleepBadge.textContent = '';
        sleepBadge.classList.remove('show');
        return;
    }

    sleepBadge.textContent = mins > 0 ? `${mins}p` : `${secs}s`;

    // Update Media Session with timer info (every 30 seconds to avoid too many updates)
    if (secs === 0 || secs === 30) {
        updateMediaSession();
    }
}

// --- MOBILE GESTURES ---
const diskContainer = document.querySelector('.disk-container');
let touchStartX = 0;
let touchStartY = 0;
let isDragging = false;
let isAnimating = false;
const SWIPE_THRESHOLD = 50;

if (diskContainer) {
    // 1. Swipe Gestures
    diskContainer.addEventListener('touchstart', (e) => {
        if (isAnimating) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isDragging = true;
        // Disable transition for direct tracking
        diskContainer.style.transition = 'none';
    }, { passive: true });

    diskContainer.addEventListener('touchmove', (e) => {
        if (isAnimating || !isDragging) return;
        const touchX = e.changedTouches[0].screenX;
        const touchY = e.changedTouches[0].screenY;
        const diffX = touchX - touchStartX;
        const diffY = touchY - touchStartY;

        // Ignore if scrolling vertically
        if (Math.abs(diffY) > Math.abs(diffX)) return;

        diskContainer.style.transform = `translateX(${diffX}px)`;
    }, { passive: true });

    diskContainer.addEventListener('touchend', (e) => {
        if (isAnimating || !isDragging) return;
        isDragging = false;

        const touchX = e.changedTouches[0].screenX;
        const diffX = touchX - touchStartX;

        diskContainer.style.transition = 'transform 0.3s ease-out';

        if (Math.abs(diffX) > SWIPE_THRESHOLD) {
            isAnimating = true; // Lock interactions
            if (diffX > 0) {
                // Swipe Right (Drag to Right) -> Next Track
                diskContainer.style.transform = `translateX(100vw)`;
                setTimeout(() => {
                    nextTrack();
                    resetDiskPosition('left');
                }, 300);
            } else {
                // Swipe Left (Drag to Left) -> Prev Track
                diskContainer.style.transform = `translateX(-100vw)`;
                setTimeout(() => {
                    prevTrack();
                    resetDiskPosition('right');
                }, 300);
            }
        } else {
            // Rebound (not a swipe)
            diskContainer.style.transform = `translateX(0)`;
        }
    });

    // 2. Click/Tap to Toggle Play/Pause
    diskContainer.addEventListener('click', (e) => {
        if (isAnimating) return;
        // Only toggle if clicked (browser suppresses click if dragged significantly)
        if (isPlaying) pauseMusic();
        else playMusic();
    });
}

function resetDiskPosition(fromSide) {
    // Reset position instantly off-screen
    diskContainer.style.transition = 'none';
    if (fromSide === 'left') {
        diskContainer.style.transform = `translateX(-100vw)`;
    } else {
        diskContainer.style.transform = `translateX(100vw)`;
    }

    // Force reflow
    void diskContainer.offsetWidth;

    // Animate back to center
    diskContainer.style.transition = 'transform 0.5s ease-out';
    diskContainer.style.transform = `translateX(0)`;

    // Unlock after animation
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

// BOOT
init();

// Register Service Worker for PWA
// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then((registration) => {
            console.log('Service Worker Registered');

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New update available
                        console.log('New update available!');
                    }
                });
            });
        })
        .catch((error) => console.log('Service Worker Registration Failed:', error));

    // Auto-reload when new SW takes control
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}
