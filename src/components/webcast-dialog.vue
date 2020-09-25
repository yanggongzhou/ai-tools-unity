<template>
  <div class="dialogBox">
    <div class="clearfix">
      <div class="selectBox float_left">
        <el-radio
          v-for="(val,ind) in ScriptList"
          :key="ind+'model'"
          @change="scriptChange"
          class="left_card"
          v-model="scriptIndex" :label="ind" border>
          <div class="left_card_item">
            <i class="left_card_icon el-icon-warning" :style="val | styleFilter"></i>
            <div class="label">{{ind | indFilter}}</div>
          </div>
        </el-radio>
      </div>
      <div class="contentBox float_left">
        <div class="content-item" v-for="(val,ind) in contentList" :key="ind+'content'">
          <div class="header clearfix">
            <div class="title float_left">第{{ind+1}}段</div>
            <div class="float_right">快捷键设置</div>
          </div>
          <p class="content">
            {{val.content}}
          </p>
        </div>
      </div>
    </div>

    <div class="footBox clearfix">
      <div class="float_left leftIcon">
        <el-row>
          <el-col :span="12">
            <div class="icon1">
              <div class="kuaijie"></div>
              <span>快捷键</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="icon2">
              <div class="huashu"></div>
              <span>临时话术</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="float_right btnBox">
        <button class='handleWebcastBtn' @click='handleWebcast'>自动播放</button>
        <button class='handleWebcastBtn' @click='handleWebcast'>停止播放</button>
        <button class='handleWebcastBtn' style="margin-left: 30px" :class="{'disabled': true}" @click='handleWebcast'>播放下一段</button>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    filters:{
      indFilter(val){
        if((val+1).toString().length===1){
          return '0'+(val+1)+'.'
        }else{
          return val+'.';
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
    data(){
      return{
        ScriptList:[{param:[{content:'44'}]},{param:[{content:'1'},{content:'2'}]}],
        scriptIndex:0,
        contentList:[{content:'1'},{content:'2'}],
        isShowAllList:false,

        playData:[],
      }
    },
    methods:{
      scriptChange(val){

      },
      handleWebcast(){

      },
      getPlayData(data){
        this.playData = JSON.parse(JSON.stringify(data))
        axios.all([
          data.forEach(val=>{
            axios.get(val.script_url).then(res=>{})
          })
        ]).then(res=>{
          console.log(res)
        })

      }
    }

  }
</script>
<style scoped lang="less">

  /deep/.el-radio{
    color: #7C53FF !important;
  }
  /deep/.el-radio.is-bordered.is-checked{
    background: #7C53FF !important;
    border-color: #7C53FF!important;
  }
  /deep/.el-radio__input.is-checked+.el-radio__label{
    color: #FFFFFF!important;
  }
.dialogBox{
  height: 536px;

}

.selectBox{
  height: 450px;
  width: 123px;
  background: #FBFAFF;
  font-size: 0;
}
.left_card{
  background: #DDD6FF!important;
  position: relative;
  z-index: 10;
  width: 100%;
  height: 40px!important;
  margin-top: 0px;
  padding: 0!important;;
  overflow: hidden;
  margin-left: 0px !important;
  margin-right: 0px !important;
  /*border: none;*/
  /*border-top: 1px solid #E87E4D;*/
  border-radius: 0px;
  display: inline-block;
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
      height: 40px;
      line-height: 40px;
      text-align: center;
    }
  }
}

.contentBox{
  width: 555px;
  height: 421px;
  margin: 28px 0 0 11px;
  .content-item{
    padding: 10px 10px 6px;
    height: 77px;
    margin-top: 12px;
    background: #FFFBF2;
    border-radius: 4px;
    border: 1px solid #FEE0C7;
    .header{
      font-size: 12px;
      font-weight: 500;
      color: #333333;
    }
    .content{
      text-align: left;
      text-indent: 20px;
      font-size: 12px;
      height: 60px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
    }
  }
}

.footBox{
  padding: 20px;
  .leftIcon{
    width: 130px;
    font-size: 12px;
    color: #A0A0A0;
    .icon1{
      .kuaijie{
        width: 30px;
        height: 30px;
        background: url(../assets/captcha.png) no-repeat;
        background-size: 100% 100%;
        margin: 0  auto;
      }
    }
    .icon2{
      .huashu{
        width: 30px;
        height: 30px;
        background: url(../assets/captcha.png) no-repeat;
        background-size: 100% 100%;
        margin: 0  auto;
      }
    }
  }
  .btnBox{

  }
}
  .handleWebcastBtn {
    width: 96px;
    height: 32px;
    margin: 0 auto;
    background: linear-gradient(166deg, #BA71FF 0%, #5648FF 100%);
    border-radius: 16px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
  }
  .disabled {
    background: #C6C6C6!important;
    cursor: no-drop;
  }
</style>
