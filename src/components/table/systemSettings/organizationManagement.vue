<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th class="sit">操作</th>
					<th class="serialNumber">序号</th>
                    <th class="name">名称</th>
                    <th width="110">所属部门</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td class="sit">
                        <a class="operation" @click="edit(i.id)">编辑</a>
                        <a class="operation ml20" @click="copy(i.id)">复制</a>
						<a class="delete" @click="deletePost(i)">删除</a>
					</td>
                    <td class="serialNumber">{{k+1}}</td>
                    <td class="name">{{i.title}}</td>
                    <td>{{i.department}}</td>
				</tr>
			</tbody>		
		</table>
	</div>
</template>
<script>

export default {
	name: 'organizationManagement',
	props: ['dataList','reload'],
	data () {
		return {
			
		}
	},
	mounted() {

	},
	methods: {
        deletePost(data) {
            const h = this.$createElement;
	 		this.$msgbox({
	          	title: '删除',
				message: h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;'}, `确认删除“${data.title}”岗位吗？`),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	this.$axios({
					method: 'post',
					url:this.$urls.delPost+'/'+data.id,
				})
				.then(res=>{
					if(res.data.code==0){
						this.$message({
							message: "操作成功",
							type: 'success',
							duration: 5 * 1000,			
						})
						this.reload()
					} else {
						this.$message({
							message: res.data.msg||"操作失败",
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
            this.$store.dispatch('postEdit',{id,type:'edit'})
		},
		copy(id) {
			this.$store.dispatch('postEdit',{id,type:'copy'})
		}
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.delete{
	color: #e45a3c;
	cursor:pointer;
}
.operation{
	color: #4c8aff;
	cursor:pointer;
}
.ml20{
    margin: 0 20px;
}
.sit{
	width: 100px;
}
.serialNumber{
	width: 80px;
}
.name{
	width: 90px;
}
</style>
