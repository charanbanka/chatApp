const UserModel = require("../models/userModel"); // Assuming UserModel represents the Mongoose model for users
const ChatModel = require("../models/chatModel"); // Assuming ChatModel represents the Mongoose model for chats

const createChat = async (req, res) => {
  try {
    const userIds = req.body.userIds;

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
    res.json({ status: "success" });
  } catch (error) {
    console.error("createChat error:", error);
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

    // Return success response
    res.json({ status: "success", data: chats });
  } catch (error) {
    console.error("findAllChatsByMember error:", error);

    res.status(500).json({
      status: "failed",
      message: "An error occurred while findAllChatsByMember",
    });
  }
};

module.exports = { createChat, findAllChatsByMember };
