<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th class="minw60" v-if="$store.state.recruitmentPlan.operation==1&&$store.state.recruitmentPlan.type=='employmentApplication'">
						<div class="checkBox" :class="{'border':allChecked}" @click="allCheckedBtn">
							<div class="checked" v-if="allChecked"></div>
						</div>
					</th>
					<th class="minw60" v-if="$store.state.recruitmentPlan.operation=='1'">操作</th>
					<th class="minw60" :class="{'first': $store.state.recruitmentPlan.operation=='0'}">序号</th>
					<th>岗位</th>
					<th>工作时间</th>
					<th>申请人数</th>
					<th>招聘渠道</th>
					<th>招聘者</th>
					<th v-if="$store.state.recruitmentPlan.type!='companyConfirm'&&$store.state.recruitmentPlan.type!='confirm'">价格(元/小时)</th>
					<th v-if="$store.state.recruitmentPlan.type!='companyConfirm'&&$store.state.recruitmentPlan.type!='confirm'">预计费用(元)</th>
					<th v-if="$store.state.recruitmentPlan.type=='companyConfirm'">确认状态</th>
					<th v-if="($store.state.recruitmentPlan.state==2&&$store.state.recruitmentPlan.type=='employmentApplication')||$store.state.recruitmentPlan.type=='confirm'" class="minw60">状态</th>
				</tr>
			</thead>
			<tbody v-if="dataList.length>0">
				<tr v-for="(i,k) in dataList" :key="k">
					<td v-if="$store.state.recruitmentPlan.operation==1&&$store.state.recruitmentPlan.type=='employmentApplication'">
						<div class="checkBox" :class="{'border':checkBoxList[k]}" @click="checkBtn(k)">
							<div class="checked" v-if="checkBoxList[k]"></div>
						</div>
					</td>
					<td v-if="$store.state.recruitmentPlan.operation=='1'&&$store.state.recruitmentPlan.state!=2&&$store.state.recruitmentPlan.type=='employmentApplication'">
						<a class="delete" @click="deleteBtn(k)">删除</a>
						<a class="update" @click="updated(k)">修改</a>
					</td>
					<td v-if="$store.state.recruitmentPlan.operation=='1'&&$store.state.recruitmentPlan.state==2&&$store.state.recruitmentPlan.type=='employmentApplication'">
						<a class="disable" v-if="i.state=='enable'" @click="enable(i.id,'disable',i.postName,i.startTime,i.endTime)">停用</a>
						<a class="enable" v-else-if="i.state=='disable'" @click="enable(i.id,'enable',i.postName,i.startTime,i.endTime)">启用</a>	
					</td>
					<td v-if="$store.state.recruitmentPlan.operation=='1'&&$store.state.recruitmentPlan.state==1&&$store.state.recruitmentPlan.type=='approvalEmployment'">
						<a class="flow" @click="dialogVisibleShow(i,k)">调整人数</a>
						<a class="flow" @click="record(i.id)">调整记录</a>
					</td>
					<td>{{k+1}}</td>
					<td v-if="$store.state.recruitmentPlan.type=='confirm'" class="flow" @click="departmentConfrim(i.id)">{{i.post}}</td>
					<td v-else class="flow" @click="showDetail(k)">
						<span v-if="i.post">{{i.post.title}}</span>
						<span v-else>{{i.postName}}</span>			
					</td>
					<td>{{$base.timeplateTohm(i.startTime)}} - <span v-if="parseInt(i.endTime/(24*3600000))>0">次日</span>{{$base.timeplateTohm(i.endTime%(24*3600000))}}</td>
					<td>{{i.totalCount}}</td>
					<td v-if="$store.state.recruitmentPlan.type!='confirm'">{{i.channelName}}</td>
					<td v-if="$store.state.recruitmentPlan.type!='confirm'">{{i.agencyName|txt}}</td>
					<td v-if="$store.state.recruitmentPlan.type!='companyConfirm'&&$store.state.recruitmentPlan.type!='confirm'">{{i.standardSalary/100|money}}</td>
					<td v-if="$store.state.recruitmentPlan.type!='companyConfirm'&&$store.state.recruitmentPlan.type!='confirm'">{{i.cost/100|money}}</td>
					<td v-if="$store.state.recruitmentPlan.type=='companyConfirm'"></td>
					<td v-if="$store.state.recruitmentPlan.type=='confirm'">{{i.channel}}</td>
					<td v-if="$store.state.recruitmentPlan.type=='confirm'">{{i.agency|txt}}</td>
					<td v-if="$store.state.recruitmentPlan.type=='confirm'">{{changeLetter(i.state)}}</td>
					<td v-if="$store.state.recruitmentPlan.state==2&&$store.state.recruitmentPlan.type=='employmentApplication'&&i.state=='disable'">停用</td>
					<td v-if="$store.state.recruitmentPlan.state==2&&$store.state.recruitmentPlan.type=='employmentApplication'&&i.state=='enable'">启用</td>
				</tr>
			</tbody>
		</table>
		<el-dialog
            title="调整人数"
            :visible.sync="dialogVisible"
            width="550px"
            :modal-append-to-body="false"
            top="30.3vh">
            <AdjustNumberMessage 
				ref="AdjustNumberMessage" 
				:index="index"
				:man="man" 
				:women="women"
				:applications="applications"></AdjustNumberMessage>
            <div class="dialogBtn">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>
