const express = require("express");
const router = express.Router();
const Book = require('../models/Book');
const Electronic = require('../models/Electronic');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

router.get("/", (req, res) => {
  res.render("sell/index", { title: "Sell" });
});

router.get("/books", (req, res) => {
  const book = new Book();
  res.render("sell/books/listing_form", { title: "Sell", book });
});

router.get("/electronics", (req, res) => {
  const electronic = new Electronic();
  res.render("sell/electronics/listing_form", { title: "Sell", electronic });
});

router.post('/books', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    booktype: req.body.type,
    price: req.body.price,
    condition: req.body.condition,
    seller: req.user.id,
});

  saveCover( book, req.body.cover );

  try{
    const newBook = await book.save();
    res.redirect(`/books/${newBook.booktype}/${newBook.id}`);
  }catch{
    res.render("sell/books/listing_form", { title: "Sell", book, errorMessage: "Error creating book" });
  }
});

router.post('/electronics', async (req, res) => {
  const electronic = new Electronic({
    productName: req.body.name,
    description: req.body.description,
    type: req.body.type,
    price: req.body.price,
    condition: req.body.condition,
    seller: req.user.id,
  });

  saveCover( electronic, req.body.image );

  try{
    const newProduct = await electronic.save();
    res.redirect(`/electronics/${newProduct.type}/${newProduct.id}`);
  }catch{
    res.render("sell/electronics/listing_form", { title: "Sell", electronic, errorMessage: "Error creating product" });
  }
});

function saveCover(product, imageEncoded) {
  if( imageEncoded == null ) return;
  const image = JSON.parse(imageEncoded);
  if( image != null &&  imageMimeTypes.includes(image.type)) {
    product.Image = new Buffer.from(image.data, 'base64');
    product.ImageType = image.type;
  }
}

module.exports = router;
