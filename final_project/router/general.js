const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
//register
public_users.post('/register', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).send('Username and password are required');
  } else if (users[username]) {
    res.status(400).send('Username already exists');
  } else {
    users[username] = password;
    res.status(200).send('Registration successful');
  }
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/',function (req, res) {
  const bookList = JSON.stringify(books);
  return res.status(200).json(bookList);
});



// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
//  });
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).send(book);
  } else {
    res.status(404).send('Book not found');
  }
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookList = [];
  const keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].author === author) {
      bookList.push(books[key]);
    }
  });
  if (bookList.length > 0) {
    res.status(200).send(bookList);
  } else {
    res.status(404).send('Books not found');
  }
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookList = [];
  const keys = Object.keys(books);
  keys.forEach((key) => {
    if (books[key].title === title) {
      bookList.push(books[key]);
    }
  });
  if (bookList.length > 0) {
    res.status(200).send(bookList);
  } else {
    res.status(404).send('Books not found');
  }
});


//  Get book review
// public_users.get('/review/:isbn',function (req, res) {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    res.status(404).send(`Book with ISBN ${isbn} not found.`);
  } else {
    const reviews = book.reviews;
    res.send(reviews);
  }
});





module.exports.general = public_users;