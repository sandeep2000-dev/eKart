const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, default: "", trim: true, required: true},
    email: {type: String, default: "", required: true},
    password: {type: String, default: "", required: true}
});

module.exports = mongoose.model('User', UserSchema);