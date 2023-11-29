'use strict';

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await User.bulkCreate(
        [
          {
            email: 'demo@user.io',
            firstName: 'demonName1',
            lastName: 'demonLast1',
            username: 'Demo-lition',
            hashedPassword: bcrypt.hashSync('password'),
          },
          {
            email: 'user1@user.io',
            firstName: 'demonName2',
            lastName: 'demonLast2',
            username: 'FakeUser1',
            hashedPassword: bcrypt.hashSync('password2'),
          },
          {
            email: 'user2@user.io',
            firstName: 'demonName3',
            lastName: 'demonLast3',
            username: 'FakeUser2',
            hashedPassword: bcrypt.hashSync('password3'),
          },
        ],
        { validate: true }
      );
    } catch (error) {
      console.error('Error during bulkCreate:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] },
      },
      {}
    );
  },
};
