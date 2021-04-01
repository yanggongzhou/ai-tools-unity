<template></template>
<script>
  export default {
    data(){
      return{
        getUserInfoCount:0,//请求用户数据次数
        notifyOption:'',
        isUserInfo:false,
        userInfoTimeOut:'',
        onceUnityNativeReady:false,//请求一次环境准备完毕
      }
    },
    created() {
      window.WebUserMessage=this.WebUserMessage;
    },
    mounted() {
      let self = this;
      //请求用户信息
      if(this.$Session.get('ai_user_id')&&this.$Session.get('ai_user_token')&&this.$Session.get('ai_user_phone')){

      }else{
        if(this.userInfoTimeOut){  clearTimeout(this.userInfoTimeOut) }
        this.notifyOption = this.$notify.info({
          title:  this.$lan.common.tip,
          message: this.$lan.common.userInsertMsg,
          duration: 0
        });
        this.isUserInfo = true;
        this.getUserInfo();
        this.userInfoTimeOut = setTimeout(()=>{
          if(self.$Session.get('ai_user_id')&&self.$Session.get('ai_user_token')&&self.$Session.get('ai_user_phone')){
            self.$message.error(this.$lan.common.userReqFailMsg)
          }else {
            self.isUserInfo = false;
            self.$message.success(this.$lan.common.userInsertSuccessMsg)
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
        // UnityNativeReady('测试参数web环境准备');
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
        if(!this.onceUnityNativeReady){
          this.onceUnityNativeReady = true;
          UnityNativeReady();
        }
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
        this.$message.success(this.$lan.common.userInsertSuccessMsg)
        this.notifyOption.close();
      },
    }
  }
</script>