import AdjustNumberMessage from '../../common/adjustNumberMessage'
export default {
	name: 'addEmploymentApplication',
	props: ['dataList','deleteJobs','returnDepartmentDetail','orderInit','detailTotal'],
	data () {
	  	return {
	     	checkBoxList: [],  // 草稿箱全选反选
		 	allChecked: false,  // 草稿箱全选反选
		 	applications: 0,  //申请人数 
			dialogVisible: false,
			orderDetailVos: [],
			data: '',
			k: '',
			index: 0,
			man: 0,
			women: 0,
	  	}
	},
	watch: {
		dataList() {
			this.init()
		},
	},
	filters: {
		txt(value) {
			if (value&&value.length>6) {
				return value.substring(0,6) + '...'
			} else {
				return value
			}
		},
		money(val) {
			if (val) {
				return val.toFixed(2)
			}else{
				return val
			}
		}

	},
	methods: {
		departmentConfrim(id) {
			this.$store.dispatch('jobDetail',{id})
		},
		dialogVisibleShow(data,k) {
			this.dialogVisible = true
			this.applications = data.totalCount
			this.data = data
			if(data.orderAdd.length) {
				this.index = 1
				this.man = 0
				this.women = 0
				data.orderAdd.forEach(i=>{
					if(i.gender=='male'){
						this.man = i.total?i.total:0
					}else{
						this.women = i.total?i.total:0
					}
				})
			}else{
				this.index = 0
			}
			this.k = k
			setTimeout(()=>{
				this.$refs.AdjustNumberMessage.setdate(this.orderDetailVos[this.k])
			},200)	
		},
		getDeleteItem() {
			let arr = []
			this.checkBoxList.forEach((i,k)=>{
				if (i) {
					arr.push(this.dataList[k].id)
				}
			})
			return arr
		},
		init() {
	 		this.checkBoxList = []
	 		for (let i = 0;i<this.dataList.length;i++) {
	 			this.checkBoxList.push(false)
			}
			this.dataList.forEach(i=>{
				this.orderDetailVos.push({
					id:'',
					totalCount: '',
					comments: '',
				})
			})
	 	},
		showDetail(k) {
			this.$store.dispatch('jobDetail',this.dataList[k])
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
	 	getCheckList() {
	 		return this.checkBoxList
	 	},
	 	enable(id,state,postTitle,startTime,endTime) {
			let obj = {orderIds:[],status:state,id:this.$store.state.recruitmentPlan.id}
			obj.orderIds.push(id)
	 		const h = this.$createElement
			this.$msgbox({
	          	title: state=='disable'?'停用':'启用',
				message: h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;' }, `确认${state=='disable'?'停用':'启用'} ${this.$base.timeplateTohm(startTime)} - ${this.$base.timeplateTohm(endTime)} 的“${postTitle}”岗位吗？`),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
				this.$axios({
					method: 'post',
					url: this.$urls.updateOrderDetailState,
					data: obj
				}).then(res=>{
					this.orderInit()
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
	        }).catch(() => {
				
            })
	 	},
	 	updated(k) {
			this.dataList[k].type = 'updated'
			this.dataList[k].index = k
			this.dataList[k].departmentDetail = {name:this.dataList[k].postTitle,id:this.returnDepartmentDetail()}
			this.$store.dispatch('addJobs',this.dataList[k])
	 	},
	 	deleteBtn(k) {
	 		const h = this.$createElement;
	 		this.$msgbox({
	          	title: '删除',
				message: h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;' }, '删除后将无法恢复，确认要删除吗？'),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	this.deleteJobs(k)
	        }).catch(() => {
				
            })
	 	},
	 	record(id) {
	 		this.$store.dispatch('progressin',{id,type:'in',title:2})
	 	},
	 	sure() {
			let obj = this.$refs.AdjustNumberMessage.returnMsg()
			this.orderDetailVos[this.k].id = this.data.id
			this.orderDetailVos[this.k].totalCount = obj.num
			this.orderDetailVos[this.k].comments = obj.txt
			this.detailTotal(obj.num,obj.num1,obj.num2,this.k)
			let orderAdd = []
			if(obj.num1){
				orderAdd.push({
					gender:'male',
					total:obj.num1
				})
				this.orderDetailVos[this.k].orderAdd = orderAdd
			}
			if(obj.num2){
				orderAdd.push({
					gender:'female',
					total:obj.num2
				})
				this.orderDetailVos[this.k].orderAdd = orderAdd
			}
			let init = this.$refs.AdjustNumberMessage.init
			init()
			this.dialogVisible = false
		},
		returnOrderDetailVos() {
			return this.orderDetailVos
		},
		changeLetter(state){
            if(state == 'pending'){
                return '确认中'
            } else if(state == 'overdue') {
                return '已完工'
            } else if(state == 'receive') {
                return '已确认'
            }
		}
	},
	components: {
		AdjustNumberMessage
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.checkBox{
	width: 14px;
	height: 14px;
	background-color: #ffffff;
	border: solid 1px #d4d4d4;
	display:flex;
	justify-content:center;
	align-items:center;
	margin:0 auto;
	.checked{
		width: 8px;
		height: 8px;
		background-color: #4c8aff;
	}
}
.border{
	border: solid 1px #4c8aff;
}
.null{
	width: 24px;
	height: 1px;
	background-color: #d4d4d4;
	margin: 0 auto;
}
.color{
	color: #d4d4d4;
}
.dialogBtn{
    left: 165px;
}
#table{
	padding: 0 24px;
	.table{
		tbody{
			tr{
				background-color: #fff;
				.delete{
					cursor:pointer;
					color:#e45a3c;
				}
				.update{
					color:#4c8aff;
					margin-left:20px;
					cursor:pointer;
				}
				.flow{
					color:#4c8aff;
					cursor: pointer;
				}
				.flow:nth-of-type(2){
					margin-left:20px;
				}
				.disable{
					color:#e45a3c;
					cursor:pointer;
				}
				.enable{
					color:#4c8aff;
					cursor:pointer;
				}
			}
			tr:nth-of-type(2n){
				background-color: #f4f8fc;
			}

		}
		.first{
			min-width:70px;
		}
		.minw60{
			min-width:40px;
		}
	}
}

</style>
