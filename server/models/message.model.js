const mongoose = require("mongoose");
const message = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "ChatModel" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("MessageModel", message);
