<template>
  <div id="app">
    <router-view></router-view> 
  </div>
</template>

<script>
export default {
	name: 'App',
	created() {
		let hotalId = localStorage.getItem('hotalId'),
			hotalName = localStorage.getItem('hotalName')	
		if(hotalId) {
			this.$store.dispatch('setHotal',{id:hotalId,name:hotalName})
		}
	},
	methods:{

	}
}
</script>


<style lang="less">

@import './assets/css/style.css';
body{
	min-width: 1200px;
	// user-select:none;
	// -moz-user-select:none;/*火狐*/
	// -webkit-user-select:none;/*webkit浏览器*/
	// -ms-user-select:none;/*IE10*/
	// font-family: PingFangSC-Regular, sans-serif;
}
#printJS{
	border: 0;
}
#app {
	height:100%;
	.has-gutter{
		height:66px;
	}
	.dataListNull{
		text-align: center;
		margin-top: 191px;
		img{
			width: 140px;
			height: 100px;
		}
		p{
			font-size: 14px;
			color: #999999;
			margin-top: 20px;
		}
	}
	.calendar{			
		.ve-calendar{
			border: none;
			box-shadow: 0 0 0 0 #fff;
			-webkit-box-shadow: 0 0 0 0 #fff;
			.week-title{
				border: 1px solid #ececec;
				border-top: 2px solid #4c8aff;
				background-color: #f4f8fc;
				box-sizing: border-box;
				.title-grid{
					height: 44px;
					line-height: 44px;
				}
			}
			.day-grid.mini{
				height: 54px;
				border-top: 1px solid #fff;
				border-left: 1px solid #fff;
				border-bottom: 1px solid #ececec;
				border-right: 1px solid #ececec;
				border-radius: 0;
				box-sizing: border-box;
				background-color: #fff;
			}
			.day-grid.disabled{
				color: #999;
			}
			.ve-button:hover{
				background-color: #fff;
			}
			.day-grid.mini:hover{
				border-top: 1px solid #fff;
				border-left: 1px solid #fff;
				border-bottom: 1px solid #ececec;
				border-right: 1px solid #ececec;
				box-sizing: border-box;
			}
			.today{
				border: none;
			}
			.header{
				position: relative;
				height: 26px;
				.today{
					display: none;
				}
				.last{
					position: absolute;
					left: 14px;
					margin-left: 0;
					i{
						font-size: 18px;
					}
				}
				.next{
					position: absolute;
					right: 4px;
				}
				.month{
					// position: absolute;
					z-index: 1;
					font-size: 18px;
					font-weight: normal;
					margin-top: -4px;
					.dropdown.mini{
							font-size: 18px;
							font-weight: normal;
					}
					.dropdown.mini:hover .dropdown-content{
							display: none;
					}
				}
				.year{
					left: 214px;
					height: 25px;
					input.ve-year.mini{
						height: 25px;
						line-height: 25px;
						font-size: 18px;
						font-weight: normal;
						text-align: center;
						width: 70px;
					}
					input::-webkit-outer-spin-button,
					input::-webkit-inner-spin-button{
						-webkit-appearance: none !important;
    					margin: 0;
					}
					input[type="number"]{-moz-appearance:textfield;}
					span{
						display: none
					}
				}
			}
			.body{
				.days{
					border-left: 1px solid #ececec;	
					.days-line{
						border-bottom: 1px solid
					}	
				}
				.day-grid.selected{
					background-color: #fff7f5;
				}
				.day-number{
					font-weight: normal;
				}
				.day-grid{
					position: relative;
				}
				.day-rest.mini{
					position: absolute;
					width: 14px;
					height: 14px;
					left: 2px;
					top: 2px;
				}
				.day-rest-append{
					display: none;
				}
			}
		}
	}
	.vue-image-crop-upload .vicp-wrap{
		height: 340px;
		padding: 0;
		padding-left: 20px;
		padding-right: 20px;
		.vicp-step1{
			margin-top: 71px;
			.vicp-drop-area{
				background-color: #f4f8fc;
				.vicp-icon1{
					width: 30px;
					height: 30px;
				}
			} 
			.vicp-operate{	
				// position: static;
				overflow: hidden;
				right: 255px;
				a{
					width: 90px;
					height: 30px;
					background-color: #ffffff;
					border-radius: 100px;
					border: solid 1px #4c8aff;
					box-sizing: border-box;
					line-height: 30px;
					color: #4c8aff;
					margin-left: 0;
					
				}
				.vicp-operate-btn{
					margin-left: 60px;
					background-color: #4c8aff;
					color: #fff;
					margin-right: 160px;
				}
			}
		}
		.vicp-step2{
			.vicp-operate{	
				// position: static;
				overflow: hidden;
				a{
					width: 90px;
					height: 30px;
					background-color: #ffffff;
					border-radius: 100px;
					border: solid 1px #4c8aff;
					box-sizing: border-box;
					line-height: 30px;
					color: #4c8aff;
					margin-left: 0;
					
				}
				.vicp-operate-btn{
					margin-left: 60px;
					background-color: #4c8aff;
					color: #fff;
					margin-right: 160px;
				}
			}
		}
		.vicp-step2 .vicp-crop{
			padding: 54px 50px 0 50px;
			.vicp-crop-left .vicp-range{
				margin: 12px 0 10px 0;
				.vicp-icon5,
				.vicp-icon6{
					background-color: #fff;
					border: 1px solid #ececec;
					width: 16px;
					height: 16px;
				}
				.vicp-icon5::before,
				.vicp-icon6::before{
					background-color: #666666;
					width: 9px;
					height: 1px;
					top: 7.5px;
    				left: 3.5px;
				}
				.vicp-icon6::after{
					background-color: #666666;
					width: 1px;
					height: 9px;
					top: 3.5px;
    				left: 7.5px;
				}
			}
			.vicp-crop-right{
				margin-top: 31px;
			}
			
		}
		.vicp-close{
			right: 22px;
			top: 13px;
			.vicp-icon4{
				width: 14px;
				height: 14px;
			}
		}
		.vicp-step3{
			margin-top: 71px;
			.vicp-upload{
				background-color: #f4f8fc;
				.vicp-progress-wrap{
					.vicp-progress{
						background-color:#4c8aff;
					}
					.vicp-progress::after{
						box-shadow: 0 1px 4px 0 rgba(#4c8aff, 0.7);
						background-color: #4c8aff;
					}
				}
			}
			.vicp-operate{	
				// position: static;
				overflow: hidden;
				a{
					width: 90px;
					height: 30px;
					background-color: #ffffff;
					border-radius: 100px;
					border: solid 1px #4c8aff;
					box-sizing: border-box;
					line-height: 30px;
					color: #4c8aff;
					margin-left: 0;
					
				}
				a:nth-of-type(2){
					margin-left: 60px;
					background-color: #4c8aff;
					color: #fff;
					margin-right: 160px;
				}
			}
			
		}
	}
	.vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4::after,
	.vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4::before{
		width: 14px;
		height: 2px;
		background-color:#d4d4d4;
		box-shadow:0 0 0 0
	}
	.vue-image-crop-upload .vicp-wrap .vicp-close .vicp-icon4:hover{
		transform: rotate(0)
	}
	.vue-image-crop-upload .vicp-wrap .vicp-icon3::after{
		border-color: #4c8aff;
	}
	.vue-image-crop-upload .vicp-wrap .vicp-success{
		color: #4c8aff;
	}
	.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-webkit-slider-thumb{
		background-color: #4c8aff;
	}
	.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-moz-range-thumb{
		background-color: #4c8aff;
	}
	.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-ms-thumb{
		background-color: #4c8aff;
	}
	.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-webkit-slider-runnable-track{
		background-color: #eaf3fe;
	}
	.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-moz-range-track{
		background-color: #eaf3fe;
	}
	.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]::-ms-track{
		background-color: #eaf3fe;
	}
	.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-right .vicp-preview .vicp-preview-item span{
		color: #666;
	}
	.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-range input[type=range]{
		height: 6px;
	}
}

</style>
