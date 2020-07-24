var express = require('express');
var router = express.Router();
const Video = require('../models/video')
const Actress = require('../models/actress');


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

  Video.findAll({
    offset: (page - 1) * 30,
    limit: 30,
    order: [['score','DESC']]
  }).then((videos) => {
    storedVideos = videos;
    return Actress.findAll({
      order: [['rank','ASC']]
    });
  }).then((actress) => {
    res.render('index',{
        title : title,
        period : period,
        videos : storedVideos,
        actress : actress
      });
    });  
  //res.render('index', { title: 'Express' });
});

module.exports = router;
