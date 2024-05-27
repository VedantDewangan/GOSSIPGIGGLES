const express = require("express");
const { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup ,updateLatestMessage} = require("../controller/ChatController");
const ChatRouter = express.Router();

ChatRouter.post("/accessChat", accessChat)
ChatRouter.get("/fetchChat", fetchChat)
ChatRouter.post("/createGroupChat", createGroupChat)
ChatRouter.put("/updateLatestMessage",updateLatestMessage)
// ChatRouter.put("/renameGroup", renameGroup)
// ChatRouter.put("/addToGroup", addToGroup)
// ChatRouter.put("/removeFromGroup", removeFromGroup)

module.exports = { ChatRouter }