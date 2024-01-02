'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      users.hasMany(models.pomodoros, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }
  users.init({
    name: DataTypes.STRING,
    rest_time: DataTypes.INTEGER,
    focus_time: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};