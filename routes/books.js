const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/', (req, res) => {
    res.render("books/index", {title: "Books-Home"});
});

router.get('/educational',async (req, res) => {
    try{
        const books = await Book.find({booktype: "educational"});
        res.render('books/educational', {title: "Educational Books", books});
    }catch {
        res.redirect("/");
    }
});

router.get('/entertainment', async (req, res) => {
    try{
        const books = await Book.find({booktype: "entertainment"});
        res.render('books/entertainment', {title: "Entertainment Books", books});
    }catch {
        res.redirect("/");
    }
});

module.exports = router;