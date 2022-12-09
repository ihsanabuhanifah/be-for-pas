'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Beli extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Beli.belongsTo(models.Produk, {
        as: "produk",
        foreignKey: "produkId"
      });// define association here
    }
  };
  Beli.init({
    produkId: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    harga: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Beli',
  });
  return Beli;
};