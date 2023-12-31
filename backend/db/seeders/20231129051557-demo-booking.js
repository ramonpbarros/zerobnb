'use strict';

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Booking.bulkCreate([
        {
          spotId: 1,
          userId: 1,
          startDate: '2023-11-25',
          endDate: '2023-11-29',
        },
        {
          spotId: 2,
          userId: 1,
          startDate: '2023-11-25',
          endDate: '2023-11-29',
        },
        {
          spotId: 3,
          userId: 3,
          startDate: '2023-11-25',
          endDate: '2023-11-29',
        },
      ]);
    } catch (error) {
      console.error('Error during Booking bulkCreate:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
