const mongoose = require("mongoose");
const Interior = new mongoose.Schema({
    name: {
        type: String,
    },
}, { timestamps: true });
module.exports = mongoose.model("Interior", Interior);
