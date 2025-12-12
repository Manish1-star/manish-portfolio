// 1. BASIC SITE FUNCTIONALITY
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = menuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
});

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

const scrollTopBtn = document.getElementById('scrollTopBtn');

const revealOnScroll = () => {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        if(scrollTopBtn) {
            scrollTopBtn.classList.remove('hidden');
            scrollTopBtn.classList.add('flex');
        }
    } else {
        if(scrollTopBtn) {
            scrollTopBtn.classList.add('hidden');
            scrollTopBtn.classList.remove('flex');
        }
    }

    const revealElements = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// 2. TYPING ANIMATION
const typingText = document.getElementById('typing-text');
const words = ["Web Developer", "Video Editor", "AI Enthusiast", "Creative Thinker"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingText) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex--);
    } else {
        typingText.textContent = currentWord.substring(0, charIndex++);
    }

    let typeSpeed = isDeleting ? 100 : 200;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; 
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}
document.addEventListener('DOMContentLoaded', typeEffect);

// 3. MUSIC PLAYER
let isPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

function toggleMusic() {
    if (!bgMusic) return;

    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerHTML = '<i class="fas fa-music text-xl"></i>';
        musicBtn.classList.add('animate-bounce');
        showToast("Music Paused ⏸️");
    } else {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                musicBtn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
                musicBtn.classList.remove('animate-bounce');
                showToast("Music Playing 🎵");
            })
            .catch(error => {
                alert("Please tap anywhere on the page first!");
            });
        }
    }
    isPlaying = !isPlaying;
}

// 4. WEATHER & TIME
async function getWeather() {
    const display = document.getElementById('temp-display');
    if(!display) return;
    display.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
        const display = document.getElementById('temp-display');
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538&current_weather=true');
        const data = await response.json();
        if(display) display.innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`;
    } catch (error) {
        if(display) display.innerText = "Nepal: --°C";
    }
}

function updateTime() {
    const timeDisplay = document.getElementById('live-time');
    if(timeDisplay) {
        const now = new Date();
        timeDisplay.innerText = now.toLocaleTimeString();
    }
}
setInterval(updateTime, 1000);

navigator.getBattery().then(function(battery) {
    const updateBattery = () => {
        document.getElementById('battery-status').innerText = Math.round(battery.level * 100) + "%";
    };
    updateBattery();
    battery.addEventListener('levelchange', updateBattery);
});

// 5. TOAST NOTIFICATION (NEW)
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = "bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg shadow-xl border-l-4 border-blue-500 flex items-center gap-2 transform transition-all duration-300 translate-x-full";
    toast.innerHTML = `<i class="fas fa-check-circle text-blue-500"></i> <span class="font-medium text-sm">${message}</span>`;
    
    container.appendChild(toast);
    
    // Animate In
    setTimeout(() => toast.classList.remove('translate-x-full'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 6. COUNTER ANIMATION (NEW)
const counters = document.querySelectorAll('[data-target]');
const speed = 200;

const startCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });
};

window.onload = function() {
    getWeather();
    
    // Start Counters when loaded
    startCounters();

    // 7. PARTICLES BACKGROUND (NEW)
    if(window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 50 },
                "color": { "value": "#3b82f6" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5 },
                "size": { "value": 3 },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#3b82f6",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": { "enable": true, "speed": 2 }
            },
            "interactivity": {
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" }
                }
            },
            "retina_detect": true
        });
    }

    // Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('bg-white', 'dark:bg-slate-800');
            });
            btn.classList.remove('bg-white', 'dark:bg-slate-800');
            btn.classList.add('bg-blue-600', 'text-white');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hidden');
                    setTimeout(() => card.classList.add('opacity-100', 'scale-100'), 50);
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('opacity-100', 'scale-100');
                }
            });
        });
    });
};

// 8. CUSTOM CURSOR (NEW)
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
    if(window.innerWidth > 768) { // Only on desktop
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Cursor Hover Effect
document.querySelectorAll('.hover-trigger').forEach(item => {
    item.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// Bank Modal
function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }
