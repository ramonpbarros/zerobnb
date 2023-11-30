'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Spot.bulkCreate(
        [
          {
            ownerId: 1,
            address: '1234 Some Address',
            city: 'City',
            state: 'State',
            lat: 38.8951,
            lng: -77.0364,
            name: 'Name1',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus',
            price: 100,
          },
          {
            ownerId: 2,
            address: '1234 Some Address',
            city: 'City',
            state: 'State',
            lat: 38.8951,
            lng: -77.0364,
            name: 'Name2',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus',
            price: 100,
          },
          {
            ownerId: 3,
            address: '1234 Some Address',
            city: 'City',
            state: 'State',
            lat: 38.8951,
            lng: -77.0364,
            name: 'Name3',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus.',
            price: 100,
          },
        ],
        { validate: true }
      );
    } catch (error) {
      console.error('Error during Spot bulkCreate:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ['Name1', 'Name2', 'Name3'] },
      },
      {}
    );
  },
};
