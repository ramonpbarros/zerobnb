'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Review.bulkCreate([
        {
          userId: 1,
          spotId: 1,
          review: 'Some review',
          stars: 5,
        },
        {
          userId: 2,
          spotId: 2,
          review: 'Some review 2',
          stars: 4,
        },
        {
          userId: 3,
          spotId: 3,
          review: 'Some review 3',
          stars: 3,
        },
      ]);
    } catch (error) {
      console.error('Error during Review bulkCreate:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
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
