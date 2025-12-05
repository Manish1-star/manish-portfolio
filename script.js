// 1. Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

if (localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// 2. Mobile Menu
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = menuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// 3. Scroll Reveal Animation & SCROLL TO TOP LOGIC
const scrollTopBtn = document.getElementById('scrollTopBtn');

const revealOnScroll = () => {
    // Show/Hide Scroll to Top Button
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        scrollTopBtn.classList.remove('hidden');
        scrollTopBtn.classList.add('flex');
    } else {
        scrollTopBtn.classList.add('hidden');
        scrollTopBtn.classList.remove('flex');
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

// Function to scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// 4. Typing Animation
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

// 5. Music Player Logic
let isPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

function toggleMusic() {
    if (!bgMusic) return;

    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        musicBtn.classList.add('animate-bounce');
    } else {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
                musicBtn.classList.remove('animate-bounce');
            })
            .catch(error => {
                alert("Please tap anywhere on the page first!");
            });
        }
    }
    isPlaying = !isPlaying;
}

// 6. Advanced Global Weather Search
async function getWeather() {
    const cityInput = document.getElementById('city-input').value.trim();
    const display = document.getElementById('temp-display');

    if (!cityInput) {
        alert("Please enter a city name!");
        return;
    }

    display.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            display.innerText = "City not found!";
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();
        const temp = weatherData.current_weather.temperature;
        display.innerHTML = `${name}, ${country}: <span class="text-blue-500 font-bold">${temp}°C</span>`;

    } catch (error) {
        display.innerText = "Error fetching data.";
    }
}

window.onload = function() {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538&current_weather=true')
    .then(res => res.json())
    .then(data => {
        const display = document.getElementById('temp-display');
        if(display) display.innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`;
    });
};
