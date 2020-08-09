'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const Actress = loader.database.define(
  'actress',
  {
    name_en: {
    type: Sequelize.STRING,
    primaryKey: true
    },
    name_jp: {
    type: Sequelize.STRING
    },
    rank: {
    type: Sequelize.INTEGER,
    allowNull:true
    },
    image: {
    type: Sequelize.STRING,
    allowNull:false
    },
    bust: {
      type: Sequelize.INTEGER,
      allowNull:true
    },
    cup: {
      type: Sequelize.STRING,
      allowNull:true
    },
    waist: {
      type: Sequelize.INTEGER,
      allowNull:true
    },
    hip: {
      type: Sequelize.INTEGER,
      allowNull:true
    },
    height: {
      type: Sequelize.INTEGER,
      allowNull:true
    },
    birthday: {
      type: Sequelize.STRING,
      allowNull:true
    }
    // image: {
    // type: Sequelize.BLOB,
    // allowNull:false
    // }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);
module.exports = Actress;