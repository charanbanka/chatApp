const express = require("express");
const messageRouter = express.Router();
const {
  createMessage,
  getMessages,
  deleteMessageById,
  getMessagesByChatId,
} = require("../controllers/message-controller");

// Route for creating a message
messageRouter.post("/", createMessage);

// Route for getting all messages
messageRouter.get("/", getMessages);

// Route for getting all messages
messageRouter.get("/chat/:chatId", getMessagesByChatId);

// Route for deleting a message by its ID
messageRouter.delete("/:id", deleteMessageById);

module.exports = messageRouter;
