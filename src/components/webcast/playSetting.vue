<template>
    <div id="playSetting">
        <el-tabs tab-position="left" :style="tabsStyle">
            <el-tab-pane v-for='(tab,idx) in tabs' :key='idx' :label="tab.label">
                <!-- 互动模式 -->
                <div v-if='idx==0' class='tab inac'>
                    <p class="title">Interactive mode rounds setting</p>
                    <p class="tips">Rounds of interactive mode: interact with the audience after entering the interactive mode each time</p>

                    <div class="inacType">
                        <el-radio v-model="inacType" label="0" @change='handleChangeType'>Default all day</el-radio>

                        <span class="loop">{{fullDayLoop}}rounds</span>
                        <span class="center" ></span>
                        <span class="edit" :class="{'disabled': inacType==1}" @click='handleEditFullDayLoop'>edit</span>
                        <!-- <span class="delete" v-if='type!="tempwords"'>删除</span> -->
                    </div>
                    <div class="inacType">
                        <el-radio v-model="inacType" label="1" @change='handleChangeType'>Time period setting (unset time period, default to 2 rounds)</el-radio>
                        <div class="detail">
                            <p class="addInacTimePart" :class="{'disabled': inacType==0}" @click='addInacTimePart'>add</p>
                            <div :style='timerPartStyle'>
                                <p class="part" v-for='(part, idx) in timeParts' :key='idx'>
                                    <span>{{part.start}} — {{part.end}}</span>
                                    <span class="loop">{{part.rotation}}rounds</span>
                                    <span class="center" ></span>
                                    <span class="edit" :class="{'disabled': inacType==0}" @click='editTimePart(part, idx)'>edit</span>
                                    <span class="delete" :class="{'disabled': inacType==0}" @click='delInac(part)'>delete</span>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- 紧急联系人 -->
                <div v-if='idx==1'>
                    <p style='font-size:14px;margin-bottom:10px;'>Emergency contact</p>
                    <p>
                        <span style='font-size:14px;margin-right:10px;'>Phone</span><el-input style='width:300px;' v-model="liaison" @input='handleLiaIptChange("liaison")' :disabled='liaDisabled' maxlength='11' autocomplete="off" clearable></el-input>
                    </p>
                    <p class="tips" style='margin-top:10px;margin-left:60px;'>The mobile phone number of the emergency contact is used to receive SMS notification of abnormal situations such as live broadcast interruption! The default registered mobile phone number can be modified.</p>
                    <p style='margin: 40px 0 0 60px;'>
                        <el-button @click='handleLiaBtn'>{{liaisonBtnTxt}}</el-button>
                    </p>

                </div>
            </el-tab-pane>
        </el-tabs>

        <div v-if='isShowAddInacTime' class="addInacTimeDialog">
            <p>Time interval</p>
            <el-time-select
                :disabled='inacType==0'
                v-model="startTime"
                :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '23:00',
                    maxTime: endTime
                }"
                style="width: 100px;margin-bottom: 24px;"
            >
            </el-time-select>
            --
            <el-time-select
                :disabled='inacType==0'
                v-model="endTime"
                :picker-options="{
                    start: '01:00',
                    step: '01:00',
                    end: '24:00',
                    minTime: startTime
                }"
                style="width: 100px"
            >
            </el-time-select>
            <p>Rounds</p>
            <p><el-input style='width: 100px' v-model='addInacLoop' @input='handleIptChange'></el-input> rounds</p>
            <p>
                <button class="cancel" @click='cancel'>cancel</button>
                <button class="confirm" @click='confirm'>confirm</button>
            </p>
        </div>
    </div>

