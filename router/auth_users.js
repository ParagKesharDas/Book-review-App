const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: 'ParagDas',
    password: '456123'
  },
  {
    username: 'jane',
    password: 'password456'
  }
];

const secretKey = 'mysecretkey';

const isValid = (username)=>{ //returns boolean
  const user = users.find(user => user.username === username);
  return !!user;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(user => user.username === username && user.password === password);
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  return res.status(200).json({ massage:"Successfully Login "+token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query;
  const { isbn } = req.params.isbn;
  const username = req.user.username;
  
  if (!review) {
    return res.status(400).json({ message: "Please provide a review for the book" });
  }

  const bookIndex = books.findIndex(book => book.isbn === isbn);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  const existingReviewIndex = books[bookIndex].reviews.findIndex(review => review.username === username);

  if (existingReviewIndex === -1) {
    // Add new review
    books[bookIndex].reviews.push({ username, review });
    return res.status(201).json({ message: "Review added successfully" });
  } else {
    // Modify existing review
    books[bookIndex].reviews[existingReviewIndex].review = review;
    return res.status(200).json({ message: "Review modified successfully" });
  }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;
  
  const reviewIndex = books.findIndex(book => book.isbn === isbn && book.reviews.some(review => review.username === username));
  
  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found" });
  }
  
  const review = books[reviewIndex].reviews.find(review => review.username === username);
  
  books[reviewIndex].reviews = books[reviewIndex].reviews.filter(review => review.username !== username);
  
  return res.status(200).json({ message: `Review deleted for book with ISBN ${isbn}`, review: review });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
