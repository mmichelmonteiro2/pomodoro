'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pomodoros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      started_at: {
        type: Sequelize.DATE
      },
      ended_at: {
        type: Sequelize.DATE
      },
      focus_time: {
        type: Sequelize.INTEGER
      },
      rest_time: {
        type: Sequelize.INTEGER
      },
      finished_count: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pomodoros');
  }
};