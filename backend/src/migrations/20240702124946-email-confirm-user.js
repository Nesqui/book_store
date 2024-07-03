'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'active', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.addColumn('Users', 'confirmationHash', {
      type: Sequelize.STRING
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'active')
    await queryInterface.removeColumn('Users', 'confirmationHash')
  }
};
