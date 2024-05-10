const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", schema);
