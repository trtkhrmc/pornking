var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Video = require('../models/video')
const Actress = require('../models/actress');
var moment = require('moment');


/* GET home page. */
router.get('/', function(req, res, next) {
  
  let period = req.query.period; /* req.queryとreq.paramsの使い分け注意 paramsは:〇〇で指定*/
  let page = req.query.page;
  const title = 'Pornking';
  
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
  Video.findAll({
    //offset: (page - 1) * 20,
    // limit: 20,
    where:{
      publish_date:{
        [Op.gte]: term
      }
    },
    order: [['score','DESC']]
    }).then((videos) => {      
      storedVideos = videos.slice( (page - 1)*20 , (page - 1)*20 + 20);
      pageArr = makePager(page, videos.length);
      page_max = Math.ceil(videos.length / 20);

    return Actress.findAll({
      limit: 30,
      order: [['rank','ASC']]
    });
  }).then((actress) => {
    // console.log(pageArr)
    res.render('index',{
        title : title,
        period : period,
        videos : storedVideos,
        actress : actress,
        pages : pageArr,
        currentPage : page,
        page_max : page_max
      });
    });  
});


function makePager(page , page_max_){
  page = parseInt(page);
  let page_max = Math.ceil(page_max_ / 20);
  let pageArr = [page];
  let pageLeft = [];
  let pageRight = [];
  
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

  pageTmp = pageLeft.concat(pageArr);  
  return pageTmp.concat(pageRight);

}

module.exports = router;
