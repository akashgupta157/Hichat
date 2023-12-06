const express = require("express");
const app = express();
const connection = require("./db");
const cors = require("cors");
const userRoute = require("./routes/user.route");
// const http = require("http");
// const { Server } = require("socket.io");
app.use(express.json());
app.use(cors());
app.use("/auth", userRoute);
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });
// io.on("connection", (socket) => {
//   console.log("a user connected", socket);
// });
// server.listen(3001, () => {
//   console.log("socket listening on 3001");
// });
app.listen(3000, async () => {
  try {
    await connection;
    console.log(`Listening on port 3000`);
  } catch (error) {
    console.log(error);
  }
});
