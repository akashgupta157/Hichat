const chatModel = require("../models/chat.model");
const userModel = require("../models/user.model");

const router = require("express").Router();
router.post("/", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(404).send("User not found");
  }
  var chat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { members: { $elemMatch: { $eq: req.user.userId } } },
        { members: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("members", "-password")
    .populate("latestMessage");
  chat = await userModel.populate(chat, {
    path: "latestMessage.sender",
    select: "name profilePicture  email",
  });
  if (chat.length > 0) {
    res.send(chat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      user: [req.user.userId, userId],
    };
    try {
      const createdChat = await chatModel.create(chatData);
      const FullChat = await chatModel
        .findOne({
          _id: createdChat._id,
        })
        .populate("members", "-password");
      res.json(FullChat);
    } catch (err) {
      console.log(err);
    }
  }
});

router.get("/", async (req, res) => {
  try {
    chatModel
      .find({ members: { $elemMatch: { $eq: req.user.userId } } })
      .populate("members", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 })
      .then(async (result) => {
        result = await userModel.populate(result, {
          path: "latestMessage.sender",
          select: "name profilePicture email",
        });
        res.send(result);
      });
  } catch (error) {
    res.status(404).send("Error: " + error.message);
  }
});
router.post("/group", async (req, res) => {});
router.get("/group", async (req, res) => {});
// router.post("/", async (req, res) => {});
module.exports = router;
