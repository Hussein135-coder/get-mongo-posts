const { Server } = require("socket.io");

const io = new Server({});

const mongoose = require("mongoose");
const Post = require("./models/Post");

const PORT = process.env.PORT || 8000;
const MONGO_URI =
  "mongodb+srv://hussein:hason12345t@syr.yqrf3dh.mongodb.net/?retryWrites=true&w=majority&appName=syr";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("New client connected");

  const fetchPosts = async () => {
    try {
      console.log("get Posts");
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

io.listen(PORT, () => console.log(`Server running on port ${PORT}`));
