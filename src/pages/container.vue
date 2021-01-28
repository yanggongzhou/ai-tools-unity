<template>
  <div class='common_content'>
    <div class="headerBox">
      <div class="titleBox">
        <span class="titleSpan">剧本编辑</span>
      </div>


      <div class="content clearfix">
        <div class="json_name float_left">
          <span class="label">剧本名称:</span>
          <el-input @input="jsonNameFocus" class="inp" v-model="jsonName"></el-input>
          <div v-show="jsonNameValidate" class="err_tip">*请输入有效剧本名称</div>
        </div>
        <div  class="float_right right-control">

<!--          <button class="back" @click="$router.push('/home')">返回首页</button>-->
          <button class="back preview" @click="previewBtn">
            <span class="iconfont alicon-yulan posAdjustment"></span>
            <span>预览</span>
          </button>
          <button class="back save" @click="saveBtn(1)">
            <span class="iconfont alicon-baocun posAdjustment"></span>
            <span>保存</span>
          </button>
          <button v-if="$route.params.id" class="back save" @click="saveBtn(2)">
            <span class="iconfont alicon-lingcunwei posAdjustment"></span>
            <span>另存</span>
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
    ></JsonEditor>
  </div>
</template>

<script>
  import JsonEditor from "../components/editor/JsonEditor.vue";
  import Bus from "../api/bus";
  import axios from "axios";
  import {requestServices} from "../api/api";
  import {mapGetters} from "vuex";
  export default {
    components:{
      JsonEditor,
    },
    computed: {
      ...mapGetters([
        'AvatarChName',
        'ResultJson',
        'InfoModelData'
      ])
    },
    data () {
      return {
        jsonName:'',//剧本名称
        jsonNameValidate:false,

        imgList:[],
        videoList:[],
        jsonContent:'',

        TriggerDiv:[],
        previewReady:true,
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
      }
    },
    created() {
      this.jsonNameValidate = false;
      window.WebPreviewReady = this.WebPreviewReady;
      window.WebJsonInfo = this.WebJsonInfo;//保存时获取必要的unityMessage

    },
    mounted() {
      let self = this;
      //编辑的数据
      if(this.$route.params.data){
        this.jsonName = this.$route.params.name
        let resArr  = this.$route.params.data
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
      editImportTriggerDiv(data){
        let self = this;
        self.TriggerDiv = [];
        data.param.forEach(val=>{
          val.trigger.forEach(val=>{
            if(val.type==="info"){
              // //兼容之前无动画效果/
              // if(!val.info.child[0].animate){
              //   val.info.child[0].animate= {
              //     "enter":"",
              //     "leave":"",
              //     "duration":{'enter': 1000, 'leave': 1000}
              //   }
              // }
              self.TriggerDiv.push(val)
            }
          })
        })
      },
      //预览
      previewBtn(){
        UnityPreviewCancel();
        if(!this.previewReady){
          this.$message.warning('资源加载中，请稍后...')
          return false;
        }
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
            this.$message.error('请确认各段落是否含有有效文本！')
            return
          }
          UnityPreview(this.ResultJson.avatar.unity,JSON.stringify(_JsonEditorRef.ScriptList),"True","False")
          self.previewReady = false;
        })
      },

      WebPreviewReady(state){
        if(state==='True'){
          UnityPreviewStart(this.ResultJson.avatar.unity);
        }else if(state==='False'){
          this.$message.error('加载资源失败，请重试')
        }
        this.previewReady = true;
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
          _JsonEditorRef.exportJson().then(data=>{
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
              if(scriptItem.param.length===0 || !_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
                valitade = false;
              }
            })
            if(!valitade){
              this.$message.error('请确认各段落是否含有有效文本！')
              return
            }

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
            axios.post(requestServices.uploadUrl,fd,{responseType:'multipart/form-data'})
              .then(uploadRes=>{
                if(self.$route.params.id && this.jsonInfoType!==2){
                  requestServices.editScript({
                    role_id:23,
                    user_id:self.$Session.get('ai_user_id'),
                    access_token:self.$Session.get('ai_user_token'),
                    name:self.jsonName,
                    preview_url:'',
                    script_url:uploadRes.data.result.upload_url,
                    paragraph_number:_JsonEditorRef.ScriptList.length,
                    avatar_name:this.AvatarChName,
                    scene_type:'1',//0-默认类型；1-淘宝；2-抖音；3-快手
                    time:0,
                    gs_id:self.$route.params.id,
                    template_json:'',//信息版位置信息数据
                    layer:"",
                  }).then(res=>{
                    if(res.return_code===1000){
                      self.$message.success('保存成功');
                    }
                  })
                }
                else{
                  requestServices.addScript({
                    role_id:23,
                    user_id:self.$Session.get('ai_user_id'),
                    access_token:self.$Session.get('ai_user_token'),
                    name:self.jsonName,
                    preview_url:'',
                    script_url:uploadRes.data.result.upload_url,
                    paragraph_number:_JsonEditorRef.ScriptList.length,
                    avatar_name:this.AvatarChName,
                    scene_type:'1',//0-默认类型；1-淘宝；2-抖音；3-快手
                    time:0,
                    template_json:'',
                    layer:"",
                  }).then(res=>{
                    if(res.return_code===1000){
                      self.$route.params.id=res.result.gs_id
                      self.$message.success('保存成功');
                    }
                  })
                }

              })
          })
        }else{
          this.jsonNameValidate = true;
        }
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
      border: 1px solid #FF7599;
      cursor: pointer;
      border-radius: 5px;
      font-size: 12px;
      color: #FF7599;
      transition: all .5s;
      &:focus{
        border: 1px solid #FF7599;
      }
      &:hover{
        background: #dacaf7;
        border: 1px solid #f596ae;
      }
    }
    .preview{
      width: 70px;
      background: #FFFFFF;
      border: 1px solid #FF7599;
      &:hover{
        background: #FF7599;
        color: #FFFFFF;
      }
    }
    .save{
      width: 72px;
      background: #eae9f6;
      margin-left: 10px;
      border: 1px solid transparent;
      &:hover{
        background: #FF7599;
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
