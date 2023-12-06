const mongoose = require("mongoose");
const chat = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageModel",
    },
    groupAdmin: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ChatModel", chat);
