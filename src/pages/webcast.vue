<template>
    <div id="webcast">
        <div class="common_content">
          <button class="backNormal" @click="$router.back()">
            <span class="_icon">< </span>
            <span>返回</span>
          </button>
            <div class="scriptList">
                <div class="playScriptTitle clearfix">
                    <span class="title">播放剧本列表</span>
                    <button class='addScript' :class='{"disabled": $root.isPlayingScript}' type='primary' :disabled="$root.isPlayingScript" @click='addScript'>添加剧本</button>
                </div>
                <!-- <div class="title">
                    <span :class="['empty', $root.isPlayingScript?'disabled':'']" @click='emptyList'>清空列表</span>
                </div> -->
                <el-table size="mini" class='playScripts' row-key="sortId" :data='playScriptData' style='width:100%' empty-text='暂未添加剧本' height='388' max-height='388' >
                    <el-table-column align="center" label="排序" width='100'>
                        <template slot-scope="scope">
                            <i class="el-icon-video-camera-solid" v-if='isPlayingIdx==scope.$index+1'></i>
                            <span>{{scope.$index+1}}</span>
                            <span style='display:none;'>{{scope.row.sortId}}</span>
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
                    <el-table-column align="center" label="操作" :render-header="renderHeader" width='120' >
                        <template slot-scope="scope">
                            <el-button @click='handleDelete(scope.$index, scope.row.id)' :disabled="$root.isPlayingScript" type="text" size="small">移除</el-button>
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

                        <el-table size="mini" border :data='scriptData' style='width:100%' empty-text='暂无剧本' max-height='300' v-if='scriptData.length!=0'>
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
            </div>
          <div class="handleWebcastBtnBox">
            <button class='handleWebcastBtn' :class="{'disabled': isShowAllList}" @click='handleWebcast'>{{webcastBtnTxt}}</button>
            <el-dialog
              custom-class="webcastDialog"
              top="10vh"
              width="700px"
              :before-close="webcastPreClose"
              :visible.sync="webcastPreDialog">
              <div class="previewbox">
                <webcastDialog :scriptRow="scriptRow" :scriptName="scriptName"></webcastDialog>
              </div>
            </el-dialog>
          </div>
        </div>
    </div>
</template>
<script>
  import webcastDialog from '../components/webcast-dialog'