</template>
<script>
    import { requestServices } from '../../api/api'
    export default {
        props: {
            tabsHeight: {
                type: Number,
                default: 200
            }
        },
        computed: {
            tabsStyle() {
                const style = {}
                style.height = this.tabsHeight-140 + 'px'
                // console.log(this.tabsHeight)
                return style
            },
            timerPartStyle() {
                const style = {}
                style.height = this.tabsHeight-300+'px';
                style.overflowY = 'scroll';
                return style;
            }
        },
        data() {
            return {
                tabs: [
                    {
                        label: 'Interaction'
                    },
                    {
                        label: 'Emergency'
                    },
                    // {
                    //     label: 'haha管理'
                    // }
                ],
                inacType: '0', // 0-全天，1-分时段设置
                fullDayLoop: 2, // 全天轮数
                timeParts: [
                    // {
                    //     time: '1:00-5:00',
                    //     loop: 2
                    // },
                    // {
                    //     time: '6:00-22:00',
                    //     loop: 5
                    // },
                    // {
                    //     time: '6:00-22:00',
                    //     loop: 5
                    // },
                    // {
                    //     time: '6:00-22:00',
                    //     loop: 5
                    // }
                ],
                isShowAddInacTime: false,
                startTime: '00:00',
                endTime: '24:00',
                addInacLoop: 2,
                handleType: '',
                currentEditID: '',
                liaison: '',
                liaisonBtnTxt: 'save',
                liaDisabled: false,
                captcha: '',
                isFetchCaptcha: false,

                fetchCaptchaAginTime: 60,
            }
        },
        mounted() {
            this.getInacType();
            this.getMonitorPhone();
        },
        methods: {
            getInacType() {
                requestServices.getInacType({
                    user_id:this.$Session.get('ai_user_id'),
                    role_id: 23,
                    access_token:this.$Session.get('ai_user_token'),
                }).then(res => {
                    // console.log(res)
                    if(res.return_code == 1000) {
                        this.inacType = `${res.result.interaction.status}`;
                        this.fullDayLoop = res.result.interaction.rotation;
                        this.timeParts = res.result.interaction.subsection;

                    }else if(res.return_code==1009) {
                        this.$Session.set('ai_user_id', '');
                        this.$Session.set('ai_user_token', '')
                        this.$router.push('/login')
                    }
                })
            },
            handleChangeType(val) {
                console.log('handleChangeType: ', val)
                this.editInac({
                    user_id:this.$Session.get('ai_user_id'),
                    access_token:this.$Session.get('ai_user_token'),
                    role_id: 23,
                    status: val
                })
            },
            handleEditFullDayLoop() {
                if(this.inacType=='1') return;
                this.isShowAddInacTime = true;
                this.addInacLoop = this.fullDayLoop;
                this.startTime = '00:00';
                this.endTime = '24:00';
                this.handleType = 'edit';
            },
            addInacTimePart() {
                if(this.inacType=='0') return;
                this.isShowAddInacTime = true;
                this.startTime = '00:00';
                this.endTime = '24:00';
                this.handleType = 'add';
                this.addInacLoop = 2;
            },
            handleIptChange() {
                this.addInacLoop = this.addInacLoop.replace(/[^\d]/g, '');
                // console.log(Number(this.addInacLoop), Number(this.addInacLoop)==0&&this.addInacLoop!='')
                if(this.addInacLoop>5) {
                    this.addInacLoop = 5;
                    this.$message.info('Up to 5 rounds');
                }else if(Number(this.addInacLoop)==0&&this.addInacLoop!='') {
                    this.addInacLoop = 1;
                    this.$message.info('The minimum setting is 1 round');
                }
            },
            editTimePart(_item, _idx) {
                if(this.inacType=='0') return;
                this.isShowAddInacTime = true;
                this.startTime = _item.start;
                this.endTime = _item.end;
                this.addInacLoop = _item.rotation;
                this.currentEditID = _item.id;
                this.currentEditIdx = _idx;
                this.handleType = 'edit';
            },
            cancel() {
                this.isShowAddInacTime = false;
            },
            handleIsGoOn(_s, _e, _parts) {
                console.log(_parts)
                let isGoon = true;
                for(let i = 0; i<_parts.length; i++) {
                    let s = Number(_parts[i].start.split(':')[0]),
                        e = Number(_parts[i].end.split(':')[0]);
                        console.log(_s>_e)
                    if(s<_s&&_s<e || s<_e&&_e<e || _s<s&&_e>e || s==_s&&e==_e || s==_s&&_e>e || _s<s&&_e==e) {
                        isGoon = false;
                        break;
                    }
                }
                return isGoon;
            },
            confirm() {
                console.log('confirm')
                let data = {
                    user_id:this.$Session.get('ai_user_id'),
                    access_token:this.$Session.get('ai_user_token'),
                    role_id: 23,
                    status: Number(this.inacType),
                    rotation: this.addInacLoop
                }
                if(this.inacType=='1') {
                    data.start = this.startTime;
                    data.end = this.endTime;
                    data.subsection_id = this.currentEditID;
                    let _s = Number(data.start.split(':')[0]),
                        _e = Number(data.end.split(':')[0]),
                        isGoon = true;
                    if(this.handleType=='add') {
                        isGoon = this.handleIsGoOn(_s, _e, this.timeParts);
                    }else if(this.handleType=='edit') {
                        let arr = JSON.parse(JSON.stringify(this.timeParts))
                        arr.splice(this.currentEditIdx, 1)
                        isGoon = this.handleIsGoOn(_s, _e, arr)
                    }

                    if(!isGoon) {
                        this.$message.error('Time overlaps～')
                        return;
                    }
                }
                switch(this.handleType) {
                    case 'add':
                        this.addInac(data);
                        break;
                    case 'edit':
                        this.editInac(data);
                        break;
                }

                this.isShowAddInacTime = false;

            },
            addInac(data) {
                requestServices.addInac(data).then(res => {
                    console.log('addInac: ', res)
                    if(res.return_code==1000) {
                        this.getInacType();
                    }
                })
            },
            editInac(data) {
                requestServices.editInac(data).then(res => {
                    console.log('editInac: ', res)
                    if(res.return_code==1000) {
                        this.getInacType();
                    }
                })
            },
            delInac(_item) {
                if(this.inacType=='0') return;
                requestServices.delInac({
                    user_id:this.$Session.get('ai_user_id'),
                    access_token:this.$Session.get('ai_user_token'),
                    role_id: 23,
                    subsection_id: _item.id
                }).then(res => {
                    if(res.return_code==1000) {
                        this.$message.success('Successfully deleted')
                        this.getInacType();
                    }
                })
            },
            getMonitorPhone() {
                requestServices.getMonitoringPhone({
                    user_id: this.$Session.get('ai_user_id'),
                    role_id: 23
                }).then(res => {
                    console.log(res)
                    if(res.return_code==1000) {
                        this.liaison = res.result.phone.phone;
                        this.liaDisabled = true;
                        this.liaisonBtnTxt = 'edit';
                    }
                })
            },
            handleLiaIptChange(_property) {
                this[_property] = this[_property].replace(/[^\d]/g, '');
            },
            fetchCaptcha() {
                if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.liaison))){
                    this.$message.error('Wrong mobile phone number, please fill in again');
                    return;
                }
                requestServices.getCaptcha({
                    phone: this.liaison,
                    role_id: 23,
                }).then(res => {
                    console.log(res)
                    if(res.return_code==1000) {
                        this.isFetchCaptcha = true;
                        let _this = this;
                        _this.timer = setInterval(()=>{
                        _this.fetchCaptchaAginTime--;
                        if(_this.fetchCaptchaAginTime==0) {

                            _this.fetchCaptchaAginTime = 60;
                            _this.isFetchCaptcha = false;
                            clearInterval(_this.timer);
                            return;
                        }
                        }, 1000);
                    }else {
                        this.$message.error('SMS sending failed, please get it again~')
                    }
                })
            },
            handleLiaBtn() {
                switch(this.liaisonBtnTxt) {
                    case 'save':
                        // if(this.captcha=='') {
                        //     this.$message.error('请输入短信验证码')
                        //     return;
                        // }

                        if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.liaison))){
                            this.$message.error('The phone number is wrong. Please fill in again');
                            return;
                        }
                        this.addMonitorPhone()
                        break;
                    case 'edit':
                        this.liaDisabled = false;
                        this.liaisonBtnTxt = 'save';
                        break;
                }
            },
            addMonitorPhone() {
                requestServices.addMonitoringPhone({
                    user_id: this.$Session.get('ai_user_id'),
                    phone: '18722263142',
                    role_id: 23
                }).then(res => {
                    // console.log('addMonitorPhone: ', res)
                    if(res.return_code==1000) {
                        this.liaDisabled = true;
                        this.liaisonBtnTxt = 'edit';
                        this.$message.success('success');
                    }
                })
            }
        }
    }
