let books = [];
let allTags = new Set();

async function loadBooks() {
  const res = await fetch('books.json');
  books = await res.json();
  books.forEach(book => book.tags.forEach(tag => allTags.add(tag)));
  renderTags();
  renderBooks(books);
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
  list.forEach(book => {
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
    div.querySelector('h3').addEventListener('click', () => {
      const details = div.querySelector('.details');
      details.style.display = details.style.display === 'block' ? 'none' : 'block';
    });
    bookList.appendChild(div);
  });
}

function filterByTag(tag) {
  const filtered = books.filter(book => book.tags.includes(tag));
  renderBooks(filtered);
}

document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(q) ||
    book.author.toLowerCase().includes(q)
  );
  renderBooks(filtered);
});

loadBooks();
