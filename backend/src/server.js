const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env.${NODE_ENV} file
const nodeEnv = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) });

const express = require("express");
const cors = require("cors");
const sequelize = require("./database/db.js");
const db = require("./models/index.js");

const userRoutes = require("./routes/UserRoute.js");
const chemicalRoutes = require("./routes/ChemicalRoute.js");
const locationRoutes = require("./routes/LocationRoute.js");
const batchRoutes = require("./routes/BatchRoute.js");
const disposeRoutes = require("./routes/DisoposeRoute.js");
const usageRoutes = require("./routes/UsageRoute.js");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CMS API is running",
  });
});
app.use("/api/users", userRoutes);
app.use("/api/chemicals", chemicalRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/dispose", disposeRoutes);
app.use("/api/usage", usageRoutes);
const startServer = async () => {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Database connection established successfully.✅");

    if (process.env.NODE_ENV === "development") {
      await db.sequelize.sync({ alter: true });
      console.log("All models were synchronized successfully.");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("\nServer startup failed:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
