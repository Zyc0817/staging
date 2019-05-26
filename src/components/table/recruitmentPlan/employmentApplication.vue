<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="86" v-if="tableType==5" class="min-width">
						<div class="checkBox" :class="{'border':allChecked}" @click="allCheckedBtn">
							<div class="checked" v-if="allChecked"></div>
						</div>
					</th>
					<th width="180">操作</th>
					<th class="min-width" width="30">序号</th>
					<th width="144" v-if="tableType!=5">
						<div class="wrap">
							<div class="thName">用工单号</div>
							<div class="iconArrow" @click="sorting">
								<div class="top el-icon-caret-top" :class="{'color':!sort}"></div>
								<div class="bottom el-icon-caret-bottom" :class="{'color':sort}"></div>
							</div>
						</div>
					</th>
					<th class="min-width" width="120">用工部门</th>
					<th width="200">用工日期</th>
					<th width="100">申请总人数</th>
					<th width="166">下单日期</th>
					<th width="174">状态</th>
				</tr>
			</thead>
			<tbody v-if="dataList.length>0">
				<tr v-for="(i,k) in dataList" :key="k">
					<td v-if="tableType==5">
						<div class="checkBox" :class="{'border':checkBoxList[k]}" @click="checkBtn(k)">
							<div class="checked" v-if="checkBoxList[k]"></div>
						</div>
					</td>
					<td v-if='tableType==0'>
						<!-- <a v-if='i.position=="pending"&&i.creator==userId' class="clickArea clickAreaRed mr20" @click="undo(i)">撤销</a> -->
						<a v-if='(i.position=="pass"&&i.state=="enable"&&i.creator==userId)&&i.endDate>date' class="clickArea clickAreaRed mr20" @click="detailPage(i.position,i.id)">停用</a>
						<a v-if="i.position=='pass'&&i.state=='disable'&&i.creator==userId&&i.endDate>date" class="clickArea mr20" @click="detailPage(i.position,i.id)">启用</a>
						<a v-if="i.position=='pass'&&i.state=='mix'&&i.creator==userId&&i.endDate>date" class="clickArea mr20" @click="detailPage(i.position,i.id)">启用/停用</a>
						<a v-if='i.position=="reject"' class="clickArea mr20" @click="resubmit(i.id)">重新提交</a>
						<a v-if='i.position=="cancel"' class="clickArea mr20" @click="resubmit(i.id)">重新提交</a>
						<a class="clickArea" @click="ApprovalsShowBtn(i.id)">审批进度</a>
					</td>
					<td v-else-if="tableType==1">
						<!-- <a class="clickArea clickAreaRed mr20" v-if="i.creator==userId" @click="undo(i)">撤销</a> -->
						<a class="clickArea" @click="ApprovalsShowBtn(i.id)">审批进度</a>
					</td>
					<td v-else-if="tableType==2">
						<a v-if="i.state=='enable'&&i.creator==userId&&i.endDate>date" class="clickArea clickAreaRed mr20" @click="detailPage(i.position,i.id)">停用</a>
						<a v-else-if="i.state=='disable'&&i.creator==userId&&i.endDate>date" class="clickArea mr20" @click="detailPage(i.position,i.id)">启用</a>
						<a v-else-if="i.state=='mix'&&i.creator==userId&&i.endDate>date" class="clickArea mr20" @click="detailPage(i.position,i.id)">启用/停用</a>
						<a class="clickArea" @click="ApprovalsShowBtn(i.id)">审批进度</a>
					</td>
					<td v-else-if="tableType==3">
						<a class="clickArea mr20" @click="resubmit(i.id)">重新提交</a>
						<a class="clickArea" @click="ApprovalsShowBtn(i.id)">审批进度</a>
					</td>
					<td v-else-if="tableType==4">
						<a class="clickArea mr20" @click="resubmit(i.id)">重新提交</a>
						<a class="clickArea" @click="ApprovalsShowBtn(i.id)">审批进度</a>
					</td>
					<td v-else-if="tableType==5">
						<a class="delete" @click="itemDelete(i.id)">删除</a>
						<a class="update" @click="itemUpdate(i.id)">编辑</a>
					</td>
					<td>{{k+1}}</td>
					<td @click="detailPage(i.position,i.id,i)" v-if="tableType!=5">
						<a class="no">{{i.no}}</a>
					</td>
					<td>{{i.departmentName}}</td>
					<td>{{$base.formattingTime(i.startDate)}} 至 {{$base.formattingTime(i.endDate-86400000)}}</td>
					<td>{{i.employees}}</td>
					<td>{{$base.formattingTime(i.createTime)}}</td>
					<td v-if="i.position=='pending'">审批中</td>
					<td v-if="i.position=='pass'">已审批</td>
					<td v-if="i.position=='reject'">已退回</td>
					<td v-if="i.position=='cancel'">已撤销</td>
					<td v-if="i.position=='draft'">未申请</td>
				</tr>
			</tbody>		
		</table>
	</div>
</template>
<script>

