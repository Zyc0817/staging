<template>
	<div class="employeesWork">
		<div class="headWrap">
            <div class="advancedSearchBtn" @click="panelShow">高级搜索</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="姓名/证件号/用工部门/岗位/用工单号/招聘者" v-model="dataListParams1.search" class="searchInput" @keyup.enter="fuzzySearch(dataListParams.orderNo)">
                <div class="searchBtn"  @click="sub(dataListParams1.search)">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar :head-tab-bar="headTabBar" :all-list="['schedule','signIn','clock','signOut']" :is-check="'nocheck'" :type="'（人）'"></HeadTabBar>
        <div class="listArea">
            <div class="listWrap">
                <div class="listHead">
                    <div class="titleTxt">{{txt}}列表</div>
                    <div class="rightArea" v-if="tableType==1 || tableType==2">    
                        <div class="draftBox" @click="batchAccommodation">批量住宿</div>
                    </div>
                </div>
                <div class="checkPlan" @click="dialogVisible1=true">查看今日计划</div>
                <Table :data-list="dataList" :table-type="tableType" ref="table" :orderInit="init" :dataList1="dataList1" :dataList2="dataList2"></Table> 
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
        <EmployeeWorkInformation v-if="$store.state.recruitmentPlan.employeeWorkInformationShow"></EmployeeWorkInformation>
        <DetailPage v-if="$store.state.recruitmentPlan.detailPageShow" :order-init="init"></DetailPage>
        <ModulationInformations v-if="$store.state.recruitmentPlan.modulationInformationsShow"></ModulationInformations>
        <RewardsAndPunishmentsPage v-if="$store.state.recruitmentPlan.rewardsAndPunishmentsPageShow" :role="init"></RewardsAndPunishmentsPage>
        <PersonalInformationOne v-if="$store.state.recruitmentPlan.personalInformationOneShow"></PersonalInformationOne>
        <Approvals v-if="$store.state.recruitmentPlan.ApprovalsShow"></Approvals>
        <Panel v-if="$store.state.recruitmentPlan.panelShow" :reload="init"></Panel>
        <Rewards v-if="$store.state.costManagement.costRewards1" :order-init="init"></Rewards>
        <AdjustAttendance v-if="$store.state.costManagement.adjustAttendance1" :order-init="init"></AdjustAttendance>
        <el-dialog
            title="批量住宿"
            :visible.sync="dialogVisible"
            width="450px"
            top="30.3vh">
            <div class="dialog">
                <p>确定将批量选中的安排住宿吗？</p>
            </div>
            <div class="dialogBtn">
                <div class="sub" @click="sure(dataList)">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
        <el-dialog
            title="今日计划"
            :visible.sync="dialogVisible1"
            :modal-append-to-body="false"
            :width="'820px'"
            :custom-class="'signInDialog'"
            top="30.3vh">
            <div class="dialog1">
                <div class="head">
                    <div class="checkBtn" :class="{'select':checkBtn==1}" @click="checkBtn=1">签到中</div>
                    <div class="checkBtn" :class="{'select':checkBtn==2}" @click="checkBtn=2">即将开始</div>
                    <div class="checkBtn" :class="{'select':checkBtn==3}" @click="checkBtn=3">已满额</div>
                    <div class="checkBtn" :class="{'select':checkBtn==4}" @click="checkBtn=4">已过期</div>
                </div>
                <div class="body">
                    <CheckTody :dataGrid="dataGrid"></CheckTody>
                    <div class="dataListNull" style="margin-top:35px;" v-if="dataGrid.length==0">
                        <img src="../../assets/img/zwsj.png" alt="">
                        <p>暂无相关数据</p>
                    </div>  
                </div>
            </div>
            <div class="dialogBtn1">
                <div class="cancel" @click="dialogVisible1=false">关闭</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>
