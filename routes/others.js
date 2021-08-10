const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Other = require("../models/Other");
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

router.get('/', async (req, res) => {
    try{
        const others = await Other.find();
        res.render('others/index', {others: others});
    }catch {
        res.redirect("/");
    }
});

router.get('/:id', async (req, res) => {
    try{
        const other = await Other.findById(req.params.id).populate('seller').exec();
        const user = await User.findById(req.user.id);
        let added;
        if( user.id === other.seller.id ) added = true;
        else added = user.cart.others.includes(req.params.id);
        res.render('others/view', {added: added, other: other});
    }catch(err){
        console.log(err);
        res.redirect("/");
    }
});

router.get('/:id/edit', async (req, res) => {
    try{
        const other = await Other.findById(req.params.id);
        if( req.user.id != other.seller ){
            res.redirect("/");
        }
      res.render('others/edit', {other: other});
    }catch{
      res.redirect('/profile');
    }
});

router.get('/:id/addToCart', async (req, res) => {
    let user;
    let other;
    try{
        user = await User.findById(req.user.id);
        other = await Other.findById(req.params.id).populate("seller").exec();
        user.cart.others.push(req.params.id);
        await user.save();
        res.redirect(`/others/${req.params.id}`); 
    }catch{
        if( user == null || other == null ){
            res.redirect("/");
        }
        res.render("others/view", {other: other, added: false, errorMessage: "Error adding to cart"});
    }
});

router.put('/:id/edit', async (req, res) => {
    let other;
    try{
        other = await Other.findById(req.params.id);
        other.productName = req.body.name;
        other.price = req.body.price;
        other.condition = req.body.condition;
        other.description = req.body.description;
        if( req.body.image != null && req.body.image !== ''){
            saveCover(other, req.body.image);
        }
        await other.save();
        res.redirect('/profile');
    }catch{
        if( other == null ){
            res.redirect('/');
        }
        res.render('others/edit', {other, errorMessage: "Error updating book"});
    }
});

router.delete("/:id", async (req, res) => {
    let other;
    try{
        other = await Other.findById(req.params.id);
        await other.remove();
        res.redirect('/profile');
    }catch{
        if( other == null ){
            res.redirect('/');
        }
        res.redirect('/profile');
    }
});

function saveCover(other, imageEncoded) {
    if( imageEncoded == null ) return;
    const image = JSON.parse(imageEncoded);
    if( image != null &&  imageMimeTypes.includes(image.type)) {
      other.Image = new Buffer.from(image.data, 'base64');
      other.ImageType = image.type;
    }
}
module.exports = router;