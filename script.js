// ==========================================
// 1. BASIC SITE FUNCTIONALITY
// ==========================================

// Dark Mode Toggle
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

// Mobile Menu
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

// Scroll Animations & Scroll To Top
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

    // Reveal Elements
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

// ==========================================
// 2. TYPING ANIMATION
// ==========================================
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

// ==========================================
// 3. MANISH AI ASSISTANT (Gemini)
// ==========================================

// ✅ YOUR API KEY IS SET HERE
const API_KEY = "AIzaSyBFGoBYP_00nJRkPcC41bQJu_tVMaKi4os"; 

const chatWindow = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatBtn = document.getElementById('ai-chat-btn');
let selectedImage = null;

function toggleChat() {
    if (chatWindow.classList.contains('hidden')) {
        chatWindow.classList.remove('hidden');
        setTimeout(() => {
            chatWindow.classList.remove('scale-95', 'opacity-0');
            chatWindow.classList.add('scale-100', 'opacity-100');
        }, 10);
        if(chatBtn) chatBtn.classList.remove('animate-pulse');
    } else {
        chatWindow.classList.remove('scale-100', 'opacity-100');
        chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            chatWindow.classList.add('hidden');
        }, 300);
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

function handleImageUpload(input) {
    const file = input.files[0];
    if (file) {
        if (file.size > 4 * 1024 * 1024) {
            alert("Image too large! Please upload under 4MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            selectedImage = e.target.result.split(',')[1];
            document.getElementById('image-preview').src = e.target.result;
            document.getElementById('image-preview-container').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function clearImage() {
    selectedImage = null;
    document.getElementById('image-upload').value = '';
    document.getElementById('image-preview-container').classList.add('hidden');
}

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = "flex items-start gap-2 " + (sender === 'user' ? "justify-end" : "");
    
    const icon = sender === 'user' 
        ? '<div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm">👤</div>'
        : '<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">🤖</div>';

    const bubbleStyle = sender === 'user' 
        ? 'bg-blue-600 text-white rounded-tr-none' 
        : 'bg-white dark:bg-slate-700 rounded-tl-none border border-gray-100 dark:border-slate-600';

    div.innerHTML = `
        ${sender === 'ai' ? icon : ''}
        <div class="${bubbleStyle} p-3 rounded-lg shadow-sm text-sm max-w-[85%] leading-relaxed">
            ${text}
        </div>
        ${sender === 'user' ? icon : ''}
    `;
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text && !selectedImage) return;

    addMessage(text || "📷 [Sent an Image]", 'user');
    userInput.value = '';
    
    const loadingId = "loading-" + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = "flex items-center gap-2 ml-10 text-xs text-gray-500 dark:text-gray-400";
    loadingDiv.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Thinking...';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        let requestBody = {
            contents: [{
                parts: [{ text: text }]
            }]
        };

        if (selectedImage) {
            requestBody.contents[0].parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: selectedImage
                }
            });
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        document.getElementById(loadingId).remove();

        if (data.candidates && data.candidates[0].content) {
            let aiResponse = data.candidates[0].content.parts[0].text;
            aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '<b class="text-blue-600 dark:text-blue-400">$1</b>').replace(/\n/g, '<br>');
            addMessage(aiResponse, 'ai');
        } else {
            addMessage("Sorry, I am having trouble connecting. Please check your internet.", 'ai');
        }

    } catch (error) {
        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();
        addMessage("Error connecting to AI.", 'ai');
    }
    clearImage();
}

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
                alert("Please tap anywhere on the page first to enable music!");
            });
        }
    }
    isPlaying = !isPlaying;
}

// ==========================================
// 5. WEATHER WIDGET (Global Search)
// ==========================================
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

// Default Arghakhanchi Weather
window.onload = function() {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538&current_weather=true')
    .then(res => res.json())
    .then(data => {
        const display = document.getElementById('temp-display');
        if(display) display.innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`;
    });
};
