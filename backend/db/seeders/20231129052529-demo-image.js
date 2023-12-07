'use strict';

const { Image } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Image.bulkCreate(
        [
          {
            imageableId: 1,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vZGVybiUyMGhvdXNlfGVufDB8MHwwfHx8MA%3D%3D',
            preview: true,
          },
          {
            imageableId: 2,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vZGVybiUyMGhvdXNlfGVufDB8MHwwfHx8MA%3D%3D',
            preview: false,
          },
          {
            imageableId: 1,
            imageableType: 'Review',
            url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vZGVybiUyMGhvdXNlfGVufDB8MHwwfHx8MA%3D%3D',
            preview: true,
          },
        ],
        { validate: true }
      );
    } catch (error) {
      console.error('Error during Image bulkCreate:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Images';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        imageableId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
