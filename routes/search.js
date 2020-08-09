'use strict';
const express = require('express');
const router = express.Router();
var PornHub = require('@bowwow/pornhub_api');
var Video = require('../models/video');
var fs = require('fs');
var async = require('async');
const axios = require('axios');
const { title } = require('process');
const { Console } = require('console');
const { resolve } = require('path');

const normViewCoef = 100000;
const normGoodCoef = 350;
const normGoodPerView = 0.015; 

const tgtUrlBase = 'https://jp.pornhub.com/view_video.php?viewkey=';

const ph = new PornHub();
var result={};

router.get('/pornohub',(req, res, next)=>{
  for(let pg = 1; pg < 2; pg++ ){  //3ページまで自動取得する
    ph.search({search:encodeURIComponent(req.query.search),page:pg,category:'Japanese'}).then(async (infos) =>{
      result = infos.videos;
      const updatedAt = new Date();

      for(let i = 0; i< result.length; i++){
        calcDateDiff(updatedAt, result[i].publish_date)
        .then((dateDiff) =>{
          return calcScore(dateDiff ,result[i])
        }).then((score) =>{
          return Video.upsert({
            video_id : result[i].video_id,
            title : result[i].title,
            duration : result[i].duration,
            views :  (0.1 * Math.ceil( ((result[i].views)) / 1000 )).toFixed(1),
            rating : result[i].rating,
            ratings : result[i].ratings,
            score : (0.1 * Math.ceil( ((score * 100)) * 10 )).toFixed(1),
            default_thumb : result[i].default_thumb,
            url : result[i].url,
            tags : result[i].tags,
            pornstars : result[i].pornstars,
            categories : result[i].categories,
            search : req.query.search,  //検索語を保存するように変更
            publish_date : result[i].publish_date,
            updatedAt : updatedAt
          })
        }).then(() =>{
          return result[i].video_id;
        }).then((videoid) => {
          return Video.findOne({
            where: {
              video_id : videoid
            }
          });
        }).then(async (videos) => {
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
      await sleep(500); //不可軽減のために500msスリープ
      }
    });
  }
  res.send('respond with a resource');
});


/* Pornhubからhttp リクエストによる和名タイトル取得 */
async function getJpTitle(url){
  try{
    let response = await axios.get(url);
    let extractedTitle = response.data.match(/<.*?inlineFree">.*<\/span>/g);
    return extractedTitle[0].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
  }catch(error){
    console.log(error);
  }
}
/* 投稿日と取得日の日数差を算出 */
function calcDateDiff(date1, date2){
  return new Promise(function(resolve, reject){
    resolve((Date.parse(date1) - Date.parse(date2)) / 86400000);
  });
}

/* 動画のスコアの算出*/
function calcScore(dateDiff, result){
  if (dateDiff >= 7 && result.rating < 100){  //Monthly 以上を対象
    
    let score = (result.views / dateDiff / normViewCoef) * 0.3 + 
                (result.ratings * result.rating / 100) / dateDiff /normGoodCoef * 0.3 + 
                ((result.ratings * result.rating / 100) / (1 - result.rating / 100 )) / 
                (result.views) / normGoodPerView * 0.4;
    // console.log(score);
    return Promise.resolve(score);
  }else if(dateDiff >= 1){
    let score = (result.views / dateDiff / normViewCoef) * 0.5 + 
                (result.ratings * result.rating / 100) / dateDiff /normGoodCoef * 0.5
    return Promise.resolve(score);
  }else{
    return Promise.resolve(1);
  }
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = router;