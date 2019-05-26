<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="220">操作</th>
					<th>序号</th>
                    <th width="220">类型</th>
                    <th width="220">流程名称</th>
                    <th>发起部门</th>
                    <th>状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td>
                        <a class="clickAreaRed mr20" v-if="i.state=='enable'" @click="state(i)">停用</a>
						<a class="clickArea mr20" v-else @click="state(i)">启用</a>
                        <a class="clickArea" @click="copy(i.workflowId)">复制</a>
						<a class="clickArea ml20" @click="edit(i.workflowId)">编辑</a>
					</td>
                    <td>{{k+1}}</td>
                    <td v-if="i.category=='apply'">用工申请</td>
					<td v-else-if="i.category=='special'">用工申请-紧急审批</td>
					<td v-else>用工费用</td>
                    <td>
                        <a class="clickArea" @click="processDetail(i.workflowId)">{{i.name}}</a>
                    </td>
                    <td>{{department(i.departmentList)|txtLength}}</td>
                    <td v-if="i.state=='enable'">启用</td>
					<td v-else>停用</td>
				</tr>
			</tbody>
			
			
		</table>
	</div>
</template>
<script>

export default {
	name: 'processSet',
	props: ['dataList','reload'],
	data () {
		return {
			
		}
	},
	filters:{
		txtLength(val) {
			if(val&&val.length>8){
				return val.substring(0,9)+'...'
			}else{
				return val
			}
		}
	},
	mounted() {
		
	},
	methods: {
		state(data) {
			const h = this.$createElement;
	 		this.$msgbox({
	          	title: data.state=='enable'?'停用':'启用',
				message: h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;'}, `确认${data.state=='enable'?'停用':'启用'}“${data.name}”流程吗？`),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	this.$axios({
					method: 'get',
					url:this.$urls.stopWorkflow,
					params:{
						workflowId:data.workflowId,
						state:data.state=='enable'?'disable':'enable'
					}
				})
				.then(res=>{
					if(res.data.status==200){
						this.$message({
							message: "操作成功",
							type: 'success',
							duration: 5 * 1000,			
						})
						this.reload()
					}else{
						this.$message({
							message: res.data.message||"操作失败",
							type: 'error',
							duration: 5 * 1000,			
						})
					}
				})
				.catch(e=>{

				})	
	        }).catch(() => {
					
            })
			
		},
        edit(id) {
            this.$store.dispatch('processEdit',{id,type:'edit'})
        },
        processDetail(id) {
            this.$store.dispatch('processDetail',{id})
		},
		copy(id) {
			this.$store.dispatch('processEdit',{id,type:'copy'})
		},
		department(departmentList) {
			if(!departmentList.length){
				return ''
			}else {
				let str = ''
				departmentList.forEach(i=>{
					if(departmentList.length>1){
						str += i.name+','
					}else{
						str += i.name
					}
				})
				return str
			}
		}
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.mr20{
    margin-right: 20px;
}
.clickAreaRed{
	color: #e45a3c;
	cursor:pointer;
}
.clickArea{
	cursor:pointer;
    color: #4c8aff;
}
</style>
