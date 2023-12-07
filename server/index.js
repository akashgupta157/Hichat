const express = require("express");
const app = express();
const connection = require("./db");
const cors = require("cors");
const userMiddleware = require("./middlewares/user.middleware");
const userRoute = require("./routes/user.route");
const chatRoute = require("./routes/chats.route");
const messageRoute = require("./routes/messages.route");
app.use(express.json());
app.use(cors());
app.use("/auth", userRoute);
app.use("/chat", userMiddleware, chatRoute);
app.use("/message", userMiddleware, messageRoute);
app.listen(3000, async () => {
  try {
    await connection;
    console.log(`Listening on port 3000`);
  } catch (error) {
    console.log(error);
  }
});
