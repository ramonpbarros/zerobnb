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
            address: '1234 Some Address 1',
            city: 'City 1',
            state: 'State 1',
            country: 'USA 1',
            lat: 38.8951,
            lng: -77.0364,
            name: 'Name1',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus',
            price: 101,
          },
          {
            ownerId: 2,
            address: '1234 Some Address 2',
            city: 'City 2',
            state: 'State 2',
            country: 'USA 2',
            lat: 38.8951,
            lng: -77.0364,
            name: 'Name2',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus',
            price: 102,
          },
          {
            ownerId: 3,
            address: '1234 Some Address 3',
            city: 'City 3',
            state: 'State 3',
            country: 'USA 3',
            lat: 38.8951,
            lng: -77.0364,
            name: 'Name3',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus.',
            price: 103,
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
