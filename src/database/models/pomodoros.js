'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pomodoros extends Model {
    static associate(models) {
      pomodoros.belongsTo(models.users, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }
  pomodoros.init({
    started_at: DataTypes.DATE,
    ended_at: DataTypes.DATE,
    focus_time: DataTypes.INTEGER,
    rest_time: DataTypes.INTEGER,
    finished_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pomodoros',
  });
  return pomodoros;
};