</script>
<style scoped lang='less'>
    #playSetting {
        position: relative;
    }
    .tips {
        color: #BCBCBC;
        font-size: 12px;
        margin: 2px 0 24px;
    }
    .tab {
        &.inac {
            .title {
                color: #666;
                font-size: 14px;
            }
            .inacType {
                margin-bottom: 12px;
                position: relative;
                .part {
                    position: relative;
                    background: #F4F4F4;
                    height: 36px;
                    width: 350px;
                    border-radius: 2px;
                    margin-bottom: 10px;
                    line-height: 36px;
                    padding-left: 10px;
                    padding-right: 50px;
                    font-size: 14px;
                    color: #666;
                }
                .loop {
                    position: absolute;
                    right: 114px;
                    top: 50%;
                    transform: translate(0, -50%);
                    color: #666666;
                    font-size: 14px;
                }
                .edit {
                    position: absolute;
                    right: 60px;
                    top: 50%;
                    transform: translate(0, -50%);
                    color: #7694f3;
                    font-size: 14px;
                    cursor: pointer;
                }
                .center {
                    position: absolute;
                    right: 100px;
                    top: 50%;
                    transform: translate(0, -50%);
                    background: #D4C6FF;
                    width: 1px;
                    height: 10px;
                }
                .delete {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translate(0, -50%);
                    color: #FB5656;
                    font-size: 14px;
                    cursor: pointer;
                }
                .detail {
                    padding-left: 24px;
                    overflow: scroll;
                }
                .addInacTimePart {
                    font-size: 14px;
                    color: #7694f3;
                    margin: 12px 0;
                    cursor: pointer;
                }
                .disabled {
                    cursor: no-drop;
                }
            }
        }
    }
    .addInacTimeDialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 340px;
        height: 264px;
        background: rgba(0,0,0,0.75);
        border-radius: 4px;
        color: #fff;
        padding: 28px 30px;
        box-sizing: border-box;
        font-size: 12px;
        p {
            margin-bottom: 6px;
        }
        button {
            width: 68px;
            height: 25px;
            border-radius: 14px;
            font-size: 12px;
            margin-top: 42px;
            cursor: pointer;
        }
        .cancel {
            background: #DBDBDB;
            color: #666666;
        }
        .confirm {
            background: #7694f3;
            color: #fff;
            margin-left: 114px;
        }
    }
