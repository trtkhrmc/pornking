'use strict';
const express = require('express');
const Video = require('../models/video');
const Actress = require('../models/actress');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var fs = require('fs');
const csv = require('csv');
const multer = require('multer');

const request = require('request');
const { resolve } = require('path');
var async = require('async');


/* DMM API */
const api_id ='api_id=AGJA55x3FkZZ6NWr6gEp';
const affiliate_id = 'affiliate_id=sotomichi-990';
const keyword = 'keyword=';

//GET処理(アップロード画面の表示)
router.get('/', (req, res) => {
  res.render('upload',{status:''});
})
//POST処理
router.post('/', multer({ dest: 'tmp/' }).single('file'), (req, res) => {
  const filename = req.body.filename
  //const content = fs.readFileSync(req.file.path, 'utf-8');
  //res.send(filename + ': ' + content + req.file.path);

  // new Promise(function(resolve, reject){
  //   resolve(fs.createReadStream(req.file.path).pipe(parser));
  // }).then(()=>{
  //   res.render('upload',{status:'アップロードと更新が完了しました'});
  // })
  res.render('upload',{status:'アップロードが完了しました'});

  const parser = csv.parse({ from_line: 2 }, async (error, data) => {
  
    for(let i = 0; i< data.length; i++){
      let element = data[i];
      getActressData(encodeURIComponent(element[1])).then(body => {
      // console.log(element[1] + '取り込み完了')
      let extractedName = body.result.actress[0].imageURL.large.match(/\w*?\.jpg$/g); //ファイル名から名前(URL用)を抽出

      Actress.upsert({
        name_en : extractedName[0].replace(/.jpg/g,''), //拡張子を抜いた名称を英名に設定。
        name_jp : element[1],
        rank : element[2],
        image : body.result.actress[0].imageURL.large,
        bust : body.result.actress[0].bust,
        cup : body.result.actress[0].cup,
        waist : body.result.actress[0].waist,
        hip: body.result.actress[0].hip,
        height: body.result.actress[0].height,
        birthday : body.result.actress[0].birthday
      })
    });
      await sleep(3000);  // 3000ミリ秒スリープする APIの過負荷によるエラー回避
    }
    // res.render('upload',{status:'アップロードと更新が完了しました'});
  })

  fs.createReadStream(req.file.path).pipe(parser)

});



//処理（後でpipeに食べさせる）
/*
const parser = csv.parse({ from_line: 2 }, async (error, data) => {
  
  for(let i = 0; i< data.length; i++){
    let element = data[i];
    getActressData(encodeURIComponent(element[1])).then(body => {
    console.log(element[1] + '取り込み完了')
    Actress.upsert({
      name_en : element[0],
      name_jp : element[1],
      rank : element[2],
      image : body.result.actress[0].imageURL.large,
      bust : body.result.actress[0].bust,
      cup : body.result.actress[0].cup,
      waist : body.result.actress[0].waist,
      hip: body.result.actress[0].hip,
      height: body.result.actress[0].height,
      birthday : body.result.actress[0].birthday
    })
  });
    await sleep(5000);  // 5000ミリ秒スリープする APIの過負荷によるエラー回避
    res.render('upload',{status:element[1] + '取り込み完了'});
  }
  res.render('upload',{status:'アップロードと更新が完了しました'});
})
*/  
  //読み込みと処理を実行
  //fs.createReadStream('actressList.csv').pipe(parser);


function getActressData(keyword){
  return new Promise(resolve => {
    let options = {
      method: 'GET',
      json: true,
      url : 'https://api.dmm.com/affiliate/v3/ActressSearch?' + api_id + '&' +
              affiliate_id + '&' + 
              'keyword=' + keyword
    }
    setTimeout(()=>{
      request(options , (error,response,body) => {
        if (!error) {
          resolve(body)
        }else{
          reject('Error: ' + error.message);
        }
      });
    },5000)
  })
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}


module.exports = router;