const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const assetRoutes = require("./routes/assetRoutes");
const chatRoutes = require("./routes/chatRoutes");
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

app.use(notFound);
app.use(errorHandler);

app.listen(port, (error) => {
  if (error) {
    console.error(`Error starting the server: ${error}`);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
