// 1. BASIC SITE FUNCTIONALITY
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Force Dark Mode Default
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// Mobile Menu Logic
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
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
}

// 2. BANK MODAL LOGIC (यो नभएर बैंक नखुलेको हो)
function openBankModal() {
    const modal = document.getElementById('bank-modal');
    if(modal) modal.classList.remove('hidden');
}

function closeBankModal() {
    const modal = document.getElementById('bank-modal');
    if(modal) modal.classList.add('hidden');
}

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
        bgMusic.play().then(() => {
            musicBtn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
            musicBtn.classList.remove('animate-bounce');
            showToast("Music Playing 🎵");
        }).catch(e => alert("Please tap on screen first!"));
    }
    isPlaying = !isPlaying;
}

// 4. SCROLL TO TOP & ANIMATIONS
const scrollTopBtn = document.getElementById('scrollTopBtn');

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const revealOnScroll = () => {
    // Scroll Button Visibility
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

    // Scroll Reveal
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
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// 5. TOAST NOTIFICATION
function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    
    const toast = document.createElement('div');
    toast.className = "bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg shadow-xl border-l-4 border-blue-500 flex items-center gap-2 transform transition-all duration-300 translate-x-full";
    toast.innerHTML = `<i class="fas fa-check-circle text-blue-500"></i> <span class="font-medium text-sm">${message}</span>`;
    
    container.appendChild(toast);
    setTimeout(() => toast.classList.remove('translate-x-full'), 10);
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 6. TYPING ANIMATION
const typingText = document.getElementById('typing-text');
const words = ["Web Developer", "Video Editor", "AI Enthusiast", "Content Creator"];
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

// 7. COUNTERS, PARTICLES & WEATHER (On Load)
window.onload = function() {
    // Weather
    const display = document.getElementById('temp-display');
    if(display) {
        fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538&current_weather=true')
        .then(res => res.json())
        .then(data => {
            display.innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`;
        })
        .catch(() => display.innerText = "Nepal: --°C");
    }

    // Live Time
    setInterval(() => {
        const timeDisplay = document.getElementById('live-time');
        if(timeDisplay) timeDisplay.innerText = new Date().toLocaleTimeString();
    }, 1000);

    // Battery
    if(navigator.getBattery) {
        navigator.getBattery().then(function(battery) {
            const updateBattery = () => {
                const batDisplay = document.getElementById('battery-status');
                if(batDisplay) batDisplay.innerText = Math.round(battery.level * 100) + "%";
            };
            updateBattery();
        });
    }

    // Counters
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / 200;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });

    // Particles JS
    if(window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 50 },
                "color": { "value": "#3b82f6" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5 },
                "size": { "value": 3 },
                "line_linked": { "enable": true, "distance": 150, "color": "#3b82f6", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 2 }
            },
            "interactivity": {
                "events": { "onhover": { "enable": true, "mode": "grab" } },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } } }
            },
            "retina_detect": true
        });
    }
    
    // Filter Buttons
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
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
};

// 8. MAGIC CURSOR
const cursor = document.getElementById('cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        if(window.innerWidth > 768) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });
    document.querySelectorAll('.hover-trigger').forEach(item => {
        item.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}
