'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chatRooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email1: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        onUpdate : "CASCADE",
        references: {
          model: "users",
          key: "email",
          as: "email1",
        },
      },
      email2: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        onUpdate : "CASCADE",
        references: {
          model: "users",
          key: "email",
          as: "email2",
        },
      },
      chatRoom: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('chatRooms');
  }
};