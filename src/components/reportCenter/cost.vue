<template>
    <div class="dining"> 
        <div class="headTabBar">
            <div><p class="width140" :class="{'select':tabBar[0]}" @click="checkTabBar(0)">用工费用明细表</p></div>
            <div><p class="width140" :class="{'select':tabBar[1]}" @click="checkTabBar(1)">工时及费用汇总表</p></div>
            <div><p class="width180" :class="{'select':tabBar[2]}" @click="checkTabBar(2)">财务付款统计表</p></div>
        </div>
        <div class="bodyWrap">
            <div class="form" v-if="tabBar[0]">
                <el-form ref="form" :model="form" label-width="80px" size="medium">
                    <div class="overflow">
                        <div class="floatL width340 inputHeight30">
                            <el-form-item label="用工日期：">
                                <el-date-picker
                                    v-model="form.startTime"
                                    type="daterange"
                                    @change="init"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="floatL width260 inputHeight30 ml184 position">
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
                        <div class="floatL width260 inputHeight30 ml184 position mb24">
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
                    </div>
                    <div class="overflow" v-if="tabBar[0]">
                        <div class="floatL width260 inputHeight30">
                            <el-form-item label="姓名：">
                                <el-input v-model="form.workerName" @blur="init" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                        <div class="floatL width260 inputHeight30 mb24" style="margin-left:241px;">
                            <el-form-item label="用工单号：">
                                <el-input v-model="form.orderNo" @blur="init" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                        <div class="floatL width260 inputHeight30 ml184 mb24">
                            <el-form-item label="状态：">
                                <el-select v-model="form.category" @change="init" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="已调整" value="adjusted"></el-option>
                                    <el-option label="未调整" value="unadjusted"></el-option>
                                    <el-option label="复核异常" value="hasTags"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="overflow">
                        <div v-if="!tabBar[1]" class="floatL width260 inputHeight30 mb24">
                            <el-form-item label="统计方式：">
                                <el-select v-model="form.statisticalMethods" @change="init" placeholder="请选择">
                                    <el-option label="按用工日期统计" value="byDate"></el-option>
                                    <el-option label="按个人统计" value="byPerson"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div v-if="tabBar[0]" class="floatL width260 inputHeight30 mb24" style="margin-left:241px;">
                            <el-form-item label="结算单号：">
                                <el-input v-model="form.billOrderNo" @blur="init" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>   
            </div>
            <div class="form" v-if="tabBar[1]">
                <el-form ref="form" :model="form" label-width="80px" size="medium">
                    <div class="overflow">
                        <div class="floatL width340 inputHeight30">
                            <el-form-item label="用工日期：">
                                <el-date-picker
                                    v-model="form.startTime1"
                                    type="daterange"
                                    @change="init1"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="floatL width260 inputHeight30 ml184 position">
                            <el-form-item label="用工部门：">
                                <div @click="searchDepartmentWrapShow=!searchDepartmentWrapShow">
                                    <el-input 
                                        v-model="form.departmentName1" 
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
                                    @node-click="handleNodeClick1">
                                </el-tree>
                            </div>
                        </div>
                        <div class="floatL width260 inputHeight30 ml184 position mb24">
                            <el-form-item label="招聘者：">
                                <el-select v-model="form.agencyId1"
                                    :popper-append-to-body="true"
                                    filterable 
                                    clearable
                                    @change="init1"
                                    @clear="init1"
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
                    </div>
                </el-form> 
            </div>
            <div class="form" v-if="tabBar[2]">
                <el-form ref="form" :model="form" label-width="80px" size="medium">
                    <div class="overflow">
                        <div class="floatL width340 inputHeight30">
                            <el-form-item label="用工日期：">
                                <el-date-picker
                                    v-model="form.startTime2"
                                    type="daterange"
                                    @change="init2"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                        <div class="floatL width260 inputHeight30 ml184 position">
                            <el-form-item label="用工部门：">
                                <div @click="searchDepartmentWrapShow=!searchDepartmentWrapShow">
                                    <el-input 
                                        v-model="form.departmentName2" 
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
                                    @node-click="handleNodeClick2">
                                </el-tree>
                            </div>
                        </div>
                        <div class="floatL width260 inputHeight30 ml184 position mb24">
                            <el-form-item label="招聘者：">
                                <el-select v-model="form.agencyId2"
                                    :popper-append-to-body="true"
                                    filterable 
                                    clearable
                                    @change="init2"
                                    @clear="init2"
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
                    </div>
                    <div class="overflow">
                        <div class="floatL width260 inputHeight30 mb24">
                            <el-form-item label="统计方式：">
                                <el-select v-model="form.paymentMethods" @change="init2" placeholder="请选择">
                                    <el-option label="按部门查询" value="byDepartment"></el-option>
                                    <el-option label="按招聘者查询" value="byAgency"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>   
            </div>
            <div class="line"></div>
            <div class="total" v-if="tabBar[0]">
                <span class="mr40">核算费用：<span class="color">{{cost}}元</span></span>
                <span class="floatR color ml20 cursor" @click="print">打印</span>
                <span class="floatR color cursor" @click="exportList">导出</span>
            </div>
            <div class="total" v-if="tabBar[1]">
                <span class="mr40">用工总人数：<span class="color">{{total1.totalPeople}}人</span></span>
                <span class="mr40">用工总人次：<span class="color">{{total1.totalNumber}}次</span></span>
                <span class="mr40">总工时：<span class="color">{{total1.totalWorkTime}}小时</span></span>
                <span class="mr40">总费用：<span class="color">{{total1.totalCost}}元</span></span>
                <span class="floatR color ml20 cursor" @click="print1">打印</span>
                <span class="floatR color cursor" @click="exportList1">导出</span>
            </div>
            <div class="total" v-if="tabBar[2]">
                <span class="mr40">未申请：<span class="color">{{total2.unsettlement}}元</span></span>
                <span class="mr40">已申请：<span class="color">{{total2.settled}}元</span></span>
                <span class="mr40">待付款：<span class="color">{{total2.pendingPayment}}元</span></span>
                <span class="mr40">已付款：<span class="color">{{total2.paid}}元</span></span>
                <span class="mr40">总费用：<span class="color">{{total2.totalCost}}元</span></span>
                <span class="floatR color ml20 cursor" @click="print2">打印</span>
                <span class="floatR color cursor" @click="exportList2">导出</span>
            </div>
            <div class="table" id="table" v-if="tabBar[0]">
                <Tabel
                    :data-list="dataList" 
                    :data-list1="dataList1"
                    ref="table"
                ></Tabel>
                <div class="dataListNull" v-if="dataList.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div> 
            </div>

            <div class="table" v-if="tabBar[1]">
                <ul class="title" :class="{'borderbottom':dataList2.length==0}">
                    <li>序号</li>
                    <li>用工部门</li>
                    <li>招聘者</li>
                    <li>用工总人数</li>
                    <li>用工总人次</li>
                    <li>总工时</li>
                    <li>总费用（元）</li>
                </ul>
                <div v-for="(i,k) in dataList2" :key="k">
                    <ul v-if="i.agencyName!='subtotal'">
                        <li>{{k+1}}</li>
                        <li>{{i.departmentName}}</li>
                        <li>{{i.agencyName}}</li>
                        <li>{{i.totalPeople}}</li>
                        <li>{{i.totalNumber}}</li>
                        <li>{{i.totalWorkTime}}</li>
                        <li>{{i.totalCost}}</li>
                    </ul>
                    <ul v-else class="subtotal" :class="{'borderbottom':dataList2.length-1==k}">
                        <li></li>
                        <li></li>
                        <li class="color">小计：</li>
                        <li class="color">{{i.totalPeople}}</li>
                        <li class="color">{{i.totalNumber}}</li>
                        <li class="color">{{i.totalWorkTime}}</li>
                        <li class="color">{{i.totalCost}}</li>
                    </ul>
                </div>
                <div class="dataListNull" v-if="dataList2.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>  
            </div>
            <div class="table" v-if="tabBar[2]">
                <ul class="title" :class="{'borderbottom':dataList3.length==0}">
                    <li>序号</li>
                    <li>用工部门</li>
                    <li>招聘者</li>
                    <li>未申请（元)</li>
                    <li>已申请（元)</li>
                    <li>待付款（元)</li>
                    <li>已付款（元)</li>
                    <li>总费用（元)</li>
                </ul>
                <div v-if="form.paymentMethods=='byDepartment'">
                    <div v-for="(i,k) in dataList3" :key="k">
                        <ul v-if="i.agencyName!='subtotal'">
                            <li>{{k+1}}</li>
                            <li>{{i.departmentName}}</li>
                            <li>{{i.agencyName}}</li>
                            <li>{{i.unsettlement}}</li>
                            <li>{{i.settled}}</li>
                            <li>{{i.pendingPayment}}</li>
                            <li>{{i.paid}}</li>
                            <li>{{i.totalCost}}</li>
                        </ul>
                        <ul v-else class="subtotal" :class="{'borderbottom':dataList3.length-1==k}">
                            <li></li>
                            <li></li>
                            <li class="color">小计：</li>
                            <li class="color">{{i.unsettlement}}</li>
                            <li class="color">{{i.settled}}</li>
                            <li class="color">{{i.pendingPayment}}</li>
                            <li class="color">{{i.paid}}</li>
                            <li class="color">{{i.totalCost}}</li>
                        </ul>
                    </div>
                </div>
                <div v-else>
                    <div v-for="(i,k) in dataList3" :key="k">
                        <ul v-if="i.departmentName!='subtotal'">
                            <li>{{k+1}}</li>
                            <li>{{i.departmentName}}</li>
                            <li>{{i.agencyName}}</li>
                            <li>{{i.unsettlement}}</li>
                            <li>{{i.settled}}</li>
                            <li>{{i.pendingPayment}}</li>
                            <li>{{i.paid}}</li>
                            <li>{{i.totalCost}}</li>
                        </ul>
                        <ul v-else class="subtotal" :class="{'borderbottom':dataList3.length-1==k}">
                            <li></li>
                            <li></li>
                            <li class="color">小计：</li>
                            <li class="color">{{i.unsettlement}}</li>
                            <li class="color">{{i.settled}}</li>
                            <li class="color">{{i.pendingPayment}}</li>
                            <li class="color">{{i.paid}}</li>
                            <li class="color">{{i.totalCost}}</li>
                        </ul>
                    </div>
                </div>
                <div class="dataListNull" v-if="dataList3.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>
            </div>
        </div>
        <FieldSet v-if="$store.state.costManagement.fieldSet" :order-init="init"></FieldSet>
    </div>
