<template>
  <div>
    <div
      class="avatarBox"
      ref="avatarBoxRef"
      :style="{
        width:avatarBox.width+'px',
        height:avatarBox.height+'px'}">
      <div v-for="(Tragger1,ListInd) in TriggerDivList" :key="ListInd">
        <div
          class="messageBox"
          v-for="(trig,trigInd) in Tragger1"
          :key="trigInd+'信息板'"
          v-show="trig.isShow"
          :style="{
          width:trig.info.width+'px',
          height:trig.info.height+'px',
          left:trig.info.margins.left+'px',
          top:trig.info.margins.top+'px',
          // 'background':'url('+trig.info.background+')'+' no-repeat',
          // 'background-size':'cover',
          // background:'red',
        }">
<!--          <div  v-for="(val,ind) in trig.info.child" :key="ind+'内容区'">-->
            <div
              v-if="trig.info.child[0].type==='image'"
              class="messageBox-img"
              :style="{
              width: trig.info.child[0].width+'px',
              height: trig.info.child[0].height+'px',
              left:trig.info.child[0].margins.left+'px',
              top:trig.info.child[0].margins.top+'px',
            }">
              <img width="100%" height="100%" :src="trig.info.child[0].url" alt="">
            </div>
            <div
              v-if="trig.info.child[0].type==='text'"
              class="messageBox-img"
              :style="{
              width: trig.info.child[0].width+'px',
              height: trig.info.child[0].height+'px',
              left:trig.info.child[0].margins.left+'px',
              top:trig.info.child[0].margins.top+'px',
              'font-size':trig.info.child[0].textSize+'px',
              color:trig.info.child[0].textColor,
              'text-align':trig.info.child[0].gravity,
              // background: 'green',
            }">
              {{val.text}}
            </div>
            <div
              v-if="trig.info.child[0].type==='video'"
              class="messageBox-img"
              :style="{
              width: trig.info.child[0].width+'px',
              height: trig.info.child[0].height+'px',
              left:trig.info.child[0].margins.left+'px',
              top:trig.info.child[0].margins.top+'px',
            }">
              <video width="100%" height="100%" :ref="trig.info.child[0].id" :muted="!trig.info.child[0].isSupportAudio" :src="trig.info.child[0].url" loop></video>
            </div>
