"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      {
        email: "admin@gmail.com",
        password: "123",
        firstName: "Daniel",
        lastName: "Dung",
        address: "HCM",
        phonenumber: "0335355830",
        gender: 1,
        image: "image1.jpg",
        roleId: "ROLE",
        positionId: "R1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
