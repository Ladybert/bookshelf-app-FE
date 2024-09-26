const bookForm = document.getElementById("bookForm");
const bookFormTitle = document.getElementById("bookFormTitle");
const bookFormAuthor = document.getElementById("bookFormAuthor");
const bookFormYear = document.getElementById("bookFormYear");
const bookFormIsComplete = document.getElementById("bookFormIsComplete");
const bookFormSubmit = document.getElementById("bookFormSubmit");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");
const searchBook = document.getElementById("searchBook");
const searchBookTitle = document.getElementById("searchBookTitle");

const BOOKS_KEY = "bookshelfAppBooks";

const getBooksFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];
};

const saveBooksToLocalStorage = (books) => {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
};

const addBook = (title, author, year, isComplete) => {
  const books = getBooksFromLocalStorage();
  const newBook = {
    id: new Date().getTime(),
    title,
    author,
    year: Number(year),
    isComplete,
  };
  books.push(newBook);
  saveBooksToLocalStorage(books);
  renderBooks();
};

const deleteBook = (id) => {
  let books = getBooksFromLocalStorage();
  books = books.filter((book) => book.id !== id);
  saveBooksToLocalStorage(books);
  renderBooks();
};

const editBook = (id, newTitle, newAuthor, newYear, newIsComplete) => {
  let books = getBooksFromLocalStorage();
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      title: newTitle,
      author: newAuthor,
      year: Number(newYear),
      isComplete: newIsComplete,
    };
    saveBooksToLocalStorage(books);
    renderBooks();
  }
};

const toggleBookComplete = (id) => {
  let books = getBooksFromLocalStorage();
  const bookIndex = books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToLocalStorage(books);
    renderBooks();
  }
};

const searchBooks = (query) => {
  const books = getBooksFromLocalStorage();
  return books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );
};

const renderBooks = (query = "") => {
  const books = query ? searchBooks(query) : getBooksFromLocalStorage();
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem"); // Tambahkan data-testid untuk bookItem
    
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button class="toggle-complete" data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum" : "Selesai"} dibaca
        </button>
        <button class="edit-buku">Edit Buku</button>
        <button class="hapus-buku" data-testid="bookItemDeleteButton">Hapus Buku</button> 
      </div>
    `;

    bookElement.querySelector(".hapus-buku").addEventListener("click", () => {
      const isConfirmed = confirm(
        "Apakah Anda yakin ingin menghapus buku ini?"
      );
      if (isConfirmed) {
        deleteBook(book.id);
      }
    });

    bookElement.querySelector(".edit-buku").addEventListener("click", () => {
      const newTitle = prompt("Edit Judul", book.title) || book.title;
      const newAuthor = prompt("Edit Penulis", book.author) || book.author;
      const newYear = prompt("Edit Tahun", book.year) || book.year;
      const parsedYear = parseInt(newYear);
      const validYear = !isNaN(parsedYear) ? parsedYear : book.year;
      const newIsComplete = confirm("Selesai dibaca?") ? true : book.isComplete;
      editBook(book.id, newTitle, newAuthor, validYear, newIsComplete);
    });

    bookElement
      .querySelector(".toggle-complete")
      .addEventListener("click", () => {
        toggleBookComplete(book.id);
      });

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
};


bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = bookFormTitle.value;
  const author = bookFormAuthor.value;
  const year = bookFormYear.value;
  const isComplete = bookFormIsComplete.checked;

  addBook(title, author, year, isComplete);
  
  bookForm.reset();
  bookFormSubmit.querySelector("span").textContent = "Belum selesai dibaca";
});

searchBook.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchBookTitle.value;
  renderBooks(query);
});

document.addEventListener("DOMContentLoaded", () => {
  renderBooks();
});

bookFormIsComplete.addEventListener("change", (event) => {
  const isChecked = event.target.checked;
  bookFormSubmit.querySelector("span").textContent = isChecked
    ? "Selesai dibaca"
    : "Belum selesai dibaca";
});
