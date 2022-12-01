'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      chatRoom.belongsTo(models.user, {
        as: "chatRoomEmailSatu",
        foreignKey: "email1"
      });
      chatRoom.belongsTo(models.user, {
        as: "chatRoomEmailDua",
        foreignKey: "email2"
      });
    }
  };
  chatRoom.init({
    email1: DataTypes.STRING,
    email2: DataTypes.STRING,
    chatRoom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'chatRoom',
  });
  return chatRoom;
};