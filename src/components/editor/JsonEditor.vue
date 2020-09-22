<template>
  <div class="container" ref="wise">
    <w-textarea v-model="testData"
                :testData="testData"
                tag="wise" ref="testText"
                maxlength="100000"
                @delTagMain="delTagMain"
                @add="handleAdd">
      <div class="tagBox">
        <div  class="interval-tag clearfix">
          <div class="float_right">
            <el-input-number v-model="intervalValue" controls-position="right" :step="0.5" :min="0.5" :max="10000"></el-input-number>
            <el-button @click="addTag('间隔',intervalValue)" round>添加间隔时间</el-button>
          </div>
        </div>

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
        <div class="p10">
          <span class="actionTitle">插入动作</span>
          <el-button class="actionBtn" size="small" v-for="(val,ind) in actionShowList" :key="ind+'animation'">
            <div class="animation-name" @click="addAction(val)">{{val.label}}</div>
            <div class="animation-show" @click.stop="previewAction(val)">
              <el-icon class="el-icon-video-play"></el-icon>
            </div>

          </el-button>
        </div>
      </div>
    </w-textarea>
<!--    <div style="color: white" v-html="testData"></div>-->

<!--    <el-button @click="exportJson" type="success"> 生成JSON脚本</el-button>-->

    <saveloading v-show="LOADING" :LOADING="LOADING"></saveloading>

    <div id="newDom" style="display: none"></div>
    <div id="oldDom" style="display: none"></div>
    <div style="display: none">
      <video id="videoDuration" :src="ruleForm.videoUrl"></video>
    </div>
  </div>
</template>

