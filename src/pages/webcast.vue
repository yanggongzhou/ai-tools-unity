<template>
    <div id="webcast">
        <div class="common_content">

          <div class="scriptList">
            <div class="titleBox">
              <span class="titleSpan">剧本列表</span>
            </div>
            <div class="tabs">
              <span class="tab" :class="{'selected': currentSetting==1}" @click='checkSetting(1)'>剧本设置</span>
              <span class="tab" :class="{'selected': currentSetting==2}" @click='checkSetting(2)'>场景话术</span>
            </div>
            <div v-if='currentSetting==1'>
              <div style="text-align: right" class="clearfix">
                <button class='addScript' type='primary' @click='addScript'>+ 添加剧本</button>
              </div>
              <span class="playSetting" @click='handlePlaySetting(true)' v-if='isShowPlaySettingFun'>播放设置</span>

              <el-table size="mini" class='playScripts' row-key="sortId"  :data='playScriptData' style='width:100%' empty-text='暂未添加剧本' height='388' max-height='388' >
                <el-table-column align="center" label="排序" width='100'>
                  <template slot-scope="scope">
                    <!--                            <i class="el-icon-video-camera-solid" v-if='isPlayingIdx==scope.$index+1'></i>-->
                    <span>{{scope.$index+1}}</span>
                    <span style='display:none;'>{{scope.row.sortId}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="商品号">
                  <template slot-scope="scope">
                    <div class="goods clearfix">
                      <span>{{scope.row.commodity_id}}</span>
                      <i class="el-icon-edit-outline" :ref="'setGoodsIdIcon'+scope.row.id" @click='showSetGoodsId(scope.row.id, scope.row.commodity_id)'></i>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="剧本名称">
                  <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="关联IP形象">
                  <template slot-scope="scope">
                    <span>{{scope.row.avatar_name}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="剧本段数">
                  <template slot-scope="scope">
                    <span>{{scope.row.paragraph_number}}</span>
                  </template>
                </el-table-column>
                <el-table-column width="100" align="center" label="播放权重" :render-header="renderWeightHeader">
                  <template slot-scope="scope">
                    <!-- <span>{{handleScriptWeight(scope.row.weight)}}</span> -->
                    <el-select v-model='scope.row.weight' @change='handleChangePlayWeight(scope.row.id, scope.$index)'>
                      <el-option v-for='item in playWeight' :key='item.value' :label='item.label' :value='item.value' ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" :render-header="renderHeader" width='120' >
                  <template slot-scope="scope">
                    <el-button @click='handleDelete(scope.$index, scope.row.id)' type="text" size="small">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 剧本列表 -->
              <transition name='slide'>
                <div class="allScriptList" v-if='isShowAllList'>
                  <h3>剧本列表</h3>
                  <div class="filter">
                    <span>关联IP形象：</span>
                    <el-select class="filterOptions" @change='fetchAllScripts' v-model='anchorRoleValue'>
                      <el-option
                        v-for='(role,idx) in anchorRoles'
                        :key='idx'
                        :label='role.label'
                        :value='role.value'
                      ></el-option>
                    </el-select>
                    <el-button class='search_btn' @click="fetchAllScripts">查询</el-button>
                    <el-input  class='search_ipt' v-model="searchScriptName" placeholder="剧本名称" clearable></el-input>
                  </div>

                  <el-table size="mini" border :data='scriptData' style='width:100%' empty-text='暂无剧本' max-height='250' v-if='scriptData.length!=0'>
                    <el-table-column label="选择" align="center" width='80'>
                      <template slot-scope="scope">
                        <el-checkbox size="mini" v-model="scope.row.isChecked" :disabled="scope.row.isDisabled" @change='handleCheckScript(scope.$index)'></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column label="剧本名称" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="关联IP形象" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.avatar_name}}</span>
                      </template>
                    </el-table-column>
                    <!--                            <el-table-column label="剧本时长" align="center">-->
                    <!--                                <template slot-scope="scope">-->
                    <!--                                    <span>{{handleScriptTime(scope.row.time)}}</span>-->
                    <!--                                </template>-->
                    <!--                            </el-table-column>-->
                    <el-table-column label="剧本段数" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.paragraph_number}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width='100'>
                      <template slot-scope="scope">
                        <el-button class="previewBtn" @click='handlePreview(scope.row)' type="text" size="mini">预览</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="noScript" v-if='scriptData.length==0'>
                    暂无剧本，去 <span @click='gotopage'>创建剧本</span>
                  </div>

                  <div class="chooseBox">
                    <!-- :indeterminate='isChooseAllScript'  -->
                    <el-checkbox v-model='checkAll' :disabled="checkAllDisabled" @change='handleCheckAll' v-if='scriptData.length!=0'>全选</el-checkbox>
                    <span>
                              <button class='cancelChoose' @click="cancelChoose">取消</button>
                              <button class='confirmChoose' :class="{'disabled': !isAddedScript}" v-if='scriptData.length!=0' type="primary" @click="confirmChoose">确定</button>
                          </span>
                  </div>
                </div>
              </transition>

              <!-- 播放设置 -->
              <transition name='slide'>
                <div class="playSettingWrap" v-if='isShowPlaySetting'>
                  <i class="el-icon-close" @click='handlePlaySetting(false)'></i>
                  <p class="title">播放设置</p>
                  <PlaySetting :tabsHeight='playTableHeight'></PlaySetting>
                </div>
              </transition>
            </div>

            <div v-if='currentSetting==2' class="sceneWords">
              <sceneWords></sceneWords>
            </div>


          </div>
          <div class="handleWebcastBtnBox">
            <button class='handleWebcastBtn' v-if="playScriptData.length" :class="{'disabled': isShowAllList}" @click='handleWebcast'>
              <span></span>
              开始直播
            </button>

          </div>
        </div>
      <div class="setGoodsId" v-if='isShowSetGoodsId' :style='setGoodsIdStyle'>
        <el-input placeholder="请输入对应的商品号" v-model="iptGoodsId" maxlength='3' @input="handleIptGoodsId"></el-input>
        <button class="cancel" @click='cancelSetGoodsId'>取消</button>
        <button class="confirm" @click='confirmSetGoodsId'>保存</button>
      </div>
    </div>
