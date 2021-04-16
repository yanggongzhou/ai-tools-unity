<template></template>
<script>
  import {mapGetters} from "vuex";

  export default {
    computed:{
      ...mapGetters([
        'PcVisible',
        'IsFirstAvatarState'
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
        // console.log(`WebEditAvatar======>${name} ${chName}`)
        // console.log(`请求要${this.ResultJson.avatar.unity}动作`)
        if(this.$route.name==='tools' && !this.IsFirstAvatarState){
          UnityAvatarMotionInfo(name);
          console.log(`请求要${this.ResultJson.avatar.unity}动作`)
        }
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
