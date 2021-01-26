<template>
    <div id='homepage'>
      <div class="dev_tip" v-if="isShowDevTip">
        测试版本v{{ResultJson.version}}
        <el-button-group>
          <el-button @click="$router.push('/webcast')">开始直播</el-button>
          <el-button @click="$router.push('/myscript')">我的剧本</el-button>
          <el-button @click="$router.push('/tools')">创建剧本</el-button>
        </el-button-group>
      </div>
      <img src='https://large.magics-ad.com/ai-3D/static/img/panda.png' alt="">
      <UError></UError>
      <UuserInfo></UuserInfo>
    </div>
</template>
<script>

import UError from "../components/WebUnity/error";
import UuserInfo from "../components/WebUnity/userInfo";
import {mapGetters} from "vuex";
export default {
  computed: {
    ...mapGetters([
      'ResultJson'
    ])
  },
  components:{
    UError,
    UuserInfo
  },
    data() {
        return {
          isShowDevTip:false,
        };
    },
    watch: {},
    created() {
      window.location.hostname==='demo.magics-ad.com'||window.location.hostname==='0.0.0.0'?this.isShowDevTip=true:this.isShowDevTip=false
    },

    methods: {
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
      background: #cfa6f5;
    }
</style>
