<template>
    <div class="dining"> 
        <div class="bodyWrap">
            <div class="form">
                <el-form ref="form" :model="form" label-width="80px" size="medium">
                    <div class="overflow">
                        <div class="floatL width340 inputHeight30 mb24">
                            <el-form-item label="签到日期：">
                                <el-date-picker
                                    v-model="form.startTime"
                                    type="daterange"
                                    value-format="timestamp"
                                    @change="init"
                                    range-separator="至"
                                    start-placeholder="签到日期"
                                    end-placeholder="签退日期">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="floatL width260 inputHeight30 ml184 position mb24">
                            <el-form-item label="用工部门：">
                                <div @click="searchDepartmentWrapShow=!searchDepartmentWrapShow">
                                    <el-input 
                                        v-model="form.departmentName" 
                                        popper-class="applyList" 
                                        @focus="focus=true"
                                        placeholder="请选择"></el-input>
                                </div>
                                <i class="el-icon-arrow-down" :class="{'focus1':focus}"></i>
                            </el-form-item>
                        </div>
                        <div class="searchDepartmentWrap applyList" ref="applyList" v-if="searchDepartmentWrapShow">
                            <div class="searchDepartment">
                                <div class="searchIcon"></div>
                                <input type="text" name="" v-model="val" placeholder="请输入关键字">
                            </div>
                            <div class="treeList">
                                <el-tree 
                                    :data="departmentList" 
                                    :props="defaultProps" 
                                    ref="tree"
                                    :filter-node-method="filterNode"
                                    @node-click="handleNodeClick">
                                </el-tree>
                            </div>
                        </div>
                        <div class="floatL width232 inputHeight30 mb24">
                            <el-form-item label="姓名：" label-width="52px">
                                <el-input v-model="form.search" @blur="init" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                        <div style="clear:both"></div>
                    </div>
                    <div class="overflow">
                        <div class="floatL width260 inputHeight30 position mb24">
                            <el-form-item label="招聘者：">
                                <el-select v-model="form.agencyId"
                                            :popper-append-to-body="true"
                                            filterable 
                                            clearable
                                            @change="init"
                                            @clear="init"
                                            placeholder="请选择">
                                    <div class="searchDepartment">
                                        <div class="searchIcon"></div>
                                        <input type="text" name="" v-model="val1" placeholder="请输入关键字">
                                    </div>
                                    <el-option
                                        v-for="(i,k) in filterResult"
                                        :key="k"
                                        :label="i.name"
                                        :value="i.agencyId">       
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="floatL width260 inputHeight30 mb24" style="margin-left:255px;">
                            <el-form-item label="用工单号：">
                                <el-input v-model="form.no" @blur="init" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                        <div class="floatL width232 inputHeight30 mb24">
                            <el-form-item label="状态：" label-width="52px">
                                <el-select v-model="form.states" @change="init" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="已签到未上班" value="checkWork"></el-option>
                                    <el-option label="上班中" value="working"></el-option>
                                    <el-option label="滞留中" value="strandWork"></el-option>
                                    <el-option label="已签退" value="signBackWork"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div style="clear:both"></div>
                    </div>
                    
                </el-form>   
            </div>
            <div class="line"></div>
            <div class="total">
                <span class="floatR color ml20 cursor" @click="pringt">打印</span>
                <span class="floatR color cursor" @click="exportList">导出</span>
            </div>
            <div class="table">
                <ul class="title">
                    <li>序号</li>
                    <li>用工日期</li>
                    <li>用工部门</li>
                    <li>姓名</li>
                    <li>招聘者</li>
                    <li>用工单号</li>
                    <li>计划工作时间</li>
                    <li>签到时间</li>
                    <li>上班时间</li>
                    <li>下班时间</li>
                    <li>签退时间</li>
                    <li>状态</li>
                </ul>
                <ul v-for="(i,k) in dataList" :key="k">
                    <li>{{k+1}}</li>
                    <li>{{i.date}}</li>
                    <li>{{i.departmentName}}</li>
                    <li>{{i.workerName}}</li>
                    <li>{{i.agencyName|agencyName}}</li>
                    <li>{{i.orderNo}}</li>
                    <li>{{i.workTimeStart}} - {{i.workTimeEnd}}</li>
                    <li>
                        <div v-if="i.signInTime">{{i.signInTime}}</div>
                        <div v-else class="null"></div>
                    </li>
                    <li>
                        <div v-if="i.clockTimeStart">{{i.clockTimeStart}}</div>
                        <div v-else class="null"></div>
                    </li>
                    <li>
                        <div v-if="i.clockTimeEnd">{{i.clockTimeEnd}}</div>
                        <div v-else class="null"></div>
                    </li>
                    <li>
                        <div v-if="i.signOutTime">{{i.signOutTime}}</div>
                        <div v-else class="null"></div>
                    </li>
                    <li>{{i.status}}</li>
                </ul>
            </div>
            <div class="dataListNull" v-if="dataList.length==0">
                <img src="../../assets/img/zwsj.png" alt="">
                <p>暂无相关数据</p>
            </div> 
        </div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.current"
            :page-sizes="[8,10]"
            :page-size="form.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
