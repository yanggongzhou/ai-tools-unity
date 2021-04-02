<template>
 <div class="checkBox">
   <div class="title">{{$lan.myscript.script}}:{{scriptName}}</div>
   <div class="content" v-for="(val,ind) in scriptRow" :key="ind">
     <div class="subtitle clearfix">
       <span class="subtitle-text">{{ind | indFilter}}</span>
       <el-button class="float_right" size="small" type="text" @click="previewBtn(val)">{{$lan.common.preview}}</el-button>
     </div>
     <div class="textArea">
       {{val | contentFilter}}
     </div>

   </div>
 </div>
</template>

<script>
  import { NumToCh } from '../../api/NumberToChinese'
  export default {
    props:['scriptRow','scriptName'],
    filters:{
      contentFilter(value){
        let _content = '';
        value.param.forEach(val=>{
          _content+= val.content;
        })
        return _content;
      },
      indFilter(value){
        let _txt = '第'+NumToCh.NumberToChinese(value+1)+'段'
        return _txt;
      }
    },
    data(){
      return{
        previewData:'',
        previewReady:true,
      }
    },
    created() {
      window.WebPreviewReady = this.WebPreviewReady;
      window.WebSelectAvatarState=this.WebSelectAvatarState;
      window.WebPreviewEnd=this.WebPreviewEnd;
    },
    mounted() {
      this.previewReady = true;
    },
    methods:{
      //预览
      previewBtn(val){
        if(this.previewReady){
          this.previewData = val;
          UnityPreviewCancel();
          console.log('预览脚本',this.previewData)
          UnityChangeAvatar(val.avatar.unity);
          this.previewReady = false;
        }else{
          this.$message.warning(this.$lan.common.resourceLoadingMsg)
        }
      },
      WebSelectAvatarState(state){
        if(state==='True'){
          UnityPreview(this.previewData.avatar.unity,JSON.stringify([this.previewData]),"True","False")
        }else if(state==='False'){
          this.$message.error(this.$lan.common.changeAvatarFailMsg)
          this.previewReady = true;
        }
      },
      WebPreviewReady(state){
        if(state==='True'){
          this.$store.commit('set_pcVisible',true)
          UnityPreviewStart(this.previewData.avatar.unity);
        }else if(state==='False'){
          this.$message.error(this.$lan.common.resourceLoadingFailMsg)
        }
        this.previewReady = true;
      },
      WebPreviewEnd(){
        this.$store.commit('set_pcVisible',false)
      },
    },
    beforeDestroy() {
      //跳转页面后强制结束播放状态
      UnityPreviewCancel();
      this.previewReady = true;
    },
  }
</script>
<style lang="less" scoped>
.checkBox{
  .title{
    color: #333333;
    font-weight: 600;
    font-size: 18px;
  }
  .content{
    margin-top: 12px;
    .subtitle{
      .subtitle-text{
        color: #333333;
        font-size: 13px;
        font-weight: 500;
      }
    }
    .textArea{
      background: #6a50fe0f;
      padding: 10px;
      font-size: 12px;
      color: #666666;
    }
  }

}
</style>
