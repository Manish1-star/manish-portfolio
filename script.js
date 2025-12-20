// ==========================================
// 1. SYSTEM INIT & PRELOADER FIX
// ==========================================
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Force Dark Mode
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

window.addEventListener('load', () => {
    // Hide Preloader & Show Profile
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('loading');
                const profile = document.getElementById('profile-wrapper');
                if (profile) profile.classList.add('profile-entry');
            }, 500);
        }
    }, 1500);

    // Initial Load
    loadBlogsDirectly();
    loadBooks('must_read');
});

// Safety: Force remove preloader if stuck
setTimeout(() => { 
    const p = document.getElementById('preloader'); 
    if (p) p.style.display = 'none'; 
    document.body.classList.remove('loading'); 
}, 5000);

// ==========================================
// 2. LIBRARY LOGIC (FIXED: BOOK CLICK ISSUE)
// ==========================================
const libraryBackup = {
    'must_read': [
        { title: "Atomic Habits", author: "James Clear", cover: "https://covers.openlibrary.org/b/id/8563855-L.jpg", key: "/works/OL17930368W", desc: "Build good habits and break bad ones." },
        { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", cover: "https://covers.openlibrary.org/b/id/8344686-L.jpg", key: "/works/OL3340646W", desc: "What the rich teach their kids about money." },
        { title: "The Psychology of Money", author: "Morgan Housel", cover: "https://covers.openlibrary.org/b/id/10542385-L.jpg", key: "/works/OL20875326W", desc: "Timeless lessons on wealth, greed, and happiness." },
        { title: "Steve Jobs", author: "Walter Isaacson", cover: "https://covers.openlibrary.org/b/id/7318536-L.jpg", key: "/works/OL16156010W", desc: "Biography of the Apple co-founder." },
        { title: "Elon Musk", author: "Ashlee Vance", cover: "https://covers.openlibrary.org/b/id/7900762-L.jpg", key: "/works/OL17364669W", desc: "Tesla, SpaceX, and the Quest for a Fantastic Future." },
        { title: "Zero to One", author: "Peter Thiel", cover: "https://covers.openlibrary.org/b/id/8250239-L.jpg", key: "/works/OL17124172W", desc: "Notes on Startups, or How to Build the Future." },
        { title: "The Alchemist", author: "Paulo Coelho", cover: "https://covers.openlibrary.org/b/id/12776378-L.jpg", key: "/works/OL92176W", desc: "A Fable About Following Your Dream." },
        { title: "Sapiens", author: "Yuval Noah Harari", cover: "https://covers.openlibrary.org/b/id/8372332-L.jpg", key: "/works/OL17076647W", desc: "A Brief History of Humankind." }
    ],
    'programming': [
        { title: "Clean Code", author: "Robert C. Martin", cover: "https://covers.openlibrary.org/b/id/8303028-L.jpg", key: "/works/OL3432026W", desc: "A Handbook of Agile Software Craftsmanship." },
        { title: "You Don't Know JS", author: "Kyle Simpson", cover: "https://covers.openlibrary.org/b/id/12629731-L.jpg", key: "/works/OL17354964W", desc: "Deep dive into JavaScript core mechanisms." }
    ],
    'ai': [
        { title: "Life 3.0", author: "Max Tegmark", cover: "https://covers.openlibrary.org/b/id/8381831-L.jpg", key: "/works/OL17354964W", desc: "Being Human in the Age of Artificial Intelligence." },
        { title: "Superintelligence", author: "Nick Bostrom", cover: "https://covers.openlibrary.org/b/id/8303028-L.jpg", key: "/works/OL17072974W", desc: "Paths, Dangers, Strategies." }
    ]
};

// Global Variable to store current books (Fixes Click Issue)
let currentBookData = [];

async function loadBooks(category) {
    const container = document.getElementById('book-container');
    if (!container) return;

    container.innerHTML = '<div class="col-span-full text-center py-10"><i class="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i><p class="mt-2 text-gray-500">Opening Library...</p></div>';

    try {
        // Always use backup for "Must Read" or if Offline
        if (category === 'must_read' || !navigator.onLine) {
            renderBooks(libraryBackup['must_read']);
            return;
        }

        let subject = category;
        if (category === 'ai') subject = 'artificial_intelligence';

        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=12`);
        const data = await res.json();

        if (data.works.length > 0) {
            const apiBooks = data.works.map(b => ({
                title: b.title,
                author: b.authors ? b.authors[0].name : "Unknown Author",
                cover: b.cover_id ? `https://covers.openlibrary.org/b/id/${b.cover_id}-L.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover',
                key: b.key,
                desc: "Loading details from Open Library..."
            }));
            renderBooks(apiBooks);
        } else {
            throw new Error("No books found");
        }
    } catch (e) {
        // Fallback
        const backup = libraryBackup[category] || libraryBackup['must_read'];
        renderBooks(backup);
    }
}

function renderBooks(books) {
    currentBookData = books; // Store Data Globally
    const container = document.getElementById('book-container');
    
    container.innerHTML = books.map((book, index) => `
        <div class="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 rounded-xl cursor-pointer hover:-translate-y-2 transition shadow-lg group hover:border-blue-500" 
             onclick="openBookByIndex(${index})">
            <div class="h-48 overflow-hidden rounded-lg mb-4 relative bg-gray-200 dark:bg-gray-800">
                <img src="${book.cover}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" onerror="this.src='https://via.placeholder.com/150x200?text=No+Cover'">
            </div>
            <h3 class="font-bold text-sm truncate text-gray-900 dark:text-white">${book.title}</h3>
            <p class="text-xs text-gray-500 truncate">${book.author}</p>
        </div>
    `).join('');
}

