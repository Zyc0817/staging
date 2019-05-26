<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">审批进度</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div class="progressWrap">
					<div class="progressItem" v-for="(i,k) in progressList" :key="k">
						<div class="left">
							<p>{{$base.formattingTime(i.createTime,'-')}}</p>
							<p>{{$base.formattingHover(i.createTime)}}</p>
						</div>
						<div v-if="i.workflowNode==1" class="center icon-Approval-and-approval"></div>
						<div v-else-if="!i.workflowNode" class="center icon-Approval"></div>
						<div v-else-if="i.workflowNode==1" class="center icon-Before-approval"></div>	
						<div v-else-if="i.workflowNode==2" class="center icon-Before-approval"></div>
						<div class="right">
							<p>Bill(总经理)</p>
							<p v-if="i.workflowNode==0">发起申请</p>
							<p v-else-if="!i.workflowNode">审批中</p>
							<p v-else-if="i.workflowNode==1">审批通过</p>
							<p v-else-if="i.workflowNode==2">审批驳回</p>
							<p v-if="$store.state.recruitmentPlan.isRecord=='record'">
								<span>8人</span>
								<span class="span1"></span>
								<span>7人</span>	
							</p>
							<p v-if="$store.state.recruitmentPlan.isRecord=='record'">原因：7个人足够了</p>
						</div>
						<div class="dashedLine" v-if="k!=progressList.length-1"></div>
					</div>
				</div>
				<div class="btn">
					<div @click="cancel">关闭</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'approvals',
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			progressList: []
		}
	},
	created() {
		this.init()
	},
	mounted () {
		this.show = true
	},
	methods: {
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('detailApprovalsShow')
			}, 200)
		},
		init() {
			let id = this.$store.state.recruitmentPlan.id
			console.log(id)
			if (id) {
				this.$axios({
					method: 'get',
					url:this.$urls.getWorkflow,
					params: {id}
				})
				.then(res=>{
					console.log(res)
					this.progressList = res.data
				})
				.catch(e=>{
					this.$message({
						message: e.data.message || "加载失败",
						type: 'error',
						duration: 5 * 1000
					})
				})	
			}
		}
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
	width:400px;
	overflow-y:scroll;
	.fixed{
		width: 360px;
	}
	.btn{
		height:57px;
		border-top:1px solid #ececec;
		cursor:pointer;
		div{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			background-color: #fff;
			border-radius: 14.5px;
			color:#4c8aff;
			font-size: 12px;
			text-align:center;
			margin:15px auto;
			border:1px solid #4c8aff;
		}
	}
	.progressWrap{
		width:266px;
		margin:0 auto;
		margin-top:50px;
		min-height:calc(100% - 161px);
		.progressItem{
			height:123px;
			position:relative;
			div{
				float:left;
			}
			.left{
				width: 82px;
				p:nth-of-type(1){
					height: 20px;
					line-height:20px;
					font-size: 14px;
					color: #444950;
				}
				p:nth-of-type(2){
					height:17px;
					line-height:17px;
					font-size: 12px;
					color: #444950;
					text-align:right;
					margin-top:5px;
				}
			}
			.center{
				font-size: 18px;
				margin-left:20px;
			}
			.icon-Approval-and-approval {
				color: #4c8aff;
			}
			.icon-Approval {
				color: #fab334;
			}
			.right{
				margin-left:20px;
				p:nth-of-type(1){
					height: 20px;
					line-height:20px;
					font-size: 14px;
					color: #444950;
				}
				p:nth-of-type(2){
					height: 17px;
					line-height:17px;
					color: #444950;
					font-size: 12px;
					margin-top:5px;
					font-size: 14px;
				}
				p:nth-of-type(3){
					font-size: 14px;
					color: #444950;
					margin-top:10px;
					.span1{
						display:inline-block;
						background: url('../../../assets/img/logo.png') no-repeat -242px -102px;
						width: 13px;
						height: 10px;
						margin:0 10px;
					}
				}
				p:nth-of-type(4){
					font-size: 12px;
					color: #444950;
					margin-top:5px;
				}
			}
			.dashedLine{
				position:absolute;
				height:80px;
				width:1px;
				border-left:1px dashed #d4d4d4;
				box-sizing:border-box;
				top: 30px;
    			left: 111px;
			}
		}
	}
	
}
	
</style>