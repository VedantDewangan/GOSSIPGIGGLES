const mongoose = require("mongoose");

const MessageModel = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required:true
    },
    content: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: true
});

const Message = new mongoose.model("Message", MessageModel);

module.exports = { Message };