<template>
  <div class="common_content">
    <button class="backNormal" @click="$router.back()">
      <span class="_icon">< </span>
      <span>返回</span>
    </button>
    <div class="stepBox">
      <div class="step-item" :class="{'step-item1':$route.path==='/steper'}">
        <span class="count">1</span>
        <span class="label">选择主播角色</span>
        <span class="line">——————</span>
      </div>
      <div class="step-item">
        <span class="count">2</span>
        <span class="label">编辑剧本脚本</span>
      </div>
      <button class="back" @click="$router.push('/homepage')">返回首页</button>
    </div>
    <div class="step_content">
      <div class="step1_content">
        <div class="step1_case">
          <div class="label">主播角色</div>
          <el-radio
            @change="radioChange"
            class="step1_card"
            v-for="(val,ind) in radioData"
            :key="ind+'model'"
            v-model="avatarID" :label="val.ind" border>
            <div class="step1_card_item">
              <img :src="val.img" alt="">
              <div class="label">{{val.name}}</div>
            </div>
          </el-radio>
        </div>

        <div class="clearfix">
          <button class="next_btn next_btn2 float_right" @click="nextBtn">进入剧本编辑</button>
          <button class="next_btn next_btn1 float_right" @click="backTo">上一步</button>
        </div>

      </div>
    </div>

  </div>
</template>
<script>

  import {resultJSON} from "../api/result";
  // import {requestServices} from "../api/api";
  export default {
    data(){
      return{
        that:this,
        step:1,
        avatarID:4,
        radioData:[],
      }
    },

    created() {
      // requestServices.getAllAvatars({
      //   user_id:this.$root.ai_user_id,
      //   access_token:this.$root.ai_user_token,
      //   isAll:1
      // }).then(res=>{
      //   console.log('全部avatar数据',res)
      // })
      this.radioData = resultJSON.avatarData
      this.avatarID = resultJSON.avatarID
    },
    mounted() {
      // let self = this;
      // setTimeout(()=>{
      //   self.$emit('initAvatar')
      // },1000)
    },
    methods:{
      radioChange(val){
        this.avatarID = val;
        resultJSON.avatarID = val;
      },
      backTo(){
        this.$router.push({path:'/myscript'})
      },
      nextBtn(){
        this.$router.push({path:'/tools'})
      },
    },

  }
</script>
<style lang="less" scoped>
  .common_content {
    padding: 30px 20px;
    position: relative;
  }
  .stepBox{
    height: 100px;
    line-height: 100px;
    .step-item{
      display: inline-block;
      font-size: 0;
      .count{
        display: inline-block;
        font-size: 16px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #FFFFFF;
        background: #C6C6C6;
        border-radius: 50%;
        &:hover {
          animation: sun 8s infinite;
        }
      }
      .label{
        margin-left: 10px;
        color: #333333;
        font-size: 16px;
        font-weight: 400;
      }
      .line{
        font-size: 14px;
        margin: 0 20px;
      }
    }
    .step-item1{
      .count{
        background: linear-gradient(90deg,  #FFB548,#FF7171,#f441a5,#FFB548 );
        background-size: 400%;
      }
    }
    .back{
      float: right;
      margin-top: 35px;
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
  }
  .step_content{
    background: #FFFFFF;
    box-shadow: 0px 0px 10px #e5ecf1;
    border-radius: 3px;
    min-height: 500px;
  }

  @keyframes sun {
    100%{
      background-position: -400% 0;
    }
  }

</style>
<style lang="less" scoped>
  /deep/.el-radio.is-bordered.is-checked{
    border-color: #7E59FF;
  }
  .step1_content{
    padding: 40px;
  }
  .step1_case{
    .label{
      margin-bottom: 14px;
      font-size: 16px;
      color: #333333;
    }
  }

  .step1_card{
    width: 124px;
    height: 154px!important;
    margin-top: 24px;
    padding: 0!important;;
    border-radius: 4px;
    overflow: hidden;
    /*border-color: #673ab7;*/
    margin-left: 0px !important;
    margin-right: 29px !important;
    /deep/.el-radio__input{
      display: none;
    }
    /deep/.el-radio__label{
      padding-left: 0;
    }
    .step1_card_item{
      font-size: 0;
      img{
        width: 100%;
        height: 124px;
      }
      .label{
        font-size: 13px;
        color: #666666;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
  .next_btn{
    font-size: 12px;
    margin-top: 40px;
    display: inline-block;
    line-height: 1;
    padding: 5px 8px;
    margin-right: 8px;
    height: 34px;
    width: 92px;
    border-radius: 32px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    background: #7e59ff;
    transition: all 0.3s;
    color: #FFFFFF;
    &:hover {
      opacity: .7;
    }
    &:focus {
      outline: none;
    }
  }
  .next_btn2{
    width: 128px;
  }
  .next_btn1{
    background: #C6C6C6;
  }
</style>
