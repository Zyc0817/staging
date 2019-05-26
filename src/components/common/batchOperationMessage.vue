<template>
	<div class="messageWrap batchOperationMessage minHeight">
		<div class="radioWrap" v-if="batch=='batchOperation'">
			<div class="div1">
				<el-radio v-model="obj.radio" label="1">审批</el-radio>
			</div>
			<div class="div2">
				<el-radio v-model="obj.radio" label="2">退回</el-radio>
			</div>
		</div>
		<div class="txt" v-if="obj.radio==1">确认审批通过所选的用工申请吗？</div>
		<div class="backWrap" v-else :class="{'mt70':batch!='batchOperation'}">
			<div class="txtWrap">
				<div class="label">退回原因：</div>
				<textarea placeholder="请输入" v-model="obj.txt"></textarea>
				<div class="txtNum">{{obj.txt.length}}/1000</div>
			</div>
			<div class="checkWrap">
				<el-checkbox v-model="obj.checked">退回后重新提交的{{title}}直接由我审批</el-checkbox>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'batchOperationMessage',
	props: ['batch','txtName'],
	data () {
		return {
			obj: {
				radio: this.batch == 'batchOperation' ? '1' : '2',
				txt: '',
				checked: false,
				
			},
			title: '用工申请'
		}
	},
	watch: {
		batch() {
			if (this.batch == 'batchOperation') {
				this.obj.radio = '1'
			} else {
				this.obj.radio = '2'
			}
		}
	},
	created() {
		if(this.txtName) {
			this.title = this.txtName
		}
	},
	mounted() {

	},
	methods: {
		returnMsg() {
			if (this.obj.txt.length>1000) {
				this.$message({
					message: "退回原因不能超过1000字",
					type: 'error',
					duration: 5 * 1000
				})
				return ""
			}
			return this.obj
		},
		init() {
			this.obj.txt = ''
			this.obj.batch = '0'
		}
	},
}
</script>
<style scoped lang="less">
.minHeight{
	min-height:209px;
}
.messageWrap{
	.radioWrap{
		overflow:hidden;
		width: 286px;
		margin:0 auto;
		margin-top:40px;
	}
	.div1{
		float:left;
	}
	.div2{
		float:right;
	}
	.txt{
		font-size: 14px;
		color: #444950;
		margin-top:50px;
		text-align:center;
	}
	.backWrap{
		margin-top:20px;
		.checkWrap{
			width: 236px;
			margin-left: 85px;
			margin-top: 10px;
		}
	}
	.mt70{
		padding-top: 30px;
	}
	.txtWrap{
		overflow:hidden;
		margin:0px 5px 0 5px;
		position:relative;
		.label{
			float:left;
			height: 20px;
			line-height:20px;
			font-size: 14px;
			color: #444950;
		}
		textarea{
			width:330px;
			height:90px;
			font-size:12px;
			border: solid 1px #ececec;
			color: #999999;
			outline:none;
			resize:none;
			padding:5px 10px;
			box-sizing:border-box;
			float:left;
			margin-left:10px;
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
			right:10px;
			font-size: 12px;
			color: #999999;
			bottom:5px;
		}
	}
}
</style>