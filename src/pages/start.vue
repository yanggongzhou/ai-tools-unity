<template>
  <div class='homepage'>
    <div class="ball"></div>
    <div class="shadow"></div>
<!--    <img class="pandaImg" src='https://large.magics-ad.com/ai-3D/static/img/panda.png' alt="">-->
  </div>
</template>
<script>
  import {requestServices} from "../api/api";

  export default {
    data(){
      return{}
    },
    mounted() {
      this.$Session.set('Edit_JSON',"{}")
      //测试专用，后拼接账号密码可在控制台查看登陆信息
      if(this.$route.query.phone){
        requestServices.login({
          phone:this.$route.query.phone,
          password:this.$route.query.password,
          role_id:23
        }).then(res=>{
          console.log('\x1b[33m%s\x1b[0m','账号信息',res)
          WebUserMessage(res.result.user_profile.id,res.result.access_token,res.result.user_profile.phone)
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .homepage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    /*background: #f9f2ff;*/
    .pandaImg{
      width: 300px;
      height: auto;
    }
  }
  .homepage {
    background-image: linear-gradient(to bottom right, #fffdfd, #fbe3e9, #f7ced8, #fbd5df, #f9e8ec, #fffdfd);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
  }

  .ball {
    animation: float 3.5s ease-in-out infinite;
    height: 200px;
    width: 200px;
    border-radius: 50%;
    position: relative;

    background: radial-gradient(
      circle at 75% 30%,
      white 5px,
      aqua 8%,
      darkblue 60%,
      aqua 100%
    );
    box-shadow: inset 0 0 20px #fff, inset 10px 0 46px #eaf5fc,
    inset 88px 0px 60px #c2d8fe, inset -20px -60px 100px #fde9ea,
    inset 0 50px 140px #fde9ea, 0 0 90px #fff;
  }

  @keyframes float {
    0% {
      transform: translatey(0px);
    }
    50% {
      transform: translatey(-80px);
    }
    100% {
      transform: translatey(0px);
    }
  }

  .shadow {
    background: #b490b2;
    width: 120px;
    height: 30px;
    top: 70%;
    animation: expand 3.5s infinite;
    position: absolute;
    border-radius: 50%;
  }
  @keyframes expand {
    0%,
    100% {
      transform: scale(1.5);
    }
    50% {
      transform: scale(0.8);
    }
  }

  @media only screen and (max-width: 500px) {
    .ball {
      animation: float 4.5s ease-in-out infinite;
      height: 120px;
      width: 120px;

      background: radial-gradient(
        circle at 65% 35%,
        white 5px,
        aqua 15%,
        darkblue 50%,
        aqua 100%
      );
      box-shadow: inset 0 -20px 30px #fff, inset 40px 0 46px #eaf5fc,
      inset 58px 0px 60px #c2d8fe, inset -8px -30px 100px #fde9ea,
      inset 0 20px 110px #fde9ea, 0 0 90px #fff;
    }
    .shadow {
      width: 90px;
      height: 20px;
      top: 78%;
      animation: expand 5s infinite;
    }

    @keyframes float {
      0% {
        transform: translatey(0px);
      }
      50% {
        transform: translatey(-50px);
      }
      100% {
        transform: translatey(0px);
      }
    }
  }
</style>
