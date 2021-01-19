<template></template>
<script>
  import {requestServices} from "../../api/api";

  export default {
    data(){
      return{
        getUserInfoCount:0,//请求用户数据次数
        notifyOption:'',
        isUserInfo:false,
        userInfoTimeOut:'',
      }
    },
    created() {
      window.WebUserMessage=this.WebUserMessage;
    },
    mounted() {
      //测试专用，后拼接账号密码可在控制台查看登陆信息
      if(this.$route.query.phone){
        requestServices.login({
          phone:this.$route.query.phone,
          password:this.$route.query.password,
          role_id:23
        }).then(res=>{
          console.log('\x1b[33m%s\x1b[0m','账号信息',res)
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
    methods:{
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
    }
  }
</script>
