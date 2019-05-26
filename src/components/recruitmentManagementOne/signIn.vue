<template>
    <div class="signIn"> 
        <div class="headWrap">
            <div class="signin" @click="signPageShow">签到</div>
            <div class="signout" @click="signoutPageShow">签退</div>
            <div class="advancedSearchBtn" @click="panelShow">高级搜索</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="姓名/证件号/用工部门/招聘者" @keyup.enter="init" v-model="dataListParams.search" class="searchInput">
                <div class="searchBtn" @click="init">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar 
            :head-tab-bar="headTabBar" 
            :type="'（人）'"
            :all-list="['sign','clockEnd','delaying','signOut']" 
            :txt-color="['#2fb768','#fab334','#e45a3c','#666666']"
            :is-check="'nocheck'"></HeadTabBar>
        <div class="listArea">
            <div class="listWrap">
                <div class="listHead">
                    <div class="titleTxt">{{txt}}列表</div>
                    <div class="rightArea">    
                        <div class="draftBox" @click="dialogVisible=true">查看今日计划</div>
                    </div>
                </div>
                <Table :data-list="dataList"
                        :table-type="tableType" 
                        :order-init="init"
                        ref="table"></Table> 
                <div class="dataListNull" v-if="dataList.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>  
            </div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="dataListParams.current"
                :page-sizes="[8,10]"
                :page-size="dataListParams.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
        </div>
        <Panel v-if="$store.state.recruitmentPlan.panelShow" :reload="init"></Panel>
        <Sign v-if="$store.state.recruitmentPlan.signPage" :order-init="init"></Sign>
        <SignOut v-if="$store.state.recruitmentPlan.signoutPageShow" :order-init="init"></SignOut>
        <Info v-if="$store.state.recruitmentPlan.signInInfo" :order-init="init"></Info>
        <el-dialog
            title="今日计划"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            :width="'820px'"
            :custom-class="'signInDialog'"
            top="30.3vh">
            <div class="dialog">
                <div class="head">
                    <div class="checkBtn" :class="{'select':checkBtn==1}" @click="checkBtn=1">签到中</div>
                    <div class="checkBtn" :class="{'select':checkBtn==2}" @click="checkBtn=2">即将开始</div>
                    <div class="checkBtn" :class="{'select':checkBtn==3}" @click="checkBtn=3">已满额</div>
                    <div class="checkBtn" :class="{'select':checkBtn==4}" @click="checkBtn=4">已过期</div>
                </div>
                <div class="body">
                    <SignTody :data-list="dataList1"></SignTody>
                    <div class="dataListNull" style="margin-top:35px;" v-if="dataList1.length==0">
                        <img style="width:112px;height:80px;" src="../../assets/img/zwsj.png" alt="">
                        <p>暂无相关数据</p>
                    </div>  
                </div>
            </div>
            <div class="dialogBtn1">
                <div class="cancel" @click="dialogVisible=false">关闭</div>
            </div>  
        </el-dialog>
    </div>
</template>

