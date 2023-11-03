const mongoose = require("mongoose");

const Images = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
}, { timestamps: true });
module.exports = mongoose.model("Images", Images);