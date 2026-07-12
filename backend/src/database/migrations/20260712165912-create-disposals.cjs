"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("disposals", {
      id: {
        type: Sequelize.UUID,

        primaryKey: true,

        defaultValue: Sequelize.UUIDV4,

        allowNull: false,
      },

      chemical_id: {
        type: Sequelize.UUID,

        allowNull: false,

        references: {
          model: "chemicals",

          key: "id",
        },

        onUpdate: "CASCADE",

        onDelete: "CASCADE",
      },

      chemical_code: {
        type: Sequelize.STRING(50),

        allowNull: false,
      },

      chemical_name: {
        type: Sequelize.STRING(255),

        allowNull: false,
      },

      batch_code: {
        type: Sequelize.STRING(100),

        allowNull: false,
      },

      quantity_used: {
        type: Sequelize.DECIMAL(10, 2),

        allowNull: true,
      },

      date_released: {
        type: Sequelize.DATE,

        allowNull: false,
      },

      date_returned: {
        type: Sequelize.DATE,

        allowNull: true,
      },

      purpose: {
        type: Sequelize.TEXT,

        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,

        allowNull: false,

        references: {
          model: "users",

          key: "id",
        },

        onUpdate: "CASCADE",

        onDelete: "CASCADE",
      },

      user_name: {
        type: Sequelize.STRING(150),

        allowNull: false,
      },

      remark: {
        type: Sequelize.TEXT,

        allowNull: true,
      },

      returned_status: {
        type: Sequelize.ENUM("RELEASED", "RETURNED", "DISPOSED"),

        allowNull: false,

        defaultValue: "RELEASED",
      },

      created_at: {
        type: Sequelize.DATE,

        allowNull: false,

        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,

        allowNull: false,

        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("disposals");
  },
};
