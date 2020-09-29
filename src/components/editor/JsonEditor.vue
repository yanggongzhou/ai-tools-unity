<template>
  <div class="container clearfix" ref="wise">
    <div class="leftBox float_left">
      <div class="leftBox2">
        <div class="left_div"
             v-for="(val,ind) in ScriptList"
             :key="ind+'model'">
          <div class="left_icon">
            <i class="view el-icon-view" @click="previewBtn(val,ind)"></i>
            <el-popconfirm
              confirmButtonText='是的'
              cancelButtonText='取消'
              icon="el-icon-info"
              iconColor="red"
              title="这一段内容确定删除吗？"
              @onConfirm="delBtn(ind)">
              <i v-show="ScriptList.length!==1" slot="reference" class="delete el-icon-delete"></i>
            </el-popconfirm>

          </div>

          <el-radio
            @change="scriptChange"
            class="left_card"
            v-model="scriptIndex" :label="ind" border>
            <div class="left_card_item">
              <i class="left_card_icon el-icon-warning" :style="val | styleFilter"></i>
              <div class="label">{{ind | indFilter}}</div>
            </div>
          </el-radio>
        </div>
      </div>
      <div class="left_add" @click="addScript">
        + 添加
      </div>
    </div>

    <w-textarea v-model="testData"
                class="container_textarea"
                :testData="testData"
                tag="wise" ref="testText"
                maxlength="100000"
                @delTagMain="delTagMain"
                @add="handleAdd">
      <div class="tagBox">
<!--        <div  class="interval-tag clearfix">-->
<!--          <div class="float_right">-->
<!--            <el-input-number v-model="intervalValue" controls-position="right" :step="0.5" :min="0.5" :max="10000"></el-input-number>-->
<!--            <el-button @click="addTag('间隔',intervalValue)" round>添加间隔时间</el-button>-->
<!--          </div>-->
<!--        </div>-->

        <el-dialog
          style="border-radius: 10px;"
          :visible.sync="videoVisible"
          :modal="false"
          width="500px">
          <div slot="title">

          </div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="展示区" prop="region">
              <el-select v-model="ruleForm.region" placeholder="请选择展示区域">
                <el-option label="区域一" value="1"></el-option>
                <el-option label="区域二" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传文件">
              <my-upload :imgVisible="imgVisible" :videoVisible="videoVisible"
                         @getDisplayImg="getDisplayImg" @getDisplayVideo="getDisplayVideo"></my-upload>
            </el-form-item>
            <el-form-item label="设置时长" prop="dismissTimeType">
              <el-col :span="12">
                <el-select v-model="ruleForm.dismissTimeType" @change="dismissTimeTypeChange" placeholder="请选择展示时长类型">
                  <el-option v-for="(val,ind) in dismissTimeTypeData"
                             :key="ind+'dismissTimeType'"
                             :label="val.label" :value="val.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input-number
                  style="width: 100px;"
                  v-if="!ruleForm.isAll"
                  v-model="ruleForm.dismissTime" controls-position="right" :precision="1" :min="0.1" :step="0.5" :max="3600"></el-input-number>
              </el-col>
              <el-col :span="4">
                <el-tag v-if="!ruleForm.isAll">秒</el-tag>
              </el-col>
            </el-form-item>
            <el-form-item label="声音设置" prop="isSupportAudio">
              <el-switch
                v-model="ruleForm.isSupportAudio"
                active-text="开启"
                inactive-text="关闭">
              </el-switch>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <button class="dialogBtn quxiao" @click.stop="videoVisible = false">取 消</button>
             <button class="dialogBtn queren" @click.stop="confrimBtn('ruleForm')">确 认</button>
            </span>
        </el-dialog>
        <el-dialog
          style="border-radius: 10px;"
          :visible.sync="imgVisible"
          :modal="false"
          width="500px">
