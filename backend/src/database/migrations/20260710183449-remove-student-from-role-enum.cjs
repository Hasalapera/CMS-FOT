'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, find any users with the 'STUDENT' role and handle them.
    // For safety, we'll update them to 'LECTURER'. You can change this
    // to another role or delete them if appropriate for your logic.
    await queryInterface.sequelize.query(
      `UPDATE "users" SET "role" = 'LECTURER' WHERE "role" = 'STUDENT';`
    );

    // Step 1: Remove the default value that uses the 'STUDENT' enum
    await queryInterface.sequelize.query(
      'ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;'
    );

    // Step 2: Rename the existing enum type
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_users_role" RENAME TO "enum_users_role_old";'
    );

    // Step 3: Create the new enum type without 'STUDENT'
    await queryInterface.sequelize.query(
      "CREATE TYPE \"enum_users_role\" AS ENUM('LECTURER', 'TECHNICAL_OFFICER', 'ADMIN');"
    );

    // Step 4: Update the table to use the new enum type, casting the values
    await queryInterface.sequelize.query(
      'ALTER TABLE "users" ALTER COLUMN "role" TYPE "enum_users_role" USING "role"::text::"enum_users_role";'
    );

    // Step 5: Drop the old enum type
    await queryInterface.sequelize.query('DROP TYPE "enum_users_role_old";');
  },

  async down(queryInterface, Sequelize) {
    // This is the reverse process to add 'STUDENT' back

    // Step 1: Rename the current enum type
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_users_role" RENAME TO "enum_users_role_new";'
    );

    // Step 2: Create the old enum type with 'STUDENT'
    await queryInterface.sequelize.query(
      "CREATE TYPE \"enum_users_role\" AS ENUM('STUDENT', 'LECTURER', 'TECHNICAL_OFFICER', 'ADMIN');"
    );

    // Step 3: Update the table to use the recreated old enum type
    await queryInterface.sequelize.query(
      'ALTER TABLE "users" ALTER COLUMN "role" TYPE "enum_users_role" USING "role"::text::"enum_users_role";'
    );

    // Step 4: Drop the temporary new enum type
    await queryInterface.sequelize.query('DROP TYPE "enum_users_role_new";');

    // Step 5: Restore the default value
    await queryInterface.sequelize.query(
      "ALTER TABLE \"users\" ALTER COLUMN \"role\" SET DEFAULT 'STUDENT';"
    );
  },
};
