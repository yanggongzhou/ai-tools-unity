<template>
<div class="uploadBox">
  <el-upload
    style='margin-bottom:10px'
    ref="zipUpload"
    :action="uploadUrl"
    :data="uploadData"
    :file-list="tempList"
    :on-success="fileSuccess"
    :on-change="fileChange"
    :auto-upload="false">
    <el-button type='warning' size="small" round>
      <span v-if="types==='video'">Upload video</span>
      <span v-if="types==='img'">Upload image</span>
    </el-button>
  </el-upload>
  <span v-if="types==='video'" class="upload_tip">*Support MP4 format, up to 200M</span>
  <span v-if="types==='img'" class="upload_tip">*Support JPG, PNG, GIF format, up to 5M</span>
</div>
</template>
<script>
  import {requestServices} from "../../../api/api";

  export default{
    props:{
      types:String
    },
    data(){
      return{
        uploadUrl:'',
        tempList:[],
        uploadData: {
          user_id: '',
          access_token:'',
          target: 1,
          type: 0
        }
      }
    },
    created() {
      this.uploadData.access_token=this.$Session.get('ai_user_token')
      this.uploadData.user_id = this.$Session.get('ai_user_id')

      this.tempList = [];
      this.uploadUrl = requestServices.uploadUrl
    },
    methods:{

      fileChange(file){
        // console.log(file);
        switch (this.types) {
          case 'video':
            const isMP4 = file.raw.type === 'video/mp4';
            // const isAVI = file.raw.type === 'video/avi';
            // const isMOV = file.raw.type === 'video/mov';
            const isLt256M = file.raw.size / 1024 / 1024 < 200;
            if (!isMP4) { //&&!isAVI&&!isMOV
              this.$message.error('Upload video can only be in MP4 format!'); ///avi/mov
              this.tempList = [];
              return false;
            }
            if (!isLt256M) {
              this.$message.error('Upload video size cannot exceed 200MB!');
              this.tempList = [];
              return false;
            }
            // this.uploadData.asset_type = 5;
            // this.uploadData.is_large = 0;
            this.$refs.zipUpload.submit();
            break;
          case 'img':
            const isGif = file.raw.type === 'image/gif';
            const isPNG = file.raw.type === 'image/png';
            const isJPG = file.raw.type === 'image/jpeg';
            const isLt5M = file.raw.size / 1024 / 1024 < 5;
            if (!isJPG&&!isPNG&&!isGif) {
              this.$message.error('The uploaded image can only be in JPG / PNG / GIF format!');
              this.tempList = [];
              return false;
            }
            if (!isLt5M) {
              this.$message.error('The size of the uploaded image cannot exceed 5MB!');
              this.tempList = [];
              return false;
            }
            // this.uploadData.asset_type = 4;
            // this.uploadData.is_large = 0;
            this.$refs.zipUpload.submit();
            break;
        }
      },
      fileSuccess(res,file){
        switch (this.types) {
          case 'video':
            this.$emit('getDisplayVideo',{name: file.raw.name, url: res.result.upload_url})
            break;
          case 'img':
            this.$emit('getDisplayImg',{name: file.raw.name, url: res.result.upload_url})
            break;
        }
        this.tempList.push({name: file.raw.name, url: res.result.upload_url})
        if(this.tempList.length>1){
          this.tempList.shift()
        }
      },

    }
  }
</script>
<style lang="less" scoped>
  .uploadBox{
    height: 68px;
  }
  .upload_tip{
    position: absolute;
    top: 0px;
    left: 105px;
    font-size: 12px;
    color: #9E9E9E;
  }
</style>
