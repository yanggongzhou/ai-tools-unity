<template>
    <div id="myscript">
        <div class="common_content">
          <button class="backNormal" @click="$router.push('/homePage')">
            <span class="_icon">< </span>
            <span>返回</span>
          </button>
            <div class="list_title clearfix">
              <span>剧本列表</span>
              <button class="light-btn create-btn float_right ml10" @click="gotoPage('steper')">创建剧本</button>
              <button class="light-btn float_right" @click="gotoPage('webcast')">去直播</button>
            </div>
            <el-divider></el-divider>
            <div class="filter">
                <span class="filter_label">关联主播角色：</span>
                <el-select class="filterOptions" @change='fetchAllScripts' v-model='anchorRoleValue'>
                    <el-option
                        v-for='(role,idx) in anchorRoles'
                        :key='idx'
                        :label='role.label'
                        :value='role.value'
                    ></el-option>
                </el-select>
                <div class='search'>
                    <el-input  class='search_ipt' v-model="searchScriptName" placeholder="剧本名称" clearable></el-input>
                    <button class='light-btn search_btn' type="primary" @click="fetchAllScripts">查询</button>
                </div>
            </div>

            <el-table
              size="mini"
              row-key="updated_at" :data='scriptData' style='width:100%' empty-text='暂无剧本' height='450' max-height="450">
                <el-table-column align="center" label="更新时间" min-width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.updated_at | created_atFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="剧本名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="剧本段数">
                    <template slot-scope="scope">
                        <span>{{scope.row.paragraph_number}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="关联IP形象">
                    <template slot-scope="scope">
                        <span>{{scope.row.avatar_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" min-width="130">
                    <template slot-scope="scope">
                        <el-button @click='handleCheck(scope.row)' type="text" size="small">查看</el-button>
                        <el-button @click='handleEdit(scope.row)' type="text" size="small">编辑</el-button>
                        <!-- <el-button @click='handleCopy(scope.row)' type="text" size="small">复用</el-button> -->
                        <el-button @click='handleDelete(scope.row)' type="text" size="small" style='color:#FF7272;'>删除</el-button>
                    </template>
                </el-table-column>

                <div slot="empty" style="height:200px;line-height: 300px;">
                  <i class="el-icon-warning-outline"></i>暂无剧本，去
                  <el-button type="text"  @click="gotoPage('steper')" style="color:#7455FF;">创建脚本</el-button>
                </div>

            </el-table>

            <el-pagination
                style="margin-top: 10px;text-align:right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="start_page"
                :page-sizes="[10, 15, 20]"
                :page-size="page_count"
                layout="total, sizes, prev, pager, next"
                :total="total_count"
            ></el-pagination>

            <el-dialog  top="30vh" :visible.sync="isShowDelDialog" width='30%' style='text-align:center;'>
                <i class="el-icon-warning-outline" style='font-size:42px;color:#7455FF;margin-bottom:18px;font-weight:600;'></i>
                <div>是否删除该剧本？</div>
                <span slot="footer" class="dialog-footer">
                    <el-button class="cancel" @click="cancelDel">取 消</el-button>
                    <el-button class="confirm" type="primary" @click="confirmDel">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
              custom-class="myscriptDialog"
              top="10%"
              width="600px"
              :before-close="previewDialogClose"
              :visible.sync="isShowPreviewDialog">
                <div class="previewbox">
                  <myscriptDialog :scriptRow="scriptRow" :scriptName="scriptName"></myscriptDialog>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { requestServices } from '../api/api';
import myscriptDialog from '../components/myscript-dialog'
import axios from "axios";
export default {
  components:{
    myscriptDialog
  },
  filters:{
    created_atFilter(val){
      return new Date(val*1000).toLocaleString()
    },
  },
    data() {
        return {
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

            searchScriptName: '',
            scriptData: [],
            isShowDelDialog: false,
            delScriptId: '',
            isShowPreviewDialog: false,

            start_page: 1,//当前开始页
            total_count: 4,//页面总数
            page_count: 10,//页面page size

            scriptRow:'',//单条预览的数据
            scriptName:'',//剧本名称
        };
    },
    computed: {},
    watch: {},
    mounted() {
        this.fetchAllScripts();
    },
    methods: {
        fetchAllScripts() {
            requestServices.getAllScripts({
                role_id:this.$root.role_id,
                user_id: this.$root.ai_user_id,
                access_token: this.$root.ai_user_token,
                gs_name: this.searchScriptName, // 剧本名称
                avatar_name: this.anchorRoleValue, // 精灵名称
                scene_type: '', // 场景类型；0-默认类型；1-淘宝；2-抖音；3-快手
                page_start: this.start_page,
                page_count: this.page_count
            }).then(res => {
                // console.log('getAllScripts: ', res)
                if(res.return_code===1000) {
                    this.scriptData = res.result.guide_shopping;
                    this.total_count = res.result.page_count;
                }else if(res.return_code==1009) { // token过期
                    this.$root.ai_user_id = '';
                    this.$root.ai_user_token = '';
                    this.$Session.set('ai_user_id', '');
                    this.$Session.set('ai_user_token', '');
                }else {
                    this.$message.error('获取剧本列表失败')
                }
            })

        },
        handleCheck(row) {
            this.isShowPreviewDialog = true;
            this.scriptName = row.name
            axios.get(row.script_url)
              .then(res=>{
                if(res.status===200){
                  this.scriptRow = res.data
                }else{
                 this.$message.warning('剧本数据获取异常，请重试')
                }
              })
        },
        previewDialogClose(done){
          done();
        },
        handleEdit(_idx) {
          axios.get(_idx.script_url)
            .then(result=>{
              if(result.status===200){
                this.$router.push({name:'tools',params:{data:result.data,id:_idx.id,name:_idx.name}})
              }else{
                this.$message.warning('剧本数据获取异常，请重试')
              }
            })
        },
        handleCopy(_idx) {
            this.$router.push('/tools')
        },
        handleDelete(_idx) {
            this.isShowDelDialog = true;
            this.delScriptId = _idx;
        },
        cancelDel() {
            this.isShowDelDialog = false;
        },
        confirmDel() {
            this.isShowDelDialog = false;
            // this.scriptData.splice(this.delScriptId, 1)
            requestServices.delScript({
                user_id:this.$root.ai_user_id,
                access_token:this.$root.ai_user_token,
                gs_id:this.delScriptId.id
            }).then(res=>{
                if(res.return_code===1000){
                    this.fetchAllScripts();
                }
            })
        },

        handleSizeChange(val) {
            this.page_count = val;
            this.fetchAllScripts();
        },
        handleCurrentChange(val) {
            this.page_start = val;
            this.fetchAllScripts();
        },
        gotoPage(_page) {
          this.$router.push(_page)
          // let route = this.$router.resolve({
          //   name: _page
          // })
          // window.open(route.href, '_blank');
        }
    },
}
</script>
<style scoped lang='less'>
  /deep/.el-dialog__headerbtn{
    font-size: 26px !important;
  }
  /deep/.el-dialog__headerbtn .el-dialog__close{
    color: #000000 !important;
    &:hover{
      transition: all .3s;
      color: #3a2364 !important;;
    }
  }

    #myscript {
        width: 100%;
        height: 100%;
        /*color: #fff;*/
        .common_content {
            padding: 30px 20px;
            position: relative;
        }
    }
    .list_title{
      font-size: 16px;
      color:#333333;
      font-weight: 400;
      margin-top: 30px;
    }
    .filter {
        margin: 20px 0;
        .filter_label{
          color: #666666;
          font-size: 16px;
          font-weight: 400;
        }
        .filterOptions {
            width: 120px;
            margin-right: 20px;
            /deep/.el-input__inner{
              border-radius: 32px;
              border: none;
              box-shadow: 0px 1px 1px #e4d9f9;
              color: #7455FF;
            }
        }
        .search {
            float: right;
        }
        .search_ipt {
            width: 260px;
            margin: 0 10px;
          /deep/.el-input__inner{
            border: none;
            box-shadow: 0px 1px 1px #e4d9f9;
          }
        }
    }
    .previewbox {
        margin: 0 auto;
    }
    .dialog-footer {
        display: flex;
        justify-content: space-between;
        padding: 0 40px 10px;
    }
</style>
<style >
    .search .el-input--small .el-input__inner {
        border-radius: 32px;
    }
    #myscript .el-table thead th {
        background: #7455FF2e!important;
        color: #6d6d6d;
    }
    #myscript .el-table tbody tr:hover>td:first-of-type {
        border-left: 3px solid #7455FF!important;
    }
    #myscript .el-table tbody tr:hover>td {
        background-color: #7455FF0f!important;
    }
    #myscript .el-pager li.active{
      color: #7455FF;
    }
    #myscript .el-pager li:hover{
      color: #7455FFe0;
    }
    #myscript .el-table__empty-block {
        background: url(https://large.magics-ad.com/ai-3D/static/img/null.png) no-repeat center;
        background-size: 256px 176px;
        background-position: center 90px;
    }
    .cancel.el-button {
        width: 82px;
        height: 34px;
        border-radius: 17px;
        cursor: pointer;
        opacity: 0.7;
        color: #B3B3B4;
        border: 1px solid #979797;
        margin-right: 16px;
        background: rgba(0,0,0,0);
    }
    .confirm.el-button {
        width: 82px;
        height: 34px;
        border-radius: 17px;
        cursor: pointer;
        opacity: 0.7;
        background: #7455FF;
        color: #fff;
        border: none;
    }
