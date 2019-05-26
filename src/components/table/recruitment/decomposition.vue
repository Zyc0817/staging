<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th class="minW">操作</th>
					<th>序号</th>
                    <th width="210">用工单号</th>
                    <th>用工部门</th>
                    <th width="210">用工日期</th>
                    <th>招聘人数</th>
                    <th width="120">下单日期</th>
                    <th class="minW">状态</th>
				</tr>
			</thead>
			<tbody v-if="dataList.length>0">
				<tr v-for="(i,k) in dataList" :key="k">
					<td class="operation">
                        <a v-if="i.hasSplit=='N'" class="operation" @click="decomposition(i.id,i.no)">分解</a>
                        <a v-if="i.hasSplit=='Y'" class="operation" @click="decompositionUpdate(i.id,i.no)">修改</a>
                    </td>
                    <td>{{k+1}}</td>
                    <td>{{i.no}}</td>
                    <td>{{i.department}}</td>
                    <td>{{$base.formattingTime(i.startDate)}} 至 {{$base.formattingTime(i.endDate)}}</td>
                    <td>{{i.employees}}</td>
                    <td>{{$base.formattingTime(i.createTime)}}</td>
                    <td v-if="i.hasSplit=='N'">待分解</td>
                    <td v-if="i.hasSplit=='Y'">已分解</td>
                </tr>
			</tbody>	
		</table>
	</div>
</template>
<script>

export default {
    name: 'decomposition',
    props: ['dataList'],
    data () {
        return {
   
        }
    },
    mounted() {
        
    },
    methods: {
        decomposition(id,no) {
            this.$store.dispatch('decomposition',{id,no,type:'decomposition'})
        },
        decompositionUpdate(id,no) {
            this.$store.dispatch('decomposition',{id,no,type:'update'})
        }
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.minW{
    min-width: 50px;
}
.operation{
    color: #4c8aff; 
    cursor:pointer;
}
</style>
