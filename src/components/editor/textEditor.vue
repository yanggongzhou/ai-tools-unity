<template>
  <div>
    <el-form :model="textForm" :rules="textRules" ref="imgForm" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
      <el-row>
        <el-col :span="12">
          <el-form-item label="展示区" prop="region">
            <el-select v-model="textForm.region" placeholder="请选择展示区域">
              <el-option label="展位一" value="1"></el-option>
              <el-option label="展位二" value="2"></el-option>
              <el-option label="展位三" value="3"></el-option>
              <el-option label="展位四" value="4"></el-option>
              <el-option label="展位五" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字体颜色" prop="textColor">
            <el-input type="color" style="width: 65px"
                      v-model="textForm.textColor" @input="changeColor" @change="changeColor">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字体大小" prop="textSize">
            <el-select v-model="textForm.textSize" placeholder="请选择展示区域">
              <el-option v-for="(val,ind) in textSizeList"
                         :label="val"
                         :value="val"
                         :key="ind+'foot'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对齐方式" prop="gravity">
            <el-select v-model="textForm.gravity" placeholder="请选择展示区域">
              <el-option label="居中" value="center"></el-option>
              <el-option label="左对齐" value="left"></el-option>
              <el-option label="右对齐" value="right"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="设置时长" prop="dismissTimeType">
        <el-col :span="12">
          <el-select v-model="textForm.dismissTimeType" @change="dismissTimeTypeChange" placeholder="请选择展示时长类型">
            <el-option v-for="(val,ind) in dismissTimeTypeData"
                       :key="ind+'dismissTimeType'"
                       :label="val.label" :value="val.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1"><p class="center">-</p></el-col>
        <el-col :span="7">
          <el-input-number
            style="width: 100px;"
            v-if="!textForm.isAll"
            v-model="textForm.dismissTime" controls-position="right" :precision="1" :min="0.1" :step="0.5" :max="3600"></el-input-number>
        </el-col>
        <el-col :span="4">
          <el-tag v-if="!textForm.isAll">秒</el-tag>
        </el-col>
      </el-form-item>
<!--      <el-col :span="12">-->
<!--      </el-col>-->

      <el-form-item label="字体内容">
        <el-input type="textArea" v-model="textForm.text"></el-input>
      </el-form-item>
      <el-form-item label="预览">
        <div class="text_preview">
          <p :style="{
            'text-align':textForm.gravity,
            'color':textForm.textColor,
            'font-size':textForm.textSize+'px',
            'width':'90%'
          }">
            {{textForm.text}}
          </p>
        </div>
      </el-form-item>
      <el-form-item align="right">
        <button class="dialogBtn quxiao" @click.stop="cancelBtn">取 消</button>
        <button class="dialogBtn queren" @click.stop="saveBtn('text')">确 认</button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        textForm:{
          dismissTimeType:1,
          text:"测试字体",
          textColor:"#333333",
          region:"1",
          textSize:'14',
          gravity:"center",
          ellipsize:false,
          dismissTime:3,
          isAll:false,
        },
        dismissTimeTypeData:[
          {label:'至脚本播放结束',value:1},
          {label:'自定义时长',value:2},
        ],
        textSizeList:["12","14","16","18","20","22","24","26","28","30","32",],
        textRules:{},
      }
    },
    mounted() {
    },
    methods:{
      //选择颜色
      changeColor(val){
        // console.log(val)
      },
      dismissTimeTypeChange(val){
        switch (val) {
          case 1:
            this.textForm.dismissTime = 999;
            this.textForm.isAll = true;
            break;
          case 2:
            this.textForm.dismissTime = 3;
            this.textForm.isAll = false;
            break;
        }
      },
      cancelBtn(){
        this.$emit('cancelBtn','text')
      },

      saveBtn(){
        this.$emit('saveBtn','text',this.textForm)
      }
    }
  }
</script>
<style lang="less" scoped>
  .text_preview{
    padding: 3px;
    border: 1px solid gainsboro;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dialogBtn{
    font-size: 12px;
    margin-top: 18px;
    display: inline-block;
    line-height: 1;
    padding: 5px 8px;
    margin-right: 8px;
    height: 33px;
    width: 78px;
    border-radius: 32px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    background: #fff;
    transition: all 0.3s;
    color: #FFFFFF;
    &:hover {
      opacity: .7;
    }
    &:focus {
      outline: none;
    }
  }
  .quxiao{
    color: #757575;
  }
  .queren{
    background: #7455FF;
  }
</style>
