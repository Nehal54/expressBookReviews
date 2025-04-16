const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
users.push({ username: "Nola", password: "Final2025" });

const isValid = (username) => {
    return users.some(user => user.username === username);
};  

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
  };
  
  // Only registered users can login
  regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign(
        { username },  // Changed from password to username for security
        "access",
        { expiresIn: '1h' }
      );
  
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).json({ 
        message: "User successfully logged in",
        token: accessToken  // Return token to client
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
  
  // Add or modify a book review
  regd_users.put("/auth/review/:isbn", (req, res) => {
    const { username } = req.session.authorization;
    const isbn = req.params.isbn;
    const review = req.query.review;
  
    if (!review) {
      return res.status(400).json({ message: "Review text is required" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    books[isbn].reviews = books[isbn].reviews || {};
    
    const action = books[isbn].reviews[username] ? "updated" : "added";
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ 
      message: `Review ${action} successfully`,
      book: books[isbn] 
    });
  });
  
  // Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.session.authorization;
    const isbn = req.params.isbn;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
    }
  
    delete books[isbn].reviews[username];
    return res.status(200).json({ 
      message: "Review deleted successfully",
      book: books[isbn]
    });
  });
  
  module.exports.authenticated = regd_users;
  module.exports.isValid = isValid;
  module.exports.users = users;