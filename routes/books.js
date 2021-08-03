const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

router.get('/', (req, res) => {
    res.render("books/index", {title: "Books-Home"});
});

router.get('/:type',async (req, res) => {
    try{
        const books = await Book.find({booktype: req.params.type});
        res.render('books/booksList', {books});
    }catch {
        res.redirect("/");
    }
});

router.get('/:type/:id', async (req, res) => {
    try{
        const book = await Book.findById(req.params.id).populate('seller').exec();
        res.render('books/view', {title: book.title, book: book});
    }catch(err){
        res.render('index', {title: "Home", user: req.user});
    }
});

router.get('/:type/:id/edit', async (req, res) => {
    try{
        const book = await Book.findById(req.params.id);
        if( req.user.id != book.seller ){
            res.redirect("/");
        }
      res.render('books/edit', {book: book});
    }catch{
      res.redirect('/profile');
    }
});

router.put('/:type/:id/edit', async (req, res) => {
    let book;
    try{
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.price = req.body.price;
        book.condition = req.body.condition;
        book.booktype = req.body.type;
        book.description = req.body.description;
        if( req.body.cover != null && req.body.cover !== ''){
            saveCover(book, req.body.cover);
        }
        await book.save();
        res.redirect('/profile');
    }catch{
        if( book == null ){
            res.redirect('/');
        }
        res.render('books/edit', {book, errorMessage: "Error updating book"});
    }
});

router.delete("/:type/:id", async (req, res) => {
    let book;
    try{
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/profile');
    }catch{
        if( book == null ){
            res.redirect('/');
        }
        res.redirect('/profile');
    }
});

function saveCover(book, coverEncoded) {
    if( coverEncoded == null ) return;
    const cover = JSON.parse(coverEncoded);
    if( cover != null &&  imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64');
      book.coverImageType = cover.type;
    }
}

module.exports = router;