'use strict';

const { Spot, User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const spots = [
  {
    user: 'Demo-lition',
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
    user: 'FakeUser1',
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
    user: 'FakeUser2',
    address: '1234 Some Address',
    city: 'City',
    state: 'State',
    lat: 38.8951,
    lng: -77.0364,
    name: 'Name3',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod libero sed ante scelerisque pharetra. Morbi sagittis risus id massa porttitor luctus',
    price: 100,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      for (let spotInfo of spots) {
        const {
          user,
          address,
          city,
          state,
          lat,
          lng,
          name,
          description,
          price,
        } = spotInfo;
        const foundUser = await User.findOne({
          where: { username: user },
        });

        await Spot.bulkCreate({
          userId: foundUser.id,
          address,
          city,
          state,
          lat,
          lng,
          name,
          description,
          price,
        });
      }
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
        userId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
