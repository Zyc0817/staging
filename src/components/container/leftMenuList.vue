<template>
	<div class="leftMenuListWrap" :class="{'menu1':!checkTab}">
		<div class="width180" v-if="checkTab">
			<div class="headLeft">
				<div class="title">
					<div class="logo"></div>
					<div class="titleTxt">蓝鸟·云用工</div>
					<div class="logo1 icon-Menu-bar-zoom" @click="checkTab=false"></div>
				</div>
			</div>
			<div class="line"></div>
			<div class="menuList">
				<div class="homepage">
					<router-link class="item" :to="{name:'homePage'}" tag="div">
						<i class="icon-home-page"></i>
						<div @click="toHome">首页</div>
					</router-link>
				</div>
				<div class="menuItem" v-for="(item,key) in menuItem" :key="key" @click="menuHandleClick(key)">
					<div class="item">
						<i :class="item.icon"></i>
						<div class="menuName">{{item.title}}</div>
						<div class="arrowIcon" :class="{'icon-ji1antouarrow483':checkMenu[key],'icon-jiantouarrow483':!checkMenu[key]}"></div>
					</div>
					<div class="childrenWrap">
						<transition name="fade">
							<div v-if="checkMenu[key]" class="fadeWrap">
								<div class="childrenItem" v-for="(a,k) in item.children" :key="k">
									<div @click.stop="childrenItemHandleClick(k)" :class="{selectTag: checkItemMenu[k]}">
										<router-link tag="a" :to="{name:a.name}">{{a.title}}</router-link>
									</div>
									<div class="leftIcon" v-if="checkItemMenu[k]"></div>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</div>
		<div class="width48" v-else>
			<div class="headicon">
				<div class="logo1 icon-Menu-bar-zoom" @click="checkTab=true"></div>
			</div>
			<div class="item">
				<i class="icon-home-page"></i>
			</div>
			<div class="item" v-for="(i,k) in menuItem" :key="k">
				<i :class="i.icon"></i>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'leftMenuList',
	data () {
		return {
			menuItem: [],  //菜单列表
			checkMenu: [],  //一级菜单展开
			checkItemMenu: [], //二级菜单展开
			checkTab: true,
		}
	},
	created() {
		this.menuItem = this.$store.state.menuItem 
		this.checkMenu = this.menuItem.map(i=>{
			this.checkItemMenu = i.children.map(i=>{
				return false
			})
			return false
		})
		this.selectMenu()
	},
	computed:{
		routePath() {
			return this.$route.path
		}
	},
	watch:{
		routePath(val) {
			this.selectMenu()
		}
	},
	methods: {
		menuHandleClick(key) {
			this.checkMenu = this.checkMenu.map((item,i)=>{
				if (item) {
					return false
				}
				if(i == key) {
					this.checkItemMenu = this.checkItemMenu.map(()=>false)
					return true
				}
				return false
			})
			this.menuItem[key].children.forEach((i,k)=>{
				if(this.$route.matched[1]&&i.name==this.$route.matched[1].name){
					this.checkItemMenu[k] = true
					this.checkItemMenu = [].concat(this.checkItemMenu)
				}
			})
		},
		childrenItemHandleClick(k) {
			this.checkItemMenu = this.checkItemMenu.map((item,i)=>{
				if(i == k) {
					return true
				}
				return false
			})
			this.$store.dispatch('advancedSearchParams',{})
		},
		toHome() {
			this.checkMenu = this.checkMenu.map(()=>{
				return false;
			})
		},
		selectMenu() {
			this.checkMenu = this.menuItem.map(i=>{
				this.checkItemMenu = i.children.map(i=>{
					return false
				})
				return false
			})
			for(let i=0;i<this.menuItem.length;i++){
				for(let j=0;j<this.menuItem[i].children.length;j++) {
					if (this.$route.matched[1]&&this.menuItem[i].children[j].name == this.$route.matched[1].name) {
						this.checkItemMenu[j] = true
						this.checkMenu[i] = true
						this.checkItemMenu = [].concat(this.checkItemMenu)
						this.checkMenu = [].concat(this.checkMenu)
					}
				}
			}
			
		}
	}
}
</script>
<style scoped lang="less">
	.width48{
		.headicon{
			height:51px;
			border-bottom: 1px solid #ececec;
			padding:19px 17px;
			box-sizing: border-box;
			.logo1{
				color: #4C8AFF;
				font-size: 14px;
			}
		}
		.item{
			margin-top: 26px;
			overflow: hidden;
			i{
				float:left;
				font-size:18px;
				text-indent:15px;
			}
		}
	}
	.leftMenuListWrap{
		width:180px;
		height:100%;
		background-color:#fff;
		transition: all .3s;
		overflow: hidden;
		.headLeft{
			width:180px;
			.logo{
				background: url('../../assets/img/logo@3x.png') no-repeat;
				background-size: 100% 100%;
				width: 24px;
				height: 20px;
				float:left;
				margin:15px 0 0 15px;
			}
			.logo1{
				float:right;
				margin:19px 15px 0 0;
				color: #4C8AFF;
				font-size: 14px;
			}
			.title{	
				height:50px;
				overflow:hidden;
				.titleTxt{
					height:17px;
					line-height:17px;
					text-align:center;
					font-size:12px;
					color:#444950;
					background-color:#fff;
					float:left;
					margin:17px 0 0 10px;
				}
				
			}
		}
		.line{
			height:1px;
			background-color:#ececec;
		}
		.menuList{
			background-color:#fff;
			width: 180px;
			.homepage{
				font-size:14px;
				color:#444950;
				.item{
					padding: 20px 0 10px 0;
					overflow: hidden;
					i{
						float:left;
						font-size:18px;
						text-indent:15px;
					}
					height:20px;
					line-height:20px;
					text-indent:15px;
					cursor:pointer;
				}
			}
			.menuItem{
				font-size:14px;
				color:#444950;
				.item{
					padding:15px 0 10px 0;
					overflow: hidden;
					i{
						float:left;
						font-size:18px;
						text-indent:15px;
					}
					.menuName{
						float:left;
					}
					height:20px;
					line-height:20px;
					text-indent:15px;
					cursor:pointer;
					.arrowIcon{
						font-size: 10px;
						float:right;
						margin: 5px 15px 0 0;
					}
					.active{
						transform:rotate(180deg);
						transition: all .3s;
						-webkit-transition: all .3s;
						-webkit-transform:rotate(180deg);
					}

				}
				.childrenWrap{
					background-color:#EAF3FE;
					.fade-enter-active, .fade-leave-active{
						overflow:hidden;
						max-height: 300px;
					    transition: max-height 1s;
					    -webkit-transition: max-height 1s;
					}
					.fade-enter, .fade-leave-to{
						overflow:hidden;
					  	max-height: 0px;
					  	transition: max-height .5s;
					    -webkit-transition: max-height .5s;
					}
				}
				.childrenItem{
					height:35px;
					line-height:35px;
					text-indent:48px;
					font-size:14px;
					cursor:pointer;
					position:relative;
					div a{
						color:#666;
						display: block;
					}
					.selectTag a{
						color:#4C8AFF;
					}
					.leftIcon{
						width:4px;
						height:22px;
						background-color:#4C8AFF;
						position:absolute;
						top:5px;
						left: 0
					}
				}
				.childrenItem:last-child{
					padding-bottom:7.5px;
				}
				.childrenItem:first-child{
					padding-top:7.5px;
				}
				.childrenItem:first-child .leftIcon{
					top: 12.5px;
				}
			}
		}
	}
	.menu1{
		width: 48px;
		
	}
</style>