<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th v-if="tableType!=4" width="140">操作</th>
					<th v-if="tableType==4" width="100">序号</th>
                    <th v-else>序号</th>
                    <th>结算单号</th>
                    <th>结算单名称</th>
                    <th>用工部门</th>
                    <th>用工日期</th>
                    <th>招聘者</th>
                    <th>总费用（元)</th>
                    <th>状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td v-if="tableType!=4">
						<a class="clickArea mr20" v-if="i.position=='pass'&&i.payState=='N'" @click="print(i)">打印</a>
						<a class="clickArea mr20" v-if="i.position=='reject'" @click="reSubmit(i)">重新提交</a>
                        <a class="clickArea" v-if="i.payState=='N'" @click="approvals(i.id)">审批进度</a>
						<div class="color null" v-if="i.payState=='Y'"></div>
					</td>
                    <td>{{k+1}}</td>
                    <td><a class="clickArea" @click="detail(i)">{{i.billOrderNo}}</a></td>
                    <td>{{i.title}}</td>
                    <td>{{i.departmentName}}</td>
                    <td>{{$base.formattingTime(i.startTime)}} 至 {{$base.formattingTime(i.endTime)}}</td>
                    <td>{{i.agencyName|txtLength}}</td>
                    <td>{{(i.totalCost/100).toFixed(2)}}</td>
                    <td v-if="i.position=='pending'">审批中</td>
					<td v-else-if="i.position=='pass'&&i.payState=='N'">待付款</td>
					<td v-else-if="i.position=='reject'">已退回</td>
					<td v-else-if="i.position=='pass'&&i.payState=='Y'">已付款</td>
				</tr>
			</tbody>


		</table>
	</div>
</template>
<script>

import print from 'print-js'
export default {
	name: 'costSettlement',
	props: ['dataList','tableType'],
	data () {
		return {

		}
	},
	filters: {
		txtLength(val) {
			if(val&&val.length){
				if(val.length>6){
					return val.substring(0,6) + '...'
				}else{
					return val
				}
			}
		}
	},
	computed:{
		filterDataList(){
			return this.dataList.filter(i=>!(i.payState=='Y'&&i.position=='pass'))
		}
	},
	methods: {
		reSubmit(data) {
			this.$store.dispatch('costDetail',{type:'C4200',tableType:this.tableType,operation:1,reSubmit:1,data})
		},
		print(data) {
			this.$axios({
                method: 'post',
                url:this.$urls.generatePdfInfo+'?generateState=costPdf',
                data:{
					billOrderId:data.id,
					statisticalMethods: 'byDate'
				}
            })
            .then(res=>{
                if(res.data.status==200){
					let url = this.$baseApi.split('/hotelApi')
					let i = res.data.content
					this.$printJS('/upload/'+i.filepath+i.filedate)
				}else{
					this.$message({
						message: res.data.message||'操作失败',
						type: 'error',
						duration: 5 * 1000
					})
				}
            })
            .catch(e=>{

            })
		},
		approvals(id) {
			this.$store.dispatch('progressout',{id,type:'out',title:1})
		},
        detail(data) {
			let operation = 1
			if(data.position=='pending'){
				operation = 0
			}
            this.$store.dispatch('costDetail',{type:'C4200',tableType:this.tableType,operation,data,position:data.position})
        }
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.border{
	border: 1px solid #4c8aff;
}

</style>
