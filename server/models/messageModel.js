const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    senderId: { type: String, required: true },
    chatId: { type: String, required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messageModel", schema);
