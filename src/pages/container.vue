<template>
  <div class='common_content'>
    <Mheader></Mheader>
    <JsonEditor
      ref="JsonEditorRef"
      :TriggerDiv="TriggerDiv"
      @displayImgUrl="displayImgUrl"
      @displayVideoUrl="displayVideoUrl"
      @deleteTrigger="deleteTrigger"
      @cleanTriggerDiv="cleanTriggerDiv"
    ></JsonEditor>
  </div>
</template>

<script>
  import Mheader from '../components/header'
  import JsonEditor from "../components/editor/JsonEditor.vue";

  import {resultJSON} from "../api/result";
  import Bus from "../api/bus";
  export default {

    components:{
      JsonEditor,
      Mheader,
    },

    data () {
      return {
        imageItem:{
          "index": 0,
          "type": "info",
          "isAll": false,//是否持续到脚本结束，true为持续至脚本结束,优先级高于autoDismiss｜dismissTime
          "info": {
            "margins": {
              "left": 0,
              "top": 0,
              "right": 0,
              "bottom": 0
            },
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
                "width": 0,
                "height": 0,
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
              "left": 0,
              "top": 0,
              "right": 0,
              "bottom": 0
            },
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
                "region":"",
                "width": 0,
                "height": 0,
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
      }

      if(this.$route.params.data&&this.isFirst){
        this.isFirst = false;
        this.$nextTick(()=>{
          this.$refs.JsonEditorRef.editImport(this.$route.params.data);
        })
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
      //清空标签对应的dom元素
      cleanTriggerDiv(){
        this.TriggerDiv = [];
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
        self.TriggerDiv.push(trigItem)
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
    },
  }
</script>

<style lang="less" scoped>
  .common_content {
    padding: 30px 20px;
    position: relative;
  }
</style>
