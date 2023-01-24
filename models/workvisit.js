'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workVisit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  workVisit.init(
    {
      name: DataTypes.STRING,
      date: DataTypes.DATEONLY,
      origin: DataTypes.STRING,
      interest: DataTypes.TEXT,
      qty: DataTypes.INTEGER,
      filename: DataTypes.STRING,
      file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'workVisit',
    }
  );
  return workVisit;
};
