"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      user.hasOne(models.identitas, { as: "identitas", foreignKey: "userId" });
      user.hasMany(models.nilai, { as: "nilai", foreignKey: "userId" });
      user.belongsToMany(models.role, {
        through: models.userRole,
        as: "roles",
        foreignKey: "userId",
      });

      user.hasMany(models.forgotPassword, {
        as: "token",
        foreignKey: "userId",
      });

      user.hasMany(models.chatRoom, {
        as: "chatRoomEmailSatu",
        foreignKey: "email1",
      });

      user.hasMany(models.chatRoom, {
        as: "chatRoomEmailDua",
        foreignKey: "email2",
      });
    }
  }
  user.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.ENUM("active", "nonactive"),
      jenisKelamin: DataTypes.ENUM("laki-laki", "perempuan"),
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
