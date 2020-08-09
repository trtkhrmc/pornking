var async = require('async');
const axios = require('axios');

getJpTitle('https://jp.pornhub.com/view_video.php?viewkey=ph5e9e0b740f72b')

/* Pornhubからhttp リクエストによる和名タイトル取得 */
async function getJpTitle(url){
  try{
    let response = await axios.get(url);
    let extractedTitle = response.data.match(/<.*?inlineFree">.*<\/span>/g);
    console.log(extractedTitle);
    // await sleep(1000);  // 5000ミリ秒スリープする APIの過負荷によるエラー回避
    return extractedTitle[0].replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
  }catch(error){
    console.log(error);
  }
}