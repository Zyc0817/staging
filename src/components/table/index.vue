<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th>操作</th>
					
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td>
				
					</td>
				</tr>
			</tbody>
			
			
		</table>
	</div>
</template>
<script>

export default {
	name: 'index',
	props: ['dataList'],
	data () {
		return {
			
		}
	},
	mounted() {

	},
	methods: {
		
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';


</style>
