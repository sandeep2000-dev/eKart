const express = require('express');
const router = express.Router();
const passport = require('passport');

function checkNotAuthenticated(req, res, next) {
    if( req.isAuthenticated()){
      return res.redirect('/');
    }
    next();
}

router.get('/', checkNotAuthenticated, (req, res) =>{
    res.render('login', {title: "Login"});
});

router.post("/", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;