</template>
<script>
import Sortable from 'sortablejs';
import { requestServices } from '../api/api';
import axios from "axios";
import sceneWords from '../components/sceneWords/sceneWords';
import PlaySetting from "../components/webcast/playSetting"
export default {
    components:{
      sceneWords,
      PlaySetting
    },
    filters: {},
    data() {
        return {
            isShowPlaySetting: false,
            isShowPlaySettingFun: true, // 是否支持播放设置功能
            playTableHeight: 500,

            currentSetting: 1, // 1-剧本设置 2-场景话术

            playScriptData: [],
            playScriptID: [],
            isShowAllList: false,
            isChooseAllScript: true,
            checkAll: false,
            searchScriptName: '',
            anchorRoles: [
              {
                value: '',
                label: '全部'
              },
              {
                value: '小迈',
                label: '小迈'
              },
              {
                value: '小吉',
                label: '小吉'
              },
              {
                value: '宝爷',
                label: '宝爷'
              },
              {
                value:'不白吃',
                label: '不白吃'
              },
              {
                value:'潇洒姐',
                label: '潇洒姐'
              },
              {
                value:'乐比',
                label: '乐比'
              }
            ],
            anchorRoleValue: '',

            scriptData: [],
            isAddedScript: false,

            checkAllDisabled: false,
          playWeight: [
            {
              value: 10,
              label: '最高'
            },
            {
              value: 7,
              label: '高'
            },
            {
              value: 5,
              label: '中'
            },
            {
              value: 2,
              label: '低'
            },
          ],
          previewReady:true,
          previewData:{
              name:'',
            script:''
          },

          isShowSetGoodsId: false,
          editGoodsIdBtnTop: 0,
          editGoodsIdBtnLeft: 0,
          currentEditGSID: -1, // 当前编辑的脚本ID
          iptGoodsId: '', // 当前输入的商品ID
        };
    },
  computed: {
    setGoodsIdStyle() {
      const style = {}
      style.top = this.editGoodsIdBtnTop + 'px';
      style.left = this.editGoodsIdBtnLeft + 'px';
      return style
    },
  },
    created() {
      window.WebPreviewReady = this.WebPreviewReady;
      window.WebSelectAvatarState=this.WebSelectAvatarState;
    },
    mounted() {
        // this.sortPlayScript();
        this.fetchAllPrograms();
        this.fetchAllScripts();
    },
    methods: {
      handlePlaySetting(_flag) {
        this.isShowPlaySetting = _flag;
      },
      cancelSetGoodsId() {
        this.isShowSetGoodsId = false;
        this.iptGoodsId = '';
      },
      confirmSetGoodsId() {
        if(this.iptGoodsId=='') {
          this.$message.error('商品号不能为空');
          return;
        }
        let _flag = false
        for(let i=0; i<this.playScriptData.length; i++) {
          if(this.playScriptData[i].commodity_id==this.iptGoodsId) {
            _flag = true;
            break;
          }
        }
        if(_flag) {
          this.$message.error('已添加过该商品号噢～');
          return
        }
        this.isShowSetGoodsId = false;
        requestServices.updateGsProgram({
          role_id: 23,
          user_id: this.$Session.get('ai_user_id'),
          access_token: this.$Session.get('ai_user_token'),
          gs_id: this.currentEditGSID,
          commodity_id: this.iptGoodsId,
        }).then(res => {
          if(res.return_code==1000) {
            this.$message.success('添加成功')
            this.fetchAllPrograms();
          }else {
            this.$message.error('添加失败')
          }
        })
        this.currentEditGSID = -1;
        this.iptGoodsId = '';
      },
      handleIptGoodsId() {
        this.iptGoodsId = this.iptGoodsId.replace(/[^\d]/g, '');
      },
      //商品号编辑
      showSetGoodsId(_scriptID, _goodsId) {
        this.iptGoodsId = _goodsId=='--'?'':_goodsId;
        this.currentEditGSID = _scriptID;
        this.isShowSetGoodsId = true;
        let rect = this.$refs['setGoodsIdIcon'+_scriptID].getBoundingClientRect();
        this.editGoodsIdBtnTop = rect.top;
        this.editGoodsIdBtnLeft = rect.left+30;
      },
        renderWeightHeader(h, {column}) {
          return  h(
            'div',
            {
              style: 'display:flex;margin:auto;justify-content:center;'
            },
            [
              h('span', column.label),
              h('promptMessages', {
                props: {
                  messages: ['权重越高，随机播放时，被重复播放几率越大！'],
                  icon: 'el-icon-question',
                  iconStyle: 'color:#666666;margin-left:5px;cursor:pointer;',
                  iconClick: this.emptyList
                }
              })
            ],
          );
        },
      handleChangePlayWeight(_scriptID, _idx) {
        // console.log('handleChangePlayWeight: ', _scriptID, _idx, this.playScriptData[_idx].weight)
        requestServices.updateGsProgram({
          role_id: 23,
          user_id: this.$Session.get('ai_user_id'),
          access_token: this.$Session.get('ai_user_token'),
          gs_id: _scriptID,
          weight: this.playScriptData[_idx].weight
        }).then(res => {
          if(res.return_code==1000) {
            this.$message.success('修改成功')
            this.fetchAllPrograms();
          }else {
            this.$message.error('修改失败')
          }
        })
      },
        checkSetting(_id) {
          if(this.isShowPlaySetting) return;
          this.currentSetting = _id;
        },
        handlePreview(row) {
          axios.get(row.script_url)
            .then(res=>{
              if(res.status===200){
                // this.$message.warning('剧本数据获取异常，请重试')
                // UnityPreview(res.data[0].avatar.unity,JSON.stringify(res.data))
                this.previewData.name = res.data[0].avatar.unity;
                this.previewData.script = JSON.stringify(res.data)
                UnityPreviewCancel();
                UnityChangeAvatar(res.data[0].avatar.unity);
              }else{
                this.$message.warning('剧本数据获取异常，请重试')
              }
            })
        },
        WebSelectAvatarState(state){
          if(state==='True'){
            UnityPreview(this.previewData.name,this.previewData.script,"True","True")
          }else if(state==='False'){
            this.$message.error('切换角色失败，请重试')
            // this.previewReady = false;
          }
        },
        WebPreviewReady(state){
          if(state==='True'){
            UnityPreviewStart(this.previewData.name);
          }else if(state==='False'){
            this.$message.error('加载资源失败，请重试')
          }
          this.previewReady = true;
        },

        // 获取播放剧本列表
        fetchAllPrograms() {
            requestServices.getAllPrograms({
                role_id:23,
                user_id: this.$Session.get('ai_user_id'),
                access_token: this.$Session.get('ai_user_token'),
            }).then(res => {
                // console.log('res: ', res)
                if(res.return_code == 1000) {
                    this.playScriptData = res.result.programs;
                    this.fetchPlayScriptIDs();
                    this.sortPlayScript();
                }else if(res.return_code==1009) { // token过期
                    // this.$Session.set('ai_user_id', '');
                    // this.$Session.set('ai_user_token', '')
                    // this.$router.push({name:"home"})
                }
            })
        },
        fetchPlayScriptIDs() {
            let selectedIds = [];
            this.playScriptData.forEach(item => {
                selectedIds.push(item.id);
            })
            this.playScriptID = selectedIds;
        },
        // 获取所有剧本列表
        fetchAllScripts() {
            requestServices.getAllScripts({
                role_id:23,
                user_id: this.$Session.get('ai_user_id'),
                access_token: this.$Session.get('ai_user_token'),
                gs_name: this.searchScriptName, // 剧本名称
                avatar_name: this.anchorRoleValue, // 精灵名称
                scene_type: '' // 场景类型；0-默认类型；1-淘宝；2-抖音；3-快手
            }).then(res => {
                // console.log('getAllScripts: ', res)
                if(res.return_code == 1000) {
                    this.scriptData = res.result.guide_shopping;
                    this.checkAll = false;
                    this.isAddedScript = false;
                    this.handleShowAllList();
                }
            })
        },
        sortPlayScript() {
            if(this.playScriptData.length==0 ) return;
            // 产生唯一值方便拖拽

            this.playScriptData.forEach((item, id) => {
                item.sortId = this.guid();
            })
            const tbody = document.querySelector('.playScripts .el-table__body-wrapper tbody')
            const _this = this;
            this.sortObj = null;
            this.sortObj = new Sortable(tbody, {
                onEnd({ newIndex, oldIndex }) {
                    console.log(oldIndex, newIndex);

                    requestServices.sortPrograms({
                        role_id:23,
                        user_id: _this.$Session.get('ai_user_id'),
                        access_token: _this.$Session.get('ai_user_token'),
                        start_location: _this.playScriptData[oldIndex].sort,
                        end_location: _this.playScriptData[newIndex].sort
                    }).then(res=>{
                        if(res.return_code==1000) {
                            _this.fetchAllPrograms();
                        }
                    })
                }
            })
        },
        addScript() {
            this.isShowAllList = true;
            // console.log(this.playScriptID)
            this.handleShowAllList(true);
        },
        handleShowAllList(_flag) {
            if(_flag) {
                this.scriptData.forEach(item => {
                    item.isChecked = false;
                    item.isDisabled = false;
                })
            }
            let checkedCount = 0;
            this.playScriptID.forEach(id => {
                this.scriptData.forEach(item => {
                    if(id == item.id) {
                        item.isChecked = true;
                        item.isDisabled = true;
                        checkedCount++;
                    }
                });
            })
            if(this.scriptData.length!=0) {
                if(this.playScriptID.length==this.scriptData.length&&checkedCount>0||this.scriptData.length==checkedCount) {
                    this.checkAll = true;
                    this.isAddedScript = true;
                    this.checkAllDisabled = true;
                }else if(this.playScriptID.length>0&&checkedCount>0) {
                    this.checkAll = false;
                    this.isAddedScript = true;
                    this.checkAllDisabled = false;
                }else {
                    this.checkAll = false;
                    this.isAddedScript = false;
                    this.checkAllDisabled = false;
                }
            }else {
                this.checkAll = false;
                this.isAddedScript = false;
                this.checkAllDisabled = false;
            }

        },
        emptyList() {
          this.playScriptData = [];
          this.delScriptInPrograms(this.playScriptID)
        },
        handleDelete(_idx, _id) {
            this.playScriptData.splice(_idx, 1);

            this.delScriptInPrograms([_id]);
        },


        handleWebcast() {
            if(this.playScriptData.length==0) {
                this.$message.info('请添加播放剧本～');
                return;
            }
          this.startWebcast();
        },
        startWebcast() {
            // ❗️要播放的剧本列表
            // console.log(this.playScriptData)
            // this.webcastPreDialog = true;
            // this.$nextTick(()=>{
            //   this.$refs.webcastDialogRef.getPlayData(this.playScriptData);
            // })
          this.$router.push({name:'direct',params:{playData:this.playScriptData}})
        },

        gotopage() {
          UnityRoute('step')
        },
        handleCheckScript(_idx) {
            this.scriptData = JSON.parse(JSON.stringify(this.scriptData))
            let checkCount = 0;
            this.scriptData.forEach(item => {
                if(item.isChecked) {
                    checkCount++;
                }
            });
            this.checkAll = checkCount === this.scriptData.length;
            this.isChooseAllScript = checkCount>0 && checkCount<this.scriptData.length;
            this.isAddedScript = checkCount>0;
        },

        handleCheckAll(val) {
            let checkCount = 0;
            this.scriptData.forEach(item => {
                if(!item.isDisabled) {
                    item.isChecked = val ? true : false;
                }
                if(item.isChecked) {
                    checkCount++;
                }
            })
            this.scriptData = JSON.parse(JSON.stringify(this.scriptData))
            this.isChooseAllScript = false;
            this.isAddedScript = checkCount>0;
        },
        cancelChoose() {
            this.isShowAllList = false;
        },
        confirmChoose() {
            this.isShowAllList = false;

            this.scriptData.forEach(item => {
                if(item.isChecked && !this.playScriptID.includes(item.id)) {
                    this.playScriptID.push(item.id);
                }
            });
            // console.log(this.playScriptID);
            this.addScriptToPrograms();

            this.sortPlayScript();
        },
        addScriptToPrograms() {
            let data = {
                user_id: this.$Session.get('ai_user_id'),
                access_token: this.$Session.get('ai_user_token'),
                gs_id: this.playScriptID,
                role_id:23
                // program_id: '' // 节目ID
            }
            requestServices.addScriptToPrograms(data).then(res => {
                console.log('关联节目与剧本: ', res)
                this.fetchAllPrograms();
            })
        },
        delScriptInPrograms(_ids) {
            let data = {
                user_id: this.$Session.get('ai_user_id'),
                access_token: this.$Session.get('ai_user_token'),
                gs_id: _ids, // []
                role_id:23
                // program_id: '' // 节目ID
            }
            requestServices.delScriptInPrograms(data).then(res => {
                console.log('解除节目与剧本关联: ', res)
                this.fetchAllPrograms();
            })
        },

        guid() {
            function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        },


        renderHeader(h, {column}) {
            return  h(
               'div',
               {
                    style: 'display:flex;margin:auto;justify-content:center;'
                },
               [
                 h('span', column.label),
                 h('promptMessages', {
                     props: {
                        messages: ['清空列表'],
                        icon: 'el-icon-brush',
                        iconStyle: 'color:#666666;margin-left:5px;transform:rotate(180deg);cursor:pointer;',
                        iconClick: this.emptyList
                     }
                 })
               ],
            );
        },
    },
    beforeDestroy() {
      //跳转页面后强制结束播放状态
      UnityPreviewCancel();
    },
}
</script>
<style scoped lang='less'>
  .setGoodsId button {
    width: 82px;
    height: 30px;
    border-radius: 17px;
    cursor: pointer;
    &.cancel {
      opacity: 0.7;
      color: #666;
      border: 1px solid #666;
      margin-right: 16px;
      background: rgba(0,0,0,0);
    }
    &.confirm {
      background: #7455FF;
      color: #fff;
      margin-left: 0;
    }
  }
  .setGoodsId {
    position: absolute;
    padding: 20px;
    background: #fff;
    border-radius: 6px;
    box-shadow: 0px 2px 28px 0px rgba(0, 0, 0, 0.19);
  }
  .goods {
    display: flex;
    justify-content: space-around;
    padding-left: 22px;
    padding-right: 20px;
    i {
      font-size: 16px;
      margin-left: 6px;
      line-height: 24px;
      cursor: pointer;
    }
  }
  .tabs {
    width: 204px;
    margin-bottom: 10px;
    padding: 4px;
    box-sizing: border-box;
    background:#E3E0F2;
    color: #7694f3;
    font-size: 14px;
    border-radius: 4px;
    .tab {
      display: inline-block;
      padding: 6px 20px;
      border-radius: 4px;
      cursor: pointer;
      &.selected {
        background: #fff;
      }
    }
  }
  .sceneWords {
    /*width: 770px;*/
    /*height: 710px;*/
  }

  /deep/.el-dialog__header {
    padding: 0px!important;
  }
  /deep/.el-dialog__body{
    padding: 0px!important;
  }
    #webcast {
        width: 100%;
        height: 100%;
        color: #fff;
        background: #F5F6FA;
        .common_content {
          padding: 45px 20px;
          position: relative;
        }
    }
    .disabled {
        background: #C6C6C6!important;
    }
    .handleWebcastBtnBox{
      text-align: center;
      margin-top: 30px;
    }
    .handleWebcastBtn {
      width: 114px;
      height: 40px;
      line-height: 38px;
      border-radius: 30px;
      margin: 0 auto;
      background: linear-gradient(317deg, #7694f3 0%, #9dcdff 100%);
      /*border-radius: 16px;*/
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      transition: all .3s;
      &:hover{
        opacity: 0.9;
        animation: sun 8s;
      }
      span{
        background: url(data:image/png;base64,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) 50% no-repeat;
        background-size: 22px 22px;
        background-position: -2px 0px;
        width: 20px;
        height: 20px;
        display: inline-block;
        vertical-align: sub;
      }
    }
    .scriptList {
        position: relative;
        /*.playScriptTitle {*/
        /*    margin-top: 30px;*/
        /*    margin-bottom: 10px;*/
        /*    .title {*/
        /*        float: left;*/
        /*        font-size: 16px;*/
        /*        color: #333;*/
        /*    }*/
        /*  */

        /*}*/
      .playSetting {
        margin-left: 20px;
        font-size: 14px;
        color: #7694f3;
        cursor: pointer;
        position: absolute;
        top: 120px;
      }
      .addScript {
        margin-bottom: 10px;
        width: 96px;
        height: 32px;
        background: #FFFFFF;
        border: 1px solid #7694f3;
        border-radius: 16px;
        color: #7694f3;
        font-size: 14px;
        line-height: 30px;
        cursor: pointer;
        &.disabled {
          background: #B3B3B4;
        }
        transition: all .3s;
        &:hover{
          background: #7694f3;
          color:#FFFFFF;
        }
      }
        .title {
            font-size: 18px;
            margin-bottom: 20px;
            .empty {
                font-size: 14px;
                color: #7694f3;
                float: right;
                margin-right: 20px;
                cursor: pointer;
            }
            .disabled {
                color: #C0C4CC;
            }
        }
        .allScriptList {
            position: absolute;
            top: 40px;
            left: calc(50% - 300px);
            width: 600px;
            height: 450px;
            background: #fff;
            box-shadow: 0px 2px 28px 0px rgba(0, 0, 0, 0.19);
            border-radius: 8px;
            padding: 30px;
            box-sizing: border-box;
            z-index: 80;
            color: #666;
            font-size: 16px;
            .filter {
                height: 28px;
                margin: 12px 0 22px;
                color: #999;
                font-size: 14px;
                .filterOptions {
                    width: 106px;
                    margin-right: 24px;
                }
                .search_ipt {
                    float: right;
                    width: 116px;
                    margin: 0 10px;
                    border-radius: 16px;
                }
                .search_btn {
                    float: right;
                    width: 76px;
                    height: 28px;
                    background: #7694f3;
                    border-radius: 16px;
                    font-size: 12px;
                    color: #fff;
                    line-height: 28px;
                    padding: 0;
                }
            }
            .selectedDur {
                font-size: 14px;
                color: #7694f3;
                margin-top: 8px;
            }
            .noScript {
                width: 540px;
                height: 260px;
                background: url(https://large.magics-ad.com/ai-3D/static/img/nodata.png) no-repeat center;
                background-size: 200px 140px;
                background-position: center 70px;
                text-align: center;
                line-height: 460px;
                font-size: 13px;
                color: #9B9B9B;
                span {
                    font-size: 16px;
                    color: #7694f3;
                    cursor: pointer;
                }
            }
            .chooseBox {
                width: 540px;
                height: 30px;
                position: absolute;
                bottom: 30px;
                left: 30px;
                box-sizing: border-box;
                span {
                    float: right;
                    font-size: 14px;
                    button {
                        width: 82px;
                        height: 30px;
                        border-radius: 17px;
                        cursor: pointer;
                        &.cancelChoose {
                            opacity: 0.7;
                            color: #B3B3B4;
                            border: 1px solid #979797;
                            background: #fff;
                            margin-right: 16px;
                        }
                        &.confirmChoose {
                            background: #7694f3;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
    .slide-enter, .slide-leave-to {
        opacity: 0;
        transform: translateX(600px);
    }

    .slide-enter-active,.slide-leave-active{
        -webkit-transition: all 0.5s ease-in-out;
        transition: all 0.5s ease-in-out;
    }
  .playSettingWrap {
    height: 500px;
    position: absolute;
    top: 40px;
    left: 0;
    width: 570px;
    background: #fff;
    box-shadow: 0px 2px 28px 0px rgba(0, 0, 0, 0.19);
    border-radius: 4px;
    padding: 30px;
    box-sizing: border-box;
    z-index: 80;
    color: #666;
    font-size: 16px;
    .el-icon-close {
      position: absolute;
      top: 18px;
      right: 18px;
      font-size: 18px;
      color: #999;
      cursor: pointer;
    }
    .title {
      margin-bottom: 20px;
    }
  }
</style>
<style>
    .search .el-input--small .el-input__inner {
        border-radius: 32px;
    }
    .playScripts .el-icon-video-camera-solid {
        color: #7694f3;
        font-size: 16px;
        margin-left: -22px;
    }
    .playScripts.el-table thead th {
      background: #7694f3 !important;
      color: #FFFFFF;
    }
    .playScripts.el-table tbody tr:hover>td:first-of-type {
        border-left: 3px solid #7694f3!important;
    }
    .playScripts.el-table tbody tr:hover>td {
      background-color: rgba(250, 222, 237, 0.61) !important;
    }
    .playScripts.el-pagination {
        position: absolute;
        bottom: 70px;
        right: 40px;
    }
    .playScripts.el-pager li.active{
      color: #7694f3!important;
    }
    .playScripts.el-pager li:hover{
      color: #7694f3!important;
    }
    .playScripts .el-table__empty-block {
        background: url(https://large.magics-ad.com/ai-3D/static/img/nodata.png) no-repeat center;
        background-size: 294px 190px;
        background-position: center 106px;
    }
    .playScripts .el-table__empty-block span {
        margin-top: 240px;
        font-size: 14px;
        color: #999;
    }

    .filter .el-input__inner {
        height: 28px;
        line-height: 28px;
        border: 1px solid #666;
        border-radius: 16px;
    }
    .filter .search_ipt .el-input__inner  {
        background: #ffffff;
        box-shadow: 0px 0px 3px 2px #e2e9ff;
        color: #999;
        text-align: center;
        padding: 0;
        border: none;
    }
    .filter .el-input--small .el-input__icon {
        line-height: 28px;
    }
    .filter .el-input__inner:focus, .filter .el-input.is-active .el-input__inner {
        border-color: #7694f3!important;
    }
    .filter .el-select .el-input.is-focus .el-input__inner {
        border-color: #7694f3;
    }
    .el-select-dropdown__item.selected {
        color: #7694f3!important;
    }
    .filter .el-select:hover .el-input__inner, .filter .el-input__inner:hover {
        border-color:  #7694f3;
    }

    .playScripts .el-button {
        color: #FB5656;
    }
    .allScriptList .el-checkbox__input.is-checked .el-checkbox__inner,
    .allScriptList .el-checkbox__input.is-indeterminate .el-checkbox__inner,
    .allScriptList .el-checkbox__input.is-focus .el-checkbox__inner,
    .allScriptList .el-checkbox__inner:hover,
    .allScriptList .previewBtn.el-button,
    .allScriptList .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #7694f3;
    }
    .allScriptList .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
      background-color: #7694f3;
      border-color: #7694f3;
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
        background: #B3B3B4!important;
        border-color: #B3B3B4!important;
    }
    .el-checkbox__input.is-disabled.is-checked+.el-checkbox__label {
        color: #B3B3B4!important;
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
        border-color: #fff!important;
    }
    .setGoodsId .el-dialog__header {
      display: none!important;
    }
    .setGoodsId .el-input {
      width: 200px;
      margin-right: 16px;
    }
</style>
