<template>
	<div class="panelWrap addJobs">
		<div class="fd" @click="shut"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">添加岗位</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div class="wrap inputHeight30">
					<div class="formWrap">
						<el-form ref="form" :model="form" label-width="75px" size="medium">
							<div class="padd30">
								<div class="height30 mb24">
									<el-form-item label="岗位:">
										<el-select v-model="form.postId" placeholder="请选择" @change="changeValue">
											<el-option :label="i.title" v-for="(i,k) in departmentsPosts" :key="k" :value="i.id"></el-option>
										</el-select>
										<!-- <div class="addJobsBtn" @click="dialogVisible=true"></div> -->
									</el-form-item>
								</div>
								<div class="height30 mb24">
									<el-form-item label="工作时间:">
										<el-col :span="11">
											<div class="position">
												<el-time-select
												placeholder="上班时间"
												v-model="form.startTime"
												:picker-options="{
													start: '00:00',
													step: '00:15',
													end: '23:45'
												}"
												@focus="focus1=true" @blur="focus1=false"
												value-format="HH:mm" format="HH:mm"
												:clearable="false"
												@change="timePickerChange"
												style="width: 100%;"></el-time-select>
												<i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
											</div>
										</el-col>
										<el-col class="line" :span="2"></el-col>
										<el-col :span="11">
											<div class="position" id="endTime">
												<el-time-select
												placeholder="下班时间"
												v-model="form.endTime"
												@focus="focus2=true" @blur="focus2=false"
												:clearable="false"
												:picker-options="{
													start: '00:00',
													step: '00:15',
													end: '23:45'
												}"
												value-format="HH:mm" format="HH:mm"
												@change="timePickerChange"
												style="width: 100%;"></el-time-select>
												<i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
											</div>
										</el-col>
									</el-form-item>
								</div>
								<div class="bottom0 height30">
									<el-form-item label="申请人数:">
										<el-col :span="11">
											<el-input placeholder="请输入" type="number" v-model="form.totalCount"></el-input>
											<div class="template">人</div>
										</el-col>
										<el-col :span="11">
											<div style="margin-left:10px;">
												<el-checkbox v-model="checked">男女要求</el-checkbox>
											</div>
										</el-col>
									</el-form-item>
								</div>
							</div>
							<!-- <transition name="fade"> -->
								<div class="MenOrWomenWrap" v-if="checked">
									<div class="tagChange">
										<div class="tag" @click="checkSex(1)">
											<div :class="{'active':man}">男</div>
										</div>
										<div class="tag" @click="checkSex(0)">
											<div :class="{'active':!man}">女</div>
										</div>
									</div>
									<div class="req-wrap" v-if="man">
										<div class="itemWrap">
											<div class="div1">
												<div class="label">男员工人数:</div>
												<el-input-number v-model="form.orderAdd[0].total" @change="handleChange" :min="0" :max="form.totalCount-form.orderAdd[1].total" label="描述文字" size="mini"></el-input-number>
											</div>
											<div class="div1">
												<div class="label">男员工年龄:</div>
												<div class="inputWrap">
													<el-input placeholder="最小" type="number" v-model="form.orderAdd[0].ageMin"></el-input>
		    										<div class="template1">岁</div>
												</div>
												<div class="line"></div>
												<div class="inputWrap">
													<el-input placeholder="最大" type="number" v-model="form.orderAdd[0].ageMax"></el-input>
													<div class="template1">岁</div>
												</div>
											</div>
											<div class="div1 mb0">
												<div class="label">男员工身高:</div>
												<div class="inputWrap">
													<el-input placeholder="最矮" type="number" v-model="form.orderAdd[0].heightMin"></el-input>
													<div class="template1">cm</div>
												</div>
												<div class="line"></div>
												<div class="inputWrap">
													<el-input placeholder="最高" type="number" v-model="form.orderAdd[0].heightMax"></el-input>
													<div class="template1">cm</div>
												</div>
											</div>
										</div>
									</div>
									<div class="req-wrap" v-else>
										<div class="itemWrap">
											<div class="div1">
												<div class="label">女员工人数:</div>
												<el-input-number v-model="form.orderAdd[1].total" @change="handleChange" :min="0" :max="form.totalCount-form.orderAdd[0].total" size="mini"></el-input-number>
											</div>
											<div class="div1">
												<div class="label">女员工年龄:</div>
												<div class="inputWrap">
													<el-input placeholder="最小" type="number" v-model="form.orderAdd[1].ageMin"></el-input>
													<div class="template1">岁</div>
												</div>
												<div class="line"></div>
												<div class="inputWrap">
													<el-input placeholder="最大" type="number" v-model="form.orderAdd[1].ageMax"></el-input>
													<div class="template1">岁</div>
												</div>
											</div>
											<div class="div1 mb0">
												<div class="label">女员工身高:</div>
												<div class="inputWrap">
													<el-input placeholder="最矮" type="number" v-model="form.orderAdd[1].heightMin"></el-input>
													<div class="template1">cm</div>
												</div>
												<div class="line"></div>
												<div class="inputWrap">
													<el-input placeholder="最高" type="number" v-model="form.orderAdd[1].heightMax"></el-input>
													<div class="template1">cm</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							<!-- </transition> -->
							<div class="jobRequirements padd30">
								<div class="label">员工要求:</div>
								<div class="tagWrap">
									<div v-for="(i,k) in tagWrapFilter" @click="uncheck(i)" :key="k">{{i.label}}</div>
								</div>
								<div class="moreBtn" @click="moreBtn=!moreBtn">
									<div class="iconArrow" :class="{'departmentListShow':moreBtn}"></div>
									<div class="txt">
										<span v-if="!moreBtn">添加</span><span v-else>收起</span>更多要求
									</div>
								</div>
							</div>
							<!-- <transition name="fade1"> -->
								<div v-if="moreBtn" class="requestWrap">
									<div class="wrap">
										<div v-for="(i,k) in requestList" :key="k" class="tagItem" :class="{'active':requestCheckList[k]}" @click="checkTag(k)">
											<div class="txt">{{i.label}}</div>
											<div class="closeIcon" @click.stop="removeTag(i.id)">×</div>
										</div>
										<div class="addInput" v-if="removeInput">
											<input type="text" @blur="addTagBtn" v-model="addTags" placeholder="请输入"/>
											<div class="closeIcon" @click.stop="removeInput=false">×</div>
										</div>
										<div class="addMoreTag" @click="removeInput=true">
											<div class="addIcon"></div>
											<div class="txt">创建更多要求</div>
										</div>
									</div>
								</div>
							<div style="height:14px;" v-if="!moreBtn"></div>
							<!-- </transition> -->
							<div class="padd301">
								<div class="height30 mb24">
									<el-form-item label="招聘渠道:">
										<el-select v-model="form.channelId" placeholder="请选择" @change="changeValue1">
											<el-option v-for="(i,k) in getChannel" :key="k" :label="i.name" :value="i.id"></el-option>
										</el-select>
									</el-form-item>
								</div>
								<div class="height30 mb24">
									<el-form-item label="招聘者:">
										<el-select v-model="form.agencyId" placeholder="请选择" @change="changeValue2">
											<el-option v-for="(i,k) in getagency" :key="k" :label="i.name" :value="i.agencyId"></el-option>
										</el-select>
									</el-form-item>
								</div>
								<div class="meal mb20" style="height:20px">
									<el-form-item label="用餐计划:">
										<div class="mealPlan">每人每天用餐 <span>{{mealCount}}</span>次，计划总餐数<span>{{mealCount*form.totalCount}}</span>次/天</div>
									</el-form-item>
								</div>
								<el-form-item label="">
									<div class="mealPlanTag mb24">
										<div v-for="(i,k) in mealPlanTag" :key="k" @click="checkMeal(k)" :class="{'active':mealPlanTagCheck[k]}">{{i}}</div>
									</div>
								</el-form-item>
								<div class="height30">
									<el-form-item label="培/休时间:">
										<div class="TimeStamp">
											<div class="floatL">
												<el-select v-model="restTimeHover" placeholder="0">
													<el-option v-for="(i,k) in hoverItem" :key="k" :label="i" :value="i"></el-option>
												</el-select>
											</div>
											<div class="floatL txt1">小时</div>
											<div class="floatL" >
												<el-select v-model="restTimeMinutes" placeholder="0">
													<el-option v-for="(i,k) in minutesItem" :key="k" :label="i" :value="i"></el-option>
												</el-select>
											</div>
											<div class="floatL txt2 left">
												<div class="txt">分钟</div>
												<el-tooltip class="item" effect="light" content="用于扣除培训/休息等时间" placement="bottom-end" popper-class="test">
													<div class="detailIcon"></div>
												</el-tooltip>
											</div>
										</div>
									</el-form-item>
								</div>
								<div class="dashedLine"></div>
							</div>
						</el-form>
					</div>
					<div class="costStatistics">
						<div class="title">个人费用统计</div>
						<div class="costWrap">
							<div class="cost">
								<div class="left">
									<div>{{deductMealTime|toFixed}} 小时/天 <span>×</span> {{form.standardSalary|toFixed}} 元/小时</div>
									<div>{{deductMealTime*form.standardSalary|toFixed}} 元/天 <span>×</span> 用工天数{{date}}天</div>
								</div>
								<div class="right">
									<div>预计费用：{{deductMealTime*form.standardSalary*date|toFixed}}元/人</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="subBtnWrap">
					<div class="subBtn" @click="subBtn">确定</div>
					<div class="resetBtn" @click="cancel">取消</div>
				</div>
			</div>
		</transition>
		<el-dialog
            title="新增岗位"
            :visible.sync="dialogVisible"
            width="450px"
            :modal-append-to-body="false"
            top="30.3vh">
			<div>
				<p class="department">所在部门： {{$store.state.recruitmentPlan.form.departmentDetail.name}}</p>
				<div>
					<div class="departmentName">岗位名称：</div>
					<input class="departmentInput" placeholder="请输入" v-model="addDepartmentObj.title" type="text">
				</div>
			</div>
            <div class="dialogBtn">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>
        </el-dialog>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
