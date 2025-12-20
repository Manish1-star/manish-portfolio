// 1. SYSTEM INIT & PRELOADER FIX
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

window.addEventListener('load', () => {
    // Hide Preloader & Show Profile
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
            document.body.classList.remove('loading');
            document.getElementById('profile-wrapper').classList.add('profile-entry');
        }, 500);
    }, 1500);

    // Initial Load
    loadBlogsDirectly();
    loadMassiveLibrary();
});

// ==========================================
// 2. STATS (TIME, BATTERY, WEATHER) - RESTORED
// ==========================================
function updateLiveStats() {
    const now = new Date();
    const timeEl = document.getElementById('live-time');
    if(timeEl) timeEl.innerText = now.toLocaleTimeString();
}
setInterval(updateLiveStats, 1000);

if(navigator.getBattery) {
    navigator.getBattery().then(bat => {
        const batEl = document.getElementById('battery-status');
        if(batEl) batEl.innerText = Math.round(bat.level * 100) + "%";
    });
}

const tempEl = document.getElementById('temp-display');
if(tempEl) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538&current_weather=true')
    .then(res => res.json())
    .then(data => { tempEl.innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`; })
    .catch(() => tempEl.innerText = "Offline");
}


// ==========================================
// 3. MASSIVE LIBRARY (50+ BOOKS)
// ==========================================
const massiveLibrary = [
    // Tech & AI
    { t: "Clean Code", a: "Robert C. Martin", c: "https://covers.openlibrary.org/b/id/8303028-L.jpg" },
    { t: "The Pragmatic Programmer", a: "Andrew Hunt", c: "https://covers.openlibrary.org/b/id/10578643-L.jpg" },
    { t: "JavaScript: The Good Parts", a: "Douglas Crockford", c: "https://covers.openlibrary.org/b/id/8292671-L.jpg" },
    { t: "Introduction to Algorithms", a: "Thomas Cormen", c: "https://covers.openlibrary.org/b/id/7238641-L.jpg" },
    { t: "Life 3.0", a: "Max Tegmark", c: "https://covers.openlibrary.org/b/id/8381831-L.jpg" },
    { t: "Superintelligence", a: "Nick Bostrom", c: "https://covers.openlibrary.org/b/id/8303028-L.jpg" },
    { t: "Deep Learning", a: "Ian Goodfellow", c: "https://covers.openlibrary.org/b/id/8390886-L.jpg" },
    { t: "Artificial Intelligence", a: "Stuart Russell", c: "https://covers.openlibrary.org/b/id/8243657-L.jpg" },
    // Self Help & Business
    { t: "Atomic Habits", a: "James Clear", c: "https://covers.openlibrary.org/b/id/8563855-L.jpg" },
    { t: "Rich Dad Poor Dad", a: "Robert Kiyosaki", c: "https://covers.openlibrary.org/b/id/8344686-L.jpg" },
    { t: "The Psychology of Money", a: "Morgan Housel", c: "https://covers.openlibrary.org/b/id/10542385-L.jpg" },
    { t: "Think and Grow Rich", a: "Napoleon Hill", c: "https://covers.openlibrary.org/b/id/8357636-L.jpg" },
    { t: "Zero to One", a: "Peter Thiel", c: "https://covers.openlibrary.org/b/id/8250239-L.jpg" },
    { t: "Elon Musk", a: "Ashlee Vance", c: "https://covers.openlibrary.org/b/id/7900762-L.jpg" },
    { t: "Steve Jobs", a: "Walter Isaacson", c: "https://covers.openlibrary.org/b/id/7318536-L.jpg" },
    { t: "Shoe Dog", a: "Phil Knight", c: "https://covers.openlibrary.org/b/id/8389330-L.jpg" },
    // Science & History
    { t: "Sapiens", a: "Yuval Noah Harari", c: "https://covers.openlibrary.org/b/id/8372332-L.jpg" },
    { t: "A Brief History of Time", a: "Stephen Hawking", c: "https://covers.openlibrary.org/b/id/8883506-L.jpg" },
    { t: "Cosmos", a: "Carl Sagan", c: "https://covers.openlibrary.org/b/id/8231267-L.jpg" },
    { t: "The Gene", a: "Siddhartha Mukherjee", c: "https://covers.openlibrary.org/b/id/8364722-L.jpg" },
    // Fiction
    { t: "The Alchemist", a: "Paulo Coelho", c: "https://covers.openlibrary.org/b/id/12776378-L.jpg" },
    { t: "1984", a: "George Orwell", c: "https://covers.openlibrary.org/b/id/7222246-L.jpg" },
    { t: "To Kill a Mockingbird", a: "Harper Lee", c: "https://covers.openlibrary.org/b/id/8225266-L.jpg" },
    { t: "The Great Gatsby", a: "F. Scott Fitzgerald", c: "https://covers.openlibrary.org/b/id/8440785-L.jpg" }
    // ... (You can add more by copying lines)
];

function loadMassiveLibrary() {
    const container = document.getElementById('book-container');
    if(!container) return;

    // Shuffle and display
    const shuffled = massiveLibrary.sort(() => 0.5 - Math.random());
    
    container.innerHTML = shuffled.map(book => `
        <div class="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 rounded-xl cursor-pointer hover:-translate-y-2 transition shadow-lg group hover:border-blue-500">
            <div class="h-48 overflow-hidden rounded-lg mb-4 relative bg-gray-200">
                <img src="${book.c}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            </div>
            <h3 class="font-bold text-sm truncate text-gray-900 dark:text-white">${book.t}</h3>
            <p class="text-xs text-gray-500">${book.a}</p>
        </div>
    `).join('');
}


// ==========================================
// 4. BLOG DATA
// ==========================================
const myBlogs = [
    {
        "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", 
        "category": "Future Tech",
        "date": "Dec 20, 2025",
        "title": "Chatbots are Dead? Enter AI Agents 🤖",
        "desc": "Why ChatGPT is just the beginning. Learn about Autonomous AI Agents like Devin and AutoGPT that do the work for you.",
        "link": "ai-agents.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1676299081847-824916de030a?q=80&w=1000&auto=format&fit=crop", 
        "category": "Tech Reviews",
        "date": "Dec 19, 2025",
        "title": "Top 5 AI Tools You Must Try! 📺",
        "desc": "Boost your productivity with these amazing AI tools. Watch the full video review and guide inside.",
        "link": "ai-tools.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop", 
        "category": "Career Guide",
        "date": "Dec 18, 2025",
        "title": "How to Learn Coding in Nepal? 💻",
        "desc": "Want to build a career in programming? Which language to choose? How to get a job? Here is the complete roadmap.",
        "link": "coding-guide.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop", 
        "category": "Tech & Future",
        "date": "Dec 16, 2025",
        "title": "AI Revolution: अवसर कि चुनौती? 🤖",
        "desc": "कृत्रिम बुद्धिमत्ता (AI) ले हाम्रो जीवन कसरी बदल्दैछ? के यसले मानिसको जागिर खोस्ला वा नयाँ युगको सुरुवात गर्ला? विस्तृत जानकारी पढ्नुहोस्।",
        "link": "ai-revolution.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", 
        "category": "Artificial Intelligence",
        "date": "Dec 20, 2025",
        "title": "The Race to AGI: When Will AI Outsmart Humans? 🧠",
        "desc": "From ChatGPT to Superintelligence. Are we ready for Artificial General Intelligence (AGI)? A deep dive into the future.",
        "link": "agi-future.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop", 
        "category": "Future Tech",
        "date": "Dec 19, 2025",
        "title": "Quantum Computing: The Next Revolution ⚛️",
        "desc": "Beyond 0s and 1s. Discover how Quantum Computers will change medicine, security, and AI forever.",
        "link": "quantum.html"
    },
    { "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80", "category": "Web Dev", "date": "Dec 14", "title": "How I Built My Portfolio 💻", "desc": "Coding journey.", "link": "building-portfolio.html" },
    { "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80", "category": "Education", "date": "Dec 14", "title": "Man: The Masterpiece 🧍", "desc": "Human evolution.", "link": "man.html" },
    { "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80", "category": "Science", "date": "Dec 13", "title": "Chemistry: Science 🧪", "desc": "Molecules and life.", "link": "chemistry.html" },
    { "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485", "category": "AI", "date": "Dec 12", "title": "AI Safety 🛡️", "desc": "Secure AI usage.", "link": "ai-guide.html" },
    { "image": "profile.jpg", "category": "Tech", "date": "Dec 12", "title": "New Features! ✨", "desc": "Portfolio update.", "link": "#" }
];

function loadBlogsDirectly() {
    const container = document.getElementById('blog-container');
    if (!container) return;
    container.innerHTML = myBlogs.map(b => `
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-blue-500 transition cursor-pointer reveal hover-trigger" data-tilt>
            <div class="h-40 overflow-hidden rounded-lg mb-4"><img src="${b.image}" class="w-full h-full object-cover hover:scale-110 transition duration-500"></div>
            <span class="text-xs font-bold text-blue-500 uppercase">${b.category}</span>
            <h3 class="text-xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">${b.title}</h3>
            <p class="text-sm text-gray-500 mb-4">${b.desc}</p>
            <a href="${b.link}" class="text-blue-500 text-xs font-bold inline-block">READ MORE</a>
        </div>
    `).join('');
}

// ==========================================
// 5. UTILS (Modals, Scroll, Music, Narrator)
// ==========================================
function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if(menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// Scroll
window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal').forEach(r => { if(r.getBoundingClientRect().top < window.innerHeight - 50) r.classList.add('active'); });
    const bar = document.getElementById('progress-bar');
    if(bar) bar.style.width = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100 + "%";
    const topBtn = document.getElementById('scrollTopBtn');
    if(topBtn) { if(window.scrollY > 300) { topBtn.classList.remove('hidden'); topBtn.classList.add('flex'); } else { topBtn.classList.add('hidden'); topBtn.classList.remove('flex'); } }
});
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// Music
let isPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
function toggleMusic() {
    if(!bgMusic) return;
    if(isPlaying) { bgMusic.pause(); musicBtn.classList.remove('animate-bounce'); }
    else { bgMusic.play(); musicBtn.classList.add('animate-bounce'); }
    isPlaying = !isPlaying;
}

// AI Narrator
let isReading = false;
function readAboutMe() {
    const text = "I am Manish Ghimire, a tech enthusiast from Nepal. My journey began in agriculture and mobile repair, and now I am building AI solutions.";
    const btn = document.getElementById('read-btn');
    if (isReading) { window.speechSynthesis.cancel(); btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen'; isReading = false; }
    else { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 0.9; window.speechSynthesis.speak(u); btn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop'; isReading = true; u.onend = () => { btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen'; isReading = false; }; }
}

// Magic Cursor
const cursor = document.getElementById('cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        if(window.innerWidth > 768) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });
        }
