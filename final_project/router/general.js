const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(409).json({ message: "User already exists" });
  }

  users[username] = { password: password };
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async (req, res) => {
  try {
    // Assume 'books' is defined somewhere in your code
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = books[isbn];

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get book details based on author
public_users.get("/author/:author", (req, res) => {
  try {
    const { author } = req.params;

    const bookList = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (bookList.length > 0) {
      return res.status(200).json(bookList);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    } 
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", (req, res) => {
  try {
    const { title } = req.params;
    const bookList = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (bookList.length > 0) {
      return res.status(200).json(bookList);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get book review
public_users.get("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
