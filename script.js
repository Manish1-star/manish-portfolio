
// ==========================================
// 1. BASIC SITE FUNCTIONALITY
// ==========================================

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Dark Mode Logic
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// Mobile Menu
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if(menuBtn) {
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

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTopBtn');

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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
    const elementVisible = 50;

    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ==========================================
// 2. BLOG DATA & LOADER (FIXED)
// ==========================================
const myBlogs = [
    {
        "image": "profile.jpg",
        "category": "Technology",
        "date": "Dec 12, 2025",
        "title": "New Magic Features Added! ✨",
        "desc": "I have updated my portfolio with 3D Tilt, Magic Cursor, and Dark Mode. It feels super professional now.",
        "link": "#contact"
    },
    {
        "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        "category": "Coding",
        "date": "Dec 10, 2025",
        "title": "Starting React JS Journey",
        "desc": "I have started learning React JS to build even more powerful applications. Stay tuned for updates!",
        "link": "#projects"
    },
    {
        "image": "profile.jpg",
        "category": "AI Project",
        "date": "Dec 12, 2025",
        "title": "Built Advanced AI Voice Translator 🎙️",
        "desc": "I created a powerful translation tool using JavaScript. It features real-time voice translation and OCR.",
        "link": "#projects"
    },
    {
        "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        "category": "AI Safety",
        "date": "Dec 12, 2025",
        "title": "How to Use AI Safely 🛡️",
        "desc": "AI is powerful but needs care. Never share passwords or API keys. Click to read the full guide.",
        "link": "ai-guide.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop", 
        "category": "Education",
        "date": "Dec 12, 2025",
        "title": "What is Biology? The Science of Life 🧬",
        "desc": "Biology is the scientific study of life. It explores how living things function, grow, interact, and evolve.",
        "link": "biology.html"
    },
    {
    "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
        "category": "Science",
        "date": "Dec 13, 2025",
        "title": "Chemistry: The Central Science 🧪",
        "desc": "Chemistry connects physics with biology. Explore how atoms, molecules, and reactions shape our world and daily lives.",
        "link": "chemistry.html"
    },
function loadBlogsDirectly() {
    const container = document.getElementById('blog-container');
    if (!container) return; // Stop if container not found

    container.innerHTML = myBlogs.map(blog => `
        <div class="bg-white dark:bg-slate-700 rounded-2xl shadow-lg overflow-hidden reveal hover-trigger" data-tilt>
            <img src="${blog.image}" alt="${blog.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <span class="text-blue-500 text-xs font-bold uppercase">${blog.category}</span>
                <span class="text-gray-400 text-xs ml-2">${blog.date}</span>
                
                <h3 class="text-xl font-bold mt-2 mb-2">${blog.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">${blog.desc}</p>
                
                <a href="${blog.link}" class="text-blue-500 font-semibold text-sm hover:underline">Read More →</a>
            </div>
        </div>
    `).join('');
    
    // Re-init Tilt for new elements
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), { max: 15, speed: 400 });
    }
}

// ==========================================
// 3. PAGE LOAD EVENTS (Weather, Filter, Blogs)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    // 1. Load Blogs Immediately
    loadBlogsDirectly();

    // 2. Load Project Filter
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if(allBtn) allBtn.click();
    
    // 3. Typing Effect
    typeEffect();
});

window.onload = function() {
    // Weather
    fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538¤t_weather=true')
    .then(res => res.json())
    .then(data => {
        const display = document.getElementById('temp-display');
        if(display) display.innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`;
    });

    // Time
    setInterval(() => {
        const t = document.getElementById('live-time');
        if(t) t.innerText = new Date().toLocaleTimeString();
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
    document.querySelectorAll('[data-target]').forEach(counter => {
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

    // Particles
    if(window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 30 },
                "color": { "value": "#3b82f6" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5 },
                "size": { "value": 3 },
                "line_linked": { "enable": true, "distance": 150, "color": "#3b82f6", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 2 }
            },
            "interactivity": { "events": { "onhover": { "enable": true, "mode": "grab" } } },
            "retina_detect": true
        });
    }
};

// ==========================================
// 4. MUSIC PLAYER
// ==========================================
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
        }).catch(() => alert("Please tap anywhere on the page first!"));
    }
    isPlaying = !isPlaying;
}

// ==========================================
// 5. TYPING ANIMATION
// ==========================================
const typingText = document.getElementById('typing-text');
const words = ["Web Developer", "Video Editor", "AI Enthusiast", "Creative Thinker"];
let wordIndex = 0; let charIndex = 0; let isDeleting = false;

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
        typeSpeed = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}

// ==========================================
// 6. MAGIC CURSOR & TOAST & MODAL
// ==========================================
const cursor = document.getElementById('cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        if(window.innerWidth > 768) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });
    document.querySelectorAll('.hover-trigger, a, button').forEach(item => {
        item.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

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

function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }

// Filter Buttons Logic
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
