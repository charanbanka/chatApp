const express = require("express");
const chatsRouter = express.Router();

const {
  createChat,
  getAllChats,
  findAllChatsByMember,
} = require("../controllers/chat-controller");

// Chat Routes
chatsRouter.post("/", createChat); // Create a new chat
chatsRouter.get("/", getAllChats); // Create a new chat
chatsRouter.get("/:member", findAllChatsByMember); // Find all chats by member

module.exports = chatsRouter;