<!--          <div slot="title">-->
<!--            上传文件-->
<!--          </div>-->
          <el-form :model="imgForm" :rules="imgRules" ref="imgForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="展示区" prop="region">
              <el-select v-model="imgForm.region" placeholder="请选择展示区域">
                <el-option label="展示位一" value="1"></el-option>
                <el-option label="展示位二" value="2"></el-option>
                <el-option label="展示位三" value="3"></el-option>
                <el-option label="展示位四" value="4"></el-option>
                <el-option label="展示位五" value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传文件">
              <my-upload :imgVisible="imgVisible" :videoVisible="videoVisible"
                         @getDisplayImg="getDisplayImg" @getDisplayVideo="getDisplayVideo"></my-upload>
            </el-form-item>
            <el-form-item label="设置时长" prop="dismissTimeType">
              <el-col :span="12">
                <el-select v-model="imgForm.dismissTimeType" @change="imgTypeChange" placeholder="请选择展示时长类型">
                  <el-option v-for="(val,ind) in dismissTimeTypeData_img"
                             :key="ind+'dismissTimeType'"
                             :label="val.label" :value="val.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input-number
                  style="width: 100px;"
                  v-if="!imgForm.isAll"
                  v-model="imgForm.dismissTime"
                  controls-position="right"
                  :precision="1" :min="0.1" :step="0.5" :max="3600"></el-input-number>
              </el-col>
              <el-col :span="4">
                <el-tag v-if="!imgForm.isAll">秒</el-tag>
              </el-col>

            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
<!--              <el-button @click="imgVisible = false">取 消</el-button>-->
             <button class="dialogBtn quxiao" @click.stop="imgVisible = false">取 消</button>
             <button class="dialogBtn queren" @click.stop="confrimBtn('imgForm')">确 认</button>
<!--              <el-button type="primary" @click="confrimBtn('imgForm')">确 定</el-button>-->
            </span>
        </el-dialog>
        <div class="p10"
             style="min-height: 66px"
             v-loading="actionLoading"
             element-loading-text="模型动作加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
          <span class="actionTitle">插入动作</span>
          <el-button class="actionBtn" size="small" v-for="(val,ind) in actionShowList" :key="ind+'animation'">
            <div class="animation-name" @click="addAction(val)">{{val.label}}</div>
            <div class="animation-show" @click="previewAction(val)">
              <el-icon class="el-icon-video-play"></el-icon>
            </div>
          </el-button>
        </div>
      </div>
    </w-textarea>
<!--    <div style="color: white" v-html="testData"></div>-->

<!--    <el-button @click="exportJson" type="success"> 生成JSON脚本</el-button>-->

    <div id="newDom" style="display: none"></div>
    <div id="oldDom" style="display: none"></div>
    <div style="display: none">
      <video id="videoDuration" :src="ruleForm.videoUrl"></video>
    </div>
  </div>
</template>

