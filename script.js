// 1. SYSTEM INIT
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Force Dark Mode
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if(preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('loading');
                
                // TRIGGER PROFILE ANIMATION
                const profileWrapper = document.getElementById('profile-wrapper');
                if(profileWrapper) profileWrapper.classList.add('profile-entry');
            }, 500);
        }
    }, 1500);

    // Initial Library Load
    if(typeof loadBooks === 'function') loadBooks('must_read');
});

// Safety
setTimeout(() => { 
    document.getElementById('preloader').style.display = 'none'; 
    document.body.classList.remove('loading'); 
}, 5000);

// ==========================================
// 2. BLOG DATA RESTORED
// ==========================================
const myBlogs = [
    {
        "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop", 
        "category": "Web Dev", "date": "Dec 14", "title": "How I Built My Portfolio 💻", "desc": "From coding to deploying on GitHub.", "link": "building-portfolio.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop", 
        "category": "Education", "date": "Dec 14", "title": "Man: The Masterpiece 🧍", "desc": "Biological and social evolution.", "link": "man.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80",
        "category": "Science", "date": "Dec 13", "title": "Chemistry: Central Science 🧪", "desc": "Atoms, molecules, and reactions.", "link": "chemistry.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop", 
        "category": "Education", "date": "Dec 12", "title": "What is Biology? 🧬", "desc": "The scientific study of life.", "link": "biology.html"
    },
    {
        "image": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        "category": "AI Safety", "date": "Dec 12", "title": "How to Use AI Safely 🛡️", "desc": "Never share passwords.", "link": "ai-guide.html"
    },
    {
        "image": "profile.jpg", "category": "Update", "date": "Dec 12", "title": "New Features Added! ✨", "desc": "Updated with Library and AI.", "link": "#"
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
// 3. UTILS (Battery, Time, Weather, Narrator)
// ==========================================
let isReading = false;
function readAboutMe() {
    const text = "I am Manish Ghimire, a tech enthusiast from Nepal. My journey began in agriculture and mobile repair, and now I am building AI solutions.";
    const btn = document.getElementById('read-btn');
    if (isReading) { window.speechSynthesis.cancel(); btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen'; isReading = false; }
    else { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 0.9; window.speechSynthesis.speak(u); btn.innerHTML = '<i class="fas fa-stop-circle"></i> Stop'; isReading = true; u.onend = () => { btn.innerHTML = '<i class="fas fa-volume-up"></i> Listen'; isReading = false; }; }
}

function updateLiveStats() {
    const now = new Date(); document.getElementById('live-time').innerText = now.toLocaleTimeString();
    const statuses = ["System Online 🟢", "Coding 💻", "Reading 📚"];
    const statusEl = document.getElementById('current-status');
    if(statusEl) statusEl.innerText = statuses[Math.floor((Date.now() / 3000) % statuses.length)];
}
setInterval(updateLiveStats, 1000);

if(navigator.getBattery) { navigator.getBattery().then(bat => { document.getElementById('battery-status').innerText = Math.round(bat.level * 100) + "%"; }); }

const tempEl = document.getElementById('temp-display');
if(tempEl) { fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538&current_weather=true').then(res => res.json()).then(data => { tempEl.innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`; }).catch(() => tempEl.innerText = "Offline"); }

// ==========================================
// 4. MODALS & SCROLL
// ==========================================
// Library Logic (Shortened for brevity but fully functional)
const libraryBackup = { 'must_read': [ { title: "Atomic Habits", author: "James Clear", cover: "https://covers.openlibrary.org/b/id/8563855-L.jpg", key: "/works/OL17930368W" } ] };
async function loadBooks(category) {
    const container = document.getElementById('book-container');
    container.innerHTML = '<p class="col-span-full text-center py-10">Fetching...</p>';
    try {
        let subject = category === 'ai' ? 'artificial_intelligence' : category;
        if(category === 'must_read') { renderBooks(libraryBackup['must_read']); return; }
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=8`);
        const data = await res.json();
        if (data.works.length > 0) renderBooks(data.works.map(b => ({ title: b.title, author: b.authors[0].name, cover: `https://covers.openlibrary.org/b/id/${b.cover_id}-L.jpg`, key: b.key })));
        else throw new Error("Limit");
    } catch (e) { renderBooks(libraryBackup['must_read']); }
}
function renderBooks(books) {
    document.getElementById('book-container').innerHTML = books.map(book => `
        <div class="bg-gray-100 dark:bg-[#111] p-4 rounded-xl cursor-pointer hover:-translate-y-2 transition shadow-lg group" onclick="openBookModal('${book.title.replace(/'/g, "\\'")}', '${book.author.replace(/'/g, "\\'")}', '${book.cover}', '${book.key}')">
            <img src="${book.cover}" class="w-full h-48 object-cover rounded-lg mb-4">
            <h3 class="font-bold text-sm truncate dark:text-white">${book.title}</h3>
            <p class="text-xs text-gray-500">${book.author}</p>
        </div>`).join('');
}
// Book Modal
function openBookModal(title, author, cover, key) {
    document.getElementById('book-modal').classList.remove('hidden');
    document.getElementById('modal-book-title').innerText = title;
    document.getElementById('modal-book-author').innerText = author;
    document.getElementById('modal-book-cover').src = cover;
    document.getElementById('modal-book-desc').innerText = "Fetching details...";
    document.getElementById('modal-book-link').href = `https://openlibrary.org${key}`;
}
function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }

function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if(menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// Scroll Reveal
window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal').forEach(r => { if(r.getBoundingClientRect().top < window.innerHeight - 50) r.classList.add('active'); });
    const bar = document.getElementById('progress-bar');
    if(bar) bar.style.width = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100 + "%";
});
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

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
