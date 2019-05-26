<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">岗位详情</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div class="wrap">
					<div class="item">
						<div class="left">岗位：</div>
						<div class="right">{{jobs}}</div>
					</div>
					<div class="item">
						<div class="left">工作时间：</div>
						<div class="right">{{startTime}}--{{endTime}}</div>
					</div>
					<div class="item" :class="{'bottom0':orderAdd[0].total||orderAdd[1].total}">
						<div class="left">申请人数：</div>
						<div class="right">{{totalCount}}人</div>	
						<!-- <div class="adjustNum" @click="dialogVisible=true" v-if="(man||women)&&$store.state.recruitmentPlan.type=='approvalEmployment'&&$store.state.recruitmentPlan.state==1">调整人数</div> -->
					</div>
					<div class="item" v-if="orderAdd[0].total||orderAdd[1].total">
						<div class="left"></div>
						<div class="right1">
							<div class="mt5" v-if="orderAdd[0].total">男员工 {{orderAdd[0].total}} 名，年龄 {{orderAdd[0].ageMin}}-{{orderAdd[0].ageMax}}岁，身高 {{orderAdd[0].heightMin}}-{{orderAdd[0].heightMax}}cm</div>
							<div class="mt5" v-if="orderAdd[1].total">女员工 {{orderAdd[1].total}} 名，年龄 {{orderAdd[1].ageMin}}-{{orderAdd[1].ageMax}}岁，身高 {{orderAdd[1].heightMin}}-{{orderAdd[1].heightMax}}cm</div>
						</div>
					</div>
					<div class="item1" :class="{'mb24':!tagList.length}">
						<div class="left" :class="{'height20':!tagList.length}">人员要求：</div>
						<div class="right">
							<div class="tag" v-for="(i,k) in tagList" :key="k">{{i}}</div>
						</div>
					</div>
					<div class="item">
						<div class="left">招聘渠道：</div>
						<div class="right">{{channel}}</div>
					</div>
					<div class="item">
						<div class="left">招聘者：</div>
						<div class="right">{{agency}}</div>
					</div>
					<div class="item">
						<div class="left">用餐计划：</div>
						<div class="right1">
							<div class="meal">每人每天用餐<span>{{mealTimescount}}</span>次，计划总餐数<span>{{mealTimescount * totalCount}}</span>次/天</div>
							<div class="mealTime" v-if="mealTimes.length">包 
								<span v-for="(i,k) in mealTimes" :key="k">
									<span>{{i}}</span>
									<span v-if="k!=mealTimes.length-1">,</span>
								</span>
							</div>				
						</div>
					</div>
					<div class="item">
						<div class="left">培/休时间：</div>
						<div class="right">{{restTime?restTime:'0小时'}}</div>
					</div>
					<div class="line"></div>
					<div class="costStatistics">
						<div class="title">个人费用统计</div>
						<div class="costWrap">
							<div class="cost">
								<div class="left">
									<div>{{deductMealTime|toFixed}} 小时/天 <span>×</span> {{standardSalary|toFixed}} 元/小时</div>
									<div>{{deductMealTime*standardSalary|toFixed}} 元/天 <span>×</span> 用工天数{{date}}天</div>
								</div>
								<div class="right">
									<div>预计费用：{{deductMealTime*standardSalary*date|toFixed}}元/人</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="btn">
					<div @click="cancel">关闭</div>
				</div>
			</div>
		</transition>
		<el-dialog
            title="调整人数"
            :visible.sync="dialogVisible"
            width="550px"
            :modal-append-to-body="false"
            top="30.3vh">
            <AdjustNumberMessage ref="AdjustNumberMessage" :applications="applications" :index="1" :man="man" :women="women"></AdjustNumberMessage>
            <div class="dialogBtn">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>
