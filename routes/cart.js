const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get("/", async (req, res) =>{
    try{
        const user = await User.findById(req.user.id).populate("cart.books").populate("cart.electronics").populate("cart.vehicles").populate("cart.sports").populate("cart.others").exec();
        res.render("cart/index", {user: user});
    }
    catch{
        res.redirect("/");
    }
});

router.delete("/:type/:id", async (req, res) => {
    let user;
    try{
        user = await User.findById(req.user.id);
        const index = user.cart[req.params.type].indexOf(req.params.id);
        user.cart[req.params.type].splice(index, 1);
        await user.save();
        res.redirect("/cart");
    }
    catch{
        if( user === null ){
            res.redirect("/");
        }
        res.redirect("/cart");
    }
})

module.exports = router;