const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 1: Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   return res.status(200).send(JSON.stringify(books, null, 2));
// });

// Task 1 (Async): Get the book list available in the shop using async callback
public_users.get('/', async (req, res) => {
  try {
    // Simulate async operation (e.g., DB or external API)
    const getBooksAsync = () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(books), 100); // Simulate delay
      });
    };
    const allBooks = await getBooksAsync();
    return res.status(200).send(JSON.stringify(allBooks, null, 2));
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 2: Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     return res.status(200).send(JSON.stringify(book, null, 2));
//   } else {
//     return res.status(404).json({message: "Book not found"});
//   }
// });

// Task 2 (Async): Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  // Simulate async operation using Promise
  const getBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      }, 100); // Simulate delay
    });
  };

  getBookByIsbn(isbn)
    .then(book => res.status(200).send(JSON.stringify(book, null, 2)))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const result = [];
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author === author) {
      result.push({isbn, ...books[isbn]});
    }
  });
  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 2));
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const result = [];
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title === title) {
      result.push({isbn, ...books[isbn]});
    }
  });
  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 2));
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 2));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
