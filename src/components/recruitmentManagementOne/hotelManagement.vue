<template>
    <div class="hotelManagement">
        <div class="headWrap">
            <div class="advancedSearchBtn" @click="panelShow">高级搜索</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="姓名/证件号/用工部门/招聘者" v-model="dataListParams.search" class="searchInput" @keyup.enter="fuzzySearch(dataListParams.search)">
                <div class="searchBtn" @click="init(dataListParams.search)">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar :head-tab-bar="headTabBar" :all-list="['pending','pass','finish']" :is-check="'nocheck'" :type="'（人）'"></HeadTabBar>
        <div class="listArea">
            <div class="listWrap">
                <div class="listHead">
                    <div class="titleTxt">{{txt}}列表</div>
                    <div class="BatchCheck" v-if="tableType == 0" @click="centerDialogVisible = true"><span>批量入住</span></div>
                    <div class="BatchCheck" v-else @click="printDialogVisible = true"><span>批量打印</span></div>
                </div>
                <Table :data-list="dataList" :table-type="tableType" ref="table" :order="init"></Table>
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
        <AdvancedSearch v-if="$store.state.recruitmentPlan.panelShow" :reload="init" :type="'hireManagement'"></AdvancedSearch>
        <EmployeeWorkInformation v-if="$store.state.recruitmentPlan.employeeWorkInformationShow"></EmployeeWorkInformation>
        <DetailPage v-if="$store.state.recruitmentPlan.detailPageShow"></DetailPage>
        <div class="recruiters">
			<el-dialog
				title="批量入住"
				:visible.sync="centerDialogVisible"
				width="30%"
				center>
				<div class="recruitersone">确认安排所选人员入住吗？</div>
				<div class="subbuttom">
                    <div @click="sure" class="confirm">确认</div>
                    <div @click="centerDialogVisible = false" class="cancel">取消</div>
                </div>
			</el-dialog>
		</div>
        <div class="recruiters">
			<el-dialog
				title="批量打印"
				:visible.sync="printDialogVisible"
				width="30%"
				center>
				<div class="recruitersone" style="width: 190px;text-align:center;">确认将所选中的批量打印吗？</div>
				<div class="subbuttom">
                    <div @click="print" class="confirm">确认</div>
                    <div @click="printDialogVisible = false" class="cancel">取消</div>
                </div>
			</el-dialog>
		</div>
    </div>
</template>

