require("dotenv").config();
const router = require("express").Router();
const grid = require("gridfs-stream");
const mongoose = require("mongoose");
const uploadMiddleware = require("../middlewares/upload.middleware");
const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "fs",
  });
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection("fs");
});
router.get("/:fileName", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.fileName });
    const readStream = gridFsBucket.openDownloadStream(file?._id);
    readStream.pipe(res);
  } catch (error) {
    res.json({ message: error.message });
  }
});
router.post("/upload", uploadMiddleware.single("file"), async (req, res) => {
  try {
    const url = `${process.env.url}/file/${req.file.filename}`;
    res.json({ url });
  } catch (error) {
    res.json({ message: error.message });
  }
});
module.exports = router;
