'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('locations', {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.ENUM('LAB', 'CABINET', 'SHELF', 'FRIDGE', 'OTHER'), allowNull: false },
      parent_location_id: { 
        type: Sequelize.UUID, 
        allowNull: true,
        references: { model: 'locations', key: 'id' } 
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('locations');
  }
};