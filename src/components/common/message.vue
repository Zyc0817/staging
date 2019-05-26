<template>
	<div class="body">
		<div class="div1">
			<el-radio v-model="radio" label="disable" @change="selectChange">停用</el-radio>
		</div>
		<div class="div2">
			<el-radio v-model="radio" label="enable" @change="selectChange">启用</el-radio>
		</div>
		<div class="txt">确认{{txt}}所选的岗位吗？</div>
	</div>
</template>
<script>
export default {
	name: 'message',
	props: ['batchoperationArr'],
	data () {
		return {
			radio: 'disable',
			txt: '停用'
		}
	},
	mounted () {
		
	},
	methods: {
		selectChange() {
			if (this.radio == 'disable') {
				this.txt = '停用'
			} else {
				this.txt = '启用'
			}
		},
		returnMsg() {
			return this.radio
		},
		init() {
			this.radio = "disable"
			this.txt= "停用"
		}
		
	},
}
</script>
<style scoped lang="less">
.body{
	width:208px;
	height:100px;
	margin:0px auto;
	margin-top: 50px;
	.div1{
		float:left;
	}
	.div2{
		float:right;
	}
	.txt{
		float:left;
		width:100%;
		text-align:center;
		font-size: 14px;
		color: #444950;
		margin-top:30px;
	}
}
</style>