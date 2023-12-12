const express = require("express");
const app = express();
const connection = require("./db");
const cors = require("cors");
const userMiddleware = require("./middlewares/user.middleware");
const userRoute = require("./routes/user.route");
const chatRoute = require("./routes/chats.route");
const messageRoute = require("./routes/messages.route");
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/auth", userRoute);
app.use("/chat", userMiddleware, chatRoute);
app.use("/message", userMiddleware, messageRoute);
const server = app.listen(3000, async () => {
  try {
    await connection;
    console.log(`Listening on port 3000`);
  } catch (error) {
    console.log(error);
  }
});
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});
const onlineUsers = {};
io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    onlineUsers[userData._id] = true;
    io.emit("online users", Object.keys(onlineUsers));
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });
  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;
    if (!chat.members) return console.log("no user");
    chat.members.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });
  socket.on("logout", (userId) => {
    delete onlineUsers[userId]; // Mark user as offline
    io.emit("online users", Object.keys(onlineUsers));
  });
  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
