const mongoose = require("mongoose");
const { Message } = require("../Models/MessageModel")

const createMessage = async (req, res) => {
    const { sender, content, chat } = req.body;

    const obj = {
        sender: sender,
        content: content,
        chat: chat,
    };

    const createdMessage = await Message.create(obj);
    const messageWithSender = await Message.find(createdMessage._id).populate('sender', '-password');
    res.status(201).send(messageWithSender);
};
const fetchAllMessage = async (req, res) => {
    const { chatID } = req.query;

    if (!mongoose.isValidObjectId(chatID)) {
        return res.status(400).send({ error: 'Invalid chatID' });
    }

    try {
        let allMessages = await Message.find({ chat: chatID }).populate('sender',"-password");
        res.status(200).send(allMessages);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching messages' });
    }
};

module.exports = {
    createMessage,
    fetchAllMessage
}