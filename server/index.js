const express = require("express");
const app = express();
const connection = require("./db");
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.listen(3000, async () => {
  try {
    await connection;
    console.log(`Listening on port 3000`);
  } catch (error) {
    console.log(error);
  }
});