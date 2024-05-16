const MessageModel = require("../models/messageModel");

const createMessage = async (req, res) => {
  try {
    const message = new MessageModel(req.body);
    await message.save();
    console.log("createMessage => success", message);
    res.json({ status: "success", data: message });
  } catch (error) {
    console.error("createMessage error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to create message" });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find();
    res.json({ status: "success", data: messages });
  } catch (error) {
    console.error("getMessages error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to retrieve messages" });
  }
};

const getMessagesByChatId = async (req, res) => {
  try {
    let chatId = req.params.chatId;
    const messages = await MessageModel.find({ chatId });
    res.json({ status: "success", data: messages });
  } catch (error) {
    console.error("getMessages error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to retrieve messages" });
  }
};

const getLatestMessagesByChatId = async (req, res) => {
  try {
    let chatId = req.params.chatId;
    const latestMessage = await MessageModel.findOne({ chatId })
      .sort({ createdAt: -1 }) // Sort messages by creation date in descending order
      .limit(1); // Limit the result to one message
    res.json({ status: "success", data: latestMessage });
  } catch (error) {
    console.error("getLatestMessagesByChatId error:", error);
    res.status(500).json({
      status: "failed",
      message: "Failed to retrieve the latest message",
    });
  }
};

const deleteMessageById = async (req, res) => {
  const id = req.params.id;
  try {
    console.log("deleteMessageById id=>", id);
    await MessageModel.findByIdAndDelete(id);
    res.json({ status: "success" });
  } catch (error) {
    console.error("deleteMessageById error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Failed to delete message" });
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessagesByChatId,
  deleteMessageById,
  getLatestMessagesByChatId
};