export default {
	name: 'employmentApplication',
	props: ['dataList', 'tableType', 'draftBoxListShow','orderInit'],
	data () {
		return {
		 	checkBoxList: [],  // 草稿箱全选反选
		 	allChecked: false,  // 草稿箱全选反选
			sort: false,
			userId: '',
			date: ''
		}
	},
	watch:{
		dataList() {
			if (this.tableType == 5) {
				this.init()
			}	
		}
	},
	created() {
		this.userId = localStorage.getItem('userId')
		this.date = new Date().getTime()
	},
	mounted() {
		this.init()
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
		detailPage(state,id,data) {
			let params = {}
			if (state=='pending') {
				params = {title:'查看用工申请',state:1,operation:0,type:'employmentApplication',id,data}
			} else if (state=='pass') {
				params = {title:'查看用工申请',state:2,operation:data.endDate>new Date().getTime()?1:0,type:'employmentApplication',id,data}
			} else if (state=='reject') {
				params = {title:'查看用工申请',state:3,operation:0,type:'employmentApplication',id,data}
			} else if (state=='cancel') {
				params = {title:'查看用工申请',state:4,operation:0,type:'employmentApplication',id,data}
			}
			this.$store.dispatch('detailPage',params)
		},
	 	allCheckedBtn() {
	 		this.allChecked = !this.allChecked
	 		this.checkBoxList = this.checkBoxList.map(()=>{
	 			return this.allChecked
			})
	 	},
	 	init() {
	 		this.checkBoxList = []
	 		for (let i = 0;i<this.dataList.length;i++) {
	 			this.checkBoxList.push(false)
			}
			this.allChecked = false
	 	},
	 	checkBtn(k) {
	 		this.checkBoxList = this.checkBoxList.map((i,key)=>{
	 			if (k == key) {
	 				return !i
	 			}
	 			return i
	 		})
	 	},
	 	deleteAll() {
			let arr = []
			for (var i = 0;i < this.dataList.length;i++) {
				if (this.checkBoxList[i]) {
					arr.push(this.dataList[i].id)
				}
			} 
			if (!arr.length) {
				this.$message({
					message: "请选择要删除的内容",
					type: 'error',
					duration: 5 * 1000
				})
				return
			}
	 		this.itemDelete(arr)
	 	},
	 	itemUpdate(id) {
	 		// 编辑
			this.$store.dispatch('addEmploymentApplicationShow',{id,title:'编辑用工申请',operation:1,state:5,type:'employmentApplication'})
			 
	 	},
	 	itemDelete(id) {
	 		const h = this.$createElement;
	 		this.$msgbox({
	          	title: '删除',
				message: h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;' }, '删除后草稿将无法恢复，确认要删除吗？'),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	let arr = []
				arr.push(id)
				this.$axios({
					method: 'post',
					url: this.$urls.delOrder,
					data: {'orderIds':(Object.prototype.toString.call(id)=='[object Array]' ? id : arr)}
				}).then(res=>{
					console.log(11)
					if(res.data.code==0){
						this.$message({
							message: "操作成功",
							type: 'success',
							duration: 5 * 1000
						})
						this.draftBoxListShow(5)	
					}	
				}).catch(e=>{
				
				})	
	        }).catch(() => {
					
            })
	 	},
	 	ApprovalsShowBtn(id) {
	 		this.$store.dispatch('progressout',{id,type:'out',title:1})
	 	},
	 	undo(data) {
			console.log(data)
	 		const h = this.$createElement;
	 		this.$msgbox({
	          	title: '撤销',
				message:h('div',{style:'width:296px;margin:0 auto;'},[
					h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;text-align:left;' }, 
						'确认撤销编号'+data.no+'的用工申请吗？'),
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
					data: {
						position:'cancel',
						id:data.id,
						departmentId:data.departmentId
					}
				}).then(res=>{
					if(res.status == 200){
						this.$message({
							message: "撤销成功",
							type: 'success',
							duration: 5 * 1000
						})
						this.orderInit()
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
	 	resubmit(id) {
	 		this.$store.dispatch('addEmploymentApplicationShow',{id,state:4,title:'重新提交用工申请',operation:1,type:'employmentApplication'})
	 	}
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.width1{
	min-width: 204px;
}
.no{
	color:#4c8aff;
	cursor:pointer;
}
.clickArea{
	color:#4c8aff;
	cursor:pointer;
}
.clickAreaRed{
	color: #e45a3c;
	cursor:pointer;
}
.clickArea:nth-of-type(1){
	// margin-right:20px;
}
.min-width{
	min-width:100px;
}
.delete{
	color:#e45a3c;
	cursor:pointer;
}
.update{
	color:#4c8aff;
	cursor:pointer;
	margin-left:20px;
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
	.checked{
		width: 8px;
		height: 8px;
		background-color: #4c8aff;
	}
}
.border{
	border: 1px solid #4c8aff;
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
		margin: 0.5px 0 0 10px;
		.top{
			position: relative;
			top: -4.5px;
		}
		.bottom{
			position: relative;
			top: -14px;
		}
		.color{
			color: #4c8aff;
		}
	}
}

</style>
