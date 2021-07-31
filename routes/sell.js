const express = require("express");
const router = express.Router();
const Book = require('../models/Book');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

router.get("/", (req, res) => {
  res.render("sell/index", { title: "Sell" });
});

router.get("/books", (req, res) => {
  const book = new Book();
  res.render("sell/books/listing_form", { title: "Sell", book });
});

router.post('/books', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    booktype: req.body.type,
    price: req.body.price,
  });

  saveCover( book, req.body.cover );
  try{
    const newBook = await book.save();
    res.redirect('/books');
  }catch{
    res.render("sell/books/listing_form", { title: "Sell", book, errorMessage: "Error creating book" });
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