import Rewards from '../panelPage/costManagement/rewards'
import Panel from '../panelPage/recruitmentPlan/advancedSearchTwo'
import Table from '../table/recruitmentManagementOne/employeesWork'
import AdjustAttendance from '../panelPage/costManagement/adjustAttendance'
import EmployeeWorkInformation from '../panelPage/recruitmentPlan/employeeWorkInformation'
import RewardsAndPunishmentsPage from '../panelPage/recruitmentPlan/rewardsAndPunishmentsPage'
import DetailPage from '../panelPage/recruitmentPlan/detailPage'
import ModulationInformations from '../panelPage/recruitmentPlan/modulationInformations'
import PersonalInformationOne from '../panelPage/recruitmentPlan/personalInformationOne'
import Approvals from '../panelPage/recruitmentPlan/approvals'
import HeadTabBar from '../common/headTabBarOne'
import CheckTody from '../table/recruitmentManagementOne/checkTody'
export default {
	name: 'employeesWork',
  	data () {
      	return {
          	headTabBar: [{num:0,txt:'预安排'},
                      {num:0,txt:'未上班'},
                      {num:0,txt:'上下班'},
                      {num:0,txt:'已签退'}],
          	dataList: [],
            dataListParams: {  //  请求数据参数
                orderNo: '',
              	current: 1,
                size: 8,
                employeesState: 'schedule'
              },
              dataListParams1: {
                state: 'Unsettlement',
                hotalId: this.$store.state.hotalId,
                agencyId: '',
                search: '',
                departmentId: '',
                endTime: '',
                startTime: '',
            },
            txt: '预安排',
            tableType: '',
            total: 0,
            checkBtn: 1,
            persons: [],
            positions: [],
            dataList1: [],
            dataList2: [],
            dataGrid: [],
            dataListLength: 0,
            dialogVisible: false,
            dialogVisible1: false
      	}
    },
    computed: {
        states() {
            return this.$store.state.headTabBar.states
        },
        switchBtnCheck() {
            return this.$store.state.recruitment.switchBtnCheck
        }
    },
    watch: {
        states(val) {
            this.dataListParams.employeesState = ''
            this.dataListParams.current = 1
            this.tableType = val.k
            this.txt = this.headTabBar[val.k].txt
            this.dataListParams.employeesState = val.position
            if(this.tableType==0||this.tableType==1||this.tableType==2){
                this.init()
                this.dataReport()
            }else if(this.tableType==3){
                this.dataReport()
            }
        },
        dialogVisible1(val) {
            this.checkBtn = 1
            if(val){
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
        this.dataReport()
    },
  	mounted() {
        
    }, 
  	methods: {
          getPlanTodayInit(planState) {
            this.$axios({
                method: 'post',
                url:this.$urls.getPlanTodayDept,
                data:{
                    planState:planState?planState:'signing'
                }
            })
            .then(res=>{    
                this.dataGrid = res.data       
                // console.log(this.dataGrid) 
            })
            .catch(e=>{
                this.dataList = []
            })
        },
          batchAccommodation(){
              this.dialogVisible = !this.dialogVisible
          },
          sure(item){
               let init = this.init,
                arr = this.$refs.table.returnCheckArr()
            if (!arr.length) {
                this.$message({
                    message: "请选择要操作的对象",
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
                this.$axios({
                method: 'post',
                url: this.$urls.addLodging,
                data: arr
            }).then(res=>{
                // console.log(res)
                if(res.data.message == '成功'){
                    this.init()
                    init()
                    this.$refs.table.gary(arr)
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                }
            }).catch(err=>{
                this.$message({
                    message: "操作失败",
                    type: 'error',
                    duration: 5 * 1000
                })
              })
            this.dialogVisible = false
          },
        fuzzySearch(item) {
            this.sub(item)
        },
        sub(item) {
            if(this.tableType!=3){
                this.$axios({
                    method: 'post',
                    url: this.$urls.employeesCommuting,
                    data: {
                        current: this.dataListParams.current,
                        size: this.dataListParams.size,
                        search: this.dataListParams1.search,
                        employeesState: this.dataListParams.employeesState
                    }
                }).then(res=>{
                    this.total = res.data.signLodgingVos.total
                    this.dataList = res.data.signLodgingVos.records
                    this.statistics = res.data.person
                    this.headTabBar = [
                    {num:this.statistics.schedule,txt:'预安排'},
                    {num:this.statistics.signIn,txt:'未上班'},
                    {num:this.statistics.clock,txt:'上下班'},
                    {num:this.dataListLength,txt:'已签退'}
                ]
                })
            }else{
                this.$axios({
                    method: 'post',
                    url: this.$urls.getBillOrder,
                    data: this.dataListParams1
                })
                .then(res=>{
                    if(res.data.workerBillVos){
                        this.dataList2 = res.data.workerBillVos
                        this.dataListLength = this.dataList2.length
                        this.headTabBar[3].num = this.dataList2.length
                    }
                })
                .catch(e=>{
                    this.dataList = []
                })
            }
            
        },
        dataReport() {
			 this.$axios({
                method: 'get',
                url: this.$urls.getBillField,
                params:{settingType: 'examine'} 
            })
            .then(res=>{
                console.log(res)
                if(res.data.length) {
                    this.dataList1 = res.data.filter(i=>!i.userId)
                }
            })  
            .catch(e=>{
                
            })
            
		 },
        init() {
            this.$axios({
                method: 'post',
                url: this.$urls.getBillOrder,
                data: this.dataListParams1
            })
            .then(res=>{
                if(res.data.workerBillVos){
                    this.dataList2 = res.data.workerBillVos
                    this.dataListLength = this.dataList2.length
                    this.headTabBar[3].num = this.dataList2.length
                }
            })
            .catch(e=>{
                this.dataList = []
            })
            let obj = this.$store.state.recruitmentPlan.advancedSearchParams,
            params = {
                departmentIds: obj.nodeKey,
                postIds: obj.nodeKeyOne,
                agencyIds: obj.nodeKeyTwo,
                workTimeStart: obj.workTime1,
                workTimeEnd: obj.workTime2
            }
            this.$axios({
                method: 'post',
                url: this.$urls.employeesCommuting,
                data: Object.assign(this.dataListParams,params)
            }).then(res=>{
                // console.log(res)
                this.total = res.data.signLodgingVos.total
                this.dataList = res.data.signLodgingVos.records
                this.statistics = res.data.person
                this.headTabBar = [
                {num:this.statistics.schedule,txt:'预安排'},
                {num:this.statistics.signIn,txt:'未上班'},
                {num:this.statistics.clock,txt:'上下班'},
                {num:this.dataListLength,txt:'已签退'}
              ]
            }).catch(err=>{ console.log(err) })
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
      	}
  	},
  	components: {
      	Table,
        EmployeeWorkInformation,
        DetailPage,
        RewardsAndPunishmentsPage,
        PersonalInformationOne,
        Approvals,
        ModulationInformations,
        Panel,
        HeadTabBar,
        AdjustAttendance,
        Rewards,
        CheckTody
  	}
}
</script>
<style scoped lang="less">
.employeesWork::-webkit-scrollbar {
	display:none;
}
.employeesWork{
    background-color: rgba(244, 248, 252, 1);
    height: calc(100% - 50px);
    overflow-y: scroll;
    .headWrap{
        overflow:hidden;
    }
    .addEmploymentApplicationBtn{
        width:150px;
        height:50px;
        background-color: #4c8aff;
        border-radius: 25px;
        font-size:17px;
        color:#fff;
        text-align:center;
        line-height:50px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        float:left;
        margin:20px 0 0 30px;
        cursor:pointer;
    }
    .advancedSearchBtn{
        width: 100px;
        height: 33px;
        float:right;
        background-color: #ffffff;
        border-radius: 16.5px;
        border: solid 1px #4c8aff;
        font-size: 12px;
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
            margin:10px 10px 0 0;
        .searchInput{
            float:left;
            height:100%;
            width:250px;
            margin-left:10px;
            box-sizing:border-box;
            outline:none;
            border:none;
            color: #444950;
            font-size: 12px;
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
            font-size:12px;
            color:#666;
            margin:8px 20px 0 0;
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
    .headTabBar{
        height:110px;
        margin-top:10px;
        display:flex;
        padding:0 10px;
        position:relative;
        .switchBtn{
            width:45px;
            height:45px;
            position:absolute;
            background: url('../../assets/img/Triangle-right@3x.svg') no-repeat;
            background-size: 100% 100%;
            overflow:hidden;
            right:10px;
            top:0;
            color:#fff;
            font-size:12px;
            div{
                width: 45px;
                height: 45px;
                text-align:center;
                line-height:27px;
                float:right;
                transform:rotate(45deg);
            }
        }
        .headTabBarItem{
            flex:1;
            height:100%;
            background-color:#fff;
            position:relative;
            cursor:pointer;
            .number{
                font-family: 'Engschrift';
                height:41px;
                text-align:center;
                font-size:48px;
                margin-top:22px;
            }
            .tag{
                height:20px;
                line-height:20px;
                text-align:center;
                font-size: 14px;
                color: #666;
                margin-top:14px;
            }
            .line{
                width:1px;
                height:50px;
                background-color:#ececec;
                position:absolute;
                right:0;
                top:30px;
            }
        }
        .selectTabBar{
            background-color:#fafafa;
            .tag{
                color:#444950;
            }
            .line{
              display:none;
            }
        }
        .headTabBarItem:nth-of-type(1){
            color:#4c8aff;
        }
        .headTabBarItem:nth-of-type(2){
            color:#e45a3c;
        }
        .headTabBarItem:nth-of-type(3){
            color:#2fb768;
        }
        .headTabBarItem:nth-of-type(4){
            color:#fab334;
        }
        .headTabBarItem:nth-of-type(5){
            color:#666
        }
    }
    .listArea{
      overflow:hidden;
        padding:0 10px 10px 10px;
        margin-top:10px;
        height: calc(100% - 185px);
        .listWrap{
            background-color:#fff;
            padding-bottom:20px;
            min-height: calc(100% - 68px);
            .listHead{
                overflow:hidden;
                .titleTxt{
                  height:20px;
                  line-height:20px;
                  font-size:14px;
                  color:#666;
                  margin:20px 0 0 20px;
                  float:left;
              }
              .rightArea{
                overflow:hidden;
                .draftBox{
                    float:right;
                    width: 85px;
                    height:20px;
                    text-align: center;
                    line-height:20px;
                    font-size:14px;
                    color:#4c8aff;
                    cursor:pointer;
                    margin:20px 113px 0 0;
                }
            }
        }    
        .checkPlan{
            float: right;
            font-size:14px;
            color:#4c8aff;
            cursor:pointer;
            margin:-20px 23px 0 0;
        }  
    }
        .el-pagination{
            float:right;
            padding:18px 20px 0 0;
        }
    }
    .dialog{
        p{
            width: 200px;
            margin: 80px auto;
            font-size: 14px;
            color: #444950;
            text-align: center;
        }
    }
.dialog1{
    box-sizing: border-box;
    height: 369px;
    .head{      
        width: 780px;
        height: 40px;
        padding: 0 20px;
        margin-left: -15px;
        background-color: #eaf3fe;
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
        width: 820px;
        height: 270px;
        padding: 0;
        margin-left: -15px;
        overflow-y: scroll;
    }
    .body::-webkit-scrollbar{
        display: none;
    }
    .body:-moz-scrollbar{
        display: none;
    }
    .body::-ms-scrollbar{
        display: none;
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
}
</style>
