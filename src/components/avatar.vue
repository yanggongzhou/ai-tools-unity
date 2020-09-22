<template>
  <canvas
    class="avatar-canvas"
    ref="magics"
    :width="canvasWidth"
    :height="canvasHeight">
  </canvas>
</template>
<script>
  import {resultJSON} from "../api/result";
  export default {
    props:{
      avatarID:Number,
      canvasWidth:Number,
      canvasHeight:Number,
    },
    data(){
      return{
        actionList:[],//动作
        actionShowList:[],
        magics:'',
        actionMap:{},//动作时长
        isExpress:false,//是否语音播放中
      }
    },
    mounted() {

    },
    methods:{

      initAvatar(canvasWidth,canvasHeight,isPos){
        console.log()
        this.avatarLoading = true;
        let self = this;
        let canvas = this.$refs.magics;
        if(!canvas) return false;
        this.magics = new Magics.AssistantRender(canvas,canvasWidth, canvasHeight);
        let _name = '',_resourceUrl='';
        resultJSON.avatarData.forEach(val=>{
          if(val.ind===this.avatarID){
            _name = val.name;
            _resourceUrl = val.resourceUrl;
          }
        })
        this.magics.loadResource(_name,_resourceUrl);
        this.magics.startRender();
        if(isPos){
          canvas.addEventListener('mousedown', function (event) {
            event.preventDefault();
            // var res = self.magics.pickupAvatar(event.clientX-canvas.getBoundingClientRect().left, event.clientY-canvas.getBoundingClientRect().top);
            // if (res) {
            //   console.log(event.clientX, event.clientY, '选中了。。。');
            // } else {
            //   console.warn(event.clientX, event.clientY, '未选中');
            // }
            let _left = event.clientX-canvas.getBoundingClientRect().left;
            let _top = event.clientY-canvas.getBoundingClientRect().top
            resultJSON.resultJsonObj.avatar.def.x = _left/resultJSON.avatarBox.width
            resultJSON.resultJsonObj.avatar.def.y = _top/resultJSON.avatarBox.height
            // console.log(event.clientX-canvas.getBoundingClientRect().left,event.clientY-canvas.getBoundingClientRect().top)
            self.magics.setAvatarScreenPt(_left, _top);
            // console.log(resultJSON.resultJsonObj.avatar.def.x, resultJSON.resultJsonObj.avatar.def.y)
            // let box= magics.getAvatarBoundingBox();
            // resultJSON.resultJsonObj.avatar.def.x = box[0].x/resultJSON.avatarBox.width
            // resultJSON.resultJsonObj.avatar.def.y = box[1].y/resultJSON.avatarBox.height
          });
        }

        // //智能客服初始化成功回调
        // Magics.on(Magics.AVATAR_LOADED, function (res) {
        //   console.log('init success')
        // });
        //智能客服动画初始化成功回调
        Magics.on(Magics.AVATAR_ACTIONS_LOADED, function (res) {
          self.actionMap= self.magics.getActionMap();
          self.actionList = self.magics.getActionList()
          console.log(self.actionMap)
          self.actionShowList = [];
          Object.keys(self.actionMap).forEach((val,ind)=>{
            self.actionShowList.push({
              label:self.actionMap[val].info,
              value:val
            })
          })
          self.$emit('avatarInit',self.magics, self.actionShowList,self.actionList)
          self.magics.setEyeExpression(true);//眨眼
          // 21、显示/隐藏 Avatar 在地面上的影子
          // self.magics.showAvatarShadow(true);
        });
        // //智能客服资源加载成功回调
        // Magics.on(Magics.EFFECT_LOADED, function (res) {
        //   console.log('loading success',res)
        // });
        //智能客服资源加载失败回调
        Magics.on(Magics.EFFECT_LOAD_ERR, function (res) {
          console.log('error',res)
          self.$message.error('资源加载失败')
        });
        // //智能客服动作播放开始回调
        // Magics.on(Magics.ACTION_BEGIN, function (res) {
        //   // console.log('动作播放开始',res)
        // });
        // //智能客服动作播放结束回调
        // Magics.on(Magics.ACTION_END, function (res) {
        //   console.log('动作播放结束',res)
        // });
        // //智能客服表情播放开始回调-语音
        // Magics.on(Magics.EXPRESS_BEGIN, function (res) {
        //   if(res.tag===Magics.TYPE_MOUTHSPEAK){
        //     console.log('语音表情播放开始',res)
        //   }
        // });
        // //智能客服表情播放结束回调-语音
        // Magics.on(Magics.EXPRESS_END, function (res) {
        //   if(res.tag===Magics.TYPE_MOUTHSPEAK){
        //     console.log('语音表情播放结束',res)
        //   }
        // });
      },
    }
  }
</script>
<style scoped>
  .avatar-canvas{
    position: absolute;
    left: 0px;
    top: 0px;
    /*z-index: 99;*/
    transition: all 1s;
  }
</style>
