const express = require("express");
const messageRouter = express.Router();
const {
  createMessage,
  getMessages,
  deleteMessageById,
  getMessagesByChatId,
  getLatestMessagesByChatId,
} = require("../controllers/message-controller");

// Route for creating a message
messageRouter.post("/", createMessage);

// Route for getting all messages
messageRouter.get("/", getMessages);

// Route for getting latest message
messageRouter.get("/chat/latestMessage/:chatId", getLatestMessagesByChatId);

// Route for getting all messages
messageRouter.get("/chat/:chatId", getMessagesByChatId);

// Route for deleting a message by its ID
messageRouter.delete("/:id", deleteMessageById);

module.exports = messageRouter;
