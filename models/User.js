const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, default: "", trim: true, required: true},
    email: {type: String, default: "", required: true},
    password: {type: String, default: "", required: true},
    cart: {
        books: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}],
        electronics: [{type: mongoose.Schema.Types.ObjectId, ref: "Electronic"}],
        vehicles: [{type: mongoose.Schema.Types.ObjectId, ref: "Vehicle"}],
        sports: [{type: mongoose.Schema.Types.ObjectId, ref: "Sport"}],
    }
});

module.exports = mongoose.model('User', UserSchema);