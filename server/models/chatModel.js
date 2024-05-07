const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    members: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chatModel", schema);
