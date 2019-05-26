<template>
    <div class="companyConfirm"> 
        <div class="headWrap">
            <div class="leftButton">
                <div class="div1">招聘者:</div>
                <div class="div2" @click="recruitersWrapShow=!recruitersWrapShow">{{recruiters}}<img src="../../assets/img/arrow.svg" alt=""></div>
            </div>
            <div class="recruitersWrap" v-if="recruitersWrapShow">
                <div class="arrow icon-Triangle2"></div>
                <div class="head">
                    <img src="../../assets/img/screening.svg" alt="">
                    <span>筛选</span>
                </div>
                <div class="body">
                    <p class="titleTxt">内容搜索</p>
                    <div class="search">
                        <div class="searchIcon icon-search"></div>
                        <input type="text" placeholder="请输入关键字" v-model="value"/>
                    </div>	
                    <div class="checkboxWrap">
                        <div class="checkboxItem" v-for="(i,k) in filterResult" :key="k" >
                            <el-checkbox v-model="checkWrap[k]" @change="(data)=>{return recruitersItemChange(data,k,i)}">{{i.name}}</el-checkbox>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="sub" @click="sub">确定</div>
                    <div class="cancel" @click="recruitersWrapShow=!recruitersWrapShow">取消</div>
                </div>
            </div>
            <div class="advancedSearchBtn" @click="panelShow">高级搜索</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="岗位/用工部门/用工单号/招聘者" @keyup.enter="init" class="searchInput" v-model="dataListParams.search">
                <div class="searchBtn" @click="init">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar :head-tab-bar="headTabBar" :all-list="['pending','receive','overdue']" :is-check="'nocheck'" :type="'（个）'"></HeadTabBar>
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
        <AdvancedSearch v-if="$store.state.recruitmentPlan.panelShow" :reload="init" :type="'companyConfirm'"></AdvancedSearch>
        <Decomposition v-if="$store.state.recruitment.decomposition"></Decomposition>
        <PositionDetails v-if="$store.state.recruitment.positionDetails"></PositionDetails>
        <DetailPage v-if="$store.state.recruitmentPlan.detailPageShow"></DetailPage>
        <JobDetail v-if="$store.state.recruitmentPlan.jobDetailShow&&this.$store.state.recruitmentPlan.getDetail.type=='confirm'"></JobDetail>
    </div>
</template>

