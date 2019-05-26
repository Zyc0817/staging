<template>
	<div class="employeeFiles">
		<div class="headWrap">
            <div class="advancedSearchBtn" @click="panelShow">高级搜索</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="姓名/证件号/性别/手机号/从业资格证类型" v-model="dataListParams.search" class="searchInput" @keyup.enter="enterSub(dataListParams.search)">
                <div class="searchBtn"  @click="sub(dataListParams.search)">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar :head-tab-bar="headTabBar" :all-list="['temporary','longterm','inside']" :is-check="'nocheck'" :type="'（人）'"></HeadTabBar>
        <div class="listArea">
            <div class="listWrap">
                <div class="listHead">
                    <div class="titleTxt">{{txt}}列表</div>
                    <div class="rightArea">    
                        <div class="draftBox" v-show="show" @click="blacklist"><img src="../../assets/img/heimingdan.svg" alt=""> 黑名单</div>
                    </div>
                </div>
                <Table :data-list="dataList" :table-type="tableType"  :enble="enble" ref="table" :order="init" :order1="blacklist"></Table> 
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
        <personalDetails v-if="$store.state.recruitmentPlan.personalDetailsShow" :reload="init" :data-list="dataList"></personalDetails>
        <PersonalInformationOne v-if="$store.state.recruitmentPlan.personalInformationOneShow" ref="personalInformationOne"></PersonalInformationOne>
        <Approvals v-if="$store.state.recruitmentPlan.ApprovalsShow"></Approvals>
        <Panel v-if="$store.state.recruitmentPlan.panelShow" :reload="init" ref="advancedSearch"></Panel>
	</div>
