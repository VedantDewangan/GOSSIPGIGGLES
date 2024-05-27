const express = require("express");
const { createMessage, fetchAllMessage } = require("../controller/MessageController");
const MessageRouter = express.Router();

MessageRouter.post("/createMessage", createMessage);
MessageRouter.get("/fetchAllMessage", fetchAllMessage);

module.exports = { MessageRouter }