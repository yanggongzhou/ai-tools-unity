
const cmu ='';
// const cmu = require('cmu-pronouncing-dictionary')

export class ComputerWords {

  constructor() {

  }

  //英文——————————计算词汇，处理混杂的每个数字和汉字前后增加空格----ali
  getIndex_EN_AL(str) {
    let strArr = str.split("");
    str.replace(/[\u4e00-\u9fa5_0-9]/ig,function (a,k,v) {
      strArr.splice(k,1,' '+str[k]+' ').join("")
    })
    return strArr.join('').match(/[\u4e00-\u9fa5_a-zA-Z0-9]+/ig)
  }

  //中文——————————计算中文数字，去除空余字符
  getIndex_ZH(str) {
    return str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"")
      .match(/[\u4e00-\u9fa5_0-9]/g)
  }

  //英文——————————计算词汇，处理混杂的每个数字和汉字前后增加空格----biaobei
  getIndex_EN_BB(str,refreshCmuInfo) {
    if(str&&refreshCmuInfo){
      let words = str.toLowerCase().match(/[a-zA-Z]+/ig)
      let interval_info = '',interval_infoData = []

      words.forEach((val,ind)=>{
        interval_info = cmu[val] ? cmu[val].replace(/[0-9]+/g,'') : undefined
        interval_infoData.push(interval_info)
      })

      this.cmuInfo = interval_infoData;
    }
    // console.log('str',str)
    if(!str || !str.match(/[a-zA-Z]+/ig)){
      return 0
    }
    let wordsLength  = str.match(/[a-zA-Z]+/ig).length
    let wordsCmu =  this.cmuInfo.slice(0,wordsLength)
    let cmuLength = 0;
    wordsCmu.forEach(word=>{
      if(word){
        cmuLength += word.split(' ').length
      }else {
        //没有能够转换的词汇，例如admin 返回音标是null or undefined
        //--等需求处理 估算或者cmu自定义

      }

    })
    return cmuLength
  }
}
