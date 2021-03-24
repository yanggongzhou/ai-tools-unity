<template>
  <el-form :model="imgForm" :rules="rules" label-width="80px" @submit.native.prevent>
    <el-form-item label-width="120px" label="ExhibitionSpace" prop="region">
      <el-select v-model="imgForm.region">
        <el-option
          v-for="(val,ind) in InfoModelData"
          :key="ind+'infoModel'"
          :label="'exhibition space'+val"
          :value="val"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="File">
      <v-upload :types="'img'" ref="uploadRefVideo" @getDisplayImg="getDisplayImg"></v-upload>
    </el-form-item>
    <el-form-item label="Duration" prop="dismissTimeType" >
      <el-col :span="10">
        <el-select v-model="imgForm.dismissTimeType" @change="imgTypeChange" >
          <el-option v-for="(val,ind) in dismissTimeTypeData"
                     :key="ind+'dismissTimeType'"
                     :label="val.label" :value="val.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1"><p  v-if="!imgForm.isAll" class="center">-</p></el-col>
      <el-col :span="7">
        <el-input-number
          style="width: 100px;"
          v-if="!imgForm.isAll"
          v-model="imgForm.dismissTime"
          controls-position="right"
          :precision="1" :min="0.1" :step="0.5" :max="3600"></el-input-number>
      </el-col>
      <el-col :span="4">
        <el-tag v-if="!imgForm.isAll">s</el-tag>
      </el-col>

    </el-form-item>
    <el-form-item label="Animate" >
      <el-col :span="10">
        <el-select v-model="imgForm.enter" placeholder="enter" clearable>
          <el-option v-for="(val,ind) in animateList"
                     :key="ind+'enter'"
                     :label="val.label" :value="val.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1" class="center">-</el-col>
      <el-col :span="10">
        <el-select v-model="imgForm.leave" placeholder="leave" clearable>
          <el-option v-for="(val,ind) in animateList"
                     :key="ind+'leave'"
                     :label="val.label" :value="val.value"></el-option>
        </el-select>
      </el-col>
    </el-form-item>
    <el-form-item align="right">
      <button class="dialogBtn quxiao" @click.stop="cancel">cancel</button>
      <button class="dialogBtn queren" @click.stop="confrim">confirm</button>
    </el-form-item>
  </el-form>
</template>

<script>
  import vUpload from "../common/upload";
  import { AnimateList } from '../common/anmate-data'
  import {mapGetters} from "vuex";
  export default {
    name: "imgform",
    components:{
      vUpload
    },
    props:{
      imgForm:Object,
    },
    computed: {
      ...mapGetters([
        'InfoModelData',
      ])
    },
    data(){
      return{
        rules: {},
        dismissTimeTypeData:[
          {label:'To the end of the play',value:1},
          {label:'Custom duration',value:2},
        ],
        animateList:[]
      }
    },
    created() {
      this.animateList = AnimateList
    },
    mounted() {

    },
    methods:{
      cleanTempList(domObj){
        if(domObj){
          this.$refs.uploadRefVideo.tempList= [{
            name: domObj.name,
            status: "success",
            uid: this.getGuid(),
            url: domObj.url
          }]
        }else{
          this.$refs.uploadRefVideo.tempList = []
        }
      },
      getGuid() {
        // 生成随机ID
        return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`;
      },
      getDisplayImg(Obj){
        this.imgForm.url = Obj.url;
        this.imgForm.name = Obj.name;
      },
      //图片时长转换
      imgTypeChange(val){
        switch (val) {
          case 1:
            this.imgForm.dismissTime = 999;
            this.imgForm.isAll = true;
            break;
          case 2:
            this.imgForm.dismissTime = 3;
            this.imgForm.isAll = false;
            break;
        }
      },
      cancel(){
        this.$emit('cancel')
      },
      confrim(){
        this.$emit('confirm',this.imgForm)
      },
    }
  }
</script>

<style lang="less" scoped>
  .dialogBtn{
    font-size: 12px;
    margin-top: 18px;
    display: inline-block;
    line-height: 1;
    padding: 5px 8px;
    margin-right: 8px;
    height: 34px;
    width: 92px;
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
    color: #a7a7a7;
  }
  .queren{
    background: #7694f3;
  }
</style>
