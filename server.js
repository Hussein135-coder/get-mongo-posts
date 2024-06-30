const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const Post = require("./models/Post");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 2000;
const MONGO_URI = process.env.MONGO;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("New client connected");

  const fetchPosts = async () => {
    try {
      const posts = await Post.find().sort({ date: -1 }).limit(100);
      console.log(posts);
      socket.emit("posts", posts);
    } catch (err) {
      console.error(err);
    }
  };

  // Send posts every 10 seconds
  const intervalId = setInterval(fetchPosts, 10000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(intervalId);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
