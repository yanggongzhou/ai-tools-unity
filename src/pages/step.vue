<template>
<!--    <div class='homepage'>-->
<!--      <img class="pandaImg" src='https://large.magics-ad.com/ai-3D/static/img/panda.png' alt="">-->
<!--      <div class="stepBox">-->
<!--        <el-steps direction="vertical" :active="stepActive">-->
<!--          <el-step icon="el-icon-picture">-->
<!--            <div slot="title">直播间背景</div>-->
<!--          </el-step>-->
<!--          <el-step icon="el-icon-user-solid" title="角色模型">-->
<!--            <div slot="title">角色模型</div>-->
<!--          </el-step>-->
<!--          <el-step icon="el-icon-copy-document" description="剧本使用的展示位的数量、位置和大小">-->
<!--            <div slot="title">展示位</div>-->
<!--          </el-step>-->
<!--          <el-step icon="el-icon-edit-outline" description="编写文字内容、插入标签等组合方式集成剧本">-->
<!--            <div slot="title">编辑剧本</div>-->
<!--          </el-step>-->
<!--        </el-steps>-->
<!--      </div>-->
<!--      https://large.magics-ad.com/mygz-file/unityTools/panda.png-->


<!--    </div>-->

  <div class="stepBox">
    <div class="step_title">
      <p>创建和编辑剧本</p>
      <div class="line"></div>
    </div>
    <div class="step_content">
      <div class="step_img">
        <img src='https://large.magics-ad.com/mygz-file/unityTools/panda.png' alt="">
      </div>
      <div class="step_line">
        <div class="line"></div>
        <img class="step_line-img1" :class="{'active':stepActive==='1'}" src="static/icon/background.png" alt="">
        <img class="step_line-img2" :class="{'active':stepActive==='2','noactive_img':stepNoActive2}" src="static/icon/avatar.png" alt="">
        <img class="step_line-img3" :class="{'active':stepActive==='3','noactive_img':stepNoActive3}" src="static/icon/infomodel.png" alt="">
        <img class="step_line-img4" :class="{'active':stepActive==='4','noactive_img':stepNoActive4}" src="static/icon/edit.png" alt="">
      </div>
      <div class="step_text">
        <div class="step_text-item item1" :class="{'active':stepActive==='1'}">
          <img src="static/icon/01.png" alt="">
          <div class="text">选择脚本使用的直播间背景</div>
        </div>
        <div class="step_text-item item2" :class="{'active':stepActive==='2','noactive':stepNoActive2}">
          <img src="static/icon/02.png" alt="">
          <div class="text">选择脚本使用的角色模型</div>
        </div>
        <div class="step_text-item item3" :class="{'active':stepActive==='3','noactive':stepNoActive3}">
          <img src="static/icon/03.png" alt="">
          <div class="text">选择脚本使用的展示位的数量、大小和位置</div>
        </div>
        <div class="step_text-item item4" :class="{'active':stepActive==='4','noactive':stepNoActive4}">
          <img src="static/icon/04.png" alt="">
          <div class="text">在右侧剧本编辑窗口编辑剧本</div>
        </div>
      </div>

    </div>


  </div>
</template>
<script>
export default {
  data() {
      return {
        stepActive:'1',//步骤

        stepNoActive2:true,
        stepNoActive3:true,
        stepNoActive4:true,
      };
  },
  created() {
    this.stepActive = "1"
    this.stepNoActive2=true;
    this.stepNoActive3=true;
    this.stepNoActive4=true;
    window.WebStepChange = this.WebStepChange;//web步骤
    window.WebSelectAvatarState=this.WebSelectAvatarState;
  },
  methods: {
    WebStepChange(param){
      this.stepActive = param;
      switch (param) {
        case '2':
          this.stepNoActive2=false;
          break;
        case '3':
          this.stepNoActive3=false;
          break;
        case '4':
          this.stepNoActive4=false;
          break;
      }
      console.log('step',param)
    },
    WebSelectAvatarState(state){
      if(state==='True'){
        // this.$message.error('切换角色')
      }else if(state==='False'){
        this.$message.error('切换角色失败，请重试')
        this.previewReady = true;
      }
    },
  }
}
</script>
<style scoped lang="less">
  .stepBox{
    width: 700px;
    height: 750px;
    margin: 0 auto;
    .step_title{
      width: 194px;
      font-size: 26px;
      font-weight: 500;
      color: #333333;
      letter-spacing: 1px;
      padding-top: 55px;
      margin: 0 auto;
      position: relative;
      .line{
        width: 173px;
        height: 13px;
        background: #5C83FF42;
        position: relative;
        margin: 0 auto;
        top: -13px;
      }
    }
    .step_content{
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 59px;
      .step_img{
        margin: 0px 45px 0 63px;
        img{
          width: 222px;
          height: 332px;
        }
      }
      .step_line{
        width: 34px;
        position: relative;
        .line{
          width: 4px;
          height: 532px;
          background: linear-gradient(180deg, #E9EBF6 0%, #CDD3EA 12%, #CDD3EA 82%, rgba(205, 211, 234, 0) 100%);
          border-radius: 2px;
          margin: 0 auto;
        }
        img{
          position: absolute;
        }
        .step_line-img1{
          top: 42px;
        }
        .step_line-img2{
          top: 169px;
        }
        .step_line-img3{
          top: 296px;
        }
        .step_line-img4{
          top: 423px;
        }
        .active{
          transform: scale(1.2);
        }
      }

      .step_text{
        margin: 0 56px 0 23px;
        height: 532px;
        width: 257px;
        font-size: 15px;
        font-weight: 500;
        color: #333333;
        position: relative;
        .step_text-item{
          border-radius: 10px;
          border: 1px solid transparent;
          background: #FFFFFF;
          background: url(../../static/icon/qipao1.png);
          background-size: 103% 112%;
          background-position: -4px -4px;
          width: 257px;
          height: 84px;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          .text{
            margin-left: 19px;
            width:150px;
          }
        }
        .item1{
          top: 17px;
        }
        .item2{
          top: 144px;
        }
        .item3{
          top: 271px;
        }
        .item4{
          top: 398px;
        }
        .active{
          background: url(../../static/icon/qipao2.png);
          background-size: 103% 112%;
          background-position: -4px -4px;
        }
      }
    }
    .noactive{
      opacity: 0.6;
    }
    .noactive_img{
      filter: grayscale(1);
    }
  }



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
      /deep/.el-step__icon{
        background: #F5F6FA;
      }
    }
  }
</style>
