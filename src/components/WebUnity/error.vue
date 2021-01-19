<template></template>
<script>
  export default {
    data(){
      return{
      }
    },
    created() {
      window.WebErrorMessage=this.WebErrorMessage;
    },
    methods:{
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
    }
  }
</script>
