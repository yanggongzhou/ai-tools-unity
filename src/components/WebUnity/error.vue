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
            title:  'The network connection has been disconnected!',
            message:"Network connection is abnormal, please confirm your network status!",
            duration: 0
          });
        }else{
          this.$notify.success({
            title:  'The network has been reconnected!',
            message:"The network connection has been restored. Have a good time!",
            duration: 0
          });
        }
      },
    }
  }
</script>
