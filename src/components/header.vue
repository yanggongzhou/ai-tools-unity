<template>
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
</template>
<script>
  import Bus from "../api/bus";
  export default {
    data(){
      let self = this;
      return{
        jsonName:'',//剧本名称
        jsonNameValidate:false,

        imgList:[],
        videoList:[],
        jsonContent:'',
      }
    },

    mounted() {
      this.jsonNameValidate = false;
      if(this.$route.params.name){
        this.jsonName = this.$route.params.name
      }
    },
    methods:{
      //预览
      previewBtn(){
        Bus.$emit('ExportJsonPreview')
      },
      jsonNameFocus(value){
        if(value.replace(/[\r\n]/g, "").replace(/\s+/g, "")&&this.jsonNameValidate){
          this.jsonNameValidate = false;
        }
      },
      //返回上一页
      backspace(){
        //创建脚本返回
        if(!this.$route.params.data){
          this.$router.push('/steper')
        }else{
          this.$router.push('/myscript')
        }
      },

      //保存
      saveBtn(type){
        if(this.jsonName.replace(/[\r\n]/g, "").replace(/\s+/g, "")){
          this.jsonNameValidate = false;
          Bus.$emit('saveBtn',this.jsonName,type)
        }else{
          this.jsonNameValidate = true;
        }
      },
    }
  }
</script>
<style lang="less" scoped>
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