</template>
<script>
import Tabel from '../table/reportCenter/cost'
import FieldSet from '../panelPage/costManagement/fieldSet'
export default {
    name: 'cost',
    data () {
        return {
            tabBar: [true,false,false],
            searchDepartmentWrapShow:false,
            departmentList:[],
            val: '',
            form:{
                startTime: '',
                agencyId: '',
                workerName: '',
                orderNo: '',
                workBillState: '',
                statisticalMethods: 'byDate',
                billOrderNo: '',
                startTime1: '',
                departmentName: '',
                departmentName1: '',
                agencyId1: '',
                startTime2: '',
                departmentName2: '',
                agencyId2: '',
                paymentMethods: 'byDepartment',
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
            dataList: [],
            dataList1: [],
            screenWidth: '',
            tableWidth: '',
            department: {},
            department1: {},
            department2: {},
            cost: 0,
            dataList2: [],
            total1: {
                totalPeople:0,
                totalNumber:0,
                totalWorkTime:0,
                totalCost:0
            },
            dataList3: [],
            total2: {
                totalCost: 0,
                unsettlement: 0,
                paid: 0,
                pendingPayment: 0,
                settled: 0
            }
        }
    },
    watch: {
		val(val) {
			this.$refs.tree.filter(val);
        },
        filterResult(val) {
            if(!val.length) {
                this.$nextTick(()=>{
                    document.getElementsByClassName('el-scrollbar')[0].style.display="block"
                })
            }
        },
        searchDepartmentWrapShow(val) {
            this.val = ''
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
        this.form.startTime1 = [date,date]
        this.form.startTime2 = [date,date]
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
        print() {
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
                url:this.$urls.generatePdfInfo,
                data:{
                    generateState: 'reportPdf',
					startTime:this.form.startTime?this.form.startTime[0]:'',
                    endTime:this.form.startTime?this.form.startTime[1]+86400000:'',
                    filterDepts:this.department.id?[this.department.id]:[],
                    agencyId:this.form.agencyId,
                    workerName: this.form.workerName,
                    orderNo: this.form.orderNo,
                    workBillState: this.form.workBillState,
                    statisticalMethods: this.form.statisticalMethods,
                    billOrderNo: this.form.billOrderNo,
				}
            })
            .then(res=>{
                if(res.data.status==200){
					let url = this.$baseApi.split('/hotelApi')
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
        print1() {
            if(!this.dataList2.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            this.$axios({
                method: 'post',
                url:this.$urls.generateWorkerCostSumPdf,
                data:{
                    startTime:this.form.startTime1?this.form.startTime1[0]:'',
                    endTime:this.form.startTime1?this.form.startTime1[1]+86400000:'',
                    departmentIds:this.department1.id?[this.department1.id]:[],
                    agencyId:this.form.agencyId1,
				}
            })
            .then(res=>{
                if(res.data.status==200){
					let url = this.$baseApi.split('/hotelApi')
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
        print2() {
            if(!this.dataList3.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            this.$axios({
                method: 'post',
                url:this.$urls.generatePaymentStatisticsPdf,
                data:{
                    startTime:this.form.startTime2?this.form.startTime2[0]:'',
                    endTime:this.form.startTime2?this.form.startTime2[1]+86400000:'',
                    departmentIds:this.department2.id?[this.department2.id]:[],
                    agencyId:this.form.agencyId2,
                    paymentMethods:this.form.paymentMethods
				}
            })
            .then(res=>{
                if(res.data.status==200){
					let url = this.$baseApi.split('/hotelApi')
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
            let costHeader = {
                'idx': {label: '序号', format: (v, rIdx) =>{
                    return v !== undefined||NaN ? (v + '') : (parseInt(rIdx) + 1 + '')
                }},
                'workerDate': {label: '用工日期'},
                'workerName': {label: '姓名',}
            }
            this.dataList1.forEach(i=>{
                if(!i.userId){
                    costHeader[i.field] = {label: i.fieldName}
                }
            })
            costHeader.cost = {label: '核算费用 (元)'}
            let arr1 = JSON.stringify(this.dataList)
            let arr = JSON.parse(arr1)
            arr.forEach((i,k)=>{
                if(i.subtotal){
                    i.cost='小计'+i.subtotal
                    i.idx = ''
                }else if(i.total) {
                    i.cost='总计'+i.total
                    i.idx = ''
                }else{
                    i.idx = k+1
                }
            })
            let obj = {}
            for(let i in costHeader){
                obj[i] = ''
            }
            arr.push(obj)
            arr.push(obj)
            arr.push({idx:'导出时间',workerDate:new Date()})
            this.$excel.downXlsxFromJson(arr, costHeader, '用工费用明细表.xlsx')
        },
        exportList1() {
            if(!this.dataList2.length){
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
                'departmentName': {label: '用工部门'},
                'agencyName': {label: '招聘者', default: '--'},
                'totalPeople': {label: '用工总人数', default: '--'},
                'totalNumber': {label: '用工总人次', default: '--'},
                'totalWorkTime': {label: '总工时', default: '--'},
                'totalCost': {label: '总费用（元）', default: '--'}
            }
            let arr1 = JSON.stringify(this.dataList2)
            let arr = JSON.parse(arr1)
            arr.forEach((i,k)=>{
                if(i.agencyName=='subtotal'){
                    i.agencyName='小计'
                    i.idx = ''
                }else{
                    i.idx = k+1
                }
            })
            arr.push({idx:'', departmentName:'', agencyName:'',totalPeople: '', totalNumber:'', totalWorkTime:'', totalCost:''});
            arr.push({idx:'', departmentName:'', agencyName:'',totalPeople: '', totalNumber:'', totalWorkTime:'', totalCost:''});
            arr.push({idx:'导出时间', departmentName:new Date(), agencyName:'',totalPeople: '', totalNumber:'', totalWorkTime:'', totalCost:''});
            this.$excel.downXlsxFromJson(arr, costHeader, '工时及费用汇总表.xlsx')
        },
        exportList2() {
            if(!this.dataList3.length){
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
                'departmentName': {label: '用工部门'},
                'agencyName': {label: '招聘者', default: '--'},
                'unsettlement': {label: '未申请（元)', default: '--'},
                'settled': {label: '已申请（元)', default: '--'},
                'pendingPayment': {label: '待付款（元)', default: '--'},
                'paid': {label: '已付款（元)', default: '--'},
                'totalCost': {label: '总费用（元)', default: '--'}
            }
            let arr1 = JSON.stringify(this.dataList3)
            let arr = JSON.parse(arr1)
            if(this.form.paymentMethods=="byDepartment"){
                arr.forEach((i,k)=>{
                    if(i.agencyName=='subtotal'){
                        i.agencyName='小计'
                        i.idx = ''
                    }else{
                        i.idx = k+1
                    }
                })
            }else{
                arr.forEach((i,k)=>{
                    if(i.departmentName=='subtotal'){
                        i.agencyName='小计'
                        i.idx = ''
                    }else{
                        i.idx = k+1
                    }
                })
            }
            
            arr.push({idx:'', departmentName:'', agencyName:'',unsettlement: '', settled:'', pendingPayment:'', paid:'',totalCost:''});
            arr.push({idx:'', departmentName:'', agencyName:'',unsettlement: '', settled:'', pendingPayment:'', paid:'',totalCost:''});
            arr.push({idx:'导出时间', departmentName:new Date(), agencyName:'',unsettlement: '', settled:'', pendingPayment:'',paid:'', totalCost:''});
            this.$excel.downXlsxFromJson(arr, costHeader, '财务付款统计表.xlsx')
        },
        checkTabBar(a) {
            this.tabBar = [false,false,false]
            this.tabBar[a] = true
            this.tabBar = [].concat(this.tabBar)
            
            if(a==0){
                this.init()
            }else if(a==1){
                this.init1()
            }else{
                this.init2()
            }
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
            this.form.departmentName1 = data.name
            this.department1 = data
            this.searchDepartmentWrapShow = false
            this.focus = false
            this.init1()
        },
        handleNodeClick2(data) {
            this.form.departmentName2 = data.name
            this.department2 = data
            this.searchDepartmentWrapShow = false
            this.focus = false
            this.init2()
        },
        init() {
            this.$axios({
                method: 'post',
                url: this.$urls.workerCost,
                data: {
                    startTime:this.form.startTime?this.form.startTime[0]:'',
                    endTime:this.form.startTime?this.form.startTime[1]+86400000:'',
                    departmentId:this.department.id?this.department.id:'',
                    agencyId:this.form.agencyId,
                    workerName: this.form.workerName,
                    orderNo: this.form.orderNo,
                    workBillState: this.form.workBillState,
                    statisticalMethods: this.form.statisticalMethods,
                    billOrderNo: this.form.billOrderNo,
                }
            }).then(res=>{
                if(res.data.length){
                    this.dataList = res.data.filter(i=>{
                        return typeof i =='object'
                    })
                    this.cost = this.dataList.find(i=>i.total).total
                    if(this.dataList[0].subtotal=='0.00'){
                        this.dataList = []
                    }
                }	
            }).catch(err=>{
                
            })
            this.$axios({
                method: 'get',
                url: this.$urls.getBillField,
                params:{settingType: 'examine'} 
            })
            .then(res=>{
                if(res.data.length) {
                    this.dataList1 = res.data.filter(i=>!i.userId)
                }
            })  
            .catch(e=>{
                
            })
        },
        init1() {
            this.$axios({
                method: 'post',
                url: this.$urls.workerCostSum,
                data: {
                    startTime:this.form.startTime1?this.form.startTime1[0]:'',
                    endTime:this.form.startTime1?this.form.startTime1[1]+86400000:'',
                    departmentIds:this.department1.id?[this.department1.id]:[],
                    agencyId:this.form.agencyId1,
                }
            }).then(res=>{
                if(res.data.length){
                    this.dataList2 = res.data.filter(i=>i.departmentName!='total')
                    this.total1 = res.data.find(i=>i.departmentName=='total')
                }else{
                    this.total1 = {
                        totalPeople:0,
                        totalNumber:0,
                        totalWorkTime:0,
                        totalCost:0
                    }
                    this.dataList2 = []
                }
            }).catch(err=>{
                
            })
        },
        init2() {
            this.$axios({
                method: 'post',
                url: this.$urls.paymentStatistics,
                data: {
                    startTime:this.form.startTime2?this.form.startTime2[0]:'',
                    endTime:this.form.startTime2?this.form.startTime2[1]+86400000:'',
                    departmentIds:this.department2.id?[this.department2.id]:[],
                    agencyId:this.form.agencyId2,
                    paymentMethods:this.form.paymentMethods
                }
            }).then(res=>{
                if(res.data.length){
                    if(this.form.paymentMethods=="byDepartment"){
                        this.dataList3 = res.data.filter(i=>i.departmentName!='total')
                        this.total2 = res.data.find(i=>i.departmentName=='total')
                    }else{
                        this.dataList3 = res.data.filter(i=>i.agencyName!='total')
                        this.total2 = res.data.find(i=>i.agencyName=='total')
                    }
                }else{
                    this.total2 = {
                        totalCost: 0,
                        unsettlement: 0,
                        paid: 0,
                        pendingPayment: 0,
                        settled: 0
                    }
                    this.dataList3 = []
                }
            }).catch(err=>{
                
            })
        },
        departmentInit() {
            this.$axios({
                method: 'get',
                url:this.$urls.withScope
            })
            .then(res=>{
				this.departmentList = Object.values(this.$base.buildTree1(res.data))
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
    },
    components:{
        Tabel,
        FieldSet
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
                width: 150px;
            }
            .width180{
                width: 150px;
            }
        }
    }
    .bodyWrap{
        margin-top: 10px;
        height: calc(100% - 70px);
        background-color: #fff;
        overflow-y: scroll;
        padding: 24px 20px;
        box-sizing: border-box;
        min-width: 1240px;
        .form{
            .overflow{
                overflow: hidden;
            }
            .searchDepartmentWrap{
                width: 180px;
                height: 210px;
                background-color: #ffffff;
                box-shadow: 0px 0px 5px 0px rgba(68, 73, 80, 0.1);
                position: absolute;
                z-index: 10;
                top:190px;
                left: 791px;
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
                left: 1212px;
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
                }
                li:nth-of-type(3){
                    flex:1.6;
                }   
            }
            .borderbottom{
                border-bottom: 1px solid #ececec;
            }
            .title{
                font-weight: bold;
                .set{
                    position: relative;
                    top: 1px;
                    left: 10px;
                    cursor: pointer;
                }
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
        }
        .ml184{
            margin-left: 161px;
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
