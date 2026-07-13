'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chemicals', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      chemical_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      canonical_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      stock_dimension: {
        type: Sequelize.ENUM('MASS', 'VOLUME', 'COUNT'),
        allowNull: false,
      },
      base_unit: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      cas_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      formula: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      physical_state: {
        type: Sequelize.ENUM('SOLID', 'LIQUID', 'GAS', 'OTHER'),
        allowNull: true,
      },
      synonyms: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      density_value: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
      },
      density_unit: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      safety_summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      // SDS Fields
      sds_storage_key: {
        type: Sequelize.STRING(512),
        allowNull: true,
      },
      sds_original_filename: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      sds_mime_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      sds_file_size: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sds_checksum: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      sds_revision_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      sds_uploaded_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sds_uploaded_by_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users', // ඔබගේ users table නාමය මෙහි ඇතුලත් කරන්න
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chemicals');
  }
};