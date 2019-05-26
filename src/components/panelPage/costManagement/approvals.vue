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
						<div v-if="i.state=='creator'" class="center icon-Approval-and-approval"></div>
						<div v-else-if="i.state==''" class="center icon-Approval"></div>
						<div v-else-if="i.state=='pass'" class="center icon-Before-approval"></div>	
						<div v-else-if="i.state=='reject'" class="center icon-Before-approval"></div>	
						<div class="right">
							<p>{{i.approverName}}({{i.approverTitle}})</p>
							<p v-if="i.state=='creator'">发起申请</p>
							<p v-else-if="i.state==''">审批中</p>
							<p v-else-if="i.state=='pass'">审批通过</p>
							<p v-else-if="i.state=='reject'">审批驳回</p>
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
		// this.init()
	},
	mounted () {
		this.show = true
	},
	methods: {
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
                if(this.$store.state.costManagement.approvalsType=='out'){
                    this.$store.dispatch('costApprovals')
                }else{
                    this.$store.dispatch('costApprovals1')
                }
				
			}, 200)
		},
		init() {
			let id = this.$store.state.recruitmentPlan.id
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
				text-align: right;
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