import mixin from '../../assets/js/mixin/mixin'
export default {
    name: 'attendance',
    mixins: [mixin],
    data () {
        return {
            searchDepartmentWrapShow:false,
            departmentList:[],
            val: '',
            form:{
                startTime: '',
                search: '',
                agencyName: '',
                agencyId: '',
                no: '',
                states: '',
                current: 1,
                size: 8
            },
            defaultProps: {
				children: 'children',
				label: 'name'
            },
            focus: false,
            searchDepartmentWrapShow1: false,
            val1: '',
            departmentList1: [],
            focus1: false,
            department: {},
            total: 0,
            dataList: []
        }
    },
    watch: {
		val(val) {
			this.$refs.tree.filter(val);
        },
        // val1(val) {
		// 	this.$refs.tree1.filter(val);
        // },
        filterResult(val) {
            if(!val.length) {
                this.$nextTick(()=>{
                    document.getElementsByClassName('el-scrollbar')[0].style.display="block"
                })
            }
        }
    },
    computed: {
        filterResult() {
            return this.departmentList1.filter(value => new RegExp(this.val1, 'i').test(value.name))
            if(!fil.length) {
                return [{title:'无数据'}]
            }else{
                return fil
            }
        }
    },
    created() {
        let date = new Date(new Date().toLocaleDateString()).getTime()
        this.form.startTime = [date,date]
        this.init()
        this.departmentInit()
        this.agencyInit()
    },
    mounted () {
		document.addEventListener('click',(e)=>{
			if(this.$refs.applyList&&!this.$refs.applyList.contains(e.target)){
                this.searchDepartmentWrapShow = false
                this.focus = false
            }
            if(this.$refs.applyList1&&!this.$refs.applyList1.contains(e.target)){
                this.searchDepartmentWrapShow1 = false
                this.focus1 = false
			}
        })
        
	},
    methods:{
        pringt() {
            if(!this.dataList.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            this.$axios({
                method: 'post',
                url:this.$urls.generateAttendancePdf,
                data:{
                    minWorkDate:this.form.startTime[0]?this.form.startTime[0]:'',
                    maxWorkDate:this.form.startTime[1]?this.form.startTime[1]+86400000:'',
                    departmentIds:this.department.id?[this.department.id]:[],
                    search:this.form.search,
                    agencyId:this.form.agencyId,
                    no:this.form.no,
                    states:this.form.states?[this.form.states]:['checkWork','working','strandWork','signBackWork'],
                    size:100000,
                    current:this.form.current 
                }
            })
            .then(res=>{
				if(res.data.status==200){
                    let i = res.data.content
					this.$printJS('/upload/'+i.filepath+i.filedate)
				}else{
					this.$message({
						message: res.data.message||'操作失败',
						type: 'error',
						duration: 5 * 1000
					})
				}
            })
            .catch(e=>{

            })	
        },
        exportList() {
            if(!this.dataList.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            const costHeader = {
                'idx': {label: '序号', format: (v, rIdx) =>{
                    return v !== undefined||NaN ? (v + '') : (parseInt(rIdx) + 1 + '')
                }},
                'date': {label: '用工日期'},
                'departmentName': {label: '用工部门', default: '--'},
                'workerName': {label: '姓名', default: '--'},
                'agencyName': {label: '招聘者', default: '--'},
                'orderNo': {label: '用工单号', default: '--'},
                'workTimeStart1': {label: '计划工作时间', default: '--'},
                'signInTime': {label: '签到时间', default: '--'},
                'clockTimeStart': {label: '上班时间', default: '--'},
                'clockTimeEnd': {label: '下班时间', default: '--'},
                'signOutTime': {label: '签退时间', default: '--'},
                'status': {label: '状态', default: '--'},
            }
            this.$axios({
                method: 'post',
                url:this.$urls.attendance,
                data:{
                    minWorkDate:this.form.startTime[0]?this.form.startTime[0]:'',
                    maxWorkDate:this.form.startTime[1]?this.form.startTime[1]+86400000:'',
                    departmentIds:this.department.id?[this.department.id]:[],
                    search:this.form.search,
                    agencyId:this.form.agencyId,
                    no:this.form.no,
                    states:this.form.states?[this.form.states]:['checkWork','working','strandWork','signBackWork'],
                    size:100000,
                    current:this.form.current 
                }
            })
            .then(res=>{
				if(res.data.IPage){
                    let arr1 = JSON.stringify(res.data.IPage.records)
                    let arr = JSON.parse(arr1)
                    arr.forEach((i,k)=>{        
                        i.idx = k+1
                        i.workTimeStart1 = `${i.workTimeStart} - ${i.workTimeEnd}`
                    })
                    arr.push({idx:'', date:'', departmentName:'', workerName:'', agencyName:'', orderNo:'', workTimeStart1:'',signInTime: '',clockTimeStart: '',clockTimeEnd: '',signOutTime: '',status: ''});
                    arr.push({idx:'', date:'', departmentName:'', workerName:'', agencyName:'', orderNo:'', workTimeStart1:'',signInTime: '',clockTimeStart: '',clockTimeEnd: '',signOutTime: '',status: ''});
                    arr.push({idx:'导出时间', date:new Date(), departmentName:'', workerName:'', agencyName:'', orderNo:'', workTimeStart1:'',signInTime: '',clockTimeStart: '',clockTimeEnd: '',signOutTime: '',status: ''});
                    this.$excel.downXlsxFromJson(arr, costHeader, '考勤明细表.xlsx')
                }
            })
            .catch(e=>{

            })
        },
        handleSizeChange(val) {
            this.form.size = val
            this.init()
        },
        handleCurrentChange(val) {
            this.form.current = val
            this.init()
        },
        checkTabBar(a) {
            this.tabBar = [false,false,false]
            this.tabBar[a] = true
            this.tabBar = [].concat(this.tabBar)
        },
        filterNode(value, data) {
            if (!value) return true;
			return data.name.indexOf(value) !== -1;
        },
        filterNode1(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
        },
        handleNodeClick(data) {
            this.form.departmentName = data.name
            this.department = data
            this.searchDepartmentWrapShow = false
            this.focus = false
            this.init()
        },
        handleNodeClick1(data) {
            this.form.agencyName = data.name
            this.form.agencyId = data.agencyId
            this.searchDepartmentWrapShow1 = false
            this.focus1 = false
            this.init()
        },
        init() {
            this.$axios({
                method: 'post',
                url:this.$urls.attendance,
                data:{
                    minWorkDate:this.form.startTime?this.form.startTime[0]:'',
                    maxWorkDate:this.form.startTime?this.form.startTime[1]+86400000:'',
                    departmentIds:this.department.id?[this.department.id]:[],
                    search:this.form.search,
                    agencyId:this.form.agencyId,
                    no:this.form.no,
                    states:this.form.states?[this.form.states]:['checkWork','working','strandWork','signBackWork'],
                    size:this.form.size,
                    current:this.form.current 
                }
            })
            .then(res=>{
				if(res.data.IPage){
                    this.total = res.data.IPage.total
                    this.dataList = res.data.IPage.records
                }
            })
            .catch(e=>{

            })

        },
        agencyInit() {
            this.$axios({
                method: 'get',
                url: this.$urls.getHotalAgency
            }).then(res=>{
                this.departmentList1 = res.data
            }).catch(e=>{
                
            })	
        },
        departmentInit() {
            this.$axios({
                method: 'get',
                url:this.$urls.withScope
            })
            .then(res=>{
				this.departmentList = Object.values(this.$base.buildTree(res.data))
            })
            .catch(e=>{

            })	
        },
    }
}
</script>
<style scoped lang="less">
.searchDepartment{
	height:30px;
	margin:4px 5px 10px 5px;
	border: solid 1px #ececec;
	.searchIcon{
		background: url('../../assets/img/logo.png') no-repeat -145px -31px;
		width: 26px;
		height: 26px;
		float:left;
		transform:scale(.6);
		margin: 1px 5px 0 5px;
	}
	input{
		float:left;
		height:100%;
		box-sizing:border-box;
		border:none;
		outline:none;
		color:#999;
		font-size: 12px;
		width: 120px;
	}
	input::-webkit-input-placeholder{
		color:#d4d4d4;
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
}
.dining{
    height:calc(100% - 50px);
    padding: 10px;
    box-sizing: border-box;
    .headTabBar{
        height: 60px;
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        background-color: #fff;
        div{
            flex: 1;
            height: 100%;
            line-height: 58px;
            font-size: 16px;
            text-align: center;
            p{
                margin: 0 auto;
                cursor: pointer;
            }
            .select{
                border-bottom: 2px solid #4c8aff;
                color: #4c8aff;
            }
            .width140{
                width: 140px;
            }
            .width180{
                width: 180px;
            }
        }
    }
    .bodyWrap{
        height: calc(100% - 48px);
        background-color: #fff;
        overflow-y: scroll;
        padding: 24px 20px;
        box-sizing: border-box;
        min-width: 1240px;
        .form{
            .searchDepartmentWrap{
                width: 180px;
                height: 210px;
                background-color: #ffffff;
                box-shadow: 0px 0px 5px 0px rgba(68, 73, 80, 0.1);
                position: absolute;
                z-index: 10;
                top:121px;
                left: 806px;
                padding-top: 6px;
                box-sizing: border-box;
                .searchDepartment{
                    height:30px;
                    margin:4px 5px 10px 5px;
                    border: solid 1px #ececec;
                    .searchIcon{
                        background: url('../../assets/img/logo.png') no-repeat -145px -31px;
                        width: 26px;
                        height: 26px;
                        float:left;
                        transform:scale(.6);
                        margin: 1px 5px 0 5px;
                    }
                    input{
                        float:left;
                        height:100%;
                        box-sizing:border-box;
                        border:none;
                        outline:none;
                        color:#999;
                        font-size: 12px;
                        width: 120px;
                    }
                    input::-webkit-input-placeholder{
                        color:#d4d4d4;
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
                }
            }
            .searchDepartmentWrap1{
                left: 291px;
                top: 174px;
            }
            .position{
                position: relative;
                i{
                    position: absolute;
                    right: 10px;
                    top:9px;
                    color: #c0c4cc;
                    transition: all .2s;
                }
                .focus1{
                    transform: rotate(180deg);
                }
            }
        }
        .line{
            border-top: 2px dashed #d4d4d4;
        }
        .total{
            font-size: 14px;
            margin-top: 18px;
            overflow: hidden;
            .mr40{
                margin-right: 40px;
            }
            
        }
        .table{
            margin-top: 20px;
            ul{
                border-top: 1px solid #ececec;
                border-left: 1px solid #ececec;
                font-size: 0;
                display: flex;
                display: -webkit-flex;
                box-sizing: border-box;
                li{
                    border-right: 1px solid #ececec;
                    display: inline-block;
                    font-size: 12px;
                    height: 47px;
                    line-height: 47px;
                    text-align: center;
                    flex: 1;
                    box-sizing: border-box;
                    .null{
                        width: 24px;
						height: 1px;
						background-color: #d4d4d4;
						margin: 23px auto;
                    }
                }
                li:nth-of-type(1){
                    flex: 0.6;
                }
                li:nth-of-type(6){
                    flex: 1.4;
                }
            }
            ul:nth-last-of-type(1){
                border-bottom: 1px solid #ececec;
            }
            .title{
                font-weight: bold;
            }
            .subtotal{
                li{
                    border-right: 1px solid #fff;
                }
                li:nth-last-of-type(1){
                    border-right: 1px solid #ececec;
                }
            }
        }
        .floatL{
            float: left;
        }
        .floatR{
            float: right;
        }
        .width340{
            width: 340px;
        }
        .inputHeight30{
            height: 30px;
        }
        .width260{
            width: 260px;
        }
        .width232{
            width: 232px;
            margin-left: 175.5px;
        }
        .ml184{
            margin-left: 175.5px;
        }
        .ml20{
            margin-left: 20px;
        }
        .cursor{
            cursor: pointer;
        }
        .color{
            color: #4c8aff;
        }
        .mb24{
            margin-bottom: 24px;
        }
    }
}
</style>
