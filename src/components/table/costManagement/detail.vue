<template>
	<div id="table">
		<div class="scrollWrap" id="scrollWrap" :style="{width:screenWidth}">
			<table style="width:100%" class="table" :style="{width:tableWidth}">
				<thead>
					<tr>
						<th class="width120 op0" :class="{'width200':$store.state.costManagement.props.reSubmit==1}" v-if="$store.state.costManagement.props.operation">操作<img class="set" src="../../../assets/img/set.svg" alt="" @click="fieldSet"></th>
						<th class="width60 op0">
							<div>序号<img v-if="!$store.state.costManagement.props.operation" @click="fieldSet" class="set" src="../../../assets/img/set.svg" alt=""></div>
						</th>
						<th class="width80 op0">姓名</th>
						<th class="width100 op0">用工日期</th>
						<!--  -->
						<th v-for="(i,k) in dataList1" :key="k">{{i.fieldName}}</th>
						<!--  -->
						<th class="width120 op0">核算费用（元)</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="!i.subtotal&&i.subtotal!=0&&!i.total" v-for="(i,k) in dataList" :key="k">
						<td class="width120 op0" :class="{'width200':$store.state.costManagement.props.reSubmit==1}" v-if="$store.state.costManagement.props.operation">
							<a v-if="$store.state.costManagement.props.type=='C4100'" class="clickArea" @click="adjustAttendance(i)">调整考勤</a>
							<a v-if="$store.state.costManagement.props.type=='C4100'" class="clickArea ml20" @click="rewards(i)">奖惩</a>
							<a v-if="$store.state.costManagement.props.type=='C4200'&&i.billOrderTagList.length" class="clickArea mr20" @click="visibleCheck(i)">查看复核</a>
							<a v-if="$store.state.costManagement.props.type=='C4200'&&!i.billOrderTagList.length&&$store.state.costManagement.props.reSubmit!=1" class="color null"></a>
							<a v-if="$store.state.costManagement.props.type=='C4200'&&$store.state.costManagement.props.reSubmit==1" class="clickArea mr20" @click="adjustAttendance(i)">调整考勤</a>
							<a v-if="$store.state.costManagement.props.type=='C4200'&&$store.state.costManagement.props.reSubmit==1" class="clickArea" @click="rewards(i)">奖惩</a>
							<a v-if="$store.state.costManagement.props.type=='C4300'&&$store.state.costManagement.props.data.billApproveState=='pending'" class="clickArea" @click="tag">复核</a>
							<a v-if="$store.state.costManagement.props.type=='C4300'&&$store.state.costManagement.props.data.billApproveState!='pending'&&i.billOrderTagList.length" class="clickArea" @click="visibleCheck(i)">查看复核</a>
							<a v-if="$store.state.costManagement.props.type=='C4300'&&$store.state.costManagement.props.data.billApproveState!='pending'&&!i.billOrderTagList.length" class="color null"></a>
						</td>
						<td class="width60 op0">{{k+1}}</td>
						<td class="width80 op0">张大大</td>
						<td class="width100 op0">2018/09/01</td>
						
						<td v-for="(j,a) in dataHead(i)" :key="a">{{j}}</td>
						
						<td class="width120 op0">100.0</td>
					</tr>
					<tr v-else-if="i.subtotal||i.subtotal==0">
						<td v-if="$store.state.costManagement.props.operation"></td>
						<td></td>
						<td></td>
						<td></td>
						<td v-for="(j,a) in dataHead(dataList[k-1])" :key="a"></td>
						<td class="totalAdd op0">小计：{{i.subtotal}}</td>
					</tr>
					<tr v-else>
						<td v-if="$store.state.costManagement.props.operation"></td>
						<td></td>
						<td></td>
						<td></td>
						<td v-for="(j,a) in dataHead(dataList[0])" :key="a"></td>
						<td class="totalAdd op0">总计：{{i.total}}</td>
					</tr>
				</tbody>
			</table>
			<table class="tableleft">
				<thead>
					<tr>
						<th :class="{'width200':$store.state.costManagement.props.reSubmit==1,'width120':dataList1.length}" v-if="$store.state.costManagement.props.operation">操作<img class="set" src="../../../assets/img/set.svg" alt="" @click="fieldSet"></th>
						<th :class="{'width60':dataList1.length}">
							<div>序号<img v-if="!$store.state.costManagement.props.operation" @click="fieldSet" class="set" src="../../../assets/img/set.svg" alt=""></div>
						</th>
						<th :class="{'width80':dataList1.length}">姓名</th>
						<th :class="{'width100':dataList1.length}">用工日期</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="!i.subtotal&&i.subtotal!=0&&!i.total" v-for="(i,k) in dataList" :key="k">
						<td class="width120" :class="{'width200':$store.state.costManagement.props.reSubmit==1}" v-if="$store.state.costManagement.props.operation">
							<a v-if="$store.state.costManagement.props.type=='C4100'" class="clickArea" @click="adjustAttendance(i)">调整考勤</a>
							<a v-if="$store.state.costManagement.props.type=='C4100'" class="clickArea ml20" @click="rewards(i)">奖惩</a>
							<a v-if="$store.state.costManagement.props.type=='C4200'&&i.billOrderTagList.length" class="clickArea" :class="{'mr20':$store.state.costManagement.props.reSubmit==1}" @click="visibleCheck(i)">查看复核</a>
							<a v-if="$store.state.costManagement.props.type=='C4200'&&!i.billOrderTagList.length&&$store.state.costManagement.props.reSubmit!=1" class="color null"></a>
							<a v-if="$store.state.costManagement.props.type=='C4200'&&$store.state.costManagement.props.reSubmit==1" class="clickArea mr20" @click="adjustAttendance(i)">调整考勤</a>
							<a v-if="$store.state.costManagement.props.type=='C4200'&&$store.state.costManagement.props.reSubmit==1" class="clickArea" @click="rewards(i)">奖惩</a>
							<a v-if="$store.state.costManagement.props.type=='C4300'&&$store.state.costManagement.props.data.billApproveState=='pending'" class="clickArea" @click="tag(i)">复核</a>
							<a v-if="($store.state.costManagement.props.type=='C4300'||$store.state.costManagement.props.type=='C4400')&&$store.state.costManagement.props.data.billApproveState!='pending'&&i.billOrderTagList.length" class="clickArea" @click="visibleCheck(i)">查看复核</a>
							<a v-if="($store.state.costManagement.props.type=='C4300'||$store.state.costManagement.props.type=='C4400')&&$store.state.costManagement.props.data.billApproveState!='pending'&&!i.billOrderTagList.length" class="color null"></a>
						</td>
						<td class="width60">{{k+1}}</td>
						<td class="width80">{{i.workerName}}</td>
						<td class="width100">{{$base.formattingTime(i.workerDate)}}</td>
					</tr>
					<tr v-else-if="i.subtotal||i.subtotal==0">
						<td v-if="$store.state.costManagement.props.operation"></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
					<tr v-else>
						<td v-if="$store.state.costManagement.props.operation"></td>
						<td></td>
						<td></td>
						<td></td>
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
						<td v-if="!i.subtotal&&i.subtotal!=0&&!i.total" class="width120">{{calCost(i).toFixed(2)}}</td>
						<td v-else-if="i.subtotal||i.subtotal==0" class="totalAdd">小计：{{i.subtotal}}</td>
						<td v-else class="totalAdd">总计：{{i.total}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<el-dialog
            title="复核"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            :width="width"
            top="30.3vh">
            <div class="body" :class="{'width530':width=='530px'}">
				<div class="item">
					<div class="left">复核内容：</div>
					<div class="right">
						<textarea placeholder="请输入" v-model="txt"></textarea>
						<div class="limit">{{txt.length}}/1000</div>
					</div>
				</div>
				<div class="reviewWrap" v-if="width=='530px'">
					<div class="reviewList">
						<div v-for="(i,k) in reviewList" :key="k" class="item">
							<div class="div1 floatL">
								<div class="top">{{$base.formattingTime(i.createTime)}}</div>
								<div class="bottom">{{$base.formattingHover(i.createTime)}}</div>
							</div>
							<div class="div2 icon-Approval-and-approval floatL"></div>
							<div class="div3 floatL">
								<div class="top">{{i.makerName}}（{{i.makerTitle}})</div>
								<div class="bottom">{{i.comments}}</div>
							</div>
							<div v-if="reviewList.length-1!=k" class="div4"></div>
						</div>
					</div>
				</div>
			</div>
            <div class="dialogBtn" :class="{'left155':width=='530px'}">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>

