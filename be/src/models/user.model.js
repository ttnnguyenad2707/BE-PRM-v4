const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const User = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    isVip: {
        type: Boolean,
        default: false
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    status: {
        type: Boolean,
        default: true,
    },
    refreshToken: {
        type: String,
    },
    phone: {
        type: Number,
        minlength: 10,

    },
    avatar: {
        type: String,
        default: null,
    }
}, { timestamps: true });
module.exports = mongoose.model("User", User);