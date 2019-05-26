<template>
	<div class="messageWrap batchOperationMessage minHeight">
		<div class="backWrap" :class="{'mt70':batch!='batchOperation'}">
			<div class="txtWrap">
				<div class="label">辞退原因：</div>
				<textarea placeholder="请输入" v-model="obj.txt" maxlength="1000" :class="{'bordercolor':promptShow}" @input="writeResion"></textarea>
				<div class="txtNum">{{obj.txt.length}}/1000</div>
				<span></span>
			</div>
			<div class="promptInformation" v-if="promptShow"><img src="../../assets/img/prompt1.svg" alt=""><span>字数不可超过1000字</span></div>
			<div class="checkWrap">
				<el-checkbox v-model="obj.checked"><span style="color:#666666;font-weight:normal;">加入黑名单</span></el-checkbox>
                <div class="prompt"><img src="../../assets/img/prompt1.svg" alt=""><span>加入黑名单后，该员工将不会再为公司服务，后期可以从黑名单中移除</span></div>
			</div>
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
			promptShow: false
		}
	},
	watch: {

	},
	mounted() {

	},
	methods: {
		writeResion() {
			if(this.obj.txt.length==1000){
				this.promptShow = true
			}else if(this.obj.txt.length==0||this.obj.txt.length<1000){
				this.promptShow = false
			}
		},
		init() {
			this.obj.txt = ''
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
		.checkWrap{
			margin-left: 85px;
            margin-top: 10px;
            .prompt{
                margin-top: 5px;
                img{
                    float: left;
                    width: 12px;
                    height: 12px;
                    margin-top: 2px;
                    margin-right: 5px;
                }
                span{
                    font-size: 12px;
                    color: #999999;
                }
            }
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
		.bordercolor{
			border-color: #e45a3c;
		}
		.txtNum{
			position:absolute;
			right:35px;
			font-size: 14px;
			color: #999999;
			bottom:5px;
		}
	}
}
</style>