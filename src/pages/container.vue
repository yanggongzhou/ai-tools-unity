<template>
  <div class='common_content'>
    <div class="headerBox">
      <button class="backNormal" @click="backspace">
        <span class="_icon">< </span>
        <span>返回</span>
      </button>
      <div class="content clearfix">
        <div class="json_name float_left">
          <span class="label">剧本名称:</span>
          <el-input @input="jsonNameFocus" class="inp" v-model="jsonName"></el-input>
          <div v-show="jsonNameValidate" class="err_tip">*请输入有效剧本名称</div>
        </div>
        <div  class="float_right right-control">

          <button class="back" @click="$router.push('/homepage')">返回首页</button>
          <button class="back preview" @click="previewBtn">预览</button>
          <button class="back save" @click="saveBtn('保存')">保存</button>
          <button v-if="$route.params.id" class="back save" @click="saveBtn('另存为')">另存为</button>
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
    ></JsonEditor>
  </div>
</template>

<script>
  import JsonEditor from "../components/editor/JsonEditor.vue";
  import {resultJSON} from "../api/result";
  import Bus from "../api/bus";
  import axios from "axios";
  import {requestServices} from "../api/api";
  export default {
    components:{
      JsonEditor,
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
      }
    },
    created() {
      this.jsonNameValidate = false;
    },
    mounted() {
      let self = this;
      //编辑的数据
      if(this.$route.params.data){
        this.jsonName = this.$route.params.name
        let resArr  = this.$route.params.data
        resultJSON.resultJsonObj.avatar.unity = resArr[0].avatar.unity;
        this.editImportTriggerDiv(resArr[0])
      }

      Bus.$on('delTag',res=>{
        this.TriggerDiv.forEach((trig,trigInd)=>{
          if(trig.info.child[0].id===res){
            this.TriggerDiv.splice(trigInd,1)
          }
        })
      })

      window.WebPreviewReady = this.WebPreviewReady;
      window.WebSelectAvatarState=this.WebSelectAvatarState;
    },
    methods:{
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
          UnityPreview(resultJSON.resultJsonObj.avatar.unity,JSON.stringify(_JsonEditorRef.ScriptList))
          self.previewReady = false;
        })
      },

      WebSelectAvatarState(state){
        if(state==='True'){
          UnityAvatarMotionInfo(resultJSON.resultJsonObj.avatar.unity);
        }else if(state==='False'){
          this.$message.error('切换角色失败，请重试')
        }
      },
      WebPreviewReady(state){
        if(state==='True'){
          UnityPreviewStart(resultJSON.resultJsonObj.avatar.unity);
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
            fd.append("user_id", self.$root.ai_user_id);
            fd.append("access_token", self.$root.ai_user_token);
            fd.append("target", 1);
            fd.append("type", 0);

            axios.post(requestServices.uploadUrl,fd,{responseType:'multipart/form-data'})
              .then(uploadRes=>{
                let avatar_name = ''
                resultJSON.avatarData.forEach(val=>{
                  if(val.ind===resultJSON.avatarID){
                    avatar_name = val.name
                  }
                })
                if(self.$route.params.id && type!=='另存为'){
                  requestServices.editScript({
                    role_id:self.$root.role_id,
                    user_id:self.$root.ai_user_id,
                    access_token:self.$root.ai_user_token,
                    name:self.jsonName,
                    preview_url:'',
                    script_url:uploadRes.data.result.upload_url,
                    paragraph_number:_JsonEditorRef.ScriptList.length,
                    avatar_id:resultJSON.avatarID,
                    avatar_name:avatar_name,
                    scene_type:'1',//0-默认类型；1-淘宝；2-抖音；3-快手
                    time:0,
                    gs_id:self.$route.params.id,
                    template_json:''//信息版位置信息数据
                  }).then(res=>{
                    if(res.return_code===1000){
                      self.$message.success('保存成功');
                    }else{
                      self.$message.info(res.result.message);
                    }
                  })
                }
                else{
                  requestServices.addScript({
                    role_id:self.$root.role_id,
                    user_id:self.$root.ai_user_id,
                    access_token:self.$root.ai_user_token,
                    name:self.jsonName,
                    preview_url:'',
                    script_url:uploadRes.data.result.upload_url,
                    paragraph_number:_JsonEditorRef.ScriptList.length,
                    avatar_id:resultJSON.avatarID,
                    avatar_name:avatar_name,
                    scene_type:'1',//0-默认类型；1-淘宝；2-抖音；3-快手
                    time:0,
                    template_json:''
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
      },
      //图片接受
      displayImgUrl(data){
        let self = this;
        let trigItem=JSON.parse(JSON.stringify(resultJSON.imageItem))
        trigItem.info.child[0].type="image"
        trigItem.isAll = data.isAll;
        trigItem.info.dismissTime=data.time;
        trigItem.info.child[0].url=data.url;
        trigItem.info.child[0].id=data.id;
        trigItem.info.child[0].region=data.region
        trigItem.info.child[0].name=data.name
        self.TriggerDiv.push(trigItem)
      },
      displayVideoUrl(data){
        let trigItem=JSON.parse(JSON.stringify(resultJSON.videoItem))
        trigItem.info.child[0].type="video";
        trigItem.isAll = data.isAll;
        trigItem.info.dismissTime=data.time;
        trigItem.info.child[0].url=data.url;
        trigItem.info.child[0].id=data.id
        trigItem.info.child[0].region=data.region
        trigItem.info.child[0].isSupportAudio=data.isSupportAudio
        trigItem.info.child[0].name=data.name
        this.TriggerDiv.push(trigItem)
      },
      //输入框删除tag事件
      deleteTrigger(id){
        this.TriggerDiv.forEach((val,ind)=>{
          if(val.info.child[0].id === id){
            this.TriggerDiv.splice(ind,1);
          }
        })
      },
      //返回上一页
      backspace(){
        //创建脚本返回
        if(!this.$route.params.id){
          this.$router.push('/steper')
        }else{
          this.$router.push('/myscript')
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .common_content {
    padding: 30px 20px;
    position: relative;
  }
  .headerBox{

    .content{
      padding: 25px 0px 15px;
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
      background: transparent;
      border: 1px solid #7E59FF;
      cursor: pointer;
      border-radius: 32px;
      font-size: 13px;
      color: #7E59FF;
      transition: all .5s;
      &:hover{
        background: #dacaf7;
        border: 1px solid #d1b8ff;
      }
      &:focus{
        border: 1px solid #7E59FF;
        background: #dacaf7;
      }
    }
    .preview{
      width: 78px;
      margin-left: 60px;
    }
    .save{
      width: 78px;
      background: #7E59FF;
      color: #FFFFFF;
      margin-left: 22px;
      &:hover{
        background: #7e59ffbf;
      }
      &:focus{
        border: 1px solid #d1b8ff;
        background: #7e59ffbf;
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
