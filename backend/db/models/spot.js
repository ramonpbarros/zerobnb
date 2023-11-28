'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User);
    }
  }
  Spot.init(
    {
      ownerId: DataTypes.INTEGER,
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
        isNumeric: true,
        // isDecimal: true,
        isNotNumeric(value) {
          if (!Validator.isNumeric(value)) {
            throw new Error('Include numbers only.');
          }
        },
      },
      lng: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        isNumeric: true,
        // isDecimal: true,
        isNotNumeric(value) {
          if (!Validator.isNumeric(value)) {
            throw new Error('Include numbers only.');
          }
        },
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
        // isDecimal: true,
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );
  return Spot;
};
