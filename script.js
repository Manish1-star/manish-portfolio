// 1. SYSTEM INIT & PRELOADER
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Force Dark Mode for Pro Look
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

window.addEventListener('load', () => {
    // Preloader Fade Out
    setTimeout(() => {
        document.getElementById('preloader').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('preloader').style.display = 'none';
            document.body.classList.remove('loading');
            
            // TRIGGER CINEMATIC ENTRY
            document.getElementById('profile-wrapper').classList.add('cinematic-entry');
        }, 500);
    }, 1500);

    // Initial Library Load
    fetchBooks('artificial_intelligence');
});

// 2. LIBRARY LOGIC (Open Library API)
async function fetchBooks(subject) {
    const container = document.getElementById('book-container');
    container.innerHTML = '<div class="col-span-4 text-center py-10"><i class="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i><p class="mt-2 text-gray-500">Connecting to Global Library...</p></div>';

    try {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=8`);
        const data = await res.json();

        container.innerHTML = data.works.map(book => {
            const cover = book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover';
            return `
            <div class="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 rounded-xl cursor-pointer hover:-translate-y-2 transition shadow-lg group" onclick="openBookModal('${book.title}', '${book.authors[0].name}', '${cover}', '${book.key}')">
                <div class="h-48 overflow-hidden rounded-lg mb-4 relative">
                    <img src="${cover}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                </div>
                <h3 class="font-bold text-sm truncate text-gray-900 dark:text-white">${book.title}</h3>
                <p class="text-xs text-gray-500">${book.authors[0].name}</p>
            </div>
            `;
        }).join('');
    } catch (e) {
        container.innerHTML = '<p class="col-span-4 text-center text-red-500">Library System Offline. Please try again.</p>';
    }
}

// Book Modal
async function openBookModal(title, author, cover, key) {
    document.getElementById('book-modal').classList.remove('hidden');
    document.getElementById('modal-book-title').innerText = title;
    document.getElementById('modal-book-author').innerText = "By " + author;
    document.getElementById('modal-book-cover').src = cover;
    document.getElementById('modal-book-desc').innerText = "Fetching book details from archives...";
    document.getElementById('modal-book-link').href = `https://openlibrary.org${key}`;

    try {
        const res = await fetch(`https://openlibrary.org${key}.json`);
        const data = await res.json();
        const desc = typeof data.description === 'string' ? data.description : (data.description?.value || "No description available in the archive.");
        document.getElementById('modal-book-desc').innerText = desc.substring(0, 400) + "...";
    } catch (e) {
        document.getElementById('modal-book-desc').innerText = "Details not available.";
    }
}
function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }

// 3. UTILS (Battery, Time, Weather, Status)
function updateLiveStats() {
    // Time
    const now = new Date();
    document.getElementById('live-time').innerText = now.toLocaleTimeString();
    
    // Status (Cycling)
    const statuses = ["System Online 🟢", "AI Analyzing 🤖", "Coding 💻", "Reading 📚"];
    const statusEl = document.getElementById('current-status');
    if(statusEl) statusEl.innerText = statuses[Math.floor((Date.now() / 3000) % statuses.length)];
}
setInterval(updateLiveStats, 1000);

// Battery
if(navigator.getBattery) {
    navigator.getBattery().then(bat => {
        document.getElementById('battery-status').innerText = Math.round(bat.level * 100) + "%";
    });
}

// Weather
fetch('https://api.open-meteo.com/v1/forecast?latitude=27.9972&longitude=83.0538&current_weather=true')
    .then(res => res.json())
    .then(data => {
        document.getElementById('temp-display').innerHTML = `Arghakhanchi: <b>${data.current_weather.temperature}°C</b>`;
    });

// 4. BLOGS (Hardcoded for Stability)
const myBlogs = [
    { title: "New AI Features", category: "Tech", date: "Dec 14", desc: "Added Library and AI Voice.", link: "#" },
    { title: "React Journey", category: "Code", date: "Dec 10", desc: "Learning React JS.", link: "#" }
];
const blogCont = document.getElementById('blog-container');
if(blogCont) {
    blogCont.innerHTML = myBlogs.map(b => `
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-blue-500 transition cursor-pointer">
            <span class="text-xs font-bold text-blue-500 uppercase">${b.category}</span>
            <h3 class="text-xl font-bold mt-2 mb-2">${b.title}</h3>
            <p class="text-sm text-gray-500">${b.desc}</p>
        </div>
    `).join('');
}

// 5. MODALS & MENUS
function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

// 6. SCROLL REVEAL
window.addEventListener('scroll', () => {
    document.querySelectorAll('.reveal').forEach(r => {
        if(r.getBoundingClientRect().top < window.innerHeight - 50) r.classList.add('active');
    });
    // Progress Bar
    const scrolled = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
    document.getElementById('progress-bar').style.width = scrolled + "%";
});
