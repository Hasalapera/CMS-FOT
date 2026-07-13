'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },

      institutional_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      full_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },

      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      role: {
        type: Sequelize.ENUM(
          'STUDENT',
          'LECTURER',
          'TECHNICAL_OFFICER',
          'ADMIN'
        ),
        allowNull: false,
        defaultValue: 'STUDENT',
      },

      auth_source: {
        type: Sequelize.ENUM('LOCAL', 'MOODLE'),
        allowNull: false,
        defaultValue: 'LOCAL',
      },

      external_subject: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('users', ['email'], {
      name: 'users_email_idx',
    });

    await queryInterface.addIndex('users', ['institutional_id'], {
      name: 'users_institutional_id_idx',
    });

    await queryInterface.addIndex('users', ['role'], {
      name: 'users_role_idx',
    });

    await queryInterface.addIndex('users', ['is_active'], {
      name: 'users_is_active_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_auth_source";'
    );
  },
};