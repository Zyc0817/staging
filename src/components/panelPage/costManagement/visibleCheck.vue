<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">查看复核</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div class="minH">
					<div v-for="(i,k) in dataList" :key="k" class="item">
						<div class="div1 floatL">
							<div class="top">2018-09-20</div>
							<div class="bottom">09：12</div>
						</div>
						<div class="div2 icon-Approval-and-approval floatL"></div>
						<div class="div3 floatL">
							<div class="top">Jeff.Zhang（人事总监-HRD)</div>
							<div class="bottom">请确认加班工时是否有误，为什么多出3h？</div>
						</div>
						<div v-if="dataList.length-1!=k" class="div4"></div>
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
	name: 'visibleCheck',
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			dataList: [1,2]
		}
	},
	mounted () {
		this.show = true
	},
	methods: {
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('visibleCheck')
			}, 200)
		},
		
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
	overflow-y: scroll;
	.fixed{
		width: 360px;
	}
	.floatL{
		float:left;
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
	.minH{
		padding: 30px 20px;
		min-height: calc(100% - 171px);
		.item{
			overflow: hidden;
			height: 109px;
			position: relative;
			margin-bottom: 10px;
			.div1{
				width: 72px;
				color: #444950;
				.top{
					height: 20px;
					line-height: 20px;
					font-size: 14px;
				}
				.bottom{
					font-size: 12px;
					text-align: right;
					height: 17px;
					line-height: 17px;
					margin-top: 4px;
				}	
			}
			.div2{
				color: #4c8aff;
				font-size: 18px;
				margin-left: 20px;
			}
			.div3{
				margin-left: 20px;
				width: 230px;
				.top{
					font-size: 14px;
				}
				.bottom{
					font-size: 12px;
					margin-top: 4px;
				}
			}
			.div4{
				position: absolute;
				height: 80px;
				border-left: 2px dashed #d4d4d4;
				top: 30px;
    			left: 100px;
			}
		}
	}
}
	
</style>