<template>
  <div id="app">
    <div class="dev_tip" v-if="isShowDevTip">
      测试版本v{{ResultJson.version}}
      <el-button-group>
        <el-button @click="gotoPage('webcast')">开始直播</el-button>
        <el-button @click="gotoPage('myscript')">我的剧本</el-button>
      </el-button-group>
    </div>
    <router-view/>
<!--    unity端avatar切换记录-->
    <editInfo/>
    <UError></UError>
    <UuserInfo></UuserInfo>
  </div>
</template>

<script>
  import UError from "./components/WebUnity/error";
  import UuserInfo from "./components/WebUnity/userInfo";
  import editInfo from "./components/WebUnity/editInfo";
  import {mapGetters} from "vuex";
export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'ResultJson'
    ])
  },
  components:{
    editInfo,
    UError,
    UuserInfo
  },
  data() {
    return {
      isShowDevTip:false,
    };
  },
  created() {
    window.location.hostname==='demo.magics-ad.com'||window.location.hostname==='0.0.0.0'?this.isShowDevTip=true:this.isShowDevTip=false
    UnityNativeReady();
  },
  mounted() {
  },
  methods:{
    gotoPage(val){
      UnityRoute(val)
      this.$router.push({name:val})
    },
  }
}
</script>

<style>
  .dev_tip{
    position: absolute;
    top: 10px;
    right: 20px;
    color: #E91E63;
    font-size: 16px;
    font-weight: 600;
    z-index: 99;
  }
</style>
