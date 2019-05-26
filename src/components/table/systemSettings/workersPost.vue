<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="150">操作</th>
					<th width="150">序号</th>
                    <th width="230">岗位名称</th>
                    <th width="280">用工部门</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td>
                        <a class="clickArea" @click="editPostName(i.id)">编辑</a>
                        <a class="clickDelete" @click="deleteProject(i.id,i.title)">删除</a>
					</td>
                    <td>{{k+1}}</td>
                    <td>
                        <a class="clickArea" @click="checkPostName(i.id)">{{i.title}}</a>
                    </td>
					<td>{{i.departmentName}}</td>
                    <!-- <td><span v-for="j in i.outDepartments.slice(0,2)" :key="j">{{j}}<span v-if="i.outDepartments.length>=2">，</span></span><span v-if="i.outDepartments.length>2">...</span></td> -->
				</tr>
			</tbody>
		</table>
		<el-dialog
			title="删除"
			:visible.sync="dialogVisible"
			width="450px"
			top="30.3vh">
			<div class="removeblackname"><span>确认删除“{{blackName}}”岗位吗？</span></div>
			<div class="dialogBtn">
				<div class="sub" @click="sure()">确定</div>
				<div class="cancel" @click="dialogVisible=false">取消</div>
			</div>  
        </el-dialog>
	</div>
</template>
<script>

export default {
	name: 'workersPost',
	props: ['dataList','roled'],
	data () {
		return {
			dialogVisible: false,
			blackName: '',
			id: ''
		}
	},
	mounted() {

	},
	methods: {
		editPostName(id) {
			let params = {title: '编辑岗位',operation: 0,type: 'editPostName',id}
			this.$store.dispatch('editPostName',params)
		},
		deleteProject(id,title) {
			this.dialogVisible = true
			this.id = id
			this.blackName = title
		},
		sure() {
			this.$axios({
				method: 'post',
				url: this.$urls.delOutsidePost,
				data: { id: this.id } 
			}).then(res=>{
				console.log(res)
				if(res.data.status != 200){
					this.$message({
						message: res.data.message,
						type: 'error',
						duration: 5*1000
					})
				}else if(res.data.status == 200){
					this.roled()
					this.$message({
						message: '删除成功',
						type: 'success',
						duration: 5*1000
					})
				}
			}).catch(err=>{
				this.$message({
					message: '错误',
					type: 'error',
					duration: 5*1000
				})
			})
			this.dialogVisible = false
		},
		checkPostName(id) {
			let params = {title: '查看详情',operation: 0,type: 'checkPostName',id}
			this.$store.dispatch('checkPostName',params)
		}
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.clickArea{
	cursor:pointer;
    color: #4c8aff;
}
.clickDelete{
    margin-left: 18px;
    cursor:pointer;
    color: #e45a3c;
}
.removeblackname{
	// width: 226px;
	height: 20px;
	margin: 80px auto;
	text-align: center;
	line-height: 20px;
	span{
		font-size: 14px;
		color: #444950;
	}
}
</style>
