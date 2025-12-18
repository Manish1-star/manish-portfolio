// 1. SYSTEM INIT & PRELOADER
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
            document.body.classList.remove('loading');
            
            // GSAP
            const profile = document.getElementById('profile-wrapper');
            if(profile) profile.classList.add('profile-entry');
            if(window.gsap && window.ScrollTrigger) {
                gsap.registerPlugin(ScrollTrigger);
                gsap.utils.toArray(".gsap-fade-up").forEach(elem => {
                    gsap.from(elem, { scrollTrigger: { trigger: elem, start: "top 85%" }, y: 50, opacity: 0, duration: 0.8, ease: "power2.out" });
                });
            }
        }, 500);
    }, 1500);

    // Load Books
    if(typeof loadBooks === 'function') loadBooks('must_read');
});

// Safety
setTimeout(() => { 
    const p = document.getElementById('preloader'); 
    if(p) p.style.display = 'none'; 
    document.body.classList.remove('loading'); 
}, 5000);


// ==========================================
// 2. BLOG DATA (SAFE HARDCODED)
// ==========================================
const myBlogs = [
    {
        "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop", 
        "category": "Web Dev",
        "date": "Dec 14, 2025",
        "title": "How I Built My Portfolio 💻",
        "desc": "From coding in HTML/CSS to deploying on GitHub Pages.",
        "link": "building-portfolio.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop", 
        "category": "Education",
        "date": "Dec 14, 2025",
        "title": "Man: The Complex Masterpiece 🧍",
        "desc": "What defines a man? Explore biological evolution.",
        "link": "man.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
        "category": "Science",
        "date": "Dec 13, 2025",
        "title": "Chemistry: Central Science 🧪",
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
        "category": "Update",
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


// ==========================================
// 3. LIBRARY LOGIC (BACKUP ENABLED)
// ==========================================
const libraryBackup = {
    'must_read': [ 
        { title: "Atomic Habits", author: "James Clear", cover: "https://covers.openlibrary.org/b/id/8563855-L.jpg", key: "/works/OL17930368W" }, 
        { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", cover: "https://covers.openlibrary.org/b/id/8344686-L.jpg", key: "/works/OL3340646W" } 
    ],
    'programming': [
        { title: "Clean Code", author: "Robert C. Martin", cover: "https://covers.openlibrary.org/b/id/8303028-L.jpg", key: "/works/OL3432026W" },
        { title: "The Pragmatic Programmer", author: "Andrew Hunt", cover: "https://covers.openlibrary.org/b/id/10578643-L.jpg", key: "/works/OL32402W" }
    ],
    'ai': [
        { title: "Life 3.0", author: "Max Tegmark", cover: "https://covers.openlibrary.org/b/id/8381831-L.jpg", key: "/works/OL17354964W" },
        { title: "Superintelligence", author: "Nick Bostrom", cover: "https://covers.openlibrary.org/b/id/8303028-L.jpg", key: "/works/OL17072974W" }
    ],
    'science': [
        { title: "A Brief History of Time", author: "Stephen Hawking", cover: "https://covers.openlibrary.org/b/id/8883506-L.jpg", key: "/works/OL257608W" }
    ],
    'history': [
        { title: "Sapiens", author: "Yuval Noah Harari", cover: "https://covers.openlibrary.org/b/id/8372332-L.jpg", key: "/works/OL17076647W" }
    ]
};

async function loadBooks(category) {
    const container = document.getElementById('book-container');
    if(!container) return;
    
    container.innerHTML = '<div class="col-span-full text-center py-10"><i class="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i><p class="mt-2 text-gray-500">Fetching Library...</p></div>';

    try {
        if(category === 'must_read') {
            renderBooks(libraryBackup['must_read']); // Always use backup for must read
            return;
        }

        let subject = category;
        if(category === 'ai') subject = 'artificial_intelligence';

        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=8`);
        const data = await res.json();

        if (data.works.length > 0) {
            renderBooks(data.works.map(b => ({
                title: b.title,
                author: b.authors[0].name,
                cover: b.cover_id ? `https://covers.openlibrary.org/b/id/${b.cover_id}-L.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover',
                key: b.key
            })));
        } else {
            throw new Error("No books");
        }
    } catch (e) {
        // Fallback to backup
        if(libraryBackup[category]) renderBooks(libraryBackup[category]);
        else renderBooks(libraryBackup['must_read']);
    }
}

function renderBooks(books) {
    const container = document.getElementById('book-container');
    container.innerHTML = books.map(book => `
        <div class="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 rounded-xl cursor-pointer hover:-translate-y-2 transition shadow-lg group hover-trigger" onclick="openBookModal('${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}', '${book.cover}', '${book.key}')">
            <div class="h-48 overflow-hidden rounded-lg mb-4 relative">
                <img src="${book.cover}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            </div>
            <h3 class="font-bold text-sm truncate text-gray-900 dark:text-white">${book.title}</h3>
            <p class="text-xs text-gray-500">${book.author}</p>
        </div>
    `).join('');
}

// Book Modal Logic
function openBookModal(title, author, cover, key) {
    document.getElementById('book-modal').classList.remove('hidden');
    document.getElementById('modal-book-title').innerText = title;
    document.getElementById('modal-book-author').innerText = "By " + author;
    document.getElementById('modal-book-cover').src = cover;
    document.getElementById('modal-book-desc').innerText = "Fetching description...";
    document.getElementById('modal-book-link').href = `https://openlibrary.org${key}`;

    fetch(`https://openlibrary.org${key}.json`)
        .then(res => res.json())
        .then(data => {
            const desc = typeof data.description === 'string' ? data.description : (data.description?.value || "This is a premium book from our digital collection.");
            document.getElementById('modal-book-desc').innerText = desc.substring(0, 400) + "...";
        })
        .catch(() => document.getElementById('modal-book-desc').innerText = "Description not available.");
}
function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }


// ==========================================
// 4. UTILS & AI NARRATOR
// ==========================================
// AI Narrator
let isReading = false;
function readAboutMe() {
    const text = document.getElementById('about-text').innerText;
    const btn = document.getElementById('read-btn');
    if (isReading) {
        window.speechSynthesis.cancel();
        btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to my Story';
        isReading = false;
    } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        
        const voices = window.speechSynthesis.getVoices();
        const googleVoice = voices.find(v => v.name.includes("Google"));
        if(googleVoice) utterance.voice = googleVoice;

        utterance.onend = () => {
            btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen to my Story';
            isReading = false;
        };

        window.speechSynthesis.speak(utterance);
        btn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop Listening';
        isReading = true;
    }
}
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();

// Live Stats
function updateLiveStats() {
    const now = new Date();
    document.getElementById('live-time').innerText = now.toLocaleTimeString();
}
setInterval(updateLiveStats, 1000);

if(navigator.getBattery) {
    navigator.getBattery().then(bat => {
        document.getElementById('battery-status').innerText = Math.round(bat.level * 100) + "%";
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
// 5. MODALS, MENUS & SCROLL
// ==========================================
function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }

const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if(menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// Scroll Reveal & Magic Cursor
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
