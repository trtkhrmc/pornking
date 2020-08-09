'use strict';
const express = require('express');
const Video = require('../models/video');
const Actress = require('../models/actress');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const request = require('request-promise')
var moment = require('moment');

/* DMM API */
const api_id ='api_id=AGJA55x3FkZZ6NWr6gEp';
const affiliate_id = 'affiliate_id=sotomichi-990';
const site = 'site=FANZA';
const article = 'article=actress'
const sort ='sort=rank'; /*人気順*/

let tgtVideo;
let tgtActress;
let pageArr;
let page_max;

router.get('/:actressName', function(req, res, next){

  let period = req.query.period; /* req.queryとreq.paramsの使い分け注意 paramsは:〇〇で指定*/
  let page = req.query.page;
  
  if (typeof period === "undefined") {
    period = 'total';
  }
  if (typeof page === "undefined") {
    page = 1;
  }
  switch (period){
    case 'monthly':
      var term = moment().subtract(30, 'days').toDate()
      break;      
    case 'weekly' :
      var term = moment().subtract(7, 'days').toDate()
      break;      
    case 'daily' :
      var term = moment().subtract(2, 'days').toDate()
      break;      
    default:
      var term = moment().subtract(10, 'years').toDate()
      break;
  }

  Actress.findOne({
    raw: true,
    where:{
      name_en : req.params.actressName
    }
  }).then((actress) =>{
    tgtActress = actress;
    return Video.findAll({ //検索に使用した名称から女優を検索
      order: [['score','DESC']],
      where :{
        // search : {
        //     [Op.contains] : [actress.name_en.replace('_',' ')]
        // }
        //search : actress.name_en.replace('_',' '),
        search : {
          [Op.or]: [actress.name_en.replace('_',' ') , actress.name_jp]
        },
        publish_date:{
          [Op.gte]: term
        }
      }
    })
  }).then((videos) => {
    // tgtVideo = videos;
    //console.log(videos)
    tgtVideo = videos.slice( (page - 1)*20 , (page - 1)*20 + 20);
    pageArr = makePager(page, videos.length);
    page_max = Math.ceil(videos.length / 20);

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
    res.render('actress',{
      tgtVideo : tgtVideo,
      tgtActress : tgtActress,
      period : period,
      dmmBody : body,
      pages : pageArr,
      currentPage : page,
      page_max : page_max
    });
  });
})



function makePager(page , page_max_){
  page = parseInt(page);
  let page_max = Math.ceil(page_max_ / 20);
  let pageArr = [page];
  let pageLeft =[];
  let pageRight =[];
  
  
  if(page >= 5){
    pageLeft = ['«', 1 ,'...',page-3 ,page-2 , page -1 ];
  }else if(page == 4){
    pageLeft = ['«',page-3 ,page-2 , page -1 ];
  }else if(page ==3){
    pageLeft = ['«',page-2 , page -1 ];
  }else if(page == 2){
    pageLeft = ['«',page -1 ];
  }else if(page == 1){
    pageLeft = ['«'];
  }

  if(page <= page_max - 4){
    pageRight = [page+1 ,page+2 , page +3 ,'...', page_max, '»'];
  }else if(page == page_max -3){
    pageRight = [page + 1 ,page+2 , page +3 , '»'];
  }else if(page ==page_max -2){
    pageRight = [page + 1 , page + 2, '»' ];
  }else if(page == page_max - 1){
    pageRight = [page + 1 , '»' ];
  }else if(page == page_max){
    pageRight = ['»'];
  }

  let pageTmp = pageLeft.concat(pageArr);  
  return pageTmp.concat(pageRight);
}

module.exports = router;