<script>
  import saveloading from "./saveloading";
  import upload from "./upload";
  import {resultJSON} from '../../api/result'
  import Bus from '../../api/bus'
  import { SSTTS } from '../../api/sstts'
  import { requestServices } from "../../api/api";
  import axios from 'axios'
  export default {
    components:{
      'my-upload':upload,
      saveloading
    },
    props:{
      actionShowList:Array,
      avatarID:Number,
      TriggerDiv:Array
    },
    data() {
      return {
        LOADING:NaN,

        testData:'',
        // testData: `<wise id="123"><div class="jiange tagtag">间隔3s</div></wise>`,

        // tools: [
        //   // { type: 'action', text: '模型动作' },
        //   { type: 'video', text: '添加视频' },
        //   { type: 'img', text: '添加图片' },
        //   { type: 'clean', text: '清空标签' },
        // ],
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

        showTime:3,

        cutTxtArr:[],//每次裁剪后被替换的缓存数据
        cutArr:[],//裁剪数据的缓存区
        cutCount:50,//裁剪的基准长度,即文字暂定50字后第一个标点（，。！？.....等）的分层

        calibrationNum:0,//校准下标
        ZHSSarr:['ng','a','o','e','ii','iii','er','eer','ai','ei','ao','ou','an','en','ang','eng','ong','i','ia','iu','io','iao','ie','iou','ian','in','iang','ing','iong','u','ua','uo','uai','uei','uan','uen','uang','ueng','v','ve','van','vn'],
      };
    },
    mounted() {
      let self = this;
      Bus.$on('ExportJsonPreview',res=>{
        self.exportJson().then((data)=>{
          SSTTS.getLongTTS(data.noTagText)
            .then(tts=>{
              let _data = {
                timeline:tts.timeline,
                buffer: tts.buffer,
                json:resultJSON.resultJsonObj
              }
            Bus.$emit('previewOnline',_data);//审核内容，当前预览，
          })
        })
      })


      //保存json
      Bus.$on('saveBtn',(jsonName,type)=>{
        // let LOADINGTimeOut = setTimeout(()=>{
        //   self.LOADING = '';
        //   self.$message.error('服务器异常,请稍后重试...')
        // },30000)
        self.LOADING = 1;
        self.exportJson().then(data=>{
          self.LOADING = 2;
          // console.log('data',self.obj2FormData(resultJSON.resultJsonObj))

          let content = JSON.stringify(resultJSON.resultJsonObj);
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
              self.LOADING = 3;
            console.log(uploadRes)
            let avatar_name = ''
            resultJSON.avatarData.forEach(val=>{
              if(val.ind===resultJSON.avatarID){
                avatar_name = val.name
              }
            })
            SSTTS.getLongTTS(data.noTagText)
              .then(tts=>{
                self.LOADING = 4;
                //总剧本时长计入间隔时间
                let _time =  (tts.timeline[tts.timeline.length-1].beg+tts.timeline[tts.timeline.length-1].dur);
                resultJSON.resultJsonObj.param.forEach(param=>{
                  _time += param.intervalTime;
                })
                _time=_time/1000+'';
                if(self.$route.params.id && type!=='另存为'){
                  requestServices.editScript({
                    user_id:self.$root.ai_user_id,
                    access_token:self.$root.ai_user_token,
                    name:jsonName,
                    preview_url:'',
                    script_url:uploadRes.data.result.upload_url,
                    avatar_id:resultJSON.avatarID,
                    avatar_name:avatar_name,
                    scene_type:'1',//0-默认类型；1-淘宝；2-抖音；3-快手
                    time:_time,
                    gs_id:self.$route.params.id,
                    template_json:JSON.stringify(resultJSON.infoModelData)
                  }).then(res=>{
                    if(res.return_code===1000){
                      self.$message.success('保存成功');
                      self.LOADING = 5;
                      // clearTimeout(LOADINGTimeOut)
                      setTimeout(()=>{
                        self.LOADING = NaN;
                        // self.$router.push('/myscript')
                      },1000)
                    }else {
                      self.LOADING = 51;
                      setTimeout(()=>{
                        self.LOADING = NaN;
                        self.$message.info('保存失败');
                        // self.$message.error(res.result.message);
                        Bus.$emit('handleLoginDialog', true);
                      },1000)
                    }
                  })
                }else{
                  requestServices.addScript({
                    user_id:self.$root.ai_user_id,
                    access_token:self.$root.ai_user_token,
                    name:jsonName,
                    preview_url:'',
                    script_url:uploadRes.data.result.upload_url,
                    avatar_id:resultJSON.avatarID,
                    avatar_name:avatar_name,
                    scene_type:'1',//0-默认类型；1-淘宝；2-抖音；3-快手
                    time:_time,
                    template_json:JSON.stringify(resultJSON.infoModelData)
                  }).then(res=>{
                    if(res.return_code===1000){
                      self.$route.params.id=res.result.gs_id
                      console.log(self.$route.params)
                      self.$message.success('保存成功');
                      self.LOADING = 5;
                      // clearTimeout(LOADINGTimeOut)
                      setTimeout(()=>{
                        self.LOADING = NaN;
                        // self.$router.push('/myscript')
                      },1000)
                    }else{
                      self.LOADING = 51;
                      setTimeout(()=>{
                        self.LOADING = NaN;
                        self.$message.info('保存失败');
                        if(res.return_code == 1009) {
                          Bus.$emit('handleLoginDialog', true);
                        }
                      },1000)
                    }
                  })
                }

              })
          })
        })
      })
    },
    watch:{
      //监听输入框文本，主要实现删除功能
      testData(newValue,oldValue){
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
              contentBDArr[val.index]=_imageDom+contentBDArr[val.index]
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
              contentBDArr[val.index]=_videoDom+contentBDArr[val.index]
            }
          }else if(val.type==="action"){
            let _data = JSON.stringify({id:val.id, type:'action', actionName:val.actionName}).replace(/"/g,"&quot;")
            let _actionName = '';
            self.actionShowList.forEach(act=>{if(act.value===val.actionName){ _actionName = act.label}})
            let _actionDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="action tagtag">`+_actionName+`<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i>&nbsp;</div></wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _actionDom
            }else{
              contentBDArr[val.index]=_actionDom+contentBDArr[val.index]
            }
          }else if(val.type==="interval"){
            let _data = JSON.stringify({type:'interval', time:val.time}).replace(/"/g,"&quot;")
            let _intervalDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="jiange tagtag">间隔(`+val.time/1000+`s)<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i>&nbsp;</div></wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _intervalDom
            }else{
              contentBDArr[val.index]=_intervalDom+contentBDArr[val.index]
            }
          }
        })
        // console.log('contentBDArrcontentBDArr',contentBDArr)
        this.testData=contentBDArr.join('');
      },
      //转换成file文件
      obj2FormData(_obj) {
        let content = JSON.stringify(_obj);
        let blob = new Blob([content], { type: "text/plain;charset=utf-8" }); // 把数据转化成blob对象
        // //file在edge浏览器中不支持
        // let file = new File([blob], "ai.json", { lastModified: Date.now() }); // blob转file
        blob.lastModifiedDate = new Date();
        blob.name = "ai.json";
        let fd = new FormData();
        fd.append("file", blob);
        fd.append("user_id", this.$root.ai_user_id);
        fd.append("access_token", this.$root.ai_user_token);
        fd.append("target", 1);
        fd.append("type", 0);
        return fd;
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
        resultJSON.resultJsonObj.param = [];
        this.cutArr = [];
        // console.log(this.testData)
        return new Promise(resolve => {
          self.$refs.testText.exportMessage().then(res=>{
            if(!res.noTagText.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
              self.$message.error('脚本内容需含有数字或汉字等有效文本内容！')
              self.LOADING = '';
              return false
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
                resultJSON.resultJsonObj.param.push(val);
              })
            })
            // console.log('✨✨✨✨第一步文本数据分组',resultJSON.resultJsonObj.param)
            //✨✨✨✨第2.0步info信息插入
            //信息板
            _trigInfo.forEach((val,ind)=>{
              // val.info.margins.top = (val.info.margins.top - val.info.height/2) / resultJSON.avatarBox.height;
              // val.info.margins.left = (val.info.margins.left - val.info.width/2) / resultJSON.avatarBox.width;
              // val.info.height /= resultJSON.avatarBox.height;
              // val.info.width /= resultJSON.avatarBox.width;
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
            resultJSON.resultJsonObj.param.forEach((val,ind)=>{
              val.trigger = []
              _trigInfo.forEach(trig=>{
                let _trig = JSON.parse(JSON.stringify(trig))
                _trig.index-=contentCount
                // 判断假如是最后有个标签也塞入json
                if(ind!==resultJSON.resultJsonObj.param.length-1){
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
            // console.log('✨✨✨✨第2.0步info信息插入', resultJSON.resultJsonObj.param)
            //✨✨✨✨第2.1步动作信息插入
            contentCount =0
            resultJSON.resultJsonObj.param.forEach((val,ind)=>{
              _actionMessage.forEach(act=>{
                let _act = JSON.parse(JSON.stringify(act))
                _act.index-=contentCount;
                if(ind!==resultJSON.resultJsonObj.param.length-1){
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
            // console.log('✨✨✨✨第2.1步动作信息插入', resultJSON.resultJsonObj.param)

            //✨✨✨✨第三步动作及info等的标签index韵母排序----------------------------------待完成，现在以汉字和数字占位排序
            // [\u4e00-\u9fa5\a-zA-Z0-9]
            resultJSON.resultJsonObj.param.forEach(val=>{
              val.trigger.forEach(trig=>{
                let _content = val.content.slice(0,trig.index)
                let _index = 0;

                if(_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
                  _index=_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g).join("").length;
                }
                trig.index = _index;
              })
            })

            console.log(resultJSON.resultJsonObj)
            resolve({message:'json数据渲染成功',noTagText:res.noTagText})
          })
        })
      },
      //取回时间戳，排序为韵母下标————————————————————————————————————————————————待完成
      calibrationIndex(){
        let self = this;
        SSTTS.getLongTTS(resultJSON.resultJsonObj.param[this.calibrationNum].content)
          .then(res=>{
            let allTimeArr=[];
            res.timeline.forEach((val,index)=>{
              if(self.ZHSSarr.indexOf(val.phm)!==-1){
                allTimeArr.push(val)
              }
            })
            console.log(allTimeArr)
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
          _index =content.length;
        }
        _index += this.cutCount
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
      //预览动作
      previewAction(val){
        this.$emit('actionChange',val.value);
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
    beforeDestroy() {

    }
  };
</script>



<style lang="less" scoped>
  .tagBox{
    background: #8FAEB3;
    position: relative;
  }
.interval-tag{
  position: absolute;
  top: -51px;
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
