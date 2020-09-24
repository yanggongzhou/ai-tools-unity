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
    methods:{
      //预览
      previewBtn(val){
        // let _content = '';
        // val.param.forEach(value=>{
        //   _content += value.content;
        // })
        // if(val.param.length===0 || !_content.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\r\n]/g,"").match(/[\u4e00-\u9fa5\0-9]/g)){
        //   this.$message.error('请确认当前段落含有有效文字！')
        //   return false
        // }
        UnityPreview(val.avatar.unity,JSON.stringify([val]))
      },
    }
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
