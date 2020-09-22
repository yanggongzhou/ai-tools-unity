import { chatInterface } from "@/api/api";
import timer from "../../api/timer";
export default {
  ZH:'a,ia,ai,ao,an,iao,ian,uai,ang,iang,o,u,ou,uo,ong,iong,v,ve,vn,io,ui,un,iu,iou,ua,uang,ueng,van,uan,uen,e,ei,er,en,uei,eng,i,ie,in,ing',

  getAudio(_text,_speed){
    let _data={
      text:_text,
      // access_token:this.access_token,
      access_token:this.access_token,
      domain:'1',
      language:'ZH',
      voice_name:'智能客服_小金',
      speed:_speed,
      volume:'5',
      pitch:'5',
      audiotype:'3',
      rate:'2',
      interval:'1',//音子
    };
    return new Promise(resolve => {
      chatInterface.bbTTS(_data)
        .then(res=>{
          resolve({interval:res.headers['interval-info'], data:res.data})
        })
    })
  },
  getToken(){
    return new Promise(resolve => {
      chatInterface.token({
        grant_type: "client_credentials",
        client_secret: "MDU5YzQxNWItYzgzNS00YTY2LWI5OTQtZWE5Y2ZkZWFkZjY4",
        client_id: '8130325a-6733-4b21-9e01-c10ac3e29728'
      }).then(res => {
        resolve(res.access_token)
      })
    })
  },


  readJson(int,isExpress){
    if(isExpress){
      this.cleanRead();
    }
    this.playIndex = int
    let self = this,paramItem=this.JOSNTEST.param[int];

    self.getAudio(paramItem.content,paramItem.speed).then(res=>{
      // console.log('res.interval',res.interval)
      let HANZI = [],allTimeArr=[];
      res.interval.split('&').forEach((val,index)=>{
        var ZHarr = self.ZH.split(',')
        var yunmu = val.split('=')[0]
        allTimeArr.push(val.split('=')[1])
        if(ZHarr.indexOf(yunmu)!==-1){
          HANZI.push({yunmu:yunmu,allind:index})
        }
      })
      // console.log('每段各个汉字对应总时间的位置',HANZI)
      // console.log('段落时间数组',allTimeArr)
      this.paramItemList.push(paramItem) ;
      this.resList.push(res);
      this.HANZIList.push(HANZI);
      this.allTimeArrList.push(allTimeArr);
      if(isExpress){
        timer.setTimeout(()=>{
          this.OhMyRender(paramItem,res,HANZI,allTimeArr)
        },paramItem.intervalTime)
      }
    })
  },
  OhMyRender(paramItem,res,HANZI,allTimeArr){
    let self = this;
    self.magics.playSpeechExpression2(paramItem.content, res.data, res.interval,Magics.TTS_BIAOBEI);

    this.TriggerDivList[this.TriggerDivIndex]=[]
    let TriggerDivItem =  this.TriggerDivList[this.TriggerDivIndex]
    this.TriggerDivIndex+=1;
    paramItem.trigger.forEach((trig,trigInd)=>{
      //信息
      if(trig.type==='info'){
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
          if(children.type==='video'){
            // self.$refs[child.id]
          }
        })
        TriggerDivItem.push(item)
        let _allind =HANZI[item.index].allind;//index文字对应的位置
        let timeOut;//timeOut为本段播放开始到文字下标的时间,秒
        if(item.index){
          timeOut = allTimeArr[_allind-1]*1000;//timeOut为本段播放开始到文字下标的时间,秒 (-1表示文字前)
          let intervalList = res.interval.split('&').slice(0,_allind-1);
          intervalList.forEach((inter,interInd)=>{
            if(inter.split('=')[0]==="SIL"){
              timeOut+=parseFloat(inter.split('=')[1])*1000
            }
          });
        }else{timeOut=0}

        //信息板预览区
        timer.setTimeout(()=>{
          item.isShow = true
          self.$forceUpdate()
          item.info.child.forEach((children,childInd)=>{
            if(children.type==='video'){
              self.$refs[children.id][0].load()
              self.$refs[children.id][0].play()
            }
          })
          if(!item.info.autoDismiss){
            timer.setTimeout(()=>{
              item.info.child.forEach((children,childInd)=>{
                if(children.type==='video'){
                  self.$refs[children.id][0].pause()
                }
              })
              item.isShow = false
              self.$forceUpdate()
            },item.info.dismissTime)
          }
        },timeOut)
      };
      //动作
      if(trig.type==='action'){
        let actionItem = JSON.parse(JSON.stringify(trig));

        let _allind =HANZI[actionItem.index].allind;//index文字对应的位置
        let timeOut;//timeOut为本段播放开始到文字下标的时间,秒
        if(actionItem.index){
          timeOut = allTimeArr[_allind-1]*1000;//timeOut为本段播放开始到文字下标的时间,秒 (-1表示文字前)
          let intervalList = res.interval.split('&').slice(0,_allind-1);
          intervalList.forEach((inter,interInd)=>{
            if(inter.split('=')[0]==="SIL"){
              timeOut+=parseFloat(inter.split('=')[1])*1000
            }
          });
        }else{timeOut=0}

        console.log('timeOut',actionItem.index,timeOut)
        timer.setTimeout(()=>{
          self.magics.playAction(actionItem.action.actionName)
        },timeOut)
      }
    })
  },
}
