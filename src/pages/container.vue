<template>
  <div class='common_content'>
    <div class="headerBox">
      <div class="titleBox">
        <span class="titleSpan">{{$lan.common.top_title_edit}}</span>
      </div>


      <div class="content clearfix">
        <div class="json_name float_left">
          <span class="label">{{$lan.myscript.title}}:</span>
          <el-input @input="jsonNameFocus" class="inp" v-model="jsonName"></el-input>
          <div v-show="jsonNameValidate" class="err_tip">*{{$lan.tools.titleErrTip}}</div>
        </div>
        <div  class="float_right right-control">

<!--          <button class="back" @click="$router.push('/home')">返回首页</button>-->
          <button class="back preview" @click="previewBtn">
            <span class="iconfont alicon-yulan posAdjustment"></span>
            <span>{{$lan.common.preview}}</span>
          </button>
          <button class="back save" @click="saveBtn(1)">
            <span class="iconfont alicon-baocun posAdjustment"></span>
            <span>{{$lan.common.save}}</span>
          </button>
          <button v-show="editJsonData.id" class="back save" @click="saveBtn(2)">
            <span class="iconfont alicon-lingcunwei posAdjustment"></span>
            <span>{{$lan.common.saveAs}}</span>
          </button>
          <!--        <el-button @click="downloadJSON" type="success">下载脚本</el-button>-->
        </div>

      </div>
    </div>

    <JsonEditor
      ref="JsonEditorRef"
      :TriggerDiv="TriggerDiv"
      @displayImgUrl="displayImgUrl"
      @displayVideoUrl="displayVideoUrl"
      @deleteTrigger="deleteTrigger"
      @cleanTriggerDiv="cleanTriggerDiv"
      @editImportTriggerDiv="editImportTriggerDiv"
      @addDisplay="addDisplay"
      :editJsonData="editJsonData"
      :language="language"
    ></JsonEditor>
    <v-loading v-show="LOADING" :LOADING="LOADING"></v-loading>
  </div>
</template>

