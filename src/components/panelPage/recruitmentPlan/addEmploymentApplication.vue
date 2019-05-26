<template>
	<div class="panelWrap addEmploymentApplication">
		<div class="fd" @click="shut"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">{{title}}</div>
					</div>
					<div class="cancel icon-Close" @click="cancelBtn"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
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
				<div class="minH">
					<div class="title">用工需求</div>
					<div class="content content1 inputHeight30">
						<el-form ref="form" :model="form" :rules="rules" label-width="75px" size="medium">
							<el-col :span="10">
								<div class="position height30 mb24" style="width:260px">
									<el-form-item label="用工部门:">
										<div @click="searchDepartmentWrapShow=!searchDepartmentWrapShow">
											<el-input 
												v-model="form.order.departmentName" 
												popper-class="applyList" 
												@focus="focus=true"
												placeholder="请选择"></el-input>
										</div>
										<i class="el-icon-arrow-down" :class="{'focus1':focus}"></i>
									</el-form-item>
								</div>
							</el-col>
							<div class="floatR height30 mb24">
								<el-form-item label="用工日期:">			
									<div class="floatL input position height30">
										<el-date-picker 
											type="date" 
											placeholder="开始日期" 
											:clearable="false" 
											v-model="form.order.startDate" 
											style="width: 100%;" 
											value-format="timestamp" 
											@change="dateChange" 
											:picker-options="pickerOptions"
											@focus="focus1=true" 
											:disabled="form.order.departmentName?false:true"
											@blur="focus1=false"></el-date-picker>		
										<i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
									</div>
									<div class="floatL center"></div>			
									<div class="floatL input position height30">
										<el-date-picker type="date" 
											placeholder="结束日期" 
											:clearable="false" 
											v-model="endDate" 
											style="width: 100%;" 
											:picker-options="pickerOptions1"
											:disabled="(form.order.departmentName&&form.order.startDate)?false:true"
											value-format="timestamp" 
											:default-value="form.order.startDate"
											@change="dateChange" 
											@focus="focus2=true" 
											@blur="focus2=false"></el-date-picker>
										<i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
									</div>								
									<div class="line countNum floatL" :span="6">共计{{dateCount}}天</div>
								</el-form-item>
							</div>
							<el-col :span="24">
								<div class="reason">
									<el-form-item label="申请事由:" prop="order.reasons">
										<el-input type="textarea" resize="none" :rows="4" placeholder="请输入" v-model="form.order.reasons"></el-input>
									</el-form-item>
								</div>
							</el-col>
						</el-form>
						<div class="txtLimit">{{form.order.reasons.length}}/1000</div>
					</div>
					<div class="title">岗位列表<span>(申请总人数：{{form.order.employees}}人)</span></div>
					<div class="content content2">
						<Table :data-list="form.orderDetailVos" :delete-jobs="deleteJobs" :return-department-detail="returnDepartmentDetail"></Table>
						<div class="addJobs" @click="addJobsPanelShow">
							<div class="addicon"></div>
							<div class="txt">添加更多岗位</div>
						</div>
					</div>
					<div class="title">用工成本</div>
					<div class="content content3" :class="{'unActive':costDetailShow}">
						<div class="laborCostsList">
							<div class="num">{{costs.allCosts|tofixed2}}</div>				
							<div class="txtWrap">	
								<div class="txt">总费用（元）</div>
								<el-tooltip content="总费用 = 岗位列表的预计费用总和" effect="light" placement="top-start">
									<div class="laborCostsListIcon"></div>
								</el-tooltip>
							</div>
							<div class="line"></div>
						</div>
						<div class="laborCostsList">
							<div class="num" :class="{
								'colorgreen':costs.costIncome<=2.5&&costs.costIncome>0,
								'coloryellow':costs.costIncome>2.5&&costs.costIncome<=3,
								'colorred':costs.costIncome>3}"
							>{{costs.costIncome|tofixed2}}</div>				
							<div class="txtWrap">	
								<div class="txt">成本收入率（%）</div>
								<el-tooltip content="成本收入率 = 总费用 / 预计总收入" effect="light" placement="top-start">
									<div class="laborCostsListIcon"></div>
								</el-tooltip>
							</div>
							<div class="line"></div>
						</div>
						<div class="laborCostsList">
							<div class="num">{{financialServices}}</div>				
							<div class="txtWrap">	
								<div class="txt">服务人员比例（%）</div>
								<el-tooltip content="服务人员比例 = (现有人数 + 申请总人数) / 预计客人总数" effect="light" placement="top-start">
									<div class="laborCostsListIcon"></div>
								</el-tooltip>
							</div>
							<div class="line"></div>
						</div>
						<div class="laborCostsList">
							<div class="num">{{ftes|tofixed2}}</div>				
							<div class="txtWrap">	
								<div class="txt">FTEs</div>
								<el-tooltip content="FTEs即全职人力工时，也称相当全时工作量。FTEs = 小时工总小时数 / 8小时每天 / 21.75天每月" effect="light" placement="top-start">
									<div class="laborCostsListIcon"></div>
								</el-tooltip>
							</div>
							<div class="showOrHide" @click="handleClick">
								<div class="iconArrow" :class="{'departmentListShow':detailShow}"></div>
								<div class="txt" v-if="!detailShow">展开详情</div>
								<div class="txt" v-else>收起详情</div>
							</div>
						</div>
					</div>
					<div class="costDetail" v-if="costDetailShow">
						<div class="detailWrap">
							<div class="left">
								<div>
									<span>现有人数/编制人数</span>
									<span>{{departmentInfo.actualTotal}}人/{{departmentInfo.planTotal}}人</span>
								</div>
								<div>
									<span>总餐次</span>
									<span>{{mealTotal}}次/天</span>
								</div>
								<div>
									<span>人均费用</span>
									<span>{{capitaCost|tofixed2}}元/人/天</span>
								</div>
							</div>
							<div class="right">
								<div id="echart"></div>		
								<!-- <div class="allCost">总预算<br/>10000元</div>			 -->
								<div class="costTitle">
									<div class="div1">{{getBudget}}</div>
									<div class="div2">
										<div class="divItem">
											<div></div>
											<div>已使用预算</div>		
										</div>
										<div class="divItem">
											<div class="green"></div>
											<div>剩余预算</div>		
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="title">用工依据</div>
					<div class="content content4 inputHeight30">
						<el-form ref="form" :model="form" label-width="80px" size="medium">
							<div class="formWrap" v-for="(i,k) in form.beos" :key="k">
								<div class="deleteBtn" v-if="k!=0" @click="deleteAddJobs(k)">
									<div>删除</div>
								</div>
								<div class="flexWrap mb24">
									<div class="col1 height30">
										<el-form-item label="BEO单号:">
											<el-input v-model="form.beos[k].beoNo" placeholder="请输入"></el-input>
										</el-form-item>
									</div>
									<div class="col5"></div>
									<div class="col1 height30">
										<el-form-item label="BEO名称:">
											<el-input v-model="form.beos[k].beoName" placeholder="请输入"></el-input>
										</el-form-item>
									</div>
									<div class="col5"></div>
									<div class="col1 height30">
										<el-form-item label="预计客人数:" label-width="94px">
											<el-input placeholder="请输入" v-model="form.beos[k].beoCustomers"></el-input>
											<div class="template">人</div>
										</el-form-item>
									</div>
								</div>	
								<div class="flexWrap bottom">
									<div class="col1 height30">
										<el-form-item label="预计收入:">
											<el-input placeholder="请输入" @keyup.native="costIncome" v-model="form.beos[k].beoIncome"></el-input>
											<div class="template">元</div>		
										</el-form-item>
									</div>
									<div class="col5 height30"></div>
									<div class="col4">
										<el-form-item label="BEO资料:">
											<el-upload
											class="upload-demo"
											:action="action"
											:on-success="(res,file)=>{return fileSuccess(res,file, k)}"
											:on-remove="(res,file)=>{return onRemove(res,file, k)}"	
											:on-error="fileError"
											:headers="uploadHeader"
											:before-upload="beforeAvatarUpload1"
											:file-list="fileList[k]&&fileList[k].item">
											<div class="fileWrap">
												<div class="fileIcon"></div>
												<div class="fileBtn">添加文件</div>
												<div class="fileDetail">仅支持word，pdf格式，最大不超过8M</div>		
											</div>
											</el-upload>
										</el-form-item>
									</div>
									<div class="col5"></div>
								</div>					
								<div class="line" v-if="k!=form.beos.length-1"></div>
							</div>
						</el-form>
						<div class="addJobs" @click="addJobs">
							<div class="addicon"></div>
							<div class="txt">添加更多用工依据</div>
						</div>
					</div>
					<div class="title">紧急审批
						<div class="switch special">   
							<el-switch
								:width="52"
								v-model="switchBtn1"
								active-color="#4c8aff"    
								disabled
								@click.native="handelUpdate(switchBtn1)"     
								>
							</el-switch>
						</div>
						<div class="remaining" v-if="switchBtn1&&specialType">本月剩余：{{specialNum}}次</div>
					</div>
					<div class="content content5">
						<div class="fd1" v-if="!switchBtn1"></div>
						<div class="left" :class="{'switchBtnFalse':!switchBtn1}">上传凭证：</div>
						<div class="right" :class="{'switchBtnFalseRight':!switchBtn1}">
							<el-upload
								:action="action"
								list-type="picture-card"
								:on-preview="handlePictureCardPreview"
								:on-success="imgFileSuccess"
								:on-error="imgError"
								:limit="4"
								:before-upload="beforeAvatarUpload1"
								:headers="uploadHeader"
								:on-exceed="handleExceedImg"
								:file-list="fileList2"
								:on-remove="handleRemove">
								<i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog 
								:visible.sync="imgDialog"
								:lock-scroll="false"
								:modal-append-to-body="false">
								<img width="100%" :src="dialogImageUrl" alt="">
							</el-dialog>
						</div>
						<div class="right1" :class="{'switchBtnFalseRight1':!switchBtn1}">最多上传4张，最大不超过8M</div>
					</div>
				</div>
				<div class="submitBtnWrap">
					<div class="subBtn" @click="submit('pending')">提交</div>
					<div class="cancelBtn" @click="cancelBtn">取消</div>
				</div>
			</div>
		</transition>
		<Panel v-if="$store.state.recruitmentPlan.addJobs" :addJobSubmit="addJobSubmit" :department-info="departmentInfo" :date='dateCount' :start-time="form.order.startDate"></Panel>
		<JobDetail v-if="$store.state.recruitmentPlan.jobDetailShow" :date-count="dateCount"></JobDetail>
		<el-dialog
            title="取消"
            :visible.sync="dialogVisible"
            width="450px"
            top="30.3vh"
            :modal-append-to-body="false"
			:file-list="fileList"
            height="300px">
            <div class="body">
                <p style="font-size: 14px;color: #444950;margin-top:80px;text-align:center;">放弃后将丢失编辑内容，确认放弃吗？</p>
                <div class="dialogBtn">
                    <div class="sub" @click="sure">暂存草稿</div>
                    <div class="cancel" @click="toUpperCase">放弃编辑</div>
                </div>  
            </div>
        </el-dialog>
	</div>
