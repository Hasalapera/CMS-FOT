const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.${NODE_ENV} file
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) });

const express = require('express');
const cors = require('cors');
const sequelize = require('./database/db.js');
const db = require('./models/index.js');

const userRoutes = require('./routes/UserRoute.js');

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
app.use('/api/users', userRoutes);

const startServer = async () => {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Database connection established successfully.✅");

    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true });
      console.log('All models were synchronized successfully.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("\n❌ Server startup failed:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
