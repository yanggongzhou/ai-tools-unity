<template>
  <div class="common_content">

    <div class="titleBox" style="margin-bottom: 10px">
      <span class="titleSpan">直播剧本</span>
      <button class="backNormal backNormal2" @click="backBtn">
        <span class="_icon">< </span>
        <span>返回</span>
      </button>
    </div>

    <div class="interaction_Tip">
      <el-popover
        placement="left-start"
        width="400"
        trigger="hover">
        <div class="interaction_pop">
          <p>互动模式</p>
          <p>1、开启后，虚拟主播可以与消费者互动，在互动时间时回答用户提问、欢迎用户进入直播间</p>
          <p>2、目前虚拟主播互动时间在每个剧本结束后及剧本中有互动标签的位置进入互动模式时间，当互动模式结束后，继续脚本直播。</p>
          <p>3、开启互动模式必须结合用户弹幕问题监测软件共同使用，且提前设定好问题和答案，否则互动模式无效。（ <span class='#835BFF'>弹幕问题监控软件及问答配置需联系商务处理</span> ）</p>
        </div>
        <span slot="reference" style="cursor: help;position: relative;top: 4px">互动模式</span>
      </el-popover>
      <el-switch @change="SwitchChange" v-model="isOpenInteractiveMode" active-color='#835BFF' style='margin-left:8px;margin-top:6px;' :disabled="isAutoPlayBtn"></el-switch>
    </div>

    <div class="dialogBox">
      <div class="clearfix">
        <div class="selectBox float_left">
          <el-radio
            :disabled="isAutoPlayBtn"
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
          <div class="content-item"
               v-for="(val,ind) in contentList"
               :id="'content'+ind+'script'+allScriptIndex"
               :class="{'borderLeftGreen': recordId==='content'+ind+'script'+allScriptIndex}"
               :key="ind+'content'"   :style="ind | styleFilter3">
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
              <div class="icon2" @click="innerVisibleOpen"  :class="{'disabled-icon2': isAutoPlayBtn}">
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
                <div class="title float_left">{{val.created_at}}</div>
                <div class="pdtip float_left"
                     style="color: #4CAF50"
                     v-show="nowTempId===val.id"
                >正在播放中...</div>
                <div class="pdtip float_left"
                     :style="val.id | styleFilter4"
                >排队播放中...</div>
                <div class="float_right play_icon" @click="previewTxtBtn(val,ind)">
                  <i class="el-icon-video-play"></i>
                </div>
              </div>


              <p class="content">
                {{val.content}}
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
  import interaction from '../components/interaction/interaction-1';
  let that;
  export default {
    mixins: [interaction],
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
      styleFilter4(id){
        let _show=false;
        that.queueList.forEach(val=>{
          if(val.id===id){
            _show = true
          }
        })
        if(_show){
          return {
            'display': 'inline-block',
          }
        }else{
          return {
            'display' : "none"
          }
        }
      }
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

        recordId:'',//记录播放的内容区

        nowContentIndex:'',//正在播放的脚本下标
        nowAllScriptIndex:'',//正在播放的剧本下标

        isShowAllList:false,

        playData:[],//列表数据

        allScriptPlayIndex:'',//当前播放的脚本下标

        previewData:[],
        previewReady:true,//是否资源准备完毕了
        isAutoPlayBtn:false,//是否在自动播放
        isPlaying:false,//是否在播放中
        isPreviewBtn:false,//是否单点播放

        temporaryScriptList:[],//临时话术
        temporaryScriptTxt:'',
        nowTempId:'',

        queueList:[],//排队数据，最多3个
        queueContentItem:[],//段落排队数据，最多1个

        isInnerJsonInteraction: false,//是否为脚本内互动
        isUnity: true, // 是否为Unity

        interactionModel:false,//是否互动
        // webInteractionModel:false,//是否web互动
        isFirstScript:false,//是否是第一个脚本，来处理是否需要开场语
        isFirstScriptOnce:false,//同上，但只监测到WebInteractionStart
        isOutInteraction:false,//是否脚本外互动

        isOpenInteractiveMode:true, //- 是否打开了互动模式
        isDisconnection:false,//断网
      }
    },
    created() {
      window.WebPreviewEnd=this.WebPreviewEnd;
      window.WebPreviewReady = this.WebPreviewReady;
      window.WebSelectAvatarState=this.WebSelectAvatarState;
      window.WebInteractionStart=this.WebInteractionStart;// 开始接收互动
      window.WebInteractionEnd=this.WebInteractionEnd;// 结束接收
      this.getAllWords();//请求 话术
      window.WebErrorMessage=this.WebErrorMessage;
      window.WebInteractionStateChange=this.WebInteractionStateChange;
      window.WebAckStopPlaySystem=this.WebAckStopPlaySystem;//强制中断接收
    },
    mounted() {
      let self = this;
      document.onkeydown = (event) => {
        // console.log(event)
        //ctrl+space
         if (event.ctrlKey && event.keyCode == 78){
           self.nextPlayBtn()
          }
      }
111
      // this.nextPlayVal = this.allScriptList[0].scriptList[0]
      this.contentIndex = 0;
      this.previewReady = true;
      if(this.$route.params.playData){
        this.getPlayData(this.$route.params.playData)
      }else{
        this.$message.error('未获取数据，请返回重试！')
      }
      this.getTempData().then(res=>{});
      UnityInteractionStateChange("True");
    },
    methods:{
      WebAckStopPlaySystem(){
        this.previewReady = true;
        this.allScriptPlayIndex = '';
        this.resetIacParams();//停止抓取弹幕
        // UnityPreviewCancel();//结束自动播放接口
        this.isPlaying = false;
        this.queueList = [];
        this.queueContentItem = [];
        //自动直播unity主动发送终止 需要继续播，待完成—————————————————————————————————————————————————————————————————————————
        if(this.isAutoPlayBtn){
          this.AutoPlayEvent();
        }
      },
      //断网
      WebErrorMessage(err){
        if(err==="True"){
          this.$notify.error({
            title:  '网络连接已断开!',
            message:"网络连接出现异常，请确认您的联网状态!",
            duration: 0
          });
          this.isDisconnection=true;
          if(this.interactionModel){
            UnityInteractionEnd(this.previewData[0].avatar.unity);
          }
        }else{
          this.$notify.success({
            title:  '网络已重新连接!',
            message:"网络连接已恢复，祝您使用愉快!",
            duration: 0
          });
          this.isDisconnection=false;
        }
      },
      backBtn(){
        if(this.isAutoPlayBtn){
          this.$message.warning('请先停止直播！')
        }else{
          this.$router.back()
        }
      },
      //互动模式切换
      SwitchChange(val){
        let _state = "True";
        val?_state="True":_state="False"
        UnityInteractionStateChange(_state);
        if(!val){
          this.$confirm('关闭互动模式可能会增加被平台判定为录播的风险，请谨慎操作！', {
            confirmButtonText: '知道了',
            showCancelButton:false,
            type: 'warning'
          }).then(() => {

          }).catch(() => {

          });
        }
      },
      WebInteractionStateChange(state){
        if(state==="True"){
          this.$message.info('互动模式已开启')
        }else{
          this.$message.info('互动模式已关闭')
        }
      },
      //临时话术打开
      innerVisibleOpen(){
        if(!this.isAutoPlayBtn){
          this.innerVisible= true;
        }
        // this.innerVisible= true;
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
        this.$forceUpdate();
      },

      //处理互动、场景话术的文本播放
      async getAudio(_type, _txt, _isHandleTimeline) {
        switch(_type) {
          case 'json': // 脚本   （Unity-WEB 可以忽略）
            break;
          case 'interaction': // 互动
            // 进行文字转语音及播放处理
            console.log('场景话术',_txt)
            this.playInteraction(_txt);
            break;
        }
      },

      //播放场景话术
      playInteraction(_txt){
        let _arr =  _txt.split('')
        let _res = []
        for (let i = 0; i< Math.ceil(_arr.length/100);i++){
          _res.push(_arr.splice(0,100).join(''));
        }
        let _json = JSON.parse(JSON.stringify(resultJSON.resultJsonObj))
        let _unity = this.previewData[0].avatar.unity;
        _json.avatar.unity = _unity
        _res.forEach(resItem=>{
          _json.param.push({
            intervalTime:0,
            trigger:[],
            content:resItem,//encodeURIComponent(resItem)
            interaction:{
              isSupport:false,
              maximum:10
            }
          })
        })
        UnityPreview(_unity,JSON.stringify([_json]),"False","False")
      },

      //互动结束回调
      handleInacEnd(){
        console.log('互动结束回调')
        // this.webInteractionModel = false;
        UnityInteractionEnd(this.previewData[0].avatar.unity);
        // this.AutoPlayEvent();
        this.isInnerJsonInteraction = false;
      },

      //自动播放
      autoPlayBtn(){
        //是否有排队
        if(this.queueList.length!==0||this.queueContentItem.length!==0||this.isPlaying){
          this.$message.info('检测到当前还有排队数据，请等待排队播放完毕')
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
          if(this.allScriptIndex===0){  //判断是否是第一个脚本，是—播放开场欢迎语
            this.isFirstScript = true;
            this.isFirstScriptOnce = true;
          }
        }else{
          this.$message.warning('当前任务正在执行中，请稍后...')
        }
      },
      //停止播放
      stopPlayBtn(){
        this.previewReady = true;
        this.allScriptPlayIndex = '';
        this.isAutoPlayBtn = false;
        this.resetIacParams();//停止抓取弹幕
        UnityPreviewCancel();//结束自动播放接口
        this.isPlaying = false;
        this.queueList = [];
        this.queueContentItem = [];
      },
      WebSelectAvatarState(state){
        if(state==='True'){
          //_______________判断当前是不是第一句
          //判断是否是第一个脚本，是—播放开场欢迎语
          if(this.isFirstScript&&this.isOpenInteractiveMode){
            // this.playWelcomeWords();
            UnityInteractionStart(this.previewData[0].avatar.unity);
          }else{
            let _state = "True";
            this.isAutoPlayBtn?_state="False":_state="True"
            UnityPreview(this.previewData[0].avatar.unity,JSON.stringify(this.previewData),_state,"True")
          }
        }else if(state==='False'){
          this.previewReady = true;
          this.isAutoPlayBtn = false;
          this.isPlaying = false;
          this.$message.error('切换角色失败，请重试')
        }
      },
      WebPreviewReady(state){
        if(state==='True'&&this.isAutoPlayBtn||this.isPreviewBtn){
          UnityPreviewStart(this.previewData[0].avatar.unity);
          if(this.isPreviewBtn){
            this.isPreviewBtn = false;
          }
          // if(!this.isFirstScript){
          //   this.$message.info('播放剧本'+(this.allScriptPlayIndex+1)+'--'+this.allScriptList[this.allScriptPlayIndex].name)
          // }
          this.previewReady = true;
        }else if(state==='False'){
          this.isAutoPlayBtn = false;
          this.isPlaying = false;
          this.$notify.error({
            title:  '加载资源失败!',
            message:"加载资源失败，请重试！",
            duration: 0
          });
          // this.$message.error('加载资源失败，请重试')
        }else{
          this.previewReady = false;
        }
      },
      //自动播放
      AutoPlayEvent(){
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

        let _state = "True"
        this.isOpenInteractiveMode?_state = "False":_state="True"
        UnityPreview(this.previewData[0].avatar.unity,JSON.stringify(this.previewData),_state,"True")
        // tolist
        this.previewReady = true;
        this.isPlaying = true;
      },
      //播放互动标签-脚本内互动
      WebInteractionStart(){
        this.interactionModel = true;
        if(this.isFirstScript&&this.isFirstScriptOnce){
          this.playWelcomeWords();
          this.isFirstScriptOnce = false;
          return false
        }
        if(!this.isOutInteraction){
          this.isInnerJsonInteraction = true; // 将是否为脚本内互动设为 true
          this.openInnerJsonInac() // 开启脚本内互动模式
        }else {
          if(this.isFirstScript&&!this.isFirstScriptOnce){return false}
          // 打开互动模式，互动模式处理
          this.handleInacLogic(); // 如果未开启脚本外互动则开启，如果已开启则进行互动流程
        }


      },
      //对应于UnityInteractionEnd，结束状态返回继续播放
      WebInteractionEnd(){
        if(this.isDisconnection){//断网循环
          this.AutoPlayEvent();
          return false;
        }
        if(this.isFirstScript){
          let _state = "False"
          this.isOpenInteractiveMode?_state = "False":_state="True"
          UnityPreview(this.previewData[0].avatar.unity,JSON.stringify(this.previewData),_state,"True")
          this.isFirstScript=false;
        }else{
          if(this.isOutInteraction){
           this.AutoPlayEvent();
           this.isOutInteraction = false;
           this.interactionModeIsEnd = false;
          }else{
            UnityPreviewContinue(this.previewData[0].avatar.unity);
          }
        }
        this.interactionModel = false;
      },

      //播放结束回调  播放一句互动结束回调Unity
      WebPreviewEnd(){
        if(this.isAutoPlayBtn){//是否自动播放
          if(this.isDisconnection){
            this.AutoPlayEvent();
            return false;
          }
            if((this.isOpenInteractiveMode || this.isEnterInteraction) && !this.interactionModeIsEnd && this.isInnerJsonInteraction) {
              // 互动模式处理
              this.handleInacLogic(); // 已经开启脚本内互动模式，正常处理互动流程
            } else {
              //---------------------剧本之间的互动
              if((this.isOpenInteractiveMode || this.isEnterInteraction) && !this.interactionModeIsEnd) {
                            if(this.isOutInteraction){
                              // 打开互动模式，互动模式处理
                              this.handleInacLogic(); // 如果未开启脚本外互动则开启，如果已开启则进行互动流程
                            }else{
                              if(this.isFirstScript){  UnityInteractionEnd(this.previewData[0].avatar.unity);  return false}
                              UnityInteractionStart(this.previewData[0].avatar.unity);
                              this.isOutInteraction = true;//脚本外互动
                            }
              }else if(!this.isOpenInteractiveMode && this.isOpenSceneEnd && !this.isPlayingEndWords) {
                // 关闭互动模式，场景话术的衔接语为开启状态
                this.playSceneEndWords();
              }else {
                // 播放下一个脚本
                this.interactionModeIsEnd = false;
                if(this.isFirstScript){
                  this.AutoPlayEvent();
                  // this.interactionModeIsEnd = false;
                  return false;
                }
                this.handleInacLogic();
              }
            }
        }
        else{
          if(this.queueList.length){
            let _Obj  = this.queueList.shift();
            UnityPreviewTxt(_Obj.name,_Obj.item)
            this.isPreviewBtn = true;
            this.nowTempId = _Obj.id;
            this.previewData = JSON.parse(_Obj.item)
            this.previewReady = false;
          }else{
            if(this.queueContentItem.length){
              let _Obj  = this.queueContentItem.shift();
              UnityPreview(_Obj.name,_Obj.item,'True','True')
              this.recordId = 'content'+_Obj.contentIndex+'script'+_Obj.allScriptIndex;

              this.isPreviewBtn = true;
              //当前播放脚本内容的定位信息
              this.nowContentIndex = _Obj.contentIndex;
              this.nowAllScriptIndex = _Obj.allScriptIndex;

              this.previewData = JSON.parse(_Obj.item)
              this.previewReady = false;
            }else{
              this.previewReady = true;
              this.isPlaying = false;
              this.isPreviewBtn = false;
              this.nowContentIndex = '';
              this.nowAllScriptIndex = '';
              this.nowTempId = '';
            }
          }
        }
      },

      //播放下一个
      nextPlayBtn(){
        let self = this;
        if(this.isAutoPlayBtn){
          return false;
        }
          console.log(this.nextPlayVal,this.contentIndex,this.nextAllScriptIndex)
        // if()
        this.previewBtn(this.nextPlayVal,this.contentIndex,this.nextAllScriptIndex,true)
        document.querySelector("#content"+self.nowContentIndex+"script"+self.allScriptIndex).scrollIntoView(true);
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
            console.log('接口全部加载完成',resList) ;
            resList.forEach((resItem,resItemInd)=>{
              if(resItem.data instanceof Array){
                self.allScriptList.push({
                  name:self.playData[resItemInd].name,
                  scriptList:resItem.data,
                  shortcut_json:data[resItemInd].shortcut_json,
                  gs_id:data[resItemInd].id
                })
              }else{
                self.allScriptList.push({
                  name:self.playData[resItemInd].name,
                  scriptList:[resItem.data],
                  shortcut_json:data[resItemInd].shortcut_json,
                  gs_id:data[resItemInd].id
                })
              }
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
        let _contentList = this.allScriptList[allScriptIndex].scriptList

        if(ind<_contentList.length-1){
          this.contentIndex = ind+1;
          this.nextAllScriptIndex = allScriptIndex;
          this.nextPlayVal = this.contentList[ind+1]
        }else{
          this.contentIndex = 0;
          if(allScriptIndex<this.allScriptList.length-1){
            this.nextAllScriptIndex = allScriptIndex+1;
            // this.allScriptIndex = this.nextAllScriptIndex
            this.nextPlayVal = this.allScriptList[this.nextAllScriptIndex].scriptList[0]
          }else{
            this.nextAllScriptIndex = 0;
            // if(bool){
            //   this.allScriptIndex = 0 ;
            //   this.scriptChange(this.allScriptIndex)
            // }

            this.nextPlayVal = this.allScriptList[0].scriptList[0]
          }
        }
      },
      //预览
      previewBtn(val,ind,allScriptIndex,bool){
        if(this.isAutoPlayBtn){return false}
        this.isPreviewBtn = true;
        // UnityPreviewCancel();
        if(!this.isPlaying){
          if(this.previewReady){
            UnityChangeAvatar(val.avatar.unity)
            this.recordId = 'content'+ind+'script'+allScriptIndex;//记录播放痕迹
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
        let _arr =  this.temporaryScriptList[ind].content.split('')
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
            this.isPreviewBtn = true;
            this.nowTempId = val.id;
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
              item:JSON.stringify([_json]),
              id:val.id,
            })
          }else{
            this.$message.info('最多支持3个播放排队,请稍后!')
          }
        }
      },
      getTempData(){
        let self = this;
        return new Promise(resolve =>{
          requestServices.getTempList({
            user_id:self.$Session.get('ai_user_id'),
            role_id:23,
            access_token: self.$Session.get('ai_user_token'),
            type:3
          }).then(res=>{
            // console.log(res.result.words)
            if(res.return_code===1000){
              self.temporaryScriptList=res.result.words.slice(-4)
              self.$forceUpdate();
              resolve(self.temporaryScriptList)
            }
          })
        })
      },
      addTempData(text){
        return new Promise(resolve =>{
          requestServices.addTemp({
            user_id:this.$Session.get('ai_user_id'),
            role_id:23,
            access_token: this.$Session.get('ai_user_token'),
            type:3,
            content:text
          }).then(res=>{
            if(res.return_code===1000){
              this.getTempData().then(res=>{
                resolve('11111111111')
              })
            }
          })
        })

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
        this.addTempData(this.temporaryScriptTxt).then(res=>{
          let _arr =  this.temporaryScriptList[this.temporaryScriptList.length-1].content.split('')
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
              content:resItem,
              interaction:{
                isSupport:false,
                maximum:10
              }
            })
          })
          if(!this.isPlaying){
            UnityPreviewTxt('none',JSON.stringify([_json]))
            this.isPreviewBtn = true;
            this.nowTempId = this.temporaryScriptList[this.temporaryScriptList.length-1].id
            this.previewData = JSON.parse(JSON.stringify([_json]))
            this.isPlaying = true;
            this.previewReady = false;
          }else{
            if(this.queueList.length<3){
              this.queueList.push({
                id:this.temporaryScriptList[this.temporaryScriptList.length-1].id,
                name:'none',
                item:JSON.stringify([_json])
              })
            }else{
              this.$message.info('最多支持3个播放排队，请稍后！')
            }
          }
        })


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
    /deep/.el-radio__input.is-disabled+span.el-radio__label{
      color: #7C53FF;
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
      .header{
        line-height: 1;
      }
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

  .interaction_Tip{
    text-align: right;
    font-size: 13px;
    color: #616367;
    height: 30px;
    width: 750px;
    margin: 10px auto;
  }
  .interaction_pop{
    font-size: 12px;
  }
  .borderLeftGreen{
    border-left: 7px solid #4caf50!important;
  }
</style>
