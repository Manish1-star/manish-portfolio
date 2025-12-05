// 1. Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check local storage or system preference on load
if (localStorage.getItem('theme') === 'dark' || 
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    if (html.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// 2. Mobile Menu Toggle
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // Change icon based on state
    const icon = menuBtn.querySelector('i');
    if(mobileMenu.classList.contains('hidden')){
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.querySelector('i').classList.remove('fa-times');
        menuBtn.querySelector('i').classList.add('fa-bars');
    });
});

// 3. Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
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
// Trigger once on load
revealOnScroll();
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
        // Step 1: Find Latitude & Longitude of the City
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            display.innerText = "City not found! Try again.";
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Step 2: Get Weather for that Location
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const temp = weatherData.current_weather.temperature;
        
        // Show Result
        display.innerHTML = `${name}, ${country}: <span class="text-blue-500 font-bold">${temp}°C</span>`;

    } catch (error) {
        console.error(error);
        display.innerText = "Error fetching data.";
    }
}

// Load default weather (Arghakhanchi) on startup
window.onload = function() {
    // You can keep default typing effect here if needed
    fetch('https://api.open-meteo.com/v1/forecast?latitude=27.96&longitude=83.18&current_weather=true')
    .then(res => res.json())
    .then(data => {
        document.getElementById('temp-display').innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`;
    });
};
