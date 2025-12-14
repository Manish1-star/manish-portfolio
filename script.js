// 1. SYSTEM INIT & PRELOADER FIX
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Force Dark Mode
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

// Preloader Logic
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
            document.body.classList.remove('loading');
        }, 500);
    }, 1500);

    // Initial Load
    loadBooks('programming');
});

// Force remove preloader if stuck
setTimeout(() => { document.getElementById('preloader').style.display = 'none'; document.body.classList.remove('loading'); }, 5000);


// ==========================================
// 2. SMART LIBRARY LOGIC (With Backup)
// ==========================================

// Backup Data (Safety Net for Presentation)
const libraryBackup = {
    'programming': [
        { title: "Clean Code", author: "Robert C. Martin", cover: "https://covers.openlibrary.org/b/id/8303028-L.jpg", key: "/works/OL3432026W" },
        { title: "The Pragmatic Programmer", author: "Andrew Hunt", cover: "https://covers.openlibrary.org/b/id/10578643-L.jpg", key: "/works/OL32402W" },
        { title: "JavaScript: The Good Parts", author: "Douglas Crockford", cover: "https://covers.openlibrary.org/b/id/8292671-L.jpg", key: "/works/OL3146440W" },
        { title: "Introduction to Algorithms", author: "Thomas H. Cormen", cover: "https://covers.openlibrary.org/b/id/7238641-L.jpg", key: "/works/OL3145465W" }
    ],
    'ai': [
        { title: "Artificial Intelligence", author: "Stuart Russell", cover: "https://covers.openlibrary.org/b/id/8243657-L.jpg", key: "/works/OL3145465W" },
        { title: "Life 3.0", author: "Max Tegmark", cover: "https://covers.openlibrary.org/b/id/8381831-L.jpg", key: "/works/OL17354964W" },
        { title: "Superintelligence", author: "Nick Bostrom", cover: "https://covers.openlibrary.org/b/id/8303028-L.jpg", key: "/works/OL17072974W" },
        { title: "Deep Learning", author: "Ian Goodfellow", cover: "https://covers.openlibrary.org/b/id/8390886-L.jpg", key: "/works/OL25675276W" }
    ]
};

async function loadBooks(category) {
    const container = document.getElementById('book-container');
    container.innerHTML = '<div class="col-span-full text-center py-10"><i class="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i><p class="mt-2 text-gray-500">Accessing Digital Library...</p></div>';

    // 1. Try API First
    try {
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
            throw new Error("No books found");
        }
    } catch (e) {
        // 2. If API Fails, Use Backup (Safety Net)
        console.log("API Failed, Using Backup Data");
        const backupData = libraryBackup[category] || libraryBackup['programming'];
        renderBooks(backupData);
    }
}

function renderBooks(books) {
    const container = document.getElementById('book-container');
    container.innerHTML = books.map(book => `
        <div class="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 rounded-xl cursor-pointer hover:-translate-y-2 transition shadow-lg group" onclick="openBookModal('${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}', '${book.cover}', '${book.key}')">
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
    document.getElementById('modal-book-desc').innerText = "This is a premium book from our digital collection. Click 'Read More' to view full details on Open Library.";
    document.getElementById('modal-book-link').href = `https://openlibrary.org${key}`;
}
function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }


// ==========================================
// 3. UTILS (Battery, Time, Weather, Status)
// ==========================================
function updateLiveStats() {
    const now = new Date();
    document.getElementById('live-time').innerText = now.toLocaleTimeString();
    
    const statuses = ["System Online 🟢", "AI Analyzing 🤖", "Coding 💻", "Reading 📚"];
    const statusEl = document.getElementById('current-status');
    if(statusEl) statusEl.innerText = statuses[Math.floor((Date.now() / 3000) % statuses.length)];
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
    .catch(() => tempEl.innerText = "Weather Offline");
}

// ==========================================
// 4. MODALS, MENUS & SCROLL
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

// Typing Effect
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
