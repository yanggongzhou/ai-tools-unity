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
          text:"测试字体",
          textColor:"#333333",
          region:"1",
          textSize:'14',
          gravity:"center",
          ellipsize:false,
        },
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
