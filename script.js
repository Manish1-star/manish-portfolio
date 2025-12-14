// ==========================================
// 1. SYSTEM INIT & PRELOADER FIX (महत्त्वपूर्ण)
// ==========================================
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Force Dark Mode
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

// --- PRELOADER FIX START ---
function removePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading');
            
            // Trigger Profile Animation
            const profileWrapper = document.getElementById('profile-wrapper');
            if(profileWrapper) profileWrapper.classList.add('cinematic-entry');
        }, 500);
    }
}

// 1. Normal Load
window.addEventListener('load', () => {
    setTimeout(removePreloader, 1500); // 1.5 sec delay for style
    
    // Load initial data
    if(typeof fetchBooks === 'function') fetchBooks('artificial_intelligence');
});

// 2. SAFETY BACKUP (यदि १.५ सेकेन्डमा खुलेन भने ५ सेकेन्डमा जबरजस्ती खुल्छ)
setTimeout(removePreloader, 5000);
// --- PRELOADER FIX END ---


// ==========================================
// 2. LIBRARY LOGIC (Open Library API)
// ==========================================
async function fetchBooks(subject) {
    const container = document.getElementById('book-container');
    if(!container) return;
    
    container.innerHTML = '<div class="col-span-4 text-center py-10"><i class="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i><p class="mt-2 text-gray-500">Connecting to Global Library...</p></div>';

    try {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=8`);
        const data = await res.json();

        container.innerHTML = data.works.map(book => {
            const cover = book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover';
            const author = book.authors ? book.authors[0].name : 'Unknown Author';
            // Escape quotes for JS string safety
            const safeTitle = book.title.replace(/'/g, "\\'");
            const safeAuthor = author.replace(/'/g, "\\'");
            
            return `
            <div class="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 rounded-xl cursor-pointer hover:-translate-y-2 transition shadow-lg group" onclick="openBookModal('${safeTitle}', '${safeAuthor}', '${cover}', '${book.key}')">
                <div class="h-48 overflow-hidden rounded-lg mb-4 relative">
                    <img src="${cover}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                </div>
                <h3 class="font-bold text-sm truncate text-gray-900 dark:text-white">${book.title}</h3>
                <p class="text-xs text-gray-500">${author}</p>
            </div>
            `;
        }).join('');
    } catch (e) {
        container.innerHTML = '<p class="col-span-4 text-center text-red-500">Library System Offline (Check Internet).</p>';
    }
}

// Book Modal Logic
async function openBookModal(title, author, cover, key) {
    const modal = document.getElementById('book-modal');
    if(!modal) return;
    
    document.getElementById('book-modal').classList.remove('hidden');
    document.getElementById('modal-book-title').innerText = title;
    document.getElementById('modal-book-author').innerText = "By " + author;
    document.getElementById('modal-book-cover').src = cover;
    document.getElementById('modal-book-desc').innerText = "Fetching book details from archives...";
    document.getElementById('modal-book-link').href = `https://openlibrary.org${key}`;

    try {
        const res = await fetch(`https://openlibrary.org${key}.json`);
        const data = await res.json();
        const desc = typeof data.description === 'string' ? data.description : (data.description?.value || "No description available.");
        document.getElementById('modal-book-desc').innerText = desc.substring(0, 400) + "...";
    } catch (e) {
        document.getElementById('modal-book-desc').innerText = "Details not available.";
    }
}
function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }


// ==========================================
// 3. UTILS (Battery, Time, Weather, Status)
// ==========================================
function updateLiveStats() {
    // Time
    const timeEl = document.getElementById('live-time');
    if(timeEl) timeEl.innerText = new Date().toLocaleTimeString();
    
    // Status (Cycling)
    const statuses = ["System Online 🟢", "AI Analyzing 🤖", "Coding 💻", "Reading 📚"];
    const statusEl = document.getElementById('current-status');
    if(statusEl) statusEl.innerText = statuses[Math.floor((Date.now() / 3000) % statuses.length)];
}
setInterval(updateLiveStats, 1000);

// Battery
if(navigator.getBattery) {
    navigator.getBattery().then(bat => {
        const batEl = document.getElementById('battery-status');
        if(batEl) batEl.innerText = Math.round(bat.level * 100) + "%";
    });
}

// Weather
const tempEl = document.getElementById('temp-display');
if(tempEl) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538&current_weather=true')
    .then(res => res.json())
    .then(data => {
        tempEl.innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`;
    })
    .catch(() => tempEl.innerText = "Weather Offline");
}

// ==========================================
// 4. BLOGS (Load from JSON if possible, else use backup)
// ==========================================
const myBlogs = [
    { title: "New AI Features", category: "Tech", date: "Dec 14", desc: "Added Library and AI Voice.", link: "#" },
    { title: "React Journey", category: "Code", date: "Dec 10", desc: "Learning React JS.", link: "#" },
    { title: "AI Safety Guide", category: "Security", date: "Dec 12", desc: "How to use AI safely.", link: "ai-guide.html" }
];
const blogCont = document.getElementById('blog-container');
if(blogCont) {
    blogCont.innerHTML = myBlogs.map(b => `
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-blue-500 transition cursor-pointer reveal">
            <span class="text-xs font-bold text-blue-500 uppercase">${b.category}</span>
            <h3 class="text-xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">${b.title}</h3>
            <p class="text-sm text-gray-500">${b.desc}</p>
            <a href="${b.link}" class="text-blue-500 text-xs font-bold mt-3 inline-block">READ MORE</a>
        </div>
    `).join('');
}


// ==========================================
// 5. MODALS, MENUS & SCROLL
// ==========================================
function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }

const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if(menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// Scroll Reveal
window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal').forEach(r => {
        if(r.getBoundingClientRect().top < window.innerHeight - 50) r.classList.add('active');
    });
    // Progress Bar
    const bar = document.getElementById('progress-bar');
    if(bar) {
        const scrolled = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
        bar.style.width = scrolled + "%";
    }
    
    // Scroll Top Button
    const topBtn = document.getElementById('scrollTopBtn');
    if(topBtn) {
        if(window.scrollY > 300) { topBtn.classList.remove('hidden'); topBtn.classList.add('flex'); }
        else { topBtn.classList.add('hidden'); topBtn.classList.remove('flex'); }
    }
});

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// Music Player (Simple)
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
