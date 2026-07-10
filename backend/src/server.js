require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("../config/database.cjs");

const userRoutes = require("./routes/UserRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FLCMS API is running",
  });
});
app.use("/api/users", userRoutes);

const startServer = async () => {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Database connection established successfully.✅");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("\n❌ Server startup failed:");
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
