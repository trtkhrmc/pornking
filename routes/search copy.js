'use strict';
const express = require('express');
const router = express.Router();
var PornHub = require('@bowwow/pornhub_api');
var Video = require('../models/video');
var fs = require('fs');
var async = require('async');
const axios = require('axios');
const { title } = require('process');


const tgtUrlBase = 'https://jp.pornhub.com/view_video.php?viewkey=';

const ph = new PornHub();
var result={};


router.get('/pornohub',(req, res, next)=>{

  ph.search({search:encodeURIComponent(req.query.search)},{search:encodeURIComponent(req.query.search)}).then(infos =>{
    result = infos.videos;

    //result = JSON.stringify(infos.videos);
    //result = JSON.parse(infos);
    //res.render('search' ,{data: result[0]});

    for(let i = 0; i< result.length; i++){
      Video.upsert({
        video_id : result[i].video_id,
        title : result[i].title,
        duration : result[i].duration,
        views :  0.1 * Math.ceil( ((result[i].views)) / 1000 ),
        rating : result[i].rating,
        ratings : result[i].ratings,
        default_thumb : result[i].default_thumb,
        url : result[i].url,
        tags : result[i].tags,
        pornstars : result[i].pornstars,
        categories : result[i].categories,
        search : req.query.search,  //検索語を保存するように変更
        publish_date : result[i].publish_date
      }).then(() =>{
        return result[i].video_id;
      }).then((videoid) => {
        return Video.findOne({
          where: {
            video_id : videoid
          }
        });
      }).then((videos) => {
        if(!videos.title_jp){
          getJpTitle(tgtUrlBase + videos.video_id)
          .then((jpTitle) =>{
              Video.update(
                {title_jp : jpTitle},
                {where: {video_id : videos.video_id}}
            )
          })
        }
      });
    }
  });
  res.send('respond with a resource');
});

async function getJpTitle(url){
  try{
    let response = await axios.get(url);
    let extractedTitle = response.data.match(/<.*?inlineFree">.*<\/span>/g);
      return extractedTitle[0].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
  }catch(error){
    console.log(error);
  }
}

module.exports = router;