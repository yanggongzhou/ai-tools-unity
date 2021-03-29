<template>
  <div>
    <el-form :model="videoForm" :rules="rules" ref="videoForm" label-width="100px" @submit.native.prevent>
      <el-form-item label="展示区" prop="region">
        <el-select v-model="videoForm.region" placeholder="请选择展示区域">
          <el-option
            v-for="(val,ind) in InfoModelData"
            :key="ind+'infoModel'"
            :label="'展位'+val"
            :value="val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文件">
        <v-upload :types="'video'" ref="uploadRefVideo" @getDisplayVideo="getDisplayVideo"></v-upload>
      </el-form-item>
      <el-form-item label="设置时长" prop="dismissTimeType">
        <el-col :span="10">
          <el-select v-model="videoForm.dismissTimeType" @change="dismissTimeTypeChange" placeholder="请选择展示时长类型">
            <el-option v-for="(val,ind) in dismissTimeTypeData"
                       :key="ind+'dismissTimeType'"
                       :label="val.label" :value="val.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1"><p  v-if="!videoForm.isAll" class="center">-</p></el-col>
        <el-col :span="7">
          <el-input-number
            style="width: 100px;"
            v-if="!videoForm.isAll"
            v-model="videoForm.dismissTime" controls-position="right" :precision="1" :min="0.1" :step="0.5" :max="3600"></el-input-number>
        </el-col>
        <el-col :span="4">
          <el-tag v-if="!videoForm.isAll">s</el-tag>
        </el-col>
      </el-form-item>
<!--      <el-form-item label="动画效果" >-->
<!--        <el-col :span="10">-->
<!--          <el-select v-model="videoForm.enter" placeholder="入场效果" clearable>-->
<!--            <el-option v-for="(val,ind) in animateList"-->
<!--                       :key="ind+'enter'"-->
<!--                       :label="val.label" :value="val.value"></el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->
<!--        <el-col :span="1" class="center">-</el-col>-->
<!--        <el-col :span="10">-->
<!--          <el-select v-model="videoForm.leave" placeholder="离场效果" clearable>-->
<!--            <el-option v-for="(val,ind) in animateList"-->
<!--                       :key="ind+'leave'"-->
<!--                       :label="val.label" :value="val.value"></el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->
<!--      </el-form-item>-->
      <el-form-item label="声音设置" prop="isSupportAudio">
        <el-switch
          v-model="videoForm.isSupportAudio"
          active-text="开启"
          inactive-text="关闭">
        </el-switch>
      </el-form-item>
      <el-form-item align="right">
        <button class="dialogBtn quxiao" @click.stop="cancel">取 消</button>
        <button class="dialogBtn queren" @click.stop="confrim">确 认</button>
      </el-form-item>
    </el-form>
    <div style="display: none">
      <video id="videoDuration" :src="videoForm.videoUrl"></video>
    </div>
  </div>
</template>

<script>
  import vUpload from "../common/upload";
  import { AnimateList } from '../common/anmate-data'
  import {mapGetters} from "vuex";
  export default {
    name: "videoform",
    components:{
      vUpload
    },
    props:{
      videoForm:Object,
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
          // {label:'至视频播放结束',value:0},
          {label:'至剧本播放结束',value:1},
          {label:'自定义时长',value:2},
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
          this.$refs.uploadRefVideo.tempList=[]
        }
      },
      getGuid() {
        // 生成随机ID
        return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`;
      },
      getDisplayVideo(Obj){
        this.videoForm.videoUrl = Obj.url;
        this.videoForm.videoName = Obj.name;
      },
      //视频时长方式转换
      dismissTimeTypeChange(val){
        switch (val) {
          case 0:
            this.videoForm.dismissTime = document.getElementById('videoDuration').duration
            if(!this.videoForm.dismissTime){
              this.$message.warning('视频时长获取失败，请等待视频上传完成后再试！')
            }
            this.videoForm.isAll = false;
            break;
          case 1:
            this.videoForm.dismissTime = 999;
            this.videoForm.isAll = true;
            break;
          case 2:
            this.videoForm.dismissTime = 3;
            this.videoForm.isAll = false;
            break;
        }
      },
      cancel(){
        this.$emit('cancel')
      },
      confrim(){
        this.$emit('confirm',this.videoForm)
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