import AdjustNumberMessage from '../../common/adjustNumberMessage'
import mixin from '../../../assets/js/mixin/mixin'
import _ from 'lodash'
export default {
	props:['dateCount'],
	name: 'advancedSearch',
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			tagList:[],
			applications: 0,
			man: 0,
			women: 0,
			dialogVisible: false,
			endTime: '',
			startTime: '',
			totalCount: '',
			agencyId: '',
			agency: '',
			channel: '',
			standardSalary: '',
			cost: '',
			mealTimes: [],
			eatTimes: 0,
			restTime: '',
			totalTime: 0,
			orderAdd: [{
				ageMax: '',
				ageMin: '',
				heightMax: '',
				heightMin: '',
				total: ''
			},{
				ageMax: '',
				ageMin: '',
				heightMax: '',
				heightMin: '',
				total: ''
			}],
			jobs: '',
			date: 0,
			mealPlanTagCheck: [false, false, false, false],
			deductTime: '',
			restTimeHover:'',
			mealTimescount: 0,
			mealSettings: {},
		}
	},
	filters: {
		money(val) {
			if (val) {
				return (Math.floor((val/100) * 100) / 100).toFixed(2)
			}
		},
		toFixed(val) {
			if (val) {
				return val.toFixed(2)
			}else{
				return val
			}
		}
	},
	computed: {
		deductMealTime() {
			let b = this.deductTime/(1000*60*60)
			return this.totalTime-b*this.mealTimescount-this.restTimeHover/1000/60/60
		},
	},
	created() {
		if (this.$store.state.recruitmentPlan.type=='confirm'||this.$store.state.recruitmentPlan.getDetail.type=='confirm') {
			this.initDepartment()
		} else {
			this.init()
		}
		if (this.$store.state.recruitmentPlan.getDetail.type=='confirm') {
			this.date = this.$store.state.recruitmentPlan.getDetail.dateCount
		} else {
			this.date = this.dateCount
		}
	},
	mounted () {
		this.show = true
	},
	methods: {
		timePickerChange() {
			let startTime = this.$base.timeplateToss(this.startTime),
			endTime = this.$base.timeplateToss(this.endTime)
			if(endTime<startTime) {
				this.totalTime = ((endTime+86400000)-startTime)/1000/60/60
			}else {
				this.totalTime = (endTime-startTime)/1000/60/60
			}
			// let mealSet = this.$meal.genMeals({startTime, endTime},this.mealSettings)
			// this.mealPlanTagCheck = [0b1000&mealSet.mealTimes, 0b0100&mealSet.mealTimes, 0b0010&mealSet.mealTimes, 0b0001&mealSet.mealTimes]
			// this.mealTimescount = mealSet.mealCount || 0
			// this.$axios({
			// 	method: 'get',
			// 	url: this.$urls.dinner,
			// 	params:{
			// 		mealStartTime:startTime,
			// 		mealStopTime:endTime
			// 	}
			// }).then(res=>{
			// 	if(res.data.breakfast){
			// 		this.mealPlanTagCheck[0] = true
			// 		this.mealTimescount++
			// 	}else if(res.data.lunch){
			// 		this.mealPlanTagCheck[1] = true
			// 		this.mealTimescount++
			// 	}else if(res.data.dinner){
			// 		this.mealPlanTagCheck[2] = true
			// 		this.mealTimescount++
			// 	}else if(res.data.supper){
			// 		this.mealPlanTagCheck[3] = true
			// 		this.mealTimescount++
			// 	}
			// 	this.mealPlanTagCheck = [].concat(this.mealPlanTagCheck)
			// 	this.deductTime = res.data.deductTime
			// }).catch(e=>{
			
			// })	
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('jobDetail')
			}, 200)
		},
		sure() {
            let obj = this.$refs.AdjustNumberMessage.returnMsg()
            let init = this.$refs.AdjustNumberMessage.init
            this.dialogVisible = false
		},
		init() {
			let obj = this.$store.state.recruitmentPlan.getDetail
			if (obj.postName) {
				this.jobs = obj.postName
			} else {
				this.jobs = obj.post.title
			}
			this.channel = obj.channelName
			this.agency = obj.agencyName
			this.endTime = this.$base.timeplateTohm(obj.endTime)
			this.startTime = this.$base.timeplateTohm(obj.startTime)
			this.totalTime = (obj.endTime-obj.startTime)/1000/60/60
			this.totalCount = obj.totalCount
			this.applications = obj.totalCount
			this.standardSalary = obj.standardSalary/100
			this.cost = obj.cost
			this.timePickerChange()
			if (obj.orderAdd.length) {
				obj.orderAdd.forEach(i=>{
					if(i.gender=='female'){
						this.women = i.total
					} else if(i.gender=='male'){
						this.man = i.total
					}
				})
			}
			
			if (obj.tags) {
				this.tagList = obj.tags.split('|')
			}
			if (obj.restTime) {
				let str = ''
				this.restTimeHover = obj.restTime
				if (obj.restTime/60000>=60) {
					str += parseInt(obj.restTime/1000/60/60) + '小时'
					if ((obj.restTime/1000/60) % 60 != 0) {
						str += parseInt((obj.restTime/1000/60) % 60) + '分钟'
					}	
				} else {
					str += parseInt(obj.restTime/60000) + '分钟'
				}
				this.restTime = str 
			}	
			if (obj.orderAdd.length) {
				obj.orderAdd.forEach((i,k)=>{
					if (i.gender == 'male') {
						this.orderAdd[0].ageMax = i.ageMax
						this.orderAdd[0].ageMin = i.ageMin
						this.orderAdd[0].heightMax = i.heightMax
						this.orderAdd[0].heightMin = i.heightMin
						this.orderAdd[0].total = i.total
					} else {
						this.orderAdd[1].ageMax = i.ageMax
						this.orderAdd[1].ageMin = i.ageMin
						this.orderAdd[1].heightMax = i.heightMax
						this.orderAdd[1].heightMin = i.heightMin
						this.orderAdd[1].total = i.total
					}
				})
			}
			if (obj.mealTimes) {
				if (obj.mealTimes[0]!=0){this.mealTimes.push('早餐')} 
				if (obj.mealTimes[1]!=0) this.mealTimes.push('午餐')
				if (obj.mealTimes[2]!=0) this.mealTimes.push('晚餐')
				if (obj.mealTimes[3]!=0) this.mealTimes.push('夜宵')
				obj.mealTimes.split('').forEach(i=>{
					if(i==1){
						this.mealTimescount++
					}
				})
			}	
			this.$axios({
				method: 'get',
				url: this.$urls.getMealConstraint
			}).then(res=>{
				this.deductTime = res.data.content.deductTime
			}).catch(e=>{

			})
		},
		initDepartment() {
			this.$axios({
				method: "get",
				url: this.$urls.clickStation,
				params: {orderResolveId:this.$store.state.recruitmentPlan.getDetail.id}
			}).then((res) =>{
				let obj = res.data.content
				this.jobs = res.data.content.post
				this.agency = res.data.content.agency
				this.channel = res.data.content.channel
				this.standardSalary = res.data.content.standardSalary
				this.cost = res.data.content.cost
				this.endTime = this.$base.timeplateTohm(obj.endTime)
				this.startTime = this.$base.timeplateTohm(obj.startTime)
				this.totalTime = (res.data.content.endTime-res.data.content.startTime)/1000/60/60
				this.totalCount = res.data.content.totalCount
				this.tagList = res.data.content.tags.split('|')
				let str = ''	
				this.timePickerChange()	
				if (res.data.content.orderAdd&&res.data.content.orderAdd.length) {
					res.data.content.orderAdd.forEach((i,k)=>{
						if (i.gender == 'male') {
							this.orderAdd[0].ageMax = i.ageMax
							this.orderAdd[0].ageMin = i.ageMin
							this.orderAdd[0].heightMax = i.heightMax
							this.orderAdd[0].heightMin = i.heightMin
							this.orderAdd[0].total = i.total
						} else {
							this.orderAdd[1].ageMax = i.ageMax
							this.orderAdd[1].ageMin = i.ageMin
							this.orderAdd[1].heightMax = i.heightMax
							this.orderAdd[1].heightMin = i.heightMin
							this.orderAdd[1].total = i.total
						}
					})
				}
				if (obj.restTime/60000>=60) {
					str += parseInt(obj.restTime/1000/60/60) + '小时'
					if ((obj.restTime/1000/60) % 60 != 0) {
						str += parseInt((obj.restTime/1000/60) % 60) + '分钟'
					}	
				} else {
					str += parseInt(obj.restTime/60000) + '分钟'
				}
				this.restTime = str 
				if (res.data.content.mealTimes) {
					if (res.data.content.mealTimes[0]!=0){this.mealTimes.push('早餐')} 
					if (res.data.content.mealTimes[1]!=0) this.mealTimes.push('午餐')
					if (res.data.content.mealTimes[2]!=0) this.mealTimes.push('晚餐')
					if (res.data.content.mealTimes[3]!=0) this.mealTimes.push('夜宵')
				}	
			})		
		},
	},
	destroyed() {
		clearTimeout(this._timeOut)
	},
	components: {
		AdjustNumberMessage
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.dialogBtn{
    left: 165px;
}
.panel{
	width:520px;
	overflow-y:scroll;
	.fixed{
		width: 480px;
	}
	.wrap{
		padding:24px;
		min-height:calc(100% - 159px);
		.item{
			overflow:hidden;
			margin-bottom:24px;
			.left,.right{
				float:left;
				height:20px;
				line-height:20px;
				font-size: 14px;
				color: #444950;
			}
			.left{
				width:80px;
			}
			.right{
				// margin-left:10px;
			}
			.right1{
				// margin-left:10px;
				font-size: 14px;
				color: #444950;
				float:left;
				.meal{
					height:20px;
					line-height:20px;
					margin-bottom:5px;
					span{
						color:#4c8aff;
						margin:0 10px;
					}
				}
			}
			.adjustNum{
				font-size: 14px;
				color: #4c8aff;
				margin-left:20px;
				float:left;
				cursor:pointer;
			}
		}
		.bottom0{
			margin-bottom: 5px;
		}
		.mt5{
			margin-top: 5px;
		}
		.item1{
			overflow:hidden;
			margin-bottom:10px;
			.left{
				height:27px;
				line-height:27px;
				font-size: 14px;
				color: #444950;
				float:left;
				width:70px;
			}
			.height20{
				height:20px;
				line-height:20px;
			}
			.right{
				float:left;
				overflow:hidden;
				margin-left:10px;
				.tag{
					width: 80px;
					height: 27px;
					background-color: #ffffff;
					border-radius: 2px;
					border: solid 1px #4c8aff;
					box-sizing:border-box;
					float:left;
					text-align:center;
					line-height:25px;
					font-size: 12px;
					color: #4c8aff;
					margin:0 20px 20px 0;
				}
			}
		}
		.mb24{
			margin-bottom: 24px;
		}
		.line{
			height: 1px;
			border-top: dashed 1px #ececec;
			margin-top:24px;
		}
		.costStatistics{
			margin-top:24px;
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
	}
	.btn{
		height:57px;
		border-top:1px solid #ececec;
		cursor:pointer;
		div{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			background-color: #fff;
			border-radius: 14.5px;
			color:#4c8aff;
			font-size: 12px;
			text-align:center;
			margin:15px auto;
			border:1px solid #4c8aff;
		}
	}
}
	
</style>