<script>
import Table from '../table/recruitmentManagementOne/signIn'
import Panel from '../panelPage/recruitmentPlan/advancedSearch1'
import Sign from '../panelPage/recruitmentManagementOne/sign'
import SignOut from '../panelPage/recruitmentManagementOne/signout'
import Info from '../panelPage/recruitmentManagementOne/info'
import HeadTabBar from '../common/headTabBar'
import advancedSearchVue from '../panelPage/recruitmentPlan/advancedSearch.vue'
import SignTody from '../table/recruitmentManagementOne/signTody'
export default {
    name: 'signIn',
    data () {
        return {
            headTabBar: [{num:0,txt:'已签到'},
                      {num:0,txt:'已下班'},
                      {num:0,txt:'滞留中'},
                      {num:0,txt:'已签退'}],
            dataList: [],
            dataListParams: {  //  请求数据参数
                current: 1,
                size: 8,
                signState: 'sign',
                search: '',
            },
            tableType: 0,  //表格类型0全部1审批中2已审批3已退回4已撤销5草稿箱
            txt: '已签到',
            total: 0,
            checkBar: false,
            persons: [],
            positions: [],
            dialogVisible: false,
            checkBtn: 1,
            dataList1: []

        }
    },
    computed: {
        states() {
            return this.$store.state.headTabBar.states
        },
    },
    watch: {
        states(val) {
            this.dataList = []
            this.dataListParams.current = 1
            this.tableType = val.k
            this.txt = this.headTabBar[val.k].txt
            if(val.k==0) {
                this.dataListParams.signState = 'sign'
            }else if(val.k==1) {
                this.dataListParams.signState = 'clockEnd'
            }else if(val.k==2) {
                this.dataListParams.signState = 'delaying'
            }else if(val.k==3) {
                this.dataListParams.signState = 'signOut'
            }
            
            this.init()
        },
        dialogVisible(val) {
            if(val) {
                this.getPlanTodayInit()
            }
        },
        checkBtn(val) {
            if(val==1) {
                this.getPlanTodayInit('signing')
            }else if(val==2){
                this.getPlanTodayInit('starting')
            }else if(val==3){
                this.getPlanTodayInit('full')
            }else if(val==4){
                this.getPlanTodayInit('expired')
            }
        }
    },
    created() {
        this.init()
    },
    methods: {
        getPlanTodayInit(planState) {
            this.$axios({
                method: 'post',
                url:this.$urls.getPlanToday,
                data:{
                    planState:planState?planState:'signing'
                }
            })
            .then(res=>{    
                this.dataList1 = res.data        
            })
            .catch(e=>{
                this.dataList = []
            })
        },
        signoutPageShow() {
            this.$store.dispatch('signoutPageShow')
        },
        signPageShow() {
            this.$store.dispatch('signPageShow')
        },
        handleSizeChange(val) {
            this.dataListParams.size = val
            this.init()
        },
        handleCurrentChange(val) {
            this.dataListParams.current = val
            this.init()
        },
        panelShow() {
            this.$store.dispatch('panelShow')
        },
        fuzzySearch(item) {
            this.init(item)
        },
        init() {
            let obj = {},
            params = {},
            data = {}
            obj = this.$store.state.recruitmentPlan.advancedSearchParams
            if(obj.departmentList&&obj.departmentList.length){
                params.departmentIds = obj.departmentList.map(i=>i.id)
            }
            if(obj.agencyList&&obj.agencyList.length) {
                params.agencyIds = obj.agencyList.map(i=>i.id)
            }  
            if(params.departmentIds||params.agencyList){
                data = Object.assign(params,this.dataListParams)
            }else{
                data = this.dataListParams
            }
            this.$axios({
                method: 'post',
                url:this.$urls.sign,
                data
            })
            .then(res=>{    
                if(res.data.code==0) {
                    this.total = res.data.signs.total
                    this.dataList = res.data.signs.records
                    this.headTabBar = [{num:res.data.persons.signed,txt:'已签到'},
                      {num:res.data.persons.clocked,txt:'已下班'},
                      {num:res.data.persons.delaying,txt:'滞留中'},
                      {num:res.data.persons.signOut,txt:'已签退'}]
                }                
            })
            .catch(e=>{
                this.dataList = []
            })
        }
    },
    components: {
        Table,
        Panel,
        Sign,
        Info,
        HeadTabBar,
        SignTody,
        SignOut
    }
}
</script>
<style scoped lang="less">
.dialog{
    box-sizing: border-box;
    height: 369px;
    .head{
        height: 40px;
        background-color: #eaf3fe;
        padding: 0 10px;
        .checkBtn{
            width: 80px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            color: #444950;
            float: left;
            margin-left: 44px;
            font-size: 16px;
        }
        .select{
            border-bottom: 2px solid #4c8aff;
            color: #4c8aff;
        }
    }
    .body{
        height: 270px;
        overflow-y: scroll;
    }
}
.dialogBtn1{
    width: 90px;
    margin-left: -45px;
}
.dialogBtn1 div{
    font-size: 14px;
    width: 28px;
    height: 20px;
    padding: 4px 30px;
}

