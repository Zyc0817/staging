<template>
	<div class="headerWrap">
		<div class="title">{{$store.state.hotalName}}</div>
		<div class="rightArea">
			<div class="headPortraitWrap">
				<div class="headPortrait" @mouseover="menuShow=true" @mouseleave="menuShow=false">
					<img v-if="!avatar" src="../../assets/img/head@3x.svg" alt="">
					<img v-else :src="avatar" alt="">
					<div class="menu" ref="menu" v-if="menuShow" @mouseleave="menuShow=false">
						<div class="fd"></div>
						<div class="div1" @click="personal">个人中心</div>
						<div class="div2"></div>	
						<div class="div1" @click="dialogVisible=true">修改密码</div>
						<div class="div2"></div>	
						<div class="div3" @click="logout">
							<div class="img"></div>
							<div class="name">退出</div>
						</div>
					</div>
				</div>
			</div>
			<div class="iconWrap">
				<div class="iconLine"></div>
				<div class="icon icon-Mobile-terminal"></div>
				<div class="iconLine"></div>
				<div class="icon icon-Customer-service"></div>
				<div class="iconLine"></div>
				<div class="icon icon-notice"></div>	
			</div>
			
		</div>
		<Personal v-if="$store.state.personal" :order-init="init"></Personal>
		<el-dialog
            title="修改密码"
            :visible.sync="dialogVisible"
            width="530px"
            top="30.3vh">
            <div class="body">
				<div class="wrap inputHeight30">
					<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="medium">
						<div class="mb24 height30">
                            <el-form-item label="当前密码：" prop="resetPassword">
                                <el-input v-model="form.resetPassword" type="password" placeholder="请输入当前登录密码"></el-input>
                            </el-form-item>
						</div>
						<div class="mb24 height30">
                            <el-form-item label="新密码：" prop="newPassword">
                                <el-input v-model="form.newPassword" type="password" placeholder="新密码和当前密码不能相同"></el-input>
                            </el-form-item>
						</div>
						<div class="mb24 height30">
                            <el-form-item label="确认密码：" prop="newPassword1">
                                <el-input v-model="form.newPassword1" type="password" placeholder="确认密码和新密码保持一致"></el-input>
                            </el-form-item>
						</div>
					</el-form>   
				</div>
			</div>
            <div class="dialogBtn">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>