// ✅ NEW: Open Book by Index (100% Safe Click)
async function openBookByIndex(index) {
    const book = currentBookData[index];
    if (!book) return;

    const modal = document.getElementById('book-modal');
    modal.classList.remove('hidden');

    document.getElementById('modal-book-title').innerText = book.title;
    document.getElementById('modal-book-author').innerText = "By " + book.author;
    document.getElementById('modal-book-cover').src = book.cover;
    document.getElementById('modal-book-desc').innerText = book.desc || "Fetching description...";
    document.getElementById('modal-book-link').href = `https://openlibrary.org${book.key}`;

    // Try fetching full description
    if (book.key) {
        try {
            const res = await fetch(`https://openlibrary.org${book.key}.json`);
            const data = await res.json();
            const descText = typeof data.description === 'string' ? data.description : (data.description?.value || book.desc || "No description available.");
            document.getElementById('modal-book-desc').innerText = descText.substring(0, 500) + "...";
        } catch (e) {
            // Keep default description
        }
    }
}

function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }

// ==========================================
// 3. BLOG DATA (RESTORED)
// ==========================================
const myBlogs = [ 
    {
        "image": "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop", 
        "category": "Cyber Security",
        "date": "Dec 21, 2025",
        "title": "The Dark Side of AI: Deepfakes & Scams 🕵️‍♂️",
        "desc": "AI can now clone your voice in 3 seconds. Are you safe? Learn about Deepfakes, AI Scams, and how to protect your digital identity in 2025.",
        "link": "cyber-security.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop", 
        "category": "Geopolitics",
        "date": "Dec 20, 2025",
        "title": "The New World Order: Tech Wars & AI 🌍",
        "desc": "Geopolitics is no longer just about borders. It is about Microchips, AI supremacy, and the rise of the Global South. A deep dive into modern power struggles.",
        "link": "geopolitics.html"
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
        "desc": "कृत्रिम बुद्धिमत्ता (AI) ले हाम्रो जीवन कसरी बदल्दैछ? के यसले मानिसको जागिर खोस्ला? विस्तृत जानकारी।",
        "link": "ai-revolution.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop", 
        "category": "Web Dev",
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
        "desc": "Chemistry connects physics with biology. Explore how atoms, molecules, and reactions shape our world.",
        "link": "chemistry.html"
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
        "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        "category": "AI Safety",
        "date": "Dec 12, 2025",
        "title": "How to Use AI Safely 🛡️",
        "desc": "AI is powerful but needs care. Never share passwords or API keys. Click here to read the full guide.",
        "link": "ai-guide.html"
    }
];

function loadBlogsDirectly() {
    const container = document.getElementById('blog-container');
    if (!container) return;

    container.innerHTML = myBlogs.map(b => `
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-blue-500 transition cursor-pointer reveal hover-trigger" data-tilt>
            <div class="h-40 overflow-hidden rounded-lg mb-4">
                <img src="${b.image}" class="w-full h-full object-cover hover:scale-110 transition duration-500">
            </div>
            <span class="text-xs font-bold text-blue-500 uppercase">${b.category}</span>
            <h3 class="text-xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">${b.title}</h3>
            <p class="text-sm text-gray-500 mb-4 line-clamp-2">${b.desc}</p>
            <a href="${b.link}" class="text-blue-500 text-xs font-bold inline-block">READ MORE</a>
        </div>
    `).join('');
}


// ==========================================
// 4. UTILS (STATS, MODALS, SCROLL)
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

function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// Scroll Reveal
window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal').forEach(r => {
        if(r.getBoundingClientRect().top < window.innerHeight - 50) r.classList.add('active');
    });
    
    const bar = document.getElementById('progress-bar');
    if(bar) {
        const scrolled = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
        bar.style.width = scrolled + "%";
    }
    
    const topBtn = document.getElementById('scrollTopBtn');
    if(topBtn) {
        if(window.scrollY > 300) { topBtn.classList.remove('hidden'); topBtn.classList.add('flex'); }
        else { topBtn.classList.add('hidden'); topBtn.classList.remove('flex'); }
    }
});

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

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
    if (isReading) {
        window.speechSynthesis.cancel();
        btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to my Story';
        isReading = false;
    } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.onend = () => {
            btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to my Story';
            isReading = false;
        };
        window.speechSynthesis.speak(utterance);
        btn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop Listening';
        isReading = true;
    }
}

// Typing
const typeText = document.getElementById('typing-text');
if(typeText) {
    const txts = ["Web Developer", "AI Enthusiast", "Creator"];
    let i=0, ch=0, del=false;
    function type() {
        typeText.innerText = txts[i].substring(0, ch);
        ch += del ? -1 : 1;
        if(!del && ch === txts[i].length) { del=true; setTimeout(type, 2000); return; }
        if(del && ch === 0) { del=false; i=(i+1)%txts.length; }
        setTimeout(type, del ? 100 : 200);
    }
    type();
}
