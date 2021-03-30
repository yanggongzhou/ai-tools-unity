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
            title:  this.$lan.direct.offline_t,
            message:this.$lan.direct.offline_c,
            duration: 0
          });
        }else{
          this.$notify.success({
            title:  this.$lan.direct.online_t,
            message:this.$lan.direct.online_c,
            duration: 0
          });
        }
      },
    }
  }
</script>
