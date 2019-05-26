<template>
	<div class="approvalEmployment">
		<div class="headWrap">
            <div class="advancedSearchBtn" @click="panelShow">高级搜索</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="用工单号/用工部门" @keyup.enter="sub" v-model="dataListParams.orderNo" class="searchInput">
                <div class="searchBtn"  @click="sub">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar :head-tab-bar="headTabBar" ref="headTabBar" :all-list="['pending','pass','reject']"></HeadTabBar>
        <div class="listArea">
            <div class="listWrap">
                <div class="listHead">
                    <div class="titleTxt">{{txt}}列表</div>
                    <div class="rightArea">    
                        <div class="draftBox" v-if="tableType==0||tableType==1" @click="dialogVisible=true">批量操作</div>
                    </div>
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
        <DetailPage v-if="$store.state.recruitmentPlan.detailPageShow" :order-init="init"></DetailPage>
        <Approvals v-if="$store.state.recruitmentPlan.progressout"></Approvals>
        <Panel v-if="$store.state.recruitmentPlan.panelShow" search-txt="申请" :reload="init"></Panel>
        <el-dialog
            title="批量操作"
            :visible.sync="dialogVisible"
            :width="width"
            top="30.3vh">
            <div class="dialog">
                <div class="messageWrap batchOperationMessage minHeight" :class="{'minHeight1':width=='530px'}">
                    <div class="radioWrap">
                        <div class="div1">
                            <el-radio v-model="obj.radio" label="1" @change="radioChange">审批</el-radio>
                        </div>
                        <div class="div2">
                            <el-radio v-model="obj.radio" label="2" @change="radioChange">退回</el-radio>
                        </div>
                    </div>
                    <div class="txt" v-if="obj.radio==1">确认审批通过所选的用工申请吗？</div>
                    <div class="backWrap" v-else :class="{'backWrap1':width=='530px'}">
                        <div class="txtWrap" :class="{'txtWrap1':width=='530px'}">
                            <div class="label">退回原因：</div>
                            <textarea placeholder="请输入" v-model="obj.txt"></textarea>
                            <div class="txtNum">{{obj.txt.length}}/1000</div>
                        </div>
                        <div class="checkWrap">
                            <el-checkbox v-model="obj.checked">退回后重新提交的用工申请直接由我审批</el-checkbox>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dialogBtn" :class="{'dialogBtncheck':width=='530px'}">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>