<script>
  import vLoading from "../components/editor/common/saveloading";
  import JsonEditor from "../components/editor/JsonEditor.vue";
  import Bus from "../api/bus";
  import axios from "axios";
  import {requestServices} from "../api/api";
  import {mapGetters,mapActions} from "vuex";
  import {AMSound} from "../sound/sound";
  import {ComputerWords} from "../components/editor/common/word_index";
  export default {
    components:{
      JsonEditor,
      vLoading
    },
    computed: {
      ...mapGetters([
        'AvatarChName',
        'ResultJson',
        'InfoModelData',
        "ali_tts_token",
        "ali_token_expires",
        "ResourceReady",
        "IsSaveTip"
      ])
    },
    watch:{
      InfoModelData: {
        handler: function(newVal,oldVal) {
          console.log(newVal,oldVal)

          if(newVal.length<oldVal.length){
            oldVal.forEach(val=>{
              if(newVal.indexOf(val)===-1){
                let delTrigger = []
                this.TriggerDiv.forEach((trig,trigInd)=>{
                  if(trig.info.child[0].region===val){
                    delTrigger.push(trig)
                  }
                })
                delTrigger.forEach(delt=>{
                  delTag(delt.info.child[0].id)
                })
              }
            })
          }
        },
        deep: true
      },
    },
    data () {
      return {
        LOADING: NaN,

        jsonName:'',//剧本名称
        jsonNameValidate:false,

        imgList:[],
        videoList:[],
        jsonContent:'',

        TriggerDiv:[],
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

        jsonInfoType:1,//要unityMessage时触发类型 1 保存，2另存

        editJsonData:{},//编辑来的数据

        scriptUrl:'',
        AMSound:'',

        ComputerWords:'',
        language:"zh",//'zh' or 'en_ali' or 'en_biaobei'
      }
    },
    created() {
      this.jsonNameValidate = false;
      window.WebPreviewReady = this.WebPreviewReady;
      window.WebJsonInfo = this.WebJsonInfo;//保存时获取必要的unityMessage
      this.editJsonData =  JSON.parse(this.$Session.get('Edit_JSON'));
      this.$store.commit('set_resourceReady',true);
      this.$store.commit('set_IsSaveTip',false)

      this.ComputerWords = new ComputerWords()
      if(this.$route.query.language){
        this.language = this.$route.query.language
      }

    },
    mounted() {
      let self = this;
      //编辑的数据
      if(this.editJsonData.data){
        this.jsonName =  this.editJsonData.name
        let resArr  =  this.editJsonData.data
        this.editImportTriggerDiv(resArr[0])
      }
      Bus.$on('delTag',res=>{
        this.TriggerDiv.forEach((trig,trigInd)=>{
          if(trig.info.child[0].id===res){
            this.TriggerDiv.splice(trigInd,1)
          }
        })
      })
    },
    methods:{
      ...mapActions(["fetchSoundToken"]),
      initSound() {
        this.AMSound = new AMSound();
        let _option = {
            user_id: this.$Session.get('ai_user_id'),
            access_token : this.ali_tts_token
          },
          _isInitInacTTS = false;

        this.AMSound.init('ali', _option, _isInitInacTTS);
      },


      editImportTriggerDiv(data){
        let self = this;
        self.TriggerDiv = [];
        data.param.forEach(val=>{
          val.trigger.forEach(val=>{
            if(val.type==="info"){
              self.TriggerDiv.push(val)
            }
          })
        })
      },
      //预览
      previewBtn(){
        if(!this.ResourceReady){
          this.$message.warning(this.$lan.common.resourceLoadingMsg)
          return false;
        }
        this.$store.commit('set_pcVisible',true)
        UnityPreviewCancel();
        let self = this;
        let _JsonEditorRef = this.$refs.JsonEditorRef;
        _JsonEditorRef.exportJson().then((data)=>{
          _JsonEditorRef.ScriptList[_JsonEditorRef.scriptIndex].param = JSON.parse(JSON.stringify(data.param))
          //✨✨✨✨总体校验有效文本
          let valitade = true;
          _JsonEditorRef.ScriptList.forEach((scriptItem,scriptItemIndex)=>{
            let _content='';
            scriptItem.param.forEach(value=>{
              _content += value.content
            })
            if(scriptItem.param.length===0 || !_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
              valitade = false;
            }
          })
          if(!valitade){
            this.$message.error(this.$lan.tools.isValidTextMsg)
            return
          }
          UnityPreview(this.ResultJson.avatar.unity,JSON.stringify(_JsonEditorRef.ScriptList),"True","False")
          this.$store.commit('set_resourceReady',false);
        })
      },

      WebPreviewReady(state){
        if(state==='True'){
          // this.$store.commit('set_pcVisible',true)
          UnityPreviewStart(this.ResultJson.avatar.unity);
        }else if(state==='False'){
          this.$store.commit('set_pcVisible',false)
          this.$message.error(this.$lan.common.resourceLoadingFailMsg)
        }
        this.$store.commit('set_resourceReady',true);
      },

      //剧本名称校验
      jsonNameFocus(value){
        if(value.replace(/[\r\n]/g, "").replace(/\s+/g, "")&&this.jsonNameValidate){
          this.jsonNameValidate = false;
        }
      },
      //保存脚本
      saveBtn(type){
        UnityJsonInfo();
        this.jsonInfoType = type
      },
      //获取unityMessage之后保存
      WebJsonInfo(_unityMessage){
        //保存&另存
        let self = this;
        if(this.jsonName.replace(/[\r\n]/g, "").replace(/\s+/g, "")){
          this.jsonNameValidate = false;
          let _JsonEditorRef = self.$refs.JsonEditorRef;
          this.LOADING = 1;
          _JsonEditorRef.exportJson().then(async data=>{
            this.LOADING = 2;
            _JsonEditorRef.ScriptList[_JsonEditorRef.scriptIndex].param = JSON.parse(JSON.stringify(data.param))
            // console.log('输出数据',_JsonEditorRef.ScriptList)
            //✨✨✨✨总体校验有效文本
            let valitade = true;
            _JsonEditorRef.ScriptList.forEach((scriptItem,scriptItemIndex)=>{
              let _content='';
              scriptItem.unityMessage = JSON.parse(_unityMessage)
              scriptItem.name = this.jsonName;
              scriptItem.param.forEach(value=>{
                _content += value.content
              })

              let _zh = this.language==='zh'&&!this.ComputerWords.getIndex_ZH(_content)
              let _enAli = this.language==='en_ali'&& !this.ComputerWords.getIndex_EN_AL(_content)
              if(this.language==='en_biaobei'){
                //先赋值 cumInfo
                this.ComputerWords.getIndex_EN_BB(_content,true)
              }
              let _enBiaobei = this.language==='en_biaobei'&& !this.ComputerWords.getIndex_EN_BB(_content)
              if(scriptItem.param.length===0 || _zh || _enAli || _enBiaobei){
                valitade = false;
              }
            })
            if(!valitade){
              this.$message.error(this.$lan.tools.isValidTextMsg)
              return
            }

            await this.uploadJSON(_JsonEditorRef)
            let _time = 0;
            if(this.language==='en_ali'){
              await this.getAudio(data.noTagText)
              let _twts = this.AMSound.TTS.audioInfo[0].currentWordsTimeArr;
              _time = _twts[_twts.length - 1].begin + _twts[_twts.length - 1].duration;
              self.ResultJson.param.forEach(param => {
                _time += param.intervalTime / 1000;
              })

              console.log( '脚本链接和tts信息',this.scriptUrl, this.AMSound.TTS.audioInfo)
            }
            this.LOADING = 4;
            let _data = {
              role_id:23,
              user_id:self.$Session.get('ai_user_id'),
              access_token:self.$Session.get('ai_user_token'),
              name:self.jsonName,
              preview_url:'',
              script_url:this.scriptUrl,
              paragraph_number:_JsonEditorRef.ScriptList.length,
              avatar_name:this.AvatarChName,
              scene_type:'1',//0-默认类型；1-淘宝；2-抖音；3-快手
              time:_time,
              template_json:'',//信息版位置信息数据
              layer:"",
            }
            let _handleFun;
            if(self.editJsonData.id && this.jsonInfoType!==2){
              _data.gs_id = self.editJsonData.id
              _handleFun = 'editScript'
            } else{
              _handleFun = 'addScript'
            }
            requestServices[_handleFun](_data).then(res=>{
              if(res.return_code===1000){
                self.editJsonData.id=res.result.gs_id;
                if(self.IsSaveTip){
                  this.$store.commit('set_IsSaveTip',false)
                  UnityIsSaveTip('False')
                }
                self.$message.success('success');
                self.LOADING = 5;
                setTimeout(() => {
                  self.LOADING = NaN;
                }, 1000)
              }
            })
          })
        }else{
          this.jsonNameValidate = true;
        }
      },

      async uploadJSON(_JsonEditorRef) {
        let self = this
        let content = JSON.stringify(_JsonEditorRef.ScriptList);
        let blob = new Blob([content], { type: "text/plain;charset=utf-8" }); // 把数据转化成blob对象
        // //file在edge浏览器中不支持
        let file = new File([blob], "ai.json", { lastModified: Date.now() }); // blob转file
        let fd = new FormData();
        fd.append("file", file);
        fd.append("user_id", self.$Session.get('ai_user_id'));
        fd.append("access_token", self.$Session.get('ai_user_token'));
        fd.append("target", 1);
        fd.append("type", 0);

        await axios.post(requestServices.uploadUrl, fd, {responseType: 'multipart/form-data'})
          .then(uploadRes => {
            self.scriptUrl = uploadRes.data.result.upload_url
            self.LOADING = 3;
        })
      },
      async getAudio(_txt) {
        console.log('getAudio: ', _txt, !this.AMSound)
        if (!this.AMSound) {
          this.initSound();
        }
        let time = new Date().getTime()
        if (!this.ali_tts_token || time > this.ali_token_expires) {
          console.log('获取阿里TTS token')
          await this.fetchSoundToken({ type: 'ali' })
          await this.AMSound.refreshToken(this.ali_tts_token);
        }

          await this.AMSound.txtToAudio({
          text: _txt,

          tts: {
            speechRate: -140, // 语速，取值范围 -500 ~ 500
            volume:50, // 音量，取值范围 0 ~ 100
            voiceName: "Aixia",
            pitchRate:0, // 语调，取值范围 -500 ~ 500
          },

          isHandleTimeline: true
        })
        return
      },

      //清空标签对应的dom元素
      cleanTriggerDiv(){
        this.TriggerDiv = [];
        this.InfoModelData.forEach(val=>{
          UnityDelTag(val);
        })
      },
      //图片接受
      displayImgUrl(data){
        let self = this,editIndex,trigItem;
        if(self.TriggerDiv.length){
          self.TriggerDiv.forEach((val,ind)=>{
            if(val.info.child[0].id===data.id){
              trigItem=JSON.parse(JSON.stringify(val))
              editIndex = ind
            }
          })
        }
        if(editIndex===undefined){
          trigItem=JSON.parse(JSON.stringify(this.imageItem))
        }
        trigItem.info.child[0].type="image"
        trigItem.isAll = data.isAll;
        trigItem.info.dismissTime=data.time;
        trigItem.info.child[0].url=data.url;
        trigItem.info.child[0].id=data.id;
        trigItem.info.child[0].region=data.region
        trigItem.info.child[0].name=data.name
        trigItem.info.child[0].animate.enter=data.enter
        trigItem.info.child[0].animate.leave=data.leave
        if(editIndex!==undefined){
          self.TriggerDiv.splice(editIndex,1,trigItem)
        }else{
          self.TriggerDiv.push(trigItem)
        }
      },
      displayVideoUrl(data){
        let self = this,editIndex,trigItem;
        if(self.TriggerDiv.length){
          self.TriggerDiv.forEach((val,ind)=>{
            if(val.info.child[0].id===data.id){
              trigItem=JSON.parse(JSON.stringify(val))
              editIndex = ind;
            }
          })
        }
        if(editIndex===undefined) {
          trigItem = JSON.parse(JSON.stringify(this.videoItem))
        }
        trigItem.info.child[0].type="video";
        trigItem.isAll = data.isAll;
        trigItem.info.dismissTime=data.time;
        trigItem.info.child[0].url=data.url;
        trigItem.info.child[0].id=data.id
        trigItem.info.child[0].region=data.region
        trigItem.info.child[0].isSupportAudio=data.isSupportAudio
        trigItem.info.child[0].name=data.name
        trigItem.info.child[0].animate.enter=data.enter
        trigItem.info.child[0].animate.leave=data.leave
        if(editIndex===undefined) {
          this.TriggerDiv.push(trigItem)
        }else{
          this.TriggerDiv.splice(editIndex,1,trigItem)
        }
      },
      addDisplay(data){
        let editIndex,trigItem;
        if(this.TriggerDiv.length){
          this.TriggerDiv.forEach((val,ind)=>{
            if(val.info.child[0].id===data.id){
              trigItem=JSON.parse(JSON.stringify(val))
              editIndex = ind
            }
          })
        }
        if(editIndex===undefined){
          trigItem=JSON.parse(JSON.stringify(this.textItem))
        }
        trigItem.info.child[0].textColor=data.textColor;
        trigItem.info.child[0].region=data.region;
        trigItem.info.child[0].id=data.id
        trigItem.info.child[0].textSize=data.textSize
        trigItem.info.child[0].gravity=data.gravity
        trigItem.info.child[0].text=data.text
        trigItem.info.child[0].ellipsize=data.ellipsize
        trigItem.isAll = data.isAll;
        trigItem.info.dismissTime=data.dismissTime;
        trigItem.info.child[0].fontFamily=data.fontFamily
        trigItem.info.child[0].animate.enter=data.enter
        trigItem.info.child[0].animate.leave=data.leave
        if(editIndex===undefined) {
          this.TriggerDiv.push(trigItem)
        }else{
          this.TriggerDiv.splice(editIndex,1,trigItem)
        }
      },
      //输入框删除tag事件
      deleteTrigger(id){
        this.TriggerDiv.forEach((val,ind)=>{
          if(val.info.child[0].id === id){
            this.TriggerDiv.splice(ind,1);
            this.$forceUpdate()
          }
        })
      },
    },
    beforeDestroy() {
      this.$Session.set('Edit_JSON',"{}")//清空编辑数据
      //跳转页面后强制结束播放状态
      UnityPreviewCancel();
    },
  }
