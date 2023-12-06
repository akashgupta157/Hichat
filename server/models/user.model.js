const mongoose = require("mongoose");
const user = mongoose.Schema(
  {
    name: String,
    email: String,
    password: { type: String, default: null },
    profilePicture: {
      type: String,
      default:
        "https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("UserModel", user);
