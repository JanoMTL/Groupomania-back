"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model{
    static associate(models) {
      // define association here
      models.User.hasMany(models.Post);
      models.User.hasMany(models.Like);
    }
  }


User.init(
    {
      pseudo: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      photo: { type: DataTypes.STRING, allowNull: true },
      admin: { type: DataTypes.BOOLEAN, allowNull: false, default: false },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};