// 1. SYSTEM INIT & PRELOADER
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Force Dark Mode
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

window.addEventListener('load', () => {
    // Remove Preloader
    setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
        document.body.classList.remove('loading');
    }, 1000);
});

// SAFETY: Force reveal all content after 500ms
setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
    document.getElementById('preloader').style.display = 'none';
    document.body.classList.remove('loading');
}, 500);

// ==========================================
// 2. BLOG DATA (Hardcoded for Safety)
// ==========================================
const myBlogs = [
    {
        "image": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop", 
        "category": "Web Dev", "date": "Dec 14", "title": "How I Built My Portfolio 💻", "desc": "Coding journey and tech stack.", "link": "building-portfolio.html"
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
        "image": "profile.jpg", "category": "Update", "date": "Dec 12", "title": "New Features Added! ✨", "desc": "Updated with Library and AI.", "link": "#"
    }
];

const blogCont = document.getElementById('blog-container');
if(blogCont) {
    blogCont.innerHTML = myBlogs.map(b => `
        <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl hover:border-blue-500 transition cursor-pointer">
            <span class="text-xs font-bold text-blue-500 uppercase">${b.category}</span>
            <h3 class="text-xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">${b.title}</h3>
            <p class="text-sm text-gray-500 mb-4">${b.desc}</p>
            <a href="${b.link}" class="text-blue-500 text-xs font-bold inline-block">READ MORE</a>
        </div>
    `).join('');
}

// ==========================================
// 3. LIBRARY LOGIC (Immediate Load)
// ==========================================
const libraryBooks = [
    { title: "Atomic Habits", author: "James Clear", cover: "https://covers.openlibrary.org/b/id/8563855-L.jpg", key: "/works/OL17930368W" },
    { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", cover: "https://covers.openlibrary.org/b/id/8344686-L.jpg", key: "/works/OL3340646W" },
    { title: "Clean Code", author: "Robert C. Martin", cover: "https://covers.openlibrary.org/b/id/8303028-L.jpg", key: "/works/OL3432026W" },
    { title: "Life 3.0", author: "Max Tegmark", cover: "https://covers.openlibrary.org/b/id/8381831-L.jpg", key: "/works/OL17354964W" }
];

const bookCont = document.getElementById('book-container');
if(bookCont) {
    bookCont.innerHTML = libraryBooks.map(book => `
        <div class="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 rounded-xl cursor-pointer hover:-translate-y-2 transition shadow-lg" onclick="openBookModal('${book.title}', '${book.author}', '${book.cover}', '${book.key}')">
            <div class="h-48 overflow-hidden rounded-lg mb-4 relative"><img src="${book.cover}" class="w-full h-full object-cover"></div>
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
    document.getElementById('modal-book-desc').innerText = "Book details loaded from Open Library.";
    document.getElementById('modal-book-link').href = `https://openlibrary.org${key}`;
}
function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }

// ==========================================
// 4. UTILS & AI NARRATOR
// ==========================================
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

// Modals & Menu
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
});

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