import Sortable from 'sortablejs';
import { requestServices } from '../api/api';
import axios from "axios";
export default {
    filters: {},
    data() {
        return {
            playScriptData: [],
            playScriptID: [],
            webcastBtnTxt: '开始直播',
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
                }
            ],
            anchorRoleValue: '',

            scriptData: [],
            isAddedScript: false,

            checkAllDisabled: false,
            isPlayingIdx: 0,
          webcastPreDialog:true,

        };
    },
    created() {
        window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
    },
    destroyed() {
        window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
    },
    mounted() {
        // this.sortPlayScript();
        this.fetchAllPrograms();
        this.fetchAllScripts();
    },
    methods: {
        webcastPreClose(done){
          done();
        },
        beforeunloadFn(e) {
            console.log('刷新或关闭')
            e = e || window.event;
            if(!this.$root.isPlayingScript) return
            // 兼容IE8和Firefox 4之前的版本
            if(e) {
                 e.returnValue = '关闭提示'
            }
            // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
            return '关闭提示'
        },
        // 获取播放剧本列表
        fetchAllPrograms() {
            requestServices.getAllPrograms({
                role_id:this.$root.role_id,
                user_id: this.$root.ai_user_id,
                access_token: this.$root.ai_user_token,
            }).then(res => {
                console.log('res: ', res)
                if(res.return_code == 1000) {
                    this.playScriptData = res.result.programs;
                    this.fetchPlayScriptIDs();
                    this.sortPlayScript();
                }else if(res.return_code==1009) { // token过期
                    this.$root.ai_user_id = '';
                    this.$root.ai_user_token = '';
                    this.$Session.set('ai_user_id', '');
                    this.$Session.set('ai_user_token', '')

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
                role_id:this.$root.role_id,
                user_id: this.$root.ai_user_id,
                access_token: this.$root.ai_user_token,
                gs_name: this.searchScriptName, // 剧本名称
                avatar_name: this.anchorRoleValue, // 精灵名称
                scene_type: '' // 场景类型；0-默认类型；1-淘宝；2-抖音；3-快手
            }).then(res => {
                console.log('getAllScripts: ', res)
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
                        user_id: _this.$root.ai_user_id,
                        access_token: _this.$root.ai_user_token,
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
            if(!this.$root.isPlayingScript) {
                this.playScriptData = [];
                this.delScriptInPrograms(this.playScriptID)
            }else {
                this.$message.info('正在直播，请稍后操作～')
            }
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
            if(this.$root.isPlayingScript){ // 直播状态：正在直播
                this.$root.isPlayingScript = false;
                this.webcastBtnTxt = '开始直播';
                this.isPlayingIdx = 0;
                // this.$refs.previewMultiple.destoryEvent();
            }else {

                this.startWebcast();
            }

        },
        startWebcast() {
            // ❗️要播放的剧本列表
            console.log(this.playScriptData)
            // this.$refs.previewMultiple.getJson(this.playScriptData);
            this.webcastBtnTxt = '停止直播';
            this.$root.isPlayingScript = true;
        },
        //播放结束
        playOver(){
          this.$root.isPlayingScript = false;
          this.webcastBtnTxt = '开始直播';
        },
        //播放第几个
        changePlayingIdx(_idx) {
            this.isPlayingIdx = _idx;
        },
        handleClickSearch() {},
        changeAnchorRole() {},
        changeReferScene() {},
        gotopage() {
            this.$router.push('/steper')
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
        handlePreview(row) {
            axios.get(row.script_url)
              .then(res=>{
                if(res.status===200){
                  this.scriptRow = res.data
                  UnityPreview(res.data[0].avatar.unity,JSON.stringify(res.data))
                }else{
                  this.$message.warning('剧本数据获取异常，请重试')
                }
              })
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
                user_id: this.$root.ai_user_id,
                access_token: this.$root.ai_user_token,
                gs_id: this.playScriptID,
                // program_id: '' // 节目ID
            }
            requestServices.addScriptToPrograms(data).then(res => {
                console.log('关联节目与剧本: ', res)
                this.fetchAllPrograms();
            })
        },
        delScriptInPrograms(_ids) {
            let data = {
                user_id: this.$root.ai_user_id,
                access_token: this.$root.ai_user_token,
                gs_id: _ids, // []
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
    components:{
      webcastDialog
    }
}
</script>
<style scoped lang='less'>
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
          padding: 30px 20px;
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
      width: 96px;
      height: 32px;
      margin: 0 auto;
      background: linear-gradient(166deg, #BA71FF 0%, #5648FF 100%);
      border-radius: 16px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
    }
    .scriptList {
        position: relative;
        .playScriptTitle {
            margin-top: 30px;
            margin-bottom: 10px;
            .title {
                float: left;
                font-size: 16px;
                color: #333;
            }
            .addScript {
                float: right;
                width: 96px;
                height: 32px;
                background: linear-gradient(332deg, #FF71B5 0%, #FFBA48 100%);
                border-radius: 16px;
                color: #fff;
                font-size: 14px;
                line-height: 32px;
                cursor: pointer;
                &.disabled {
                    background: #B3B3B4;
                }
            }

        }
        .title {
            font-size: 18px;
            margin-bottom: 20px;
            .empty {
                font-size: 14px;
                color: #409EFF;
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
                    background: #7455FF;
                    border-radius: 16px;
                    font-size: 12px;
                    color: #fff;
                    line-height: 28px;
                    padding: 0;
                }
            }
            .selectedDur {
                font-size: 14px;
                color: #7455FF;
                margin-top: 8px;
            }
            .noScript {
                width: 710px;
                height: 340px;
                background: url(https://large.magics-ad.com/ai-3D/static/img/nodata.png) no-repeat center;
                background-size: 294px 190px;
                background-position: center 70px;
                text-align: center;
                line-height: 540px;
                font-size: 14px;
                color: #9B9B9B;
                span {
                    font-size: 16px;
                    color: #7455FF;
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
                            background: #7455FF;
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
</style>
<style>


    .search .el-input--small .el-input__inner {
        border-radius: 32px;
    }
    .playScripts .el-icon-video-camera-solid {
        color: #7455FF9e;
        font-size: 16px;
        margin-left: -22px;
    }
    .playScripts.el-table thead th {
        background: #7455FF2e!important;
        color: #6d6d6d;
    }
    .playScripts.el-table tbody tr:hover>td:first-of-type {
        border-left: 3px solid #7455FF!important;
    }
    .playScripts.el-table tbody tr:hover>td {
        background-color: #7455FF0f!important;
    }
    .playScripts.el-pagination {
        position: absolute;
        bottom: 70px;
        right: 40px;
    }
    .playScripts.el-pager li.active{
      color: #7455FF!important;
    }
    .playScripts.el-pager li:hover{
      color: #7455FFe0!important;
    }
    .playScripts .el-table__empty-block {
        background: url(https://large.magics-ad.com/ai-3D/static/img/nodata.png) no-repeat center;
        background-size: 294px 190px;
        background-position: center 106px;
    }
    .playScripts .el-table__empty-block span {
        margin-top: 116px;
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
        background: #F8F6FF;
        color: #999;
        text-align: center;
        padding: 0;
        border: none;
    }
    .filter .el-input--small .el-input__icon {
        line-height: 28px;
    }
    .filter .el-input__inner:focus, .filter .el-input.is-active .el-input__inner {
        border-color: #7455FF!important;
    }
    .filter .el-select .el-input.is-focus .el-input__inner {
        border-color: #7455FF;
    }
    .el-select-dropdown__item.selected {
        color: #7455FF!important;
    }
    .filter .el-select:hover .el-input__inner, .filter .el-input__inner:hover {
        border-color:  #7455FF;
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
        color: #7455FF;
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
</style>
