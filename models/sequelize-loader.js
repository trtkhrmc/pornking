'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/pornking',
  {
    logging: false
  }
);
module.exports = {
database: sequelize,
Sequelize: Sequelize
};