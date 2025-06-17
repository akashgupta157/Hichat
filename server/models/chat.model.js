const mongoose = require("mongoose");
const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    groupPicture: {
      type: String,
      default:
        "https://i.ibb.co/0hvhdRK/240-F-686603587-bo-Vdde3-U00-AMRWSVIMnz3-Gu-UBAouyued0.jpg",
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Chat", chatSchema);
