<template>
  <div class="container clearfix" ref="wise">
    <div class="leftBox float_left">
      <div class="leftBox2">
        <div class="left_div"
             v-for="(val,ind) in ScriptList"
             :id="'model'+ind"
             :key="ind+'model'">
          <div class="left_icon">
            <i class="view el-icon-view" @click="previewBtn(val,ind)"></i>
<!--            <el-popconfirm-->
<!--              confirmButtonText='是的'-->
<!--              cancelButtonText='取消'-->
<!--              icon="el-icon-info"-->
<!--              iconColor="red"-->
<!--              title="这一段内容确定删除吗？"-->
<!--              @onConfirm="delBtn(ind)">-->
<!--              <i v-show="ScriptList.length!==1" slot="reference" class="delete el-icon-more"></i>-->
<!--            </el-popconfirm>-->
            <el-dropdown @command="proto=>handleCommand(ind,proto)" trigger="click">
              <i class="moremore el-icon-arrow-down el-icon-more"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(value,index) in dropdownData"
                                  :key="index+'dropdown'"
                                  :disabled="ScriptList.length===1&&value.value==='6'"
                                  :command="value.value"
                                  :icon="value.icon">
                  {{value.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
          <v-video ref="videoDom" :videoForm="ruleForm" @cancel="cancelBtn('video')"
                   @confirm="data=>confrimBtn('video',data)"></v-video>
        </el-dialog>
        <el-dialog
          style="border-radius: 10px;"
          :visible.sync="imgVisible"
          :modal="false"
          width="500px">
          <v-img ref="imgDom" :imgForm="imgForm" @cancel="cancelBtn('img')"
                 @confirm="data=>confrimBtn('img',data)"></v-img>
        </el-dialog>
<!--        文字-->
        <el-dialog
          style="border-radius: 10px;"
          :visible.sync="textVisible"
          :modal="false"
          width="500px">
          <v-text :textForm="textForm" @cancel="cancelBtn('text')" @confirm="data=>confrimBtn('text',data)"></v-text>
        </el-dialog>

        <div
          class='timerDialog'
          width="200px"
          v-if="timerVisible"
          :modal="false"
          :show-close='false'
        >
          <el-input-number style='width: 110px;' v-model="intervalValue" controls-position="right" :step="0.5" :min="0.5" :max="10000"></el-input-number> s<br/>
          <button class="dialogBtn quxiao" style='width:50px;border-radius:4px;' @click.stop="timerVisible = false">取 消</button>
          <button class="dialogBtn queren" style='width:50px;margin-top:0;border-radius:4px;' @click.stop="addTag('间隔',intervalValue)">确 认</button>
        </div>

        <div class="p10"
             style="min-height: 66px"
             v-loading="actionLoading">
          <el-tooltip  :open-delay="1000" placement="bottom" effect="dark">
            <div slot="content">
              <p class="center tip_title">动作标签</p>
              <p class="center">注意文本中紧邻的 <br/> 动作标签只会执行最后一个哦!</p>
            </div>
            <span class="actionTitle">插入动作</span>
          </el-tooltip>

          <el-tooltip :open-delay="300" v-for="(val,ind) in actionShowList" :key="ind+'animation'" placement="top">
            <div slot="content" style="cursor: pointer" @click="previewAction(val)">
              <i style="font-size: 24px" class="el-icon-video-play"></i>
            </div>
            <el-button class="actionBtn" size="small" @click="addAction(val)">
              {{val.label}}
            </el-button>
          </el-tooltip>


        </div>
      </div>
    </w-textarea>
<!--    <div style="color: white" v-html="testData"></div>-->
    <div id="newDom" style="display: none"></div>
    <div id="oldDom" style="display: none"></div>
    <div style="display: none">
      <video id="videoDuration" :src="ruleForm.videoUrl"></video>
    </div>
    <el-dialog  top="30vh" :visible.sync="isShowDelDialog" width='30%' style='text-align:center;'>
      <i class="el-icon-warning-outline" style='font-size:42px;color:#7455FF;margin-bottom:18px;font-weight:600;'></i>
      <div>是否删除第{{confrimDelInd+1}}段内容？</div>
      <span slot="footer" class="dialog-footer">
                    <el-button class="cancel" @click="cancelDel">取 消</el-button>
                    <el-button class="confirm" type="primary" @click="confirmDel">确 定</el-button>
                </span>
    </el-dialog>
  </div>
</template>

<script>
  import { ExportMessage, NodeToString } from '../../packages/textarea/exportMessage'
  import { mapGetters } from "vuex";
  import vText from './tag/text'
  import vVideo from './tag/video'
  import vImg from './tag/img'
  import { AMSound } from '../../sound/sound';

  export default {
    computed: {
      ...mapGetters([
        'ResultJson',
        'InfoModelData',

      ])
    },
    filters:{
      indFilter(val){
        if((val+1).toString().length===1){
          return '0'+(val+1)
        }else{
          return val+1;
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
      vText,
      vVideo,
      vImg,
    },
    props:{
      TriggerDiv:Array,
      editJsonData:Object
    },
    data() {
      return {
        ScriptList:[],
        scriptIndex:0,
        scriptIndexOld:0,
        confrimDelInd:'',
        isShowDelDialog:false,

        actionShowList:[],
        actionLoading:true,
        testData:'',
        intervalValue:0.5,//间隔时间

        textForm:{
          dismissTimeType:2,
          text:"测试字体",
          textColor:"#333333",
          region:"1",
          fontFamily:"SimHei",
          textSize:'14',
          gravity:"center",
          ellipsize:false,
          dismissTime:3,
          isAll:false,
          leave:"",//出场
          enter:""//入场
        },
        ruleForm:{
          region:'1',//展示区域
          dismissTimeType:2,//播放时间的方式
          dismissTime:3,
          videoUrl:'',
          videoName:'',
          isAll:false,
          isSupportAudio:false,
          leave:"",//出场
          enter:""//入场
        },
        imgForm:{
          region:'1',//展示区域
          dismissTimeType:2,//播放时间的方式
          dismissTime:3,
          isAll:false,
          url:'',
          name:'',
          leave:"",//出场
          enter:""//入场
        },

        videoVisible:false,
        imgVisible:false,
        timerVisible: false,
        textVisible:false,

        editTagId:'',//是否是再次编辑

        cutTxtArr:[],//每次裁剪后被替换的缓存数据
        cutArr:[],//裁剪数据的缓存区
        cutCount:50,//裁剪的基准长度,即文字暂定50字后第一个标点（，。！？.....等）的分层

        previewReady:true,

        scriptChangeState:false,
        scriptChangeTimeout:'',

        dropdownData:[
          {label:"上移",value:'1',icon:"el-icon-caret-top"},
          {label:"下移",value:'2',icon:'el-icon-caret-bottom'},
          {label:"置顶",value:'3',icon:'el-icon-top'},
          {label:"置底",value:'4',icon:'el-icon-bottom'},
          {label:"插入",value:'5',icon:'el-icon-circle-plus-outline'},
          {label:"删除",value:'6',icon:'el-icon-delete'},
        ],
      };
    },
    created() {
      window.WebActionInfo= this.WebActionInfo
      window.WebSelectAvatarState = this.WebSelectAvatarState
    },
    mounted() {
      let self = this;
      //删除标签
      window.editTag = function(id){
        let domObj = JSON.parse(document.getElementById(id).dataset.obj)
        console.log('editTag',id,domObj)
        let _data;
        if(domObj.type==="image"){
          self.imgForm.region = domObj.region;
          domObj.isAll? self.imgForm.dismissTimeType = 1: self.imgForm.dismissTimeType = 2;
          self.imgForm.url = domObj.url;
          self.imgForm.name = domObj.name;
          self.imgForm.dismissTime = domObj.time/1000;
          self.imgForm.isAll=domObj.isAll;
          self.imgForm.enter=domObj.enter;
          self.imgForm.leave=domObj.leave;
          self.videoVisible = false;
          self.imgVisible = true;
          self.editTagId= domObj.id;
          self.$nextTick(()=>{
            self.$refs.imgDom.cleanTempList(domObj)
          })
          _data={
            type:'image',
            name:domObj.name,
            time: domObj.time,
            url:domObj.url,
            region:domObj.region,
            isAll:domObj.isAll,
            id:domObj.id,
            enter:domObj.enter,
            leave:domObj.leave
          }
          UnityEditTag(JSON.stringify(_data),'False')
        }else if(domObj.type==="video"){
          domObj.isAll? self.ruleForm.dismissTimeType = 1: self.ruleForm.dismissTimeType = 2;
          self.ruleForm.videoUrl = domObj.url;
          self.ruleForm.videoName = domObj.name;
          self.ruleForm.region = domObj.region;
          self.ruleForm.dismissTime = domObj.time/1000;
          self.ruleForm.isAll=domObj.isAll;
          self.ruleForm.isSupportAudio=domObj.isSupportAudio;
          self.ruleForm.enter=domObj.enter;
          self.ruleForm.leave=domObj.leave;
          self.videoVisible = true;
          self.imgVisible = false;
          self.editTagId= domObj.id;
          self.$nextTick(()=>{
            self.$refs.videoDom.cleanTempList(domObj)
          })
           _data={
            type:'video',
            name:domObj.name,
            time:domObj.time,
            url: domObj.url,
            isSupportAudio:self.ruleForm.isSupportAudio,
            region:self.ruleForm.region,
            isAll:self.ruleForm.isAll,
            id:domObj.id,
            enter:self.ruleForm.enter,
            leave:self.ruleForm.leave
          };
          UnityEditTag(JSON.stringify(_data),'False')
        }else if(domObj.type==="text"){
          self.textVisible = true;
          self.editTagId= domObj.id;
          self.$nextTick(()=>{
            domObj.isAll? self.textForm.dismissTimeType = 1: self.textForm.dismissTimeType = 2;
            self.textForm.fontFamily = domObj.fontFamily;
            self.textForm.text = domObj.text;
            self.textForm.textColor = domObj.textColor;
            self.textForm.region = domObj.region;
            self.textForm.textSize = domObj.textSize;
            self.textForm.gravity = domObj.gravity;
            self.textForm.ellipsize = domObj.ellipsize;
            self.textForm.dismissTime = domObj.dismissTime/1000;
            self.textForm.isAll = domObj.isAll;
            self.textForm.enter=domObj.enter;
            self.textForm.leave=domObj.leave;
          })
          _data={
            type:'text',
            text:domObj.text,
            textColor:domObj.textColor,
            region:domObj.region,
            textSize:domObj.textSize,
            gravity:domObj.gravity,
            ellipsize:domObj.ellipsize,
            dismissTime:domObj.dismissTime,
            fontFamily:domObj.fontFamily,
            isAll:domObj.isAll,
            id:domObj.id,
            enter:domObj.enter,
            leave:domObj.leave
          }
          UnityEditTag(JSON.stringify(_data),'False')
        }
      }
      //编辑的数据
      if(this.editJsonData.data){
        let resArr  = this.editJsonData.data
        UnityMessage(JSON.stringify(resArr[0].unityMessage),"True")
        UnityChangeAvatar(resArr[0].avatar.unity);
        this.$store.commit('set_avatarName',{name:resArr[0].avatar.unity,chName:this.editJsonData.avatarName})
      }else{
        UnityAvatarMotionInfo(this.ResultJson.avatar.unity);
      }
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
      //更多操作
      handleCommand(ind,proto){
        switch (proto) {
          case "1":
            this.moveUp(ind);
            break;
          case "2":
            this.moveDown(ind);
            break;
          case "3":
            this.toFirst(ind);
            break;
          case "4":
            this.toLast(ind);
            break;
          case "5":
            this.insertBtn(ind)
            break;
          case "6":
            this.delBtn(ind)
            break;
        }
      },
      //上移
      moveUp(ind){
        if(ind){
          if(this.scriptIndex === ind){
            this.scriptIndex = ind-1
            this.scriptIndexOld = this.scriptIndex;
          }
          this.ScriptList[ind] = JSON.parse(JSON.stringify(this.ScriptList.splice(ind-1,1,this.ScriptList[ind])[0]))
        }else{
          this.$message.warning('已至最高层')
        }
      },
      //下移
      moveDown(ind){
        if(ind!==this.ScriptList.length-1){
          if(this.scriptIndex === ind){
            this.scriptIndex = ind+1
            this.scriptIndexOld = this.scriptIndex;
          }
          this.ScriptList[ind] = JSON.parse(JSON.stringify(this.ScriptList.splice(ind+1,1,this.ScriptList[ind])[0]))
        }else{
          this.$message.warning('已至最底层')
        }
      },
      //置顶
      toFirst(ind){
        if(ind){
          if(this.scriptIndex === ind){
            this.scriptIndex = 0;
            this.scriptIndexOld = this.scriptIndex;
          }
          this.ScriptList.unshift(this.ScriptList.splice(ind , 1)[0]);
        }else{
          this.$message.warning('已至最高层')
        }
      },
      //置底
      toLast(ind){
        if(ind!==this.ScriptList.length-1){
          if(this.scriptIndex === ind){
            this.scriptIndex = this.ScriptList.length-1
            this.scriptIndexOld = this.scriptIndex;
          }
          this.ScriptList.push(this.ScriptList.splice(ind , 1)[0]);
        }else{
          this.$message.warning('已至最底层')
        }
      },
      //插入
      insertBtn(ind){
        if(this.scriptIndex>ind){
          this.scriptIndex+=1;
          this.scriptIndexOld = this.scriptIndex;
        }
        this.ScriptList.splice(ind,1,JSON.parse(JSON.stringify(this.ScriptList[ind])),JSON.parse(JSON.stringify(this.ResultJson)))
      },
      //删除
      delBtn(ind){
        this.isShowDelDialog = true;
        this.confrimDelInd = ind;

      },
      cancelDel() {
        this.isShowDelDialog = false;
      },
      confirmDel() {
        this.isShowDelDialog = false;
        let ind = this.confrimDelInd;
        if(this.scriptIndex===ind){
          if(ind){
            this.scriptIndex-=1
            this.$emit('editImportTriggerDiv',this.ScriptList[this.scriptIndex])
            this.editImport(this.ScriptList[this.scriptIndex]);
          }else{
            this.$emit('editImportTriggerDiv',this.ScriptList[this.scriptIndex+1])
            this.editImport(this.ScriptList[this.scriptIndex+1]);
          }
          this.scriptIndexOld = this.scriptIndex;
        }else if(this.scriptIndex>ind){
          this.scriptIndex-=1
          this.scriptIndexOld = this.scriptIndex;
        }
        this.ScriptList.splice(ind,1);
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
          UnityPreview(val.avatar.unity,JSON.stringify([val]),"True","False")
        }else{
          this.exportJson().then((data)=>{
            let _jsonArr = JSON.parse(JSON.stringify(this.ResultJson))
            _jsonArr.param = data.param

            _jsonArr.param.forEach(value=>{
              _content += value.content;
            })
            if(_jsonArr.param.length===0 || !_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
              this.$message.error('请确认当前段落含有有效文字！')
              return false
            }
            UnityPreview(val.avatar.unity,JSON.stringify([_jsonArr]),"True","False")

            console.log( this.cutTxtArr,this.cutArr)
          })
        }
        this.previewReady = false;
      },
      //动作回调返回列表
      WebActionInfo(val){
        this.actionShowList = [];
        let labelData = val.split('-')[0].split(',')
        labelData.pop()
        let valueData = val.split('-')[1].split(',')
        valueData.pop()
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
        if(this.editJsonData.data){
          let resArr  = this.editJsonData.data
          this.$store.commit('set_avatarName',{name:resArr[0].avatar.unity,chName:this.editJsonData.avatarName})
          this.ScriptList = JSON.parse(JSON.stringify(this.editJsonData.data))
          this.$nextTick(()=>{
            this.editImport(this.ScriptList[0]);
          })
          this.$forceUpdate()
        }else{
          this.ScriptList[0] = JSON.parse(JSON.stringify(this.ResultJson))
          this.$forceUpdate()
        }
      },
      WebSelectAvatarState(state){
        if(state==='True'){
          UnityAvatarMotionInfo(this.ResultJson.avatar.unity);
        }else if(state==='False'){
          this.$message.error('切换角色失败，请重试')
          // this.previewReady = false;
        }
      },
      WebPreviewReady(state){
        if(state==='True'){
          UnityPreviewStart(this.ResultJson.avatar.unity);
        }else if(state==='False'){
          this.$message.error('加载资源失败，请重试')
        }
        this.previewReady = true;
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
        this.ScriptList[this.ScriptList.length] = JSON.parse(JSON.stringify(this.ResultJson))
        this.exportJson().then(data=>{
          self.ScriptList[self.scriptIndex].param = JSON.parse(JSON.stringify(data.param))
          self.scriptIndex = this.ScriptList.length-1;
          self.scriptIndexOld = self.scriptIndex;
          self.$emit('editImportTriggerDiv',self.ScriptList[self.scriptIndex])
          self.editImport(self.ScriptList[self.scriptIndex]);
          self.$nextTick(()=>{
            document.querySelector("#model"+self.scriptIndex).scrollIntoView(true);
          })
        })
        this.$forceUpdate()
      },
      //预览动作
      previewAction(val){ UnityAvatarAction(this.ResultJson.avatar.unity,val.value) },
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
          //🌟🌟🌟🌟🌟第一步，统计总文本；推入间隔标签；推入互动标签
          if(param.intervalTime){
            positionTag.push({
              time:param.intervalTime,
              type:"interval",
              index:contentBD.length,
              id:self.getGuid()
            })
          }
          if(param.interaction){
            if(param.interaction.isSupport){
              positionTag.push({
                isSupport:param.interaction.isSupport,
                maximum:param.interaction.maximum,
                type:"interaction",
                index:contentBD.length,
                id:self.getGuid()
              })
            }
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
            // if(!val.index){
            //   txtInd = 0
            // }
            if(val.type==="info"){
              if(val.info.child[0].type==="image"){
                positionTag.push({
                  index:txtInd,
                  time:val.info.dismissTime,
                  type:"image",
                  region:val.info.child[0].region,
                  name:val.info.child[0].name,
                  url:val.info.child[0].url,
                  id:val.info.child[0].id,
                  isAll:val.isAll,
                  enter:val.info.child[0].animate!==undefined ? val.info.child[0].animate.enter : "",
                  leave:val.info.child[0].animate!==undefined ? val.info.child[0].animate.leave : "",
                })
              }else if(val.info.child[0].type==="video"){
                positionTag.push({
                  index:txtInd,
                  time:val.info.dismissTime,
                  type:"video",
                  region:val.info.child[0].region,
                  name:val.info.child[0].name,
                  isSupportAudio:val.info.child[0].isSupportAudio,
                  url:val.info.child[0].url,
                  id:val.info.child[0].id,
                  isAll:val.isAll,
                  enter:val.info.child[0].animate!==undefined ? val.info.child[0].animate.enter : "",
                  leave:val.info.child[0].animate!==undefined ? val.info.child[0].animate.leave : "",
                })
              }else if(val.info.child[0].type==="text"){
                positionTag.push({
                  index:txtInd,
                  type:"text",
                  id:val.info.child[0].id,
                  text: val.info.child[0].text,
                  textColor: val.info.child[0].textColor,
                  textSize: val.info.child[0].textSize,
                  gravity: val.info.child[0].gravity,
                  region: val.info.child[0].region,
                  ellipsize:val.info.child[0].ellipsize,
                  dismissTime:val.info.dismissTime*1000,
                  isAll:val.isAll,
                  fontFamily:val.info.child[0].fontFamily || "SimHei",
                  enter:val.info.child[0].animate!==undefined ? val.info.child[0].animate.enter : "",
                  leave:val.info.child[0].animate!==undefined ? val.info.child[0].animate.leave : "",
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
            let _data = JSON.stringify({type:'image',name:val.name,time:val.time,url:val.url,id:val.id,isAll:val.isAll,region:val.region,enter:val.enter,leave:val.leave}).replace(/"/g,"&quot;")
            let _time = val.time/1000+'s';
            if(val.isAll){
              _time = 'all'
            }
            let _imageDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="tag_image tagtag" onclick="editTag(\``+val.id+`\`)">图片`+val.name+' ('+_time+`)<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i></div>&nbsp;</wise>`
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
            let _data = JSON.stringify({type:'video',name:val.name,time:val.time,url:val.url,id:val.id,isAll:val.isAll,region:val.region,enter:val.enter,leave:val.leave,isSupportAudio:val.isSupportAudio}).replace(/"/g,"&quot;")
            let _time = val.time/1000+'s';
            if(val.isAll){
              _time = 'all'
            }
            let _videoDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="tag_video tagtag" onclick="editTag(\``+val.id+`\`)">视频`+val.name+' ('+_time+`)<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i></div>&nbsp;</wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _videoDom
            }else{
              // contentBDArr[val.index]=_videoDom+contentBDArr[val.index]
              let _txt = contentBDArr[val.index].split('')
              _txt.splice(_txt.length-1,1,_videoDom+_txt[_txt.length-1]);
              contentBDArr[val.index] = _txt.join('');
            }
          }else if(val.type==="text"){
            let _time = val.dismissTime/1000+'s';
            if(val.isAll){
              _time = 'all'
            }
            let _data = JSON.stringify({type:'text',text:val.text,textColor:val.textColor,textSize:val.textSize,id:val.id,gravity:val.gravity,region:val.region,ellipsize:val.ellipsize,isAll:val.isAll,dismissTime:val.dismissTime,fontFamily:val.fontFamily,enter:val.enter,leave:val.leave}).replace(/"/g,"&quot;")
            let _textDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="tag_text tagtag" onclick="editTag(\``+val.id+`\`)">文字`+ ' ('+_time+`)<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i></div>&nbsp;</wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _textDom
            }else{
              // contentBDArr[val.index]=_videoDom+contentBDArr[val.index]
              let _txt = contentBDArr[val.index].split('')
              _txt.splice(_txt.length-1,1,_textDom+_txt[_txt.length-1]);
              contentBDArr[val.index] = _txt.join('');
            }
          }else if(val.type==="action"){
            let _data = JSON.stringify({id:val.id, type:'action', actionName:val.actionName}).replace(/"/g,"&quot;")
            let _actionName = '';
            self.actionShowList.forEach(act=>{if(act.value===val.actionName){ _actionName = act.label}})
            let _actionDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="tag_action tagtag" onclick="editTag(\``+val.id+`\`)">`+_actionName+`<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i></div>&nbsp;</wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _actionDom
            }else{
              // contentBDArr[val.index]=_actionDom+contentBDArr[val.index]
              let _txt = contentBDArr[val.index].split('')
              _txt.splice(_txt.length-1,1,_actionDom+_txt[_txt.length-1]);
              contentBDArr[val.index] = _txt.join('');
            }
          }else if(val.type==="interval"){
            let _data = JSON.stringify({id:self.getGuid(),type:'interval', time:val.time}).replace(/"/g,"&quot;")
            let _intervalDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="tag_interval tagtag" onclick="editTag(\``+val.id+`\`)">间隔(`+val.time/1000+`s)<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i></div>&nbsp;</wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _intervalDom
            }else{
              // contentBDArr[val.index]=_intervalDom+contentBDArr[val.index]
              let _txt = contentBDArr[val.index].split('')
              _txt.splice(_txt.length-1,1,_intervalDom+_txt[_txt.length-1]);
              contentBDArr[val.index] = _txt.join('');
            }
          }else if(val.type==="interaction"){
            let _data = JSON.stringify({id:self.getGuid(),type:'interaction', maximum:val.maximum,isSupport:val.isSupport}).replace(/"/g,"&quot;")
            let _intervalDom = `<wise id="`+val.id+`" data-obj="`+_data+`"><div class="tag_interaction tagtag" onclick="editTag(\``+val.id+`\`)">互动<i class="el-icon-close" onclick="delTag(\``+val.id+`\`)"></i></div>&nbsp;</wise>`
            if(contentBDArr[val.index]===undefined){
              contentBDArr[val.index] = _intervalDom
            }else{
              let _txt = contentBDArr[val.index].split('')
              _txt.splice(_txt.length-1,1,_intervalDom+_txt[_txt.length-1]);
              contentBDArr[val.index] = _txt.join('');
            }
          }
        })
        // console.log('contentBDArrcontentBDArr',contentBDArr)
        this.testData=contentBDArr.join('');
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
          ExportMessage(this.testData).then(res=>{
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
              if(msg.datasetObj.type==="image"||msg.datasetObj.type==="video"||msg.datasetObj.type==="text"){
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
              }else if(msg.datasetObj.type==='interval'||msg.datasetObj.type==='interaction'){
                _intervalMessage.push(msg)
              }
            })
            //✨✨✨✨第一步文本数据分组
            let intervalArr= [{
              content:'',
              intervalTime: 0,
              interaction:{
               isSupport: false,
               maximum:10
              }
            }];//intervalArr间隔标签分段的文本数组
            _intervalMessage.forEach((val,ind)=>{
              intervalArr.push({
                content:'',
                intervalTime: 0,
                interaction:{
                  isSupport: false,
                  maximum:10
                }
              })
              intervalArr[ind].content = res.noTagText.slice(0,val.index);
              // intervalArr[ind+1].intervalTime = val.datasetObj.time
              if(val.datasetObj.type==='interval'){
                intervalArr[ind+1].intervalTime = val.datasetObj.time
              }else if(val.datasetObj.type==='interaction'){
                intervalArr[ind+1].interaction.isSupport = val.datasetObj.isSupport
                intervalArr[ind+1].interaction.maximum = val.datasetObj.maximum
              }
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
            console.log('裁剪数据区',this.cutArr)
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
                if(dom.datasetObj.id===val.info.child[0].id){
                  val.index = dom.index;
                }
              })
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

            //content数据整合——去除无效content；合并无效字符
            let _params = JSON.parse(JSON.stringify(exoprtParams));
            let _params2= [];
            let _intervalTime=0;
            let _isSuport = false;
            let invalidContent = '';//无效字符
            _params.forEach((val,ind)=>{
              if(!val.content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
                _intervalTime += val.intervalTime
                if(!_isSuport){_isSuport = val.interaction.isSupport}
                invalidContent += val.content
              }else {
                val.content = invalidContent + val.content
                val.intervalTime += _intervalTime
                if(val.interaction.isSupport || _isSuport){//相连的两个互动标签期间无有效字符会只保留一个
                  val.interaction.isSupport = true;
                }
                _params2.push(val)
                _intervalTime = 0;
                _isSuport = false;
                invalidContent = '';
              }
            })
            exoprtParams = JSON.parse(JSON.stringify(_params2));
            console.log('输出param2',exoprtParams)
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
          intervalTime:0,
          interaction:{
            isSupport: false,
            maximum:10
          }
        })
        if(content.length>this.cutCount){
          this.cutTxt(content);
        }else{
          if(content.length){
            this.cutTxtArr.push({
              content:content.join(''),
              intervalTime:0,
              interaction:{
                isSupport: false,
                maximum:10
              }
            })
          }
        }
      },
      //递归计数返回裁剪后的json的content数组数据
      cutIntervalArr(arr){
        this.cutTxtArr = []
        this.cutTxt(arr[0].content.split(''))
        this.cutTxtArr[0].intervalTime = arr[0].intervalTime;
        this.cutTxtArr[0].interaction.isSupport = arr[0].interaction.isSupport;
        this.cutTxtArr[0].interaction.maximum = arr[0].interaction.maximum;
        this.cutTxtArr.unshift(0, 1);
        Array.prototype.splice.apply(arr, this.cutTxtArr);
        this.cutArr.push(arr);
      },

      handleAddVideo(){
        if(!this.InfoModelData.length){
          this.$message.error('请先添加展示位')
          return
        }
        this.videoVisible = true;
        this.timerVisible = false;
        this.editTagId = "";
        this.$nextTick(() => {
          this.ruleForm = {
            region: "1",
            dismissTimeType: 2,
            dismissTime: 3,
            videoUrl: '',
            videoName: "",
            enter: "",
            leave: "",
            isAll: false,
            isSupportAudio: false
          }
          this.$refs.videoDom.cleanTempList()
        })
      },
      handleAddImage(){
        if(!this.InfoModelData.length){
          this.$message.error('请先添加展示位')
          return
        }
        this.imgVisible = true;
        this.editTagId = "";
        this.timerVisible = false;
        this.$nextTick(() => {
          this.imgForm = {
            region: "1",
            dismissTimeType: 2,
            dismissTime: 3,
            url: '',
            name: "",
            enter: "",
            leave: "",
            isAll: false
          }
          this.$refs.imgDom.cleanTempList()
        })
      },
      handleAdd (type) {
        switch (type) {
          case "video":
            this.handleAddVideo();
            break;
          case 'img':
            this.handleAddImage();
            break;
          case 'interaction':
            this.addInteraction();
            break;
          case 'clean':
            ExportMessage(this.testData).then(res=>{
              this.testData = res.noTagText
              this.$emit('cleanTriggerDiv')
            })
            break;
          case 'intervalTime':
            this.timerVisible = true;
            break;
          case 'text':
            if(!this.InfoModelData.length){
              this.$message.error('请先添加展示位')
              return
            }
            this.textVisible = true;
            this.editTagId = "";
            this.$nextTick(()=>{
              this.textForm = {
                text:"",
                textColor:"#333333",
                region:"1",
                textSize:'14',
                gravity:"center",
                fontFamily:"SimHei",
                ellipsize:false,
                dismissTimeType:2,
                dismissTime:3,
                isAll:false,
                enter:"",
                leave:""
              }
            })
            break;
        }
      },
      //添加互动标签
      addInteraction(){
        let self = this;
        let _id=this.getGuid()
        let _data = {
          type:'interaction',
          isSupport:true,
          maximum:10,
          id:_id
        }
        let _text =  `<div class="tag_interaction tagtag" onclick="editTag(\``+_id+`\`)">互动<i class="el-icon-close" onclick="delTag(\``+_id+`\`)"></i>&nbsp;</div>`
        this.$refs.testText.addTag(_text,_data)
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
          let _text =  `<div class="tag_interval tagtag" onclick="editTag(\``+_id+`\`)">间隔(`+self.intervalValue+`s)<i class="el-icon-close" onclick="delTag(\``+_id+`\`)"></i>&nbsp;</div>`
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
        let _text =  `<div class="tag_action tagtag" onclick="editTag(\``+_id+`\`)">`+val.label+`<i class="el-icon-close" onclick="delTag(\``+_id+`\`)"></i>&nbsp;</div>`
        this.$refs.testText.addTag(_text,_data)
      },

      cancelBtn(type){
        switch (type) {
          case 'text':
            this.textVisible = false;
            break;
          case 'img':
            this.imgVisible = false;
            break;
          case 'video':
            this.videoVisible = false;
            break;
        }
      },
      //弹框确定
      confrimBtn(type,data){
        let tagDom;
        if(this.editTagId){tagDom =document.getElementById(this.editTagId);}
        let _data,_text,_time,_id;
        this.editTagId?_id = this.editTagId:_id = this.getGuid();
        switch (type) {
          case 'text':
            if (!data.text.replace(/ /g, '')) {
              this.$message.error('请输入文字')
              return false;
            }
            _data = {
              type: 'text',
              text: data.text,
              textColor: data.textColor,
              region: data.region,
              textSize: data.textSize,
              gravity: data.gravity,
              ellipsize: data.ellipsize,
              dismissTime: data.dismissTime * 1000,
              isAll: data.isAll,
              fontFamily: data.fontFamily,
              id: _id,
              enter: data.enter,
              leave: data.leave
            }
            _time = data.dismissTime + 's';
            if (data.isAll) {
              _time = 'all'
            }
            _text = `<div class="tagtag tag_text" onclick="editTag(\`` + _id + `\`)">文字` + ' (' + _time + `)<i class="el-icon-close" onclick="delTag(\`` + _id + `\`)"></i>&nbsp;</div>`
            if (this.editTagId) {
              UnityEditTag(JSON.stringify(_data),'True')
              let _oldTag = NodeToString(document.getElementById(_id)).replace("<", "<").replace(">", ">");
              tagDom.dataset.obj = JSON.stringify(_data)
              tagDom.innerHTML = _text;
              let _newTag = NodeToString(document.getElementById(_id)).replace("<", "<").replace(">", ">");
              this.testData = this.testData.replace(_oldTag, _newTag);
            } else {
              UnityInsertTag(JSON.stringify(_data))
              this.$refs.testText.addTag(_text, _data)
            }
            this.editTagId = "";
            this.$emit('addDisplay', _data)
            this.textVisible = false;
            break;

          case 'video':
            if (!data.videoUrl) {
              this.$message.error('请先上传文件')
              return
            }
            if (!data.dismissTime) {
              this.$message.error('请确认呈现时间')
              return
            }
            _data = {
              type: 'video',
              name: data.videoName,
              time: data.dismissTime * 1000,
              url: data.videoUrl,
              isSupportAudio: data.isSupportAudio,
              region: data.region,
              isAll: data.isAll,
              id: _id,
              enter: data.enter,
              leave: data.leave
            }
            _time = data.dismissTime + 's';
            if (data.isAll) {
              _time = 'all'
            }
            _text = `<div class="tagtag tag_video" onclick="editTag(\`` + _id + `\`)">视频` + data.videoName + ` (` + _time + `)<i class="el-icon-close" onclick="delTag(\`` + _id + `\`)"></i>&nbsp;</div>`
            if (this.editTagId) {
              UnityEditTag(JSON.stringify(_data),'True')
              let _oldTag = NodeToString(document.getElementById(_id)).replace("<", "<").replace(">", ">");
              tagDom.dataset.obj = JSON.stringify(_data)
              tagDom.innerHTML = _text;
              let _newTag = NodeToString(document.getElementById(_id)).replace("<", "<").replace(">", ">");
              this.testData = this.testData.replace(_oldTag, _newTag);
            } else {
              UnityInsertTag(JSON.stringify(_data))
              this.$refs.testText.addTag(_text, _data)
            }
            this.editTagId = "";
            this.$emit('displayVideoUrl', _data)
            this.videoVisible = false;
            break;

          case 'img':
            if (!data.url) {
              this.$message.error('请先上传文件')
              return
            }
            if (!data.dismissTime) {
              this.$message.error('请确认呈现时间')
              return false;
            }
            _data = {
              type: 'image',
              name: data.name,
              time: data.dismissTime * 1000,
              url: data.url,
              region: data.region,
              isAll: data.isAll,
              id: _id,
              enter: data.enter,
              leave: data.leave
            }
            _time = data.dismissTime + 's';
            if (data.isAll) {
              _time = 'all'
            }
            _text = `<div class="tagtag tag_image" onclick="editTag(\`` + _id + `\`)">图片` + data.name + ` (` + _time + `)<i class="el-icon-close" onclick="delTag(\`` + _id + `\`)"></i>&nbsp;</div>`
            if (this.editTagId) {
              UnityEditTag(JSON.stringify(_data),'True')
              let _oldTag = NodeToString(document.getElementById(_id)).replace("<", "<").replace(">", ">");
              tagDom.dataset.obj = JSON.stringify(_data)
              tagDom.innerHTML = _text;
              let _newTag = NodeToString(document.getElementById(_id)).replace("<", "<").replace(">", ">");
              this.testData = this.testData.replace(_oldTag, _newTag);
            } else {
              UnityInsertTag(JSON.stringify(_data))
              this.$refs.testText.addTag(_text, _data)
            }
            this.$emit('displayImgUrl', _data)
            this.imgVisible = false;
            this.editTagId = "";
            break;
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
  /deep/.el-dialog__body {
    padding: 25px 20px 5px!important;
  }
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
  .timerDialog {
    position: absolute;
    top: -200px;
    left: 196px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }

  .tagBox{
    background: #E3E5ED;
    position: relative;
  }
  .interval-tag{
    position: absolute;
    top: -44px;
    right: 355px;
  }
  .actionTitle{
    display: inline-block;
    background: #A2ACD3;
    color: #fff;
    font-size: 13px;
    border-radius: 3px;
    height: 26px;
    margin: 5px;
    line-height: 26px;
    text-align: center;
    // border: 2px solid #658f96;
    font-weight: 600;
    width: 100px;
    letter-spacing: 1px;
    cursor: help;
  }
  .actionBtn{
    font-weight: 400;
    margin: 5px;
    padding: 6px;
    font-size: 12px;
    &:hover{
      background: #8D89DE;
      color: #FFFFFF;
      border: 1px solid #8D89DE;
    }
  }
  .dialogBtn{
    font-size: 12px;
    margin-top: 18px;
    display: inline-block;
    line-height: 1;
    padding: 5px 8px;
    margin-right: 8px;
    height: 33px;
    width: 78px;
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
    background: #7694f3;
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
    z-index: 999;
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
        .moremore{
          cursor: pointer;
          padding: 1.5px;
          margin-top: 1px;
          color: #FFFFFF;
          background: #999999;
          transition: all .3s;
          &:hover{
            background: #bfbfbf;
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
