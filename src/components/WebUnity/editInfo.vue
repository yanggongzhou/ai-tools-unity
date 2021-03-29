<template></template>
<script>
  import {mapGetters} from "vuex";

  export default {
    computed:{
      ...mapGetters([
        'PcVisible'
      ])
    },
    data(){
      return{
      }
    },
    created() {
      window.WebEditAvatar = this.WebEditAvatar; //获取avatar名字+中文
      window.WebInfoModelMsg = this.WebInfoModelMsg;//展示位信息
      window.WebRoute = this.WebRoute;//路由跳转
    },
    methods:{
      WebEditAvatar(name,chName){
        this.$store.commit('set_avatarName', {name:name,chName:chName})
      },
      WebInfoModelMsg(param){
        this.$store.commit('set_InfoModelData',JSON.parse(param))
      },
      WebRoute(param){
        if (this.PcVisible){
          this.$store.commit('set_pcVisible',false)
        }
        this.$router.push({name:param})
      },
    }
  }
</script>
