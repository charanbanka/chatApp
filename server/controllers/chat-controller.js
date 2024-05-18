const UserModel = require("../models/userModel"); // Assuming UserModel represents the Mongoose model for users
const ChatModel = require("../models/chatModel"); // Assuming ChatModel represents the Mongoose model for chats
const MessageModel = require("../models/messageModel");
const { getLatestMessagesByChatIdService } = require("./message-controller");

const createChat = async (req, res) => {
  try {
    const userIds = req.body.members;

    // Check if all user IDs exist in the database
    const users = await UserModel.find({ _id: { $in: userIds } });

    if (users.length !== userIds.length) {
      // Not all users were found
      return res
        .status(404)
        .json({ status: "failed", message: "Some user IDs are invalid" });
    }

    // Create a new chat with the specified members
    const chat = new ChatModel({ members: userIds });
    await chat.save();

    // Return success response
    res.json({ status: "success", data: chat });
  } catch (error) {
    console.error("createChat error:", error);
    res.status(500).json({
      status: "failed",
      message: "An error occurred while creating the chat",
    });
  }
};

const getAllChats = async (req, res) => {
  try {
    // Check if all user IDs exist in the database
    const chats = await ChatModel.find();

    // Return success response
    res.json({ status: "success", data: chats });
  } catch (error) {
    console.error("getAllChats error:", error);
    res.status(500).json({
      status: "failed",
      message: "An error occurred while creating the chat",
    });
  }
};

const findAllChatsByMember = async (req, res) => {
  try {
    const member = req.params.member;
    // Find all chats where the members array contains the given member
    const chats = await ChatModel.find({ members: member });

    // Check if any chats are found
    if (!chats || chats.length === 0) {
      return res.status(404).json({
        status: "failed",
        message: "No chats found for the given member",
      });
    }

    // Populate the messages for each chat
    for (const chat of chats) {
      chat.messages = (await MessageModel.find({ chatId: chat._id })) || [];
    }

    // Sort the chats based on the timestamp of the latest message
    chats.sort((a, b) => {
      const latestMessageA = a.messages[a.messages.length - 1];
      const latestMessageB = b.messages[b.messages.length - 1];

      // If both chats have no messages, consider them equal
      if (!latestMessageA && !latestMessageB) return 0;

      // If one chat has no messages, consider the chat with messages as greater
      if (!latestMessageA) return 1;
      if (!latestMessageB) return -1;

      // Compare the timestamps of the latest messages
      return latestMessageB.createdAt - latestMessageA.createdAt;
    });

    // Return success response with sorted chats
    res.json({ status: "success", data: chats });
  } catch (error) {
    console.error("findAllChatsByMember error:", error);

    res.status(500).json({
      status: "failed",
      message: "An error occurred while finding chats by member",
    });
  }
};

const getAllChatsBy = async (req, res) => {
  try {
    // Query the messages collection to find the latest message for each chat
    const latestMessages = await MessageModel.aggregate([
      // Group by chatId and find the latest message for each chat
      { $group: { _id: "$chatId", latestMessage: { $last: "$createdAt" } } },
    ]);

    // Extract senderId from each latest message
    const senderIds = latestMessages.map((message) => message._id);

    // Query the chats collection to retrieve the corresponding user for each chat
    const latestUsers = await ChatModel.find({ _id: { $in: senderIds } });

    // Return success response with latest users
    res.json({ status: "success", data: latestUsers });
  } catch (error) {
    console.error("getAllChats error:", error);
    res.status(500).json({
      status: "failed",
      message: "An error occurred while retrieving the latest users",
    });
  }
};

module.exports = { createChat, findAllChatsByMember, getAllChats };
