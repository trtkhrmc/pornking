'use strict';
const $ = require('jquery');
const global = Function('return this;')();
global.jQuery = $;
const bootstrap = require('bootstrap');


$(window).on('load resize', function(){
  
  var w = $(window).width();
  
  if (w < 1200){ //max-widthの範囲内でのみ実施する
    replaceIframe();
  }
  
  function replaceIframe(){
    $('iframe').each(function(index, element){
      if (element.className.match('iframeVideo')){
        $(this).attr('width', String(w * 0.75));
        $(this).attr('height', String(w * 0.75 * 9/16 ));
      }      
    });
  }
 
})


