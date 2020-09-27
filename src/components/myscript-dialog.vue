<template>
 <div class="checkBox">
   <div class="title">剧本:{{scriptName}}</div>
   <div class="content" v-for="(val,ind) in scriptRow" :key="ind">
     <div class="subtitle clearfix">
       <span class="subtitle-text">{{ind | indFilter}}</span>
       <el-button class="float_right" size="small" type="text" @click="previewBtn(val)">预览</el-button>
     </div>
     <div class="textArea">
       {{val | contentFilter}}
     </div>

   </div>
 </div>
</template>

<script>
  import { NumToCh } from '../api/NumberToChinese'
  import {resultJSON} from "../api/result";
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
    mounted() {
      this.previewReady = true;
      window.WebPreviewReady = this.WebPreviewReady;
      window.WebSelectAvatarState=this.WebSelectAvatarState;
    },
    methods:{
      //预览
      previewBtn(val){
        if(this.previewReady){
          this.previewData = val;
          UnityChangeAvatar(val.avatar.unity);
          this.previewReady = false;
        }else{
          this.$message.warning('资源加载中，请稍后...')
        }
      },
      WebSelectAvatarState(state){
        if(state==='True'){
          UnityPreview(this.previewData.avatar.unity,JSON.stringify([this.previewData]))
        }else if(state==='False'){
          this.$message.error('切换角色失败，请重试')
          this.previewReady = true;
        }
      },
      WebPreviewReady(state){
        if(state==='True'){
          UnityPreviewStart(this.previewData.avatar.unity);
        }else if(state==='False'){
          this.$message.error('加载资源失败，请重试')
        }
        this.previewReady = true;
      }
    },
    beforeDestroy() {
      //跳转页面后强制结束播放状态
      UnityPreviewCancel();
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
