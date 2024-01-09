const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();
const storage = new GridFsStorage({
  url: process.env.mongoUrl,
  options: { useUnifiedTopology: true, useNewUrlParser: true },
  file: (req, file) => {
    const match = ["image/*", "application/*", "video/*", "audio/*"];
    if (match.indexOf(file.mimetype) === -1) {
      return `${Date.now()}-file-${file.originalname}`;
    }
    return {
      bucketName: "files",
      filename: `${Date.now()}-file-${file.originalname}`,
    };
  },
});
module.exports = multer({ storage });
