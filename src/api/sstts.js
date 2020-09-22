import axios from 'axios'
import md5 from 'js-md5';
let Base64 = require('js-base64').Base64
export const SSTTS =  {
  //深声长文本tts
  getLongTTS(_text){
    let SSurl = 'https://api.deepsound.cn/tts';
    let _data = {
      "serverConfig":{
        "version":"1.0.ts_phoneme",
        "service-mode":"cloud",
        "net-timeout":5000
      },
      "audioConfig":{
        "audio-format":"audio/L16; rate=24000",
        "audio-encode":"audio/mp3",
        "output-format":"json",
        "pitch":"normal",
        "speed":"normal",
        "quality":"high",
        "volume":"1.00"
      },
      "voice":{
        "language":"zh-CN",
        "voice-name":"zh-CN-female-xiaoye"
      },
      "input":{
        "text-type":"plain",
        "text-encode":"utf-8",
        "number-read":"ordinal_first",
        "text":Base64.encodeURI(_text)
      }
    };
    // zh-CN-male-shiye
    // zh-CN-female-xiaoye
    let curtime =new Date().getTime()/1000,
      appid='6621cb48275124d98b57327a10584b00',
      checksum=md5(appid+curtime+JSON.stringify(_data))
    return new Promise(resolve => {
      axios({
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Curtime':curtime,
          'X-Appid':appid,
          'X-Appkey':'bb50300ee1172bab34354a744355cf81',
          'X-Token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBpZCI6IjY2MjFjYjQ4Mjc1MTI0ZDk4YjU3MzI3YTEwNTg0YjAwIiwiZXhwIjoiMTU5NjEyNDc5OSIsImlhdCI6IjE1OTM1MDAwMDAiLCJpc3MiOiJkZWVwc291bmQuY24iLCJzdWIiOiJ0dHMifQ.MWM4MGMwMzMzNWMxODE4NmY4YWRjMzUyOWJhMTJmY2E5N2RkYzM2Zjk2N2Q0OGU4MDllMjc5NmI3MmJlZTBkNQ',
          'X-Client-Info':'Android',
          'X-Real-Ip':'10.2.208.196',
          'X-Checksum':checksum,
        },
        method:"post",
        url:SSurl,
        data:_data
      }).then(res=>{
        axios.get(res.data.audio_url,{responseType:'arraybuffer'}).then(buffer=>{
          if (new RegExp("http").test(res.headers['timeline'])){//是否包含http
            axios.get(res.headers['timeline']).then(timelineItem=>{
              resolve({timeline:timelineItem.data, buffer:buffer.data})
            })
          }else{
            resolve({timeline:JSON.parse(res.headers['timeline']), buffer:buffer.data})
          }
        })

      })
    })
  },

}
