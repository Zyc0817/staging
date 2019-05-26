<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt" v-if="$store.state.systemSettings.states.id&&$store.state.systemSettings.states.type=='edit'">编辑</div>
						<div class="txt" v-else-if="$store.state.systemSettings.states.id&&$store.state.systemSettings.states.type=='add'">新增子部门</div>
						<div class="txt" v-else>新增部门</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div class="contentWrap inputHeight30 departmentEdit addEmploymentApplication">
					<el-form ref="form" :model="form" label-width="80px" size="medium">
						<div class="height30 mb24">
							<el-form-item label="部门名称：">
								<el-input v-model="form.name" placeholder="请输入"></el-input>
							</el-form-item>
						</div>
						<div class="height30 mb24">
							<el-form-item label="上级部门：">
								<el-select v-model="form.parentId" placeholder="请选择">
									<el-option 
										v-for="(i,k) in departmentList"
										:key="k"
										:label="i.name" 
										:value="i.id"></el-option>
								</el-select>
							</el-form-item>
						</div>
						<div class="height30 mb24">
							<el-form-item label="编制人数：">
								<el-input v-model="form.planTotal" placeholder="请输入"></el-input>
							</el-form-item>
						</div>
						<div class="height30 mb24">
							<el-form-item label="现有人数：">
								<el-input v-model="form.actualTotal" placeholder="请输入"></el-input>
							</el-form-item>
						</div>
						<el-checkbox v-model="checked"><span class="checkTxt">此部门的用工单审批完成后，需要分解到不同的渠道</span></el-checkbox>
					</el-form>
				</div>
				<div class="subBtnWrap">
					<div class="subBtn" @click="subBtn">确定</div>
					<div class="resetBtn" @click="cancel">取消</div>
				</div>		
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	name: 'departmentEdit',
	props: ['reload'],
	data () {
		return {
			show: false, 
			_timeOut: '',
			form: {
				name:'',
				parentId:'',
				planTotal:'',
				actualTotal:'',
				needSplit:'',
				hotalId:this.$store.state.hotalId,
				id: this.$store.state.systemSettings.states.id.id,
			},
			checked: false,
			departmentList: [],
		}
	},
	created() {
		this.init()
	},
	mounted () {
		this.show = true
	},
	methods: {
		init() {
			this.$axios({
                method: 'get',
                url:this.$urls.departments
            })
            .then(res=>{
				this.departmentList = res.data    
				if (this.$store.state.systemSettings.states.id&&this.$store.state.systemSettings.states.type=='add') {
					this.form.parentId = this.$store.state.systemSettings.states.id.id
				}
            })
            .catch(e=>{

			})	
			if (this.$store.state.systemSettings.states.id&&this.$store.state.systemSettings.states.type=='edit') {	
				this.$axios({
					method: 'get',
					url:this.$urls.getDepartment,
					params:{departmentId:this.$store.state.systemSettings.states.id.id}
				})
				.then(res=>{
					let obj = res.data.content
					this.form.name = obj.name
					this.form.parentId = obj.parentId
					this.form.planTotal = obj.planTotal
					this.form.actualTotal = obj.actualTotal
					this.form.needSplit = obj.needSplit
					if(obj.needSplit=='Y'){
						this.checked = true
					}
				})
				.catch(e=>{

				})	
			}
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('organizationEdit')
			}, 200)
		},
		subBtn() {
			if(!this.form.name||!this.form.parentId) {
				this.$message({
					message: "请完善部门信息",
					type: 'error',
					duration: 5 * 1000,			
				})
				return
			}
			if(parseInt(this.form.planTotal)<parseInt(this.form.actualTotal)){
				this.$message({
					message: "现有人数超出编制人数",
					type: 'error',
					duration: 5 * 1000,			
				})
				return
			}
			if (this.checked) {
				this.form.needSplit = 'Y'
			} else {
				this.form.needSplit = 'N'
			}
			let data = this.form
			if(this.$store.state.systemSettings.states.type=='edit'){
				let obj = this.$store.state.systemSettings.states.id
				data = {
					name:this.form.name,
					newParentId: this.form.parentId,
					id: this.$store.state.systemSettings.states.id.id,
					parentId:obj.parentId,
					orders:obj.orders,
					newOrders: obj.parentId==this.form.parentId?obj.orders:0,
					planTotal:this.form.planTotal,
					actualTotal:this.form.actualTotal,
					needSplit: this.checked?'Y':'N'
				}
			}
			this.$axios({
                method: 'post',
				url:this.$store.state.systemSettings.states.type=='add'?this.$urls.addDepartment:this.$urls.updateDepartment,
				data
            })
            .then(res=>{
				if(res.data.code==0){
					this.$message({
						message: "操作成功",
						type: 'success',
						duration: 5 * 1000
					})
					this.reload()
					this.cancel()	
				}else{
					this.$message({
						message: res.data.msg||"操作失败",
						type: 'error',
						duration: 5 * 1000
					})
				}		
            })
            .catch(e=>{
				this.$message({
					message: "请检查网络",
					type: 'error',
					duration: 5 * 1000
				})
            })	
		},
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
	width:400px;
	.height30{
		height: 30px;
	}
	.mb24{
		margin-bottom: 24px;
	}
	.contentWrap{
		padding: 24px 20px;
		min-height: calc(100% - 159px);
		.checkTxt{
			font-size: 12px;
			color: #666666;
		}
	}
	.subBtnWrap{
		height:57px;
		width:100%;
		border-top:1px solid #ececec;
		.subBtn,.resetBtn{
			float:left;
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			background-color: #4c8aff;
			border-radius: 14.5px;
			color:#fff;
			text-align:center;
			font-size:12px;
			margin:15px 0 0 90px;
			border:1px solid #4c8aff;
			cursor:pointer;
		}
		.resetBtn{
			color:#4c8aff;
			background-color: #fff;
			border:1px solid #4c8aff;
			cursor:pointer;
			margin:15px 0 0 60px;
		}
	}
}
	
</style>