import Cookie from 'js-cookie'
import Personal from '../panelPage/homePage/personal'
export default {
	name: 'headComponent',
	data () {
		let checknewPassword = (rule, value, callback)=>{
			if(!value){
				return callback(new Error('请输入新密码'))
			}else{
				if(value.length<8){
					return callback(new Error('密码至少由8位字符组成'))
				}else if(value==this.form.resetPassword){
					return callback(new Error('新密码与旧密码不能一致'))
				}else if(this.form.newPassword1&&value!=this.form.newPassword1){
					return callback(new Error('确认密码与新密码不一致'))
				}else{
					callback()
				}
			}
		}
		let checknewPassword1 = (rule, value, callback)=>{
			if(!value){
				return callback(new Error('请确认新密码'))
			}else{
				if(value!=this.form.newPassword){
					return callback(new Error('确认密码与新密码不一致'))
				}else{
					callback()
				}
			}
		}
		return {
			menuShow: false,
			avatar: '',
			dialogVisible: false,
			form:{
				newPassword: '',
				newPassword1: '',
				resetPassword: '',
			},
			rules: {
				resetPassword: [
					{required: true,message: '请输入当前密码'}
				],
				newPassword: [
					{ required: true, validator: checknewPassword, trigger: 'blur' },
				],
				newPassword1: [
					{ required: true, validator: checknewPassword1, trigger: 'blur' },
                ],
			},
		}
	},
	watch:{
		dialogVisible(val) {
			if(!val){
				this.form.newPassword = ''
				this.form.newPassword1 = ''
				this.form.resetPassword = ''
				this.$refs.form.resetFields();
			}
		}
	},
	created() {
		this.init()
	},
	mounted() {
		document.addEventListener('click',(e)=>{
			if(this.$refs.menu&&!this.$refs.menu.contains(e.target)){
				this.menuShow = false
            }
		})
	},
	methods:{
		sure() {
			this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$axios({
						method: 'post',
						url:this.$urls.updPassword,
						data:{
							account:localStorage.getItem('account'),
							newPassword: this.form.newPassword,
							resetPassword: this.form.resetPassword
						}
					})
					.then(res=>{      
						if(res.data.status==200){
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 5 * 1000
							})
							this.dialogVisible=false
						}else{
							this.$message({
								message: res.data.message||'操作失败',
								type: 'error',
								duration: 5 * 1000
							})
						}
					})
					.catch(e=>{
						
					})
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
			
		},
		logout() {
			localStorage.removeItem('menuList')
			localStorage.removeItem('hotalId')
			localStorage.removeItem('hotalName')
			localStorage.removeItem('departmentId')
			localStorage.removeItem('userId')
			sessionStorage.removeItem('redirectUrl')
			localStorage.removeItem('account')
			Cookie.remove('token')
			window.location.href = window.location.href.split('#')[0]
		},	
		personal() {
			this.$store.dispatch('personal')
		},
		init() {
			this.$axios({
                method: 'get',
                url:this.$urls.getHomePersonal
            })
            .then(res=>{      
                if(res.data.status==200) {
					this.avatar = res.data.statistics.user.avatar
				}
            })
            .catch(e=>{
                
            })
		},
	},
	components: {
        Personal
    }
}
</script>
<style scoped lang="less">
.body{
	padding-top: 50px;
	height: 259px;
	.wrap{
		width: 360px;
		margin: 0 auto;
		.height30{
            height: 30px;
		}
		.mb24{
            margin-bottom: 20px;
        }
	}
}
.dialogBtn{
	left: 155px;
}
.headerWrap{
	flex:1;
	border-left:1px solid #ececec;
	height:50px;
	background-color:#fff;
	.title{
		height: 17px;
		line-height: 17px;
		float:left;
		color: rgba(102, 102, 102, 1);
		font-size: 12px;
		padding:16px 0 0 20px;
	}
	.rightArea{
		float:right;
		height:100%;
		position: relative;
		.menu{
			position: absolute;
			width: 120px;
			height: 152px;
			background-color: #ffffff;
			box-shadow: 0px 0px 10px 2px rgba(68, 73, 80, 0.15);
			right:10px;
			top: 55px;
			cursor: pointer;
			z-index: 9;
			.fd{
				height: 50px;
				width: 60px;
				position: absolute;
				top: -49px;
				left: 60px;
			}
			.div1{
				padding: 15px 0;
				text-align: center;
				font-size: 14px;
				color: #666666;
				height: 50px;
				box-sizing: border-box;
			}
			.div2{
				width: 90px;
				height: 1px;
				background-color: #ececec;
				margin: 0 auto;
			}
			.div3{
				height: 50px;
				box-sizing: border-box;
				padding: 15px 35px;
				text-align: center;
				font-size: 14px;
				color: #666666;
				overflow: hidden;
				.img{
					float: left;
					background: url("../../assets/img/homepage/12.svg") no-repeat;
					width: 12px;
					height: 14px;
					margin-top: 3px;
					margin-right: 10px;
				}
				.name{
					float: left;

				}
			}
		}
		.headPortraitWrap{
			width:74px;
			height:100%;
			float:right;
			.headPortrait{
				width:34px;
				height:34px;
				border-radius:50%;
				float:right;
				margin:8px 30px 0 0;
				overflow: hidden;
				img{
					width: 100%;
				}
				
			}
		}
		.line{
			float:right;
			width: 3px;
			height:100%;
			background-color:rgba(244, 248, 252, 1);
		}
		.iconWrap{
			float:right;
			height:100%;
			.icon{
				float:right;
				width:15px;
				height:23px;
				font-size:18px;
				margin:17px 23px 0 0;
			}
			.iconLine{
				float:right;
				width:1px;
				height:20px;
				margin:17px 20px 0 0;
				background-color:#e4e4e4;
			}
		}
	}		
}
</style>