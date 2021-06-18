'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    
    static associate(models) {
      
      models.Post.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }, onDelete:'CASCADE', 
      })
        

    }
  };
  Post.init({
    message: { type: DataTypes.TEXT, allowNull: false },
    link: { type: DataTypes.STRING, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },


  }, {
    sequelize,

    modelName: 'Post',
  });
  return Post;
};