<template>
  <div class="loadBox">
      <p class="title">The script is being saved. Please don't leave..</p>
    <div class="content clearfix" v-for="(val,ind) in loadData" :key="ind">
      <p class="float_left">{{val.label}}</p>
      <i style="position: relative;top: 4px" v-show="val.state==='loading'" class="el-icon-loading float_right"></i>
      <img v-show="val.state==='success'" class="float_right" src="../../../../static/icon/loadright.png" alt="">
      <img v-show="val.state==='error'" class="float_right" src="../../../../static/icon/loaderr.png" alt="">
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      LOADING:Number,
    },
    data(){
      return{
        loadData:[
          {
            label:'1、解析文本内容，生成数据文件',
            state:"loading",
          },
          {
            label:'2、上传数据',
            state:"",
          },
          {
            label:'3、请求TTS语音数据',
            state:"",
          },
          {
            label:'4、保存成功',
            state:"",
          },
        ],
        loadDataCopy:[
          {
            label:'1、解析文本内容，生成数据文件',
            state:"loading",
          },
          {
            label:'2、上传数据',
            state:"",
          },
          {
            label:'3、请求TTS语音数据',
            state:"",
          },
          {
            label:'4、保存成功',
            state:"",
          },
        ]
      }
    },
    mounted() {
      this.loadData = JSON.parse(JSON.stringify(this.loadDataCopy))
    },
    watch:{
      LOADING(val){
        switch (val) {
          case 1:
          this.loadData[0].state = "loading";
          break;
          case 2:
            this.loadData[0].state = "success";
            this.loadData[1].state = "loading";
            break;
          case 3:
            this.loadData[1].state = "success";
            this.loadData[2].state = "loading";
            break;
          case 4:
            this.loadData[2].state = "success";
            this.loadData[3].state = "loading";
            break;
          case 5:
            this.loadData[3].state = "success";
            break;
          case 51:
            this.loadData[3].state = "error";
            break;
          default:
            this.loadData = JSON.parse(JSON.stringify(this.loadDataCopy))
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .loadBox{
    width: 421px;
    height: 250px;
    background-color: #19181b8a;
    border-radius: 8px;
    position: absolute;
    top: 21vh;
    left: calc(50% - 200px);
    z-index: 999;
    color:#fff;
    .title{
      text-align: center;
      font-size: 16px;
      margin: 30px 0 16px;
      font-weight: 500;
    }
    .content{
      font-size: 14px;
      width: 265px;
      margin: 12px auto 0;
    }
  }


</style>
