<template>
    <div class="employmentApplicationWrap"> 
        <div class="headWrap">
            <div class="addEmploymentApplicationBtn" @click="addEmploymentApplication">新增用工申请</div>
            <div class="advancedSearchBtn" @click="panelShow">高级搜索</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="用工单号/用工部门" @keyup.enter="sub" v-model="dataListParams.orderNo" class="searchInput">
                <div class="searchBtn" @click="sub">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar ref="headTabBar" :head-tab-bar="headTabBar" :all-list="['pending','pass','reject','cancel']" :check-bar="checkBar"></HeadTabBar>
        <div class="listArea">
            <div class="listWrap">
                <div class="listHead">
                    <div class="titleTxt">{{txt}}列表</div>
                    <div class="rightArea">    
                        <div class="draftBox" v-if="tableType!=5" @click="draftBoxListShow(5)">草稿箱</div>
                        <div class="draftBox" v-if="tableType==5" @click="deleteAll">批量删除</div>
                        <div class="icon icon-drafts" v-if="tableType!=5">
                            <div class="draftBox" v-if="draftBox&&draftBox<10">{{draftBox}}</div>
                            <div class="draftBox1" v-else-if="draftBox&&draftBox>=10"></div>
                        </div>
                    </div>
                </div>
                <Table :data-list="dataList"
                        :table-type="tableType" 
                        :draft-box-list-show = "draftBoxListShow"
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
        <Panel v-if="$store.state.recruitmentPlan.panelShow" :reload="init" search-txt="申请"></Panel>
        <AddEmploymentApplication v-if="$store.state.recruitmentPlan.addEmploymentApplicationShow" :order-init="init" :init-table="initTable"></AddEmploymentApplication>
        <Approvals v-if="$store.state.recruitmentPlan.progressout"></Approvals>
        <DetailPage v-if="$store.state.recruitmentPlan.detailPageShow" :order-init="init"></DetailPage>
    </div>
</template>

<script>
import Table from '../table/recruitmentPlan/employmentApplication'
import Panel from '../panelPage/recruitmentPlan/advancedSearch'
import AddEmploymentApplication from '../panelPage/recruitmentPlan/addEmploymentApplication'
import Approvals from '../common/progress'
import DetailPage from '../panelPage/recruitmentPlan/detailPage'
import HeadTabBar from '../common/headTabBar'
import advancedSearchVue from '../panelPage/recruitmentPlan/advancedSearch.vue';
export default {
    name: 'employmentApplication',
    data () {
        return {
            headTabBar: [{num:0,txt:'全部'},
                      {num:0,txt:'审批中'},
                      {num:0,txt:'已审批'},
                      {num:0,txt:'已退回'},
                      {num:0,txt:'已撤销'}],
            dataList: [],
            dataListParams: {  //  请求数据参数
                current: 1,
                size: 8,
                position: ['pending','pass','reject','cancel'],
                orderNo: '',
                descs: [],
                ascs: [],
            },
            draftBox: 0,  // 草稿箱数量
            tableType: 0,  //表格类型0全部1审批中2已审批3已退回4已撤销5草稿箱
            txt: '全部',
            total: 1,
            checkBar: false,
            persons: [],
            positions: [],
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
            this.dataListParams.position = []
            this.dataListParams.current = 1
            this.tableType = val.k
            this.txt = this.headTabBar[val.k].txt
            this.dataListParams.position = val.position
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
    mounted() {
        this.init()
    },
    updated() {

    },
    methods: {
        theNumberOf() {  
            let add = 0
            for (let i in this.persons) {
                if (i!='draft') {
                    add+=this.persons[i]
                } 
            }
            this.headTabBar = [
                {num:add,txt:'全部'},
                {num:this.persons.pending,txt:'审批中'},
                {num:this.persons.pass,txt:'已审批'},
                {num:this.persons.reject,txt:'已退回'},
                {num:this.persons.cancel,txt:'已撤销'}   
            ]
        },
        initTable() {
            this.tableType = 0
            this.$refs.headTabBar.headTabBarHandleClick(0)
        },
        singular() {
            let add = 0
            for (let i in this.positions) {             
                if (i!='draft') {
                    add+=this.positions[i]
                }
            }
            this.headTabBar = [
                {num:add,txt:'全部'},
                {num:this.positions.pending,txt:'审批中'},
                {num:this.positions.pass,txt:'已审批'},
                {num:this.positions.reject,txt:'已退回'},
                {num:this.positions.cancel,txt:'已撤销'}   
            ]
           
        },
        sub() {
            this.init('advancedSearch')
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
        addEmploymentApplication() {
            this.$store.dispatch('addEmploymentApplicationShow',{operation:1,type:'employmentApplication'})
        },
        draftBoxListShow(a) {
            this.dataListParams.current = 1
            this.tableType = a
            this.checkBar = true
            this.getDraftOrder()
        },
        getDraftOrder() {
            this.$axios({
                method: 'get',
                url:this.$urls.getDraftOrder,
                params: {
                    current:this.dataListParams.current,
                    size:this.dataListParams.size
                }
            })
            .then(res=>{
                this.total = res.data.total
                this.dataList = res.data.records
            })
            .catch(e=>{
                this.dataList = []
            })
        },
        deleteAll() {
            this.$refs.table.deleteAll()
        },
        init(advancedSearch,sort) {
            let obj = {},
            params = {}
            if (advancedSearch == 'advancedSearch') {
                obj = {}
            } else {
                obj = this.$store.state.recruitmentPlan.advancedSearchParams
                params = {
                    departments:obj.departments,
                    maxCreateDate:obj.maxCreateDate,
                    maxEmployees: obj.maxEmployees,
                    maxWorkDate:obj.maxWorkDate,
                    minCreateDate:obj.minCreateDate,
                    minEmployees:obj.minEmployees,
                    minWorkDate:obj.minWorkDate
                }
            }      
            if (sort&&sort.type == 'descs') {   
                this.dataListParams.descs.push(sort.name)
                this.dataListParams.ascs = []
            } else if (sort&&sort.type == 'ascs') {
                this.dataListParams.ascs.push(sort.name)
                this.dataListParams.descs = []
            }
            
            this.$axios({
                method: 'post',
                url:this.$urls.orders,
                data: Object.assign(this.dataListParams,params)
            })
            .then(res=>{
                this.total = res.data.page.total
                this.dataList = res.data.page.records
                this.draftBox = res.data.positions['draft']
                this.persons = res.data.persons
                this.positions = res.data.positions
                if (this.switchBtnCheck) {
                    this.theNumberOf()
                } else {
                    this.singular()            
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
        AddEmploymentApplication,
        Approvals,
        DetailPage,
        HeadTabBar
    }
}
</script>
<style scoped lang="less">
.employmentApplicationWrap::-webkit-scrollbar {
	display:none;
}
.employmentApplicationWrap{
    background-color: rgba(244, 248, 252, 1);
    height: calc(100% - 50px);
    .headWrap{
        overflow:hidden;
    }
    .addEmploymentApplicationBtn{
        width:72px;
        height:17px;
        padding: 8px 14px;
        background-color: #4c8aff;
        border-radius: 16.5px;
        font-size:12px;
        color:#fff;
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
        .listWrap::-webkit-scrollbar {
            display:none;
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
