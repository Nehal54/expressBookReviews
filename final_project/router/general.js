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
  
    if (users.some(user => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });

// Get the book list available in the shop
// general.js
const axios = require('axios'); // If using Node.js
// or use: import axios from 'axios'; if using ES modules

// Task 10: Get all books
async function getBooks() {
    try {
        const response = await axios.get('http://your-api-url/books');
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

// Task 11: Get book by ISBN
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://your-api-url/books/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book with ISBN ${isbn}:`, error);
        throw error;
    }
}

// Task 12: Get books by author
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`http://your-api-url/books/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error);
        throw error;
    }
}

// Task 13: Get books by title
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`http://your-api-url/books/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books with title ${title}:`, error);
        throw error;
    }
}

// Export all functions if using Node.js module system
module.exports = {
    getBooks,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle
};

