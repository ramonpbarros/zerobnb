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
      imageableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageableType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 6],
        },
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Image',
    }
  );
  return Image;
};
