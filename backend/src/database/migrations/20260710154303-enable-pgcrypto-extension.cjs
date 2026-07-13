'use strict';

module.exports = {
  async up(queryInterface) {
    // This extension is needed for gen_random_uuid()
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";'
    );
  },

  async down(queryInterface) {
    // There's no significant harm in leaving the extension,
    // but for completeness, we can drop it.
    await queryInterface.sequelize.query(
      'DROP EXTENSION IF EXISTS "pgcrypto";'
    );
  },
};