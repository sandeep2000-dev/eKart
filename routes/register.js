const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

function checkNotAuthenticated(req, res, next) {
    if( req.isAuthenticated()){
      return res.redirect('/');
    }
    next();
}

router.get("/", checkNotAuthenticated, (req, res) => {
    res.render("register", {title: "Register"});
});

router.post("/", checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });

      const result = await user.save();
      res.redirect("/login");
      
    } catch (err) {
      res.redirect("/register");
    }
});

module.exports = router;
