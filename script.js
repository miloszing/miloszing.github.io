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
      <h3>${book.title} (${book.year})</h3>
      <p><strong>${book.author}</strong></p>
      <p class="tags">Tagi: ${book.tags.join(', ')}</p>
      <div class="details">
        <p><strong>Przeczytane:</strong> ${book.read_date}</p>
        <p><strong>Bohaterowie:</strong> ${book.characters.join(', ')}</p>
        <p><strong>Opis:</strong> ${book.description}</p>
        <p><strong>Notatki:</strong> ${book.notes}</p>
      </div>
    `;
    // Zmieniamy klik na cały div.book
    div.addEventListener('click', (e) => {
      // Ignoruj kliknięcia w linki/tagi wewnątrz .details
      if (e.target.closest('.details')) return;
      const details = div.querySelector('.details');
      if (details.style.maxHeight && details.style.maxHeight !== '0px') {
        details.style.maxHeight = '0px';
        details.style.opacity = '0';
      } else {
        details.style.maxHeight = details.scrollHeight + 'px';
        details.style.opacity = '1';
      }
    });
    // Początkowo ukryte
    const details = div.querySelector('.details');
    details.style.maxHeight = '0px';
    details.style.overflow = 'hidden';
    details.style.transition = 'max-height 0.25s ease, opacity 0.25s ease';
    details.style.opacity = '0';
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
