<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">个人中心</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div class="minH personal">
					<div class="head">
						<img v-if="!imgDataUrl" src="../../../assets/img/head@3x.svg" @click="toggleShow" alt="">
						<img v-else :src="imgDataUrl" @click="toggleShow" alt="">
					</div>	
					<div class="wrap">
						<div class="item">
							<div class="left">姓名：</div>
							<div class="right">{{name}}</div>
						</div>
						<div class="item">
							<div class="left">岗位：</div>
							<div class="right">{{postName}}</div>
						</div>
						<div class="item">
							<div class="left">手机号：</div>
							<div class="right">{{phone|phoneNumber}}</div>
						</div>
						<div class="item">
							<div class="left">登录账号：</div>
							<div class="right">{{account}}</div>
						</div>

						<!-- <div v-if="!update">
							<div class="item">
								<div class="left">语言：</div>
								<div class="right" v-if="lang=='zh_cn'">简体中文</div>
								<div class="right" v-else>English</div>
							</div>
							<div class="item">
								<div class="left">接收邮箱提醒：</div>
								<div class="right" v-if="emailState=='enable'">开启</div>
								<div class="right" v-else>关闭</div>
							</div>
						</div> -->
						
						<div>
							<div class="item">
								<div class="left1">语言：</div>
								<div class="right1">
									<el-select v-model="lang" placeholder="请选择">
										<el-option 
											v-for="(i,k) in languageList"
											:key="k"
											:value="i.id"
											:label="i.name"></el-option>
									</el-select>
								</div>
							</div>
							<div class="item1">
								<div class="left">接收邮箱提醒：</div>
								<div class="right">
									<el-switch
										:width="35"
										v-model="emailState"
										active-value="enable"
										inactive-value="disable"
										active-color="#4c8aff"         
										>
									</el-switch>
								</div>
								<div class="clear"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="subBtnWrap">
					<div class="subBtn" @click="submit">确定</div>
					<div class="resetBtn" @click="cancel">关闭</div>
				</div>
				<my-upload field="file"
					@crop-success="cropSuccess"
					@crop-upload-success="cropUploadSuccess"
					@crop-upload-fail="cropUploadFail"
					v-model="show1"
					:noSquare='true'
					:width="300"
					:height="300"
					:url="action"
					:headers="uploadHeader"
					img-format="png"></my-upload>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
import myUpload from 'vue-image-crop-upload'
import _ from 'lodash'
export default {
	name: 'personal',
	props:['orderInit'],
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			update: false,
			languageList: [{name:'简体中文',id:'zh_cn'},{name: 'English',id:'en_us'}],
			switchBtn1: false,
			name: '',
			phone: '',
			account: '',
			lang: '',
			emailState: '',
			id: '',
			postName: '',
			show1: false,
			imgDataUrl: '',
			action: this.$baseApi + this.$urls.singlefile,
		}
	},
	filters:{
		phoneNumber(val) {
			return val.substring(0,3) + '-' + val.substring(3,7) + '-' + val.substring(7,11)
		}
	},
	created() {
		this.init()
	},
	mounted () {
		this.show = true
	},
	methods: {
		toggleShow() {
			this.show1 = !this.show1;
		},
		cropSuccess(imgDataUrl, field){
			this.imgDataUrl = imgDataUrl;
		},
		cropUploadSuccess(jsonData, field){
	
		},
		cropUploadFail(status, field){
			
		},
		init() {
			this.$axios({
                method: 'get',
                url:this.$urls.getHomePersonal
            })
            .then(res=>{      
                if(res.data.status==200) {
					this.name = _.get(res,'data.statistics.user.name','')
					this.phone = _.get(res,'data.statistics.user.phone','')
					this.account = _.get(res,'data.statistics.user.account','')
					this.lang = _.get(res,'data.statistics.user.lang','')
					this.emailState = _.get(res,'data.statistics.user.emailState','')
					this.id = _.get(res,'data.statistics.user.id','')
					this.postName = _.get(res,'data.statistics.postName','')
					this.imgDataUrl = res.data.statistics.user.avatar
				}
            })
            .catch(e=>{
                
            })
		},
		submit() {
			this.$axios({
                method: 'put',
				url:this.$urls.savePersonal,
				data:{
					id: this.id,
					lang:this.lang,
					emailState:this.emailState,
					avatar:this.imgDataUrl
				}
            })
            .then(res=>{      
                if(res.data.status==200) {
					this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
					})
					this.cancel()
					this.orderInit()
				}else{
					this.$message({
                        message: res.data.message||"操作失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
				}
            })
            .catch(e=>{
                
            })
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('personal')
			}, 200)
		},
		
	},
	components:{
        'my-upload': myUpload
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
	.minH{
		padding: 50px 0 0 57px;
		min-height: calc(100% - 185px);
		.head{
			width: 120px;
			height: 120px;
			margin-left: 84px;
			overflow: hidden;
			border-radius: 50%;
			img{
				width: 100%;
			}
		}
		.wrap{
			margin-top: 50px;
			.clear{
				clear: both;
			}
			.item1{
				font-size: 14px;
				color: #666666;
				margin-bottom: 24px;
				.left{
					height: 20px;
					line-height: 20px;
					float: left;
					width: 108px;
				}
				.right{
					height: 20px;
					float: left;
				}
			}
			.item{
				overflow: hidden;
				font-size: 14px;
				color: #666666;
				margin-bottom: 24px;
				.left1{
					height: 30px;
					line-height: 30px;
					float: left;
					width: 108px;
				}
				.right1{
					float: left;
					width: 180px;
				}
				.left{
					height: 20px;
					line-height: 20px;
					float: left;
					width: 108px;
				}
				.right{
					height: 20px;
					line-height: 20px;
					float: left;
				}
				.right2{
					float: left;
					font-size: 12px;
					color: #4c8aff;
					margin-left: 10px;
					cursor: pointer;
				}
			}
		}
	}
	.subBtnWrap{
		height:57px;
		width:100%;
		border-top:1px solid #ececec;
		.subBtn,.resetBtn{
			float:left;
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			background-color: #4c8aff;
			border-radius: 14.5px;
			color:#fff;
			text-align:center;
			font-size:12px;
			margin:15px 0 0 90px;
			border:1px solid #4c8aff;
			cursor:pointer;
		}
		.resetBtn{
			color:#4c8aff;
			background-color: #fff;
			border:1px solid #4c8aff;
			cursor:pointer;
			margin:15px 0 0 60px;
		}
	}
}
	
</style>