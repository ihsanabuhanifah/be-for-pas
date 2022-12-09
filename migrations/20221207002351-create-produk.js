'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Produks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      namaProduk: {
        type: Sequelize.STRING
      },
      gambarProduk: {
        type: Sequelize.TEXT
      },
      rating: {
        type: Sequelize.STRING
      },
      harga: {
        type: Sequelize.STRING
      },
      stok: {
        type: Sequelize.INTEGER
      },
      kategori: {
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Produks');
  }
};