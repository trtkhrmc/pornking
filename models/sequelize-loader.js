'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/pornking',
  {
    //logging: false
  }
);
module.exports = {
database: sequelize,
Sequelize: Sequelize
};