</style>
<style>
    #playSetting .el-tabs__item {
        padding: 0!important;
        /* padding-right:  */
        color: #666;
    }
    #playSetting .el-tabs--left .el-tabs__header.is-left {
        background: #F4F4F4;
    }
    #playSetting .el-tabs--left .el-tabs__item.is-left {
        text-align: center;
        font-size: 12px;
    }
    #playSetting .el-tabs__nav-wrap::after {
        display: none;
    }
    #playSetting .el-tabs__item.is-active, #playSetting .el-tabs__item:hover {
        width: 68px;
        color: #7694f3!important;
    }
    #playSetting .el-tabs__active-bar {
        display: none;
    }
    #playSetting .el-radio__input.is-checked .el-radio__inner {
        border-color: #7694f3;
        background: #7694f3;
    }
    #playSetting .el-radio__input.is-checked+.el-radio__label {
        color: #666666;
         /* #9B82FF; */
    }
    #playSetting .el-radio__inner:hover {
        border-color: #7694f3;
    }
    #playSetting .el-input__inner:focus {
        border-color: #7694f3;
    }
    #playSetting .el-button:hover, #playSetting .el-button:focus {
        color:#7694f3;
        border-color: #7694f3;
        background-color: #fff;
    }
    .fetchCaptcha.el-button {
        height:32px;
        margin-left: 20px;
        background: none;
        border: none;
        margin-top: 8px;
        color: #7694f3;
    }
    .fetchCaptcha.el-button.is-disabled {
        color: #C0C4CC;
    }
</style>
