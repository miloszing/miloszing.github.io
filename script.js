let books = [];
let allTags = new Set();

async function loadBooks() {
  const res = await fetch('books.json');
  books = await res.json();
  books.forEach(book => book.tags.forEach(tag => allTags.add(tag)));
  renderTags();
  renderBooks(books); // domyślnie pokaż wszystkie
}

function renderTags() {
  const tagList = document.getElementById('tagList');
  tagList.innerHTML = '';
  allTags.forEach(tag => {
    const li = document.createElement('li');
    li.textContent = tag;
    li.addEventListener('click', () => filterByTag(tag));
    tagList.appendChild(li);
  });
}

function renderBooks(list) {
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '';
  list.forEach((book) => {
    const div = document.createElement('div');
    div.className = 'book';
    div.innerHTML = `
      <div class="book-header">
        <img src="${book.image}" alt="Okładka książki ${book.title}" class="book-cover">
        <div>
          <h3>${book.title} (${book.year})</h3>
          <p><strong>${book.author}</strong></p>
          <p class="tags">Tagi: ${book.tags.join(', ')}</p>
        </div>
      </div>
      <div class="details">
        <p><strong>Seria:</strong> ${book.seria || 'Brak'}</p>
        <p><strong>Przeczytane:</strong> ${book.read_date}</p>
        <p><strong>Bohaterowie:</strong> ${book.characters.length > 0 ? book.characters.join(', ') : 'Brak'}</p>
        <p><strong>Opis:</strong> ${book.description}</p>
        <p><strong>Notatki:</strong> ${book.notes}</p>
      </div>
    `;
    div.addEventListener('click', () => {
      const details = div.querySelector('.details');
      details.classList.toggle('open'); // Dodanie lub usunięcie klasy "open"
    });
    bookList.appendChild(div);
  });
}

function filterByTag(tag) {
  const filtered = books.filter(book => book.tags.includes(tag));
  renderBooks(filtered);
}

function showRecent() {
  const sorted = [...books].sort((a, b) => new Date(b.read_date) - new Date(a.read_date));
  renderBooks(sorted);
}

document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(q) ||
    book.author.toLowerCase().includes(q)
  );
  renderBooks(filtered);
});

// Obsługa "Ostatnio przeczytane"
document.getElementById('recentLink').addEventListener('click', () => {
  showRecent();
});

loadBooks();
