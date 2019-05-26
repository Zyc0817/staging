<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th>操作</th>
					<th>序号</th>
                    <th>招聘渠道</th>
                    <th width="170">招聘者</th>
                    <th>姓名</th>
                    <th width="190">手机号</th>
                    <th width="170">状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td>
                        <a class="clickArea" @click="edit(i.agencyId)">编辑</a>
					</td>
                    <td>{{k+1}}</td>
                    <td>劳务派遣</td>
                    <td>
                        <a class="clickArea" @click="companyDetail(i.agencyId)">{{i.name|txtLength}}</a>
                    </td>
                    <td>{{i.linkman}}</td>
                    <td>{{i.phone}}</td>
                    <td v-if="i.state=='enable'">启用</td>
					<td v-else>停用</td>
				</tr>
			</tbody>
			
			
		</table>
	</div>
</template>
<script>

export default {
	name: 'recruitmentManagement',
	props: ['dataList'],
	data () {
		return {
			
		}
	},
	filters:{
		txtLength(val) {
			if(val&&val.length>6){
				return val.substring(0,6)+'...'
			}else{
				return val
			}
			
		}	
	},
	mounted() {

	},
	methods: {
		edit(id) {
			this.$store.dispatch('addRecruiters',{id})
		},
		companyDetail(id) {
            this.$store.dispatch('companyDetail',{id})
        }
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.ml20{
    margin-left: 20px;
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
