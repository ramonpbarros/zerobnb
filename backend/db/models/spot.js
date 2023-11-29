'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: 'userId',
        otherKey: 'spotId',
      });
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
      });
      Spot.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Spot',
        },
      });
    }
  }
  Spot.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 30],
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 30],
        },
      },
      lat: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      lng: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 30],
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 256],
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );
  return Spot;
};
