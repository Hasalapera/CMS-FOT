"use strict";

const sequelize = require("../database/db.js");
const { DataTypes } = require("sequelize");

// --- Model Imports & Initialization ---
const User = require("./User")(sequelize, DataTypes);
const Chemical = require("./Chemical")(sequelize, DataTypes);
const Batch = require("./Batch")(sequelize, DataTypes);
const Location = require("./Location")(sequelize, DataTypes);
const Dispose = require("./Dispose")(sequelize, DataTypes);

// --- Centralized Model Associations ---

// 1. Chemical <-> User (SDS Uploader)
Chemical.belongsTo(User, {
  foreignKey: "sdsUploadedById",
  as: "sdsUploader",
});
User.hasMany(Chemical, {
  foreignKey: "sdsUploadedById",
  as: "uploadedSdsChemicals",
});

// 2. Chemical <-> Batch
Chemical.hasMany(Batch, {
  foreignKey: "chemicalId",
  as: "batches",
  onDelete: "CASCADE",
});
Batch.belongsTo(Chemical, {
  foreignKey: "chemicalId",
  as: "chemical",
});

// 3. Batch <-> Location
Batch.belongsTo(Location, {
  foreignKey: "locationId",
  as: "location",
});
Location.hasMany(Batch, {
  foreignKey: "locationId",
  as: "batches",
});

// 4. Location <-> Location (Self-referencing for hierarchy)
Location.hasMany(Location, {
  as: "children",
  foreignKey: "parentLocationId",
});
Location.belongsTo(Location, {
  as: "parent",
  foreignKey: "parentLocationId",
});

// 5. dispose <-> chemical

Dispose.belongsTo(Chemical, {
  foreignKey: "chemicalCode",
  targetKey: "chemicalCode",
  as: "chemical",
});

Chemical.hasMany(Dispose, {
  foreignKey: "chemicalCode",
  sourceKey: "chemicalCode",
  as: "disposals",
});

// --- Exports ---
module.exports = { sequelize, User, Chemical, Batch, Location, Dispose };
