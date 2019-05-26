<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="180">操作</th>
					<th width="180">序号</th>
                    <th width="180">合同名称</th>
                    <th width="180">有效期</th>
                    <th width="180">状态</th>
				</tr>
			</thead>
			<tbody v-if="dataList.length>0">
				<tr v-for="(i,k) in dataList" :key="k">
					<td>
						<a class="clickArea" @click="edit(i)">复制</a>
						<a class="clickAreaRed ml15" v-if="date-i.createTime<86400000" @click="del(i)">删除</a>
					</td>
					<td>{{k+1}}</td>
					<td><a class="clickArea" @click="detail(i.id)">{{i.contractName}}</a></td>
					<td>{{$base.formattingTime(i.startTime)}} 至 {{$base.formattingTime(i.endTime)}}</td>
					<td v-if="i.state=='enable'">生效中</td>
					<td v-else>已失效</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>

export default {
	name: 'addRecruiters',
	props: ['dataList','reload'],
	data () {
		return {
			date: new Date().getTime()
		}
	},
	mounted() {
		
	},
	methods: {
		detail(id) {
			this.$store.dispatch('contractDetail',{id})
		},
		del(data) {
			const h = this.$createElement;
	 		this.$msgbox({
	          	title: '删除',
				message: h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;'}, `确认删除“${data.contractName}”吗？`),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
				this.$axios({
					method: 'post',
					url:this.$urls.delContract,
					params:{contractId:data.id}
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
		edit(data) {
			this.$store.dispatch('addContract',{id:data.id,agencyId:data.agencyId})
		}
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.clickAreaRed{
	color: #e45a3c;
	cursor:pointer;
}
.clickArea{
	color: #4c8aff;
	cursor:pointer;
}
.ml15{
	margin-left:20px;
}
#table{
	.table{
		tbody{
			tr{
				background-color: #fff;
			}
			tr:nth-of-type(2n){
				background-color: #f4f8fc;
			}
		}
		
	}
}
</style>
