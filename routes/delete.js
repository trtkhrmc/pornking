'use strict';
const express = require('express');
const router = express.Router();
var PornHub = require('@bowwow/pornhub_api');
var Video = require('../models/video');
var fs = require('fs');
var async = require('async');
const axios = require('axios');



const tgtUrlBase = 'https://jp.pornhub.com/view_video.php?viewkey=';

router.get('/:service', (req, res, next)=>{
  
  switch (req.params.service){
    case 'pornohub':
      Video.findAll({
        raw: true,
        offset: 0,
        limit: 30,
        order: [['score','DESC']]
      }).then(async (videos) => {

        for(let i = 0; i< videos.length; i++){
          tgtLDConf(tgtUrlBase + videos[i].video_id)
          .then((state) =>{
            if (state){
              Video.destroy({
                where: { video_id: videos[i].video_id }
              });
              console.log(videos[i].video_id + ' is deleted' )
            }
          });
          await sleep(1000);  // 100ミリ秒スリープする APIの過負荷によるエラー回避
          console.log(videos[i].video_id)
        }
        res.send('Update Completed!!');  
      });
    break;
  default:
    res.send('Invalid URL');  
    break;
  }
});

/* http リクエストによる動画公開状況の死活確認 */
async function tgtLDConf(url){
  try{
    let response = await axios.get(url);
    let result = response.data.match(/<div\sclass="removed">/g);
    if (result!=null){  
      return true;
    }
    else{
      return false;
    }
  }catch(error){
    console.log(error);
  }
}


function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = router;