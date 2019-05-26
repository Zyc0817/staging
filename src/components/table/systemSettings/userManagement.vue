<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="80">操作</th>
					<th width="24">序号</th>
                    <th width="80">姓名</th>
                    <th width="60">岗位</th>
                    <th width="80">登录账号</th>
                    <th width="80">账号角色</th>
                    <th width="80">管理范围</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td v-if="i.userType!='sys'">
                        <a class="operation" @click="edit(i.userId)">编辑</a> 
						<a class="delete ml20" @click="deletePost(i)">删除</a>
					</td>
					<td v-else>
						<div class="color null"></div>
					</td>
                    <td>{{k+1}}</td>
                    <td><a class="operation" @click="detail(i.userId)">{{i.name}}</a></td>
                    <td>{{i.postName}}</td>
                    <td>{{i.account}}</td>
                    <td>{{user(i.roleList) | txtLength}}</td>
                    <td v-if="i.scope=='dept'">本部门</td>
					<td v-else-if="i.scope=='group'">本部门及子部门</td>
					<td v-else>全公司</td>
				</tr>
			</tbody>		
		</table>
	</div>
</template>
<script>

export default {
	name: 'userManagement',
	props: ['dataList','reload'],
	data () {
		return {
			
		}
	},
	filters:{
		txtLength(val) {
			if(val.length>8){
				return val.substring(0,9)+'...'
			}else{
				return val
			}
		}
	},
	mounted() {

	},
	methods: {
		detail(id) {
			this.$store.dispatch('userDetail',{id})
		},
        deletePost(data) {
            const h = this.$createElement;
	 		this.$msgbox({
	          	title: '删除',
				message:h('div',{style:'width:266px;margin:0 auto;'},[
					h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;text-align: left;' }, 
						`确认删除账号“${data.account}”吗？`),
					h('div',{style:'display:flex;margin-top:5px;'},[
						h('div',{style:'width: 12px;height: 12px;line-height:12px;font-size:12px;color:white;background-color:#e45a3c;border-radius:50%;margin:2.5px 10px 0 0'},'!'),
						h('div',{style:'color:#666666;font-size: 12px;'},'删除后，该用户将无法登录此系统')
					])
				]), 
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	this.$axios({
					method: 'delete',
					url:this.$urls.delAccount+'/'+data.userId,
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
            this.$store.dispatch('accountEdit',{id})
		},
		user(roleName){
			let str = ''
			roleName.forEach((i,k)=>{
				if(roleName.length>1){
					str+=i.roleName+'，'
				} else {
					str+=i.roleName
				}				
			})
			return str
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
    margin-left: 20px;
}

</style>
