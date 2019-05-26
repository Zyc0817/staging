<template>
	<div class="messageWrap adjustNumberMessage minHeight">
		<div class="div1">原申请人数： {{applications}}人</div>
		<div v-if="index==1">
			<div class="div1">调整后人数： {{obj.num1+obj.num2}}人</div>
			<div class="div3">
				<div class="wrap">
					男员工人数:
					<el-input-number size="mini" v-model="obj.num1" :min="0"></el-input-number>
					女员工人数: 
					<el-input-number size="mini" v-model="obj.num2" :min="0"></el-input-number>
				</div>
			</div>
		</div>
		<div class="div1 mt30" v-else>
			调整后人数： 
			<el-input-number size="mini" v-model="obj.num" :min="0"></el-input-number>
		</div>
		<div class="div2">
			<div class="label">调整原因：</div>
			<textarea placeholder="请输入" v-model="obj.txt"></textarea>
			<div class="txtNum">{{obj.txt.length}}/200</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'adjustNumberMessage',
	props: ['applications','index','man','women'],
	data () {
		return {
			obj: {
				num: this.applications,  // 调整后人数
				txt: '',
				num1: this.man,  // 男
				num2: this.women,  // 女
			}		
		}
	},
	watch: {
		applications(val) {
			this.obj.num = val
		}
	},
	methods: {
		returnMsg() {
			return this.obj
		},
		init() {
			this.obj.txt = ''
			this.obj.num = 0
			this.obj.num1 = 0
			this.obj.num2 = 0
		},
		setdate(orderDetail) {
			if(orderDetail.comments){
				this.obj.txt = orderDetail.comments
			}
			if(orderDetail.totalCount){
				this.obj.num = orderDetail.totalCount
			}
			if(orderDetail.orderAdd&&(orderDetail.orderAdd[0].total||orderDetail.orderAdd[1].total)){
				orderDetail.orderAdd.forEach(i=>{
					if(i.gender=='male'){
						this.obj.num1 = i.total
					}else{
						this.obj.num2 = i.total
					}
				})
			}
		}
	},
}
</script>
<style scoped lang="less">
.minHeight{
	min-height:348px;
}
.messageWrap{
	text-align:left;
	padding-top: 10px;
	.div1{
		height: 20px;
		line-height:20px;
		margin:30px 15px 0 15px;
		font-size: 14px;
		color: #444950;
	}
	.mt30{
		margin-top:30px;
	}
	.div2{
		overflow:hidden;
		margin:30px 15px;
		position:relative;
		.label{
			float:left;
			height: 20px;
			line-height:20px;
			font-size: 14px;
			color: #444950;
		}
		textarea{
			width:380px;
			height:90px;
			font-size:12px;
			border: solid 1px #ececec;
			color: #999999;
			outline:none;
			resize:none;
			padding:5px 10px;
			box-sizing:border-box;
			float:left;
			margin-left:22px;
		}
		textarea::-webkit-input-placeholder{
			color:#999999;;
		}
		textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
			color:#999999;
		}
		textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
			color:#999999;
		}
		textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
			color:#999999;
		}
		.txtNum{
			position:absolute;
			right:30px;
			font-size: 12px;
			color: #999999;
			bottom:5px;
		}
	}
	.div3{
		.wrap{
			margin-top: 10px;
			margin-left:104px;
		}
	}
	
}
</style>