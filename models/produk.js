"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Produk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Produk.hasMany(models.Keranjang, {
        as: "keranjang",
        foreignKey: "produkId",
      });
      Produk.hasMany(models.Beli, {
        as: "beli",
        foreignKey: "produkId",
      });
    }
  }
  Produk.init(
    {
      uuid: DataTypes.STRING,
      namaProduk: DataTypes.STRING,
      gambarProduk: DataTypes.TEXT,
      rating: DataTypes.STRING,
      harga: DataTypes.STRING,
      stok: DataTypes.INTEGER,
      kategori: DataTypes.STRING,
      deskripsi: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Produk",
    }
  );
  return Produk;
};
