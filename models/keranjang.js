'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Keranjang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Keranjang.belongsTo(models.Produk, {
        as: "produk",
        foreignKey: "produkId"
      });// define association here
    }
  };
  Keranjang.init({
    produkId: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Keranjang',
  });
  return Keranjang;
};