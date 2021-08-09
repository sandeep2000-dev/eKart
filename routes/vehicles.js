const express = require('express');
const router = express.Router();
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

router.get('/', (req, res) => {
    res.render("vehicles/index");
});

router.get('/:type',async (req, res) => {
    try{
        const vehicles = await Vehicle.find({type: req.params.type});
        res.render('vehicles/vehicleList', {vehicles: vehicles});
    }catch {
        res.redirect("/");
    }
});

router.get('/:type/:id', async (req, res) => {
    try{
        const vehicle = await Vehicle.findById(req.params.id).populate('seller').exec();
        const user = await User.findById(req.user.id);
        let added;
        if( user.id === vehicle.seller.id ) added = true;
        else added = user.cart.vehicles.includes(req.params.id);
        res.render('vehicles/view', {added: added, vehicle: vehicle});
    }catch(err){
        console.log(err);
        res.redirect("/");
    }
});

router.get('/:type/:id/edit', async (req, res) => {
    try{
        const vehicle = await Vehicle.findById(req.params.id);
        if( req.user.id != vehicle.seller ){
            res.redirect("/");
        }
      res.render('vehicles/edit', {vehicle: vehicle});
    }catch{
      res.redirect('/profile');
    }
});

router.get('/:type/:id/addToCart', async (req, res) => {
    let user;
    let vehicle;
    try{
        user = await User.findById(req.user.id);
        vehicle = await Vehicle.findById(req.params.id).populate("seller").exec();
        user.cart.vehicles.push(req.params.id);
        await user.save();
        res.redirect(`/vehicles/${req.params.type}/${req.params.id}`); 
    }catch{
        if( user == null || vehicle == null ){
            res.redirect("/");
        }
        res.render("vehicles/view", {vehicle: vehicle, added: false, errorMessage: "Error adding to cart"});
    }
});

router.put('/:type/:id/edit', async (req, res) => {
    let vehicle;
    try{
        vehicle = await Vehicle.findById(req.params.id);
        vehicle.productName = req.body.name;
        vehicle.price = req.body.price;
        vehicle.condition = req.body.condition;
        vehicle.type = req.body.type;
        vehicle.description = req.body.description;
        if( req.body.image != null && req.body.image !== ''){
            saveCover(vehicle, req.body.image);
        }
        await vehicle.save();
        res.redirect('/profile');
    }catch{
        if( vehicle == null ){
            res.redirect('/');
        }
        res.render('vehicles/edit', {vehicle, errorMessage: "Error updating book"});
    }
});

router.delete("/:type/:id", async (req, res) => {
    let vehicle;
    try{
        vehicle = await Vehicle.findById(req.params.id);
        await vehicle.remove();
        res.redirect('/profile');
    }catch{
        if( vehicle == null ){
            res.redirect('/');
        }
        res.redirect('/profile');
    }
});

function saveCover(vehicle, imageEncoded) {
    if( imageEncoded == null ) return;
    const image = JSON.parse(imageEncoded);
    if( image != null &&  imageMimeTypes.includes(image.type)) {
      vehicle.Image = new Buffer.from(image.data, 'base64');
      vehicle.ImageType = image.type;
    }
}

module.exports = router;