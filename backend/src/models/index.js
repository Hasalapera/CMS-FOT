'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import sequelize from '../database/db.js'; // Import the new db instance

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const db = {};

// Dynamically load all model files from the current directory
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

// Initialize each model and add it to the db object
for (const file of modelFiles) {
  // Use dynamic import for ES Modules
  const modelDefinition = (await import(path.join(__dirname, file))).default;
  const model = modelDefinition(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// --- Centralized Model Associations ---
// Destructure models for easier access.
// This is where you will define all relationships between your models.
const { Chemical, User, Batch, ChemicalHazard } = db;

// Check if models exist before creating associations to avoid errors
if (Chemical && User) {
  // A Chemical is associated with the User who uploaded its SDS
  Chemical.belongsTo(User, {
    foreignKey: 'sdsUploadedById',
    as: 'sdsUploader',
  });

  // A User can be associated with many Chemicals for which they uploaded the SDS
  User.hasMany(Chemical, {
    foreignKey: 'sdsUploadedById',
    as: 'uploadedSdsChemicals',
  });
}

if (Chemical && Batch) {
  // A Chemical can have many Batches
  Chemical.hasMany(Batch, {
    foreignKey: 'chemicalId',
    as: 'batches',
    onDelete: 'CASCADE',
  });

  // A Batch belongs to one Chemical
  Batch.belongsTo(Chemical, {
    foreignKey: 'chemicalId',
    as: 'chemical',
  });
}

// --- End of Associations ---

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;