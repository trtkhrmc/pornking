'use strict';
const express = require('express');
const Video = require('../models/video');
const Actress = require('../models/actress');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const request = require('request-promise')

/* DMM API */
const api_id ='api_id=AGJA55x3FkZZ6NWr6gEp';
const affiliate_id = 'affiliate_id=sotomichi-990';
const site = 'site=FANZA';
const article = 'article=actress'
const sort ='sort=rank'; /*人気順*/

let tgtVideo;
let tgtActress;

router.get('/:actressName', function(req, res, next){
  Actress.findOne({
    raw: true,
    where:{
      name_en : req.params.actressName
    }
  }).then((actress) =>{
    tgtActress = actress;
    return Video.findAll({ //検索語から女優名で検索
      order: [['score','DESC']],
      where :{
        // search : {
        //     [Op.contains] : [actress.name_en.replace('_',' ')]
        // }
        search : actress.name_en.replace('_',' ')
      }
    })
  }).then((videos) => {
    tgtVideo = videos;
    //console.log(videos)
    let options = {
      method: 'GET',
      json: true,
      url : 'https://api.dmm.com/affiliate/v3/ItemList?' + api_id + '&' +
              affiliate_id + '&' + 
              site + '&' + 
              'keyword=' + encodeURIComponent(tgtActress.name_jp) + '&' +
              sort
    }
    return request(options , (error,response,body) => {
      if (!error) {
        return body;
      }else{  
        console.log('Error: ' + err.message);
      }
    });
  }).then((body) => {
    // console.log(body);
    res.render('actress',{
      tgtVideo : tgtVideo,
      tgtActress : tgtActress,
      dmmBody : body
    });
  });
})


module.exports = router;