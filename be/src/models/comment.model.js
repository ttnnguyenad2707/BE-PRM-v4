const mongoose = require("mongoose");
const ReplySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        require:true,
    },
    like: {
        type: Number,
        default: 0,
    }
});
const LikeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
})
const Comment = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        require: true
    },
    like : {
        type: Number,
        default: 0
    },
    likes: {
        type: [LikeSchema],
    },
    reply: {
        type: [ReplySchema],
    }

}, { timestamps: true });
module.exports = mongoose.model("Comment", Comment);
