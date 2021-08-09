const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Electronic = require("../models/Electronic");
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

router.get('/', (req, res) => {
    res.render("electronics/index");
});

router.get('/:type',async (req, res) => {
    try{
        const electronics = await Electronic.find({type: req.params.type});
        res.render('electronics/electronicList', {electronics: electronics});
    }catch {
        res.redirect("/");
    }
});

router.get('/:type/:id', async (req, res) => {
    try{
        const electronic = await Electronic.findById(req.params.id).populate('seller').exec();
        const user = await User.findById(req.user.id);
        let added;
        if( user.id === electronic.seller.id ) added = true;
        else added = user.cart.electronics.includes(req.params.id);
        res.render('electronics/view', {added: added, electronic: electronic});
    }catch(err){
        console.log(err);
        res.redirect("/");
    }
});

router.get('/:type/:id/edit', async (req, res) => {
    try{
        const electronic = await Electronic.findById(req.params.id);
        if( req.user.id != electronic.seller ){
            res.redirect("/");
        }
      res.render('electronics/edit', {electronic: electronic});
    }catch{
      res.redirect('/profile');
    }
});

router.get('/:type/:id/addToCart', async (req, res) => {
    let user;
    let electronic;
    try{
        user = await User.findById(req.user.id);
        electronic = await Electronic.findById(req.params.id).populate("seller").exec();
        user.cart.electronics.push(req.params.id);
        await user.save();
        res.redirect(`/electronics/${req.params.type}/${req.params.id}`); 
    }catch{
        if( user == null || electronic == null ){
            res.redirect("/");
        }
        res.render("electronics/view", {electronic: electronic, added: false, errorMessage: "Error adding to cart"});
    }
});

router.put('/:type/:id/edit', async (req, res) => {
    let electronic;
    try{
        electronic = await Electronic.findById(req.params.id);
        electronic.productName = req.body.name;
        electronic.price = req.body.price;
        electronic.condition = req.body.condition;
        electronic.type = req.body.type;
        electronic.description = req.body.description;
        if( req.body.image != null && req.body.image !== ''){
            saveCover(electronic, req.body.image);
        }
        await electronic.save();
        res.redirect('/profile');
    }catch{
        if( electronic == null ){
            res.redirect('/');
        }
        res.render('electronics/edit', {electronic, errorMessage: "Error updating book"});
    }
});

router.delete("/:type/:id", async (req, res) => {
    let electronic;
    try{
        electronic = await Electronic.findById(req.params.id);
        await electronic.remove();
        res.redirect('/profile');
    }catch{
        if( electronic == null ){
            res.redirect('/');
        }
        res.redirect('/profile');
    }
});

function saveCover(electronic, imageEncoded) {
    if( imageEncoded == null ) return;
    const image = JSON.parse(imageEncoded);
    if( image != null &&  imageMimeTypes.includes(image.type)) {
      electronic.Image = new Buffer.from(image.data, 'base64');
      electronic.ImageType = image.type;
    }
}


module.exports = router;