// import required modules/packages
const mongoose = require("mongoose");

// user schema instance
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// userSchema model instance
const User = mongoose.model("user", userSchema);

// export model instance 
module.exports = User;