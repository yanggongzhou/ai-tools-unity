<template></template>
<script>
  import {resultJSON} from '../../api/result'
  export default {
    data(){
      return{
      }
    },
    created() {
      window.WebEditAvatar = this.WebEditAvatar; //获取avatar名字+中文
      window.WebInfoModelMsg = this.WebInfoModelMsg;//展示位信息
    },
    methods:{
      WebEditAvatar(name,chName){
        resultJSON.resultJsonObj.avatar.unity = name
        resultJSON.avatarChName = chName
        this.$store.commit('set_avatarName', {name:name,chName:chName})
      },

      WebInfoModelMsg(param){
        this.$store.commit('set_InfoModelData',JSON.parse(param))
      },

    }
  }
</script>