export default {
	name: 'detail',
	props: ['dataList','type','dataList1'],
	data () {
		return {
			dialogVisible: false,
			txt: '',
			width:'450px',
			reviewList: [],
			screenWidth: '',
			tableWidth: '',
			data: {},
			billOrderTags: [],
			index:0,
		}
	},
	watch: {
		dataList1() {
			this.tableResize()
		}
		
	},
	mounted() {
		this.tableResize()
	},
	methods: {
		calCost(i) {
			return (i.calCost+(i.adjustWorkTime/1000/60/60)*i.onDayshift+i.allowanceCost+i.workerPerformanceAmount+i.adjustWorkCost)/100
		},
		tableResize() {
			window.screenWidth = document.getElementById('scrollWrap').clientWidth
			this.screenWidth = window.screenWidth + 'px'
			this.tableWidth = 110*this.dataList1.length<window.screenWidth?this.screenWidth:110*this.dataList1.length + 'px'
		},
		visibleCheck(data) {
			this.$store.dispatch('progress1in',{data,type:'in',title:3})
		},
		rewards(data) {
			this.$store.dispatch('costRewards',{panelType:'in',data})
		},
		adjustAttendance(data) {
			this.$store.dispatch('adjustAttendance',{panelType:'in',data})
		},
		tag(data) {
			this.dialogVisible = true
			this.data = data
			this.reviewList = data.billOrderTagList
			if(data.billOrderTagList.length) {
				this.width = '530px'
			}else{
				this.width = '450px'
			}
		},
		sure() {
			if(this.txt) {
				this.billOrderTags.push({
					workBillId:this.data.id,
					comments: this.txt,
					billOrderId:this.data.billOrderId
				})
			}
			this.data = {}
			this.txt = ''
			this.dialogVisible = false
		},
		returnbillOrderTags() {
			return this.billOrderTags
		},
        fieldSet() {
            this.$store.dispatch('fieldSet',{})
		},
		dataHead(data) {
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
							arr.push(data.earlyArrivalTime/(1000*60*60))
						}else if(i.field=='goLateTime'){
							arr.push(data.goLateTime/(1000*60*60))
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
							arr.push((data.adjustWorkCost/100).toFixed(2))
						}else if(i.field=='allowanceCost'){
							arr.push((data.allowanceCost/100).toFixed(2))
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
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
#table{
	position: relative;
	.totalAdd{
		color: #4c8aff;
		background-color: rgba(255,255,255,0.2);
	}
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
.width200{
	width: 200px;
}
.op0{
	opacity: 0;
}
.left155{
	left: 155px;
}
.scrollWrap{
	overflow-x: scroll;
	
	.tableleft,.tableright{
		position: absolute;
		
		border-collapse: collapse;
		z-index: 10;
		background-color: #f4f8fc;
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
				background-color: #fff;
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
				background-color: #f4f8fc;
			}
		}
	}
	.width-80{
		width: 80%;
	}
	.tableleft{
		left: 20px;
		top: 0;
	}
	.tableright{
		right: 20px;
		top: 0;
	}
}
.null{
	display: inline-block;
	vertical-align: middle;
	width: 24px;
	height: 1px;
	background-color: #d4d4d4;
	margin: 0 auto;
	margin-top: -1px;
}
.color{
	color: #d4d4d4;
}
.body{
	padding: 50px 5px 0;
	overflow: hidden;
	.item{
		overflow: hidden;
	}
	.floatL{
		float: left;
	}
	.reviewWrap{
		clear: both;
		height: 225px;
		margin-top: 20px;
		.reviewList{
			height: 159px;
			width: 376px;
			margin-left: 80px;
			overflow-y: scroll;
			.item{
				overflow: hidden;
				height: 109px;
				position: relative;
				margin-bottom: 10px;
				.div1{
					width: 72px;
					color: #444950;
					.top{
						height: 20px;
						line-height: 20px;
						font-size: 14px;
					}
					.bottom{
						font-size: 12px;
						text-align: right;
						height: 17px;
						line-height: 17px;
						margin-top: 4px;
					}	
				}
				.div2{
					color: #4c8aff;
					font-size: 18px;
					margin-left: 10px;
				}
				.div3{
					margin-left: 10px;
					width: 230px;
					.top{
						font-size: 14px;
					}
					.bottom{
						font-size: 12px;
						margin-top: 4px;
					}
				}
				.div4{
					position: absolute;
					height: 80px;
					border-left: 2px dashed #d4d4d4;
					top: 30px;
					left: 90px;
				}
			}
		}
	}
	.left{
		float: left;
		width: 80px;
	}
	.right{
		float: left;
		position: relative;
		.limit{
			position: absolute;
			right: 10px;
			bottom: 5px;
			font-size: 14px;
			height: 20px;
			line-height: 20px;
			color: #999999;
		}
		textarea{
			width: 330px;
			height: 90px;
			box-sizing: border-box;
			outline: none;
			resize:none;
			font-size: 14px;
			border-color: #ececec;
			padding: 5px 10px;
		}
		textarea::-webkit-input-placeholder{
            color:#999999;
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
	}
}
.width530{
	padding: 30px 15px 0;
	.right{
		textarea{
			width: 390px;
		}
	}
}
.set{
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 3px;
    margin-left: 5px;
    cursor: pointer;
}
.clickArea{
    color: #4c8aff;
    cursor: pointer;
}
.ml20{
    margin-left: 20px;
}
.first{
	padding: 0 0 0 20px;
}
#table{
	.table{
		border-collapse: collapse;
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
				background-color: #fff;
				td{
					height: 17px;
					line-height: 17px;
					text-align:center;
					font-size: 12px;
					color: #444950;
				}
			}
			tr:nth-of-type(2n){
				background-color: #f4f8fc;
			}
		}
		
	}
}

</style>
