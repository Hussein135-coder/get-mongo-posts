const express = require("express");
const { createServer } = require("http");
const mongoose = require("mongoose");
const Post = require("./models/Post");
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {});

const PORT = process.env.PORT || 2000;
const MONGO_URI = process.env.MONGO;

app.get("/", (req, res) => {
  res.send("Hello World");
});
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("New client connected");

  const fetchPosts = async () => {
    try {
      const posts = await Post.find().sort({ date: -1 }).limit(100);
      console.log(posts);
      socket.emit("posts", JSON.stringify(posts));
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

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