<script>
import HeadTabBar from '../common/headTabBar'
import AdvancedSearch from '../panelPage/recruitmentPlan/advancedSearch'
import Table from '../table/recruitment/companyConfirm'
import Decomposition from '../panelPage/recruitment/decomposition'
import PositionDetails from '../panelPage/recruitment/positionDetails'
import DetailPage from '../panelPage/recruitmentPlan/detailPage'
import JobDetail from '../panelPage/recruitmentPlan/jobDetail'
export default {
    name: 'companyConfirm',
    data () {
        return {
            headTabBar: [{num:0,txt:'全部岗位'},
                      {num:0,txt:'确认中岗位'},
                      {num:0,txt:'已确认岗位'},
                      {num:0,txt:'已完工岗位'}],
            txt: '全部岗位',
            dataListParams: {
                current: 1,
                size: 8,
                state: ['pending','receive','overdue'],
                hotalId: this.$store.state.hotalId,
                agency: '',
                search: ''
            },
            tableType: 0,
            dataList: [],
            total: 0,
            value:'',
            checkboxList: [],
            checkWrap: [],
            recruitersWrapShow: false,
            recruiters: '全部',
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
        this.agencyInit()
    },
    mounted () {
        
    },
    methods: {
        agencyInit() {
            this.$axios({
                method: 'get',
                url: this.$urls.getAgency
            })
            .then(res=>{
                this.checkboxList = res.data.content || []
                this.checkboxList.forEach(i=>{
                    this.checkWrap.push(false)
                })
            })
            .catch(e=>{
                this.dataList = []
            })
        },
        sub() {
            let a = this.checkboxList.filter((i,k)=>{
                if (this.checkWrap[k]) {
                    return i
                }
            })
            if (a.length) {
                this.recruiters = this.agencyName.name
            } else {
                this.recruiters = '全部'
            }
            this.dataListParams.agency = this.agencyName.id
            this.init()
            this.recruitersWrapShow = false
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
                departments:obj.departments,
                posts:obj.posts,
                maxCreateDate: this.$base.timeplateToss(obj.startTime),
                minCreateDate: this.$base.timeplateToss(obj.endTime),
                minWorkDate: obj.minWorkDate,
                maxWorkDate: obj.maxWorkDate,  
            }
            this.$axios({
                method: 'post',
                url: this.$urls.labourList,
                data: Object.assign(this.dataListParams,params)
            })
            .then(res=>{
                this.total = res.data.tPageVo.totalElements
                this.dataList = res.data.content
                let add = 0
                for (let i in res.data.statistics) {
                    add+=res.data.statistics[i]
                }
                this.headTabBar= [
                    {num:add,txt:'全部岗位'},
                    {num:res.data.statistics.pending,txt:'确认中岗位'},
                    {num:res.data.statistics.receive,txt:'已确认岗位'},
                    {num:res.data.statistics.overdue,txt:'已完工岗位'}
                ]
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
        PositionDetails,
        DetailPage,
        JobDetail
    }
}
</script>
<style scoped lang="less">
.companyConfirm::-webkit-scrollbar {
	display:none;
}
.companyConfirm{
    height: calc(100% - 50px);
    overflow-y: scroll;
    .headWrap{
        height: 43px;
        position: relative;
        .leftButton{
           float: left;
           margin: 16px 0 0 10px;
           overflow: hidden;
           .div1,.div2{
               float: left;
               font-size: 14px;
               color: #444950;
               height: 22px;
               line-height: 22px;
           }
           .div2{
               margin-left: 13px;
               cursor: pointer;
               img{
                   margin-left: 10px;
                   margin-top: 6px;
                   float: right;
                   transform: scale(.85);
               }
           }
        }
        .recruitersWrap{
            position: absolute;
            width: 270px;
            height: 320px;
            background-color: #ffffff;
            box-shadow: 0px 0px 5px 0px rgba(44, 47, 53, 0.1);
            z-index: 10;
            top: 44px;
            left: 83px;
            .arrow{
                position: absolute;
                color: #fff;
                top: -9px;
                left: 34px;
            }
            .head{
                font-size: 14px;
                color: #999999;
                padding: 16px 0 0 15px;
                img{
                    float: left;
                    margin: 3px 5px 0 0;
                }
            }
            .body{
                width: 240px;
                height: 208px;
                margin: 0 auto;
                background-color: #f4f8fc;
                margin-top: 12px;
                overflow-y: scroll;
                .titleTxt{
                    font-size: 12px;
                    color: #444950;
                    padding: 10px 0 5px 20px;
                }
                input::-webkit-input-placeholder{
                    color:#d4d4d4;;
                }
                input::-moz-placeholder{   /* Mozilla Firefox 19+ */
                    color:#d4d4d4;
                }
                input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                    color:#d4d4d4;
                }
                input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                    color:#d4d4d4;
                }
                .search{	
                    width:200px;
                    height:29px;
                    margin:0 auto;
                    background-color:#fff;
                    border: solid 1px #ececec;
                    .searchIcon{
                        float:left;
                        margin:8px 0 0 12px;
                        font-size: 14px;
                    }
                    input{
                        float:left;
                        border:none;
                        outline:none;
                        height:100%;
                        width:150px;
                        padding:0 0 0 10px;
                        color:#999;
                        font-size: 12px;
                    }
                }
                .checkboxWrap{
                    padding: 10px 20px;
                    .checkboxItem{
                        margin-bottom: 5px;
                    }
                }
            }
            .bottom{
                width: 190px;
                margin: 20px auto;
                overflow: hidden;
                div{
                    width: 80px;
                    height: 27px;
                    font-size: 12px;
                    text-align: center;
                    line-height: 25px;
                    box-sizing: border-box;
                    border-radius: 14.5px;
                    border: 1px solid #4c8aff;
                    cursor: pointer;
                }
                .sub{
                    float: left;
                    color: #ffffff;
                    background-color: #4c8aff;
                }
                .cancel{
                    float: right;
                    color: #4c8aff;
                }
            }
        }
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
