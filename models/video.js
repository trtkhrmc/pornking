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
    title_jp: {
      type: Sequelize.STRING,
      allowNull: true
    },    
    duration: {
      type: Sequelize.STRING,
      allowNull: false
    },
    views: {
      type: Sequelize.FLOAT,
      allowNull: false
    },    
    rating: {
      type: Sequelize.STRING,
      allowNull:false  
    },
    ratings: {
      type: Sequelize.INTEGER,
      allowNull:false  
    },
    score: {
      type: Sequelize.FLOAT,
      allowNull:false  
    },    
    default_thumb:{
      type: Sequelize.TEXT,
      allowNull: false
    },
    url: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    tags:{
      type: Sequelize.JSON,
      allowNull:true
    },
    pornstars:{
      type: Sequelize.JSON,
      allowNull:true
    },
    categories:{
      type:Sequelize.JSONB,
      allowNull:true
    },
    search:{
      //type:Sequelize.ARRAY(Sequelize.TEXT),
      type:Sequelize.STRING,
      allowNull:false
    },    
    publish_date:{
      type:Sequelize.DATEONLY,
      allowNull:false
    },
    updatedAt:{
      type:Sequelize.DATE,
      allowNull:false
    }    
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);
module.exports = Video;