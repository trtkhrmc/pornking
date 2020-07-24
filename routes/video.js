'use strict';
const express = require('express');
const Video = require('../models/video');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const request = require('request-promise')
const axios = require('axios');

/* DMM API */
const api_id ='api_id=AGJA55x3FkZZ6NWr6gEp';
const affiliate_id = 'affiliate_id=sotomichi-990';
const site = 'site=FANZA';
const sort ='sort=rank'; /*人気順*/

let tgtVideo;
let rltnVideos;


let options = {
  method: 'GET',
  json: true,
  url : 'https://api.dmm.com/affiliate/v3/ItemList?' + api_id + '&' +
          affiliate_id + '&' + 
          site + '&' + 
          sort
}

router.get('/:videoId', function(req, res, next){
  Video.findOne({
    where: {
      video_id : req.params.videoId
    }
  }).then((videos) => {
    tgtVideo = videos;
    return Video.findAll({
      order: [['views','DESC']],
      where : {
        categories : {
          [Op.or] : {
            [Op.contains] : [{"category":videos.categories[0].category}],
            [Op.contains] : [{"category":videos.categories[1].category}],
            [Op.contains] : [{"category":videos.categories[2].category}]
          }
        }
      }
    }) 
  }).then((videos) =>{
    rltnVideos = videos;
    return request(options , (error,response,body) => {
      if (!error) {
        return body;
      }else{  
        console.log('Error: ' + err.message);
      }
    });
  }).then((body) => {
    res.render('video' ,{
      tgtVideo : tgtVideo,
      rltnVideos: rltnVideos,
      dmmBody : body
    });
  })
});





module.exports = router;