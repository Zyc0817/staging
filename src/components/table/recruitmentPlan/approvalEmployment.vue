<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="60" v-if="tableType==1||tableType==0" class="min-width">
						<div class="checkBox" :class="{'border':allChecked}" @click="allCheckedBtn">
							<div class="checked" v-if="allChecked"></div>
						</div>
					</th>
					<th width="180" class="first">操作</th>
					<th class="minw40">序号</th>
					<th width="180">
						<div class="wrap">
							<div class="thName">用工单号</div>
							<div class="iconArrow" @click="sorting">
								<div class="top el-icon-caret-top" :class="{'color':!sort}"></div>
								<div class="bottom el-icon-caret-bottom" :class="{'color':sort}"></div>
							</div>
						</div>
					</th>
					<th>用工部门</th>
					<th width="200">用工日期</th>
					<th>申请总人数</th>
					<th width="166">下单日期</th>
					<th class="min-width">状态</th>
				</tr>
			</thead>
			<tbody v-if="dataList.length>0">
				<tr v-for="(i,k) in dataList" :key="k">
					<td v-if="tableType==1||tableType==0">
						<div v-if="i.position=='pending'" class="checkBox" :class="{'border':checkBoxList[k]}" @click="checkBtn(k)">
							<div class="checked" v-if="checkBoxList[k]"></div>
						</div>
						<div class="color null" v-else></div>
					</td>
					<td v-if="tableType==1||tableType==0">
						<a v-if="i.position=='pending'" class="approval" @click="approval(i)">审批</a>
						<a v-if="i.position=='pending'" class="back" @click="back(i.id)">退回</a>
						<a class="progress" @click="ApprovalsShowBtn(i.id)">审批进度</a>
					</td>
					<td v-if="tableType==2||tableType==3">
						<a class="progress" @click="ApprovalsShowBtn(i.id)">审批进度</a>
					</td>
					<td>{{k+1}}</td>
					<td @click="detailPage(i.position,i.id)">
						<a class="clickArea">{{i.no}}</a>
					</td>
					<td>{{i.departmentName}}</td>
					<td>{{$base.formattingTime(i.startDate)}} 至 {{$base.formattingTime(i.endDate-86400000)}}</td>
					<td>{{i.employees}}</td>
					<td>{{$base.formattingTime(i.createTime)}}</td>
					<td v-if="i.position=='pending'">待审批</td>
					<td v-if="i.position=='pass'">已审批</td>
					<td v-if="i.position=='reject'">已退回</td>
				</tr>
			</tbody>	
		</table>
		<el-dialog
            title="退回"
            :visible.sync="dialogVisible"
            width="450px"
            top="30.3vh">
            <BatchOperationMessage ref="BatchOperationMessage" :batch="'batch'"></BatchOperationMessage>
            <div class="dialogBtn">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>
