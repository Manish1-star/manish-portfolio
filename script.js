// 1. SYSTEM INIT & PRELOADER
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Force Dark Mode
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
            document.body.classList.remove('loading');
            const profileWrapper = document.getElementById('profile-wrapper');
            if(profileWrapper) profileWrapper.classList.add('profile-entry');
        }, 500);
    }, 1500);
    if(typeof loadBooks === 'function') loadBooks('must_read');
});

// Force remove preloader backup
setTimeout(() => { 
    const p = document.getElementById('preloader'); 
    if(p) p.style.display = 'none'; 
    document.body.classList.remove('loading'); 
}, 5000);

// ==========================================
// 2. NEW: THEME COLOR PICKER
// ==========================================
function changeTheme(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    // Update dynamic classes if needed, but CSS variable handles most
    document.querySelectorAll('.bg-blue-600').forEach(el => el.style.backgroundColor = color);
    document.querySelectorAll('.text-blue-500').forEach(el => el.style.color = color);
    document.querySelectorAll('.text-blue-600').forEach(el => el.style.color = color);
}

// ==========================================
// 3. NEW: CONFETTI EFFECT
// ==========================================
function fireConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// ==========================================
// 4. BLOG DATA
// ==========================================
const myBlogs = [
    {
        "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop", 
        "category": "Web Development",
        "date": "Dec 14, 2025",
        "title": "How I Built My Portfolio Website 💻",
        "desc": "From coding in HTML/CSS to deploying on GitHub Pages.",
        "link": "building-portfolio.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop", 
        "category": "Education",
        "date": "Dec 14, 2025",
        "title": "Man: The Complex Masterpiece 🧍",
        "desc": "What defines a man? Explore biological and social evolution.",
        "link": "man.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
        "category": "Science",
        "date": "Dec 13, 2025",
        "title": "Chemistry: The Central Science 🧪",
        "desc": "Chemistry connects physics with biology.",
        "link": "chemistry.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop", 
        "category": "Education",
        "date": "Dec 12, 2025",
        "title": "What is Biology? 🧬",
        "desc": "Biology is the scientific study of life.",
        "link": "biology.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        "category": "AI Safety",
        "date": "Dec 12, 2025",
        "title": "How to Use AI Safely 🛡️",
        "desc": "Never share passwords or API keys.",
        "link": "ai-guide.html"
    },
    {
        "image": "profile.jpg",
        "category": "Tech",
        "date": "Dec 12, 2025",
        "title": "New Features Added! ✨",
        "desc": "Updated portfolio with Library and 3D Tilt.",
        "link": "#"
    }
];

const blogCont = document.getElementById('blog-container');
if(blogCont) {
    blogCont.innerHTML = myBlogs.map(b => `
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-blue-500 transition cursor-pointer reveal hover-trigger" data-tilt>
            <div class="h-40 overflow-hidden rounded-lg mb-4">
                <img src="${b.image}" class="w-full h-full object-cover hover:scale-110 transition duration-500">
            </div>
            <span class="text-xs font-bold text-blue-500 uppercase">${b.category}</span>
            <h3 class="text-xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">${b.title}</h3>
            <p class="text-sm text-gray-500 mb-4">${b.desc}</p>
            <a href="${b.link}" class="text-blue-500 text-xs font-bold inline-block">READ MORE</a>
        </div>
    `).join('');
}

// ... (KEEP ALL LIBRARY, MUSIC, UTILS CODE HERE - Same as previous version) ...
// (Due to length limit, I assume you have the rest of library logic. If not, ask me to paste full script again)

// 5. NEW: AI NARRATOR
let isReading = false;
function readAboutMe() {
    const text = document.getElementById('about-text').innerText;
    const btn = document.getElementById('read-btn');
    if (isReading) { window.speechSynthesis.cancel(); btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to my Story'; isReading = false; }
    else {
        window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices(); const googleVoice = voices.find(v => v.name.includes("Google"));
        if(googleVoice) utterance.voice = googleVoice;
        utterance.onend = () => { btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to my Story'; isReading = false; };
        window.speechSynthesis.speak(utterance); btn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop Listening'; isReading = true;
    }
}
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
