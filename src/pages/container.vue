<template>
  <div class='common_content'>
    <Mheader></Mheader>
    <div class="groupBox">
      <el-row :gutter="10">
        <el-col :span="16" style=" position: relative;">
          <JsonEditor
            ref="JsonEditorRef"
            :avatarID="avatarID"
            :TriggerDiv="TriggerDiv"
            :actionShowList="actionShowList"
            @displayImgUrl="displayImgUrl"
            @displayVideoUrl="displayVideoUrl"
            @deleteTrigger="deleteTrigger"
            @actionChange="actionChange"
            @cleanTriggerDiv="cleanTriggerDiv"
          ></JsonEditor>
        </el-col>
        <el-col :span="8" >
          <!--绿幕-->
          <div
            ref="avatarBoxRef"
            v-loading="avatarLoading"
            element-loading-text="虚拟角色载入中.."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="avatarBox"
            :style="{
                  width:avatarBox.width+'px',
                  height:avatarBox.height+'px'
                }">
            <!--                信息板-->
<!--            :aspectRatio="true"-->
            <drr
              v-for="(val,ind) in infoModelData"
              :key="ind+'info'"
              class="drr-item"
              :x="(val.left+val.width/2)*avatarBox.width"
              :y="(val.top+val.height/2)*avatarBox.height"
              :w="val.width*avatarBox.width"
              :h="val.height*avatarBox.height"
              :rotatable="false"
              :outerBound="{
                    x:avatarBox.width/2,
                    y:avatarBox.height/2,
                    w:avatarBox.width,
                    h:avatarBox.height,
                  }"
              v-on:change="react=>drrInfoChange(react,val)">
              <div class="drr-item_msg">
                <div class="m_width">
                  w:{{val.width | filterWidth}}
                </div>
                <div class="m_height">
                  h:{{val.height | filterHeight}}
                </div>
              </div>
              <div class="post-it">{{val.label}}</div>
              <div class="infoModel">
                <div v-for="(trig) in TriggerDiv" style="width: 100%;height: 100%">
                  <!--                  展示区信息匹配-->
                  <div v-if="trig.info.child[0].region===val.region" style="width: 100%;height: 100%">
                    <div v-if="trig.info.child[0].type==='image'" class="model-vit">
                      <img
                        :style="{
                          width:trig.info.width*avatarBox.width+'px',
                          height:trig.info.height*avatarBox.height+'px',
                        }"
                        :src="trig.info.child[0].url" alt="">
                    </div>
                    <div v-if="trig.info.child[0].type==='video'" class="model-vit">
                      <video width="100%" height="100%" :src="trig.info.child[0].url"></video>
                    </div>
                    <div v-if="trig.info.child[0].type==='text'"
                         class="model-vit"
                         :style="{
                          'font-size':trig.info.child[0].textSize,
                          color:trig.info.child[0].textColor,
                          'text-align':trig.info.child[0].gravity
                         }">
                      {{trig.info.child[0].text}}
                    </div>
                  </div>
                </div>
              </div>
            </drr>
            <!--avatar-->
            <Mavatar
              ref="magicsAvatar"
              :avatarID="avatarID"
              @avatarInit="avatarInit"
              :width="avatarBox.width"
              :height="avatarBox.height"></Mavatar>