</template>
<script>
import Table from '../../table/recruitmentPlan/addEmploymentApplication'
import Panel from './addJobs'
import JobDetail from './jobDetail'
import echarts from 'echarts'
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'addEmploymentApplication',
	props: ['orderInit','initTable'],
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			dialogVisible: false,
			form: {
				beos:[{
					beoNo: '',
					beoName: '',
					beoCustomers: '',
					beoIncome: '',
					beoAttach: ''
				}],
				order:{
					reasons:'',
					departmentId: '',
					employees: 0,
					startDate: '',
					endDate: '',
					position: '',
					id: '',
					hotalId: '',
					workflowId: '',
					curNode: '',
					departmentName: '',
					specialFile: '',
					no: '',
					totalMeals: 0,
					amountPersonDay: 0,
					budgetRate: '0/0',
					personRate: '0/0',
				},
				orderDetailVos:[],
				isSpecial: 'N',
			},
			detailShow: false,
			fileList: [{item:[]}],
			costDetailShow: false,  // 用工成本展开详情
			cost1: 0,
			cost2: 0,
			totalCost: 0,
			title:'新增用工申请',
			departmentList: [],  // 用工部门列表
			departmentList1: [],  //原始数组
			departmentList2: [],  // 暂存数组
			val: '',
			departmentDetail: {},  //选中的用工部门信息
			dateCount: 0,
			action: this.$baseApi + this.$urls.singlefile,
			imgAction: this.$baseApi + this.$urls.certUpload,
			costs:{
				allCosts:0,
				costIncome:0,
				financialServices: 0,
				ftes: 0,
			},
			focus1: false,
			focus2: false,
			focus: false,
			switchBtn1:false,
			imgDialog: false,
			dialogImageUrl: '',
			imgArr: [],
			beoAttach:[],
			searchDepartmentWrapShow:false,
			defaultProps: {
				children: 'children',
				label: 'name'
			},
			rules: {
				order:{
					reasons: [
						{ min: 0, max: 1000, message: '字数不可超过1000字', trigger: 'blur' }
					]
				}
			},
			orderMaxDay: '',
			departmentInfo: {},
			mealTotal: 0,
			capitaCost: 0,
			mealTotalArr: [],
			totalHoursArr: [],
			endDate: '',
			fileList2: [],
			specialNum: 0,
			specialType: false,
		}
	},
	computed: {
		ftes() {
			let a = this.totalHoursArr.reduce((a,b)=>{
				return a+b
			},0)
			return parseInt((a/8/21.75)*100)/100
		},
        filterResult() {
            return this.departmentList1.filter(value => new RegExp(this.val, 'i').test(value.name))
		},
		pickerOptions() {
			let _this = this
			return {
				disabledDate(time) {
					if(_this.endDate){
						return time.getTime() < Date.now() - 8.64e7||time.getTime() <=_this.endDate-_this.orderMaxDay
					}else{
						return time.getTime() < Date.now() - 8.64e7
					}
					
				},
			}	
		},
		pickerOptions1() {
			let _this = this
			return {
				disabledDate(time) {
					return time.getTime() >= _this.form.order.startDate+_this.orderMaxDay||time.getTime()<_this.form.order.startDate
				}
			}
		},
		financialServices() {
			let guest = this.form.beos.reduce((total,item)=>{
				if(item.beoCustomers){
					return total+parseInt(item.beoCustomers)
				}else{
					return total
				}
			},0)
			if(guest!=0){
				let a = ((this.departmentInfo.actualTotal+this.form.order.employees)/guest*100)
				return parseInt(a*100)/100
			}else{
				return 0
			}	
		},
		getBudget() {
			if(this.form.order.startDate){
				let date = this.$base.formattingTime(this.form.order.startDate).split('/')
				return `${this.departmentInfo.name}${date[0]}年${date[1]}月预算表`
			}else{
				let d = new Date()
				let date = this.$base.formattingTime(d.getTime()).split('/')
				return `${this.departmentInfo.name}${date[0]}年${date[1]}月预算表`
			}
		}
    },
	created() {
		this.init()
		this.form.order.hotalId = this.$store.state.hotalId
	},
	mounted () {
		this.show = true	
		document.addEventListener('click',(e)=>{
			if(this.$refs.applyList&&!this.$refs.applyList.contains(e.target)){
				this.searchDepartmentWrapShow = false
				this.focus = false
			}
		})
	},
	updated () {
		this.$nextTick(()=>{
			this.echartDrow()
		})		
	},
	watch: {
		val(val) {
			this.$refs.tree.filter(val);
		}
    },
	methods: {
		handelUpdate(autoUpdate) {
			if(autoUpdate) {
				this.switchBtn1 = false
			}else{
				if(this.specialNum==0&&this.specialType){
					this.$message({
						message: "本月无紧急审批次数",
						type: 'error',
						duration: 5 * 1000
					})
				}else{
					this.switchBtn1 = true
				}	
			}
		},
		getBudget1() {
			let time = 0
			if(this.form.order.startDate){
				time = this.$base.formattingTime(this.form.order.startDate,'-').substring(0,7)
			}else{
				let d = new Date()
				time = this.$base.formattingTime(d.getTime(),'-').substring(0,7)
			}
			let	date = new Date(`${time}-01`).getTime()-8*60*60*1000
			this.$axios({
                method: 'post',
				url:this.$urls.getBudget,
				params: {
					departmentId:this.departmentInfo.id,
					month:date
				}
            })
            .then(res=>{
				
				if(res.data.usedAmount){
					this.cost1 = res.data.usedAmount
				}else{
					this.cost1 = 0
				}
				if(res.data.amount){
					this.totalCost = res.data.amount
				}else{
					this.totalCost = 0
				}
				if(res.data.amount) {
					this.cost2 = res.data.amount - res.data.usedAmount
				}else{
					this.cost2 = 0
				}
				
            })
            .catch(e=>{
				
            })	
		},	
		getDepartment(data) {
			let departmentId = localStorage.getItem('departmentId')
			this.departmentInfo = data.find(i=>i.id==departmentId)	
			this.handleNodeClick(this.departmentInfo)
		},
		allCost() {
			let a  = this.form.orderDetailVos.reduce((total,value)=>{
				return total + (value.cost/100)
			},0)
			this.costs.allCosts = a
		},
		costIncome() {
			let guest = this.form.beos.reduce((total,value)=>{
				return total + parseInt(value.beoIncome)
			},0)
			if(guest&&guest!=0){
				this.costs.costIncome = parseInt((this.costs.allCosts/guest)*10000)/100
			}
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},
		handleNodeClick(data) {
			this.searchDepartmentWrapShow = false
			this.form.order.departmentId = data.id
			this.form.order.departmentName = data.name
			this.departmentInfo = data
			if(this.$store.state.recruitmentPlan.state==5){
				// console.log(1)
			}
			this.focus = false
			this.switchBtn1 = false
			this.orderMaxDay = data.orderMaxDay
			this.getDeptNumber()
		},
		//获取紧急审批次数
		getDeptNumber() {
			this.$axios({
				method: 'get',
				url:this.$urls.getDeptNumber+'/'+this.form.order.departmentId
			})
			.then(res=>{
				if(res.data.number){
					this.specialNum = res.data.number
				}
				if(res.data.category=='special'){
					this.specialType = true
				}else{
					this.specialType = false
				}
			})
			.catch(e=>{

			})	
		},
		beforeAvatarUpload1(file){
			const isLt2M = file.size / 1024 / 1024 < 8
			if (!isLt2M) {
				this.$message({
					message: "上传图片大小不能超过 8MB!",
					type: 'error',
					duration: 5 * 1000
				})
			}
			return isLt2M;
		},
		imgFileSuccess(file,fileList,f) {
			if(file.status==200){
				this.imgArr.push(file.content.id)
			}else{
				f.splice(f.length-1,1)
				this.$message({
					message: file.message||"上传失败",
					type: 'error',
					duration: 5 * 1000
				})
			}
		},
		imgError(err, file, fileList){
			console.log(err)
		},
		handleRemove(file, fileList) {
			this.imgArr.forEach((i,k)=>{
				if(i==file.response.content.id){
					this.imgArr.splice(k,1)
				}
			})
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.imgDialog = true;
		},
		handleExceedImg(files, fileList) {
			this.$message({
				message: "最多上传四张照片",
				type: 'error',
				duration: 5 * 1000,			
			})
		},
		dateChange() {
			let a = this.dateCount
			if (this.form.order.startDate&&this.endDate) {
				if (this.form.order.startDate>this.endDate) {
					this.$message({
						message: "结束不能小于开始日期",
						type: 'error',
						duration: 5 * 1000
					})
					this.endDate = ''
					this.dateCount = 0
					return
				}
				this.dateCount = this.$base.timeDifference('day',this.form.order.startDate,this.endDate)
			}
			if(this.form.orderDetailVos.length){
				this.form.orderDetailVos.forEach(i=>{
					i.cost = parseInt(i.cost)/a*this.dateCount
				})
				this.form.orderDetailVos = [].concat(this.form.orderDetailVos)
				this.allCost()
				this.costIncome()
			}
			this.getBudget1()
		},
		submit(state) {
			
			if (state != 'draft') {
				if (!this.form.order.departmentId||!this.form.order.startDate||!this.endDate) {
					this.$message({
						message: "请完善用工需求",
						type: 'error',
						duration: 5 * 1000,			
					})
					return
				}
				if (this.form.order.reasons.length>1000) {
					this.$message({
						message: "申请事由内容超出，请重新输入",
						type: 'error',
						duration: 5 * 1000
					})
					return
				}
				if (!this.form.orderDetailVos.length) {
					this.$message({
						message: "请完善岗位列表",
						type: 'error',
						duration: 5 * 1000
					})
					return
				}
			}
			this.form.order.employees = this.form.orderDetailVos.reduce((total,value)=>{
				return total + parseInt(value.totalCount)
			},0)
			this.form.order.endDate = this.endDate + 24*60*60*1000
			this.form.order.totalMeals = this.mealTotal
			this.form.order.amountPersonDay = this.capitaCost
			this.form.order.budgetRate = `${this.cost1}/${this.totalCost}`
			this.form.order.personRate = `${this.departmentInfo.actualTotal}/${this.departmentInfo.planTotal}`
			this.form.order.position = state
			if (this.$store.state.recruitmentPlan.id) {
				this.form.order.id = this.$store.state.recruitmentPlan.id
			}
			if(this.switchBtn1){
				this.form.isSpecial = 'Y'
				this.form.order.specialFile = this.imgArr.join('|')
			}else {
				this.form.isSpecial = 'N'
			}
			this.fileList.forEach((i,k)=>{
				let arr = []
				i.item.forEach((j,key)=>{
					
					arr.push(j.id)
				})
				this.form.beos[k].beoAttach = arr.join("|")
			})
			let obj = {}
			obj.order = this.form.order
			obj.orderDetailVos = this.form.orderDetailVos
			obj.isSpecial = this.form.isSpecial
			obj.beos = []
			this.form.beos.forEach(i=>{
				obj.beos.push({
					beoNo: i.beoNo,
					beoName: i.beoName,
					beoCustomers: i.beoCustomers,
					beoIncome: i.beoIncome*100,
					beoAttach: i.beoAttach
				})
			})
			this.$axios({
                method: 'post',
				url:this.$store.state.recruitmentPlan.state?this.$urls.updateOrder:this.$urls.createOrder,
				data: obj
            })
            .then(res=>{
				if(res.data.code==0){
					this.$message({
						message: "操作成功",
						type: 'success',
						duration: 5 * 1000
					})
					this.cancel()
					this.orderInit()
					this.initTable()
				}else {			
					this.$message({
						message: res.data.msg||"操作失败",
						type: 'error',
						duration: 5 * 1000
					})
				}
				this.dialogVisible = false
            })
            .catch(e=>{
				
            })	
		},
		addJobSubmit(type,k) {
			if (type=='updated') {
				this.form.orderDetailVos.splice(k,1,this.$store.state.recruitmentPlan.addJobParams)
			} else {
				this.form.orderDetailVos.push(this.$store.state.recruitmentPlan.addJobParams)
			}	
			this.mealTotalArr.push(this.$store.state.recruitmentPlan.addJobInfoObj.mealTotal)
			this.mealTotal = this.mealTotalArr.reduce((total,item)=>{
				return total+item
			},0)
			this.allCost()
			this.costIncome()
			this.totalHoursArr.push(this.$store.state.recruitmentPlan.addJobInfoObj.totalHours)
			this.form.order.employees = this.form.orderDetailVos.reduce((total,value)=>{
				return total + parseInt(value.totalCount)
			},0)
			this.capitaCost = this.costs.allCosts/this.form.order.employees/this.dateCount
		},
		deleteJobs(k) {
			this.form.orderDetailVos.splice(k,1)
			this.mealTotalArr.splice(k,1)
			this.totalHoursArr.splice(k,1)
			this.mealTotal = this.mealTotalArr.reduce((total,item)=>{
				return total+item
			},0)
			this.allCost()
			this.costIncome()
			this.form.order.employees = this.form.orderDetailVos.reduce((total,value)=>{
				return total + parseInt(value.totalCount)
			},0)
			if(this.form.order.employees){
				this.capitaCost = this.costs.allCosts/this.form.order.employees/this.dateCount
			}else{
				this.capitaCost = 0
			}
			
		},
		searchKeyUp() {
			if (this.val) {
				if (this.filterResult.length!=0) {
					this.departmentList = this.filterResult
				} else {
					this.departmentList = [1]
				}
			} else {
				this.departmentList = this.departmentList2
			}
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('addEmploymentApplicationShow')
			}, 200)
		},
		beforeAvatarUpload(file) {
			var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)				
			const extension = testmsg === 'word'
			const extension2 = testmsg === 'pdf'
			const isLt2M = file.size / 1024 / 1024 < 8
			if(!extension && !extension2) {
				this.$message({
					message: '上传文件只能是 word、pdf格式!',
					type: 'warning'
				});
			}
			if(!isLt2M) {
				this.$message({
					message: '上传文件大小不能超过 8MB!',
					type: 'warning'
				});
			}
			return extension || extension2 && isLt2M
		},
		fileSuccess(response, file, k) {
			if(response.status==200){
				let obj = {}
				obj.name = file.name
				obj.id = response.content.id
				this.fileList[k].item.push(obj)
			}else{
				this.$message({
					message: response.message||"上传失败",
					type: 'error',
					duration: 5 * 1000
				})
			}
		},
		onRemove(file, fileList, k) {
			this.fileList[k].item.forEach((i,key)=>{
				if(i.id==file.id){
					this.fileList[k].item.splice(key,1)
				}	
			})
		},
		fileError(err, file, fileList) {
			this.$message({
				message: "上传失败",
				type: 'error',
				duration: 5 * 1000
			})
		},
		handleClick() {
			this.costDetailShow=!this.costDetailShow
			this.detailShow = !this.detailShow
		},
		sure() {
			this.submit('draft') 	
		},
		toUpperCase() {
			this.cancel()
		},
		cancelBtn() {
			if (this.$store.state.recruitmentPlan.state==5) {
				this.cancel()
				return
			}
			if((this.form.order.reasons)||(this.form.order.departmentId)||(this.startDate)||(this.endDate)||(this.form.beos[0].beoNo)||(this.form.beos[0].beoName)||(this.form.beos[0].beoCustomers)
			    ||(this.form.beos[0].beoIncome)||(this.form.beos[0].beoAttach)){	
				this.dialogVisible = true
			}else{
				this.cancel()
			}
		},
		init() {
			let id = this.$store.state.recruitmentPlan.id,
			title = this.$store.state.recruitmentPlan.panelTitle
			if (title) {
				this.title = title
			}
			if (id) {
				this.$axios({
					method: 'get',
					url:this.$urls.getOrder,
					params:{orderId:id}
				})
				.then(res=>{
					this.form.order.departmentId = res.data.order.departmentId
					this.form.order.startDate = res.data.order.startDate
					this.endDate = res.data.order.endDate-24*60*60*1000
					this.form.order.reasons = res.data.order.reasons||''
					this.form.order.employees = res.data.order.employees
					this.form.orderDetailVos = res.data.orderDetailVos 
					this.form.order.hotalId = res.data.order.hotalId
					this.form.order.workflowId = res.data.order.workflowId
					this.form.order.curNode = res.data.order.curNode
					this.form.order.departmentName = res.data.order.departmentName
					this.form.order.no = res.data.order.no	
					res.data.beos.forEach((i,k)=>{
						if (k!=0){
							this.form.beos.push({beoNo: '',beoName: '',beoCustomers: '',beoIncome: ''})
						}	
						this.form.beos[k].beoCustomers = i.beoCustomers
						this.form.beos[k].beoIncome = i.beoIncome/100
						this.form.beos[k].beoName = i.beoName
						this.form.beos[k].beoNo = i.beoNo
						this.form.beos[k].beoAttach = i.beoAttach
						if(i.attachBeos) {
							i.attachBeos.forEach(j=>{
								this.fileList[k].item.push({name:j.filename})
							})
						}		
					})	
					this.dateChange()
					this.allCost()
					this.costIncome()
					this.form.orderDetailVos.forEach(i=>{
						let a = (i.netWorkTime/1000/60/60)*i.totalCount*this.dateCount
						this.totalHoursArr.push(a)
					})
					if(res.data.specialFile&&res.data.specialFile.length) {
						this.switchBtn1 = true
						this.$axios({
							method: 'get',
							url:this.$urls.getSpecialFile,
							params:{specialFileIds:res.data.order.specialFile}
						})
						.then(data=>{
							if(data.data&&data.data.length){
								let url = this.$baseApi.split('/hotelApi')
								data.data.forEach(i=>{
									this.imgArr.push(i.id)
									this.fileList2.push({
										name: i.filename,
										url:url[0]+'/upload/'+i.filepath+i.filedate
									})
								})
							}
						})
						.catch(e=>{

						})	
					}
				})
				.catch(e=>{

				})	
			}	
			this.$axios({
                method: 'get',
                url:this.$urls.withScope
            })
            .then(res=>{
				this.departmentList = Object.values(this.$base.buildTree1(res.data))
				this.departmentList1 = res.data
				this.departmentList2 =  this.departmentList
				if(localStorage.getItem('departmentId')){
					this.getDepartment(res.data)
				}
				this.getBudget1()
            })
            .catch(e=>{

            })	
		},
		returnDepartmentDetail() {
			return this.form.order.departmentId
		},
		changeValue(value) {
			this.departmentDetail = this.departmentList1.find(item=>{
				return item.id == value
			})  
			this.form.order.departmentName = this.departmentDetail.name
		},
		addJobsPanelShow() {
			if (!this.form.order.departmentId) {
				this.$message({
					message: "请输入用工需求",
					type: 'error',
					duration: 5 * 1000,
				})
				return
			}
			this.changeValue(this.form.order.departmentId)
			this.$store.dispatch('addJobs',{departmentDetail:this.departmentDetail})
		},
		echartDrow() {
			if (!document.getElementById('echart')) {
				return;
			}
			let myChart = echarts.init(document.getElementById('echart'))
			let colors = ['#e1664c','#55b57d'],
				cost1 = this.cost1,
				cost2 = this.cost2
			let option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: " {b}：{c} "
			    },
				 //环形颜色
				graphic:[{
					type:'text',
					left:'center',
					top:'42%',
					style:{
						text:'总预算',
						textAlign:'center',	
						fill:'#444950',
						fontSize:12,
					}
				},{
					type:'text',
					left:'center',
					top:'52%',
					style:{
						text:this.totalCost+'元',
						textAlign:'center',	
						fill:'#444950',
						fontSize:12,
					}
				}],
			    color:colors,
			    legend: {
			        orient: 'vertical',
			        show: false,
			        x: 'left',
			        data: ['已使用预算', '剩余预算']
			    },
			    series: [	 
			        {
			            name: '',
			            type: 'pie',
						radius: ['50%', '70%'],
			            labelLine: {
			                normal: {
			                    length: 10,       
			                    lineStyle: [{
			                        color:'#e1664c',
								},{
									color:'#55b57d'
								}]
			                }		 
			            },
			            data: [{
			                value: cost1,
							name: '已使用预算',
			            }, {
			                value: cost2,
							name: '剩余预算',
						}],
			        }
			    ]
			};
			myChart.setOption(option);
		},
		addJobs() {
			// for (let i = 0;i < this.form.beos.length;i++) {
			// 	for (let a in this.form.beos[i]) {
			// 		if (!this.form.beos[i][a]) {
			// 			this.$message({
			// 				message: "请完善用工依据",
			// 				type: 'error',
			// 				duration: 5 * 1000
			// 			})
			// 			return
			// 		}
			// 	}
			// }
			this.form.beos.push({beoNo: '',beoName: '',beoCustomers: '',beoIncome: '',beoAttach: ''})
			this.fileList.push({item:[]})
		},
		deleteAddJobs(k) {
			this.form.beos.splice(k,1)
			this.fileList.splice(k,1)
		},
		shut() {
			this.cancelBtn()
		}
	},
	destroyed() {
		clearTimeout(this._timeOut)
	},
	components:{
		Table,
		Panel,
		JobDetail
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.dialogBtn{
	div{
		width: 48px;
		padding: 4px 16px;
	}
}
.height30{
	height: 30px;
}
.mb24{
	margin-bottom: 24px;
}
.panel{
	width:1140px;
	overflow-y:scroll;
	.fixed{
		position: fixed;
		top: 0;
		right:0;
		width: 1100px;
		background-color: #fff;
		z-index: 1;
	}
	.minH{
		min-height: calc(100% - 141px);
	}
	.title{
		width: 1100px;
		margin: 0 auto;
		height:22px;
		line-height:22px;
		font-size: 14px;
		color: #666666;
		padding-top:15px;
		font-weight: bold;
		.switch{
			float: right;
			margin-top: -1px;
		}
		.remaining{
			float: right;
			margin-right: 20px;
			font-weight: normal;
		}
		span{
			color: #4c8aff;
			margin-left:20px;
		}
	}
	.costDetail{
		width:1100px;
		margin:0 auto;
		height:228px;
		background-color:#f4f8fc;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius:2px;
		.detailWrap{
			width:1052px;
			margin:0 auto;
			border-top:1px dashed #d4d4d4;
			overflow:hidden;
			.left{
				width:calc(100% - 639px);
				float:left;
				margin: 40px 0 0 36px;
				div{
					height:50px;
					line-height:50px;
					background-color: #ffffff;
					span:nth-of-type(1){
						margin-left:30px;
						font-size: 14px;
						color: #444950;

					}
					span:nth-of-type(2){
						display:inline-block;
						width:100px;
						float:right;
						margin-right:30px;
						font-size: 14px;
						color: #444950;
						text-align: right;
					}
				}
				div:nth-of-type(2) {
					background-color:#f4f8fc;
				}
			}
			.right{
				float:right;
				position:relative;
				margin-right: 36px;
				#echart{
					min-width:276px;
					height:168px;
					margin:30px 0 0 0;
					float:left;
				}
				.allCost{
					width:66px;
					height:49px;
					text-align:center;
					position:absolute;
					font-size: 16px;
					color: #444950;
					left: 284px;
    				top: 128px;
				}
				.costTitle{
					float:right;
					width: 200px;
					text-align: center;
					.div1{
						font-size: 16px;
						color: #444950;
						margin-top:71px;
					}
					.div2{
						margin-top:30px;
						.divItem{
							overflow:hidden;
							margin-left:63px;
							margin-bottom:10px;
							div{
								float:left;
							}
							div:nth-of-type(1){
								width: 12px;
								height: 12px;
								background-color: #e1664c;
								border-radius:50%;
								margin-top:2.5px;
							}
							div:nth-of-type(2){
								font-size: 12px;
								color: #444950;
								margin-left:10px;
							}
							div.green{
								background-color:#55b57d;
							}
						}
					}
				}
			}
		}
	}
	.content{
		width:1100px;
		margin:0 auto;
		background-color: #f4f8fc;
		border-top-left-radius: 2px;
		border-top-right-radius:2px;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius:2px;
		margin-top:15px;
		box-sizing:border-box;
		.line{
			text-align:center;
			color:#444950;
		}
		.countNum{
			color:#999;
			margin-left: 10px;
		}
		.indentDiv{
			height:10px;
			float:left;
			width:100%;
		}
		.addJobs{
			width: 1050px;
			height: 43px;
			background-color: #fff;
			border: dashed 1px #4c8aff;
			margin:0 auto;
			margin-top:24px;
			cursor:pointer;
			.addicon{
				background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
				width: 14px;
				height: 14px;
				float:left;
				margin:13.5px 0 0 479px;
			}
			.txt{
				width: 120px;
				float:left;
				font-size: 12px;
				color: #4c8aff;
				margin:13px 0 0 10px;
			}
		}
		.addJobs:hover{
			background-color: #eaf3fe;
			transition: all .2s;
		}
	}
	.content1{
		padding:24px 24px 0 24px;
		height: 202px;
		position:relative;
		overflow: hidden;
		.txtLimit{
			position:absolute;
			font-size: 14px;
			color: #999999;
			right:40px;
			bottom:29px;
		}
		.floatR{
			float: right;
			.floatL{
				float: left;
			}
			.input{
				width:180px;
			}
			.center{
				margin:14.5px 10px;
				width: 20px;
				border-top: 1px dashed #d4d4d4;
			}
			
		}
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
	.content2{
		padding-bottom:24px;
	}
	.content3{
		height:123px;
		display:flex;
		.laborCostsList{
			flex:1;
			position:relative;
			.num{
				font-family: 'Engschrift';
				font-size: 48px;
				color: #666666;
				text-align:center;
				margin-top:20px;
			}
			.colorgreen{
				color: #2fb768;
			}
			.coloryellow{
				color: #fab334;
			}
			.colorred{
				color: #e45a3c;
			}
			.txtWrap{
				margin-top:5px;
				text-align:center;
				overflow:hidden;
				display:flex;
				justify-content:center;
				.txt{
					height: 20px;
					line-height:20px;
					font-size: 14px;
					color: #444950;
					float:left;
				}
				.laborCostsListIcon{
					background: url('../../../assets/img/icon3x.svg') no-repeat;
					background-size: 100% 100%;
					width: 14px;
					height: 14px;
					margin:2px 0 0 10px;
				}
			}
			.line{
				width:1px;
				height:60px;
				background-color: #ececec;
				position:absolute;
				right:0;
				top:23px;
			}
			.showOrHide{
				position:absolute;
				right:30px;
				bottom:10px;
				cursor:pointer;
				div{
					float:right;		
				}
				.iconArrow{
					background: url('../../../assets/img/logo.png') no-repeat -203px -104px;
					width: 8px;
					height: 6px;
					margin:5.5px 0 0 5px;
					transition:all .3s;
				}
				.departmentListShow{
					transform:rotate(180deg);
					transform-origin: center center;
				}
				.txt{
					height: 17px;
					line-height:17px;
					color: #4c8aff;
					font-size: 12px;
				}
			}
		}
	}
	.content4{
		overflow:hidden;
		.template{
			position: absolute;
			right: 10px;
			top: 1px;
		}
		.right1{

		}
		.formWrap{
			position:relative;
			padding:24px 24px 0 24px;
			.line{
				height:1px;
				box-sizing:border-box;
				border-top:1px dashed #d4d4d4;
				clear: both;
				margin-top: 13px;
			}
			.deleteBtn{
				background: url('../../../assets/img/deleteBtn.svg') no-repeat;
                background-size: 100% 100%;
				width: 45px;
				height: 45px;
				position:absolute;
				left:0px;
				top:0px;
				color:#fff;
				font-size: 12px;
				cursor:pointer;
				div{
					width: 29px;
					height: 29px;
					line-height:29px;
					text-align:center;
					transform:rotate(-45deg);
				}
				
			}
		}
		.flexWrap{
			display:flex;
			.col1{
				flex:10;
			}
			.col5{
				flex:5;
			}
		}
		.col4{
			flex:21;
			.fileWrap{
				div{
					float:left;
				}
				.fileIcon{
					background: url('../../../assets/img/logo.png') no-repeat -327px -100px;
					width: 16px;
					height: 15px;
					margin-top:7px;
				}
				.fileBtn{
					font-size: 14px;
					color: #666666;
					margin-left:5px;
				}
				.fileDetail{
					font-size: 12px;
					color: #999;
					margin-left:10px;
				}

			}
		}
		.addJobs{
			margin:0 auto;
			background-color: #ffffff;
			margin-bottom:24px;
			margin-top: 19px;
		}
	}
	.content5{
		padding: 24px;
		overflow: hidden;
		position: relative;
		.fd1{
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: 1;
			left: 0;
			top: 0;
		}
		.left{
			float: left;
			font-size: 14px;
			width: 80px;
			transition: .2s;
			color: #444950;
		}
		.right{
			float: left;
			transition: .2s;
		}
		.right1{
			float: left;
			font-size: 12px;
			transition: .2s;
			margin-top: 43px;
			margin-left: 10px;
			color: #999999;
		}
		.switchBtnFalseRight1{
			color: #d4d4d4;
		}
		.switchBtnFalseRight{
			opacity: 0.7;
		}
		.switchBtnFalse{
			color: #d4d4d4;
		}
	}
	.unActive{
		border-bottom-left-radius: 0px;
		border-bottom-right-radius:0px;
	}
	.submitBtnWrap{
		height:57px;
		border-top:1px solid #ececec;
		margin-top:30px;
		div{
			float:left;
			width: 24px;
			height: 17px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
			cursor:pointer;
			padding: 4px 27px;
		}
		.subBtn{
			background-color: #4c8aff;
			color:#fff;
			margin:15px 0 0 460px;
		}
		.cancelBtn{
			color: #4c8aff;
			margin:15px 0 0 60px;
		}
	}
}
.searchDepartmentWrap{
	width: 182px;
	height: 210px;
	background-color: #ffffff;
	box-shadow: 0px 0px 5px 0px rgba(68, 73, 80, 0.1);
	position: absolute;
	z-index: 10;
	top:162px;
	left: 121px;
	padding-top: 6px;
	box-sizing: border-box;
}
.searchDepartment{
	height:30px;
	margin:4px 5px 10px 5px;
	border: solid 1px #ececec;
	.searchIcon{
		background: url('../../../assets/img/logo.png') no-repeat -145px -31px;
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
.childrenItem{
	padding:0 10px;
}
</style>