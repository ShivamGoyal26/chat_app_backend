const express = require("express");
const dotenv = require("dotenv");

const { chats } = require("./data/data");

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is working");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

app.listen(port, (error) => {
  if (error) {
    console.error(`Error starting the server: ${error}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});