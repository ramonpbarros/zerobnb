'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Reviews',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Users' },
          onDelete: 'CASCADE',
        },
        spotId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'Spots' },
          onDelete: 'CASCADE',
        },
        review: {
          type: Sequelize.STRING(256),
          allowNull: false,
          unique: true,
        },
        stars: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.dropTable(options);
  },
};
