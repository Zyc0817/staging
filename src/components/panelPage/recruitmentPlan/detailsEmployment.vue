<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">{{$store.state.recruitmentPlan.panelTitle}}</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div class="minH">
					<div class="title">用工需求</div>
					<div class="content content1">
						<div class="div1">用工部门：<span>{{departmentName}}</span></div>
						<div class="div2">用工日期：<span>{{startDate}} &nbsp;至&nbsp; {{endDate}}</span> <span>共计{{dateCount}}天</span></div>
						<div class="div3">申请事由：<span>{{reasons}}</span></div>
					</div>
					<div class="title">岗位列表<span>（申请总人数：{{total}}人）</span><span v-if="$store.state.recruitmentPlan.operation==1&&$store.state.recruitmentPlan.type=='employmentApplication'" class="batchOperation" @click="dialogVisible=true">批量操作</span></div>
					<div class="content content2">
						<Table :data-list="dataList" :order-init="init" ref="table"></Table>
					</div>
					<div class="title">用工成本</div>
						<div class="content content3" :class="{'unActive':costDetailShow}">
						 <div class="laborCostsList">
							<div class="num">{{costs.allCosts}}</div>				
							<div class="txtWrap">	
								<div class="txt">总费用（元）</div>
								<el-tooltip content="总费用 = 人均费用 × 计划列表总人数" effect="light" placement="top-start">
									<div class="laborCostsListIcon"></div>
								</el-tooltip>
							</div>
							<div class="line"></div>
						</div>
						<div class="laborCostsList">
							<div class="num" :class="{'color':costs.costIncome}">{{costs.costIncome}}</div>				
							<div class="txtWrap">	
								<div class="txt">成本收入率（%）</div>
								<el-tooltip content="成本收入率 = 总费用 / 预计总收入" effect="light" placement="top-start">
									<div class="laborCostsListIcon"></div>
								</el-tooltip>
							</div>
							<div class="line"></div>
						</div>
						<div class="laborCostsList">
							<div class="num">0</div>				
							<div class="txtWrap">	
								<div class="txt">服务人员比例（%）</div>
								<el-tooltip content="服务人员比例 = (在岗人数 + 计划列表总人数) / 预计客人总数" effect="light" placement="top-start">
									<div class="laborCostsListIcon"></div>
								</el-tooltip>
							</div>
							<div class="line"></div>
						</div>
						<div class="laborCostsList">
							<div class="num">0</div>				
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
									<span>5人/10人</span>
								</div>
								<div>
									<span>总餐次</span>
									<span>28次</span>
								</div>
								<div>
									<span>人均工资</span>
									<span>17.4元/人</span>
								</div>
							</div>
							<div class="right">
								<div id="echart"></div>
								<!-- <div class="allCost">总预算<br/>10000元</div> -->
								<div class="costTitle">
									<div class="div1">宴会部2018年10月预算表</div>
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
					<div class="content content4">
						<div class="itemWrap" v-for="(item,k) in beos" :key="k">
							<div class="top">
								<div class="item">BEO单号：<span>{{item.beoNo}}</span></div>
								<div class="item">BEO名称：<span>{{item.beoName}}</span></div>
								<div class="item">预计客人数：<span>{{item.beoCustomers}}人</span></div>
							</div>
							<div class="bottom">
								<div class="item">预计收入：<span>{{item.beoIncome|money}}元</span></div>
								<div class="item flex2">
									<div style="overflow:hidden" :class="{'mb24':item.attachBeos.length>1}" v-for="(i,key) in item.attachBeos" :key="key">
										<div class="label">BEO资料：</div>
										<div class="downfile" @click="downfile(item.filePath)">{{i.filename}}</div>
									</div>
								</div>
							</div>
							<div class="line" v-if="k!=beos.length-1"></div>
						</div>
					</div>
				</div>	
				<div class="subBtnWrap">
					<div class="subBtn1" @click="cancel">关闭</div>
				</div>
			</div>
		</transition>
		<JobDetail v-if="$store.state.recruitmentPlan.jobDetailShow" :date-count="dateCount"></JobDetail>
		<DetailApprovals v-if="$store.state.recruitmentPlan.detailApprovalsShow"></DetailApprovals>	
		<el-dialog
            title="批量操作"
            :visible.sync="dialogVisible"
            width="450px"
            :modal-append-to-body="false"
            top="30.3vh">
            <Message ref="message"></Message>
            <div class="dialogBtn">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
		<el-dialog
            title="退回"
            :visible.sync="backShow"
            width="550px"
			:modal-append-to-body="false"
            top="30.3vh">
            <BatchOperationMessage ref="BatchOperationMessage" :batch="'batch'"></BatchOperationMessage>
            <div class="dialogBtn dialogBtnBack">
                <div class="sub" @click="backSure">确定</div>
                <div class="cancel" @click="backShow=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>
