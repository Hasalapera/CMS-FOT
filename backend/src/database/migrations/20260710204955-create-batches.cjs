"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("batches", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      chemical_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "chemicals", key: "id" },
        onDelete: "CASCADE",
      },
      location_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "locations", key: "id" },
        onDelete: "SET NULL",
      },
      batch_number: { type: Sequelize.STRING(100), allowNull: false }, // 255 දක්වා වැඩි කරන ලදී
      quantity_received: { type: Sequelize.DECIMAL(12, 4), allowNull: false },
      current_quantity: { type: Sequelize.DECIMAL(12, 4), allowNull: false },
      expiry_date: { type: Sequelize.DATEONLY, allowNull: true },
      received_date: { type: Sequelize.DATEONLY, allowNull: false },
      supplier: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("batches");
  },
};
