// Basic Setup
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
if (!('theme' in localStorage) || localStorage.getItem('theme') === 'dark') { html.classList.add('dark'); }
themeToggle.addEventListener('click', () => { html.classList.toggle('dark'); localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light'); });

// Mobile Menu
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });

// Scroll Logic
const revealOnScroll = () => {
    document.querySelectorAll('.reveal').forEach((reveal) => {
        if (reveal.getBoundingClientRect().top < window.innerHeight - 50) reveal.classList.add('active');
    });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// === NEW LIBRARY LOGIC (API) ===
async function fetchBooks(subject) {
    const container = document.getElementById('book-container');
    container.innerHTML = '<div class="col-span-4 text-center"><i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i><p class="mt-2">Fetching books from global library...</p></div>';

    try {
        const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=8`);
        const data = await res.json();

        container.innerHTML = data.works.map(book => {
            const coverId = book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover';
            const author = book.authors ? book.authors[0].name : 'Unknown Author';
            const desc = "Click to read details about this book."; // API often lacks simple desc in list view
            
            return `
            <div class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow hover:shadow-xl transition cursor-pointer hover:-translate-y-2" onclick="openBookModal('${book.title}', '${author}', '${coverId}', '${book.key}')">
                <img src="${coverId}" class="w-full h-48 object-cover rounded-lg mb-4 shadow-sm">
                <h3 class="font-bold text-sm truncate">${book.title}</h3>
                <p class="text-xs text-gray-500">${author}</p>
            </div>
            `;
        }).join('');
    } catch (error) {
        container.innerHTML = '<p class="col-span-4 text-center text-red-500">Error loading books. Try again.</p>';
    }
}

// Book Modal Logic
async function openBookModal(title, author, cover, key) {
    const modal = document.getElementById('book-modal');
    document.getElementById('book-title').innerText = title;
    document.getElementById('book-author').innerText = author;
    document.getElementById('book-cover').src = cover;
    document.getElementById('book-desc').innerText = "Loading description...";
    document.getElementById('book-link').href = `https://openlibrary.org${key}`;
    
    modal.classList.remove('hidden');

    // Fetch Description if possible
    try {
        const res = await fetch(`https://openlibrary.org${key}.json`);
        const data = await res.json();
        const descText = typeof data.description === 'string' ? data.description : (data.description?.value || "No description available.");
        document.getElementById('book-desc').innerText = descText.substring(0, 500) + "...";
    } catch (e) {
        document.getElementById('book-desc').innerText = "No detailed description available.";
    }
}

function closeBookModal() { document.getElementById('book-modal').classList.add('hidden'); }

// Load default books (Programming)
window.addEventListener('load', () => fetchBooks('programming'));

// Blog Data (Keep your existing data)
const myBlogs = [
    {
        "image": "profile.jpg",
        "category": "Technology",
        "date": "Dec 12, 2025",
        "title": "New Magic Features Added! ✨",
        "desc": "I have updated my portfolio with 3D Tilt, Magic Cursor, and Dark Mode.",
        "link": "#contact"
    }
    // ... add other blogs here ...
];
// Load blogs
const blogContainer = document.getElementById('blog-container');
if(blogContainer) {
    blogContainer.innerHTML = myBlogs.map(blog => `
        <div class="bg-white dark:bg-slate-700 rounded-2xl shadow-lg overflow-hidden reveal hover-trigger">
            <img src="${blog.image}" class="w-full h-48 object-cover">
            <div class="p-6">
                <span class="text-blue-500 text-xs font-bold uppercase">${blog.category}</span>
                <span class="text-gray-400 text-xs ml-2">${blog.date}</span>
                <h3 class="text-xl font-bold mt-2 mb-2">${blog.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">${blog.desc}</p>
                <a href="${blog.link}" class="text-blue-500 font-semibold text-sm hover:underline">Read More &rarr;</a>
            </div>
        </div>
    `).join('');
}

// Bank Modal
function openBankModal() { document.getElementById('bank-modal').classList.remove('hidden'); }
function closeBankModal() { document.getElementById('bank-modal').classList.add('hidden'); }
