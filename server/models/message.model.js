const mongoose = require("mongoose");
const message = mongoose.Schema(
  {
    sender: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }],
    receiver: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }],
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "ChatModel" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("MessageModel", message);
