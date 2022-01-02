const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    age: {
        type: String
    },
    gender: {
        type: String
    },
    aboutme: {
        type: String
    },
    lookingfor: {
        type: String
    },
    avatar: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    address: {
        type: String
    },
    likes: {
        type: Array,
    },
    dislikes: {
        type: Array,
    },
    matches: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('User', userSchema)