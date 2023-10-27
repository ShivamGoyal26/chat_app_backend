const express = require("express");
const dotenv = require("dotenv");

const { chats } = require("./data/data");
const connectDB = require("./config/db");

dotenv.config();
connectDB();
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/user", userRoutes);

app.listen(port, (error) => {
  if (error) {
    console.error(`Error starting the server: ${error}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