<!--          </div>-->

        </div>
      </div>

      <!--avatar-->
      <canvas
        class="avatar-canvas"
        ref="magics"
        :width="canvasWidth"
        :height="canvasHeight"></canvas>
      <div class="playAgain_btnBox" v-show="playAgainShow">
        <i class="el-icon-refresh-left playAgain_btn" @click="playAgain"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import timer from "../../api/timer";
  import {resultJSON} from "../../api/result";
  import md5 from 'js-md5';
  let Base64 = require('js-base64').Base64
  import axios from 'axios'
  export default {
    props:{
      scriptRow:Object
    },
    data () {
      return {
        playAgainShow:false,//重播按钮显示

        avatarID:4,
        avatarData:[
          {
            ind:0,
            name:'教授',
            img:'https://large.magics-ad.com/ai-3D/static/avatar/jiaoshou.png',
            resourceUrl:'https://large.magics-ad.com/webgl/sdk/assets/assistant/jiaoshou_0915.magics',
            loading:false,
            resourceUrlData:[
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/jiaoshou5.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/jiaoshou6.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/jiaoshou_0915.magics'
            ],
            TTS:{
              "type":"shensheng",
              "pitch":"normal",
              "speed":"normal",
              "voice-name":"zh-CN-male-xiaowu"
            }
          },
          {
            ind:1,
            name:'KunGe',
            img:'https://large.magics-ad.com/ai-3D/static/avatar/kunge.png',
            resourceUrl:'https://large.magics-ad.com/webgl/sdk/assets/assistant/KunGe_0915.magics',
            loading:false,
            resourceUrlData:[
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/KunGe5.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/KunGe6.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/KunGe_0915.magics',
            ],
            TTS:{
              "type":"shensheng",
              "pitch":"normal",
              "speed":"normal",
              "voice-name":"zh-CN-male-xiaowu"
            }
          },
          {
            ind:2,
            name:'潇洒姐',
            img:'https://large.magics-ad.com/ai-3D/static/avatar/xiaosajie.jpg',
            resourceUrl:'https://large.magics-ad.com/webgl/sdk/assets/assistant/xiaosajie_0915.magics',
            loading:false,
            resourceUrlData:[
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/xiaosajie5.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/xiaosajie_0915.magics',
            ],
            TTS:{
              "type":"shensheng",
              "pitch":"normal",
              "speed":"normal",
              "voice-name":"zh-CN-female-xiaoye"
            }
          },
          {
            ind:3,
            name:'不白吃',
            img:'https://large.magics-ad.com/ai-3D/static/avatar/bubaichi.jpg',
            resourceUrl:'https://large.magics-ad.com/webgl/sdk/assets/assistant/bubaichi_0915.magics',
            loading:false,
            resourceUrlData:[
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/bubaichi5.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/bubaichi_0915.magics',
            ],
            TTS:{
              "pitch":"high",
              "speed":"high",
              "voice-name":"zh-CN-male-shiye"
            }
            // TTS:{
            //   "type":"shensheng",
            //   "number-read":"normal",
            //   "pitch":"high",
            //   "speed":"low",
            //   "stretch":"0.80",
            //   "net-timeout":3000,
            //   "voice-name":"zh-CN-male-s16_mi4391509221238112257"
            // }
          },
          {
            ind:4,
            name:'小迈',
            img:'https://large.magics-ad.com/ai-3D/static/avatar/lijiaqi.png',
            resourceUrl:'https://large.magics-ad.com/webgl/sdk/assets/assistant/lijiaqi_0918.magics',
            loading:false,
            resourceUrlData:[
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/lijiaqi_0918.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/lijiaqi3.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/lijiaqi_0915.magics'
            ],
            TTS:{
              "type":"shensheng",
              "pitch":"normal",
              "speed":"normal",
              "voice-name":"zh-CN-male-xiaowu"
            }
          },
          {
            ind:5,
            name:'小吉',
            img:'https://large.magics-ad.com/ai-3D/static/avatar/weiya.png',
            resourceUrl:'https://large.magics-ad.com/webgl/sdk/assets/assistant/WeiYa_0918.magics',
            loading:false,
            resourceUrlData:[
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/WeiYa_0918.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/WeiYa3.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/WeiYa_0915.magics',
            ],
            TTS:{
              "type":"shensheng",
              "pitch":"normal",
              "speed":"normal",
              "voice-name":"zh-CN-female-xiaozuo"
            }
          },
          {
            ind:6,
            name:'宝爷',
            img:'https://large.magics-ad.com/ai-3D/static/avatar/panda.png',
            resourceUrl:'https://large.magics-ad.com/webgl/sdk/assets/assistant/panda_0918.magics',
            resourceUrlData:[
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/panda_0918.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/pandaTest.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/panda3.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/panda2.magics',
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/panda_0915.magics',
            ],
            loading:false,
            TTS:{
              "type":"shensheng",
              "pitch":"normal",
              "speed":"normal",
              "voice-name":"zh-CN-male-xiaowu"
            }
          },
          {
            ind:7,
            name:'小蛙',
            img:'https://large.magics-ad.com/ai-3D/static/avatar/xw.jpg',
            resourceUrl:'https://large.magics-ad.com/webgl/sdk/assets/assistant/rubi_0918.magics',
            loading:false,
            resourceUrlData:[
              'https://large.magics-ad.com/webgl/sdk/assets/assistant/rubi_0918.magics',
            ],
            TTS:{
              "type":"shensheng",
              "pitch":"normal",
              "speed":"normal",
              "voice-name":"zh-CN-female-xiaozuo"
            }
          }
        ],
        magics:'',//API实例
        actionList:[],//动作
        actionMap:{},//动作时长
        canvasWidth:320,
        canvasHeight:568,
        playObject:{},
        avatarBox:{width:320,height:568},

        TriggerDivList:[],//页面元素
        TriggerDivIndex:0,
        ZHSSarr:["a","ia","ai","ao","an","iao","ian","uai","ang","iang","o","u","ou","uo","ong","iong","v","ve","vn","io","ui","un","iu","iou","ua","uang","ueng","van","uan","uen","e","ei","er","eer","en","uei","ng","eng","i","ie","in","ing","ii","iii"],

        allTimeArrNumber:0,//计算每次返回的时间戳的韵母长度
        ssTtsData:[],
        ssTtsIndex:0,//读取时间和音频的下标
        ws:'',

        contentIndex:0,

        actionIrregularTimeOut:'',
      }
    },
    mounted() {

    },
    methods:{
      playAgain(){
        let self = this;
        setTimeout(()=>{
          self.playAgainShow = false;
        },500)
        this.cleanRead()
        this.contentIndex = 0;
        // timer.setTimeout(()=>{
          self.getSSAudio(self.playObject.param[0].content)
        // },self.playObject.param[0].intervalTime)
      },
      getJson(row){
        let self= this;
        this.playAgainShow = false;
        this.contentIndex = 0;
        axios.get(row.script_url).then(res=>{
          if(res.status===200){
            self.playObject = res.data
            let _resourceUrl='',_name='';
            self.avatarData.forEach((val,ind)=>{
              if(val.resourceUrlData.indexOf(self.playObject.avatar.h5)!==-1){
                self.avatarID = val.ind;
                _resourceUrl = val.resourceUrl;
                _name=val.name;
              }
            })
            self.initAvatar(_name,_resourceUrl);
          }else{
            this.$message.error('资源请求失败，请关闭预览页面，重新打开')
          }
        })
      },
      cleanRead(){
        let self = this;
        timer.clean();
        this.TriggerDivList.forEach(Trigger=>{
          Trigger.forEach(val=>{
            val.info.child.forEach((children,childInd)=>{
              if(children.type==='video'){
                if(self.$refs[children.id]){
                  self.$refs[children.id][0].pause()
                }
              }
            })
            val.isShow=false;
          })
        })
        this.TriggerDivList=[];
        this.$forceUpdate()
      },
      stopRead(){
        let self = this;
        this.magics.stopRender();
        setTimeout(()=>{
          self.magics.startRender();
        },300)
        this.cleanRead();
      },
      //表情播放开始
      expressBegin(res){
        if(res.tag===Magics.TYPE_MOUTHSPEAK){
          // console.log('执行脚本start')
          this.ssTtsIndex+=1;
        }
      },
      expressEnd(res){
        let self = this;
        if(res.tag===Magics.TYPE_MOUTHSPEAK){
          if(self.ssTtsIndex<self.ssTtsData.length){
            // console.log('ssTtsIndex',self.ssTtsIndex)
            self.OhMySSRender(self.ssTtsIndex,false)
          }else{
            console.log('content - 语音播放结束')
            this.contentIndex+=1;
            if(self.contentIndex<self.playObject.param.length){
              // timer.setTimeout(()=>{
                self.getSSAudio(self.playObject.param[self.contentIndex].content)
              // },self.playObject.param[self.contentIndex].intervalTime)
            }else{
              this.$message.info('播放结束')
              this.cleanRead()
              this.playAgainShow = true;
            }
          }
        }
      },
      //初始化
      initAvatar(_name,_resourceUrl){
        console.log(_name,_resourceUrl)
        this.contentIndex = 0;
        let self = this;
        let canvas = this.$refs.magics;
        if(!canvas) {
          this.$message.error('您的浏览器暂不支持canvas！请切换浏览器再尝试')
          return false
        }
        this.magics = new Magics.AssistantRender(canvas, this.canvasWidth, this.canvasHeight);
        this.magics.loadResource(_name,_resourceUrl);

        self.magics.startRender();
        // Magics.on(Magics.AVATAR_LOADED, function(){ console.log('init success')}); //智能客服初始化成功回调
        self.magics.setAudioBySecurityPolicy();
        //智能客服动画初始化成功回调
        Magics.on(Magics.AVATAR_ACTIONS_LOADED, function (res) {
          self.actionMap= self.magics.getActionMap();
          self.actionList = self.magics.getActionList();

          self.magics.setEyeExpression(true);//眨眼
          // self.magics.showAvatarShadow(true);//阴影

          self.magics.setAvatarYawAngle(self.playObject.avatar.def.rotation.z);
          self.magics.setAvatarScale(self.playObject.avatar.def.scale);
          let jsonx = self.playObject.avatar.def.x*resultJSON.avatarBox.width
          let jsony = self.playObject.avatar.def.y*resultJSON.avatarBox.height
          self.magics.setAvatarScreenPt(jsonx,jsony);

          self.$refs.avatarBoxRef.style['background']='url('+self.playObject.background+') no-repeat'
          self.$refs.avatarBoxRef.style['background-size']='100% 100%'
          // timer.setTimeout(()=>{
          self.getSSAudio(self.playObject.param[0].content)
          // },self.playObject.param[contentInd].intervalTime)
        });
        // //智能客服资源加载成功回调
        // Magics.on(Magics.EFFECT_LOADED, function (res) {console.log('loading success',res)});
        //智能客服资源加载失败回调
        Magics.on(Magics.EFFECT_LOAD_ERR, function (res) {
          console.log('error',res)
          self.$message.error('资源加载失败')
        });
        //智能客服动作播放开始回调
        Magics.on(Magics.ACTION_BEGIN, function (res) {
          // console.log('动作播放开始',res)
        });
        //智能客服动作播放结束回调
        Magics.on(Magics.ACTION_END, function (res) {
          // console.log('动作播放结束',res)
        });
        //智能客服表情播放开始回调-语音
        Magics.on(Magics.EXPRESS_BEGIN,self.expressBegin);
        //智能客服表情播放结束回调-语音
        Magics.on(Magics.EXPRESS_END, self.expressEnd);
      },

      OhMySSRender(int,isFirst){
        let self = this;
        let _intervalTime = self.playObject.param[this.contentIndex].intervalTime
        //初次加载执行全部定时器动作和信息板
        let triggerDivData;
        if(int===0){
          this.allTimeArrNumber =0
        }
        if(isFirst){
          this.TriggerDivList[this.contentIndex]=[]
          triggerDivData = this.TriggerDivList[this.contentIndex]
        }else{
          triggerDivData = this.TriggerDivList[this.contentIndex]
        }

        //每次计算时间轴的长度
        let allTimeArr=[] ;
        this.ssTtsData[int].timeline.forEach((val,index)=>{
          if(self.ZHSSarr.indexOf(val.phm)!==-1){
            allTimeArr.push(val)
          }
        })
        this.allTimeArrNumber += allTimeArr.length;
        // console.log(' this.allTimeArrNumber', this.allTimeArrNumber)
        let paramItem = JSON.parse(JSON.stringify(this.playObject.param[this.contentIndex]))
        paramItem.trigger.forEach((trig,trigInd)=>{
          //信息
          if(trig.type==='info'){
            if(isFirst){
              let item = JSON.parse(JSON.stringify(trig));
              item.isShow = false;
              item.info.width *= this.avatarBox.width;
              item.info.height *= this.avatarBox.height;
              item.info.margins.left *= this.avatarBox.width;
              item.info.margins.top *= this.avatarBox.height;
              item.info.child.forEach((children,childInd)=>{
                children.width*=item.info.width;
                children.height*=item.info.height;
                children.margins.top*=item.info.height;
                children.margins.left*=item.info.width;
              })
              triggerDivData.push(item)
            }

            //信息板预览区
            if(triggerDivData[trigInd].index<=self.allTimeArrNumber&&triggerDivData[trigInd].index>=self.allTimeArrNumber-allTimeArr.length){
              let timeOut = 0;//timeOut为本段播放开始到文字下标的时间,秒
              // console.log('板allTimeArr[actionItem.index-self.allTimeArrNumber+allTimeArr.length]',allTimeArr[trig.index-self.allTimeArrNumber+allTimeArr.length])
              if(allTimeArr[trig.index-self.allTimeArrNumber+allTimeArr.length]){
                timeOut = allTimeArr[trig.index-self.allTimeArrNumber+allTimeArr.length].beg;
              }
              if(trig.index!==0&&!timeOut){
                return false;
              }
              if(int===0&&triggerDivData[trigInd].index!==0 ){//如果定义的下标是0就不再遵守间隔时间，立即执行
                timer.setTimeout(()=>{
                  console.log('info',triggerDivData[trigInd].index,timeOut,self.contentIndex)
                  // console.log('triggerDivData[trigInd]',triggerDivData[trigInd])
                  triggerDivData[trigInd].isShow = true
                  self.$forceUpdate()
                  let _children = triggerDivData[trigInd].info.child[0]
                  if(_children.type==='video'){
                    self.$nextTick(()=>{
                      self.$refs[_children.id][0].load()
                      self.$refs[_children.id][0].play()
                    })
                  }
                  if(!triggerDivData[trigInd].isAll){
                    timer.setTimeout(()=>{
                      if(_children.type==='video'){
                        self.$refs[_children.id][0].pause()
                      }
                      triggerDivData[trigInd].isShow = false
                      self.$forceUpdate()
                    },triggerDivData[trigInd].info.dismissTime)
                  }
                },timeOut+_intervalTime)
              }else{
                timer.setTimeout(()=>{
                  // console.log('triggerDivData[trigInd]',triggerDivData[trigInd])
                  triggerDivData[trigInd].isShow = true
                  self.$forceUpdate()
                  let _children = triggerDivData[trigInd].info.child[0]
                  if(_children.type==='video'){
                    self.$nextTick(()=>{
                      self.$refs[_children.id][0].load()
                      self.$refs[_children.id][0].play()
                    })
                  }
                  if(!triggerDivData[trigInd].isAll){
                    timer.setTimeout(()=>{
                      if(_children.type==='video'){
                        self.$refs[_children.id][0].pause()
                      }
                      triggerDivData[trigInd].isShow = false
                      self.$forceUpdate()
                    },triggerDivData[trigInd].info.dismissTime)
                  }
                },timeOut)
              }
            }
          };
          //动作
          if(trig.type==='action'){
            let actionItem = JSON.parse(JSON.stringify(trig));
            if(trig.index<=self.allTimeArrNumber&&trig.index>self.allTimeArrNumber-allTimeArr.length){
              let timeOut=0; //timeOut为本段播放开始到文字下标的时间,秒
              // console.log('allTimeArr[actionItem.index-self.allTimeArrNumber+allTimeArr.length]',allTimeArr[actionItem.index-self.allTimeArrNumber+allTimeArr.length])
              if(allTimeArr[actionItem.index-self.allTimeArrNumber+allTimeArr.length]){
                timeOut = allTimeArr[actionItem.index-self.allTimeArrNumber+allTimeArr.length].beg
              }
              //处理最后一个标签动作时间
              if(allTimeArr.length===(actionItem.index-self.allTimeArrNumber+allTimeArr.length)){
                timeOut = allTimeArr[allTimeArr.length-1].beg
              }
              if(int===0&&trig.index!==0){
                timer.setTimeout(()=>{
                  self.magics.playAction(actionItem.action.actionName,0)
                },timeOut+_intervalTime)
              }else{
                timer.setTimeout(()=>{
                  self.magics.playAction(actionItem.action.actionName,0)
                },timeOut)
              }
            }else if(actionItem.index<=self.allTimeArrNumber&&actionItem.index>=self.allTimeArrNumber-allTimeArr.length&&actionItem.index===0){
              self.magics.playAction(actionItem.action.actionName,0)
            }
          }
        })
        self.structuralClone(self.ssTtsData[int].buffer).then(res=>{
          if(!self.ssTtsData[int].timeline.length){
            self.getAudioDuring(self.ssTtsData[int].buffer).then(duration=>{
              // console.log('无声音mp3间隔',duration)
              self.ssTtsIndex+=1;
              timer.setTimeout(()=>{
                self.OhMySSRender(self.ssTtsIndex,false);
              },duration*1000)
            })
          }else{
            if(self.playObject.param[self.contentIndex].intervalTime&&int===0){
              timer.setTimeout(()=>{
                self.magics.playSpeechExpression2(paramItem.content, res,self.ssTtsData[int].timeline,Magics.TTS_SHENSHENG);
              },_intervalTime)
            }else{
              self.magics.playSpeechExpression2(paramItem.content, res,self.ssTtsData[int].timeline,Magics.TTS_SHENSHENG);
            }
          }
        })

      },
      //--tts需要修改为ws长链接的方式1
      getSSAudio(_text){
        this.ssTtsData = [];
        let isFirst = true;
        let self=this;

        let _pitch = '',_speed='',_voiceName='';
        this.avatarData.forEach(val=>{
          if(val.ind===this.avatarID){
            _pitch = val.TTS.pitch;
            _speed = val.TTS.speed;
            _voiceName = val.TTS["voice-name"]
          }
        })

        // let _pitch = this.avatarData[this.avatarID].TTS.pitch,
        //   _speed = this.avatarData[this.avatarID].TTS.speed,
        //   _voiceName = this.avatarData[this.avatarID].TTS['voice-name'];
        let _numberRead='ordinal_first',_quality ='high',_netTimeout =5000,_stretch="1.00",_audioFormat="audio/L16; rate=24000";
        // //不白吃特殊处理
        // if(this.avatarID===3){
        //   _voiceName = 'zh-CN-male-s16_mi4391509221238112257'
        //   _numberRead='normal';
        //   _quality="high_general";
        //   _netTimeout=3000;
        //   _stretch='0.80';
        //   _audioFormat = "audio/L16; rate=16000";
        //   _pitch='';
        //   _speed = 'low'
        //   this.ws = new WebSocket("wss://card.deepsound.cn/tts/ws");
        // } else{
        //   this.ws = new WebSocket("wss://api.deepsound.cn/tts/ws");
        // }
        this.ws = new WebSocket("wss://api.deepsound.cn/tts/ws");
        let _data = {
          "serverConfig":{
            "version":"1.0.ts_phoneme",
            "service-mode":"cloud",
            "net-timeout":_netTimeout
          },
          "audioConfig":{
            "stretch":_stretch,
            "audio-format":_audioFormat,
            "audio-encode":"audio/mp3",
            "output-format":"stream",
            "pitch":_pitch,
            "speed":_speed,
            "quality":_quality,
            "volume":"1.00"
          },
          "voice":{
            "language":"zh-CN",
            "voice-name":_voiceName
          },
          "input":{
            "text-type":"plain",
            "text-encode":"utf-8",
            "number-read":_numberRead,
            "text":Base64.encodeURI(_text)
          }
        };
        let curtime =(new Date().getTime()/1000).toString();
        let appid='6621cb48275124d98b57327a10584b00';
        let checksum=md5(appid+curtime+JSON.stringify(_data))

        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBpZCI6IjY2MjFjYjQ4Mjc1MTI0ZDk4YjU3MzI3YTEwNTg0YjAwIiwiZXhwIjoiMTU5NjEyNDc5OSIsImlhdCI6IjE1OTM1MDAwMDAiLCJpc3MiOiJkZWVwc291bmQuY24iLCJzdWIiOiJ0dHMifQ.MWM4MGMwMzMzNWMxODE4NmY4YWRjMzUyOWJhMTJmY2E5N2RkYzM2Zjk2N2Q0OGU4MDllMjc5NmI3MmJlZTBkNQ';
        let appkey='bb50300ee1172bab34354a744355cf81'
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = function() {
          var header={
            "X-Curtime" : curtime,
            "X-Appid" : appid,
            "X-Appkey" : appkey,
            "X-Token" : token,
            'X-Client-Info':'Android',
            'X-Real-Ip':'10.2.208.196',
            "X-Checksum" : checksum
          }
          // Web Socket 已连接上，使用 send() 方法发送数据
          self.ws.send('header='+JSON.stringify(header));
          self.ws.send('jsonparam='+JSON.stringify(_data));
          console.log("数据发送中...");
        };

        this.ws.onmessage = function (evt) {
          if(typeof (evt.data)==="object"){
            self.ssTtsData.push({
              buffer:evt.data,
              timeline:[],
            })
          }else if(evt.data.indexOf("Phoneme")!==-1){
            self.ssTtsData[self.ssTtsData.length-1].timeline = JSON.parse(evt.data.replace("Phoneme: ",""))
            if(isFirst){
              isFirst = false;
              self.ssTtsIndex = 0;//当前时间戳的data数据归0
              self.OhMySSRender(0,true)
            }
          }

        };
        self.ws.onclose = function() {
          // 关闭 websocket
          // console.log("连接已关闭...",self.ssTtsData);
        };
      },
      //二进制（buffer）数据深copy
      structuralClone(obj) {
        return new Promise(resolve =>{
          const {port1, port2} = new MessageChannel();
          port2.onmessage = ev => resolve(ev.data);
          port1.postMessage(obj);
        })
      },
      //获取二进制音频返回的时长
      getAudioDuring(data) {
        return new Promise(function (resolve, reject) {
          var context = new (window.AudioContext || window.webkitAudioContext)();
          context.decodeAudioData(data, function (buffer) {
            resolve(buffer.duration);
          });
        });
      },
      //不定时执行动作
      actionIrregular() {
        let actionItem = this.actionList[Math.floor(Math.random()*(this.actionList.length-1))]
        let timeDelay = (Math.floor(Math.random()*3)+3)*1000;//3-5s
        let actionItemTime = this.actionMap[actionItem].duration
        this.magics.playAction(actionItem,0);
        this.actionIrregularTimeOut = setTimeout(this.actionIrregular, (timeDelay + actionItemTime*1000));
      },
      destoryEvent(callback){
        timer.clean();
        if(this.magics){
          this.magics.destory();
        }
        this.$refs.avatarBoxRef.style['background']=''
        this.$refs.avatarBoxRef.style['background-size']=''
        this.TriggerDivList =[];
        callback()
      },
    },
    beforeDestroy(){
      timer.clean();
      // this.magics.stopRender();
      if(this.magics.destory){
        this.magics.destory();
      }
    },
  }
</script>

<style scoped>

  .avatarBox{
    margin: 0 auto;
    box-shadow: 0 0px 3px 1px #bceaff;
    overflow: hidden;
    /*background: #4CAF50;*/
    /*linear-gradient(#f5fbff,#2196F3)*/
    position: relative;
    transition: all 1s;
  }
  .avatar-canvas{
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 99;
    transition: all 1s;
  }

  .messageBox{
    position: absolute;
    z-index: 11;
    overflow: hidden;
  }
  .messageBox-img{
    position: absolute;
    z-index: 10;
  }
  .playAgain_btnBox{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0000008f;
    z-index: 199;
  }
  .playAgain_btn{
    position: absolute;
    left: 140px;
    top: 270px;
    color: #ffffff;
    font-size: 52px;
    font-weight: 600;
    transition: all 0.4s;
    cursor: pointer;
  }
  .playAgain_btn:hover{
    opacity: 0.9;
    transform: scale(1.1);
  }
</style>
