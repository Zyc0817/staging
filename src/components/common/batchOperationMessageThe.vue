<template>
	<div class="messageWrap batchOperationMessage minHeight">
		<div class="backWrap" :class="{'mt70':batch!='batchOperation'}">
			<div class="txtWrap">
				<div class="label">备注：</div>
				<textarea placeholder="请输入" v-model="obj.txt" maxlength="1000" :class="{'border':borderColor}" @input="writtenLength()"></textarea>
				<div class="txtNum">{{obj.txt.length}}/1000</div>
			</div>
			<div class="promptInformation" v-if="promptShow"><img src="../../assets/img/prompt1.svg" alt=""><span>字数不可超过1000字</span></div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'batchOperationMessage',
	props: ['batch'],
	data () {
		return {
			obj: {
				txt: '',
				checked: false
			},
			borderColor: false,
			promptShow: false
		}
	},
	watch: {

	},
	mounted() {

	},
	methods: {
		init() {
			this.obj.txt = ''
		},
		writtenLength() {
			if(this.obj.txt.length==1000){
				this.promptShow = true
				this.borderColor = true
			}else{
				this.promptShow = false
				this.borderColor = false
			}
		}
	},
}
</script>
<style scoped lang="less">
.minHeight{
	height:206px;
}
.messageWrap{
	.backWrap{
		margin-top:20px;
		.promptInformation{
			height: 17px;
			margin-left: 82px;
			margin-top: 10px;
			img{
				float: left;
				width: 12px;
				height: 12px;
				margin-top: 2.5px;
				margin-right: 5px;
			}
			span{
				font-size: 12px;
				color: #e45a3c;
			}
		}
	}
	.txtWrap{
		overflow:hidden;
		margin:0px 5px 0 30px;
		position:relative;
		.label{
			float:left;
			height: 20px;
			line-height:20px;
			font-size: 14px;
			color: #444950;
		}
		textarea{
			width:390px;
			height:90px;
			font-size:14px;
			border: solid 1px #ececec;
			color: #444950;
			outline:none;
			resize:none;
			padding:5px 10px;
			box-sizing:border-box;
			float:left;
			margin-left:10px;
		}
		textarea::-webkit-input-placeholder{
			font-size: 14px;
			color:#999999;;
		}
		textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
			font-size: 14px;
			color:#999999;
		}
		textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
			font-size: 14px;
			color:#999999;
		}
		textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
			font-size: 14px;
			color:#999999;
		}
		textarea::-webkit-scrollbar{
            display: none;
        }
        textarea::-ms-scrollbar{
            display: none;
        }
        textarea:-ms-scrollbar{
            display: none;
        }
        textarea::-moz-scrollbar{
            display: none;
        }
        textarea:-moz-scrollbar{
            display: none;
        }
		.txtNum{
			position:absolute;
			top: 72px;
			right:40px;
			font-size: 14px;
			color: #999999;
			bottom:5px;
		}
		.border{
			border: solid 1px #e45a3c;
		}
	}
}
</style>