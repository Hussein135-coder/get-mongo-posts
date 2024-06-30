const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Post", PostSchema);
