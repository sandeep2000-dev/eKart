const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Electronic = require('../models/Electronic');
const Vehicle = require('../models/Vehicle');
const Sport = require('../models/Sport');

router.get('/', async (req, res) => {
    try{
        const books = await Book.find({seller: req.user.id});
        const electronics = await Electronic.find({seller: req.user.id});
        const vehicles = await Vehicle.find({seller: req.user.id});
        const sports = await Sport.find({seller: req.user.id});
        res.render('profile/index', {user: req.user, books: books, electronics: electronics, vehicles: vehicles, sports: sports} );
    }catch(err){
        res.redirect('/');
    }
});

router.get("/edit", (req, res) => {
    res.render('profile/editProfile', {user: req.user});
});

router.put("/edit", async (req, res) => {
    let user;
    try{
        user = await User.findById(req.user.id);
        user.name = req.body.name;
        await user.save();
        res.redirect("/profile");
    }catch{
        if( user == null ){
            res.redirect('/');
        }
        res.render('profile/editProfile', {errorMessage: "Error updating profile", user: user});
    }
});

module.exports = router;