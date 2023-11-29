'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Spot, {
        foreignKey: 'imageableId',
        constraints: false,
      });
      Image.belongsTo(models.Review, {
        foreignKey: 'imageableId',
        constraints: false,
      });
    }
  }
  Image.init(
    {
      imageableId: DataTypes.INTEGER,
      imageableType: DataTypes.INTEGER,
      url: DataTypes.STRING,
      preview: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Image',
    }
  );
  return Image;
};
