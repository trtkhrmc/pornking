'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;
const Video = loader.database.define(
'videos',
  {
    video_id: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
    },
    title: {
    type: Sequelize.STRING,
    allowNull: false
    },
    url: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    default_thumb:{
      type: Sequelize.BLOB,
      allowNull: true
    } 
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);
module.exports = Video;