import BatchOperationMessage from '../../common/batchOperationMessage'
export default {
  	name: 'approvalEmployment',
  	props: ['dataList','tableType','orderInit'],
  	data () {
      	return {
         	checkBoxList: [],  // 草稿箱全选反选
		 	allChecked: false,  // 草稿箱全选反选
		 	check: true,  // 弹框是否分解显示隐藏
			dialogVisible: false,
			id: '',
			sort: false,
      	}
	},
	watch: {
		dataList() {
			this.init()
		}
	},
  	created() {
		  
	},
  	mounted() {

  	},
  	methods: {
		sorting() {
			if (!this.sort) {
				this.orderInit('',{type:'descs',name:'no'})
			} else {
				this.orderInit('',{type:'ascs',name:'no'})
			}
			this.sort = !this.sort
		},
		returnCheckArr() {
			let arr = []
			this.checkBoxList.forEach((i,k)=>{
				if (i) {
					arr.push(this.dataList[k].id)
				}
			})
			return arr
		},
		back(id) {
			this.dialogVisible = true
			this.id = id
		},
  	   	checkBtn(k) {
	 		this.checkBoxList = this.checkBoxList.map((i,key)=>{
	 			if (k == key) {
	 				return !i
				 }
				 this.allChecked = false
	 			 return i
	 		})
	 	},
	 	allCheckedBtn() {
	 		this.allChecked = !this.allChecked
	 		this.checkBoxList = this.checkBoxList.map(i=>{
				if (i!=null) {
					return this.allChecked
				} 			
	 		})
	 	},
	 	init() {
			this.allChecked = false
	 		this.checkBoxList = []
	 		for (let i = 0;i<this.dataList.length;i++) {
				if (this.dataList[i].position=='pending') {
					this.checkBoxList.push(false)
				} else {
					this.checkBoxList.push(null)
				}		
			}
	 	},
	 	detailPage(state,id) {
			let params = {}
			if (state == 'pending') {
				params = {title:'查看用工申请',type:'approvalEmployment',operation:1,state:1,id}
			} else if (state == 'pass') {
				params = {title:'查看用工申请',type:'approvalEmployment',operation:0,state:2,id}
			} else if (state == 'reject') {
				params = {title:'查看用工申请',type:'approvalEmployment',operation:0,state:3,id}
			}
			this.$store.dispatch('detailPage',params)
		},
		ApprovalsShowBtn(id) {
	 		this.$store.dispatch('progressout',{id,type:'out',title:1})
	 	},
	 	approval(item) {
	 		const h = this.$createElement;
	 		this.$msgbox({
	          	title: '审批',
				message: h('div',null,[
					h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;' }, `确认审批通过“${item.departmentName}”的用工申请吗？`)
				]),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	let arr = []
				arr.push(item.id)
	        	this.$axios({
					method: 'post',
					url: this.$urls.getThrough,
					data: {
						id: arr
					}
				}).then(res=>{
					if(res.data.status==200){
						this.orderInit()
						this.$message({
							message: "操作成功",
							type: 'success',
							duration: 5 * 1000
						})
					}else{
						this.$message({
							message: res.data.message||"操作失败",
							type: 'error',
							duration: 5 * 1000
						})
					}
					
				}).catch(e=>{
					
				})	
	        }).catch(() => {
				
            })
	 	},
	 	sure() {
			let obj = this.$refs.BatchOperationMessage.returnMsg(),
				init = this.$refs.BatchOperationMessage.init,
				arr = []
			if (!obj) {
				return
			}
			arr.push(this.id)
			this.$axios({
				method: 'post',
				url: this.$urls.directReturn,
				data: {
					id: arr,
					comments: obj.txt,
					approveState: obj.checked?1:0
				}
			}).then(res=>{
				if(res.data.status==200){
					this.orderInit()
					init()
					this.$message({
						message: "操作成功",
						type: 'success',
						duration: 5 * 1000
					})
				}else{
					this.$message({
						message: res.data.message||"操作失败",
						type: 'error',
						duration: 5 * 1000
					})
				}
				
			}).catch(e=>{
				
			})	
            this.dialogVisible = false
        }
  	},
  	components: {
        BatchOperationMessage
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
	border: 1px solid #4c8aff;
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
.wrap{
	width:70px;
	overflow:hidden;
	margin: 0 auto;
	.thName{
		float:left;
	}
	.iconArrow{
		float:left;
		width:12px;
		height:16px;
		margin: 1px 0 0 10px;
		.top{
			position: relative;
			top: -4.5px;
		}
		.bottom{
			position: relative;
			top: -14px;
		}
		.color{
			cursor:pointer;
			color: #4c8aff;
		}
	}
}
.approval{
	color: #4c8aff;
	margin-right:20px;
	cursor:pointer;
}
.back{
	color: #e45a3c;
	margin-right:20px;
	cursor:pointer;
}
.progress{
	color: #4c8aff;
	cursor:pointer;
}
.clickArea{
	color:#4c8aff;
	cursor:pointer;
}
.min-width{
	min-width:60px;
}
.first{
	min-width:90px;
}
.minw40{
	min-width: 40px;
}
</style>
