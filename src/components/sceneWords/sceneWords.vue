<template>
    <div class="sceneWordsContent">
        <el-tabs v-model="activeName" class="tabs">
            <el-tab-pane v-for="(item, i) in tabs" :key='i' :label='item.label' :name='item.name'>
                <wordsList :type='item.name' :list='handleList(item.name)' @addWords='addWords' @editWords='editWords'></wordsList>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { requestServices } from '../../api/api';
import wordsList from './wordsList';
export default {
    data() {
        return {
            activeName: 'welcome',
            tabs: [
                {
                    label: '开场语',
                    name: 'welcome'
                },
                {
                    label: '衔接语',
                    name: 'endwords'
                }
            ],
            welcomeWords: [],
            endWords: []
        }
    },
    mounted() {
        this.getAllWords();
        console.log(111111,this.$Session.get('ai_user_id'))
    },
    methods: {
        getAllWords() {
            requestServices.getWords({
                user_id:this.$Session.get('ai_user_id'),
                access_token:this.$Session.get('ai_user_token'),
                role_id: 23,
                type: '1,2'
            }).then(res => {
                if(res.return_code==1000) {
                    this.welcomeWords = res.result.words[1];
                    this.endWords = res.result.words[2];
                }
            })
        },
        handleList(_name) {
            switch(_name) {
                case 'welcome':
                    return this.welcomeWords;
                case 'endwords':
                    return this.endWords;
            }
        },
        handleWrodsType(_type) {
            switch(_type) {
                case 'welcome':
                    return 1;
                case 'endwords':
                    return 2;
            }
        },
        addWords(_type, _txt) {
            let type = this.handleWrodsType(_type);
            requestServices.addWords({
                user_id: this.$Session.get('ai_user_id'),
                access_token:this.$Session.get('ai_user_token'),
                role_id: 23,
                type: type,
                content: _txt
            }).then(res => {
                if(res.return_code==1000) {
                    this.$message.success('添加成功')
                    this.getAllWords();
                }else {
                    this.$message.error('添加失败')
                }
            })
        },
        editWords(_type, _params, _state) {
            let type = this.handleWrodsType(_type);

            requestServices.editWrods(Object.assign({
                user_id:this.$Session.get('ai_user_id'),
                access_token:this.$Session.get('ai_user_token'),
                role_id: 23,
                type: type
            }, _params)).then(res => {
                // console.log(res)
                if(res.return_code==1000) {
                    this.$message.success(`${_state}成功`)
                    this.getAllWords();
                }else {
                    this.$message.error(`${_state}失败`)
                }
            })
        },
    },
    components: {
        wordsList
    }
}
</script>
<style scope lang='less'>
    .sceneWordsContent {
        height: 100%;
        background: #FFFFFF;
        box-shadow: 0px 1px 5px 0px #E6E7EB;
        border-radius: 4px;
        .tabs {
            position: relative;
            padding: 0 26px;
            &::before {
                content: '';
                width:100px;
                height: 2px;
                background-color: #E4E7ED;
                position: absolute;
                left: 0;
                top: 38px;
            }
            &::after {
                content: '';
                width:100px;
                height: 2px;
                background-color: #E4E7ED;
                position: absolute;
                right: 0;
                top: 38px;
            }
        }
    }
</style>
<style scope>
    .el-tabs__item.is-active {
        color: #000;
    }
    .el-tabs__item:hover {
        color: #000;
    }
    .el-tabs__active-bar {
        background-color: #ff7599;
    }
</style>
