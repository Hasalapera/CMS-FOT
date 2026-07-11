const { Sequelize } = require('sequelize');

// dotenv is configured in server.js, which is the application's entry point.

const isProduction = process.env.NODE_ENV === 'production';

if (!process.env.DATABASE_URL) {
  throw new Error(`FATAL ERROR: DATABASE_URL environment variable is not set. Please check your .env.${process.env.NODE_ENV || 'development'} file.`);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  pool: {
    max: isProduction ? 15 : 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: isProduction
      ? {
          require: true,
          rejectUnauthorized: false,
        }
      : false,
  },
  logging: isProduction ? false : console.log,
});

module.exports = sequelize;