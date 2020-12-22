export const resultJSON = {
  resultJsonObj:{
    "version": 1,
    "url": "zip下载地址",
    "name": "",
    "background": {
      "url": "",
      "widget": [
        // {
        //   "id":"",
        //   "zindex": 1,
        //   "isBack": true,
        //   "url": "xxx",
        //   "margins": {
        //     "left": 0.2764084507042254,
        //     "top": 0.228125,
        //     "right": 0,
        //     "bottom": 0
        //   },
        //   "width": 0.3107394366197183,
        //   "height": 0.526056338028169
        // }
      ]
    },
    "totalSize":"9:16",
    "avatar":{
      "h5":"",
      "app":"",
      "unity":"",
      "def": {
        "x": 0,
        "y": 0,
        "scale": 1,
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    },
    "tts": {},
    "param": []
  },
  avatarBox:{width:320,height:568},

  avatarID:1,//avatar

  avatarData:[
    {
      ind:0,
      name:'潇洒姐',
      img:'https://large.magics-ad.com/ai-3D/static/avatar/xiaosajie.jpg',
      avatarName:'pc_XiaoSaJie'
    },
    {
      ind:1,
      name:'不白吃',
      img:'https://large.magics-ad.com/ai-3D/static/avatar/bubaichi.jpg',
      avatarName:'bubaichi'
    },
    {
      ind:2,
      name:'小迈',
      img:'https://large.magics-ad.com/ai-3D/static/avatar/lijiaqi.png',
      avatarName:'LiJiaQi'
    },
    {
      ind:3,
      name:'小吉-微软',
      img:'https://large.magics-ad.com/ai-3D/static/avatar/weiya.png',
      avatarName:'WeiYa_WeiRuan'
    },
    {
      ind:4,
      name:'宝爷',
      img:'https://large.magics-ad.com/ai-3D/static/avatar/panda.png',
      avatarName:'xiongmao'
    },
    {
      ind:5,
      name:'乐比',
      img:'https://large.magics-ad.com/ai-3D/static/avatar/xw.jpg',
      avatarName:'rubi'
    },
    {
      ind:6,
      name:'泰迪',
      img:'https://large.magics-ad.com/ai-3D/static/avatar/taidi.png',
      avatarName:'sakurateddy'
    }
  ],



  resultJsonObjCopy:{
    "version": 1,
    "url": "zip下载地址",
    "name": "",
    "background":"",
    "auto":false,
    "avatar":{
      "h5":"",
      "app":"",
      "unity":"",
      "def": {
        "x": 0,
        "y": 0,
        "scale": 1,
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    },
    "tts": {},
    "param": []
  },

  textItem: {
    "index": 0,
    "type": "info",
    "isAll": false,//是否持续到剧本结束，true为持续至剧本结束,优先级高于autoDismiss｜dismissTime
    "info": {
      "margins": {
        "left": 0,
        "top": 0,
        "right": 0,
        "bottom": 0
      },
      "zindex": 1,
      "autoDismiss": false,
      "dismissTime": 3000,
      "url": "",
      "width": 0,
      "height": 0,
      "child": [
        {
          "id": "",
          "type": "text",
          "text": "",//文字内容
          "textColor": "",//字体颜色
          "textSize": "",//字体大小
          "fontFamily":"SimHei",//字体
          "gravity": "",//对齐方式 left right center
          "ellipsize": false,//是否支持跑马灯
          "region":"1",//工具端使用，文字展示位
          "width": 1,
          "height": 1,
          "animate":{
            "enter":"",
            "leave":"",
            "duration":{'enter': 1000, 'leave': 1000}
          },
          "margins": {
            "left": 0,
            "top": 0,
            "right": 0,
            "bottom": 0
          }
        }
      ]
    }
  },
  imageItem:{
    "index": 0,
    "type": "info",
    "isAll": false,//是否持续到剧本结束，true为持续至剧本结束,优先级高于autoDismiss｜dismissTime
    "info": {
      "margins": {
        "left": 0,
        "top": 0,
        "right": 0,
        "bottom": 0
      },
      "zindex": 1,
      "autoDismiss": false,
      "dismissTime": 3000,
      "url": "",
      "width": 0,
      "height": 0,
      "child": [
        {
          "id":"",
          "name": "",
          "type": "",
          "url": "",
          "width": 1,
          "height": 1,
          "region":"1",
          "animate":{
            "enter":"",
            "leave":"",
            "duration":{'enter': 1000, 'leave': 1000}
          },
          "margins": {
            "left": 0,
            "top": 0,
            "right": 0,
            "bottom": 0
          }
        },
      ]
    }
  },
  videoItem:{
    "index": 0,
    "type": "info",
    "isAll": false,//是否持续到剧本结束，true为持续至结束,优先级高于autoDismiss｜dismissTime
    "info": {
      "margins": {
        "left": 0,
        "top": 0,
        "right": 0,
        "bottom": 0
      },
      "zindex": 1,
      "autoDismiss": false,
      "dismissTime": 3000,
      "url": "",
      "width": 0,
      "height": 0,
      "child": [
        {
          "id":"",
          "name": "",
          "type": "",
          "url": "",
          "region":"1",
          "width": 1,
          "height": 1,
          "isSupportAudio":false,
          "animate":{
            "enter":"",
            "leave":"",
            "duration":{'enter': 1000, 'leave': 1000}
          },
          "margins": {
            "left": 0,
            "top": 0,
            "right": 0,
            "bottom": 0
          }
        },
      ]
    }
  },
}
