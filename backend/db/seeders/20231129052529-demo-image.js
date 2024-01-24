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
            imageableId: 1,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D',
            preview: false,
          },
          {
            imageableId: 1,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG9tZXxlbnwwfHwwfHx8MA%3D%3D',
            preview: false,
          },
          {
            imageableId: 1,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvbWV8ZW58MHx8MHx8fDA%3D',
            preview: true,
          },
          {
            imageableId: 1,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvbWV8ZW58MHx8MHx8fDA%3D',
            preview: true,
          },
          {
            imageableId: 2,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG9tZXxlbnwwfHwwfHx8MA%3D%3D',
            preview: false,
          },
          {
            imageableId: 3,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            preview: false,
          },
          {
            imageableId: 4,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=2930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            preview: false,
          },
          {
            imageableId: 5,
            imageableType: 'Spot',
            url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGhvbWV8ZW58MHx8MHx8fDA%3D',
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
