<template>
<div class="uploadBox">
  <el-upload
    style='margin-bottom:10px'
    ref="zipUpload"
    :action="uploadUrl"
    :data="{
                user_id: user_id,
                access_token:access_token,
                target: 1,
                type: 0
              }"
    :file-list="tempList"
    :on-success="fileSuccess"
    :on-change="fileChange"
    :auto-upload="false">
    <el-button type='warning' size="small" round>
      <span v-if="videoVisible">上传视频</span>
      <span v-if="!videoVisible">上传图片</span>
    </el-button>
  </el-upload>
    <span v-if="videoVisible" class="upload_tip">*支持MP4格式，最大不超过200M</span>
    <span v-if="!videoVisible" class="upload_tip">*支持jpg、png、gif格式，最大不超过5M</span>
<!--  <video v-if="videoUrl" :src="videoUrl" class="avatar" controls></video>-->
</div>
</template>
<script>
  import {requestServices} from "../../api/api";

  export default{
    props:{
      videoVisible:Boolean,
      imgVisible:Boolean,
    },
    data(){
      return{
        uploadUrl:'',
        tempList:[],

        user_id:"",
        access_token:"",
      }
    },
    watch:{
      videoVisible(val){
        if(val){
          this.tempList = [];
        }
      },
      imgVisible(val){
        if(val){
          this.tempList = [];
        }
      }
    },
    created() {
      this.uploadUrl = requestServices.uploadUrl
    },
    mounted() {
      this.access_token=this.$Session.get('ai_user_token')
      this.user_id = this.$Session.get('ai_user_id')
    },
    methods:{

      fileChange(file){
        if(this.videoVisible){
          const isMP4 = file.raw.type === 'video/mp4';
          // const isAVI = file.raw.type === 'video/avi';
          // const isMOV = file.raw.type === 'video/quicktime';
          const isLt200M = file.raw.size / 1024 / 1024 < 200;
          // !isMP4&&!isAVI&&!isMOV
          if (!isMP4) {
            this.$message.error('上传视频只支持 mp4 格式!');
            return false;
          }
          if (!isLt200M) {
            this.$message.error('上传视频大小不能超过 200MB!');
            return false;
          }
          this.$refs.zipUpload.submit();
        }else{
            const isGif = file.raw.type === 'image/gif';
            const isPNG = file.raw.type === 'image/png';
            const isJPG = file.raw.type === 'image/jpeg';
            const isLt5M = file.raw.size / 1024 / 1024 < 5;
            if (!isJPG&&!isPNG&&!isGif) {
              this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
              this.tempList = [];
              return false;
            }
            if (!isLt5M) {
              this.$message.error('上传图片大小不能超过 5MB!');
              this.tempList = [];
              return false;
            }
            this.$refs.zipUpload.submit();
        }

      },
      fileSuccess(res,file){
        if(res.return_code===1000) {
          if(this.videoVisible){
            this.$emit('getDisplayVideo',{name: file.raw.name, url: res.result.upload_url})
          }else{
            this.$emit('getDisplayImg',{name: file.raw.name, url: res.result.upload_url})
          }
          this.tempList.push({name: file.raw.name, url: res.result.upload_url})
          if(this.tempList.length>1){
            this.tempList.shift()
          }
        }else {
          this.$message.error('素材上传失败，请重新上传!');
        }
      },

    }
  }
</script>
<style lang="less" scoped>
  .uploadBox{
    height: 68px;
    position: relative;
  }
  .upload_tip{
    position: absolute;
    top: 0px;
    left: 96px;
    font-size: 12px;
    color: #9E9E9E;
  }
</style>