import Panel from '../panelPage/recruitmentPlan/advancedSearch'
import Table from '../table/recruitmentPlan/approvalEmployment'
import DetailPage from '../panelPage/recruitmentPlan/detailPage'
import Approvals from '../common/progress'
import BatchOperationMessage from '../common/batchOperationMessage1'
import HeadTabBar from '../common/headTabBar'
export default {
	name: 'approvalEmployment',
  	data () {
      	return {
          	headTabBar: [{num:0,txt:'全部'},
                      {num:0,txt:'待审批'},
                      {num:0,txt:'已审批'},
                      {num:0,txt:'已退回'}],
          	dataList: [],
          	dataListParams: {  //  请求数据参数
              	current: 1,
                size: 8,
                position: ['pending','pass','reject'],
                orderNo: '',
                descs: [],
                ascs: [],
          	},
          	tableType: 0,  //表格类型0全部1审批中2已审批3已退回4已撤销5草稿箱
          	txt: '全部',
            dialogVisible: false,
            total: 0,
            persons: [],
            positions: [],
            obj: {
				radio: '1',
				txt: '',
				checked: false
            },
            width: '450px'
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
    created() {
        this.init()    
    },
  	mounted() {
        if(this.$route.params.state){
            this.$refs.headTabBar.headTabBarHandleClick(1)
        }
    }, 
  	methods: {
        radioChange(data) {
            if (data == '1') {
                this.width = '450px'
            } else {
                this.width = '530px'
            }
        },
		returnMsg() {
			if (this.obj.txt.length>1000) {
				this.$message({
					message: "退回原因不能超过1000字",
					type: 'error',
					duration: 5 * 1000
				})
				return ""
			}
			return this.obj
		},
		dialogInit() {
			this.obj.txt = ''
			this.obj.batch = '0'
		},
        theNumberOf() {  
            let add = 0
            for (let i in this.persons) {
                if (i!='draft'&&i!='cancel') {
                    add+=this.persons[i]
                } 
            }
            this.headTabBar = [
                {num:add,txt:'全部'},
                {num:this.persons.pending,txt:'待审批'},
                {num:this.persons.pass,txt:'已审批'},
                {num:this.persons.reject,txt:'已退回'}
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
                {num:this.positions.pending,txt:'待审批'},
                {num:this.positions.pass,txt:'已审批'},
                {num:this.positions.reject,txt:'已退回'}
            ]
           
        },
        sub() {
            this.init('advancedSearch')
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
                url:this.$urls.orderApprove,
                data: Object.assign(this.dataListParams,params)
            })
            .then(res=>{    
                this.total = res.data.page.total
                this.dataList = res.data.page.records
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
        sure() {
            let obj = this.returnMsg(),
                arr = this.$refs.table.returnCheckArr()
            if (!obj) {
                return
            }
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
                url: obj.radio==1?this.$urls.getThrough:this.$urls.directReturn,
                data: {
                    id: arr,
                    comments: obj.txt,
					approveState: obj.checked?1:0
                }
            }).then(res=>{
                if(res.data.status==200){
                    this.init()
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                }else{
                    this.$message({
                        message: res.data.message||"操作失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
                
            }).catch(e=>{
                
            })	
            this.dialogVisible = false
        }
  	},
  	components: {
      	Table,
        DetailPage,
        Approvals,
        BatchOperationMessage,
        Panel,
        HeadTabBar
  	}
}
</script>
<style scoped lang="less">

.approvalEmployment{
    background-color: rgba(244, 248, 252, 1);
    height: calc(100% - 50px);
    .dialogBtncheck{
        left: 155px;
    }
    .dialog{
        .minHeight{
            min-height:209px;
        }
        .minHeight1{
            min-height: 259px;
        }
        .messageWrap{
            .radioWrap{
                overflow:hidden;
                width: 210px;
                margin:0 auto;
                margin-top:50px;
            }
            .div1{
                float:left;
            }
            .div2{
                float:right;
            }
            .txt{
                font-size: 14px;
                color: #444950;
                margin-top:50px;
                text-align:center;
            }
            .backWrap{
                margin-top:20px;
                .checkWrap{
                    width: 236px;
                    margin-left: 85px;
                    margin-top: 10px;
                }
            }
            .backWrap1{
                .checkWrap{
                    margin-left: 95px;
                }
            }
            .mt70{
                padding-top: 30px;
            }
            .txtWrap{
                overflow:hidden;
                margin:0px 5px 0 5px;
                position:relative;
                .label{
                    float:left;
                    height: 20px;
                    line-height:20px;
                    font-size: 14px;
                    color: #444950;
                }
                textarea{
                    width:330px;
                    height:90px;
                    font-size:12px;
                    border: solid 1px #ececec;
                    color: #999999;
                    outline:none;
                    resize:none;
                    padding:5px 10px;
                    box-sizing:border-box;
                    float:left;
                    margin-left:10px;
                }
                textarea::-webkit-input-placeholder{
                    color:#999999;;
                }
                textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
                    color:#999999;
                }
                textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                    color:#999999;
                }
                textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                    color:#999999;
                }
                .txtNum{
                    position:absolute;
                    right:10px;
                    font-size: 12px;
                    color: #999999;
                    bottom:5px;
                }
            }
            .txtWrap1{
                margin:0px 15px 0 15px;
                textarea{
                    width: 390px;
                }
                .txtNum{
                    right: 10px;
                }
            }
        }
    }
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
