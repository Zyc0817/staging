<template>
    <div class="decomposition"> 
        <div class="headWrap">
            <div class="advancedSearchBtn" @click="panelShow">高级搜索</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="用工单号/部门" @keyup.enter="search" v-model="dataListParams.search" class="searchInput">
                <div class="searchBtn" @click="search">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar :head-tab-bar="headTabBar" ref="headTabBar" :all-list="['N','Y']" :check-tab="true" :the-number-of="theNumberOf"></HeadTabBar>
        <div class="listArea">
            <div class="listWrap">
                <div class="listHead">
                    <div class="titleTxt">{{txt}}列表</div>
                </div>
                <Table :data-list="dataList" :table-type="tableType" ref="table" :order-init="init"></Table> 
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
        <AdvancedSearch v-if="$store.state.recruitmentPlan.panelShow" :reload="init" search-txt="招聘"></AdvancedSearch>
        <Decomposition v-if="$store.state.recruitment.decomposition"></Decomposition>
    </div>
</template>

<script>
import HeadTabBar from '../common/headTabBar'
import AdvancedSearch from '../panelPage/recruitmentPlan/advancedSearch'
import Table from '../table/recruitment/decomposition'
import Decomposition from '../panelPage/recruitment/decomposition'
export default {
    name: 'decomposition',
    data () {
        return {
            headTabBar: [{num:0,txt:'全部用工单'},
                      {num:0,txt:'待分解用工单'},
                      {num:0,txt:'已分解用工单'}],
            txt: '全部用工单',
            dataListParams: {
                current: 1,
                size: 8,
                hasSplit: ['N','Y'],
                hotalId: this.$store.state.hotalId,
                search: ''
            },
            tableType: 0,
            dataList: [],
            total: 0,
            statistics:{}
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
            this.dataListParams.hasSplit = []
            this.dataListParams.current = 1
            this.tableType = val.k
            this.txt = this.headTabBar[val.k].txt
            this.dataListParams.hasSplit = val.position
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
        if(this.$route.params.state){
            this.$refs.headTabBar.headTabBarHandleClick(1)
        }
    },
    methods: {
        search() {
            this.init()
        },
        panelShow() {
            this.$store.dispatch('panelShow')
        },
        theNumberOf() {  
            let add = 0
            for (let i in this.statistics) {
                if (i.length==2) {
                    add+=this.statistics[i]
                } 
            }
            this.headTabBar = [
                {num:add,txt:'全部'},
                {num:this.statistics.NN,txt:'待分解'},
                {num:this.statistics.YY,txt:'已分解'}
            ]
        },
        singular() {
            let add = 0
            for (let i in this.statistics) {             
                if (i.length==1) {
                    add+=this.statistics[i]
                }
            }
            this.headTabBar = [
                {num:add,txt:'全部用工单'},
                {num:this.statistics.N,txt:'待分解用工单'},
                {num:this.statistics.Y,txt:'已分解用工单'}
            ]
           
        },
        init() {
            let obj = this.$store.state.recruitmentPlan.advancedSearchParams,
                params = {
                    departments:obj.departments,
                    maxCreateDate:obj.maxCreateDate,
                    maxEmployees: obj.maxEmployees,
                    maxWorkDate:obj.maxWorkDate,
                    minCreateDate:obj.minCreateDate,
                    minEmployees:obj.minEmployees,
                    minWorkDate:obj.minWorkDate
                }
            this.$axios({
                method: 'post',
                url:this.$urls.advertiseList,
                data: Object.assign(this.dataListParams,params)
            })
            .then(res=>{
                this.total = res.data.tPageVo.totalElements
                this.dataList = res.data.content
                this.statistics = res.data.statistics
                if (this.switchBtnCheck) {
                    this.theNumberOf()
                } else {
                    this.singular()            
                }
            })
            .catch(e=>{
                this.dataList = []
            })
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
        Decomposition,
    }
}
</script>
<style scoped lang="less">
.decomposition::-webkit-scrollbar {
	display:none;
}
.decomposition{
    height: calc(100% - 50px);
    overflow-y: scroll;
    .headWrap{
        overflow:hidden;
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
        }
        .rightArea{
          overflow:hidden;
            .icon{
                background: url('../../assets/img/logo.png') no-repeat -201px -35px;
                width: 20px;
                height: 18px;
                float:right;
                margin:30px 10px 0 0;
                position:relative;
                .draftBox{
                    position:absolute;
                    width:15px;
                    height:15px;
                    background-color:#e45a3c;
                    border-radius:50%;
                    top:-37px;
                    left:13px;
                    font-size:12px;
                    color:#fff;
                    text-align:center;
                    line-height:15px;
                }
            }
            .draftBox{
                float:right;
                height:20px;
                line-height:20px;
                font-size:14px;
                color:#4c8aff;
                cursor:pointer;
                margin:20px 20px 0 0;
            }
        }
        .el-pagination{
            float:right;
            padding:18px 20px 0 0;
        }
      
    }
}
</style>