import Table from '../../table/recruitmentPlan/addEmploymentApplication'
import JobDetail from './jobDetail'
import DetailApprovals from './detailApprovals'
import Message from '../../common/message'
import echarts from 'echarts'
import BatchOperationMessage from '../../common/batchOperationMessage'
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'detailsEmployment',
	props: ['orderInit'],
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			dataList: [],
			costDetailShow: false,  // 用工成本展开详情
			detailShow: false,
			cost1: 7000,
			cost2: 3000,
			beos:[],
			batchOperationArr:[],  //批量操作全选反选状态
			dialogVisible: false,
			backShow: false,
			startDate: '',
			endDate: '',
			dateCount: 0,
			reasons: '',
			form: {},
			departmentName: '',
			total:0,
			employees: 0,
			costs:{
				allCosts:0,
				costIncome:0,
			},
			undoParams:{
				position: '',
				id: '',
				departmentId: '',
			},
			no: ''
		}
	},
	filters: {
		money(val) {
			if (val) {
				return (Math.floor((val/100) * 100) / 100).toFixed(2)
			}
		}
	},
	created() {
		if (this.$store.state.recruitmentPlan.type=='confirm') {
			this.initcomfirm()
		} else if(this.$store.state.recruitmentPlan.type=='recruitmentManagement') {
			this.initcomfirm()
		}else {
			this.init()
		}
		
	},
	mounted () {
		this.show = true
	},
	updated () {
		this.$nextTick(()=>{
			this.echartDrow()
		})		
	},
	methods: {
		approval() {
			let arr = []
			arr.push(this.$store.state.recruitmentPlan.id)
			this.$axios({
				method: 'post',
				url: this.$urls.getThrough,
				data: {
					id: arr
				}
			}).then(res=>{
				this.cancel()
				this.$message({
					message: "操作成功",
					type: 'success',
					duration: 5 * 1000
				})
			}).catch(e=>{
				this.$message({
					message: "操作失败",
					type: 'error',
					duration: 5 * 1000
				})
			})	
		},
		backSure() {
			let obj = this.$refs.BatchOperationMessage.returnMsg(),
				init = this.$refs.BatchOperationMessage.init,
				arr = []
			if (!obj) {
				return
			}
			arr.push(this.$store.state.recruitmentPlan.id)
			this.$axios({
				method: 'post',
				url: this.$urls.directReturn,
				data: {
					primaryId: arr,
					comments: obj.txt,
					approveState: obj.batch
				}
			}).then(res=>{
				this.cancel()
				init()
				this.$message({
					message: "操作成功",
					type: 'success',
					duration: 5 * 1000
				})
			}).catch(e=>{
				this.$message({
					message: "操作失败",
					type: 'error',
					duration: 5 * 1000
				})
			})	
		},
		downfile(filePath) {
			this.$axios({
                method: 'get',
				url:this.$urls.downfile,
				params: {attch:filePath}
            })
            .then(res=>{
				
            })
            .catch(e=>{
				this.$message({
					message: "下载失败",
					type: 'error',
					duration: 5 * 1000
				})
            })	
		},
		resubmit() {
			this.$axios({
                method: 'post',
				url:this.$urls.updateOrder,
				data: this.form
            })
            .then(res=>{
				this.$message({
					message: "操作成功",
					type: 'success',
					duration: 5 * 1000
				})
				this.cancel()
            })
            .catch(e=>{
				this.$message({
					message: "系统错误",
					type: 'error',
					duration: 5 * 1000
				})
            })	
		},
		initcomfirm() {
			this.$axios({
				method: 'get',
				url: this.$urls.clickOrder,
				params: {orderId:this.$store.state.recruitmentPlan.id}
			})
			.then(res =>{
				this.startDate = this.$base.formattingTime(res.data.content.startDate)
				this.endDate = this.$base.formattingTime(res.data.content.endDate)
				this.dateCount =  this.$base.timeDifference('day',res.data.content.startDate,res.data.content.endDate)
				this.reasons = res.data.content.reasons
				this.dataList = res.data.content.orderResolveVoList
				this.beos = res.data.content.beoVoList
				this.departmentName = res.data.content.department
				this.form = res.data
				let count = 0,
				obj = res.data.content.orderResolveVoList
				obj.forEach(i => {	
					count+=i.totalCount
				});
				this.total = count
				this.costs.allCosts = res.data.content.orderResolveVoList.reduce((total,value)=>{
					return total + parseInt(value.cost/100)
				},0)
				let income = res.data.content.beoVoList.reduce((total,value)=>{
					return total + value.beoIncome/100
				},0)
				this.costs.costIncome = this.costs.allCosts / income
			})
		},
		init() {
			if (this.$store.state.recruitmentPlan.id) {
				this.$axios({
					method: 'get',
					url:this.$urls.getOrder,
					params: {orderId:this.$store.state.recruitmentPlan.id}
				})
				.then(res=>{
					console.log(res)
					// return
					this.startDate = this.$base.formattingTime(res.data.order.startDate)
					this.endDate = this.$base.formattingTime(res.data.order.endDate)
					this.dateCount =  this.$base.timeDifference('day',res.data.order.startDate,res.data.order.endDate)
					this.reasons = res.data.order.reasons
					this.dataList = res.data.orderDetailVos
					this.beos = res.data.beos
					this.departmentName = res.data.order.departmentName
					this.form = res.data
					this.total = res.data.order.employees
					this.costs.allCosts = res.data.orderDetailVos.reduce((total,value)=>{
						return total + parseInt(value.cost/100)
					},0)
					let income = res.data.beos.reduce((total,value)=>{
						return total + value.beoIncome/100
					},0)
					this.costs.costIncome = this.costs.allCosts / income
					this.undoParams.position = res.data.order.position
					this.undoParams.id = res.data.order.id
					this.undoParams.departmentId = res.data.order.departmentId
					this.no = res.data.order.no
				})
				.catch(e=>{
					this.$message({
						message: "加载失败",
						type: 'error',
						duration: 5 * 1000
					})
				})	
			} 
		},
		cancel() {
			this.show = false
			if (this.$store.state.recruitmentPlan.type=='employmentApplication'&&this.$store.state.recruitmentPlan.state==2) {
				this.orderInit()
			}
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('detailsEmployment')
			}, 200)	
		},
		approvalsShow() {
			this.$store.dispatch('detailApprovalsShow')
		},
		handleClick() {
			this.costDetailShow=!this.costDetailShow
			this.detailShow = !this.detailShow
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
			        
			       // ({d}%)   代表该模块所占圆环比例
			        // formatter: "{a} <br/>{b}: {c} ({d}%)"
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
						text:this.cost1+this.cost2+'元',
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
			            name: '访问来源',
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
			                name: '已使用预算'
			            }, {
			                value: cost2,
			                name: '剩余预算'
			            }]
			        }
			    ]
			};
			myChart.setOption(option);
		},
		batchOperation() {
			// 批量操作获取选中的列表
			this.batchOperationArr = this.$refs.table.getCheckList()
			this.$store.dispatch('messageShow')
		},
		undo() {
			const h = this.$createElement;
	 		this.$msgbox({
	          	title: '撤销',
				message:h('div',{style:'width:296px;margin:0 auto;'},[
					h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;' }, 
						'确认撤销编号'+this.no+'的用工申请吗？'),
					h('div',{style:'display:flex;margin-top:5px;'},[
						h('div',{style:'width: 12px;height: 12px;line-height:12px;font-size:12px;color:white;background-color:#e45a3c;border-radius:50%;margin:2.5px 10px 0 0'},'!'),
						h('div',{style:'color:#666666;font-size: 12px;'},'撤销后，下一审批人将不会收到此用工申请')
					])
				]), 
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
				this.$axios({
					method: 'post',
					url: this.$urls.cancelOrder,
					data: this.undoParams
				}).then(res=>{
					console.log(res)
					if(res.data.code == 0){
						this.$message({
							message: "撤销成功",
							type: 'success',
							duration: 5 * 1000
						})
						this.orderInit()
						this.cancel()
					}	
				}).catch(err=>{
					this.$message({
						message: "撤销失败",
						type: 'error',
						duration: 5 * 1000
					})
				})
	        }).catch((err) => {
		
            })
		},
		sure() {
			let state = this.$refs.message.returnMsg(),
				arr = this.$refs.table.getDeleteItem(),
				obj = {orderIds:arr,status:state,id:this.$store.state.recruitmentPlan.id},
				init = this.$refs.message.init
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
				url: this.$urls.updateOrderDetailState,
				data: obj
			}).then(res=>{
				this.init()
				init()
				this.dialogVisible = false
				this.$message({
					message: "操作成功",
					type: 'success',
					duration: 5 * 1000
				})
			}).catch(e=>{
				this.$message({
					message: "操作失败",
					type: 'error',
					duration: 5 * 1000
				})
			})   
        }
	},
	destroyed() {
		clearTimeout(this._timeOut)
	},
	components: {
		Table,
		JobDetail,
		DetailApprovals,
		Message,
		BatchOperationMessage
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
	width:1140px;
	overflow-y:scroll;
	.fixed{
		width: 1100px;
	}
	.minH{
		min-height: calc(100% - 156px);
	}
	.title{
		width: 1100px;
		height:22px;
		line-height:22px;
		font-size: 14px;
		color: #666666;
		margin: 0 auto;
		margin-top:15px;
		span{
			color: #4c8aff;
			margin-left:20px;
		}
		.batchOperation{
			float:right;
			color: #4c8aff;
			font-size: 14px;
			cursor:pointer;
		}
	}
	.content{
		width: 1100px;
		background-color: #f4f8fc;
		border-radius: 2px;
		margin: 0 auto;
		margin-top:15px;
		box-sizing:border-box;
		overflow:hidden;
		.div1,.div2,.div3{
			float:left;
			font-size: 14px;
			color: #444950;
			span{
				margin-left:10px;
			}
		}
		.div2{
			margin:0 0 0 384px;
			span:nth-of-type(2) {
				font-size: 12px;
				color: #999999;
			}
		}
		.div3{
			width:100%;
			margin-top:24px;
		}
	}
	.content1{
		padding:24px;
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
			.color{
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
					margin:7px 0 0 5px;
				}
				.departmentListShow{
					transition:all .3s;
					transform:rotate(180deg);
				}
				.txt{
					height: 20px;
					line-height:20px;
					color: #4c8aff;
					font-size: 12px;
				}
			}
		}
	}
	.unActive{
		border-bottom-left-radius: 0px;
		border-bottom-right-radius:0px;
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
						width:62px;
						float:right;
						margin-right:30px;
						font-size: 14px;
						color: #444950;
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
	.content4{
		padding:24px;
		.itemWrap{
			.top,.bottom{
				display:flex;
			}	
			.bottom{
				margin-top:24px;
			}
			.item{
				flex:1;
				font-size: 14px;
				color: #444950;
				.label{
					width: 72px;
					float: left;
					height: 20px;
				}
				.mb24{
					margin-bottom: 24px;
				}
				.downfile{
					float: left;
					max-width: 600px;
					line-height: 20px;
					height: 20px;
				}
				.downfile:hover{
					border-bottom: 1px solid #4c8aff;
					color: #4c8aff;
					box-sizing: border-box;
				}
			}
			.flex2{
				flex: 2;
			}
		}
		.line{
			width: 1040px;
			height: 1px;
			border-top: dashed 1px #d4d4d4;
			margin:30px auto;
		}
	}
	.subBtnWrap{
		height:57px;
		border-top:1px solid #ececec;
		margin-top:30px;
		.subBtn{
			width:500px;
			height:27px;
			margin:15px auto;
			div{
				float:left;
				width: 24px;
				height: 17px;
				padding: 4px 27px;
				text-align:center;
				border-radius: 14.5px;
				font-size: 12px;
				cursor:pointer;
				margin-right:60px;
			}
			.div1{
				background-color: #4c8aff;
				border:1px solid #4c8aff;
				color: #fff;
			}
			.div2{
				background-color:#e45a3c;
				border:1px solid #e45a3c;
				color:#fff;
			}
			.div3{
				background-color:#fff;
				border: solid 1px #4c8aff;
				color: #4c8aff;
				width: 48px;
				padding: 4px 15px;
			}
			.div4{
				background-color:#fff;
				border: solid 1px #4c8aff;
				color: #4c8aff;
				margin-right:0;
			}
		}
		.subBtn1{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
			cursor:pointer;
			color: #4c8aff;
			margin: 15px auto;
		}
	}
}
.dialogBtnBack{
	left: 165px;
}
	
</style>