<template>
    <div class="costSettlement costs"> 
        <div class="headWrap">
            <div class="leftButton">
                <div class="div1">用工部门：</div>
                <div class="div2" @click="recruitersWrapShow=!recruitersWrapShow">{{recruiters}}<img src="../../assets/img/arrow.svg" alt=""></div>
            </div>
            <div class="leftButton ml30">
                <div class="div1">招聘者：</div>
                <div class="div2" @click="recruitersWrapShow1=!recruitersWrapShow1">{{recruiters1}}<img src="../../assets/img/arrow.svg" alt=""></div>
            </div>
            <div class="leftButton ml30">
                <div class="div1">用工日期：</div>
                <div class="div2">{{recruiters2}}<img src="../../assets/img/arrow.svg" alt=""></div>
                <div class="timeSelect">
                    <el-date-picker
                        v-model="date"
                        @change="handleChange"
                        value-format="timestamp"
                        type="daterange">
                    </el-date-picker>
                </div>
            </div>
            <div class="recruitersWrap" ref="recruitersWrap" v-if="recruitersWrapShow">
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
                            <el-checkbox v-model="i.check" @change="(data)=>{return recruitersItemChange(data,k,i)}">{{i.name}}</el-checkbox>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="sub" @click="sub">确定</div>
                    <div class="cancel" @click="recruitersWrapShow=!recruitersWrapShow">取消</div>
                </div>
            </div>

            <div class="recruitersWrap recruitersWrap1" ref="recruitersWrap1" v-if="recruitersWrapShow1">
                <div class="arrow icon-Triangle2"></div>
                <div class="head">
                    <img src="../../assets/img/screening.svg" alt="">
                    <span>筛选</span>
                </div>
                <div class="body">
                    <p class="titleTxt">内容搜索</p>
                    <div class="search">
                        <div class="searchIcon icon-search"></div>
                        <input type="text" placeholder="请输入关键字" v-model="value1"/>
                    </div>	
                    <div class="checkboxWrap">
                        <div class="checkboxItem" v-for="(i,k) in filterResult1" :key="k" >
                            <el-checkbox v-model="i.check" @change="(data)=>{return recruitersItemChange1(data,k,i)}">{{i.name}}</el-checkbox>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="sub" @click="sub1">确定</div>
                    <div class="cancel" @click="recruitersWrapShow1=!recruitersWrapShow1">取消</div>
                </div>
            </div>

            
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" placeholder="结算单号/结算单名称/用工部门/招聘者" @keyup.enter="init" class="searchInput" v-model="dataListParams.search">
                <div class="searchBtn" @click="init">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <HeadTabBar 
            :head-tab-bar="headTabBar" 
            :all-list="['pending','pass','reject']" 
            ref="headTabBar"
            :txt-color="['#4c8aff','#e45a3c','#2fb768','#666666']"
            :is-check="'nocheck'"></HeadTabBar>
        <div class="listArea">
            <div class="listWrap">
                <div class="listHead">
                    <div class="titleTxt">{{txt}}列表</div>
                    <div v-if="tableType==0||tableType==1" class="right" @click="create">批量操作</div>
                </div>
                <Table 
                    :data-list="dataList" 
                    :table-type="tableType" 
                    ref="table" 
                    :order-init="init"></Table> 
                <div class="dataListNull" v-if="dataList.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>  
            </div>
        </div>
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
        <StatementDetail v-if="$store.state.costManagement.costDetail"></StatementDetail>
        <Approvals v-if="$store.state.recruitmentPlan.progressout"></Approvals>
    </div>
</template>

