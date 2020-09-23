<template>
  <div class="leftBox">
    <div class="left_div"
         v-for="(val,ind) in radioData"
         :key="ind+'model'">
      <div class="left_icon">
        <i class="view el-icon-view"></i>
        <i class="delete el-icon-delete"></i>
      </div>

      <el-radio
        @change="radioChange"
        class="left_card"
        v-model="scriptIndex" :label="ind" border>
        <div class="left_card_item">
          <div class="label">{{val.label}}</div>
        </div>
      </el-radio>
    </div>
    <div class="left_add">
      + 添加
    </div>
  </div>
</template>
<script>
  export default {
    data(){
      return{
        radioData:[
          {ind:1,label:'01'},
          {ind:2,label:'02'},
          {ind:3,label:'03'}
        ],
        scriptIndex:0
      }
    },
    methods:{
      radioChange(){

      },
    }
  }
</script>
<style lang="less" scoped>
  /deep/.el-radio{
    color: #E87E4D !important;
  }
  /deep/.el-radio.is-bordered.is-checked{
    background: #E87E4D !important;
  }
  /deep/.el-radio__input.is-checked+.el-radio__label{
    color: #FFFFFF!important;
  }

  .leftBox{
    width: 68px;
    height: 300px;
    text-align: right;
    position: relative;
    .left_div{
      position: relative;
      .left_icon{
        position: absolute;
        left: 18px;
        z-index: 1;
        font-size: 13px;
        width: 18px;
        color: #FFFFFF;
        transition: all .3s;
        .view{
          cursor: pointer;
          background: #999999;
          padding: 2px;
          transition: all .3s;
          &:hover{
            background: #4CAF50;
          }
        }
        .delete{
          cursor: pointer;
          margin-top: 1px;
          padding: 2px;
          background: #999999;
          transition: all .3s;
          &:hover{
            background: #f54007;
          }
        }
      }
      &:hover .left_icon{
        left: 0px;
      }
    }
    .left_card{
      position: relative;
      z-index: 10;
      width: 50px;
      height: 35px!important;
      margin-top: 0px;
      padding: 0!important;;
      overflow: hidden;
      margin-left: 0px !important;
      margin-right: 0px !important;
      border: none;
      border-top: 1px solid #E87E4D;
      border-radius: 0px;
      background: #FFFFFF!important;
      /deep/.el-radio__input{
        display: none;
      }
      /deep/.el-radio__label{
        padding-left: 0;
      }

      .left_card_item{
        font-size: 0;
        .label{
          font-size: 13px;
          font-weight: 600;
          height: 34px;
          line-height: 34px;
          text-align: center;
        }
      }
    }
    .left_add{
      font-size: 13px;
      color: #E87E4D;
      position: absolute;
      bottom: 0px;
      padding: 8px 15px;
      transition: all .3s;
      &:hover{
        cursor: pointer;
        color: rgba(232, 126, 77, 0.84);
        background: rgba(140, 147, 157, 0.19);
      }
    }
  }

</style>
