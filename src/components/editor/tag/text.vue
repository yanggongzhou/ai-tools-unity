<template>
  <el-form :model="textForm" :rules="rules" label-width="70px" @submit.native.prevent>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="展示区" prop="region">
          <el-select v-model="textForm.region" placeholder="请选择展示区域">
            <el-option v-for="(val,ind) in InfoModelData"
                       :key="ind+'text'"
                       :label="'展位'+val"
                       :value="val"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="颜色" prop="textColor">
          <div class="text_color-sty">
            <colorPicker v-model="textForm.textColor"/>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="对齐" prop="gravity">
          <el-select v-model="textForm.gravity" placeholder="请选择展示区域">
            <el-option label="居中" value="center"></el-option>
            <el-option label="左对齐" value="left"></el-option>
            <el-option label="右对齐" value="right"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8" >
        <el-form-item label="大小" prop="textSize">
          <el-select v-model="textForm.textSize" placeholder="请选择展示区域">
            <el-option v-for="(val,ind) in textSizeList"
                       :label="val"
                       :value="val"
                       :key="ind+'foot'"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
<!--      <el-col :span="8">-->
<!--        <el-form-item label="字体" prop="gravity">-->
<!--          <el-select v-model="textForm.fontFamily" placeholder="请选择展示区域">-->
<!--            <el-option v-for="(val, ind) in fontFamilyList" :key="ind+'font'" :label="val.label" :value="val.value"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </el-col>-->
    </el-row>
    <el-form-item label="设置时长" prop="dismissTimeType">
      <el-col :span="10">
        <el-select v-model="textForm.dismissTimeType" @change="textTypeChange" placeholder="请选择展示时长类型">
          <el-option v-for="(val,ind) in dismissTimeTypeData_img"
                     :key="ind+'dismissTimeType'"
                     :label="val.label" :value="val.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1"><p v-if="!textForm.isAll" class="center">-</p></el-col>
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
<!--    <el-form-item label="动画效果">-->
<!--      <el-col :span="10">-->
<!--        <el-select v-model="textForm.enter" placeholder="入场效果" clearable>-->
<!--          <el-option v-for="(val,ind) in animateList"-->
<!--                     :key="ind+'enter'"-->
<!--                     :label="val.label" :value="val.value"></el-option>-->
<!--        </el-select>-->
<!--      </el-col>-->
<!--      <el-col :span="1" class="center">-</el-col>-->
<!--      <el-col :span="10">-->
<!--        <el-select v-model="textForm.leave" placeholder="离场效果" clearable>-->
<!--          <el-option v-for="(val,ind) in animateList"-->
<!--                     :key="ind+'leave'"-->
<!--                     :label="val.label" :value="val.value"></el-option>-->
<!--        </el-select>-->
<!--      </el-col>-->
<!--    </el-form-item>-->

    <el-form-item label="字体内容">
      <el-input type="textArea" v-model="textForm.text"></el-input>
    </el-form-item>
        <el-form-item label="预览">
          <div class="text_preview">
            <p :style="{
                      'text-align':textForm.gravity,
                      'color':textForm.textColor,
                      'font-size':textForm.textSize+'px',
                      'font-family':textForm.fontFamily,
                      'width':'90%'
                    }">
              {{textForm.text}}
            </p>
          </div>
        </el-form-item>
    <el-form-item align="right">
      <button class="dialogBtn quxiao" @click.stop="cancel">取 消</button>
      <button class="dialogBtn queren" @click.stop="confrim">确 认</button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { AnimateList } from '../common/anmate-data'
  import {mapGetters} from "vuex";
  export default {
    computed: {
      ...mapGetters([
        'InfoModelData',
      ])
    },
    name: "textform",
    props:{
      textForm:Object,
    },
    data(){
      return{
        rules: {},
        textSizeList:["12","14","16","18","20","22","24","26","28","30","32",],
        fontFamilyList:[
          {label:"黑体",value:"SimHei",},
          {label:"沐瑶随心手写体",value:"沐瑶随心手写体",},
          {label:"站酷快乐体",value:"站酷快乐体",},
          {label:"包图小白体",value:"包图小白体",},
          {label:"千图小兔体",value:"千图小兔体",},
          {label:"王汉宗超黑体俏皮动物",value:"王汉宗超黑体俏皮动物",},
          {label:"王漢宗波卡體一空阴",value:"王漢宗波卡體一空阴",},
          {label:"新意吉祥宋",value:"新意吉祥宋",},
          {label:"Hanson-Bold",value:"Hanson-Bold",},
          {label:"HKGrotesk-MediumItalic",value:"HKGrotesk-MediumItalic",},
          {label:"Azedo-Bold",value:"Azedo-Bold",},
          {label:"联盟起艺卢帅正锐黑体",value:"联盟起艺卢帅正锐黑体",},
          {label:"仓耳周珂正大榜书",value:"仓耳周珂正大榜书",},
          {label:"PerfectMoment-Script",value:"PerfectMoment-Script",},
          {label:"寒蝉手拙体",value:"寒蝉手拙体",},
          {label:"胡晓波骚包体",value:"胡晓波骚包体",},
          {label:"庞门正道轻松体",value:"庞门正道轻松体",},
          {label:"点点像素体-方形",value:"点点像素体-方形",},
          {label:"点点像素体-菱形",value:"点点像素体-菱形",},
          {label:"点点像素体-圆形",value:"点点像素体-圆形",},
          {label:"Silver",value:"Silver",},
          {label:"猫猫朋友体",value:"猫猫朋友体",},
          {label:"锐字真言体",value:"锐字真言体",},
          {label:"站酷庆科黄油体",value:"站酷庆科黄油体",},
          {label:"站酷快乐体2016",value:"站酷快乐体2016",},
          {label:"恐怖明朝体",value:"恐怖明朝体",},
          {label:"沐瑶软笔手写体",value:"沐瑶软笔手写体",},
          {label:"庞门正道粗书体",value:"庞门正道粗书体",},
          {label:"Tropikal-Bold",value:"Tropikal-Bold",},
          {label:"素材集市酷方体",value:"素材集市酷方体",}
        ],
        dismissTimeTypeData_img:[
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
      textTypeChange(val){
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
      cancel(){
        this.$emit('cancel')
      },
      confrim(){
        this.$emit('confirm',this.textForm)
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
  .text_preview{
    padding: 3px;
    border: 1px dashed gainsboro;
    border-radius: 3px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text_color-sty{
    width: 35px;
    height: 30px;
    border: 1px solid gainsboro;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