<script>
import HeadTabBar from '../common/headTabBar'
import Table from '../table/costManagement/costApproval'
import StatementDetail from '../panelPage/costManagement/statementDetail'
import Approvals from '../common/progress2'
export default {
    name: 'costSettlement',  // 费用管理->费用结算
    data () {
        return {
            headTabBar: [{num:0,txt:'全部'},
                        {num:0,txt:'待审批'},
                        {num:0,txt:'已审批'},
                        {num:0,txt:'已退回'}],      
            txt: '全部',
            dataListParams: {
                position: '',
                hotalId: this.$store.state.hotalId,
                agencyId: '',
                search: '',
                departmentId: '',
                endTime: '',
                startTime: '',
            },
            date: '',
            tableType: 0,
            dataList: [],
            value:'',
            checkboxList: [],
            checkboxList1: [],
            checkWrap: [],
            recruitersWrapShow: false,
            recruitersWrapShow1: false,
            value1: '',
            checkWrap1: [],
            recruiters: '全部',
            recruiters1: '全部',
            recruiters2: '全部',
            agencyName: {},
            dialogVisible: false,
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
        filterResult() {
            return this.checkboxList.filter(value => new RegExp(this.value, 'i').test(value.name))
        },
        filterResult1() {
            return this.checkboxList1.filter(value => new RegExp(this.value1, 'i').test(value.name))
		}
    },
    watch: {
        states(val) {
            this.tableType = val.k
            this.txt = this.headTabBar[val.k].txt
            if(val.k==0){
                this.dataListParams.position = ""
            }else{
                this.dataListParams.position = val.position[0]
            }
            this.dataList = []
            this.init()
        }
    },
    created() {
        this.init()
        this.agencyInit()
        this.departmentInit()
    },
    mounted () {
        document.addEventListener('click',(e)=>{
			if(this.$refs.recruitersWrap&&!this.$refs.recruitersWrap.contains(e.target)){
				this.recruitersWrapShow = false
            }
            if(this.$refs.recruitersWrap1&&!this.$refs.recruitersWrap1.contains(e.target)){
				this.recruitersWrapShow1 = false
			}
        })
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
        handleChange() {
            this.recruiters2 = `${this.$base.formattingTime(this.date[0])} 至 ${this.$base.formattingTime(this.date[1])}`
            this.dataListParams.startTime = this.date[0]
            this.dataListParams.endTime = this.date[1]+86399000
            this.init()
        },
        create() {
            this.dialogVisible = true
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
        sure() {
            let obj = this.returnMsg(),
                arr = this.$refs.table.returnCheckArr()
            console.log(arr)
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
            let arr1 = []
            arr.forEach(i=>{
                arr1.push({
                    billOrderId:i,
                    billOrderTags:[]
                })
            })
            this.$axios({
                method: 'post',
                url: this.$urls.batchBillOrderApprove,
                data: {
                    billOrderVos:arr1,
                    comments: obj.txt,
					state: obj.radio==1?'pass':'reject',
					mine: obj.radio==1?'':obj.checked?'Y':'N'
                }
            }).then(res=>{
                if(res.data.code==0) {
					this.$message({
						message: "操作成功",
						type: 'success',
						duration: 5 * 1000
					})
                    this.init()
                    this.obj = {
                        radio: '1',
                        txt: '',
                        checked: false
                    }
				}else{
					this.$message({
						message: res.data.msg||"操作失败",
						type: 'error',
						duration: 5 * 1000
					})
				}
            }).catch(e=>{
    
            })	
            this.dialogVisible = false
        },
        departmentInit() {
            this.$axios({
                method: 'get',
                url: this.$urls.withScope
            })
            .then(res=>{
                this.checkboxList = res.data || []
                this.checkboxList.forEach(i=>{
                    i.check = false
                })
                this.checkboxList = [].concat(this.checkboxList)
            })
            .catch(e=>{
                this.dataList = []
            })
        },
        agencyInit() {
            this.$axios({
                method: 'get',
                url: this.$urls.getAgency
            })
            .then(res=>{
                this.checkboxList1 = res.data.content || []
                this.checkboxList1.forEach(i=>{
                    i.check = false
                })
                this.checkboxList1 = [].concat(this.checkboxList1)
            })
            .catch(e=>{
                this.dataList = []
            })
        },
        sub() {
            let a = this.checkboxList.filter((i,k)=>{
                if (i.check) {
                    return i
                }
            })
            if (a.length) {
                this.recruiters = this.agencyName.name
                this.dataListParams.departmentId = this.agencyName.id
            } else {
                this.recruiters = '全部'
                this.dataListParams.departmentId = ''
            }
            
            this.init()
            this.recruitersWrapShow = false
        },
        sub1() {
            let a = this.checkboxList1.filter((i,k)=>{
                if (i.check) {
                    return i
                }
            })
            if (a.length) {
                this.recruiters1 = this.agencyName1.name
                this.dataListParams.agencyId = this.agencyName1.id
            } else {
                this.recruiters1 = '全部'
                this.dataListParams.agencyId = ""
            }
            
            this.init()
            this.recruitersWrapShow1 = false
        },
        recruitersItemChange(data,k,item) {
            this.checkboxList.forEach((i,j)=>{
                if (item.name == i.name) {
                    if(i.check) {
                        i.check = true
                    }else{
                        i.check = false
                    }   
                } else {
                    i.check = false
                }
            })
           
            this.checkboxList = [].concat(this.checkboxList)
            this.agencyName = item
        },
        recruitersItemChange1(data,k,item) {
            this.checkboxList1.forEach((i,j)=>{
                if (item.id == i.id) {
                    if(i.check) {
                        i.check = true
                    }else{
                        i.check = false
                    }   
                } else {
                    i.check = false
                }
            })
            this.checkboxList1 = [].concat(this.checkboxList1)
            
            this.agencyName1 = item
        },
        init() {
            this.$axios({
                method: 'post',
                url: this.$urls.getBillOrderApprove,
                data: this.dataListParams
            })
            .then(res=>{
                this.dataList = res.data.billOrderVos
                let add = 0
                for (let i in res.data.positions) {
                    add+=res.data.positions[i]
                }
                this.headTabBar= [
                    {num:add,txt:'全部'},
                    {num:res.data.positions.pending,txt:'待审批'},
                    {num:res.data.positions.pass,txt:'已审批'},
                    {num:res.data.positions.reject,txt:'已退回'}
                ]
            })
            .catch(e=>{
                this.dataList = []
            })
        },          
    },
    components: {
        HeadTabBar,
        Table,
        StatementDetail,
        Approvals
    }
}
</script>
<style scoped lang="less">
.costSettlement::-webkit-scrollbar {
	display:none;
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
.dialogBtncheck{
    left: 155px;
}
.costSettlement{
    height: calc(100% - 50px);
    overflow-y: scroll;
    .headWrap{
        height: 43px;
        position: relative;
        .leftButton{
            float: left;
            margin: 16px 0 0 10px;
            overflow: hidden;
            position: relative;
           .div1,.div2{
               float: left;
               font-size: 14px;
               color: #444950;
               height: 22px;
               line-height: 22px;
           }
           .div2{
               margin-left: 10px;
               cursor: pointer;
               img{
                   margin-left: 10px;
                   margin-top: 6px;
                   float: right;
                   transform: scale(.85);
               }
           }
           .div3{

           }
        }
        .ml30{
            margin-left: 30px;
        }
        .timeSelect{
            width: 222px;
            height: 22px;
            position: absolute;
            left: 50px;
            top: 0px;
            opacity: 0;
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
                    padding: 10px 20px 0 20px;
                    height: 130px;
                    overflow-y: scroll;
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
        .recruitersWrap1{
            left: 243px;
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
            .right{
                float: right;
                font-size: 14px;
                color: #4c8aff;
                margin: 20px 20px 0;
                cursor: pointer;
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