</style>
<style lang="less" scoped>
  .light-btn {
    border: 1px solid #fff;
    outline: none;
    text-decoration: none;
    font-size: 16px;
    background: linear-gradient(90deg,  #BA71FF,#5648FF,#f441a5,#BA71FF ,#BA71FF );
    /*background: linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4);*/
    background-size: 400%;
    width: 114px;
    height: 40px;
    line-height: 38px;
    color: #fff;
    text-align: center;
    border-radius: 50px;
    cursor: pointer;
    &:focus{
      border: 1px solid #9C27B0;
    }
  }
  .light-btn:hover::before,
  .light-btn:hover {
    animation: sun 8s infinite;
  }

  .light-btn::before {
    content: '';
    background: linear-gradient(90deg, #BA71FF, #f441a5, #5648FF,#BA71FF );
    background-size: 400%;
    border-radius: 50px;
    filter: blur(10px);
  }
  .create-btn{
    background: linear-gradient(90deg,  #FFBA48,#FF71B5,#f441a5,#FFBA48 );
    background-size: 400%;
    margin-left: 30px;
  }
  .search_btn{
    background: linear-gradient(90deg,  #7455FF,#5648FF,#BA71FF ,#7455FF );
    background-size: 400%;
    width: 76px;
    height: 32px;
    line-height: 30px;
    font-size: 14px;
    font-weight: normal;
  }
  @keyframes sun {
    100%{
      background-position: -400% 0;
    }
  }
</style>
