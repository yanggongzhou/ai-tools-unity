<template>
    <div id="webcast">
        <div class="common_content">
            <div class="player">
                <div class="playerCanvas">
                    <previewMultiple ref="previewMultiple" :playScriptData="playScriptData" @playOver="playOver" @changePlayingIdx="changePlayingIdx"></previewMultiple>
                </div>
            </div>
            <div class="scriptList">
                <div class="playScriptTitle clearfix">
                    <span class="title">播放剧本列表</span>
                    <button class='handleWebcastBtn' :class="{'disabled': isShowAllList}" @click='handleWebcast'>{{webcastBtnTxt}}</button>
                    <button class='addScript' :class='{"disabled": $root.isPlayingScript}' type='primary' :disabled="$root.isPlayingScript" @click='addScript'>添加剧本</button>
                </div>
                <!-- <div class="title">
                    <span :class="['empty', $root.isPlayingScript?'disabled':'']" @click='emptyList'>清空列表</span>
                </div> -->
                <el-table class='playScripts' row-key="sortId" :data='playScriptData' style='width:100%' empty-text='暂未添加剧本' height='520' max-height='520' >
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
                    <el-table-column align="center" label="关联主播角色">
                        <template slot-scope="scope">
                            <span>{{scope.row.avatar_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="剧本时长">
                        <template slot-scope="scope">
                            <span>{{handleScriptTime(scope.row.time)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" :render-header="renderHeader" width='120' >
                        <template slot-scope="scope">
                            <el-button @click='handleDelete(scope.$index, scope.row.id)' :disabled="$root.isPlayingScript" type="text" size="small">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="startWebcast">
                    <div>
                        <span @click='showTips'> <i class="el-icon-info"></i> 播放须知</span>
                        <span v-if='playScriptData.length!=0'>总时长：{{handleScriptTime(totalScriptSeconds)}}</span>
                    </div>
                </div>
                <!-- 剧本列表 -->
                <transition name='slide'>
                    <div class="allScriptList" v-if='isShowAllList'>
                        <h3>剧本列表</h3>

                        <div class="filter">
                            <span>关联主播角色：</span>
                            <el-select class="filterOptions" @change='fetchAllScripts' v-model='anchorRoleValue'>
                                <el-option
                                    v-for='(role,idx) in anchorRoles'
                                    :key='idx'
                                    :label='role.label'
                                    :value='role.value'
                                ></el-option>
                            </el-select>
                            <span>参考场景：</span>
                            <el-select class="filterOptions" @change='fetchAllScripts' v-model='referSceneValue'>
                                <el-option
                                    v-for='(role,idx) in referScenes'
                                    :key='idx'
                                    :label='role.label'
                                    :value='role.value'
                                ></el-option>
                            </el-select>
                            <el-button class='search_btn' @click="fetchAllScripts">查询</el-button>
                            <el-input  class='search_ipt' v-model="searchScriptName" placeholder="剧本名称" clearable></el-input>
                        </div>

                        <el-table border :data='scriptData' style='width:100%' empty-text='暂无剧本' max-height='320' v-if='scriptData.length!=0'>
                            <el-table-column label="选择" align="center" width='80'>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.isChecked" :disabled="scope.row.isDisabled" @change='handleCheckScript(scope.$index)'></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="剧本名称" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="关联主播角色" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.avatar_name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="剧本时长" align="center">
                                <template slot-scope="scope">
                                    <span>{{handleScriptTime(scope.row.time)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="参考场景" align="center">
                                <template slot-scope="scope">
                                    <span>{{scope.row.scene_type | scene_typeFilter}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width='100'>
                                <template slot-scope="scope">
                                    <el-button class="previewBtn" @click='handlePreview(scope.row)' type="text" size="small">预览</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <p class='selectedDur' v-if='isAddedScript'>时长：{{handleScriptTime(selectedScriptSeconds)}}</p>
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
                <div class="beforeWebcastTips" v-if='isShowBeforePlayTips'>
                    <div>直播前请确认是否已经设置好OBS或其他直播助手相关推流工具？</div>
                    <p class="noNotify">
                        <el-checkbox v-model='isOpenBeforePlayTipsAgain' @change='handleBeforePlayTips'>不再提示</el-checkbox>
                    </p>
                    <p class="btns">
                        <button class="cancel" @click="cancelPlay" >取消</button>
                        <button class="confirm" @click="confirmPlay" type='primary' >确认</button>
                    </p>
                </div>
            </div>
        </div>


        <el-dialog class='playerTips' top="26vh" :visible.sync="isShowPlayerTips" width='40%' :show-close='false'>
            <div>
                <p class="title"><i class="el-icon-info"></i> 播放须知：</p>
                <p>1、直播前准备：开始直播前，可预先在直播助手或OBS推流工具中调整好录屏窗口</p>
                <p>2、开始直播后，会等待加载缓存角色形象，脚本数据，由于网络原因，电脑性能等因素，大概会出现几秒至几十秒的等待，请知悉。建议使用配置较高的电脑，及网速建议10M带宽以上，以尽可能保证直播效果更佳。</p>
                <p>3、直播中请保持当前页面开启，关闭页面后，直播将会丢失。</p>
                <p>4、如果因不可控因素关闭了直播，可重新开启；若需要接着之前位置播放，建议可在【节目直播】的剧本列表中，移除已播放过的剧本后，重新开播。</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <button @click="closeTips" type='primary' style='width:100px;'>知道了</button>
            </span>
        </el-dialog>

        <el-dialog
            custom-class="previewDialog"
            top="10%"
            width="400px"
            :before-close="previewDialogClose"
            :visible.sync="isShowPreviewDialog">
            <div class="previewbox">
              <previewCurrent ref="previewCurrent" :scriptRow="scriptRow"></previewCurrent>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Sortable from 'sortablejs';
import Cookies from 'js-cookie';
import { requestServices } from '../api/api';
import { handleScriptTime } from '../api/handleTime';
import previewCurrent from "@/components/preview/preview-current";
import previewMultiple from '../components/preview/preview-multiple'
export default {
    filters: {
        scene_typeFilter(val){
            let _name;
                switch (val) {
                case 0:
                    _name='默认类型';
                    break;
                case 1:
                    _name='淘宝';
                    break;
                case 2:
                    _name='抖音';
                    break;
                case 3:
                    _name='快手';
                    break ;
                }
            return _name;
        }
    },
    data() {
        return {
            playScriptData: [],
            playScriptID: [],
            webcastBtnTxt: '开始直播',
            isShowPlayerTips: false,
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
            referScenes: [
                {
                    value: '',
                    label: '全部'
                },
                {
                    value: 1,
                    label: '淘宝'
                },
                {
                    value: 2,
                    label: '抖音'
                },
                {
                    value: 3,
                    label: '快手'
                }
            ],
            referSceneValue: '',
            scriptData: [
                // {
                //     id: 1,
                //     createTime: '1',
                //     name: '演示剧本',
                //     time: '450',
                //     ip: '潇洒姐1',
                //     script_url:'https://large.magics-ad.com/mygz-file/ai-tools/xiaosajie.json',
                //     referScene: '淘宝',
                //     isChecked: false
                // },
                // {
                //     id: 2,
                //     createTime: '2',
                //     name: '演示剧本',
                //     time: '340',
                //     ip: '不白吃',
                //     script_url:'https://large.magics-ad.com/mygz-file/ai-tools/bubaichi.json',
                //     referScene: '淘宝',
                //     isChecked: false
                // },
                // {
                //     id: 3,
                //     createTime: '3',
                //     name: '演示剧本',
                //     time: '540',
                //     ip: '教授',
                //     script_url:'https://large.magics-ad.com/mygz-file/ai-tools/jiaoshou.json',
                //     referScene: '淘宝',
                //     isChecked: false
                // },
                // {
                //     id: 4,
                //     createTime: '4',
                //     name: '演示剧本',
                //     time: '220',
                //     ip: '潇洒姐2',
                //     script_url:'https://large.magics-ad.com/mygz-file/ai-tools/xiaosajie%202.json',
                //     referScene: '淘宝',
                //     isChecked: false
                // },
            ],
            isShowBeforePlayTips: false,
            isOpenBeforePlayTipsAgain: false,
            isAddedScript: false,
            selectedScriptSeconds: 0,
            totalScriptSeconds: 0,
            isShowPreviewDialog: false,
            scriptRow:'', //单条预览的数据

            checkAllDisabled: false,
            isPlayingIdx: 0
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
        handleScriptTime: handleScriptTime,
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
                    Cookies.set('ai_user_id', '');
                    Cookies.set('ai_user_token', '')
                    this.$router.push('/login')
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
                user_id: this.$root.ai_user_id,
                access_token: this.$root.ai_user_token,
                gs_name: this.searchScriptName, // 剧本名称
                avatar_name: this.anchorRoleValue, // 精灵名称
                scene_type: this.referSceneValue // 场景类型；0-默认类型；1-淘宝；2-抖音；3-快手
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
            this.totalScriptSeconds = 0;
            this.playScriptData.forEach((item, id) => {
                item.sortId = this.guid();
                this.totalScriptSeconds += Number(item.time);
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
            this.selectedScriptSeconds = 0;
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
                        this.selectedScriptSeconds += Number(item.time);
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

            this.totalScriptSeconds = 0;
            this.playScriptData.forEach((item, id) => {
                this.totalScriptSeconds += Number(item.time);
            })
        },
        showTips() {
            this.isShowPlayerTips = true;
        },
        closeTips() {
            this.isShowPlayerTips = false;
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
                this.$refs.previewMultiple.destoryEvent();
            }else if(this.$root.isOpenBeforePlayTipsAgain) { // 是否确认开始直播，直播前询问
                this.isShowBeforePlayTips = true;
            } else {

                this.startWebcast();
            }

        },
        startWebcast() {
            // ❗️要播放的剧本列表
            console.log(this.playScriptData)
            this.$refs.previewMultiple.getJson(this.playScriptData);
            this.webcastBtnTxt = '停止直播';
            this.$root.isPlayingScript = true;
        },
        //播放结束
        playOver(){
          this.$root.isPlayingScript = false;
          this.webcastBtnTxt = '开始直播';
        },
        changePlayingIdx(_idx) {
            this.isPlayingIdx = _idx;
        },
        handleClickSearch() {},
        changeAnchorRole() {},
        changeReferScene() {},
        gotopage() {
            this.$router.push('/step1')
        },
        handleCheckScript(_idx) {
            this.scriptData = JSON.parse(JSON.stringify(this.scriptData))
            let checkCount = 0;
            this.selectedScriptSeconds = 0;
            this.scriptData.forEach(item => {
                if(item.isChecked) {
                    checkCount++;
                    this.selectedScriptSeconds += Number(item.time);
                }
            });
            this.checkAll = checkCount === this.scriptData.length;
            this.isChooseAllScript = checkCount>0 && checkCount<this.scriptData.length;
            this.isAddedScript = checkCount>0;
        },
        handlePreview(row) {
            this.isShowPreviewDialog = true;
            this.scriptRow = row;
            this.$nextTick(()=>{
              this.$refs.previewCurrent.getJson(row)
            })
        },
        handleCheckAll(val) {
            this.selectedScriptSeconds = 0;
            let checkCount = 0;
            this.scriptData.forEach(item => {
                if(!item.isDisabled) {
                    item.isChecked = val ? true : false;
                }
                if(item.isChecked) {
                    checkCount++;
                    this.selectedScriptSeconds += Number(item.time);
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
        handleBeforePlayTips() {
            // console.log(this.isOpenBeforePlayTipsAgain)
        },
        cancelPlay() {
            this.isShowBeforePlayTips = false;
        },
        confirmPlay() {
            this.isShowBeforePlayTips = false;
            if(this.isOpenBeforePlayTipsAgain) {
                this.$root.isOpenBeforePlayTipsAgain = false;
                Cookies.set('isOpenBeforePlayTipsAgain', false);
            }
            this.startWebcast();
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
        previewDialogClose(done){
          this.$refs.previewCurrent.destoryEvent(res=>{
            setTimeout(()=>{
              done();
            },500)
          })
        },

    },
    components: {
        previewCurrent,
        previewMultiple
    }
}
</script>
<style scoped lang='less'>
    #webcast {
        width: 100%;
        min-width: 1200px;
        height: 100%;
        color: #fff;
        background: #F5F6FA;
        .common_content {
            padding: 100px 0 40px;
        }
    }
    .disabled {
        background: #C6C6C6!important;
    }
    .player {
        float: left;
        width: 400px;
        height: 90%;
        border-right: 1px solid #D8D8D8;
        position: relative;
        /*z-index: 999;*/
        .playerCanvas {
            width: 320px;
            height: 568px;
            border: 1px solid #ccc;
            background: url(https://large.magics-ad.com/ai-3D/static/img/playerBg.png) center no-repeat;
            background-size: 320px 568px;
        }
    }

    .scriptList {
        float: right;
        min-width: 770px;
        height: 90%;
        position: relative;
        .playScriptTitle {
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
            .handleWebcastBtn {
                float: right;
                width: 96px;
                height: 32px;
                margin: 0 auto;
                background: linear-gradient(166deg, #BA71FF 0%, #5648FF 100%);
                border-radius: 16px;
                color: #fff;
                font-size: 14px;
                cursor: pointer;
                margin-left: 20px;
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
        .startWebcast {
            width: 100%;
            height: 90px;
            div {
                margin: 18px 0 24px;
                display: flex;
                justify-content: space-between;
            }
            span {
                font-size: 14px;
                color: #999999;
                &:nth-child(1) {
                    cursor: pointer;
                }
                &:nth-child(2) {
                    color: #7455FF;
                }
                i {
                    font-size: 18px;
                }
            }
        }
        .allScriptList {
            position: absolute;
            top: 40px;
            left: 0;
            width: 770px;
            height: 550px;
            background: #fff;
            box-shadow: 0px 2px 28px 0px rgba(0, 0, 0, 0.19);
            border-radius: 4px;
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
                width: 710px;
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
        .beforeWebcastTips {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -40%);
            width: 392px;
            height: 220px;
            background: rgba(0,0,0,0.75);
            border-radius: 4px;
            padding: 48px 30px 18px;
            box-sizing: border-box;
            font-size: 16px;
            color: #fff;
            line-height: 22px;
            .noNotify {
                height: 20px;
                margin: 28px 0 30px;
            }
            .btns {
                text-align: right;
            }
            button {
                width: 82px;
                height: 30px;
                border-radius: 17px;
                cursor: pointer;
                &.cancel {
                    opacity: 0.7;
                    color: #B3B3B4;
                    border: 1px solid #979797;
                    margin-right: 16px;
                    background: rgba(0,0,0,0);
                }
                &.confirm {
                    background: #7455FF;
                    color: #fff;
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
    .playerTips button {
        width: 102px;
        height: 30px;
        background: #7455FF;
        border-radius: 17px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
    }
</style>
<style>
    .playerTips  .el-dialog__body {
        padding-top: 0;
        font-size: 12px;
    }
    .playerTips p {
        margin-bottom: 8px;
    }
    .playerTips .title {
        margin-bottom: 10px;
        font-size:14px;
    }
    .playerTips .el-icon-info {
        font-size: 22px;
        color: #7455FF;
    }
    .playerTips .el-dialog__footer {
        display: flex;
        justify-content: space-around;
    }

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
    .noNotify .el-checkbox__input.is-checked .el-checkbox__inner,
    .noNotify .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background: #7455FF;
        border-color: #7455FF;
    }
    .allScriptList .el-checkbox__input.is-focus .el-checkbox__inner,
    .noNotify .el-checkbox__input.is-focus .el-checkbox__inner,
    .allScriptList .el-checkbox__inner:hover,
    .noNotify .el-checkbox__inner:hover {
        border-color: #7455FF;
    }
    .allScriptList .previewBtn.el-button,
    .allScriptList .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #7455FF;
    }
    .noNotify .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #fff;
    }
    .noNotify .el-checkbox {
        color: #fff;
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
