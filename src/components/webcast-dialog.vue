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
              <p>{{ind | indFilter(that)}}</p>
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
            <div class="icon1">
              <div class="kuaijie"></div>
              <span>快捷键</span>
            </div>
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
        <button class='handleWebcastBtn' v-show="isAutoPlayBtn" @click='autoPlayBtn'>自动播放</button>
        <button class='handleWebcastBtn' v-show="!isAutoPlayBtn" @click='stopPlayBtn'>停止播放</button>
        <button class='handleWebcastBtn' style="margin-left: 30px" :class="{'disabled': true}" @click='nextPlayBtn'>播放下一段</button>
      </div>
    </div>
    <el-dialog
      width="700px"
      :visible.sync="innerVisible"
      top="10vh"
      append-to-body>
      <div class="contentBox contentBox2">
        <div style="height: 339px;overflow: scroll">
          <div class="content-item" v-for="(val,ind) in temporaryScriptList" :key="ind+'content'">
            <div class="header clearfix">
              <div class="title float_left">{{val.time}}</div>

              <div class="float_right play_icon" @click="previewBtn(val)">
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
  export default {
    filters:{
      indFilter(val,that){
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
        that:this,
        allScriptList:[],//全部脚本数据
        allScriptIndex:0,
        contentList:[],
        isShowAllList:false,

        playData:[],//列表数据

        allScriptPlayIndex:'',//当前播放的脚本下标

        previewData:[],
        previewReady:true,
        isAutoPlayBtn:true,//按钮显示

        temporaryScriptList:[
          {
            time:'2020-02-12 14:34:23',
            text:'荣耀（HONOR），是面向年轻人群的科技潮牌，主打潮流设计和极致性能。 [1] 荣耀不断推出不同系列产品，致力于打造手机+IoT产品生态圈。 荣耀的使命，是创造一个属于年轻人的智慧新世界。荣耀将持续为全球年轻人提供潮酷的全场景智能化体验，打造年轻人向往的先锋文化和潮流生活方式。',
            state:'已播',
          },
          {
            time:'2020-02-12 14:34:23',
            text:'荣耀（HONOR），是面向年轻人群的科技潮牌，主打潮流设计和极致性能。 [1] 荣耀不断推出不同系列产品，致力于打造手机+IoT产品生态圈。 荣耀的使命，是创造一个属于年轻人的智慧新世界。荣耀将持续为全球年轻人提供潮酷的全场景智能化体验，打造年轻人向往的先锋文化和潮流生活方式。',
            state:'正播',
          },
          {
            time:'2020-02-12 14:34:23',
            text:'荣耀（HONOR），是面向年轻人群的科技潮牌，主打潮流设计和极致性能。 [1] 荣耀不断推出不同系列产品，致力于打造手机+IoT产品生态圈。 荣耀的使命，是创造一个属于年轻人的智慧新世界。荣耀将持续为全球年轻人提供潮酷的全场景智能化体验，打造年轻人向往的先锋文化和潮流生活方式。',
            state:'排队',
          },
          {
            time:'2020-02-12 14:34:23',
            text:'荣耀（HONOR），是面向年轻人群的科技潮牌，主打潮流设计和极致性能。 [1] 荣耀不断推出不同系列产品，致力于打造手机+IoT产品生态圈。 荣耀的使命，是创造一个属于年轻人的智慧新世界。荣耀将持续为全球年轻人提供潮酷的全场景智能化体验，打造年轻人向往的先锋文化和潮流生活方式。',
            state:'未播',
          }
          ],//临时话术
        temporaryScriptTxt:'',

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
          this.isAutoPlayBtn = false;
        if(this.previewReady){
          this.allScriptPlayIndex = this.allScriptIndex;
          this.previewData = this.allScriptList[this.allScriptPlayIndex].scriptList;
          UnityChangeAvatar(this.previewData[0].avatar.unity)
          this.previewReady = false;
        }else{
          this.$message.warning('资源加载中，请稍后...')
        }
      },
      //停止播放
      stopPlayBtn(){
        this.allScriptPlayIndex = '';
        this.isAutoPlayBtn = true;
        UnityPreviewCancel();
      },
      WebSelectAvatarState(state){
        if(state==='True'){
          UnityPreview(this.previewData[0].avatar.unity,JSON.stringify(this.previewData))
        }else if(state==='False'){
          this.previewReady = true;
          this.isAutoPlayBtn = true;
          this.$message.error('切换角色失败，请重试')
        }
      },
      WebPreviewReady(state){
        if(state==='True'){
          UnityPreviewStart(this.previewData[0].avatar.unity);
          this.$message.info('播放剧本'+(this.allScriptPlayIndex+1)+'--'+this.allScriptList[this.allScriptPlayIndex].name)
        }else if(state==='False'){
          this.isAutoPlayBtn = true;
          this.$message.error('加载资源失败，请重试')
        }
        this.previewReady = true;
      },

      //播放结束回调
      WebPreviewEnd(){
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
      },
      //播放下一个
      nextPlayBtn(){

      },
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
            this.allScriptIndex = 0;
            this.contentList = this.allScriptList[0].scriptList
            // console.log('self.allScriptList',self.allScriptList)
            self.$forceUpdate();
          })
        )
      },
      //预览
      previewBtn(val){
        UnityPreview(val.avatar.unity,JSON.stringify([val]))
      },
      //临时话术播放按钮
      temporaryScriptPlay(){
        this.temporaryScriptList.push({
          time:new Date().toLocaleString(),
          text:this.temporaryScriptTxt,
          state:'排队'
        })
      },
    }

  }
</script>
<style scoped lang="less">
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
      cursor: pointer;
      transition: all .3s;
      &:hover{
        background: #cecece4d;
        border-radius: 8px;
      }
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
  .disabled {
    background: #C6C6C6!important;
    cursor: no-drop;
  }
</style>