</template>
<script>
import Panel from '../panelPage/recruitmentPlan/advancedSearchOne'
import Table from '../table/recruitmentManagementOne/employeeFiles'
import personalDetails from '../panelPage/recruitmentPlan/personalDetails'
import PersonalInformationOne from '../panelPage/recruitmentPlan/personalInformationOne'
import Approvals from '../panelPage/recruitmentPlan/approvals'
import HeadTabBar from '../common/headTabBar'
export default {
	name: 'employeeFiles',
  	data () {
      	return {
          	headTabBar: [{num:0,txt:'全部'},
                      {num:0,txt:'小时工'},
                      {num:0,txt:'长期工'},
                      {num:0,txt:'内部员工'}],
          	dataList: [],
              dataListParams: {  //  请求数据参数
                search: '',
              	current: 1,
                size: 8,
                category: [],
                workerCertDate: ''
              },
            txt: '全部',
            tableType: '',
            enble: '',
            total: 0,
            persons: [],
            positions: [],
            show: true
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
            this.dataListParams.category = []
            this.dataListParams.current = 1
            this.tableType = val.k
            this.txt = this.headTabBar[val.k].txt
            this.dataListParams.category = val.position
            this.show = true
            this.init()
        },
        switchBtnCheck(val) {
            if (val) {
                this.theNumberOf()
            } else {
                this.singular()
            }
        }  
    },
    created() {
        this.init()
    },
  	mounted() {
        
    }, 
  	methods: {
        theNumberOf() {  
            let add = 0
            for (let i in this.persons) {
                if (i!='draft'&&i!='cancel') {
                    add+=this.persons[i]
                } 
            }
            this.headTabBar = [
                {num:add,txt:'全部'},
                {num:this.persons.pending,txt:'小时工'},
                {num:this.persons.pass,txt:'长期工'},
                {num:this.persons.reject,txt:'内部员工'}
            ]
        },
        singular() {
            let add = 0
            for (let i in this.positions) {             
                if (i!='draft'&&i!='cancel') {
                    add+=this.positions[i]
                }
            }
            this.headTabBar = [
                {num:add,txt:'全部'},
                {num:this.positions.pending,txt:'小时工'},
                {num:this.positions.pass,txt:'长期工'},
                {num:this.positions.reject,txt:'内部员工'}
            ]
           
        },
        enterSub(item) {
            this.sub(item)
        },
        sub(item) { 
            this.$axios({
                method: 'post',
                url: this.$urls.file,
                data: {
                    search: this.dataListParams.search,
                    current: this.dataListParams.current,
                    size: this.dataListParams.size,
                    workerCertDate: this.dataListParams.workerCertDate
                }
            }).then(res=>{
                this.total = res.data.filesVoIPage.total
                this.dataList = res.data.filesVoIPage.records
                this.statistics = res.data.number
                let add = 0
                for (let i in this.statistics) {
                    add+=this.statistics[i]
                }
                this.headTabBar = [
                {num:add,txt:'全部'},
                {num:this.statistics.temporary,txt:'小时工'},
                {num:this.statistics.longterm,txt:'长期工'},
                {num:this.statistics.inside,txt:'内部员工'}
            ]
            })
        },
        init() {
            let obj = this.$store.state.recruitmentPlan.advancedSearchParams,
            params = {
                gender: obj.value?[obj.value]:[],
                minBirthday: obj.minAge==''?obj.minAge:this.$base.dateforTimestamp(new Date().getFullYear()-obj.minAge+'/'+(new Date().getMonth()+1)+'/'+new Date().getDate()),
                maxBirthday: obj.maxAge==''?obj.maxAge:this.$base.dateforTimestamp(new Date().getFullYear()-obj.maxAge+'/'+(new Date().getMonth()+1)+'/'+new Date().getDate()),
                minHeight: obj.minHeight,
                maxHeight: obj.maxHeight,
                certTypeId: obj.nodeKey,
                workerCertDate: obj.value1,
                bank: obj.cardInformation
            }
            this.$axios({
                method: 'post',
                url: this.$urls.file,
                data: params.workerCertDate != null?Object.assign(this.dataListParams,params):{current: this.dataListParams.current, size: this.dataListParams.size,workerCertDate: this.dataListParams.workerCertDate,category: this.dataListParams.category}
            }).then(res=>{
                this.enble = 'disenble'
                this.total = res.data.filesVoIPage.total
                this.dataList = res.data.filesVoIPage.records
                this.statistics = res.data.number
                let add = 0
                for (let i in this.statistics) {
                    add+=this.statistics[i]
                }
                this.headTabBar = [
                {num:add,txt:'全部'},
                {num:this.statistics.temporary,txt:'小时工'},
                {num:this.statistics.longterm,txt:'长期工'},
                {num:this.statistics.inside,txt:'内部员工'}
            ]
            })
        },
        blacklist(){
            this.$axios({
                method: "get",
                url: this.$urls.getBlackList,
                params: { blacklist: 'enable'}
            }).then(res=>{
                this.enble = 'enble'
                this.dataList = res.data
                this.txt = '黑名单'
            })
            this.show = !this.show
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
        father(item) {
            this.$refs.table.dialogVisibleOne=!this.$refs.table.dialogVisibleOne
            this.$refs.table.back(item) 
        },
        borther() {
            this.$refs.table.black()
        },
        sister() {
            this.$refs.table.personalInformationOne()
        },
        borther1() {
            this.$refs.personalInformationOne.ruleForm.checked = false
        }
  	},
  	components: {
      	Table,
        personalDetails,
        PersonalInformationOne,
        Approvals,
        Panel,
        HeadTabBar
  	}
}
</script>
<style scoped lang="less">
.employeeFiles::-webkit-scrollbar {
	display:none;
}
.employeeFiles{
    background-color: rgba(244, 248, 252, 1);
    height: calc(100% - 50px);
    overflow-y: scroll;
    .headWrap{
        overflow:hidden;
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
                margin:20px 13px 0 0;
                img{
                    float: left;
                    width: 15px;
                    height: 15px;
                    margin-left: 15px;
                    margin-top: 3px;
                }
            }
          }
        }      
    }
        
        .el-pagination{
            float:right;
            padding:18px 20px 0 0;
        }
      
    }
}
</style>
