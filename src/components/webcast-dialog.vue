<template>
  <div class="dialogBox">
    <div class="clearfix">
      <div class="selectBox float_left">
        <el-radio
          v-for="(val,ind) in allScriptList"
          :key="ind+'model'"
          @change="scriptChange"
          class="left_card"
          v-model="allScriptIndex" :label="ind" border>
          <div class="left_card_item">
            <i class="left_card_icon el-icon-video-camera-solid" v-show="allScriptPlayIndex===ind"></i>
            <div class="label">
              <p>{{ind | indFilter}}</p>
            </div>
          </div>
        </el-radio>
      </div>
<!--      单个剧本内容-->
      <div class="contentBox float_left">
        <div class="content-item" v-for="(val,ind) in contentList" :key="ind+'content'">
          <div class="header clearfix">
            <div class="title float_left">第{{ind+1}}段</div>

            <div class="float_right play_icon" @click="previewBtn(val)">
              <i class="el-icon-video-play"></i>
            </div>
            <div class="float_right keyboard">
              <div class="keyboard_txt">
                快捷键设置
              </div>
<!--              <div class="keyboard_shortcut">-->
<!--                Crtl + -->
<!--              </div>-->
            </div>
          </div>
          <p class="content">
            {{val | contentFilter}}
          </p>
        </div>
      </div>
    </div>

    <div class="footBox clearfix">
      <div class="float_left leftIcon">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-tooltip class="item" effect="dark" content="播放下一段：【Ctrl】+【空格" placement="bottom">
              <div class="icon1">
                <div class="kuaijie"></div>
                <span>快捷键</span>
              </div>
            </el-tooltip>
          </el-col>
          <el-col :span="12">
            <div class="icon2" @click="innerVisible=!innerVisible">
              <div class="huashu"></div>
              <span>临时话术</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="float_right btnBox">
        <button class='handleWebcastBtn' v-show="!isAutoPlayBtn" @click='autoPlayBtn'>自动播放</button>
        <button class='handleWebcastBtn' v-show="isAutoPlayBtn" @click='stopPlayBtn'>停止播放</button>
        <button class='handleWebcastBtn' style="margin-left: 30px" :class="{'disabled': true}" @click='nextPlayBtn'>播放下一段</button>
      </div>
    </div>
    <el-dialog
      width="700px"
      :visible.sync="innerVisible"
      top="10vh"
      append-to-body>
      <div class="contentBox contentBox2">
        <button class='close_btn' @click='innerVisible=false'>收起</button>
        <div style="height: 339px;overflow: scroll">
          <div class="content-item" v-for="(val,ind) in temporaryScriptList" :key="ind+'content'">
            <div class="header clearfix">
              <div class="title float_left">{{val.time}}</div>

              <div class="float_right play_icon" @click="previewTxtBtn(val,ind)">
                <i class="el-icon-video-play"></i>
              </div>
            </div>
            <p class="content">
              {{val.text}}
            </p>
          </div>
        </div>
        <el-input style="margin-top: 10px" type="textarea"
                  placeholder="这里可以输入文字，添加后记录在上方内容"
                  v-model="temporaryScriptTxt"
                  :autosize="{ minRows: 5, maxRows:5 }"
                  ></el-input>
        <div class="playBtn">
          <button class='handleWebcastBtn' @click='temporaryScriptPlay'>播放</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import {resultJSON} from "../api/result";
  let that;
  export default {
    beforeCreate() {
      that = this;
    },
    filters:{
      indFilter(val){
        if((val+1).toString().length===1){
          return '0'+(val+1)+'. '+that.allScriptList[val].name
        }else{
          return val+'. '+that.allScriptList[val].name;
        }
      },
      contentFilter(val){
        let _content = '';
        val.param.forEach(paramItem=>{
          _content += paramItem.content;
        })
        return _content;
      },
      styleFilter(val){
      //   let _content='';
      //   val.param.forEach(value=>{
      //     _content += value.content
      //   })
      //   if(val.param.length===0 || !_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
      //     return {
      //       'display': 'inline-block',
      //     }
      //   }else{
      //     return {
      //       'display' : "none"
      //     }
      //   }
      }
    },
    data(){
      return{
        innerVisible:false,
        allScriptList:[],//全部脚本数据
        allScriptIndex:0,
        contentList:[],
        isShowAllList:false,

        playData:[],//列表数据

        allScriptPlayIndex:'',//当前播放的脚本下标

        previewData:[],
        previewReady:true,//是否资源准备完毕了
        isAutoPlayBtn:false,//是否在自动播放
        isPlaying:false,//是否在播放中


        temporaryScriptList:[
          // {
          //   time:'2020-02-12 14:34:23',
          //   text:'荣耀（HONOR），是面向年轻人群的科技潮牌，主打潮流设计和极致性能。 [1] 荣耀不断推出不同系列产品，致力于打造手机+IoT产品生态圈。 荣耀的使命，是创造一个属于年轻人的智慧新世界。荣耀将持续为全球年轻人提供潮酷的全场景智能化体验，打造年轻人向往的先锋文化和潮流生活方式。',
          //   state:'已播',
          // },
          // {
          //   time:'2020-02-12 14:34:23',
          //   text:'荣耀（HONOR），是面向年轻人群的科技潮牌，主打潮流设计和极致性能。 [1] 荣耀不断推出不同系列产品，致力于打造手机+IoT产品生态圈。 荣耀的使命，是创造一个属于年轻人的智慧新世界。荣耀将持续为全球年轻人提供潮酷的全场景智能化体验，打造年轻人向往的先锋文化和潮流生活方式。',
          //   state:'正播',
          // },
          // {
          //   time:'2020-02-12 14:34:23',
          //   text:'荣耀（HONOR），是面向年轻人群的科技潮牌，主打潮流设计和极致性能。 [1] 荣耀不断推出不同系列产品，致力于打造手机+IoT产品生态圈。 荣耀的使命，是创造一个属于年轻人的智慧新世界。荣耀将持续为全球年轻人提供潮酷的全场景智能化体验，打造年轻人向往的先锋文化和潮流生活方式。',
          //   state:'排队',
          // },
          // {
          //   time:'2020-02-12 14:34:23',
          //   text:'荣耀（HONOR），是面向年轻人群的科技潮牌，主打潮流设计和极致性能。 [1] 荣耀不断推出不同系列产品，致力于打造手机+IoT产品生态圈。 荣耀的使命，是创造一个属于年轻人的智慧新世界。荣耀将持续为全球年轻人提供潮酷的全场景智能化体验，打造年轻人向往的先锋文化和潮流生活方式。',
          //   state:'未播',
          // }
          ],//临时话术
        temporaryScriptTxt:'',

        queueList:[
          // {
          //   name:'',
          //   json:'',
          // }
        ],//排队数据，最多3个
        queueContentItem:[],//段落排队数据，最多1个

      }
    },
    mounted() {
      this.previewReady = true;
      window.WebPreviewEnd=this.WebPreviewEnd;
      window.WebPreviewReady = this.WebPreviewReady;
      window.WebSelectAvatarState=this.WebSelectAvatarState;
    },
    methods:{

      //剧本切换
      scriptChange(val){
        this.contentList = this.allScriptList[val].scriptList
        this.$forceUpdate();
      },
      //自动播放
      autoPlayBtn(){
          this.isAutoPlayBtn = true;
        if(this.previewReady){
          this.allScriptPlayIndex = this.allScriptIndex;
          this.previewData = this.allScriptList[this.allScriptPlayIndex].scriptList;
          UnityChangeAvatar(this.previewData[0].avatar.unity)
          this.previewReady = false;
          this.isPlaying = true;
        }else{
          this.$message.warning('资源加载中，请稍后...')
        }
      },
      //停止播放
      stopPlayBtn(){
        this.allScriptPlayIndex = '';
        this.isAutoPlayBtn = false;
        UnityPreviewCancel();//结束自动播放接口
        this.isPlaying = false;
        this.queueList = [];
        this.queueContentItem = [];
      },
      WebSelectAvatarState(state){
        if(state==='True'){
          UnityPreview(this.previewData[0].avatar.unity,JSON.stringify(this.previewData))
        }else if(state==='False'){
          this.previewReady = true;
          this.isAutoPlayBtn = false;
          this.isPlaying = false;
          this.$message.error('切换角色失败，请重试')
        }
      },
      WebPreviewReady(state){
        if(state==='True'){
          UnityPreviewStart(this.previewData[0].avatar.unity);
          this.$message.info('播放剧本'+(this.allScriptPlayIndex+1)+'--'+this.allScriptList[this.allScriptPlayIndex].name)
        }else if(state==='False'){
          this.isAutoPlayBtn = false;
          this.isPlaying = false;
          this.$message.error('加载资源失败，请重试')
        }
        this.previewReady = true;
      },

      //播放结束回调
      WebPreviewEnd(){
        if(this.isAutoPlayBtn){
          if(this.allScriptPlayIndex+1<this.allScriptList.length){
            // this.allScriptIndex+=1;
            this.allScriptPlayIndex+=1;
          }else{
            // this.allScriptIndex=0;
            this.allScriptPlayIndex = 0;
          }
          this.$message.info('播放剧本'+(this.allScriptPlayIndex+1)+'--'+this.allScriptList[this.allScriptPlayIndex].name)
          this.previewData = this.allScriptList[this.allScriptPlayIndex].scriptList;
          UnityPreview(this.previewData[0].avatar.unity,JSON.stringify(this.previewData))
          this.previewReady = false;
          this.isPlaying = true;
        }else{
          if(this.queueList.length){
            let _Obj  = this.queueList.shift();
            UnityPreviewTxt(_Obj.name,_Obj.item)
          }else{
            if(this.queueContentItem.length){
              let _Obj  = this.queueContentItem.shift();
              UnityPreview(_Obj.name,_Obj.item)
            }else{
              this.isPlaying = false;
            }
          }
        }
      },
      //播放下一个
      nextPlayBtn(){

      },
      //获取直播列表json数据
      getPlayData(data){
        let self = this;
        self.allScriptList = [];
        this.playData = JSON.parse(JSON.stringify(data))
        // console.log('playData',this.playData)
        let _arr = [];
        data.forEach(val=>{
          _arr.push(axios.get(val.script_url))
        })
        axios.all(_arr).then(
          axios.spread((...resList) => {
            // console.log('接口全部加载完成',resList) ;
            resList.forEach((resItem,resItemInd)=>{
              self.allScriptList.push({
                name:self.playData[resItemInd].name,
                scriptList:resItem.data
              })
            })
            self.allScriptIndex = 0;
            self.contentList = self.allScriptList[0].scriptList
            // console.log('self.allScriptList',self.allScriptList)
            self.$forceUpdate();
          })
        )
      },
      //预览
      previewBtn(val){
        if(!this.isPlaying){
          UnityPreview(val.avatar.unity,JSON.stringify([val]))
          this.isPlaying = true;
        }else{
          if(this.queueContentItem.length===0){
            this.$message.info('剧本段落已排队，稍后播放!')
            this.queueContentItem.push({
              name:val.avatar.unity,
              item:JSON.stringify([val])
            })
          }else{
            this.$message.warning('最多支持1个剧本段落排队，请稍后!')
          }
        }
      },
      //临时话术预览
      previewTxtBtn(val,ind){
        let _arr =  this.temporaryScriptList[ind].text.split('')
        let _res = []
        for (let i = 0; i< Math.ceil(_arr.length/100);i++){
          _res.push(_arr.splice(0,100).join(''));
        }
        let _json = JSON.parse(JSON.stringify(resultJSON.resultJsonObj))
        _json.avatar.unity = 'none'
        _res.forEach(resItem=>{
          _json.param.push({
            intervalTime:0,
            trigger:[],
            content:resItem
          })
        })
        if(!this.isPlaying){
          UnityPreviewTxt('none',JSON.stringify([_json]))
          this.isPlaying = true;
        }else{
          if(this.queueList.length<3){
            this.queueList.push({
              name:'none',
              item:JSON.stringify([_json])
            })
          }else{
            this.$message.info('最多支持3个播放排队,请稍后!')
          }
        }
      },
      //临时话术播放按钮
      temporaryScriptPlay(){
        this.temporaryScriptList.push({
          time:new Date().toLocaleString(),
          text:this.temporaryScriptTxt,
          state:'排队'
        })
        let _arr =  this.temporaryScriptList[this.temporaryScriptList.length-1].text.split('')
        let _res = []
        for (let i = 0; i< Math.ceil(_arr.length/100);i++){
          _res.push(_arr.splice(0,100).join(''));
        }
        let _json = JSON.parse(JSON.stringify(resultJSON.resultJsonObj))
        _json.avatar.unity = 'none'
        _res.forEach(resItem=>{
          _json.param.push({
            intervalTime:0,
            trigger:[],
            content:resItem
          })
        })
        if(!this.isPlaying){
          UnityPreviewTxt('none',JSON.stringify([_json]))
        }else{
          if(this.queueList.length<3){
            this.queueList.push({
              name:'none',
              item:JSON.stringify([_json])
            })
          }else{
            this.$message.info('最多支持3个播放排队，请稍后！')
          }
        }
      },
      getGuid() {
        // 生成随机ID
        return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`;
      },

    }

  }
</script>
<style scoped lang="less">
  /deep/.el-dialog__headerbtn{
    display: none;
  }
  /deep/.el-dialog__header {
    padding: 0px!important;
  }
  /deep/.el-dialog__body{
    padding: 0px!important;
  }
  /deep/.el-radio{
    color: #7C53FF !important;
    border-bottom: 1px solid #fff !important;
  }
  /deep/.el-radio.is-bordered.is-checked{
    background: #7C53FF !important;
    border-color: #7C53FF!important;
  }
  /deep/.el-radio__input.is-checked+.el-radio__label{
    color: #FFFFFF!important;
  }
.dialogBox{
  height: 536px;

}

.selectBox{
  height: 450px;
  width: 123px;
  background: #FBFAFF;
  font-size: 0;
}
.left_card{
  background: #DDD6FF!important;
  position: relative;
  z-index: 10;
  width: 100%;
  height: 42px!important;
  margin-top: 0px;
  padding: 0!important;;
  overflow: hidden;
  margin-left: 0px !important;
  margin-right: 0px !important;
  /*border: none;*/
  /*border-top: 1px solid #E87E4D;*/
  border-radius: 0px;
  display: inline-block;
  /deep/.el-radio__input{
    display: none;
  }
  /deep/.el-radio__label{
    padding-left: 0;
  }

  .left_card_item{
    font-size: 0;
    .left_card_icon{
      font-size: 14px;
      position: absolute;
      right: 3px;
      top: 12px;
    }
    .label{
      font-size: 13px;
      font-weight: 500;
      height: 40px;
      line-height: 40px;
      text-align: left;
      padding: 0 10px;
      p{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width: 95px;
      }
    }
  }
}

.contentBox{
  width: 555px;
  height: 421px;
  margin: 28px 0 0 11px;
  .content-item{
    padding: 10px 10px 6px;
    height: 77px;
    margin-top: 12px;
    background: #FFFBF2;
    border-radius: 4px;
    border: 1px solid #FEE0C7;
    .header{
      font-size: 12px;
      font-weight: 500;
      color: #333333;
      .play_icon{
        font-size: 18px;
        margin-left: 30px;
        color: #8286FF;
        cursor: pointer;
        transition: all .3s;
        &:hover{
          color: #673ab7;
        }
      }
      .keyboard{
        font-size: 12px;
        color: #8286FF;
        font-weight: 400;
        cursor: pointer;
        transition: all .3s;
        &:hover{
          color: #673ab7;
        }
        .keyboard_shortcut{

        }
      }
    }
    .content{
      text-align: left;
      text-indent: 20px;
      font-size: 12px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      user-select: text;
    }
  }
}
.contentBox2{
  padding: 40px 0 0 0;
  margin: 0 auto;
  width: 648px;
  height: 520px;
  .content-item{
    margin-top: 0px;
    margin-bottom: 24px;
    border: 1px solid #CDC7FE;
    padding: 8px 10px 4px;
    background: #F2F6FF;
    border-radius: 4px;
  }
  .playBtn{
    text-align: center;
    margin: 16px;
  }
}
.footBox{
  border-top: 1px solid #DDD6FF;
  padding: 19px;
  .leftIcon{
    width: 130px;
    font-size: 12px;
    color: #A0A0A0;
    .icon1{
      /*cursor: pointer;*/
      /*transition: all .3s;*/
      /*&:hover{*/
      /*  background: #cecece4d;*/
      /*  border-radius: 8px;*/
      /*}*/
      .kuaijie{
        width: 30px;
        height: 30px;
        background: url(../assets/kuaijiejian.png) no-repeat;
        background-size: 100% 100%;
        margin: 0  auto;
      }
    }
    .icon2{
      cursor: pointer;
      transition: all .3s;
      &:hover{
        background: #cecece4d;
        border-radius: 8px;
      }
      .huashu{
        width: 30px;
        height: 30px;
        background: url(../assets/bianji.png) no-repeat;
        background-size: 100% 100%;
        margin: 0  auto;
      }
    }
  }
  .btnBox{
    margin-top: 10px;
  }
}
  .handleWebcastBtn {
    width: 96px;
    height: 32px;
    margin: 0 auto;
    background: linear-gradient(166deg, #BA71FF 0%, #5648FF 100%);
    border-radius: 16px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
  .close_btn{
    width: 56px;
    height: 20px;
    margin: 0 auto;
    background: #FFF;
    border-radius: 16px;
    border: 1px solid #8286FF;
    color: #8286FF;
    font-size: 12px;
    cursor: pointer;
    position: absolute;
    right: 16px;
    top: 16px;
  }
  .disabled {
    background: #C6C6C6!important;
    cursor: no-drop;
  }
</style>
