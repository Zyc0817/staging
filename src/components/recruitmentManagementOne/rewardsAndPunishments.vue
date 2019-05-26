<template>
    <div class="rewardsAndPunishments">
        <div class="headWrap">
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="姓名/证件号/招聘者/原因/用工单号" v-model="dataListParams.search" class="searchInput" @keyup.enter="fuzzySearch(dataListParams.search)">
                <div class="searchBtn" @click="init(dataListParams.search)">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar :head-tab-bar="headTabBar" :all-list="['reward','punishment']" :is-check="'nocheck'" :type="'（次）'"></HeadTabBar>
        <div class="listArea">
            <div class="listWrap">
                <div class="listHead">
                    <div class="titleTxt">{{txt}}列表</div>
                </div>
                <Table :data-list="dataList" :table-type="tableType" ref="table" :order-init="init"></Table>
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
        <PersonalInformations v-if="$store.state.recruitmentPlan.informationShow"></PersonalInformations>
        <DetailPage v-if="$store.state.recruitmentPlan.detailPageShow"></DetailPage>
    </div>
</template>

<script>
import HeadTabBar from '../common/headTabBar'
import AdvancedSearch from '../panelPage/recruitmentPlan/advancedSearch'
import Table from '../table/recruitmentManagementOne/rewardsAndPunishments'
import PersonalInformations from '../panelPage/recruitment/personalInformations'
import DetailPage from '../panelPage/recruitmentPlan/detailPage'
export default {
    name: 'rewardsAndPunishments',
    data () {
        return {
            headTabBar: [{num:0,txt:'全部'},
                      {num:0,txt:'奖励'},
                      {num:0,txt:'惩罚'}],
            txt: '全部',
            dataListParams: {
                current: 1,
                size: 8,
                category: [],
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
            this.dataListParams.current = 1
            this.tableType = val.k
            this.txt = this.headTabBar[val.k].txt
            this.dataListParams.category = val.position
            this.init()
        }
    },
    created() {
        this.init()
    },
    mounted () {

    },
    methods: {
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
            this.$axios({
                method: 'post',
                url:this.$urls.performanceList,
                data: {
                    category: this.dataListParams.category,
                    size: this.dataListParams.size,
                    current: this.dataListParams.current,
                    search: this.dataListParams.search
                }
            })
            .then(res=>{
                console.log(res)
                this.total = res.data.statistics.listPerforman.total
                this.dataList = res.data.statistics.listPerforman.records
                for(let j=0;j<this.dataList.length;j++){
                    this.$refs.table.specificDisplay1.push(false)
                }
                this.statistics = res.data.statistics.number
                let add = 0
                for (let i in this.statistics) {
                    if (i.length==2) {
                        add+=this.number[i]
                    }
                }
                this.headTabBar = [
                    {num:this.statistics.reward+this.statistics.punishment,txt:'全部'},
                    {num:this.statistics.reward,txt:'奖励'},
                    {num:this.statistics.punishment,txt:'惩罚'}
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
        PersonalInformations,
        DetailPage,
    }
}
</script>
<style scoped lang="less">
.rewardsAndPunishments::-webkit-scrollbar {
	display:none;
}
.rewardsAndPunishments{
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
        }
        .el-pagination{
            float:right;
            padding:18px 20px 0 0;
        }

    }
}
</style>

