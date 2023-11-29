'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '1234 Some Address',
        city: 'City',
        state: 'State',
        lat: 38.8951,
        lng: -77.0364,
        name: 'Name',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus. Curabitur sapien arcu, vehicula non vulputate quis, dapibus eu lorem. Praesent placerat aliquet neque, at feugiat metus facilisis ut.',
        price: 100,
      },
      {
        ownerId: 2,
        address: '1234 Some Address',
        city: 'City',
        state: 'State',
        lat: 38.8951,
        lng: -77.0364,
        name: 'Name',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus. Curabitur sapien arcu, vehicula non vulputate quis, dapibus eu lorem. Praesent placerat aliquet neque, at feugiat metus facilisis ut.',
        price: 100,
      },
      {
        ownerId: 3,
        address: '1234 Some Address',
        city: 'City',
        state: 'State',
        lat: 38.8951,
        lng: -77.0364,
        name: 'Name',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus. Curabitur sapien arcu, vehicula non vulputate quis, dapibus eu lorem. Praesent placerat aliquet neque, at feugiat metus facilisis ut.',
        price: 100,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        owner: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