</script>

<style lang="less" scoped>
  .posAdjustment{
    position: relative;
    top: 1px;
    font-size: 14px!important;
  }
  .common_content {
    padding: 45px 20px;
    position: relative;
  }
  .headerBox{

    .content{
      padding: 0 0 15px;
      .json_name{
        padding-left: 29px;
        display: inline-block;
        width: 230px;
        font-size: 16px;
        color: #5f5f5f;
        position: relative;
        .inp{
          width: 152px;
        }
        .err_tip{
          position: absolute;
          right: -111px;
          top: 9px;
          font-size: 12px;
          color: red;
          height: 38px;
        }
      }
      .title{
        font-weight: 600;
        cursor: pointer;
        border: 1px solid #ffffff;
        &:focus{
          outline: none;
        }
      }
    }
  }
  .right-control{
    font-size: 0;
    .back{
      width: 111px;
      height: 30px;
      line-height: 0;
      background: transparent;
      border: 1px solid #7694f3;
      cursor: pointer;
      border-radius: 5px;
      font-size: 12px;
      color: #7694f3;
      transition: all .5s;
      &:focus{
        border: 1px solid #7694f3;
      }
      &:hover{
        background: #b6c5f6;
        border: 1px solid #7694f3;
      }
    }
    .preview{
      width: 70px;
      background: #FFFFFF;
      border: 1px solid #7694f3;
      &:hover{
        background: #7694f3;
        color: #FFFFFF;
      }
    }
    .save{
      width: 72px;
      background: #eae9f6;
      margin-left: 10px;
      border: 1px solid transparent;
      &:hover{
        background: #7694f3;
        color: #FFFFFF;
      }
    }
  }
  .drawerBox{
    /deep/.el-drawer.ltr{
      /*background: #424346;*/
      height: 680px!important;
      background: url(https://large.magics-ad.com/mygz-file/image/dialog.png) no-repeat;
      background-size: 100% 100%;
      box-shadow: none !important;
      outline: none !important;
    }
    /deep/.el-drawer__close-btn{
      font-size: 26px;
      color: #000000;
      position: relative;
      right: 16px;
      top: 10px;
      transition: all 0.3s;
      &:hover{
        color:#FF9800;
      }
    }
    /deep/.el-drawer__header{
      padding: 0;
      margin: 0;
    }
    /deep/.el-drawer__body{
      overflow: scroll;
    }

  }
</style>
