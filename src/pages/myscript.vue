<template>
    <div id="myscript">
        <div class="common_content">
            <div class="list_title clearfix">
              <div class="titleBox">
                <span class="titleSpan">{{$lan.common.top_title}}</span>
              </div>
            </div>

<!--            <el-divider></el-divider>-->
            <div class="filter">
<!--                <span class="filter_label">关联主播角色：</span>-->
<!--                <el-select class="filterOptions" @change='fetchAllScripts' v-model='anchorRoleValue'>-->
<!--                    <el-option-->
<!--                        v-for='(role,idx) in anchorRoles'-->
<!--                        :key='idx'-->
<!--                        :label='role.label'-->
<!--                        :value='role.value'-->
<!--                    ></el-option>-->
<!--                </el-select>-->
                <div class='search'>
                    <el-input  class='search_ipt' v-model="searchScriptName" :placeholder="$lan.myscript.title" clearable></el-input>
                    <button class='light-btn search_btn' type="primary" @click="fetchAllScripts">{{$lan.common.search}}</button>
                </div>
              <div class="float_right">
                <button class="light-btn create-btn ml10" @click="gotoPage">{{$lan.myscript.createScript}}</button>
                <button class="light-btn play-btn" @click="gotoPage2">{{$lan.myscript.goLive}}</button>
              </div>
            </div>

            <el-table
              size="mini"
              row-key="updated_at" :data='scriptData' style='width:100%' :empty-text='$lan.myscript.tableNull' height='446' max-height="446">
              <el-table-column align="center" label="#" type="index">
              </el-table-column>
                <el-table-column align="center" :label="$lan.myscript.title">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="$lan.myscript.paragraph">
                    <template slot-scope="scope">
                        <span>{{scope.row.paragraph_number}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="$lan.myscript.ip">
                    <template slot-scope="scope">
                        <span>{{scope.row.avatar_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="$lan.myscript.updateTime" min-width="150">
                  <template slot-scope="scope">
                    <span>{{scope.row.updated_at | created_atFilter}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" :label="$lan.common.handle" min-width="125">
                    <template slot-scope="scope">
                        <el-button @click='handleCheck(scope.row)' type="text" size="mini">{{$lan.common.check}}</el-button>
                        <el-button @click='handleEdit(scope.row)' type="text" size="mini">{{$lan.common.edit}}</el-button>
                        <el-popconfirm
                          style="margin-left: 7px"
                          cancel-button-type="info"
                          confirm-button-type="info"
                          :confirmButtonText='$lan.common.confirm'
                          :cancelButtonText='$lan.common.cancel'
                          icon="el-icon-info"
                          iconColor="#fbfbfb"
                          @onConfirm="confirmDel(scope.row)"
                          :title="$lan.myscript.popconfirm_title">
                          <el-button slot="reference" type="text" size="mini" style='color:#FF7272;'>{{$lan.common.delete}}</el-button>
                        </el-popconfirm>
                    </template>
                </el-table-column>

                <div slot="empty" style="height:200px;line-height: 300px;">
                  <i class="el-icon-warning-outline"></i>{{$lan.myscript.tableNull}}
                  <el-button type="text"  @click="gotoPage" style="color:#7455FF;">{{$lan.myscript.createScript}}</el-button>
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
            <el-dialog
              custom-class="myscriptDialog"
              top="10%"
              width="600px"
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
import { handleScriptTime } from '../api/handleTime';
import myscriptDialog from '../components/myscript/myscript-dialog'
import axios from "axios";
export default {
  components:{
    myscriptDialog
  },
  filters:{
    created_atFilter(val){
      return new Date(val*1000).toLocaleString()
    }
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

            searchScriptName: '',
            scriptData: [],
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
      handleScriptTime: handleScriptTime,
        fetchAllScripts() {
            requestServices.getAllScripts({
                role_id:23,
                user_id: this.$Session.get('ai_user_id'),
                access_token: this.$Session.get('ai_user_token'),
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
                    // this.$Session.set('ai_user_id', '');
                    // this.$Session.set('ai_user_token', '');
                }else {
                    this.$message.error(this.$lan.common.tableListFail)
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
                 this.$message.warning(this.$lan.common.dataFail)
                }
              })
        },
      //编辑
        handleEdit(_idx) {
          axios.get(_idx.script_url)
            .then(result=>{
              if(result.status===200){
                UnityRoute('tools');
                this.$Session.set('Edit_JSON',JSON.stringify({data:result.data,id:_idx.id,name:_idx.name,avatarName:_idx.avatar_name}))
                // this.$router.push({name:'tools',params:{data:result.data,id:_idx.id,name:_idx.name,avatarName:_idx.avatar_name}})
              }else{
                this.$message.warning(this.$lan.common.dataFail)
              }
            })
        },

        confirmDel(_idx) {
            requestServices.delScript({
                role_id:23,
                user_id:this.$Session.get('ai_user_id'),
                access_token:this.$Session.get('ai_user_token'),
                gs_id:_idx.id
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
        gotoPage() {
          UnityRoute('step')
        },
      gotoPage2(){
        UnityRoute('webcast')
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
            padding: 45px 20px;
            position: relative;
        }
    }
    .list_title{
      text-align: right;
      font-size: 16px;
      color:#333333;
      font-weight: 400;
      /*margin-top: 30px;*/
    }
    .filter {
      /*min-width: 780px;*/
        margin: 20px 0;
        .filter_label{
          color: #666666;
          font-size: 16px;
          font-weight: 400;
        }
        .filterOptions {
            width: 120px;
            /deep/.el-input__inner{
              border-radius: 32px;
              border: none;
              box-shadow: 0px 1px 1px #d9e2fd;
              color: #5C83FF;
            }
        }
        .search {
            /*float: right;*/
          display: inline-block;
        }
        .search_ipt {
            width: 170px;
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
        background: #7694f3 !important;
        color: #FFFFFF;
    }
    #myscript .el-table tbody tr:hover>td:first-of-type {
        border-left: 3px solid #7694f3!important;
    }
    #myscript .el-table tbody tr:hover>td {
        background-color: #d2dcfc !important;
    }
    #myscript .el-pager li.active{
      color: #d2dcfc;
    }
    #myscript .el-pager li:hover{
      color: #d2dcfc;
    }
    #myscript .el-table__empty-block {
        background: url(https://large.magics-ad.com/ai-3D/static/img/null.png) no-repeat center;
        background-size: 256px 176px;
        background-position: center 90px;
    }
</style>
<style lang="less" scoped>
  .light-btn {
    border: 1px solid #fff;
    outline: none;
    text-decoration: none;
    background: linear-gradient(90deg, #3563f3, #97affb);
    width: 100px;
    height: 38px;
    line-height: 37px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    border-radius: 50px;
    cursor: pointer;
    &:focus{
      border: 1px solid #7694f3;
    }
  }
  .light-btn:hover::before,
  /*.light-btn:hover {*/
  /*  animation: sun 8s infinite;*/
  /*}*/

  .light-btn::before {
    content: '';
    background: linear-gradient(90deg,  #3563f3, #97affb );
    border-radius: 50px;
    filter: blur(10px);
  }
  .create-btn{
    background: linear-gradient(90deg,  #3563f3, #97affb );
    margin-right: 20px;
    /*position: absolute;*/
    /*right: 0px;*/
    /*top: -15px;*/
  }
  .play-btn{
    /*position: absolute;*/
    /*right: 150px;*/
    /*top: -15px;*/
  }
  .search_btn{
    background: linear-gradient(90deg, #3563f3, #97affb );
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
