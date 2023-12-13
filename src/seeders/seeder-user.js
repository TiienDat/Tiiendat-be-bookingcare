'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'fakerT1@gmail.com',
      password: '123',
      firstName: 'T1',
      lastName: 'Faker',
      address: 'Korea',
      phonenumber: '0122222222',
      gender: '1',
      image: 'xyz',
      roleId: 'RoleId',
      positionId: 'PositionID',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
