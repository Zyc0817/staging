<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th>序号</th>
                    <th>用工单号</th>
                    <th>用工部门</th>
                    <th>岗位</th>
                    <th>工作时间</th>
                    <th>申请人数</th>
                    <th>实到人数</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
                    <td>{{k+1}}</td>
                    <td>{{i.no}}</td>     
					<td>{{i.departmentName}}</td>
                    <td>{{i.postName}}</td>
                    <td>{{$base.timeplateTohm(i.startTime)}} - {{$base.timeplateTohm(i.endTime)}}</td>
                    <td>{{i.totalCount}}</td>
                    <td>{{i.actualCount}}</td>
				</tr>
			</tbody>

		</table>
        <el-dialog
            title="查看详情"
            :visible.sync="dialogVisible"
            :width="'450px'"
            top="30.3vh">
            <div class="dialog">
                <p style="margin-top:50px">招聘者：杭州集合人力资源有限公司</p>
                <p>联络人：张大大</p>
                <p>手机号码：150-8870-5000</p>
            </div>
            <div class="dialogBtn1">
                <div class="cancel" @click="dialogVisible=false">关闭</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>

export default {
	name: 'signTody',
	props: ['dataList'],
	data () {
		return {
			dialogVisible:false,
		}
	},
	mounted() {

	},
	methods: {
        info(data) {
            this.$store.dispatch('signInInfoShow',data)
        },
        agencyDetail(data) {
            this.dialogVisible = true
        }
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.dialog{
    p{
        margin-bottom: 20px;
        margin-left: 98px;
    }
}
#table{
    padding: 0;
}

</style>