<script>
import HeadTabBar from '../common/headTabBarTwo'
import AdvancedSearch from '../panelPage/recruitmentPlan/advancedSearchThe'
import Table from '../table/recruitmentManagementOne/hotelManagement'
import EmployeeWorkInformation from '../panelPage/recruitmentPlan/employeeWorkInformation'
import DetailPage from '../panelPage/recruitmentPlan/detailPage'
export default {
    name: 'hotelManagement',
    data () {
        return {
            headTabBar: [{num:0,txt:'待确认'},
                      {num:0,txt:'住宿中'},
                      {num:0,txt:'已退宿'}],
            txt: '待确认',
            dataListParams: {
                current: 1,
                size: 8,
                state: ['pending'],
                search: ''
            },
            tableType: 0,
            dataList: [],
            total: 0,
            value:'',
            checkboxList: [],
            checkWrap: [],
            recruiters: '全部',
            certNo: '',
            agencyName: {},
            printDialogVisible: false,
            centerDialogVisible: false
        }
    },
    computed: {
        states() {
            return this.$store.state.headTabBar.states
        },
        filterResult() {
            return this.checkboxList.filter(value => new RegExp(this.value, 'i').test(value.name))
		}
    },
    watch: {
        states(val) {
            this.dataListParams.state = []
            this.dataListParams.current = 1
            this.tableType = val.k
            this.txt = this.headTabBar[val.k].txt
            this.dataListParams.state = val.position
            this.init()
        }
    },
    created() {
        this.init()
    },
    mounted () {

    },
    methods: {
        sure() {
            let arr = this.$refs.table.returnCheckArr(),
                init = this.init
            if(!arr.length){
                this.$message({
                    message: "请选择要操作的对象",
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
            this.$axios({
                method: 'post',
                url: this.$urls.adds,
                data: { lodgeId: arr }
            }).then(res=>{
                if(res.data.status == 200){
                    this.$message({
                        message: "批量入住成功",
                        type: 'success',
                        duration: 5 * 1000,			
                    })
                }else{
                    this.$message({
                        message: '批量入住失败',
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            }).catch(err=>{
                this.$message({
                        message: '错误',
                        type: 'error',
                        duration: 5 * 1000
                    })
            })
            this.centerDialogVisible = false
        },
        print() {
            let arr = this.$refs.table.returnCheckArr(),
                init = this.init
            if(!arr.length){
                this.$message({
                    message: "请选择要操作的对象",
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
            this.printDialogVisible = false
        },
        recruitersItemChange(data,k,i) {
            this.checkWrap = this.checkWrap.map((i,j)=>{
                if (j == k) {
                    return true
                } else {
                    return false
                }
            })
            this.agencyName = i
        },
        panelShow() {
            this.$store.dispatch('panelShow')
        },
        init() {
            let obj = this.$store.state.recruitmentPlan.advancedSearchParams,
            params = {
                deptIds: obj.nodeKey,
                agencyIds: obj.nodeKeyOne,
                minStartDate: obj.minWorkDate,
                maxEndDate: obj.maxWorkDate
            }
            this.$axios({
                method: 'post',
                url:this.$urls.lodge,
                data: Object.assign(this.dataListParams,params)
            })
            .then(res=>{
                console.log(res)
                // return
                this.total = res.data.listPerforman.total
                this.dataList = res.data.listPerforman.records
                let statistics = {}
                statistics = res.data.number
                this.headTabBar = [
                    {num:statistics.pending,txt:'待确认'},
                    {num:statistics.pass,txt:'住宿中'},
                    {num:statistics.finish,txt:'已退宿'}
                ]
            })
            .catch(e=>{
                this.dataList = []
            })
        },
        fuzzySearch(item) {
            this.init(item)
        },
        handleSizeChange(val) {
        	this.dataListParams.size = val
            this.init()
      	},
      	handleCurrentChange(val) {
        	this.dataListParams.current = val
            this.init()
      	},
    },
    components: {
        AdvancedSearch,
        HeadTabBar,
        Table,
        EmployeeWorkInformation,
        // PersonalInformations,
        DetailPage,
    }
}
</script>
<style scoped lang="less">
.hotelManagement::-webkit-scrollbar {
	display:none;
}
.hotelManagement{
    height: calc(100% - 50px);
    overflow-y: scroll;
    .headWrap{
        height: 43px;
        position: relative;
        .addRecruitment{
            width:100px;
            height:33px;
            background-color: #4c8aff;
            border-radius: 16.5px;
            font-size:12px;
            color:#fff;
            text-align:center;
            line-height:33px;
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
            }
              .titleTxt{
                  height:20px;
                  line-height:20px;
                  font-size:14px;
                  color:#666;
                  margin:20px 0 0 20px;
                  float:left;
              }
              .BatchCheck{
                  height:20px;
                  line-height:20px;
                  font-size:14px;
                  color:#4c8aff;
                  margin:20px 20px 0 0;
                  float: right;
                  span{ cursor: pointer; }
              }
        }
        .el-pagination{
            float:right;
            padding:18px 20px 0 0;
        }

    }
    .recruiters{
        .recruitersone{
            width: 168px;
            margin: 50px auto;
        }
        .subbuttom{
            float: left;
            display: flex;
            width: 100%;
            margin-top: 63px;
            justify-content: center;
            .confirm{
                width: 80px;
                height: 27px;
                text-align: center;
                line-height: 27px;
                font-size: 12px;
                color: #ffffff;
                border-radius: 14.5px;
                border: 1px solid #4c8aff;
                background-color: #4c8aff;
            }
            .cancel{
                width: 80px;
                height: 27px;
                text-align: center;
                line-height: 27px;
                font-size: 12px;
                color: #4c8aff;
                border-radius: 14.5px;
                margin-left: 60px;
                border: 1px solid #4c8aff;
            }
        }
    }
}
</style>