<script>
  import upload from "./upload";
  import {resultJSON} from '../../api/result'
  import textJSON from '../../api/text.json'
  export default {
    filters:{
      indFilter(val){
        if((val+1).toString().length===1){
          return '0'+(val+1)
        }else{
          return val;
        }
      },
      styleFilter(val){

        let _content='';
        val.param.forEach(value=>{
          _content += value.content
        })
        if(val.param.length===0 || !_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
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
    components:{
      'my-upload':upload,
    },
    props:{
      TriggerDiv:Array
    },
    data() {
      return {
        ScriptList:[],
        scriptIndex:0,
        scriptIndexOld:0,

        avatarID:3,
        actionShowList:[],
        actionLoading:true,
        testData:'',
        intervalValue:0.5,//间隔时间
        dismissTimeTypeData:[
          {label:'至视频播放结束',value:0},
          {label:'至脚本播放结束',value:1},
          {label:'自定义时长',value:2},
        ],
        dismissTimeTypeData_img:[
          {label:'至脚本播放结束',value:1},
          {label:'自定义时长',value:2},
        ],

        ruleForm:{
          region:'1',//展示区域
          dismissTimeType:2,//播放时间的方式
          dismissTime:3,
          videoUrl:'',
          videoName:'',
          isAll:false,
          isSupportAudio:false,
        },
        rules:{},
        imgForm:{
          region:'1',//展示区域
          dismissTimeType:2,//播放时间的方式
          dismissTime:3,
          isAll:false,
          url:'',
          name:'',
        },
        imgRules:{},

        videoVisible:false,
        imgVisible:false,

        cutTxtArr:[],//每次裁剪后被替换的缓存数据
        cutArr:[],//裁剪数据的缓存区
        cutCount:50,//裁剪的基准长度,即文字暂定50字后第一个标点（，。！？.....等）的分层

        previewReady:true,

        scriptChangeState:false,
        scriptChangeTimeout:'',
      };
    },
    created() {
      window.WebActionInfo= this.WebActionInfo
      window.WebSelectAvatarState = this.WebSelectAvatarState
    },
    mounted() {
      //要动作
      UnityChangeAvatar(resultJSON.resultJsonObj.avatar.unity);
    },
    watch:{
      //监听输入框文本，主要实现删除功能
      testData(newValue,oldValue){
        if(this.scriptChangeState) return false;
        // console.log(this.testData)
        if(newValue.length < oldValue.length&&(oldValue.length-newValue.length)>200){
          let newDom = document.getElementById('newDom');
          newDom.innerHTML = newValue;
          let newTagIdArr = [];
          let oldDom = document.getElementById('oldDom')
          oldDom.innerHTML = oldValue;
          //推入新数据的图片或视频的ID；
          newDom.querySelectorAll('wise').forEach(val=>{
            if(JSON.parse(val.dataset.obj).id){
              newTagIdArr.push(JSON.parse(val.dataset.obj).id)
            }
          })
          // console.log(newTagIdArr)
          //刷选删除掉的图片视频的id并通知dom删除
          oldDom.querySelectorAll('wise').forEach(val=>{
            if(JSON.parse(val.dataset.obj).id && newTagIdArr.indexOf(JSON.parse(val.dataset.obj).id)===-1){
              this.$emit('deleteTrigger',JSON.parse(val.dataset.obj).id)
            }
          })
        }
      }
    },

    methods: {
      //动作回调返回列表
      WebActionInfo(val){
        this.actionShowList = [];
        let labelData = val.split('-')[0].split(',')
        let valueData = val.split('-')[1].split(',')
        labelData.forEach((item,ind)=>{
          this.actionShowList.push({
            label:item,
            value:valueData[ind]
          })
        })
        this.actionLoading = false;
        console.log('动作列表接收',this.actionShowList)

        let self = this;
        //编辑时数据导入
        if(this.$route.params.data){
          this.ScriptList = JSON.parse(JSON.stringify(this.$route.params.data))
          let resArr  = this.$route.params.data
          resultJSON.resultJsonObj.avatar.unity = resArr[0].avatar.unity;
          this.$nextTick(()=>{
            this.editImport(this.ScriptList[0]);
          })
          this.$forceUpdate()
        }else{
          // this.actionShowList = this.$route.params.actionShowList;

          this.ScriptList[0] = JSON.parse(JSON.stringify(resultJSON.resultJsonObj))
          this.$forceUpdate()
        }
      },
      //预览
      previewBtn(val,ind){
        UnityPreviewCancel()
        if(!this.previewReady){
          this.$message.warning('资源加载中，请稍后...')
          return false;
        }
        let _content='';
        if(this.scriptIndex!==ind){
          val.param.forEach(value=>{
            _content += value.content;
          })
          if(val.param.length===0 || !_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
            this.$message.error('请确认当前段落含有有效文字！')
            return false
          }
          UnityPreview(val.avatar.unity,JSON.stringify([val]))
        }else{
          this.exportJson().then((data)=>{
            let _jsonArr = JSON.parse(JSON.stringify(resultJSON.resultJsonObj))
            _jsonArr.param = data.param

            _jsonArr.param.forEach(value=>{
              _content += value.content;
            })
            if(_jsonArr.param.length===0 || !_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
              this.$message.error('请确认当前段落含有有效文字！')
              return false
            }
            UnityPreview(val.avatar.unity,JSON.stringify([_jsonArr]))

            console.log( this.cutTxtArr,this.cutArr)
          })
        }
        this.previewReady = false;
      },

      WebSelectAvatarState(state){
        if(state==='True'){
          UnityAvatarMotionInfo(resultJSON.resultJsonObj.avatar.unity);
        }else if(state==='False'){
          this.$message.error('切换角色失败，请重试')
          // this.previewReady = false;
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

      //删除
      delBtn(ind){
        if(this.scriptIndex===ind&&ind){
          this.scriptIndex-=1
          // this.scriptChange(this.scriptIndex)
          this.scriptIndexOld = this.scriptIndex;
          this.$emit('editImportTriggerDiv',this.ScriptList[this.scriptIndex])
          this.editImport(this.ScriptList[this.scriptIndex]);
        }else if(this.scriptIndex===ind&&ind===0){
          this.scriptIndex+=1
          this.scriptIndexOld = this.scriptIndex;
          this.$emit('editImportTriggerDiv',this.ScriptList[this.scriptIndex])
          this.editImport(this.ScriptList[this.scriptIndex]);
        }else if(this.scriptIndex>ind){
          this.scriptIndex-=1
        }
        this.ScriptList.splice(ind,1);
      },

      //切换段落
      scriptChange(val){
        let self = this;
        this.scriptChangeState=true;
        clearTimeout(self.scriptChangeTimeout);
        this.exportJson().then(data=>{
          self.ScriptList[self.scriptIndexOld].param = JSON.parse(JSON.stringify(data.param))
          self.scriptIndexOld = val;
          self.$emit('editImportTriggerDiv',self.ScriptList[val])
          self.editImport(self.ScriptList[val]);
          self.scriptChangeTimeout=setTimeout(()=>{
            self.scriptChangeState = false;
          },500)
        })
        // console.log(self.ScriptList)
      },
      //添加段落
      addScript(){
        let self = this;
        this.ScriptList[this.ScriptList.length] = JSON.parse(JSON.stringify(resultJSON.resultJsonObj))
        this.exportJson().then(data=>{
          self.ScriptList[self.scriptIndex].param = JSON.parse(JSON.stringify(data.param))
          self.scriptIndex = this.ScriptList.length-1;
          self.scriptIndexOld = self.scriptIndex;
          self.$emit('editImportTriggerDiv',self.ScriptList[self.scriptIndex])
          self.editImport(self.ScriptList[self.scriptIndex]);
        })
        this.$forceUpdate()
      },
      //预览动作
      previewAction(val){ UnityAvatarAction(resultJSON.resultJsonObj.avatar.unity,val.value) },
      //删除标签更新testData
      delTagMain(txt){
        this.testData=this.testData.replace(txt,'')
        // console.log('self.testData1122',this.testData)
      },
      //如果携带参数——编辑&导入
      editImport(res){
        let self = this;
        let contentBD = '';//带标点符号英文等的文本
        let positionTag = [];//相对带所有符号文本的标签位置和数据
        let txtIndCount=0;//计数器
        res.param.forEach((param,ind)=>{
          //🌟🌟🌟🌟🌟第一步，统计总文本和推入间隔标签
          if(param.intervalTime){
            positionTag.push({
              time:param.intervalTime,
              type:"interval",
              index:contentBD.length,
              id:self.getGuid()
            })
          }
          contentBD += param.content
          if(ind){
            txtIndCount+=res.param[ind-1].content.length
          }
          //🌟🌟🌟🌟🌟第二步，推入info和动作标签
          param.trigger.forEach(val=>{
            let txtInd= txtIndCount + this.getTruePos(param.content,val.index)
            if(txtInd!==0&&!txtInd){//处理最后一个标签显示问题
              txtInd = param.content.length
            }
            if(!val.index){
              txtInd = 0
            }
            if(val.type==="info"){
              if(val.info.child[0].type==="image"){
                positionTag.push({
                  index:txtInd,
                  time:val.info.dismissTime,
                  type:"image",
                  name:val.info.child[0].name,
                  url:val.info.child[0].url,
                  id:val.info.child[0].id,
                  isAll:val.isAll,
                })
              }else if(val.info.child[0].type==="video"){
                positionTag.push({
                  index:txtInd,
                  time:val.info.dismissTime,
                  type:"video",
                  name:val.info.child[0].name,
                  url:val.info.child[0].url,
                  id:val.info.child[0].id,
                  isAll:val.isAll,
                })
              }
            }else if(val.type==="action"){
              positionTag.push({
                index:txtInd,
                type:"action",
                actionName:val.action.actionName,
                id:val.id
              })
            }
          })
        })
        console.log('带标点符号英文等的文本',contentBD)
        console.log('相对带所有符号文本的标签位置和数据',positionTag)
        let contentBDArr = contentBD.split('')
        positionTag.forEach((val,ind)=>{
          if(val.type==="image"){
            let _data = JSON.stringify({type:'image',name:val.name,time:val.time,url:val.url,id:val.id,isAll:val.isAll}).replace(/"/g,"&quot;")
            let _time = val.time/1000+'s';
            if(val.isAll){
              _time = 'all'
            }
            let _imageDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="tagImg tagtag">图片`+val.name+' ('+_time+`)<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i>&nbsp;</div></wise>`
            // contentBDArr[val.index]= _imageDom + contentBDArr[val.index]
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _imageDom
            }else{
              // contentBDArr[val.index]=_imageDom+contentBDArr[val.index]
              let _txt = contentBDArr[val.index].split('')
              _txt.splice(_txt.length-1,1,_imageDom+_txt[_txt.length-1]);
              contentBDArr[val.index] = _txt.join('');
            }
          }else if(val.type==="video"){
            let _data = JSON.stringify({type:'video',name:val.name,time:val.time,url:val.url,id:val.id,isAll:val.isAll}).replace(/"/g,"&quot;")
            let _time = val.time/1000+'s';
            if(val.isAll){
              _time = 'all'
            }
            let _videoDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="tagVideo tagtag">视频`+val.name+' ('+_time+`)<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i>&nbsp;</div></wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _videoDom
            }else{
              // contentBDArr[val.index]=_videoDom+contentBDArr[val.index]
              let _txt = contentBDArr[val.index].split('')
              _txt.splice(_txt.length-1,1,_videoDom+_txt[_txt.length-1]);
              contentBDArr[val.index] = _txt.join('');
            }
          }else if(val.type==="action"){
            let _data = JSON.stringify({id:val.id, type:'action', actionName:val.actionName}).replace(/"/g,"&quot;")
            let _actionName = '';
            self.actionShowList.forEach(act=>{if(act.value===val.actionName){ _actionName = act.label}})
            let _actionDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="action tagtag">`+_actionName+`<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i>&nbsp;</div></wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _actionDom
            }else{
              let _txt = contentBDArr[val.index].split('')
              _txt.splice(_txt.length-1,1,_actionDom+_txt[_txt.length-1]);
              contentBDArr[val.index] = _txt.join('');
              // contentBDArr[val.index]=_actionDom+contentBDArr[val.index]
            }
          }else if(val.type==="interval"){
            let _data = JSON.stringify({type:'interval', time:val.time}).replace(/"/g,"&quot;")
            let _intervalDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="jiange tagtag">间隔(`+val.time/1000+`s)<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i>&nbsp;</div></wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _intervalDom
            }else{
              let _txt = contentBDArr[val.index].split('')
              _txt.splice(_txt.length-1,1,_intervalDom+_txt[_txt.length-1]);
              contentBDArr[val.index] = _txt.join('');
              // contentBDArr[val.index]=_intervalDom+contentBDArr[val.index]
            }
          }
        })
        // console.log('contentBDArrcontentBDArr',contentBDArr)
        this.testData=contentBDArr.join('');
      },

      //视频时长方式转换
      dismissTimeTypeChange(val){
        switch (val) {
          case 0:
            this.ruleForm.dismissTime = document.getElementById('videoDuration').duration
            if(!this.ruleForm.dismissTime){
              this.$message.warning('视频时长获取失败，请等待视频上传完成后再试！')
            }
            this.ruleForm.isAll = false;
          break;
          case 1:
            this.ruleForm.dismissTime = 999;
            this.ruleForm.isAll = true;
            break;
          case 2:
            this.ruleForm.dismissTime = 3;
            this.ruleForm.isAll = false;
            break;
        }
      },
      //图片时长转换
      imgTypeChange(val){
        switch (val) {
          case 1:
            this.imgForm.dismissTime = 999;
            this.imgForm.isAll = true;
            break;
          case 2:
            this.imgForm.dismissTime = 3;
            this.imgForm.isAll = false;
            break;
        }
      },

      getTruePos(contentBD,index){
        let _txtInd;
        let _index=0
        contentBD.split('').forEach((txt,txtInd)=>{
          if(txtInd===index+_index){
            _txtInd = txtInd;
          }
          if(!txt.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
            _index+=1
          }
        })
        return _txtInd;
      },

      exportJson(type){
        let self = this;
        let exoprtParams = [];
        this.cutArr = [];
        // console.log(this.testData)
        return new Promise(resolve => {
          self.$refs.testText.exportMessage().then(res=>{
            if(!res.noTagText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
              // self.$message.error('脚本内容需含有数字或汉字等有效文本内容！')
              // return false
            }
            console.log('标签信息',res.messageArr)
            console.log('页面数据',self.TriggerDiv)
            console.log('无标签纯文本',res.noTagText)
            let _trigInfo = JSON.parse(JSON.stringify(this.TriggerDiv))
            let _domMessage = [];//文字/视频/图片数组的信息,即脚本type=info的必要参数
            let _actionMessage = [];//动作
            let _intervalMessage = [];//间隔标签数据
            res.messageArr.forEach((msg,msgInd)=>{
              if(msg.datasetObj.type==="image"||msg.datasetObj.type==="video"){
                _domMessage.push(msg);
              }else if(msg.datasetObj.type==='action'){
                _actionMessage.push({
                  "id":msg.datasetObj.id,
                  "index": msg.index,
                  "type": "action",
                  "action": {
                    "actionName": msg.datasetObj.actionName,
                    "isLoop": false,
                    "dismissTime": 0
                  }
                })
              }else if(msg.datasetObj.type==='interval'){
                _intervalMessage.push(msg)
              }
            })
            //✨✨✨✨第一步文本数据分组
            let intervalArr= [{
              content:'',
              intervalTime: 0,
            }];//intervalArr间隔标签分段的文本数组
            _intervalMessage.forEach((val,ind)=>{
              intervalArr.push({
                content:'',
                intervalTime: 0,
              })
              intervalArr[ind].content = res.noTagText.slice(0,val.index);
              intervalArr[ind+1].intervalTime = val.datasetObj.time
            })
            intervalArr[intervalArr.length-1].content = res.noTagText
            // console.log('文本数据分组',intervalArr)
            let intervalArr1 = JSON.parse(JSON.stringify(intervalArr))
            intervalArr1.forEach((val,ind)=>{
              if(ind){
                val.content = val.content.replace(intervalArr[ind-1].content,'')
              }
            })
            if(!intervalArr1[0].content){intervalArr1.shift()};//如果第一个为空，抛掉不计入数据
            intervalArr1.forEach(val=>{
              let arr = []
              arr.push(val)
              this.cutIntervalArr(arr)
            })
            // console.log('文本数据分组1',intervalArr1)
            // console.log('裁剪数据区',this.cutArr)
            let _cutArr = JSON.parse(JSON.stringify(this.cutArr))
            _cutArr.forEach(item=>{
              item.forEach(val=>{
                exoprtParams.push(val);
              })
            })
            // console.log('✨✨✨✨第一步文本数据分组',exoprtParams)
            //✨✨✨✨第2.0步info信息插入
            //信息板
            _trigInfo.forEach((val,ind)=>{
              _domMessage.forEach(dom=>{
                if(dom.datasetObj.url===val.info.child[0].url){
                  val.index = dom.index;
                }
              })
              // //删除id
              // if(val.type==='info'){
              //   delete val.info.child[0].id;
              // }
            })
            let sortData =  function (a, b) {
              return a.index-b.index
            }
            _trigInfo = _trigInfo.sort(sortData)//排序
            let contentCount = 0;
            exoprtParams.forEach((val,ind)=>{
              val.trigger = []
              _trigInfo.forEach(trig=>{
                let _trig = JSON.parse(JSON.stringify(trig))
                _trig.index-=contentCount
                // 判断假如是最后有个标签也塞入json
                if(ind!==exoprtParams.length-1){
                  if(val.content.length>_trig.index&&_trig.index>=0){
                    val.trigger.push(_trig)
                  }
                }else{
                  if(val.content.length>=_trig.index&&_trig.index>=0){
                    val.trigger.push(_trig)
                  }
                }
              })
              contentCount += val.content.length;
            });
            // console.log('✨✨✨✨第2.0步info信息插入', exoprtParams)
            //✨✨✨✨第2.1步动作信息插入
            contentCount =0
            exoprtParams.forEach((val,ind)=>{
              _actionMessage.forEach(act=>{
                let _act = JSON.parse(JSON.stringify(act))
                _act.index-=contentCount;
                if(ind!==exoprtParams.length-1){
                  if(val.content.length>_act.index&&_act.index>=0){
                    val.trigger.push(_act)
                  }
                }else{
                  if(val.content.length>=_act.index&&_act.index>=0){
                    val.trigger.push(_act)
                  }
                }

              });
              contentCount += val.content.length;
            });
            // console.log('✨✨✨✨第2.1步动作信息插入', exoprtParams)

            //✨✨✨✨第三步动作及info等的标签index韵母排序----------------------------------待完成，现在以汉字和数字占位排序
            // [\u4e00-\u9fa5\a-zA-Z0-9]
            exoprtParams.forEach(val=>{
              val.trigger.forEach(trig=>{
                let _content = val.content.slice(0,trig.index)
                let _index = 0;

                if(_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
                  _index=_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g).join("").length;
                }
                trig.index = _index;
              })
            })
            resolve({message:'json数据渲染成功',noTagText:res.noTagText,param:exoprtParams})
          })
        })
      },

      //处理基准长度单位前提下的第一个标点（，。）content
      cutContent(content){
        let biaodian = [',','，','.','。','!','?','！','？']
        let _content = JSON.parse(JSON.stringify(content))
        let _cut = _content.splice(0,this.cutCount)
        let _index = 0;
        let _indexArr = [];
        if(biaodian.indexOf(_cut[_cut.length-1])===-1){
          _content.forEach((con,conInd)=>{
            if(biaodian.indexOf(con)!==-1){
              _indexArr.push(conInd);
              // console.log('_index111',_index)
              return false;
            }
          })
        }
        // console.log('_indexArr',_indexArr)
        if(_indexArr.length){
          _index = _indexArr[0]+1;
        }else{
          // _index =content.length;
        }
        _index += this.cutCount
        // console.log('_index',_index)
        return _index
      },
      //裁剪json的content
      cutTxt(content){
        let _index = this.cutContent(content)
        // console.log('_index_index_index_index',_index)
        this.cutTxtArr.push({
          content:content.splice(0,_index).join(''),
          intervalTime:0
        })
        if(content.length>this.cutCount){
          this.cutTxt(content);
        }else{
          if(content.length){
            this.cutTxtArr.push({
              content:content.join(''),
              intervalTime:0
            })
          }
        }
      },
      //递归计数返回裁剪后的json的content数组数据
      cutIntervalArr(arr){
        this.cutTxtArr = []
        this.cutTxt(arr[0].content.split(''))
        this.cutTxtArr[0].intervalTime = arr[0].intervalTime;
        this.cutTxtArr.unshift(0, 1);
        Array.prototype.splice.apply(arr, this.cutTxtArr);
        this.cutArr.push(arr);
      },

      handleAdd (type) {
        switch (type) {
          case "video":
            this.ruleForm.videoName = '';
            this.ruleForm.videoUrl = '';
            this.ruleForm.region = '1';
            this.ruleForm.dismissTimeType = 2;
            this.ruleForm.dismissTime = 3;
            this.ruleForm.isAll=false;
            this.imgVisible = false;
            this.videoVisible = true;
            break;
          case 'img':
            this.imgForm.region = '1';
            this.imgForm.dismissTimeType = 2;
            this.imgForm.dismissTime = 3;
            this.imgForm.url = '';
            this.imgForm.name = '';
            this.imgForm.isAll=false;
            this.videoVisible = false;
            this.imgVisible = true;
            break;
          case 'clean':
            this.$refs.testText.exportMessage().then(res=>{
              this.testData = res.noTagText
              this.$emit('cleanTriggerDiv')
            })
        }
      },

      addTag (type,interval) {
        let self = this;
        let _id=this.getGuid()
        if(type==='间隔'){
          let _data = {
            type:'interval',
            time:interval*1000,
            id:_id
          }
          let _text =  `<div class="jiange tagtag">间隔(`+self.intervalValue+`s)<i class="el-icon-close" onClick="delTag(\``+_id+`\`)"></i>&nbsp;</div>`
          this.$refs.testText.addTag(_text,_data)
        }
        // this.$refs.testText.addTag(text,dataId)
      },
      //插入动作tag
      addAction(val){
        let _id=this.getGuid()
        let _data = {
          type:'action',
          actionName:val.value,
          id:_id
        }
        let _text =  `<div class="action tagtag">`+val.label+`<i class="el-icon-close" onClick="delTag(\``+_id+`\`)"></i>&nbsp;</div>`
        this.$refs.testText.addTag(_text,_data)
      },
      getDisplayImg(Obj){
        this.imgForm.url = Obj.url;
        this.imgForm.name = Obj.name;
      },
      getDisplayVideo(Obj){
        this.ruleForm.videoUrl = Obj.url;
        this.ruleForm.videoName = Obj.name;

      },
      //弹框确定
      confrimBtn(){
        let _data,_text,_time;
        let _id = this.getGuid()
        if(this.videoVisible&&this.ruleForm.videoUrl){
          _data={
            type:'video',
            name:this.ruleForm.videoName,
            time:this.ruleForm.dismissTime*1000,
            url: this.ruleForm.videoUrl,
            isSupportAudio:this.ruleForm.isSupportAudio,
            region:this.ruleForm.region,
            isAll:this.ruleForm.isAll,
            id:_id
          }
          _time = this.ruleForm.dismissTime+'s';
          if(this.ruleForm.isAll){
            _time = 'all'
          }
          _text = `<div class="tagtag tagVideo">视频`+this.ruleForm.videoName+` (`+_time+`)<i class="el-icon-close" onClick="delTag(\``+_id+`\`)"></i>&nbsp;</div>`
          this.$refs.testText.addTag(_text,_data)
          this.$emit('displayVideoUrl',_data)
          this.videoVisible = false;
        }else if(!this.videoVisible&&this.imgForm.url){
          _data={
            type:'image',
            name:this.imgForm.name,
            time:this.imgForm.dismissTime*1000,
            url:this.imgForm.url,
            region:this.imgForm.region,
            isAll:this.imgForm.isAll,
            id:_id
          }
          _time = this.imgForm.dismissTime+'s';
          if(this.imgForm.isAll){
            _time = 'all'
          }
          _text =  `<div class="tagtag tagImg">图片`+this.imgForm.name+` (`+_time+`)<i class="el-icon-close" onClick="delTag(\``+_id+`\`)"></i>&nbsp;</div>`
          this.$refs.testText.addTag(_text,_data)
          this.$emit('displayImgUrl',_data)
          this.imgVisible = false;
        }else{
          this.$message.error('请先上传文件')
        }
      },
      getGuid() {
        // 生成随机ID
        return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`;
      },

    },
  };
</script>



<style lang="less" scoped>
  /deep/.el-icon-loading{
    font-size: 30px !important;
  }

  .container{
    font-size: 0;
    .container_left{
      float: left;
    }
    .container_textarea{
      float: left;
      width: calc(100% - 68px);
    }
  }


  .tagBox{
    background: #8FAEB3;
    position: relative;
  }
.interval-tag{
  position: absolute;
  top: -44px;
  right: 245px;
}
  .actionTitle{
    display: inline-block;
    background: #fff;
    color: #658f96;
    font-size: 13px;
    border-radius: 3px;
    height: 24px;
    margin: 5px;
    line-height: 24px;
    text-align: center;
    border: 2px solid #658f96;
    font-weight: 600;
    width: 100px;
    letter-spacing: 1px;
    cursor: no-drop;
  }
  .actionBtn{
    font-weight: 400;
    margin: 5px;
    padding: 0;
    font-size: 12px;
    .animation-name{
      display: inline-block;
      margin: 5px 0 5px 5px;
      cursor: pointer;
    }
    .animation-show{
      display: inline-block;
      padding: 5px ;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.5s;
      &:hover{
        background: #2196F3;
        color: white;
      }
    }
  }
  .dialogBtn{
    font-size: 12px;
    margin-top: 18px;
    display: inline-block;
    line-height: 1;
    padding: 5px 8px;
    margin-right: 8px;
    height: 34px;
    width: 92px;
    border-radius: 32px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    background: #fff;
    transition: all 0.3s;
    color: #FFFFFF;
    &:hover {
      opacity: .7;
    }
    &:focus {
      outline: none;
    }
  }
  .quxiao{
    color: #a7a7a7;
  }
  .queren{
    background: #7455FF;
  }
</style>
<style lang="less" scoped>
  /deep/.el-radio{
    color: #E87E4D !important;
  }
  /deep/.el-radio.is-bordered.is-checked{
    background: #E87E4D !important;
    border-color: #E87E4D !important;
  }
  /deep/.el-radio__input.is-checked+.el-radio__label{
    color: #FFFFFF!important;
  }
  .leftBox2{
    height: 100%;
    overflow: scroll;
  }
  .leftBox{
    width: 68px;
    height: 266px;
    text-align: right;
    position: relative;
    .left_div{
      position: relative;
      .left_icon{
        position: absolute;
        left: 18px;
        z-index: 1;
        font-size: 13px;
        width: 18px;
        color: #FFFFFF;
        transition: all .3s;
        .view{
          cursor: pointer;
          background: #999999;
          padding: 2px;
          transition: all .3s;
          &:hover{
            background: #4CAF50;
          }
        }
        .delete{
          cursor: pointer;
          margin-top: 1px;
          padding: 2px;
          background: #999999;
          transition: all .3s;
          &:hover{
            background: #f54007;
          }
        }
      }
      &:hover .left_icon{
        left: 0px;
      }
    }
    .left_card{
      position: relative;
      z-index: 10;
      width: 50px;
      height: 35px!important;
      margin-top: 0px;
      padding: 0!important;;
      overflow: hidden;
      margin-left: 0px !important;
      margin-right: 0px !important;
      border: none;
      border-top: 1px solid #E87E4D;
      border-radius: 0px;
      background: #FFFFFF!important;
      /deep/.el-radio__input{
        display: none;
      }
      /deep/.el-radio__label{
        padding-left: 0;
      }

      .left_card_item{
        font-size: 0;
        .left_card_icon{
          font-size: 13px;
          position: absolute;
          right: 2px;
          top: 2px;
        }
        .label{
          font-size: 13px;
          font-weight: 600;
          height: 34px;
          line-height: 34px;
          text-align: center;
        }
      }
    }
    .left_add{
      font-size: 13px;
      color: #E87E4D;
      position: absolute;
      bottom: -34px;
      padding: 8px 15px;
      transition: all .3s;
      &:hover{
        cursor: pointer;
        color: rgba(232, 126, 77, 0.84);
        background: rgba(140, 147, 157, 0.19);
      }
    }
  }

</style>
