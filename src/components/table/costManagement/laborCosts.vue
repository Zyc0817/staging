<template>
	<div id="table">
		<div class="scrollWrap" v-if="tableType==0" id="scrollWrap" :style="{width:screenWidth}">
			<table style="width:100%" class="table" :style="{width:tableWidth}">
				<thead>
					<tr>
						<th class="width60 op0">
							<div class="checkBox" :class="{'border':allChecked}">
								<div class="checked" v-if="allChecked"></div>
							</div>
						</th>
						<th class="fixed width120 op0">操作</th>
						<th class="width60 op0">序号</th>
						<th class="width60 op0">姓名</th>
						<th class="width100 op0">用工日期</th>
						<!--  -->
						<th v-for="(i,k) in dataList1" :key="k">{{i.fieldName}}</th>
						<!--  -->
						<th class="width120"><div class="op0">核算费用 (元)</div></th>
					</tr>		
				</thead>
				<tbody>
					<tr v-for="(i,k) in dataList" :key="k">
						<td class="width60 op0">
							<div class="checkBox" :class="{'border':checkBoxList[k]}">
								<div class="checked" v-if="checkBoxList[k]"></div>
							</div>
						</td>
						<td class="width120 op0">
							<a class="clickArea">奖惩</a>
							<a class="clickArea ml20">调整考勤</a>
						</td>
						<td class="width60 op0">{{k+1}}</td>
						<td class="width60 op0">{{i.workerName}}</td>	
						<td class="width100 op0">{{$base.formattingTime(i.workerDate)}}</td>
						<!--  -->
						<td v-for="(j,a) in dataHead(i)" :key="a">{{j}}</td>
						<!--  -->
						<td class="width120"><div class="op0">{{(i.calCost?i.calCost/100:0).toFixed(2)}}</div></td>
					</tr>
				</tbody>
			</table>
			<table class="tableleft">
				<thead>
					<tr>
						<th class="width60">
							<div class="checkBox" :class="{'border':allChecked}" @click="allCheckedBtn">
								<div class="checked" v-if="allChecked"></div>
							</div>
						</th>
						<th class="width120">操作</th>
						<th class="width60">序号</th>
						<th class="width60">姓名</th>
						<th class="width100">用工日期</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(i,k) in dataList" :key="k">
						<td class="width80">
							<div class="checkBox" :class="{'border':checkBoxList[k]}" @click="checkBtn(k)">
								<div class="checked" v-if="checkBoxList[k]"></div>
							</div>
						</td>
						<td class="width120">
							<a class="clickArea" @click="rewards(i)">奖惩</a>
							<a class="clickArea ml20" @click="adjustAttendance(i)">调整考勤</a>
						</td>
						<td class="width60">{{k+1}}</td>
						<td class="width120">{{i.workerName}}</td>
						<td class="width100">{{$base.formattingTime(i.workerDate)}}</td>
					</tr>
				</tbody>
			</table>
			<table class="tableright">
				<thead>
					<tr>
						<th class="width120">核算费用 (元)</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(i,k) in dataList" :key="k">
						<td class="width120">{{calCost(i).toFixed(2)}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<table v-else style="width:100%" class="table">
			<thead>
				<tr>
					<th width="180">操作</th>
					<th>序号</th>
					<th>结算单号</th>
					<th>结算单名称</th>
					<th>用工部门</th>
					<th>用工日期</th>
					<th>招聘者</th>
					<th>总费用（元)</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td>
						<a class="clickArea" @click="submit(i)">提交</a>
						<a class="clickAreaRed ml20" @click="undo(i)">撤销</a>
					</td>
					<td>{{k+1}}</td>
					<td class="clickArea">
						<a class="clickArea" @click="detail(i)">{{i.billOrderId}}</a>
					</td>
					<td>{{i.title}}</td>
					<td>{{i.departmentName}}</td>
					<td>{{$base.formattingTime(i.startTime)}} 至 {{$base.formattingTime(i.endTime)}}</td>
					<td>{{i.agencyName|txtLength}}</td>
					<td>{{i.totalCost|money}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>	
export default {
	name: 'laborCosts',
	props: ['dataList','tableType','dataList1','orderInit'],
	data () {
		return {
            allChecked: false,
            checkBoxList: [],
			screenWidth: '',
			tableWidth: ''
		}
	},
	watch: {
		dataList() {
			this.init()
		},
		dataList1() {
			if(this.tableType==0){
				this.tableResize()
			}
		}
		
	},
	filters: {
		cardId(val) {
			if(val){
				return `**************${val.substring(val.length-4,val.length)}`
			}else{
				return ''
			}
		},
		txtLength(val) {
			if(val&&val.length){
				if(val.length>6){
					return val.substring(0,6) + '...'
				}else{
					return val
				}
			}
		},
		money(val) {
            if (val) {
				return (val/100).toFixed(2)
			}else{
				return val/100
			}
        }
	},
	mounted() {
		this.tableResize()
		window.onresize = ()=>{
			this.tableResize()
		}
	},
	methods: {
		calCost(i) {
			return (i.calCost+(i.adjustWorkTime/1000/60/60)*i.onDayshift+i.allowanceCost+i.workerPerformanceAmount+i.adjustWorkCost)/100
		},
		dataHead(data) {
			// console.log(data)
			let arr = []
			this.dataList1.forEach(i=>{
				for(let j in data) {
					if(i.field==j){
						if(i.field=='postId'){
							arr.push(data.postName)
						}else if(i.field=='workerCertNo'){
							arr.push(`**************${data.workerCertNo.substring(data.workerCertNo.length-4,data.workerCertNo.length)}`)
						}else if(i.field=='workTimeStart'){
							arr.push(`${this.$base.timeplateTohm(data.workTimeStart)} - ${this.$base.timeplateTohm(data.workTimeEnd)}`)
						}else if(i.field=='signInTime'){
							arr.push(this.$base.formattingHover(data.signInTime))
						}else if(i.field=='signOutTime'){
							arr.push(this.$base.formattingHover(data.signOutTime))
						}else if(i.field=='workTotalTime'){
							arr.push(this.$base.timeplateToZhCn(data.workTotalTime))
						}else if(i.field=='totalTime'){
							arr.push(data.totalTime/1000/60/60)
						}else if(i.field=='mealTotalTime'){
							arr.push((data.mealTotalTime/(1000*60*60)).toFixed(2))
						}else if(i.field=='restTime'){
							arr.push(data.restTime/(1000*60*60))
						}else if(i.field=='planTime'){
							arr.push(data.planTime/(1000*60*60))
						}else if(i.field=='earlyArrivalTime'){
							arr.push(data.earlyArrivalTime/(1000*60*60)+'小时')
						}else if(i.field=='goLateTime'){
							arr.push(data.goLateTime/(1000*60*60)+'小时')
						}else if(i.field=='onDayshiftTime'){
							arr.push(data.onDayshiftTime/(1000*60*60))
						}else if(i.field=='onDayshift'){
							arr.push(data.onDayshift/100)
						}else if(i.field=='onNightshiftTime'){
							arr.push(data.onNightshiftTime/(1000*60*60))
						}else if(i.field=='onNightshift'){
							arr.push(data.onNightshift/100)
						}else if(i.field=='workTime'){
							arr.push((data.workTime/(1000*60*60)).toFixed(2))
						}else if(i.field=='adjustWorkTime'){
							arr.push(data.adjustWorkTime/(1000*60*60))
						}else if(i.field=='calTime'){
							arr.push((data.calTime/(1000*60*60)).toFixed(2))
						}else if(i.field=='adjustWorkCost'){
							arr.push(data.adjustWorkCost/100)
						}else if(i.field=='allowanceCost'){
							arr.push(data.allowanceCost/100)
						}else if(i.field=='clockTimeStart'){
							arr.push(this.$base.formattingHover(data.clockTimeStart))
						}else if(i.field=='clockTimeEnd'){
							arr.push(this.$base.formattingHover(data.clockTimeEnd))
						}else if(i.field=='workerPerformanceAmount'){
							arr.push((data.workerPerformanceAmount/100).toFixed(2))
						}else if(i.field=='deductMealMode'){
							if(data.deductMealMode=='fact'){
								arr.push('根据实际用餐扣减')
							}else if(data.deductMealMode=='plan'){
								arr.push('根据用工计划扣减')
							}else{
								arr.push('根据用工计划/实际用餐的最多次数扣减')
							}
						}
						else{
							arr.push(data[j])
						}
					}
				}
			})
			return arr
		},
		rewards(data) {
			this.$store.dispatch('costRewards1',{panelType:'out',data})
		},
		tableResize() {
			window.screenWidth = document.body.clientWidth-250
			this.screenWidth = window.screenWidth + 'px'
			this.tableWidth = 110*this.dataList1.length<window.screenWidth?this.screenWidth:110*this.dataList1.length + 'px'
		},
		adjustAttendance(data) {
			this.$store.dispatch('adjustAttendance1',{panelType:'out',data})	
		},
		returnCheckArr() {
			let arr = []
			this.checkBoxList.forEach((i,k)=>{
				if (i) {
					arr.push(this.dataList[k])
				}
			})
			return arr
		},
		submit(data) {
			const h = this.$createElement;
	 		this.$msgbox({
	          	title: '提交',
				message:h('div',{style:'width:296px;margin:0 auto;'},[
					h('p', { style: 'font-size: 14px;color: #444950;margin-top:70px;text-align:left;' }, 
						`确认提交“${data.departmentName}-${data.agencyName}-${this.$base.formattingTime(data.startTime)}至${this.$base.formattingTime(data.endTime)}”的预结算单吗？`),
					h('div',{style:'display:flex;margin-top:5px;'},[
						h('div',{style:'width: 12px;height: 12px;line-height:12px;font-size:12px;color:white;background-color:#e45a3c;border-radius:50%;margin:2.5px 10px 0 0'},'!'),
						h('div',{style:'color:#666666;font-size: 12px;'},'确认后，将开始审批，并且不可撤销')
					])
				]), 
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
				this.$axios({
					method: 'post',
					url: this.$urls.addBillOrderApprove,
					data: {
						departmentId:data.departmentId,
						id:data.billOrderId
					}
				}).then(res=>{
					if(res.data.code == 0){
						this.$message({
							message: "提交成功",
							type: 'success',
							duration: 5 * 1000
						})
						this.orderInit()
					}else{
						this.$message({
							message: res.data.msg||"提交失败",
							type: 'error',
							duration: 5 * 1000
						})
					}	
				}).catch(err=>{
					
				})
	        }).catch((err) => {
		
            })
		},
        detail(data) {
            this.$store.dispatch('costDetail',{type:'C4100',tableType:this.tableType,operation:1,data})
        },
        undo(data) {
            const h = this.$createElement;
	 		this.$msgbox({
	          	title: '撤销',
				message:h('div',{style:'width:296px;margin:0 auto;'},[
					h('p', { style: 'font-size: 14px;color: #444950;margin-top:70px;text-align:left;' }, 
						`确认撤销“${data.departmentName}-${data.agencyName}-${this.$base.formattingTime(data.startTime)}至${this.$base.formattingTime(data.endTime)}”的预结算单吗？`),
					h('div',{style:'display:flex;margin-top:5px;'},[
						h('div',{style:'width: 12px;height: 12px;line-height:12px;font-size:12px;color:white;background-color:#e45a3c;border-radius:50%;margin:2.5px 10px 0 0'},'!'),
						h('div',{style:'color:#666666;font-size: 12px;'},'撤销后，请前往“未结算”查看')
					])
				]), 
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
				this.$axios({
					method: 'post',
					url: this.$urls.delBillOrder,
					params: {
						billOrderId:data.billOrderId,
					}
				}).then(res=>{
					if(res.data.code == 0){
						this.$message({
							message: "撤销成功",
							type: 'success',
							duration: 5 * 1000
						})
						this.orderInit()
					}else{
						this.$message({
							message: res.data.msg||"撤销失败",
							type: 'error',
							duration: 5 * 1000
						})
					}	
				}).catch(err=>{
					
				})
	        }).catch((err) => {
		
            })
        },
        allCheckedBtn() {
            this.allChecked = !this.allChecked
	 		this.checkBoxList = this.checkBoxList.map(()=>{
	 			return this.allChecked
			})
        },
        checkBtn(k) {
            this.checkBoxList = this.checkBoxList.map((i,key)=>{
	 			if (k == key) {
	 				return !i
	 			}
	 			return i
			})
        },
        init() {
	 		this.checkBoxList = []
	 		for (let i = 0;i<this.dataList.length;i++) {
	 			this.checkBoxList.push(false)
			}
			this.allChecked = false
	 	},
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
#table{
	position: relative;
}
.width60{
	width: 60px;
}
.width80{
	width: 80px;
}
.width100{
	width: 100px;
}
.width120{
	width: 120px;
}
.op0{
	opacity: 0;
}
.scrollWrap{
	overflow-x: scroll;
	
	.tableleft,.tableright{
		position: absolute;
		
		border-collapse: collapse;
		z-index: 10;
		background-color: #fff;
		thead{		
			tr{
				height: 47px;
				border-bottom:2px solid #4c8aff;
				th{
					height: 17px;
					line-height: 17px;
					color: #444950;
					font-size: 12px;
				}
			}
		}
		tbody{
			tr{
				height: 47px;
				background-color: #f4f8fc;
				td{
					height: 17px;
					line-height: 17px;
					text-align:center;
					font-size: 12px;
					color: #444950;
					.clickArea{
						color: #4c8aff;
						cursor: pointer;
					}
					.clickAreaRed{
						color: #e45a3c;
						cursor: pointer;
					}
					.ml20{
						margin-left: 20px;
					}
					.mr20{
						margin-right: 20px;
					}
				}
			}
			tr:nth-of-type(2n){
				background-color: #fff;
			}
		}
	}
	.width-80{
		width: 80%;
	}
	.tableleft{
		left: 20px;
		top: 0;
		max-width: 400px;
	}
	.tableright{
		right: 0px;
		top: 0;
	}
}
.checkBox{
	width: 14px;
	height: 14px;
	background-color: #ffffff;
	border: solid 1px #d4d4d4;
	display:flex;
	justify-content:center;
	align-items:center;
    margin:0 auto;
    cursor: pointer;
	.checked{
		width: 8px;
		height: 8px;
		background-color: #4c8aff;
	}
}
.border{
	border: 1px solid #4c8aff;
}
.clickArea{
    color: #4c8aff;
    cursor: pointer;
}
.clickAreaRed{
    color: #e45a3c;
    cursor: pointer;
}
.ml20{
    margin-left: 20px;
}
</style>
