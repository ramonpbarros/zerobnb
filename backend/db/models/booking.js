'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      //
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        isDate: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        isDate: true,
      },
    },
    {
      sequelize,
      modelName: 'Booking',
    }
  );
  return Booking;
};
