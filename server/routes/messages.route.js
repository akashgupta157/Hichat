const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");
const router = require("express").Router();
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await messageModel
      .find({ chat: id })
      .populate("sender", "name profilePicture email")
      .populate("chat");
    res.json(msg);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.post("/", async (req, res) => {
  const { content, chatId } = req.body;
  var newMsg = {
    sender: req.user.userId,
    content,
    chat: chatId,
  };
  try {
    var message = await messageModel.create(newMsg);
    message = await message.populate("sender", "name profilePicture email");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.members",
      select: "name profilePicture email",
    });
    await chatModel.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });
    res.json(message);
  } catch (error) {
    res.send(error.message);
  }
});
module.exports = router;
