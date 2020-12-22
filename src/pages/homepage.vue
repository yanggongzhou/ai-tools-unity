<template>
    <div v-loading="isUserInfo" id='homepage'>
      <div class="dev_tip" v-if="isShowDevTip">
        测试版本v1.0
      </div>
        <div class="cards common_content">
            <div class="card" v-for='(card, idx) in cards' :key='idx'>
                <div class="poster" :class="'poster'+idx" @click='gotoPage(card.targetPage)'>
                    <img :src="card.poster">
                </div>
                <button :class="['cardBtn', `cardBtn`+idx]" @click='gotoPage(card.targetPage)'>{{card.btnTxt}}</button>
            </div>
        </div>
    </div>
</template>
<script>

import {Session} from "../api/auth";
import {requestServices} from "../api/api";

export default {
    data() {
        return {
            cards: [
                {
                    poster: 'https://large.magics-ad.com/ai-3D/static/img/panda.png',
                    btnTxt: '开始直播',
                    targetPage: '/webcast'
                },
                {
                    poster: 'https://large.magics-ad.com/ai-3D/static/img/h1.png',
                    btnTxt: '创建剧本',
                    targetPage: '/steper'
                },
                {
                    poster: 'https://large.magics-ad.com/ai-3D/static/img/hmy.png',
                    btnTxt: '我的剧本',
                    targetPage: '/myscript'
                }
            ],
          getUserInfoCount:0,//请求用户数据次数
          notifyOption:'',
          userInfoTimeOut:'',
          isUserInfo:false,
          isShowDevTip:false,
        };
    },
    computed: {},
    watch: {},
    created() {
      window.WebUserMessage=this.WebUserMessage;
      window.WebErrorMessage=this.WebErrorMessage;
      window.location.hostname==='demo.magics-ad.com'||window.location.hostname==='0.0.0.0'?this.isShowDevTip=true:this.isShowDevTip=false
    },
    mounted() {
      if(this.$route.query.phone){
        requestServices.login({
          phone:this.$route.query.phone,
          password:this.$route.query.password,
          role_id:23
        }).then(res=>{
          console.log(res)
        })
      }



        let self = this;
        //请求用户信息
        if(this.$Session.get('ai_user_id')&&this.$Session.get('ai_user_token')&&this.$Session.get('ai_user_phone')){

        }else{
          if(this.userInfoTimeOut){  clearTimeout(this.userInfoTimeOut) }
          this.notifyOption = this.$notify.info({
            title:  '提示',
            message:"用户信息注入中...",
            duration: 0
          });
          this.isUserInfo = true;
          this.getUserInfo();
          this.userInfoTimeOut = setTimeout(()=>{
            if(self.$Session.get('ai_user_id')&&self.$Session.get('ai_user_token')&&self.$Session.get('ai_user_phone')){
              self.$message.error('请求用户信息失败,请重启窗口！')

            }else {
              self.isUserInfo = false;
              self.$message.success('用户信息已注入！')
            }
          },100000)
        }

      },
    methods: {
      //请求用户信息
      getUserInfo(){
        this.getUserInfoCount+=1;
        let self = this;
        UnityUserInfo();
        if(this.getUserInfoCount < 3){
          setTimeout(()=>{
            if(self.$Session.get('ai_user_id')&&self.$Session.get('ai_user_token')&&self.$Session.get('ai_user_phone')){
              // this.$message.success('用户信息已注入！')
            }else{
              self.getUserInfo();
            }
          },3000)
        }
        // self.$message.error('请求用户信息失败,请重启窗口！')
      },
      WebUserMessage(id,token,phone){
        // this.$notify({
        //   title: this.$Session.get('ai_user_id') +'用户'+ Session.get('ai_user_phone'),
        //   message: Session.get('ai_user_token'),
        //   duration: 0
        // });
        console.log(id,token,phone)
        this.$Session.set('ai_user_id', id);
        this.$Session.set('ai_user_token', token)
        this.$Session.set('ai_user_phone', phone)
        // alert('id'+id+';   token:'+token+';    phone:'+phone)
        this.isUserInfo = false;
        clearTimeout(this.userInfoTimeOut)
        this.$message.success('用户信息已注入！')
        this.notifyOption.close();
      },
      //断网
      WebErrorMessage(err){
        if(err==="True"){
          this.$notify.error({
            title:  '网络连接已断开!',
            message:"网络连接出现异常，请确认您的联网状态!",
            duration: 0
          });
        }else{
          this.$notify.success({
            title:  '网络已重新连接!',
            message:"网络连接已恢复，祝您使用愉快!",
            duration: 0
          });
        }
      },
        gotoPage(_page) {
          this.$router.push(_page)
        }
    }
}
</script>
<style scoped >
    .dev_tip{
      position: absolute;
      top: 50px;
      left: 50px;
      color: #E91E63;
      font-size: 23px;
      font-weight: 600;
      z-index: 99;
    }
    #homepage {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #F5F6FA;
    }
    .cards {
      margin-top: 20px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        min-width: 850px;
    }
    .card {
        width: 218px;
        height: 420px;
        /* background: rgba(255, 255, 200, 0.1); */
        /* border: 1px solid #fff; */
        align-self: center;
        text-align: center;
    }
    .poster {
        width: 218px;
        height: 278px;
        background: #FFFFFF;
        /* box-shadow: 0px 1px 11px 0px rgba(230, 231, 235, 0.87), 0px 1px 2px 0px #E3E3E3; */
        border-radius: 8px;
        cursor: pointer;
        position: relative;
    }
    .poster0 {
        background: url(https://large.magics-ad.com/ai-3D/static/img/hbg1.png) no-repeat center;
        background-size: 218px 278px;
    }
    .poster0 img {
        width: 248px;
        height: 325px;
        position: absolute;
        top: -8px;
        left: 26px;
    }
    .poster1 {
        background: url(https://large.magics-ad.com/ai-3D/static/img/hbg2.png) no-repeat center;
        background-size: 218px 278px;
    }
    .poster2 {
        background: url(https://large.magics-ad.com/ai-3D/static/img/hbg3.png) no-repeat center;
        background-size: 218px 278px;
    }
    .poster1 img, .poster2 img {
        position: absolute;
        width: 74px;
        height: 72px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .cardBtn {
        text-decoration: none;
        width: 160px;
        height: 46px;
        margin-top: 58px;
        border-radius: 30px;
        font-size: 20px;
        font-weight: 500;
        color: #fff;
        cursor: pointer;
    }
    .cardBtn0 {
        background: linear-gradient(165deg, #BA71FF 0%, #5648FF 100%);
    }
    .cardBtn1 {
        background: linear-gradient(331deg, #FF71B5 0%, #FFBA48 100%);
    }
    .cardBtn2 {
        background: linear-gradient(137deg, #9BFFD8 0%, #669AFB 100%);
    }

</style>
