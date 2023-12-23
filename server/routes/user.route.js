require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const userMiddleware = require("../middlewares/user.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");
require("dotenv").config();
router.get("/", async (req, res) => {
  try {
    res.send("Welcome User");
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.post("/google/login", async (req, res) => {
  const { googleAccessToken } = req.body;
  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${googleAccessToken}`,
      },
    }
  );
  let existingUser = await userModel
    .findOne({
      email: data.email,
    })
    .select("-password");
  if (existingUser) {
    const token = jwt.sign(
      { userId: existingUser._id, user: existingUser.email },
      process.env.secretKey
    );
    return res.json({ user: existingUser, token });
  }
  const user = new userModel({
    email: data.email,
    profilePicture: data.picture,
    name: data.name,
  });

  await user.save();
  const token = jwt.sign(
    { userId: user._id, user: user.email },
    process.env.secretKey,
    {
      expiresIn: "24h",
    }
  );
  res.json({ user, token });
});
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        message: "User already exists, please login",
        auth: false,
      });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.json({ err: err.message });
      } else {
        const user = new userModel({ ...req.body, password: hash });
        const data = await user.save();
        const token = jwt.sign(
          { userId: data._id, user: data.email },
          process.env.secretKey
        );
        res.json({
          message: "User has been Registered successfully",
          auth: true,
          user: data,
          token,
        });
      }
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ message: "Email not found", auth: false });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.json({ message: "Incorrect Password", auth: false });
    }
    const token = jwt.sign(
      { userId: user._id, user: user.email },
      process.env.secretKey
    );
    res.json({ message: "Login successful", user, token, auth: true });
  } catch (error) {
    res.json({ message: error.message });
  }
});
router.patch(
  "/updateProfile/:id",
  uploadMiddleware.single("file"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const imageUrl = `${process.env.url}/file/${req.file.filename}`;
      const existingUser = await userModel.findById(userId);
      existingUser.profilePicture = imageUrl || existingUser.profilePicture;
      await existingUser.save();
      res.json({ message: "done", imageUrl });
    } catch (error) {
      res.json({ message: error.message });
    }
  }
);
router.get("/search", userMiddleware, async (req, res) => {
  const search = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          {
            email: {
              $regex: `^${req.query.search.split("@")[0]}`,
              $options: "i",
            },
          },
        ],
      }
    : null;
  res.send(
    await userModel
      .find(search)
      .find({
        _id: { $ne: req.user.userId },
      })
      .select("-password")
  );
});
module.exports = router;
