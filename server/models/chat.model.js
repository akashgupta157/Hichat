const mongoose = require("mongoose");
const chat = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    groupPicture: {
      type: String,
      default:
        "https://i.ibb.co/0hvhdRK/240-F-686603587-bo-Vdde3-U00-AMRWSVIMnz3-Gu-UBAouyued0.jpg",
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageModel",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ChatModel", chat);
