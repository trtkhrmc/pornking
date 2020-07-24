var express = require('express');
var router = express.Router();
const Video = require('../models/video')
const Actless = require('../models/actless')

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = 'Pornking';
  Video.findAll({
    order: [['views','DESC']]
  }).then(videos => {
    res.render('index',{
      title : 'Test Page',
      videos : videos
    });
  });
  Actless.findAll({
    order: [['rank','DESC']]
  }).then(actless => {
    res.render('index',{
      actless : actless
    });
  });

  //res.render('index', { title: 'Express' });
});

module.exports = router;
