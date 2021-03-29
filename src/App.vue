<template>
  <div id="app">
    <div class="dev_tip" v-if="isShowDevTip">
      测试版本v{{ResultJson.version}}
      <el-button-group>
        <el-button @click="gotoPage('webcast')">开始直播</el-button>
        <el-button @click="gotoPage('myscript')">我的剧本</el-button>
      </el-button-group>
    </div>
    <transition enter-active-class="animated fadeIn"
                v-if="$route.name!=='tools'"
                leave-active-class="animated zoomOut"
                :duration="{enter: 500, leave: 500}">
      <router-view/>
    </transition>
    <router-view v-if="$route.name==='tools'"/>
<!--    unity端avatar切换记录-->
    <editInfo/>
    <UError></UError>
    <UuserInfo></UuserInfo>
<!--    取消预览-->
    <UcancelPreview></UcancelPreview>
  </div>
</template>

<script>
  import UError from "./components/WebUnity/error";
  import UuserInfo from "./components/WebUnity/userInfo";
  import editInfo from "./components/WebUnity/editInfo";
  import UcancelPreview from "./components/cancelPreview"
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
    UuserInfo,
    UcancelPreview
  },
  data() {
    return {
      isShowDevTip:false,
    };
  },
  created() {
    window.location.hostname==='demo.magics-ad.com'||window.location.hostname==='0.0.0.0'?this.isShowDevTip=true:this.isShowDevTip=false
  },
  mounted() {

  },
  methods:{
    gotoPage(val){
      UnityRoute(val)
      WebRoute(val)
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
