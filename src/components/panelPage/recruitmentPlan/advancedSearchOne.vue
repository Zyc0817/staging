<template>
	<div class="panelWrap advancedSearch">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">高级搜索</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div class="formList">
                    <div class="formWrap inputHeight30 height30">
						<el-form :model="ruleForm" ref="ruleForm" label-width="80px" size="medium" class="demo-ruleForm">
									<el-form-item label="性别：">
										<el-select v-model="value" placeholder="请选择" style="width:173px;margin-left:21px;">
											<el-option :label= item.sex :value= item.sexEng v-for="(item,index) in sexList" :key="index"></el-option>
										</el-select>
									</el-form-item>	
									<div class="agesize">
										<el-form-item label="年龄：">
											<el-col :span="11">
												<div class="height30 mb24 ageMin">
													<el-input v-model="ruleForm.minAge" placeholder="最小" style="width:173px;margin-top:14px;">
														<span slot="suffix" style="color:#444950;" class="age">岁</span>
													</el-input>
												</div>
											</el-col>
											<div class="centerLine"></div>
											<el-col :span="11">
												<div class="height30 mb24 topBig">
													<el-input v-model="ruleForm.maxAge" placeholder="最大" style="width:173px;margin-top:13px;">
														<span slot="suffix" style="color:#444950;" class="age">岁</span>
													</el-input>
												</div>
											</el-col>
										</el-form-item>	
									</div>
									<div class="heightsize">
										<el-form-item label="身高：" style="height:35px;">
											<el-col :span="11">
												<div class="height30 mb24 heightMin">
													<el-form-item prop="date1">
														<el-input v-model="ruleForm.minHeight" placeholder="最矮" style="width:173px;">
															<span slot="suffix" style="color:#444950;" class="height">cm</span>
														</el-input>
													</el-form-item>
												</div>
											</el-col>
											<div class="centerLine"></div>
											<el-col :span="11">
												<div class="height30 mb24 topHeight">
													<el-form-item prop="date2">
														<el-input v-model="ruleForm.maxHeight" placeholder="最高" style="width:173px;">
															<span slot="suffix" style="color:#444950;" class="height">cm</span>
														</el-input>
													</el-form-item>
												</div>
											</el-col>
										</el-form-item>	
									</div>
									<div class="bankCardInformation">
										<el-form-item label="银行卡信息：" label-width="85px">
											<el-select v-model="cardInformation" placeholder="请选择" style="width:173px;margin-left:17px;">
												<el-option :label= item.type :value= item.typeEng v-for="(item,index) in bankCard" :key="index"></el-option>
											</el-select>
										</el-form-item>	
									</div>
							</el-form>    
                        <div class="formListHead">
                            <div class="left">
                                <div class="txt" :class="{'mt4':nodeKey.length}">从业资格证：</div>
                                <div class="department">
                                    <div class="all" v-if="nodeKey.length==0">全部</div>
                                    <div class="departmentCheck" v-else v-for="(i,k) in nodeKey" :key="k">
                                        <div class="tagTitle">{{i.name}}</div>
                                        <div class="deleteTag" @click="deleteTag(k)">×</div>
                                    </div>
                                </div>	
                            </div>
                            <div class="right" @click="departmentListShow=!departmentListShow">
                                <div class="iconArrow" :class="{'departmentListShow':departmentListShow}"></div>
                                <div class="txt" v-if="!departmentListShow">展开</div>
                                <div class="txt" v-else>收起</div>
                            </div>
					    </div>
					    <div class="departmentList" v-if="departmentListShow" :class="{'mt10':!nodeKey.length}">
                            <div class="departmentListContent">
                                <div class="search">
                                    <div class="searchIcon icon-search"></div>
                                    <input type="text" placeholder="请输入关键字" v-model="value" @keyup="searchKeyUp"/>
                                </div>	
								<div class="tagWrap">
									<el-form ref="form" :model="form" label-width="80px" size="medium">	
										<div class="postlist">
											<div class="allChoose"><el-checkbox label="全部" @change="allList(checked)" v-model= checked></el-checkbox></div>
											<el-checkbox-group @change="workerName(form.checked)" v-model="form.checked">
												<div class="nave">
													<el-checkbox v-for="(item,index) in certificate" :key="index" :label="item"><span class="letter">{{item.name}}</span></el-checkbox>
												</div>
											</el-checkbox-group>
										</div>
									</el-form>
								</div>
                            </div>
					    </div>    
                        <el-form :model="ruleForm" ref="ruleForm" label-width="147px" size="medium" class="demo-ruleForm"> 
							<div class="height30">
								<el-form-item label="从业资格证到期日期：" style="150px;">
									<el-col :span="11">
											<div class="chooseDate">
												<el-select v-model="value1" placeholder="请选择" style="width:180px;">
													<el-option :label= item.type :value= item.typeEng v-for="(item,index) in documentsDate" :key="index"></el-option>
												</el-select>
											</div>
									</el-col>
								</el-form-item>		
							</div>
						</el-form>
					</div>
									
				</div>
				<div class="subBtnWrap">
					<div class="subBtn" @click="subBtn">搜索</div>
					<div class="resetBtn" @click="resetBtn">重置</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'advancedSearchOne',
	props:['reload','type'],
		//  重新请求全部列表，搜索的字段文字，类型（不同菜单进入的高级搜索）
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			ruleForm: {
				minAge: '',
				maxAge: '',
				minHeight: '',
				maxHeight: ''
			},
			form:{
				checked: []
			},
			List: [],
			certificate: [],
			departmentListShow: false,
			jobListShow: false,
			value: '',
			value1: '',
			cardInformation: '',
	        dataList: [],
			resulatArr: [],
			originalArray: [],  // 原始扁平状数组
			sexList: [{sex:'男',sexEng: 'male'},{sex:'女',sexEng: 'female'}],
	        defaultProps: {
	          	children: 'children',
	          	label: 'name'
			},
	        nodeKey: [],  // 用工部门列表
	        departments: [],
			jobList: [],
			jobListCopy: [],
			jobNodeList: [],
			startTime: '',
			endTime: '',
			post: [],
			focus1: false,
			focus2: false,
			focus3: false,
			focus4: false,
			focus5: false,
			focus6: false,
			checked: false,
			bankCard: [{type: '全部',typeEng:''},
				{type: '有卡号',typeEng:'enable'},
				{type: '无卡号',typeEng:'disable'}],
			documentsDate: [{type:'全部',typeEng:''},
				{type:'近1周',typeEng:'week'},
				{type:'近1个月',typeEng: 'once'},
				{type:'近3个月',typeEng: 'thice'}],
		}
	},
	created() {
		this.init()
	},
	mounted () {
		this.show = true
	},
	computed: {
        filterResult() {
            return this.originalArray.filter(value => new RegExp(this.value, 'i').test(value.name))
		},
		jobFilterResult() {
			return this.jobList.filter(value => new RegExp(this.value1, 'i').test(value.title))
		}
    },
	methods: {
		allList(item){
			 if(item==true){
				 this.form.checked=[],this.nodeKey=[]
				 this.certificate.forEach(i=>{
					 this.form.checked.push(i)
					 this.nodeKey.push(i)
				 })
			 }else if(item==false){
				 this.form.checked=[]
				 this.nodeKey=[]
			 }
			 
		},
		workerName(data) {
			this.nodeKey = data
			this.checked = false
			if(data.length==this.certificate.length){
				this.checked = true
			}
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('panelShow')
			}, 200)
		},
		subBtn() {
			if ((this.ruleForm.maxAge<this.ruleForm.minAge)||(this.ruleForm.maxHeight<this.ruleForm.minHeight)) {
				this.$message({
	                message: '数据输入错误',
	                type: 'error'
	            });
				return
			}
			let arr = []
			this.nodeKey.forEach((i,k) => {
				arr.push(this.nodeKey[k].id)
			});
			
			let obj = Object.assign({value: this.value,
									nodeKey: arr,
									value1:this.value1,
									cardInformation: this.cardInformation
			},this.ruleForm)
			this.$store.dispatch('advancedSearchParams',obj)
			this.reload()
			this.resetBtn()
			this.cancel()
		},
		resetBtn() {
			this.ruleForm = {
				minAge: '',
				maxAge: '',
				minHeight: '',
				maxHeight: '',
				CreateDate: ''}
				this.value = ''
			this.nodeKey = []
			this.post = []
			this.jobList = []
			this.jobListCopy = []
			this.jobNodeList = []
			if (this.$refs.tree) {
				this.$refs.tree.setCheckedKeys(this.nodeKey)
			}	
		},
		deleteTag(k) {
			this.form.checked.splice(k,1)
			this.nodeKey.splice(k,1)
			this.checked=false
		},
		searchKeyUp(e) {
			if (e.target.value) {
				this.dataList = this.filterResult
			} else {
				this.dataList = this.resulatArr
			}
		},
		init() {
			this.$axios({
				method: 'get',
				url: this.$urls.certType
			}).then(res=>{
				console.log(res)
				this.certificate = res.data.content
			})
		}
	},
	destroyed() {
		clearTimeout(this._timeOut)
		this.resetBtn()
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
	width:520px;
	overflow-y:scroll;
	.fixed{
		width: 480px;
	}
	.floatL{
		float: left;
		width: 100%;
	}
	.formList{
		overflow:hidden;
		min-height:calc(100% - 134px);
		padding-top: 24px;
	}
	.height30{
		height: 30px;
	}
	.mb24{
		margin-bottom: 24px;
	}
	.departmentList::-webkit-scrollbar {
		display:none;
	}
	.mt10{
		margin-top: 10px;
	}
	.formWrap{
		float:left;
		padding:0 20px;
		width: 100%;
        box-sizing: border-box;
        .formListHead{
		float: left;
        margin-left: -20px;
		margin-bottom: 24px;
		margin-top: -12px;
		z-index: 1000;
        .left{	
			float:left;
			margin:0 0 0 20px;
			color: #444950;
			overflow:hidden;
			.width75{
				width: 80px;
			}
			.txt{
				float:left;
				font-size:14px;
				height:20px;
				line-height:20px;
				width: 100px;
			}
			.mt4{
				margin-top: 2.5px;
			}
			.department{
				width:320px;
				overflow:hidden;
				float:left;
				.all{
					line-height:20px;
					font-size:14px;
					height:20px;
					margin-left: 2px;
				}			
				.departmentCheck{
					width:150px;
					height:27px;
					border-radius: 13.5px;
					border: solid 1px #ececec;
					float:left;
					line-height:25px;
					text-indent:10px;
					color: #4c8aff;
					font-size: 12px;
					box-sizing:border-box;
					margin:0 10px 10px 0;
					.tagTitle{
						float:left;
						width:120px;
						overflow:hidden;
						text-overflow:ellipsis;
						white-space:nowrap;
					}
					.deleteTag{
						font-size:14px;
						float:right;
						margin-right: 10px;
						color:#666;
						text-indent:0px;
						cursor:pointer;

					}
				}		
			}
			.mt26{
				margin-top: 21px;
			}
		}
		.right{
			float:right;
			height:20px;
			margin-left: 16px;
			font-size: 14px;
			cursor:pointer;
			div{	
				float:right;
			}
			.txt{
				color: #4c8aff;
				height:20px;
				line-height:20px;
			}
			.iconArrow{
				background: url('../../../assets/img/logo.png') no-repeat -203px -104px;
				width: 8px;
				height: 6px;
				margin:6px 0 0 5px;
			}
			.departmentListShow{
				transition:all .3s;
				transform:rotate(180deg);
			}
		}
    }
    .departmentList{
		width:386px;
		height:208px;
		overflow-y:scroll;
		float:left;
		margin: -20px 0 24px 100px;
		.departmentListContent{
			min-height:208px;
			background-color:#f4f8fc;
			box-sizing: border-box;
			padding:10px 10px;
			.search{	
				width:368px;
				height:29px;
				background-color:#fff;
				border: solid 1px #ececec;
				.searchIcon{
					float:left;
					margin:8px 0 0 10px;
					font-size: 14px;
				}
				input{
					float:left;
					border:none;
					outline:none;
					height:100%;
					width:300px;
					padding:0 0 0 5px;
					color:#999;
					font-size: 12px;
				}
				input::-webkit-input-placeholder{
					color:#999999;;
				}
				input::-moz-placeholder{   /* Mozilla Firefox 19+ */
					color:#999999;
				}
				input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
					color:#999999;
				}
				input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
					color:#999999;
				}
			}
			.tagWrap{
				// overflow-y:scroll;
				float: left;
				width: 100%;
				height: 185px;
				line-height: 25px;
				font-size: 12px;
				padding: 0 22px;
				margin-top: 5px;
				.postlist{
					position: relative;
					display: flex;
					width: 100%;
					flex-wrap: wrap;
					.allChoose{
						position: absolute;
						top: 0;
						left: -20px;
						font-size: 10px;
					}
					.nave{
						display: flex;
						width: 450px;
						flex-wrap: wrap;
						margin-left: -88px;
						.letter{
							font-size: 12px;
							color: #444950;
							font-weight: normal;
						}
					}
					.nave .el-checkbox{
						width: 52.1px;
					}
				}
			}
			.jobListWrap{
				padding:10px 0;
				overflow: hidden;
				.jobItem{
					float: left;
					width: 35%;
					margin-bottom: 7px;
				}
				.lastItem{
					width: 30%;
				}
			}
			.el-tree{
				background-color:#f4f8fc;
				margin-top:10px;
			}
		}
	}
		.line{
			text-align:center;
			color:#d4d4d4;
		}
		.centerLine{
			float: left;
			width: 18px;
			border-top: 1px dashed #d4d4d4;
			margin-top: 27px;
			margin-right: 7px;
		}
		.position{
			position: relative;
			i{
				position: absolute;
				right: 10px;
				top:9px;
				color: #c0c4cc;
				transition: all .2s;
			}
			.focus1{
				transform: rotate(180deg);
			}
		}
		.heightsize{
			margin-top: -22px;
			.heightMin{
				position: relative;
				.height{
					position: absolute;
					top: 0px;
					left: -3px;
				}
			}
			.centerLine{
				margin-top: 16px;
				margin-left: 20px;
			}
			.topHeight{
				position: relative;
				.height{
					position: absolute;
					top: -15.5px;
					left: 21px;
				}
			}
		}
		.agesize{
			margin-top: -7px;
			.ageMin{
				position: relative;
				.age{
					position: absolute;
					top: 0px;
					left: 2px;
				}
			}
			.centerLine{
				float: left;
				margin-top: 28px;
				margin-left: 20px;
			}
			.topBig{
				position: relative;
				.age{
					position: absolute;
					top: -28px;
					left: 25px;
				}
			}
		}
		.bankCardInformation{
			float:left;
			margin-top: -19px;
			margin-bottom: 35px;
		}
	}
	.subBtnWrap{
		height:57px;
		width:100%;
		border-top:1px solid #ececec;
		.subBtn{
			float:left;
			width: 24px;
			height: 17px;
			background-color: #4c8aff;
			border-radius: 14.5px;
			color:#fff;
			text-align:center;
			padding: 4px 27px;
			font-size:12px;
			margin:15px 0 0 150px;
			border:1px solid #4c8aff;
			cursor:pointer;
		}
		.resetBtn{
			float:left;
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			color:#4c8aff;
			text-align:center;
			font-size:12px;
			margin:15px 0 0 60px;
			border:1px solid #4c8aff;
			cursor:pointer;
		}
	}
}
</style>
