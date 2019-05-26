<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="180">序号</th>
					<th width="180">合同名称</th>
                    <th width="180">有效期</th>
                    <th width="180">状态</th>
				</tr>
			</thead>
			<tbody v-if="dataList.length>0">
				<tr v-for="(i,k) in dataList" :key="k">
					<td>{{k+1}}</td>
                    <td>{{i.contractName}}</td>
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
	name: 'index',
	props: ['dataList'],
	data () {
		return {
			
		}
	},
	mounted() {
		console.log(this.dataList)
	},
	methods: {
		
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
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
