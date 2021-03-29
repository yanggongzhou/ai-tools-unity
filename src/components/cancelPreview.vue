<template>
  <div class="box"  @click="previewCancelBtn" v-if="PcVisible">
    <div>
      <div class="shaft-load5">
        <div class="shaft1"></div>
        <div class="shaft2"></div>
        <div class="shaft3"></div>
        <div class="shaft4"></div>
        <div class="shaft5"></div>
        <div class="shaft6"></div>
        <div class="shaft7"></div>
        <div class="shaft8"></div>
        <div class="shaft9"></div>
        <div class="shaft10"></div>
      </div>
      <button class="cancel_btn">
        <span class=" posAdjustment" :class="{'el-icon-loading': ClValue,'el-icon-video-pause':!ClValue}"></span>
        <span>单击屏幕取消播放</span>
      </button>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    computed:{
      ...mapGetters([
        'PcVisible',
        'ClValue'
      ])
    },
    data(){
      return{
      }
    },
    created() {

    },
    methods:{
      previewCancelBtn(){
        this.$store.commit('set_pcVisible',false)
      }
    }
  }
</script>
<style lang="less" scoped>
  .box{
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #19181b8a;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .cancel_btn{
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      background: transparent;
      color: #ffffff;
      font-weight: 600;
    }
    .posAdjustment{
      font-weight: 600;
      font-size: 21px;
      position: relative;
      transition: all .5s;
      top: 3px;
    }
    &:hover .posAdjustment{
      color: #03a9f4;
    }
  }

</style>
<style>
  /* Universal styling */
  [class^="shaft-load"] {
    margin: 10px auto;
    width: 120px;
    height: 60px;
  }
  [class^="shaft-load"] > div {
    float: left;
    background: #ffffff;
    height: 100%;
    width: 10px;
    margin-right: 1px;
    display: inline-block;
  }
  [class^="shaft-load"] .shaft1 {
    -webkit-animation-delay: 0.05s;
    -moz-animation-delay: 0.05s;
    -o-animation-delay: 0.05s;
    animation-delay: 0.05s;
  }
  [class^="shaft-load"] .shaft2 {
    -webkit-animation-delay: 0.1s;
    -moz-animation-delay: 0.1s;
    -o-animation-delay: 0.1s;
    animation-delay: 0.1s;
  }
  [class^="shaft-load"] .shaft3 {
    -webkit-animation-delay: 0.15s;
    -moz-animation-delay: 0.15s;
    -o-animation-delay: 0.15s;
    animation-delay: 0.15s;
  }
  [class^="shaft-load"] .shaft4 {
    -webkit-animation-delay: 0.2s;
    -moz-animation-delay: 0.2s;
    -o-animation-delay: 0.2s;
    animation-delay: 0.2s;
  }
  [class^="shaft-load"] .shaft5 {
    -webkit-animation-delay: 0.25s;
    -moz-animation-delay: 0.25s;
    -o-animation-delay: 0.25s;
    animation-delay: 0.25s;
  }
  [class^="shaft-load"] .shaft6 {
    -webkit-animation-delay: 0.3s;
    -moz-animation-delay: 0.3s;
    -o-animation-delay: 0.3s;
    animation-delay: 0.3s;
  }
  [class^="shaft-load"] .shaft7 {
    -webkit-animation-delay: 0.35s;
    -moz-animation-delay: 0.35s;
    -o-animation-delay: 0.35s;
    animation-delay: 0.35s;
  }
  [class^="shaft-load"] .shaft8 {
    -webkit-animation-delay: 0.4s;
    -moz-animation-delay: 0.4s;
    -o-animation-delay: 0.4s;
    animation-delay: 0.4s;
  }
  [class^="shaft-load"] .shaft9 {
    -webkit-animation-delay: 0.45s;
    -moz-animation-delay: 0.45s;
    -o-animation-delay: 0.45s;
    animation-delay: 0.45s;
  }
  [class^="shaft-load"] .shaft10 {
    -webkit-animation-delay: 0.5s;
    -moz-animation-delay: 0.5s;
    -o-animation-delay: 0.5s;
    animation-delay: 0.5s;
  }

  /* Shaft 5 */
  .shaft-load5 {
    height: 80px;
  }
  .shaft-load5 > div {
    background-color: #ffffff;
    position: relative;
    bottom: 0;
    margin-top: 35px;
    height: 5px;
    -webkit-animation: loading5 1.5s infinite ease-in-out;
    -moz-animation: loading5 1.5s infinite ease-in-out;
    -o-animation: loading5 1.5s infinite ease-in-out;
    animation: loading5 1.5s infinite ease-in-out;
  }
  .shaft-load5 .shaft1 {
    -webkit-animation-delay: -1.5s;
    -moz-animation-delay: -1.5s;
    -o-animation-delay: -1.5s;
    animation-delay: -1.5s;
  }
  .shaft-load5 .shaft2 {
    -webkit-animation-delay: -1.4s;
    -moz-animation-delay: -1.4s;
    -o-animation-delay: -1.4s;
    animation-delay: -1.4s;
  }
  .shaft-load5 .shaft3 {
    -webkit-animation-delay: -1.3s;
    -moz-animation-delay: -1.3s;
    -o-animation-delay: -1.3s;
    animation-delay: -1.3s;
  }
  .shaft-load5 .shaft4 {
    -webkit-animation-delay: -1.2s;
    -moz-animation-delay: -1.2s;
    -o-animation-delay: -1.2s;
    animation-delay: -1.2s;
  }
  .shaft-load5 .shaft5 {
    -webkit-animation-delay: -1.1s;
    -moz-animation-delay: -1.1s;
    -o-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }
  .shaft-load5 .shaft6 {
    -webkit-animation-delay: -1s;
    -moz-animation-delay: -1s;
    -o-animation-delay: -1s;
    animation-delay: -1s;
  }
  .shaft-load5 .shaft7 {
    -webkit-animation-delay: -0.9s;
    -moz-animation-delay: -0.9s;
    -o-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }
  .shaft-load5 .shaft8 {
    -webkit-animation-delay: -0.8s;
    -moz-animation-delay: -0.8s;
    -o-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }
  .shaft-load5 .shaft9 {
    -webkit-animation-delay: -0.7s;
    -moz-animation-delay: -0.7s;
    -o-animation-delay: -0.7s;
    animation-delay: -0.7s;
  }
  .shaft-load5 .shaft10 {
    -webkit-animation-delay: -0.6s;
    -moz-animation-delay: -0.6s;
    -o-animation-delay: -0.6s;
    animation-delay: -0.6s;
  }
  .shaft-load5 .shaft11 {
    -webkit-animation-delay: -0.5s;
    -moz-animation-delay: -0.5s;
    -o-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }

  @-webkit-keyframes loading5 {
    50% {
      height: 100%;
      margin-top: 0;
      background: #d8f1fd;
    }
  }
  @-moz-keyframes loading5 {
    50% {
      height: 100%;
      margin-top: 0;
      background: #d8f1fd;
    }
  }
  @-o-keyframes loading5 {
    50% {
      height: 100%;
      margin-top: 0;
      background: #0eb0f6;
    }
  }
  @keyframes loading5 {
    50% {
      height: 100%;
      margin-top: 0;
      background: #0eb0f6;
    }
  }

</style>
