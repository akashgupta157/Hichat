const uploadMiddleware = require("../middlewares/upload.middleware");
const chatModel = require("../models/chat.model");
const userModel = require("../models/user.model");
const router = require("express").Router();
require("dotenv").config();
//accessChat(one-to-one)
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
    select: "name profilePicture email",
  });
  if (chat.length > 0) {
    res.send(chat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      members: [req.user.userId, userId],
    };
    try {
      const createdChat = await chatModel.create(chatData);
      const wholeChat = await chatModel
        .findOne({
          _id: createdChat._id,
        })
        .populate("members", "-password");
      res.json(wholeChat);
    } catch (err) {
      console.log(err);
    }
  }
});
//fetchChat
router.get("/", async (req, res) => {
  try {
    chatModel
      .find({ members: { $elemMatch: { $eq: req.user.userId } } })
      .populate("members", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await userModel.populate(result, {
          path: "latestMessage.sender",
          select: "name profilePicture email",
        });
        res.send(result);
      });
  } catch (error) {
    res.send("Error: " + error.message);
  }
});
//createGroupChat
router.post("/group", async (req, res) => {
  if (!req.body.members || !req.body.name) {
    return res.send({ message: "Please Fill all the fields", GC: false });
  }
  var members = req.body.members;
  members.push(req.user.userId);
  try {
    const groupChat = await chatModel.create({
      chatName: req.body.name,
      members,
      isGroupChat: true,
      groupAdmin: req.user.userId,
      groupPicture: req.body.groupPicture,
    });
    const wholeGroupChat = await chatModel
      .findOne({ _id: groupChat._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password");
    res.json({ message: "Group chat created", GC: true, wholeGroupChat });
  } catch (error) {
    res.send("Error: " + error.message);
  }
});
//updateGroupChat
router.patch(
  "/group/:groupId",
  uploadMiddleware.single("file"),
  async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const chat = await chatModel.findById(groupId);
      if (req.body.editedContent) {
        chat.chatName = req.body.editedContent;
        await chat.save();
        res.json({ message: "done", chatName: chat.chatName });
      } else {
        const imageUrl = `${process.env.url}/file/${req.file.filename}`;
        chat.groupPicture = imageUrl || chat.groupPicture;
        await chat.save();
        res.json({ message: "done", imageUrl });
      }
    } catch (error) {
      res.json({ message: error.message });
    }
  }
);
// remove member from group
router.patch("/remove/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const chat = await chatModel.findById(groupId);
    const memberIdToRemove = req.body.memberId;
    if (chat.groupAdmin.toString() !== req.user.userId) {
      return res.json({ message: "Permission denied" });
    }
    if (!chat.members.includes(memberIdToRemove)) {
      return res.json({ message: "Member not found in the group" });
    }
    if (chat.members.length <= 3) {
      return res.json({
        message: "Cannot remove member, group must have at least 3 members",
      });
    }
    chat.members = chat.members.filter(
      (member) => member.toString() !== memberIdToRemove
    );
    await chat.save();
    const updatedGroupChat = await chatModel
      .findOne({ _id: chat._id })
      .populate("members", "-password")
      .populate("groupAdmin", "-password");
    res.json({
      message: "Member removed successfully",
      members: updatedGroupChat.members,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
});
// Delete Group by Group Admin
router.delete("/delete/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const chat = await chatModel.findById(groupId);
    if (chat.groupAdmin.toString() !== req.user.userId) {
      return res.json({ message: "Permission denied" });
    }
    await chatModel.findByIdAndDelete(groupId);
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.json({ message: error.message });
  }
});
module.exports = router;
