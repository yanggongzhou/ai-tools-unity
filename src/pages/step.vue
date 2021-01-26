<template>
    <div class='homepage'>
      <img class="pandaImg" src='https://large.magics-ad.com/ai-3D/static/img/panda.png' alt="">
      <div class="stepBox">
        <el-steps direction="vertical" :active="stepActive">
          <el-step class="11" icon="el-icon-picture" @change="stepActive = 4">
            <div slot="title" @click="stepChange(1)">直播间背景</div>
          </el-step>
          <el-step icon="el-icon-user-solid" title="角色模型">
            <div slot="title" @click="stepChange(2)">角色模型</div>
          </el-step>
          <el-step icon="el-icon-copy-document" description="剧本使用的展示位的数量、位置和大小">
            <div slot="title" @click="stepChange(3)">展示位</div>
          </el-step>
          <el-step icon="el-icon-edit-outline" description="编写文字内容、插入标签等组合方式集成剧本">
            <div slot="title" @click="stepChange(4)">编辑剧本</div>
          </el-step>
        </el-steps>
      </div>

    </div>
</template>
<script>
export default {
  data() {
      return {
        stepActive:1,//步骤
        isShowDevTip:false,
      };
  },
  watch: {},
  created() {
    window.WebStepChange = this.WebStepChange;//web步骤
  },
  methods: {
    stepChange(val){
      UnityStepChange(val+'')
      if(val===4){
        UnityRoute('tools')
        // this.$router.push({name:'tools'})
      }
    },
    WebStepChange(param){
      this.stepActive = JSON.parse(param);
    },
  }
}
</script>
<style scoped lang="less">
  .homepage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    /*background: #f9f2ff;*/
    .pandaImg{
      width: 300px;
      height: auto;
    }
    .stepBox{
      height: 350px;
      /deep/.el-step__title{
        cursor: pointer;
      }
      /deep/.el-step__title.is-finish{
        font-weight: 600;
        color: #673AB7;
      }
      /deep/.el-step__head.is-finish{
        color: #673AB7;
        border-color: #673AB7;
      }
      /deep/.el-step__description.is-finish{
        color: #aa88e6;
      }
    }
  }
</style>