.signIn{
    background-color: rgba(244, 248, 252, 1);
    height: calc(100% - 50px);
    .headWrap{
        overflow:hidden;
    }
    .signin{
        width:72px;
        height:20px;
        line-height: 20px;
        padding: 6.5px 14px;
        background-color: #4c8aff;
        border-radius: 16.5px;
        font-size:14px;
        color:#fff;
        text-align:center;
        float:left;
        margin:10px 0 0 10px;
        cursor:pointer;
    }
    .signout{
        width:72px;
        height:20px;
        line-height: 20px;
        padding: 5.5px 13px;
        background-color: #ffffff;
        border-radius: 16.5px;
        font-size:14px;
        color:#4c8aff;
        border: solid 1px #4c8aff;
        text-align:center;
        float:left;
        margin:10px 0 0 10px;
        cursor:pointer;
    }
    .advancedSearchBtn{
        width: 100px;
        height: 33px;
        float:right;
        background-color: #ffffff;
        border-radius: 16.5px;
        border: solid 1px #4c8aff;
        font-size: 14px;
        color: #4c8aff;
        text-align:center;
        line-height:33px;
        margin: 10px 10px 0 0;
        box-sizing:border-box;
        cursor:pointer;
    }
    .searchWrap{
        width: 375px;
        height: 33px;
        background-color: #ffffff;
        border-radius: 22.5px;
        float:right;
        margin:10px 20px 0 0;
        .searchInput{
            float:left;
            height:100%;
            width:250px;
            margin-left:10px;
            box-sizing:border-box;
            outline:none;
            border:none;
            color: #444950;
            font-size: 14px;
        }
        input::-webkit-input-placeholder{
            color:#999999;;
        }
        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
            color:#999999;
        }
        input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
            color:#999999;
        }
        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
            color:#999999;
        }
        .searchIcon{
            font-size: 18px;
            float:left;
            margin:7.5px 0 0 20px;
        }
        .searchBtn{
            height:17px;
            line-height:17px;
            float:right;
            font-size:14px;
            color:#666;
            margin:9px 20px 0 0;
            cursor:pointer;
        }
        .line{
            width:1px;
            height:18px;
            background-color:#ececec;
            float:right;
            margin: 7.5px 20px 0 0;
        }
    }
    
    .listArea{
        overflow:hidden;
        padding:0 10px 10px 10px;
        margin-top:10px;
        height: calc(100% - 185px);
        overflow-y: scroll;
        .listWrap::-webkit-scrollbar {
            display:none;
        }
        .listWrap{
            background-color:#fff;
            padding-bottom:20px;
            height: calc(100% - 68px);
            overflow-y: scroll;
            .listHead{
                overflow:hidden;
            }
              .titleTxt{
                  height:20px;
                  line-height:20px;
                  font-size:14px;
                  color:#666;
                  margin:20px 0 0 20px;
                  float:left;
              }
        }
        .rightArea{
          overflow:hidden;
            .icon{
                color: #4c8aff;
                font-size: 16px;
                float:right;
                margin:23px 10px 0 0;
                position:relative;
                .draftBox{
                    position:absolute;
                    width:15px;
                    height:15px;
                    background-color:#e45a3c;
                    border-radius:50%;
                    top:-32px;
                    left:11px;
                    font-size:12px;
                    color:#fff;
                    text-align:center;
                    line-height:15px;
                    
                }
                .draftBox1{
                    position:absolute;
                    width:6px;
                    height:6px;
                    background-color:#e45a3c;
                    border-radius:50%;
                    top:-2px;
                    left:13px;
                }
            }
            .draftBox{
                float:right;
                height:20px;
                line-height:20px;
                font-size:14px;
                color:#4c8aff;
                cursor:pointer;
                margin:22px 20px 0 0;
            }
        }
        .el-pagination{
            float:right;
            padding:15px 0px 0 0;
        }
      
    }
}
</style>
