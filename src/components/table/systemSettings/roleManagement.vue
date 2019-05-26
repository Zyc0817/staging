<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="200">操作</th>
					<th width="200">序号</th>
                    <th width="200">角色名称</th>
                    <th width="200">拥有权限</th>
                    <th width="220">创建时间</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td v-if="i.roleType!='sys'">
                        <a class="operation" @click="edit(i)">编辑</a> 
						<a class="delete ml20" @click="deletePost(i)">删除</a>
					</td>
					<td v-else>
						<div class="color null"></div>
					</td>
                    <td>{{k+1}}</td>
                    <td><a class="operation" @click="detail(i)">{{i.roleName}}</a></td>
                    <td>{{getMenuName(i.menuList)|txtLength}}</td>
                    <td>{{$base.formattingTime(i.createTime)}}&nbsp;&nbsp;{{$base.formattingHover(i.createTime)}}</td>
				</tr>
			</tbody>		
		</table>
	</div>
</template>
<script>

export default {
	name: 'roleManagement',
	props: ['dataList','reload'],
	data () {
		return {
			
		}
	},
	filters:{
		txtLength(val) {
			if(val&&val.length){
				if(val.length>8){
					return val.substring(0,9) + '...'
				}else{
					return val
				}
			}
		}
	},
	mounted() {

	},
	methods: {
		detail(data) {
			this.$store.dispatch('roleDetail',{data})
		},
		getMenuName(a) {
			let str = ''
			a.forEach((i,k)=>{
				if(a.length>1){
					if(k==a.length-1){
						str += i.zhCn
					}else{
						str += i.zhCn+','
					}
				}else{
					str += i.zhCn
				}
			})
			return str
		},
        deletePost(data) {
            const h = this.$createElement;
	 		this.$msgbox({
	          	title: '删除',
				message: h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;'}, `确认删除“${data.roleName}”角色吗？`),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	this.$axios({
					method: 'delete',
					url:this.$urls.delRole+'/'+data.roleId,
				})
				.then(res=>{
					if(res.data.status==200){
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						this.reload()
						this.cancel()
					}else{
						this.$message({
							message: res.data.message||'操作失败',
							type: 'error'
						});
					}
				})
				.catch(e=>{

				})	
	        }).catch(() => {
					
            })
        },
		edit(data) {
            this.$store.dispatch('roleEdit',{data})
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
    margin-left:20px;
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

</style>
