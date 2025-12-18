// 1. INIT & LOADER
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

window.addEventListener('load', () => {
    // Hide Preloader
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('loading');
                // Trigger Profile
                const profile = document.getElementById('profile-wrapper');
                if(profile) profile.classList.add('profile-entry');
            }, 500);
        }
    }, 1500);

    // ✅ FORCE LOAD DATA
    loadBlogsDirectly();
    loadBooks('must_read');
});

// Force remove loader backup
setTimeout(() => { document.getElementById('preloader').style.display = 'none'; document.body.classList.remove('loading'); }, 4000);

// 2. BLOG DATA
const myBlogs = [
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

// 3. LIBRARY
const libraryBackup = [
    { title: "Atomic Habits", author: "James Clear", cover: "https://covers.openlibrary.org/b/id/8563855-L.jpg", key: "/works/OL17930368W" },
    { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", cover: "https://covers.openlibrary.org/b/id/8344686-L.jpg", key: "/works/OL3340646W" },
    { title: "Clean Code", author: "Robert C. Martin", cover: "https://covers.openlibrary.org/b/id/8303028-L.jpg", key: "/works/OL3432026W" },
    { title: "Steve Jobs", author: "Walter Isaacson", cover: "https://covers.openlibrary.org/b/id/7318536-L.jpg", key: "/works/OL16156010W" }
];

async function loadBooks(category) {
    const container = document.getElementById('book-container');
    if(!container) return;
    renderBooks(libraryBackup); // Show backup immediately for speed
}

function renderBooks(books) {
    document.getElementById('book-container').innerHTML = books.map(book => `
        <div class="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 rounded-xl cursor-pointer hover:-translate-y-2 transition shadow-lg group" onclick="openBookModal('${book.title}', '${book.author}', '${book.cover}', '${book.key}')">
            <div class="h-48 overflow-hidden rounded-lg mb-4 relative"><img src="${book.cover}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"></div>
            <h3 class="font-bold text-sm truncate text-gray-900 dark:text-white">${book.title}</h3>
            <p class="text-xs text-gray-500">${book.author}</p>
        </div>`).join('');
}

// Utils (Music, Scroll, Etc)
function openBookModal(title, author, cover, key) {
    document.getElementById('book-modal').classList.remove('hidden');
    document.getElementById('modal-book-title').innerText = title;
    document.getElementById('modal-book-author').innerText = "By " + author;
    document.getElementById('modal-book-cover').src = cover;
    document.getElementById('modal-book-link').href = `https://openlibrary.org${key}`;
}
function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }
function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if(menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

let isPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
function toggleMusic() {
    if(!bgMusic) return;
    if(isPlaying) { bgMusic.pause(); musicBtn.classList.remove('animate-bounce'); }
    else { bgMusic.play(); musicBtn.classList.add('animate-bounce'); }
    isPlaying = !isPlaying;
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal').forEach(r => { if(r.getBoundingClientRect().top < window.innerHeight - 50) r.classList.add('active'); });
    const topBtn = document.getElementById('scrollTopBtn');
    if(topBtn) { if(window.scrollY > 300) { topBtn.classList.remove('hidden'); topBtn.classList.add('flex'); } else { topBtn.classList.add('hidden'); topBtn.classList.remove('flex'); } }
});

// AI Narrator
let isReading = false;
function readAboutMe() {
    const text = "I am Manish Ghimire, a tech enthusiast from Nepal. My journey began in agriculture and mobile repair.";
    const btn = document.getElementById('read-btn');
    if (isReading) { window.speechSynthesis.cancel(); btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen'; isReading = false; }
    else { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 0.9; window.speechSynthesis.speak(u); btn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop'; isReading = true; u.onend = () => { btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen'; isReading = false; }; }
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
