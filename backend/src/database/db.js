import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Ensure the DATABASE_URL is set in your .env file
if (!process.env.DATABASE_URL) {
  throw new Error('FATAL ERROR: DATABASE_URL environment variable is not set.');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  // Professional Optimization: Connection Pooling
  pool: {
    max: isProduction ? 15 : 5, // More connections for production
    min: 0,
    acquire: 30000, // Max time (ms) to wait for a connection
    idle: 10000, // Max time (ms) a connection can be idle before being released
  },
  dialectOptions: {
    // SSL is often required for remote/production databases
    ssl: isProduction
      ? {
          require: true,
          rejectUnauthorized: false, // Adjust this based on your DB provider's requirements
        }
      : false,
  },
  // Show SQL logs only when not in production
  logging: isProduction ? false : console.log,
});

export default sequelize;