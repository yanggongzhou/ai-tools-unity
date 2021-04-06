<template>
    <div class="container">
        <span class="tips">{{$lan.webcast.tips2[type]}}</span>
        <div>
            <button class="addBtn" @click='handleAddBtn'>+{{$lan.common.add}}</button>
            <span class="addTips">{{$lan.webcast.wordList_tip}}</span>
            <div class="listWrap">
                <div v-for='(item, idx) in list' :key='idx' class="list">
                    <el-switch class="switch" v-model="item.switch==0" active-color="#7694f3" inactive-color="#ccc" @change='handleSwitch(item)'></el-switch>
                    <span class="words">{{item.content}}</span>
                    <span class="edit" @click='handleEdit(item)'>{{$lan.common.edit}}</span>
                    <span class="center"></span>
                    <el-popconfirm
                      cancel-button-type="info"
                      confirm-button-type="info"
                      :confirmButtonText='$lan.common.confirm'
                      :cancelButtonText='$lan.common.cancel'
                      icon="el-icon-info"
                      iconColor="#fbfbfb"
                      @onCancel="cancelDel"
                      @onConfirm="confirmDel"
                      :title="$lan.webcast.deleteWords_tip">
                      <span  slot="reference" class="delete" @click='handleDel(item)'>{{$lan.common.delete}}</span>
                    </el-popconfirm>
                </div>
            </div>
            <div v-if='isOpenAddDialog' class="addDialog">
                <el-input
                    type="textarea"
                    :placeholder="$lan.webcast.textArea_placeholder2"
                    v-model="iptWordsTxt"
                    maxlength="40"
                    show-word-limit
                    @input='hanleIptTxt'
                    ref='iptWords'
                    resize="none"
                ></el-input>
                <p class="dialogTips">{{$lan.webcast.textArea_placeholder}}</p>
                <span class="dialog-footer">
                    <button class="cancel" @click="cancelAdd" >{{$lan.common.cancel}}</button>
                    <button class="confirm" @click="confirmAdd" type='primary' >{{$lan.common.confirm}}</button>
                </span>
            </div>
        </div>

        <!-- <span v-for="(item,idx) in list" :key='idx'>{{item.content}}</span> -->

    </div>
</template>
<script>
export default {
    props: {
        type: {
            type: String,
            default: ''
        },
        list: {
            type: Array,
            default: []
        },
        addWords: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            state: '',
            wordsId: '',
            iptWordsTxt: '',
            isOpenAddDialog: false,
        }
    },
    methods: {
        hanleIptTxt() {
            this.iptWordsTxt = this.iptWordsTxt.replace(/[^\u4E00-\u9FA5\da-zA-Z]/g,'')
        },
        handleAddBtn() {
            this.isOpenAddDialog = true;
            this.$nextTick(()=>{
                this.$refs.iptWords.focus()
            })
            this.state = 'add';
        },
        handleEdit(_item) {
            this.isOpenAddDialog = true;
            this.iptWordsTxt = _item.content;
            this.wordsId = _item.id;
            this.state = 'edit';
            this.$nextTick(()=>{
                this.$refs.iptWords.focus()
            })
        },
        cancelAdd() {
            this.isOpenAddDialog = false;
            this.iptWordsTxt = '';
            this.state = '';
        },
        async confirmAdd() {
            this.isOpenAddDialog = false;
            switch(this.state) {
                case 'add':
                    await this.$emit('addWords', this.type, this.iptWordsTxt);
                    break;
                case 'edit':
                    await this.$emit('editWords', this.type, {content: this.iptWordsTxt, gsw_id: this.wordsId}, this.$lan.common.edit)
                    break;
            }
            this.iptWordsTxt = '';
            this.wordsId = '';
        },
        handleDel(_item) {
            this.wordsId = _item.id;
        },
        cancelDel() {
            this.wordsId = '';
        },
        async confirmDel() {
            await this.$emit('editWords', this.type, {gsw_id: this.wordsId, status: 1}, this.$lan.common.delete);
            this.wordsId = '';
        },
        handleSwitch(_item) {
            let _switch = _item.switch==0?1:0;
            this.$emit('editWords', this.type, {gsw_id: _item.id, switch: _switch}, this.$lan.webcast.selectState);
        }
    }
}
</script>
<style>
    .el-dialog__header {
        padding: 0!important;
        /* display: none; */
    }
    .el-textarea__inner {
        height: 100px;
    }
</style>
<style scoped lang='less'>
    span {
        display: inline-block;
    }
    .container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .tips {
        padding: 0 12px;
        height: 20px;
        background: #F1F1F1;
        border-radius: 10px;
        color: #666;
        font-size: 10px;
        line-height: 20px;
        margin-bottom: 12px;
    }
    .addBtn {
        width: 64px;
        height: 24px;
        border-radius: 12px;
        border: 1px solid #7694f3;
        color: #7694f3;
        font-size: 12px;
        background: #fff;
        cursor: pointer;
    }
    .addTips {
        color: #999999;
        font-size: 12px;
        margin-left: 12px;
    }
    .listWrap {
        height: 264px;
        margin: 18px auto;
        overflow-y: scroll;
    }
    .list {
        position: relative;
        min-height: 45px;
        background: #f5f6fd;
        border-radius: 6px;
        border: 1px solid #7694f3;
        margin-bottom: 12px;
        box-sizing: border-box;
        padding: 0 30px 0 16px;
    }
    .switch {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        margin-right: 14px;
    }
    .words {
        position: absolute;
        left: 70px;
        top: 50%;
        transform: translate(0, -50%);
        width: 520px;
        color: #333;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .edit {
        position: absolute;
        right: 80px;
        top: 50%;
        transform: translate(0, -50%);
        color: #7694f3;
        font-size: 14px;
        cursor: pointer;
    }
    .center {
        position: absolute;
        right: 70px;
        top: 50%;
        transform: translate(0, -50%);
        background: #c4cef8;
        width: 2px;
        height: 10px;
        margin:0 5px;
    }
    .delete {
        position: absolute;
        right: 30px;
        top: 50%;
        transform: translate(0, -50%);
        color: #FB5656;
        font-size: 14px;
        cursor: pointer;
    }
    .addDialog {
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translate(-50%, 0);
        width: 480px;
        height: 220px;
        background: #fff;
        box-shadow: 0px 8px 36px 21px rgba(124, 124, 124, 0.06), 0px 0px 2px 0px rgba(0, 0, 0, 0.28), 0px 2px 28px 0px rgba(0, 0, 0, 0.19);
        border-radius: 4px;
        padding: 12px;
        box-sizing: border-box;
        .dialog-footer {
            margin-top: 30px;
            float: right;
        }
    }
    .dialogTips {
        color: #999999;
        font-size: 12px;
        margin-top: 8px;
    }
    .cancel {
        font-size: 13px;
        color: #979797;
        width: 80px;
        height: 28px;
        border-radius: 17px;
        opacity: 0.7;
        border: 1px solid #979797;
        background: #fff;
        cursor: pointer;
    }
    .confirm {
      font-size: 13px;
        color: #FFFFFF;
        width: 80px;
        height: 28px;
        background: #7694f3;
        border-radius: 17px;
        margin-left: 12px;
        cursor: pointer;
        outline: none;
      border-color:#7694f3;
    }
</style>
