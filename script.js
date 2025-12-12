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

// 2. SCROLL REVEAL & SCROLL TO TOP
const scrollTopBtn = document.getElementById('scrollTopBtn');

const revealOnScroll = () => {
    // Show/Hide Scroll Button
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

    // Scroll Reveal Elements
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

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Trigger once on load

// 3. PROJECT FILTER LOGIC
// Ensure 'All' is selected by default on load
window.addEventListener('load', () => {
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if(allBtn) allBtn.click();
});

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => {
            b.classList.remove('bg-blue-600', 'text-white');
            b.classList.add('bg-white', 'dark:bg-slate-800');
        });
        // Add active class to clicked
        btn.classList.remove('bg-white', 'dark:bg-slate-800');
        btn.classList.add('bg-blue-600', 'text-white');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.classList.remove('opacity-0', 'scale-95');
                    card.classList.add('opacity-100', 'scale-100');
                }, 10);
            } else {
                card.classList.add('hidden', 'opacity-0', 'scale-95');
                card.classList.remove('opacity-100', 'scale-100');
            }
        });
    });
});

// 4. MUSIC PLAYER
let isPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

function toggleMusic() {
    if (!bgMusic) return;

    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerHTML = '<i class="fas fa-music text-xl"></i>';
        musicBtn.classList.add('animate-bounce');
        if(typeof showToast === "function") showToast("Music Paused ⏸️");
    } else {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                musicBtn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
                musicBtn.classList.remove('animate-bounce');
                if(typeof showToast === "function") showToast("Music Playing 🎵");
            })
            .catch(error => {
                alert("Please tap anywhere on the page first to enable audio!");
            });
        }
    }
    isPlaying = !isPlaying;
}

// 5. TOAST NOTIFICATION
function showToast(message) {
    const container = document.getElementById('toast-container');
    if(!container) return;
    
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

// 6. TYPING ANIMATION
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

// 7. UTILS: WEATHER, TIME, BATTERY & EXTRAS
window.onload = function() {
    // Weather Fetch (Arghakhanchi)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538&current_weather=true')
    .then(res => res.json())
    .then(data => {
        const display = document.getElementById('temp-display');
        if(display) display.innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`;
    })
    .catch(() => {
        const display = document.getElementById('temp-display');
        if(display) display.innerText = "Nepal: --°C";
    });

    // Live Time
    setInterval(() => {
        const timeDisplay = document.getElementById('live-time');
        if(timeDisplay) timeDisplay.innerText = new Date().toLocaleTimeString();
    }, 1000);

    // Battery Status
    if(navigator.getBattery) {
        navigator.getBattery().then(function(battery) {
            const updateBattery = () => {
                const batDisplay = document.getElementById('battery-status');
                if(batDisplay) batDisplay.innerText = Math.round(battery.level * 100) + "%";
            };
            updateBattery();
            battery.addEventListener('levelchange', updateBattery);
        });
    }

    // Number Counters Animation
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / 200; // Speed of counting

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });

    // Particles JS (Background Effect)
    if(window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 40 }, // Optimized for mobile
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
                "events": { "onhover": { "enable": true, "mode": "grab" } },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } } }
            },
            "retina_detect": true
        });
    }
    
    // Ensure project filter runs on load
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if(allBtn) allBtn.click();
};

// 8. MAGIC CURSOR
const cursor = document.getElementById('cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        // Only move cursor on desktop to save mobile performance
        if(window.innerWidth > 768) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    // Add hover effect to interactive elements
    const hoverElements = document.querySelectorAll('.hover-trigger, a, button');
    hoverElements.forEach(item => {
        item.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        item.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
}

// 9. BANK MODAL LOGIC
function openBankModal() {
    const modal = document.getElementById('bank-modal');
    if(modal) modal.classList.remove('hidden');
}

function closeBankModal() {
    const modal = document.getElementById('bank-modal');
    if(modal) modal.classList.add('hidden');
}
// ==========================================
// 10. DYNAMIC BLOG LOADER (JSON)
// ==========================================
async function loadBlogs() {
    const container = document.getElementById('blog-container');
    if (!container) return;

    try {
        const response = await fetch('blogs.json');
        const blogs = await response.json();

        container.innerHTML = blogs.map(blog => `
            <div class="bg-white dark:bg-slate-700 rounded-2xl shadow-lg overflow-hidden reveal hover-trigger" data-tilt>
                <img src="${blog.image}" alt="${blog.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <span class="text-blue-500 text-xs font-bold uppercase">${blog.category}</span>
                    <span class="text-gray-400 text-xs ml-2">${blog.date}</span>
                    
                    <h3 class="text-xl font-bold mt-2 mb-2">${blog.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">${blog.desc}</p>
                    
                    <a href="${blog.link}" class="text-blue-500 font-semibold text-sm hover:underline">Read More &rarr;</a>
                </div>
            </div>
        `).join('');

        // Re-initialize 3D Tilt for new elements
        if (window.VanillaTilt) {
            VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.3,
            });
        }

    } catch (error) {
        console.error("Error loading blogs:", error);
        container.innerHTML = `<p class="text-center text-gray-500 col-span-3">No blogs found currently.</p>`;
    }
}

// Load blogs when page loads
window.addEventListener('load', loadBlogs);
