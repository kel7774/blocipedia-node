'use strict';
const faker = require("faker");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const hashedPassword = bcrypt.hashSync("fakePassword", salt);

let users = [];

for(let i = 1; i <= 15; i++){
  users.push({
    name: faker.name.firstName() + faker.name.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete("Users", null, {});
  }
};
