const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected!", res.connection.host);
  } catch (error) {
    console.log("Erorr in the database connection", error.message);
    process.exit();
  }
};

module.exports = connectDB;