import _ from 'lodash'
export default {
	name: 'addJobs',
	props: ['addJobSubmit','date','departmentInfo','startTime'],
	mixins: [mixin],
	data () {
		return {
			show: false,
			_timeOut: '',
			form: {
				orderAdd:[{
					ageMax: '',
					ageMin: '',
					gender: 'male',
					heightMax: '',
					heightMin: '',
					total: 0
				},{
					ageMax: '',
					ageMin: '',
					gender: 'female',
					heightMax: '',
					heightMin: '',
					total: 0
				}],
				postId: '',
				startTime: '',
				endTime: '',
				totalCount: '',
				channelId: 100000000000,
				agencyId: '',
				restTime: '',
				tags: '',
				channelName: '劳务公司',
				agencyName: '',
				postName: '',
				standardSalary: 0,
				cost: 0,
				bigint: '',
				timePerMeal: '',
				netWorkTime: '',
			},
			restTimeHover: 0,
			restTimeMinutes: 0,
			checked: false,  // 男女要求
			tagWrap: [],  // 标签数组
			moreBtn: false,  // 添加更多需求
			mealPlanTag:['早餐','午餐','晚餐','夜宵'],
			mealPlanTagCheck: [false, false, false, false],  // 标签是否选中判断
			hoverItem: [],
			minutesItem: [0,30],
			MenOrWomenShow: false,  //男女要求展示隐藏
			num1: 0, // 计数器
			man: true,
			requestList:[],
			requestCheckList:[],
			dialogVisible: false,
			addDepartmentObj:{
				title: '',
				departmentId: ''
			},
			departmentsPosts: [],  // 岗位列表
			getChannel: [],  // 招聘渠道
			getagency: [],
			addTags: '',
			mealCount: 0,
			totalTime: 0,
			focus1: false,
			focus2: false,
			removeInput: false,
			deductTime: '',
      mealselectCheck: true,
      mealSettings: {},
		}
	},
	filters:{
		toFixed(val) {
			if (val) {
				return val.toFixed(2)
			}else{
				return val
			}
		}
	},
	computed:{
		tagWrapFilter() {
			return this.tagWrap.filter(i=>{
				if(i){
					return i
				}
			})
		},
		deductMealTime() {
			let a = 0
			this.mealPlanTagCheck.forEach(i=>{
				if(i) {
					a++
				}
			})
			let b = this.deductTime/(1000*60*60)
			return this.totalTime-b*a-this.restTimeHover-this.restTimeMinutes/60
		},
	},
	watch: {
		deductMealTime(val) {
			this.form.netWorkTime = val*60*60*1000
		}
	},
	mounted () {
		this.init()
		this.show = true
	},
	methods: {
		uncheck(data) {
			this.requestList.map((i,k)=>{
				if(i.label==data.label){
					this.requestCheckList[k] = false
				}
			})
			this.requestCheckList = [].concat(this.requestCheckList)
			this.tagWrap = this.tagWrap.filter(i=>i&&i.label!=data.label)
		},
		timePickerChange() {
			if(!this.form.endTime) {
				return
			}
			if(this.form.endTime<this.form.startTime) {
				this.$nextTick(()=>{
					document.getElementById('endTime').getElementsByTagName('input')[0].value=""
					document.getElementById('endTime').getElementsByTagName('input')[0].value="次日 "+this.form.endTime
				})
			}
			let startTime = this.$base.timeplateToss(this.form.startTime),
			endTime = this.$base.timeplateToss(this.form.endTime)
			if(endTime<startTime) {
				this.totalTime = ((endTime+86400000)-startTime)/1000/60/60
			}else if(endTime==startTime) {
				this.totalTime = 0
				return
			}else {
				this.totalTime = (endTime-startTime)/1000/60/60
      }
      let mealSet = this.$meal.genMeals({startTime, endTime},this.mealSettings)
      this.mealPlanTagCheck = [0b1000&mealSet.mealTimes, 0b0100&mealSet.mealTimes, 0b0010&mealSet.mealTimes, 0b0001&mealSet.mealTimes]
			this.mealCount = mealSet.mealCount || 0
      this.mealselectCheck = this.mealSettings.mealGenerate == 'fixed'
			this.deductTime = this.mealSettings.deductTime
		},
		getAgencySalaryRule() {
			this.$axios({
        method: 'get',
				url:this.$urls.getAgencySalaryRule,
				params:{
					postId:this.form.postId,
					agencyId:this.form.agencyId,
					startTime:this.startTime
				}
				})
				.then(res=>{
					if(res.data.dayshift){
						this.form.standardSalary = res.data.dayshift/100
					}else{
						this.form.standardSalary = 0
					}
				})
				.catch(e=>{

				})
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('addJobs')
			}, 200)
		},
		checkMeal(k) {
			if(this.mealselectCheck) {
				return
			}
			this.mealPlanTagCheck = this.mealPlanTagCheck.map((i,key)=>{
				if (k == key) {
					return !i
				}
				return i
			})
			if (this.mealPlanTagCheck[k]) {
				this.mealCount+=1
			} else {
				this.mealCount-=1
			}
		},
		tagsInit() {
			this.$axios({
        method: 'get',
				url:this.$urls.getTags
      }).then(res=>{
				this.requestList = res.data
				this.requestCheckList = []
				for (let i = 0;i<this.requestList.length;i++) {
					this.requestCheckList.push(false)
				}
				this.requestCheckList.forEach((a,k)=>{
					this.tagWrap.forEach((i,j)=>{
						if (this.tagWrap[j]&&this.tagWrap[j].label == this.requestList[k].label) {
							this.requestCheckList[k] = true
						}
					})
				})
				this.tagWrap = this.requestCheckList.map((i,key)=>{
					if(i) {
						return this.requestList[key]
					}
					return null
				})
			})
			.catch(e=>{

			})
		},
		addTagBtn() {
			if (!this.addTags) {
				this.$message({
					message: "请输入内容",
					type: 'error',
					duration: 5 * 1000
				})
				return
			}
			this.$axios({
				method: 'post',
				url: this.$urls.addTags,
				params:{label:this.addTags}
			}).then(res=>{
				this.tagsInit()
				this.addTags = ''
				this.removeInput = false
				this.$message({
					message: "操作成功",
					type: 'success',
					duration: 5 * 1000
				})
			}).catch(e=>{
				this.$message({
					message: e.data.message || "操作失败",
					type: 'error',
					duration: 5 * 1000
				})
			})
		},
		init() {
			for (let i = 0;i<=12;i++) {
				this.hoverItem.push(i)
			}
			this.tagsInit()
			if (this.$store.state.recruitmentPlan.form.departmentDetail.id) {
				this.$axios({
					method: 'get',
					url: this.$urls.getOutsidePostByDept,
					params: {
						departmentId: this.$store.state.recruitmentPlan.form.departmentDetail.id,
					}
				}).then(res=>{
					this.departmentsPosts = res.data
				}).catch(e=>{

				})
				this.$axios({
					method: 'get',
					url: this.$urls.getChannel
				}).then(res=>{
					this.getChannel = res.data
				}).catch(e=>{

        })
        this.$axios({
          method: 'get',
          url: this.$urls.getMealConstraint
        }).then(res=>{
					this.mealSettings = _.get(res,'data.content',{})
					this.deductTime = res.data.content.deductTime
					this.form.timePerMeal = res.data.content.deductTime
        }).catch(e=>{

        })
			}

			if (this.$store.state.recruitmentPlan.form.postId) {
				this.form.postId = this.$store.state.recruitmentPlan.form.postId
				this.form.postName = this.$store.state.recruitmentPlan.form.postName
				this.form.channelName = this.$store.state.recruitmentPlan.form.channelName
				this.form.agencyName = this.$store.state.recruitmentPlan.form.agencyName
				this.form.startTime = this.$base.timeplateTohm(this.$store.state.recruitmentPlan.form.startTime)
				this.form.endTime = this.$base.timeplateTohm(this.$store.state.recruitmentPlan.form.endTime)
				this.form.totalCount = this.$store.state.recruitmentPlan.form.totalCount
				this.form.channelId = this.$store.state.recruitmentPlan.form.channelId
				this.form.agencyId = this.$store.state.recruitmentPlan.form.agencyId
				let startTime = this.$base.timeplateToss(this.form.startTime),
				endTime = this.$base.timeplateToss(this.form.endTime)
				if(endTime<startTime) {
					this.totalTime = ((endTime+86400000)-startTime)/1000/60/60
				}else if(endTime==startTime) {
					this.totalTime = 0
					return
				}else {
					this.totalTime = (endTime-startTime)/1000/60/60
				}
				this.getAgencySalaryRule()
				if (this.$store.state.recruitmentPlan.form.orderAdd.length>0) {
					this.checked = this.$store.state.recruitmentPlan.form.orderAdd[0].total||this.$store.state.recruitmentPlan.form.orderAdd[1].total?true:false
				}
				if (this.checked) {
					this.form.orderAdd[0].total = this.$store.state.recruitmentPlan.form.orderAdd[0].total
					this.form.orderAdd[0].ageMax = this.$store.state.recruitmentPlan.form.orderAdd[0].ageMax
					this.form.orderAdd[0].ageMin = this.$store.state.recruitmentPlan.form.orderAdd[0].ageMin
					this.form.orderAdd[0].heightMax = this.$store.state.recruitmentPlan.form.orderAdd[0].heightMax
					this.form.orderAdd[0].heightMin = this.$store.state.recruitmentPlan.form.orderAdd[0].heightMin
					this.form.orderAdd[0].gender = this.$store.state.recruitmentPlan.form.orderAdd[0].gender
					if(this.$store.state.recruitmentPlan.form.orderAdd[1]){
						this.form.orderAdd[1].total = this.$store.state.recruitmentPlan.form.orderAdd[1].total
						this.form.orderAdd[1].ageMax = this.$store.state.recruitmentPlan.form.orderAdd[1].ageMax
						this.form.orderAdd[1].ageMin = this.$store.state.recruitmentPlan.form.orderAdd[1].ageMin
						this.form.orderAdd[1].heightMax = this.$store.state.recruitmentPlan.form.orderAdd[1].heightMax
						this.form.orderAdd[1].heightMin = this.$store.state.recruitmentPlan.form.orderAdd[1].heightMin
						this.form.orderAdd[1].gender = this.$store.state.recruitmentPlan.form.orderAdd[1].gender
					}
				}
				if (this.$store.state.recruitmentPlan.form.mealTimes) {
					this.mealPlanTagCheck = this.$store.state.recruitmentPlan.form.mealTimes.split('').map(i=>{
						if (i==1) {
							this.mealCount+=1
							return true
						} else {
							return false
						}
					})
				}
				if (this.$store.state.recruitmentPlan.form.tags) {
					this.tagWrap = this.$store.state.recruitmentPlan.form.tags.split('|').map(i=>{
						return {label:i}

					})
				}
				this.requestCheckList.forEach((a,k)=>{
					this.tagWrap.forEach((i,j)=>{
						if (this.tagWrap[j].label == this.requestList[k]) {
							this.requestCheckList[k] = true
						}
					})
				})
				this.restTimeHover = parseInt(this.$store.state.recruitmentPlan.form.restTime / 1000 / 60 / 60)
				this.restTimeMinutes = parseInt((this.$store.state.recruitmentPlan.form.restTime/1000/60) % 60)
				this.getHotelAgencys()
			}
		},
		subBtn() {
			
			if (!this.form.startTime||!this.form.endTime||!this.form.postId||!this.form.totalCount) {
				this.$message({
					message: "请完善岗位信息",
					type: 'error',
					duration: 5 * 1000
				})
				return
			}
			let startTime = this.$base.timeplateToss(this.form.startTime)
			let endTime = this.$base.timeplateToss(this.form.endTime)
			if(endTime>startTime){
				if(endTime-startTime>this.departmentInfo.workerMaxHour){
					this.$message({
						message: "申请的一天工时超过酒店限制的工时",
						type: 'error',
						duration: 5 * 1000
					})
					return
				}
			}else{
				if(endTime+86400000-startTime>this.departmentInfo.workerMaxHour) {
					this.$message({
						message: "申请的一天工时超过酒店限制的工时",
						type: 'error',
						duration: 5 * 1000
					})
					return
				}
			}
			if(this.form.totalCount<=0) {
				this.$message({
					message: "人数不能为零",
					type: 'error',
					duration: 5 * 1000
				})
				return
			}
			if((this.form.orderAdd[0].total+this.form.orderAdd[1].total)!=this.form.totalCount&&this.checked){
				this.$message({
					message: "男女人数之和不等于申请人数",
					type: 'error',
					duration: 5 * 1000
				})
				return
			}
			this.form.startTime = this.$base.timeplateToss(this.form.startTime)
			this.form.endTime = this.$base.timeplateToss(this.form.endTime)
			this.form.restTime = (parseInt(this.restTimeHover) * 60 + parseInt(this.restTimeMinutes)) * 60000
			this.form.departmentDetail = this.$store.state.recruitmentPlan.form.departmentDetail
			this.form.bigint = this.form.standardSalary*100
			this.form.standardSalary = this.form.standardSalary*100
			this.form.cost = this.deductMealTime*this.form.standardSalary*this.date*this.form.totalCount
			let arr = this.mealPlanTagCheck.map((i,key)=>{
				if (i) {
					return 1
				} else {
					return 0
				}
			})
			this.form.mealTimes = arr.join("")
			let tagWrap = []
			this.tagWrap.forEach(i=>{
				if (i) {
					tagWrap.push(i.label)
				}
			})
			this.form.tags = tagWrap.join("|")
			this.$store.dispatch('addJobParams',this.form)
			let a = 0
			this.mealPlanTagCheck.forEach(i=>{
				if(i) {
					a++
				}
			})
			let b = this.deductTime/(1000*60*60)
			this.$store.dispatch('addJobInfo',{
				mealTotal:this.mealCount*this.form.totalCount,
				totalHours:(this.deductMealTime)*this.form.totalCount*this.date
			})
			if (this.$store.state.recruitmentPlan.form.type=='updated') {
				this.addJobSubmit('updated',this.$store.state.recruitmentPlan.form.index)
			} else {
				this.addJobSubmit()
			}
			this.cancel()
		},
		handleChange(value) {

		},
		checkSex(a) {
			if(a == 1) {
				this.man = true;
			} else {
				this.man = false;
			}
		},
		removeTag(tagsId) {
			this.$axios({
        method: 'post',
				url:this.$urls.delTags,
				params:{tagsId}
      })
    	.then(res=>{
				this.tagsInit()
				this.$message({
					message: "操作成功",
					type: 'success',
					duration: 5 * 1000
				})
      })
      .catch(e=>{
				this.$message({
					message: e.data.message || "操作失败",
					type: 'error',
					duration: 5 * 1000
				})
      })
		},
		checkTag(k) {
			this.requestCheckList = this.requestCheckList.map((i,key)=>{
				if(k == key) {
					return !i
				}
				return i
			})
			this.tagWrap = this.requestCheckList.map((i,key)=>{
				if(i) {
					return this.requestList[key]
				}
				return null
			})
		},
		sure() {
			if (!this.addDepartmentObj.title) {
				this.$message({
					message: "请输入岗位名称",
					type: 'error',
					duration: 5 * 1000
				})
				return
			}
			this.addDepartmentObj.departmentId = this.$store.state.recruitmentPlan.form.departmentDetail.id
			this.$axios({
				method: 'post',
				url: this.$urls.addPostTitle,
				data: this.addDepartmentObj
			}).then(res=>{
				this.$message({
					message: "添加成功",
					type: 'error',
					duration: 5 * 1000
				})
				this.dialogVisible = false
				this.val = ''
			}).catch(e=>{
				this.$message({
					message: "添加失败",
					type: 'error',
					duration: 5 * 1000
				})
			})
		},
		getHotelAgencys() {
			this.$axios({
				method: 'get',
				url: this.$urls.getHotalAgencys,
				params: {postId:this.form.postId}
			}).then(res=>{
				this.getagency = res.data
			}).catch(e=>{
				this.getagency = []
			})
			if (this.form.agencyId) {
				this.getAgencySalaryRule()
			}
		},
		changeValue(value) {
			let post = this.departmentsPosts.find(item=>{
				return item.id == value
			})
			this.form.postName = post.title
			this.form.agencyId = ''
			this.getagency = []
			this.getHotelAgencys()
		},
		changeValue1(value) {
			let channel = this.getChannel.find(item=>{
				return item.id == value
			})
			this.form.channelName = channel.name
		},
		changeValue2(value) {
			let channel = this.getagency.find(item=>{
				return item.agencyId == value
			})
			this.form.agencyName = channel.name
			if (this.form.postId) {
				this.getAgencySalaryRule()
			}
		},
		shut() {
			this.cancel()
		}
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.department{
	font-size: 14px;
	color: #444950;
	margin-top:50px;
	text-align:left;
	padding-left:80px;
}
.departmentName{
	font-size: 14px;
	color: #444950;
	padding-left:80px;
	margin-top:25px;
	text-align:left;
	float:left;
}
.departmentInput{
	width:180px;
	height:28px;
	line-height:28px;
	outline:none;
	margin-top:20px;
	float:left;
	border:1px solid #ececec;
	font-size:12px;
	padding:0 10px;
	color:#999;
}
.height30{
	height: 30px;
}
.mb24{
	margin-bottom: 24px;
}
.mb20{
	margin-bottom: 20px;
}
.panel{
	width:520px;
	overflow-y:scroll;
	-ms-overflow-style: none;
	overflow: -moz-scrollbars-none;
	.wrap{
		min-height:calc(100% - 141px);
	}
	.fixed{
		width: 480px;
	}
	.formWrap{
		padding:24px 0;
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
		.template{
			position: absolute;
			left: 160px;
			top: 0px;
		}
		.padd30{
			padding:0 20px;
		}
		.padd301{
			padding: 0 17px 0 20px;
		}
		.TimeStamp{
			.floatL{
				float: left;
			}
			.txt1{
				margin: 0 10px;
			}
			.txt2{
				margin-left: 10px;
			}
		}
		.requestWrap{
			background-color:#f4f8fc;
			margin-bottom:20px;
			border-radius: 5px;
			.wrap{
				padding:20px 20px 0 20px;
				overflow: hidden;
				.addInput{
					float:left;
					margin-bottom: 20px;
					position: relative;
					input{
						width:80px;
						height:27px;
						padding: 0 10px;
						font-size: 12px;
						color: #999999;
						outline:none;
						box-sizing:border-box;
						border:1px solid #ececec;
						margin-right:20px;
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
					.closeIcon{
				    	position:absolute;
				    	width:12px;
				    	height:12px;
				    	color:#fff;
				    	background-color: #4c8aff;
				    	text-align:center;
				    	line-height:11px;
				    	border-radius:50%;
				    	font-size:12px;
				    	top:-7px;
				    	right:15px;
				    }
				}
				.addMoreTag{
					margin-bottom: 20px;
					overflow:hidden;
					float:left;
					width: 109px;
					height: 27px;
					background-color: #ffffff;
					border-radius: 2px;
					border: dashed 1px #4c8aff;
					-webkit-box-sizing: border-box;
					cursor: pointer;
				    box-sizing: border-box;
				    .addIcon{
				    	background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
						width: 14px;
						height: 14px;
						float:left;
						margin:5px 0 0 10px;
						transform: scale(.8)
				    }
				    .txt{
				    	height:100%;
				    	line-height:25px;
				    	float:left;
				    	color:#4c8aff;
				    	margin-left:5px;
				    	font-size: 12px;
				    }
				}
				.tagItem{
					min-width: 80px;
					height: 27px;
				    line-height: 25px;
				    border-radius: 2px;
				    border: solid 1px #ececec;
				    text-align: center;
				    float: left;
				    margin-right: 20px;
				    color: #999;
				    -webkit-box-sizing: border-box;
				    box-sizing: border-box;
				    padding: 0 10px;
				    font-size: 12px;
				    margin-bottom: 20px;
				    position:relative;
				    background-color:#fff;
				    cursor:pointer;
				    .closeIcon{
				    	position:absolute;
				    	width:12px;
				    	height:12px;
				    	color:#fff;
				    	background-color: #4c8aff;
				    	text-align:center;
				    	line-height:11px;
				    	border-radius:50%;
				    	font-size:12px;
				    	top:-7px;
				    	right:-7px;
				    }
				}
				.active{
					border: solid 1px #4c8aff;
					color:#4c8aff;
				}
			}
		}
		.MenOrWomenWrap{
			margin-top: 10px;
			.tagChange{
				overflow:hidden;
				background-color:#eaf3fe;
				.tag{
					width:50%;
					float:left;
					cursor:pointer;
					div{
						width:80px;
						height:40px;
						line-height:40px;
						text-align:center;
						margin:0 auto;
						font-size: 14px;
						color: #444950;
					}
					.active{
						border-bottom:2px solid #4c8aff;
						color:#4c8aff
					}
				}
			}
			.req-wrap{
				height:176px;
				background-color:#f4f8fc;
				.itemWrap{
					padding:24px 20px 24px 20px;
					.div1{
						margin-bottom:24px;
					}
					.mb0{
						margin-bottom: 0;
					}
					.label{
						color: #444950;
						font-size: 14px;
						display:inline-block;
						margin-right:10px;
					}
					.inputWrap{
						display:inline-block;
						width:173px;
						position: relative;
						.template1{
							position: absolute;
							right: 10px;
							top: 5px;
							font-size: 14px;
						}
					}
					.line{
						display:inline-block;
						vertical-align: middle;
						margin: 0 8px;
						top: 0;
					}
				}
			}
		}
		.addJobsBtn{
			background: url('../../../assets/img/logo.png') no-repeat -115px -154px;
			width: 20px;
			height: 20px;
			float:right;
			margin:9px 192px 0 0;
		}
		.line{
			text-align:center;
			width:20px;
			border-top: 1px dashed #d4d4d4;
			margin: 0px 10px;
			position: relative;
			top:15px;
		}
		.left{
			text-align:left;
			text-indent:5px;
			div{
				float:left;
			}
			.detailIcon{
				background: url('../../../assets/img/logo.png') no-repeat -76px -160px;
				width: 12px;
				height: 12px;
				margin: 8px 0 0 5px;
			}
		}
		.op0{
			opacity:0;
		}
		.jobRequirements{
			overflow:hidden;
			// margin-bottom:20px;
			margin-top:24px;
			.label{
				width:75px;
				height:27px;
				line-height:27px;
				font-size:14px;
				color:#444950;
				float:left;
			}
			.tagWrap{
				overflow:hidden;
				float:left;
				width:270px;
				
				div{
					min-width: 80px;
					cursor: pointer;
					height:27px;
					line-height:25px;
					border-radius: 2px;
					border: solid 1px #4c8aff;
					text-align:center;
					float:left;
					margin-right:10px;
					color:#4c8aff;
					box-sizing:border-box;
					padding: 0 10px;
					font-size: 12px;
					margin-bottom: 10px;
				}
			}
			.moreBtn{
				float:right;
				cursor:pointer;
				margin: 4.5px 0px 0 0;
				div{
					float:right;
				}
				.txt{
					color: #4c8aff;
					height:20px;
					line-height:20px;
					font-size:12px;
				}
				.iconArrow{
					background: url('../../../assets/img/logo.png') no-repeat -203px -104px;
					width: 8px;
					height: 6px;
					margin:6px 0 0 5px;
				}
				.departmentListShow{
					transition:all .3s;
					transform:rotate(180deg);
				}
			}
		}
		.mealPlan{
			font-size: 14px;
			color: #444950;
			span{
				color:#4c8aff;
				padding:0 10px;
			}
		}
		.mealPlanTag{
			overflow:hidden;
			div{
				width: 77px;
				height: 27px;
				border-radius: 2px;
				border: solid 1px #ececec;
				line-height:26px;
				text-align:center;
				float:left;
				margin-right:20px;
				color: #999999;
				font-size: 12px;
				box-sizing:border-box;
				cursor:pointer;
			}
			.active{
				color: #4c8aff;
				border: solid 1px #4c8aff;
			}
		}
		.dashedLine{
			height:1px;
			clear:both;
			border-top:1px dashed #ececec;
			margin-top:24px;
		}
	}
	.costStatistics{
		padding:0 20px;
		.title{
			height: 20px;
			line-height:20px;
			font-size: 14px;
			color: #444950;
		}
		.costWrap{
			margin-top:10px;
			.cost{
				height:70px;
				overflow:hidden;
				background-color:#f4f8fc;
				box-sizing:border-box;
				.left{
					width:308px;
					height:100%;
					float:left;
					border-right:2px solid #fff;
					div{
						height: 20px;
						line-height:20px;
						font-size: 12px;
						color: #444950;
						margin:10px 0 0 20px;
					}
				}
				.right{
					float:right;
					width:150px;
					height:100%;
					div{
						line-height:70px;
						text-align:center;
						font-size: 12px;
						color: #444950;
					}
				}
			}
		}
	}
	.subBtnWrap{
		height:57px;
		width:100%;
		border-top:1px solid #ececec;
		margin-top:30px;
		.subBtn{
			float:left;
			width: 24px;
			height: 17px;
			background-color: #4c8aff;
			border-radius: 14.5px;
			color:#fff;
			text-align:center;
			font-size:12px;
			margin:15px 0 0 150px;
			border:1px solid #4c8aff;
			cursor:pointer;
			padding: 4px 27px;
		}
		.resetBtn{
			float:left;
			width: 24px;
			height: 17px;
			border-radius: 14.5px;
			color:#4c8aff;
			text-align:center;
			font-size:12px;
			margin:15px 0 0 60px;
			border:1px solid #4c8aff;
			cursor:pointer;
			padding: 4px 27px;
		}
	}
	.fade-enter-active, .fade-leave-active{
		overflow:hidden;
		height: 255px;
	    transition: height .5s;
	    -webkit-transition: height .5s;
	}
	.fade-enter, .fade-leave-to{
		overflow:hidden;
	  	height: 0px;
	  	transition: height .5s;
	    -webkit-transition: height .5s;
	}
	.fade1-enter-active, .fade1-leave-active{
		overflow:hidden;
		height: 150px;
	    transition: all .5s;
	    -webkit-transition: all .5s;
	}
	.fade1-enter, .fade1-leave-to{
		overflow:hidden;
	  	height: 0px;
	  	transition: all .5s;
	    -webkit-transition: all .5s;
	}
}

</style>
