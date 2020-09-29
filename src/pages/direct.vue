<template>
  <div class="common_content">
    <div class="titleBox">
      <span class="titleSpan">直播剧本</span>
      <button class="backNormal backNormal2" @click="$router.back()">
        <span class="_icon">< </span>
        <span>返回</span>
      </button>
    </div>
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
          <div class="content-item" v-for="(val,ind) in contentList" :key="ind+'content'"   :style="ind | styleFilter3">
            <div class="header clearfix">
              <div class="title float_left">第{{ind+1}}段</div>
              <div class="pdtip float_left"
                   style="color: #4CAF50"
                   :style="ind | styleFilter2"
              >正在播放中...</div>
              <div class="pdtip float_left"
                   :style="ind | styleFilter"
              >排队播放中...</div>

              <div class="float_right play_icon" @click="previewBtn(val,ind,allScriptIndex,false)">
                <i class="el-icon-video-play"></i>
              </div>
<!--              <div class="float_right keyboard" @click="updateState(ind)">-->
<!--&lt;!&ndash;                this.allScriptList[val].shortcut_json&ndash;&gt;-->
<!--                <div v-if="allScriptList[allScriptIndex].shortcut_json[ind].status===1">禁用</div>-->
<!--                <div v-if="allScriptList[allScriptIndex].shortcut_json[ind].status===0">恢复</div>-->
<!--              </div>-->
<!--              <div class="float_right keyboard">-->
<!--                <div class="keyboard_txt">-->
<!--                  快捷键设置-->
<!--                </div>-->
<!--                &lt;!&ndash;              <div class="keyboard_shortcut">&ndash;&gt;-->
<!--                &lt;!&ndash;                Crtl + &ndash;&gt;-->
<!--                &lt;!&ndash;              </div>&ndash;&gt;-->
<!--              </div>-->
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
<!--            <el-col :span="12">-->
<!--              <el-tooltip class="item" effect="dark" content="播放下一段：【Ctrl】+【空格】" placement="bottom">-->
<!--                <div class="icon1">-->
<!--                  <div class="kuaijie"></div>-->
<!--                  <span>快捷键</span>-->
<!--                </div>-->
<!--              </el-tooltip>-->
<!--            </el-col>-->
            <el-col :span="12">
              <div class="icon2" @click="innerVisibleOpen" :class="{'disabled-icon2': isAutoPlayBtn}">
                <div class="huashu"></div>
                <span>临时话术</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="float_right btnBox">
          <button class='handleWebcastBtn' :class="{'disabled': queueList.length!==0||queueContentItem.length!==0||isPlaying}"  v-show="!isAutoPlayBtn" @click='autoPlayBtn'>自动播放</button>
          <button class='handleWebcastBtn' v-show="isAutoPlayBtn" @click='stopPlayBtn'>停止播放</button>
          <el-tooltip class="item" effect="dark" content="播放下一段：【Ctrl】+【n】" placement="bottom">
            <button class='handleWebcastBtn' style="margin-left: 30px" :disabled="isAutoPlayBtn" :class="{'disabled': isAutoPlayBtn}" @click='nextPlayBtn'>播放下一段</button>
          </el-tooltip>

        </div>
      </div>
      <el-dialog
        width="700px"
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
        top="10vh"
        append-to-body>
        <div class="contentBox contentBox2">
          <button class='close_btn' @click='innerVisible=false'>收起</button>
          <div style="height: 346px;overflow: scroll;margin-top: 10px">
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
                    :autosize="{ minRows: 4, maxRows:4 }"
          ></el-input>
          <div class="playBtn">
            <button class='handleWebcastBtn' @click='temporaryScriptPlay'>播放</button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import {resultJSON} from "../api/result";
  import {requestServices} from "../api/api";
  let that;
  export default {
    beforeCreate() {
      that = this;
    },
    filters:{
      indFilter(val){
        // if((val+1).toString().length===1){
        //   return '0'+(val+1)+'. '+that.allScriptList[val].name
        // }else{
        return (val+1)+'. '+that.allScriptList[val].name;
        // }
      },
      contentFilter(val){
        let _content = '';
        val.param.forEach(paramItem=>{
          _content += paramItem.content;
        })
        return _content;
      },
      styleFilter(ind){
        if(that.queueContentItem.length){

          if(ind===that.queueContentItem[0].contentIndex&&that.allScriptIndex===that.queueContentItem[0].allScriptIndex){
            return {
              'display': 'inline-block',
            }
          }else{
            return {
              'display' : "none"
            }
          }
        }else{
          return {
            'display' : "none"
          }
        }
      },
      styleFilter2(ind){
        // this.nowContentIndex = '';
        // this.nowAllScriptIndex = '';
        if(that.nowContentIndex!==""&&that.nowAllScriptIndex !== ''){
          if(ind===that.nowContentIndex&&that.nowAllScriptIndex===that.allScriptIndex){
            return {
              'display': 'inline-block',
            }
          }else{
            return {
              'display' : "none"
            }
          }
        }else{
          return {
            'display' : "none"
          }
        }
      },
      styleFilter3(ind){
        // this.nowContentIndex = '';
        // this.nowAllScriptIndex = '';
        if(that.nowContentIndex!==""&&that.nowAllScriptIndex !== ''){
          if(ind===that.nowContentIndex&&that.nowAllScriptIndex===that.allScriptIndex){
            return {
              'border': '1px solid #4CAF50',
              'background': '#d6ffd7'
            }
          }else{
            return {
              'background': '#FFFBF2',
              'border': '1px solid #FEE0C7'
            }
          }
        }else{
          return {
            'background': '#FFFBF2',
            'border': '1px solid #FEE0C7'
          }
        }
      },
    },
    data(){
      return{
        innerVisible:false,
        allScriptList:[],//全部脚本数据
        allScriptIndex:0,
        contentList:[],
        contentIndex:0,//下个脚本的下标
        nextPlayVal:'',//下个脚本的内容
        nextAllScriptIndex:0,///下个脚本的剧本下标

        nowContentIndex:'',//正在播放的脚本下标
        nowAllScriptIndex:'',//正在播放的剧本下标

        isShowAllList:false,

        playData:[],//列表数据

        allScriptPlayIndex:'',//当前播放的脚本下标

        previewData:[],
        previewReady:true,//是否资源准备完毕了
        isAutoPlayBtn:false,//是否在自动播放
        isPlaying:false,//是否在播放中


        temporaryScriptList:[],//临时话术
        temporaryScriptTxt:'',

        queueList:[],//排队数据，最多3个
        queueContentItem:[],//段落排队数据，最多1个


      }
    },
    created() {
      window.WebPreviewEnd=this.WebPreviewEnd;
      window.WebPreviewReady = this.WebPreviewReady;
      window.WebSelectAvatarState=this.WebSelectAvatarState;
    },
    mounted() {
      let self = this;
      document.onkeydown = (event) => {
        console.log(event)
        //ctrl+space
         if (event.ctrlKey && event.keyCode == 78){
           self.nextPlayBtn()
          }
      }

      // this.nextPlayVal = this.allScriptList[0].scriptList[0]
      this.contentIndex = 0;
      this.previewReady = true;
      if(this.$route.params.playData){
        this.getPlayData(this.$route.params.playData)
      }else{
        this.$message.error('未获取数据，请返回重试！')
      }

    },
    methods:{
      innerVisibleOpen(){
        if(!this.isAutoPlayBtn){
          this.innerVisible= true;
        }
      },
      //更改禁用状态
      updateState(ind){
       if(this.allScriptList[this.allScriptIndex].shortcut_json[ind].status===1){
         this.allScriptList[this.allScriptIndex].shortcut_json[ind].status=0
       }else{
         this.allScriptList[this.allScriptIndex].shortcut_json[ind].status=1
       }
        requestServices.editShortcutJson({
          user_id:this.$Session.get('ai_user_id'),
          access_token:this.$Session.get('ai_user_token'),
          role_id:23,
          gs_id:this.allScriptList[this.allScriptIndex].gs_id,
          shortcut_json:JSON.stringify(this.allScriptList[this.allScriptIndex].shortcut_json)
        }).then(res=>{
          console.log(res)
        })
      },
      //剧本切换
      scriptChange(val){
        this.contentList = this.allScriptList[val].scriptList
        this.otherMsg = {
          name:this.allScriptList[val].name,
          shortcut_json:this.allScriptList[val].shortcut_json,
          gs_id:this.allScriptList[val].id
        }
        this.$forceUpdate();
      },
      //自动播放
      autoPlayBtn(){
        if(this.queueList.length!==0||this.queueContentItem.length!==0||this.isPlaying){
          return false;
        }
        // UnityPreviewCancel();
        this.isAutoPlayBtn = true;
        if(this.previewReady){
          this.allScriptPlayIndex = this.allScriptIndex;
          this.previewData = this.allScriptList[this.allScriptPlayIndex].scriptList;
          UnityChangeAvatar(this.previewData[0].avatar.unity)
          this.previewReady = false;
          this.isPlaying = true;
        }else{
          this.$message.warning('当前任务正在执行中，请稍后...')
          // todolist_____
        }
      },
      //停止播放
      stopPlayBtn(){
        this.previewReady = true;
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
            this.allScriptPlayIndex+=1;
            this.allScriptIndex = this.allScriptPlayIndex;
          }else{
            this.allScriptIndex=0;
            this.allScriptPlayIndex = 0;
          }
          this.scriptChange(this.allScriptIndex)

          this.$message.info('播放剧本'+(this.allScriptPlayIndex+1)+'--'+this.allScriptList[this.allScriptPlayIndex].name)
          this.previewData = this.allScriptList[this.allScriptPlayIndex].scriptList;
          UnityPreview(this.previewData[0].avatar.unity,JSON.stringify(this.previewData))
          // tolist
          this.previewReady = true;
          this.isPlaying = true;
        }else{
          if(this.queueList.length){
            let _Obj  = this.queueList.shift();
            UnityPreviewTxt(_Obj.name,_Obj.item)
            this.previewData = JSON.parse(_Obj.item)
            this.previewReady = false;
          }else{
            if(this.queueContentItem.length){
              let _Obj  = this.queueContentItem.shift();
              UnityPreview(_Obj.name,_Obj.item)
              //当前播放脚本内容的定位信息
              this.nowContentIndex = _Obj.contentIndex;
              this.nowAllScriptIndex = _Obj.allScriptIndex;

              this.previewData = JSON.parse(_Obj.item)
              this.previewReady = false;
            }else{
              this.previewReady = true;
              this.isPlaying = false;

              this.nowContentIndex = '';
              this.nowAllScriptIndex = '';
            }
          }
        }
      },
      //播放下一个
      nextPlayBtn(){
        if(this.isAutoPlayBtn){
          return false;
        }
        console.log(this.nextPlayVal,this.contentIndex,this.nextAllScriptIndex)
        // if()
        this.previewBtn(this.nextPlayVal,this.contentIndex,this.nextAllScriptIndex,true)
      },
      //获取直播列表json数据
      getPlayData(data){
        let self = this;
        this.allScriptList = [];
        this.playData = JSON.parse(JSON.stringify(data))
        // console.log('playData',this.playData)
        let _arr = [];
        data.forEach(val=>{
          _arr.push(axios.get(val.script_url));
        })

        axios.all(_arr).then(
          axios.spread((...resList) => {
            // console.log('接口全部加载完成',resList) ;
            resList.forEach((resItem,resItemInd)=>{
              self.allScriptList.push({
                name:self.playData[resItemInd].name,
                scriptList:resItem.data,
                shortcut_json:data[resItemInd].shortcut_json,
                gs_id:data[resItemInd].id
              })
            })
            self.allScriptIndex = 0;
            self.contentList = self.allScriptList[0].scriptList
            // console.log('self.allScriptList',self.allScriptList)
            self.nextPlayVal = self.allScriptList[0].scriptList[0]
            self.$forceUpdate();
          })
        )
      },
      //判断播放下一个的数据
      getNextPlayVal(ind,allScriptIndex,bool){
        if(bool){
          this.allScriptIndex = this.nextAllScriptIndex;
          this.scriptChange(this.allScriptIndex)
        }
        let _contentList = this.allScriptList[this.nextAllScriptIndex].scriptList

        if(ind<_contentList.length-1){
          this.contentIndex = ind+1;
          this.nextPlayVal = this.contentList[ind+1]
        }else{
          this.contentIndex = 0;
          if(allScriptIndex<this.allScriptList.length-1){
            this.nextAllScriptIndex = allScriptIndex+1;
            // this.allScriptIndex = this.nextAllScriptIndex
            this.nextPlayVal = this.allScriptList[this.nextAllScriptIndex].scriptList[0]
          }else{
            this.nextAllScriptIndex = 0;
            if(bool){
              this.allScriptIndex = 0 ;
              this.scriptChange(this.allScriptIndex)
            }

            this.nextPlayVal = this.allScriptList[0].scriptList[0]
          }
        }
      },
      //预览
      previewBtn(val,ind,allScriptIndex,bool){
        // UnityPreviewCancel();
        if(!this.isPlaying){
          if(this.previewReady){
            UnityChangeAvatar(val.avatar.unity)
            this.previewData = [val];
            // UnityPreview(val.avatar.unity,JSON.stringify([val]))
            this.isPlaying = true;
            this.previewReady = false;
            //当前播放脚本内容的定位信息
            this.nowContentIndex = ind;
            this.nowAllScriptIndex = allScriptIndex;
          }else{
            this.$message.warning('资源加载中，请稍后...')
          }
          //判断播放下一个的数据
          this.getNextPlayVal(ind,allScriptIndex,bool);
        }else{
          if(this.queueContentItem.length===0){
            this.$message.info('剧本段落已排队，稍后播放!')
            this.queueContentItem.push({
              allScriptIndex:allScriptIndex,
              contentIndex:ind,
              name:val.avatar.unity,
              item:JSON.stringify([val])
            })
            this.getNextPlayVal(ind,allScriptIndex,bool);
          }else{
            this.$message.warning('最多支持1个剧本段落排队，请稍后!')
          }
        }
      },
      //临时话术预览
      previewTxtBtn(val,ind){
        // UnityPreviewCancel();
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
          if(this.previewReady){
            // UnityChangeAvatar(val.avatar.unity)
            this.previewData = [_json];
            UnityPreviewTxt('none',JSON.stringify([_json]))
            this.isPlaying = true;
            this.previewReady = false;
          }else{
            this.$message.warning('资源加载中，请稍后...')
          }
          // UnityPreviewTxt('none',JSON.stringify([_json]))
          // this.isPlaying = true;
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
        if(this.queueList.length>=3){
          this.$message.warning('最多支持3个播放排队，请稍后')
          return false
        }
        if(!this.temporaryScriptTxt.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g).match(/[\u4e00-\u9fa5\0-9]/g)){
          this.$message.warning('请输入有效字符')
          return false
        }
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
          this.previewData = JSON.parse(JSON.stringify([_json]))
          this.isPlaying = true;
          this.previewReady = false;
        }else{
          if(this.queueList.length<3){
            this.queueList.push({
              id:this.getGuid(),
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

    },
    beforeDestroy() {
      UnityPreviewCancel();
      document.onkeydown = "";
    },

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
    /*border-bottom: 1px solid #fff !important;*/
  }
  /deep/.el-radio.is-bordered.is-checked{
    /*border-color: #7C53FF !important;*/
    border-color: #FFF !important;
    border: 3px solid #FFF !important;
    background: linear-gradient(166deg, #BA71FF 0%, #5648FF 100%)!important;
    border-radius: 8px;
  }
  /deep/.el-radio__input.is-checked+.el-radio__label{
    color: #FFFFFF!important;
  }
  .common_content{
    padding: 45px 20px;
    position: relative;
  }
  .dialogBox{
    height: 536px;
    width: 750px;
    background: #FFF;
    margin: 0 auto;
    border-radius: 3px;
  }

  .selectBox{
    height: 450px;
    width: 150px;
    background: #FBFAFF;
    border: 0.5px solid #ddd6ff;
    border-bottom: none;
    border-radius: 3px 0 0 0;
    font-size: 0;
    overflow-y: scroll;
  }
  .left_card{
    background: #DDD6FF!important;
    position: relative;
    z-index: 10;
    width: 100%;
    height: 60px!important;
    margin-top: 0px;
    padding: 0!important;;
    /*overflow: hidden;*/
    margin-left: 0px !important;
    margin-right: 0px !important;
    /*border: none;*/
    /*border-top: 1px solid #E87E4D;*/
    margin-bottom: 1px;
    /*border-radius: 0px;*/
    display: inline-block;
    border: 3px solid #FFF;
    border-radius: 8px;

    /deep/.el-radio__input{
      display: none;
    }
    /deep/.el-radio__label{
      padding-left: 0;
    }

    .left_card_item{
      font-size: 0;
      .left_card_icon{
        font-size: 20px;
        position: absolute;
        right: 2px;
        top: 15px;
      }
      .label{
        /*font-size: 13px;*/
        /*font-weight: 500;*/
        /*height: 40px;*/
        /*line-height: 40px;*/
        text-align: left;
        font-size: 14px;
        font-weight: 600;
        height: 52px;
        line-height: 52px;
        padding: 0 10px;
        p{
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          width: 111px;
        }
      }
    }
  }

  .contentBox{
    width: 555px;
    height: 421px;
    margin: 28px 0 0 20px;
    overflow: scroll;
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
        .pdtip{
          font-size: 12px;
          font-weight: 400;
          color: #FF6060;
          margin-left: 8px;
        }
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
      height: 60px;
      margin-top: 0px;
      margin-bottom: 12px;
      border: 1px solid #CDC7FE;
      padding: 8px 10px 4px;
      background: #F2F6FF;
      border-radius: 4px;
      .content{
        text-align: left;
        text-indent: 20px;
        font-size: 12px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        user-select: text;
      }
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
        text-align: center;
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
        text-align: center;
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
    line-height: 32px;
    margin: 0 auto;
    background: linear-gradient(166deg, #BA71FF 0%, #5648FF 100%);
    border-radius: 16px;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    transition: all .3s;
    &:hover{
      opacity: 0.9;
    }
  }
  .close_btn{
    width: 60px;
    height: 24px;
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
  .disabled-icon2{
    background: transparent!important;
    cursor: no-drop !important;
  }
</style>
