<template>
  <div id="app">
    <div class="dev_tip" v-if="isShowDevTip">
      {{$lan.app.devTip}}
      <el-button-group>
        <el-button @click="gotoPage('webcast')">{{$lan.app.goLive}}</el-button>
        <el-button @click="gotoPage('myscript')">{{$lan.app.myscript}}</el-button>
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
    <Upreview></Upreview>
  </div>
</template>

<script>
  import UError from "./components/WebUnity/error";
  import UuserInfo from "./components/WebUnity/userInfo";
  import Upreview from "./components/WebUnity/preview"
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
    Upreview,
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