<!--            <div ref="caseContent" style="width: 100%;height: 100%; position: absolute;top:0;left: 0;"></div>-->
          </div>

        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  import Mheader from '../components/header'
  import Mavatar from "../components/avatar";
  import JsonEditor from "../components/editor/JsonEditor.vue";

  import {resultJSON} from "../api/result";
  import Bus from "../api/bus";
  export default {
    filters:{
      filterWidth(val){return  Math.round(val*resultJSON.avatarBox.width)+'px'},
      filterHeight(val){return  Math.round(val*resultJSON.avatarBox.height)+'px'}
    },
    components:{
      JsonEditor,
      Mheader,
      Mavatar,
    },

    data () {
      return {
        avatarLoading:false,
        magics:'',//API实例
        actionShowList:[],

        avatarBox:{width:320,height:568},
        avatarID:4,
        imageItem:{
          "index": 0,
          "type": "info",
          "isAll": false,//是否持续到脚本结束，true为持续至脚本结束,优先级高于autoDismiss｜dismissTime
          "info": {
            "margins": {
              "left": 50,
              "top": 50,
              "right": 0,
              "bottom": 0
            },
            "autoDismiss": false,
            "dismissTime": 3000,
            "url": "",
            "width": 100,
            "height": 100,
            "child": [
              {
                "id":"",
                "name": "",
                "type": "",
                "url": "",
                "width": 1,
                "height": 1,
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
          "isAll": false,//是否持续到脚本结束，true为持续至脚本结束,优先级高于autoDismiss｜dismissTime
          "info": {
            "margins": {
              "left": 50,
              "top": 50,
              "right": 0,
              "bottom": 0
            },
            "autoDismiss": false,
            "dismissTime": 3000,
            "url": "",
            "width": 100,
            "height": 100,
            "child": [
              {
                "id":"",
                "name": "",
                "type": "",
                "url": "",
                "region":"",
                "width": 1,
                "height": 1,
                "isSupportAudio":false,
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
        TriggerDiv:[],
        //展示区信息
        infoModelData:[],//展示区数据

        isFirst:true,//是否初次加载，执行编辑来源数据
      }
    },
    created() {

    },
    mounted() {
      let self = this;
      if(this.$route.params.template_json){
        this.infoModelData = JSON.parse(this.$route.params.template_json)
        resultJSON.infoModelData = JSON.parse(this.$route.params.template_json)
      }else {
        this.infoModelData = JSON.parse(JSON.stringify(resultJSON.infoModelData))
      }

      //编辑的数据
      if(this.$route.params.data){
        let res  = this.$route.params.data
        resultJSON.resultJsonObj=JSON.parse(JSON.stringify(res))
        self.TriggerDiv = [];
        res.param.forEach(val=>{
          val.trigger.forEach(val=>{
            if(val.type==="info"){
              self.TriggerDiv.push(val)
            }
          })
        })
        resultJSON.avatarData.forEach(ava=>{
          if(ava.resourceUrlData.indexOf(res.avatar.h5)!==-1){
            resultJSON.avatarID = ava.ind;
          }
        })
      }

      this.$forceUpdate();
      this.$refs.avatarBoxRef.style.background='url('+resultJSON.resultJsonObj.background+') no-repeat';
      this.$refs.avatarBoxRef.style.backgroundSize='100% 100%';

      this.avatarID =  resultJSON.avatarID;
      resultJSON.avatarData.forEach(val=>{
        if(val.ind===this.avatarID){
          resultJSON.resultJsonObj.avatar.h5 = val.resourceUrl;
        }
      })
      this.$nextTick(()=>{
        this.initAvatar();
      })

      Bus.$on('delTag',res=>{
        this.TriggerDiv.forEach((trig,trigInd)=>{
          if(trig.info.child[0].id===res){
            this.TriggerDiv.splice(trigInd,1)
          }
        })
      })
    },
    methods:{
      //清空标签对应的dom元素
      cleanTriggerDiv(){
        this.TriggerDiv = [];
      },
      initAvatar(){
        this.avatarLoading = true
        this.$refs.magicsAvatar.initAvatar(this.avatarBox.width,this.avatarBox.height,true);
      },

      destroyRender(){
        if(this.magics.destory){
          this.magics.destory();
        }
      },
      //图片接受
      displayImgUrl(data){
        let self = this;
        let trigItem=JSON.parse(JSON.stringify(this.imageItem))
        trigItem.info.child[0].type="image"
        trigItem.isAll = data.isAll;
        trigItem.info.dismissTime=data.time;
        trigItem.info.child[0].url=data.url;
        trigItem.info.child[0].id=data.id;
        trigItem.info.child[0].region=data.region
        trigItem.info.child[0].name=data.name
        let _region;
        this.infoModelData.forEach(val=>{
          if(val.region===data.region){
            _region=JSON.parse(JSON.stringify(val))
          }
        })
        let imgObj = new Image();
        imgObj.src = data.url;
        imgObj.onload = function(){
          // 打印
          console.log('width:'+imgObj.width+',height:'+imgObj.height);
          if(_region.width*resultJSON.avatarBox.width/_region.height/resultJSON.avatarBox.height > imgObj.width/imgObj.height){
            // trigItem.info.width = _region.width;
            // trigItem.info.height = _region.width*imgObj.height/imgObj.width;
            // trigItem.info.margins.left=_region.left;
            // trigItem.info.margins.top=_region.top+_region.height/2-trigItem.info.height/2;
            trigItem.info.height=_region.height;
            trigItem.info.width = _region.height*resultJSON.avatarBox.height/imgObj.height*imgObj.width/resultJSON.avatarBox.width;
            trigItem.info.margins.top=_region.top;
            trigItem.info.margins.left=_region.left+_region.width/2-trigItem.info.width/2;
          }else if(_region.width*resultJSON.avatarBox.width/_region.height/resultJSON.avatarBox.height < imgObj.width/imgObj.height){
            // trigItem.info.width = _region.height/imgObj.height*imgObj.width;
            // trigItem.info.height=_region.height;
            // trigItem.info.margins.top=_region.top;
            // trigItem.info.margins.left=_region.left+_region.width-trigItem.info.width;
            trigItem.info.width = _region.width;
            trigItem.info.height=_region.width*resultJSON.avatarBox.width/imgObj.width*imgObj.height/resultJSON.avatarBox.height;
            trigItem.info.margins.top=_region.top+_region.height/2 - trigItem.info.height/2;
            trigItem.info.margins.left=_region.left;
          }else{
            trigItem.info.width = _region.width;
            trigItem.info.height=_region.height;
            trigItem.info.margins.top=_region.top;
            trigItem.info.margins.left=_region.left;
          }
          self.TriggerDiv.push(trigItem)
          console.log(trigItem)
        };
      },
      displayVideoUrl(data){
        let trigItem=JSON.parse(JSON.stringify(this.videoItem))
        trigItem.info.child[0].type="video";
        trigItem.isAll = data.isAll;
        trigItem.info.dismissTime=data.time;
        trigItem.info.child[0].url=data.url;
        trigItem.info.child[0].id=data.id
        trigItem.info.child[0].region=data.region
        trigItem.info.child[0].isSupportAudio=data.isSupportAudio
        trigItem.info.child[0].name=data.name
        let _region;
        this.infoModelData.forEach(val=>{
          if(val.region===data.region){
            _region=JSON.parse(JSON.stringify(val))
          }
        })
        trigItem.info.width = _region.width;
        trigItem.info.height=_region.height;
        trigItem.info.margins.top=_region.top;
        trigItem.info.margins.left=_region.left;
        this.TriggerDiv.push(trigItem)
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

      //拖动改变info展示区信息
      drrInfoChange(react,val){
        let bl ;//缩放比例
        this.infoModelData.forEach(info=>{
          if(info.region===val.region){
            bl = react.w/resultJSON.avatarBox.width/info.width;
            info.width = react.w/resultJSON.avatarBox.width;
            info.height= react.h/resultJSON.avatarBox.height;
            info.top=(react.y-react.h/2)/resultJSON.avatarBox.height;
            info.left=(react.x-react.w/2)/resultJSON.avatarBox.width;
          }
        })
        // console.log(react,bl)
        this.TriggerDiv.forEach(trig=>{
          if(trig.info.child[0].region===val.region){
            trig.info.width*=bl;
            trig.info.height*=bl;
            trig.info.margins.top*=bl;
            trig.info.margins.left*=bl;
          }
        })
      },

      //角色初始化
      avatarInit(magics,val,actionList){
        this.magics = magics;
        this.actionShowList = val;
        let self = this;
        self.avatarLoading = false;

        this.magics.setAvatarYawAngle(resultJSON.resultJsonObj.avatar.def.rotation.z);

        magics.setAvatarScale(resultJSON.resultJsonObj.avatar.def.scale);
        let jsonx = resultJSON.resultJsonObj.avatar.def.x*resultJSON.avatarBox.width
        let jsony = resultJSON.resultJsonObj.avatar.def.y*resultJSON.avatarBox.height
        magics.setAvatarScreenPt(jsonx,jsony);

        if(this.$route.params.data&&this.isFirst){
          this.isFirst = false;
          this.$nextTick(()=>{
            this.$refs.JsonEditorRef.editImport(this.$route.params.data);
          })
        }
      },
      //播放指定动作
      actionChange(val){
        this.magics.playAction(val,0);
      },
    },
    beforeDestroy(){
      if(this.magics.destory){
        this.magics.destory();
      }
    },
  }
</script>

<style lang="less" scoped>
  .common_content {
    padding: 30px 20px;
    position: relative;
  }
  .dome-title{
    margin: 10px;
    text-align: center;
    font-size: 24px;
    color: #6438b1;
    font-weight: 600;
  }
  .groupBox{
    margin: 0 auto;
  }
  .avatarBox{
    margin: 0 auto;
    background: #fff;
    /*linear-gradient(#f5fbff,#2196F3)*/
    position: relative;
    box-shadow: 0 0px 3px 1px #bceaff;
    overflow: hidden;
  }


  .model-vit{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /*.infoModel{*/
  /*  border: 1px solid #ffffff;*/
  /*  width: 100%;*/
  /*  height: 100%;*/
  /*  position: relative;*/
  /*  left: -0.5px;*/
  /*  top: -0.5px;*/
  /*  border-radius: 3px;*/
  /*  transition: all 0.5s;*/
  /*  &:hover{*/
  /*    background: rgba(44, 45, 47, 0.45);*/
  /*  }*/
  /*}*/
  .drr-item{
    z-index: 11;
    border: .5px solid #fff;
    border-radius: 4px;
    &:hover{
      border: .5px solid transparent;
      background: radial-gradient(#29a0fd85, transparent);
    }
    .drr-item_msg{
      opacity: 0;
      width: 100%;
      height: 100%;
      font-size: 12px;
      color: #fff;
      position: relative;
      z-index: 2;
      transition: all .5s;
      .m_width{
        transform: scale(.8);
        position: absolute;
        bottom: -20px;
        right: 10px;
        background: #7e59ff;
        border-radius: 3px;
        padding: 1px;
      }
      .m_height{
        transform: scale(.8);
        position: absolute;
        bottom: 10px;
        right: -45px;
        background: #7e59ff;
        border-radius: 3px;
        padding: 1px 2px;
      }
    }
    &:hover .drr-item_msg{
      opacity: 1;
    }
    .post-it{
      display: inline-block;
      height: 20px;
      background-color:#03A9F4;
      position: absolute;
      bottom: -21px;
      border-radius: 3px;
      color: #fff;
      font-size: 12px;
      width: 60px;
      text-align: center;
    }
  }

</style>
