const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Sport = require("../models/Sport");
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];


router.get('/', (req, res) => {
    res.render("sports/index");
});

router.get('/:type',async (req, res) => {
    try{
        const sports = await Sport.find({type: req.params.type});
        res.render('sports/sportList', {sports: sports});
    }catch {
        res.redirect("/");
    }
});

router.get('/:type/:id', async (req, res) => {
    try{
        const sport = await Sport.findById(req.params.id).populate('seller').exec();
        const user = await User.findById(req.user.id);
        let added;
        if( user.id === sport.seller.id ) added = true;
        else added = user.cart.sports.includes(req.params.id);
        res.render('sports/view', {added: added, sport: sport});
    }catch(err){
        console.log(err);
        res.redirect("/");
    }
});

router.get('/:type/:id/edit', async (req, res) => {
    try{
        const sport = await Sport.findById(req.params.id);
        if( req.user.id != sport.seller ){
            res.redirect("/");
        }
      res.render('sports/edit', {sport: sport});
    }catch{
      res.redirect('/profile');
    }
});

router.get('/:type/:id/addToCart', async (req, res) => {
    let user;
    let sport;
    try{
        user = await User.findById(req.user.id);
        sport = await Sport.findById(req.params.id).populate("seller").exec();
        user.cart.sports.push(req.params.id);
        await user.save();
        res.redirect(`/sports/${req.params.type}/${req.params.id}`); 
    }catch{
        if( user == null || sport == null ){
            res.redirect("/");
        }
        res.render("sports/view", {sport: sport, added: false, errorMessage: "Error adding to cart"});
    }
});

router.put('/:type/:id/edit', async (req, res) => {
    let sport;
    try{
        sport = await Sport.findById(req.params.id);
        sport.productName = req.body.name;
        sport.price = req.body.price;
        sport.condition = req.body.condition;
        sport.type = req.body.type;
        sport.description = req.body.description;
        if( req.body.image != null && req.body.image !== ''){
            saveCover(sport, req.body.image);
        }
        await sport.save();
        res.redirect('/profile');
    }catch{
        if( sport == null ){
            res.redirect('/');
        }
        res.render('sports/edit', {sport, errorMessage: "Error updating book"});
    }
});

router.delete("/:type/:id", async (req, res) => {
    let sport;
    try{
        sport = await Sport.findById(req.params.id);
        await sport.remove();
        res.redirect('/profile');
    }catch{
        if( sport == null ){
            res.redirect('/');
        }
        res.redirect('/profile');
    }
});

function saveCover(sport, imageEncoded) {
    if( imageEncoded == null ) return;
    const image = JSON.parse(imageEncoded);
    if( image != null &&  imageMimeTypes.includes(image.type)) {
      sport.Image = new Buffer.from(image.data, 'base64');
      sport.ImageType = image.type;
    }
}

module.exports = router;