const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const assetRoutes = require("./routes/assetRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

dotenv.config();
connectDB();
const app = express();
// app.use(bodyParser.json());
const port = process.env.PORT || 3000;
app.use(express.json()); // to accept json data

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/user", userRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, (error) => {
  if (error) {
    console.error(`Error starting the server: ${error}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://192.168.29.88:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    console.log("userData", userData.id);
    socket.join(userData.id);
    socket.emit("connected");
    // io.emit("connected")  // this will send message to all
  });

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("USer joined the room", roomId);
  });

  socket.on("leave chat", (roomId) => {
    socket.leave(roomId);
    console.log("User left the room", roomId);
  });

  socket.on("typing", (roomId) => {
    socket.to(roomId).emit("typing", { data: null });
  });
  socket.on("stoptyping", (roomId) => socket.to(roomId).emit("stoptyping"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.to(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.on("disconnect", (userData) => {
    console.log("User Disconnected");
    socket.leave(userData.id);
  });
});
