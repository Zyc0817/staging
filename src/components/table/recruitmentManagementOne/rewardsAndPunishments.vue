<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="130">序号</th>
                    <th width="150">姓名</th>
					<th width="180">用工单号</th>
                    <th width="200">招聘者</th>
                    <th width="150">类型</th>
                    <th width="150">项目</th>
                    <th width="180">金额</th>
                    <th width="250">日期</th>
					<th width="280">原因</th>
				</tr>
			</thead>
			<tbody v-if="dataList.length>0">
				<tr v-for="(i,k) in dataList" :key="k">
                    <td>{{k+1}}</td>
                    <td>
						<a class="operation" @click="personalInformations(i)">{{i.workerName}}</a>
					</td>
					<td>{{i.no}}</td>
                    <td>
						<a class="operation" @click="handleClick(i)">{{i.agencyName | changeRecruiters}}</a>
					</td>
                    <td>{{i.category | changeType}}</td>
                    <td>{{i.categoryName}}</td>
                    <td>{{i.amount | minusSign}}</td>
                    <td>{{$base.formattingTime(i.createTime)}}</td>
					<td><div @click="seeResion(k)" class="seeResion" @mouseleave="vanishResion(k)">{{i.remark|cutOut}} <span class="specificDisplay triangle" v-if="specificDisplay1[k]">{{i.remark}}</span></div></td>
                </tr>
			</tbody>		
		</table>
		<div class="recruiters">
			<el-dialog
				title="查看详情"
				:visible.sync="centerDialogVisible"
				width="30%"
				center>
				<div class="recruitersone"><span>招聘者：</span><span>{{recruiter}}</span></div>
				<div class="recruiterstwo"><span>联络人：</span><span>{{personName}}</span></div>
				<div class="recruitersthe"><span>手机号码：</span><span>{{phone}}</span></div>
				<span slot="footer" class="dialog-footer" @click="centerDialogVisible = false">
				<span>关闭</span>
				</span>
			</el-dialog>
		</div>
	</div>
</template>
<script>

export default {
    name: 'rewardsAndPunishments',
    props: ['dataList'],
    data () {
        return {
			dataListParams: {
                current: 1,
                size: 8
			},
			agencyId: this.dataList.agencyId,
			centerDialogVisible: false,
			specificDisplay1: [],
			recruiter: '',
			personName: '',
			phone: ''
        }
    },
    watch:{
		
	},
	filters:{
		changeType(val){
			if(val == 'reward'){
				return '奖励'
			}else{
				return '惩罚'
			}
		},
		changeRecruiters(val){
			if(val){
				return val.substring(0,6) + "..."
			}else{
				return ''
			}
		},
		minusSign(val){
            if(val<0){
                return val = -val/100
            }else{
                return val = val/100
            }
		},
		cutOut(val) {
			if(!val){
				return '无'
			}else if(val.length>9){
				return val.substring(0,9) + "..."
			}else{ return val }
		}
	},
    methods: {
		handleClick(data) {
			this.centerDialogVisible = !this.centerDialogVisible
			this.$axios({
					method: 'get',
					url: this.$urls.getRecruiters + data.agencyId
				}).then(res=>{
					this.recruiter = res.data.name
					this.personName = res.data.legal
					this.phone = res.data.phone
				})
		},
		 personalInformations(id) {
			let params = {title:'个人信息',operation:0,type:'personalInformations',id}
			this.$store.dispatch('personalInformations',params)
		 },
		 seeResion(k) {		
			this.specificDisplay1=this.specificDisplay1.map((i,key)=>{
				if(key==k){
					return !i
				}
			})
		 },
		 vanishResion(k) {
			 this.specificDisplay1=this.specificDisplay1.map((i,key)=>{
				if(key==k){
					return false
				}
			})
		 }
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.minW{
    min-width: 30px;
}
.minW50{
    min-width: 60px;
}
.operation{
	color: #4c8aff;;
	cursor: pointer;
}
.seeResion{
	height: 100%;
	// background: red;
	position: relative;
	line-height: 350%;
	cursor: pointer;
	.specificDisplay{
		position: absolute;
		top: 35px;
		left: 60px;
		display: inline-block;
		background: #fff;
		width: 260px;
		height: 80px;
		font-size: 12px;
		text-align: center;
		line-height: 80px;
		border-radius: 6px;
		border: .5px solid #ddd;
		box-shadow: 5px 5px 5px rgba(225, 225, 225, .7);
		z-index: 1000;
	}
	.triangle:before{
		content: '';
        border-bottom: 6px solid #000;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 0;
        position: absolute;
        left: 20px;
        top: -6px;
	}
	.triangle:after{
		content: '';
        border-bottom: 6px solid #fff;
        border-right: 6px solid transparent;
        border-left: 6px solid transparent;
        border-top: 0;
        position: absolute;
        left: 20px;
        top: -6px;
	}
}
.back{
    color: #e45a3c;
}
.line{
	color: #d4d4d4;
}
.null{
	width: 24px;
	height: 1px;
	background-color: #d4d4d4;
	margin: 0 auto;
	line-height: 0;
}
.recruiters{
	.recruitersone{
		width: 255px;
		height: 20px;
		margin: 20px auto;
		font-size: 14px;
		color: #444950;
	}
	.recruiterstwo{
		width: 100px;
		height: 20px;
		margin-left: 72px;
		font-size: 14px;
		color: #444950;
	}
	.recruitersthe{
		width: 200px;
		height: 20px;
		margin-left: 72px;
		margin-top: 20px;
		font-size: 14px;
		color: #444950;
	}
}
</style>
