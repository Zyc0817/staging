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
						<div class="formListHead">
                            <div class="left">
                                <div class="txt" :class="{'mt4':nodeKey.length}">用工部门：</div>
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
                                    <input type="text" placeholder="请输入关键字" v-model="value"/>
                                </div>
								<el-tree
									:data="dataList"
									show-checkbox
									node-key="id"
									ref="tree"
									:check-strictly="true"
									@check="handleNodeClick"
									:expand-on-click-node='false'
									:filter-node-method="filterNode"
									style="background:#f4f8fc;"	
									:props="defaultProps">
								</el-tree>
                            </div>
					    </div>   
							<div class="formListHeadOne">
								<div class="left">
									<div class="txt" :class="{'mt4':nodeKeyOne.length}">招聘者：</div>
									<div class="department">
										<div class="all" v-if="nodeKeyOne.length==0">全部</div>
										<div class="departmentCheck" v-else v-for="(i,k) in nodeKeyOne" :key="k">
											<div class="tagTitle">{{i.name}}</div>
											<div class="deleteTag" @click="deleteTag1(k)">×</div>
										</div>
									</div>	
								</div>
								<div class="right" @click="jobListShow=!jobListShow">
									<div class="iconArrow" :class="{'departmentListShow':jobListShow}"></div>
									<div class="txt" v-if="!jobListShow">展开</div>
									<div class="txt" v-else>收起</div>
								</div>
							</div>
							<div class="departmentList" v-if="jobListShow" :class="{'mt10':!nodeKeyOne.length}">
								<div class="departmentListContent">
									<div class="search">
										<div class="searchIcon icon-search"></div>
										<input type="text" placeholder="请输入关键字" v-model="value1" />
									</div>	
									<div class="tagWrap">
										<el-form ref="form" :model="form" label-width="80px" size="medium">	
											<!-- <div class="allList"><el-checkbox label="全部" @change="allListOne(checkedOne)" v-model="checkedOne"></el-checkbox></div> -->
											<el-tree
												:data="certificateOne"
												show-checkbox
												node-key="id"
												ref="tree1"
												:check-strictly="true"
												@check="handleNodeClick1"
												:expand-on-click-node='false'
												:filter-node-method="filterNode"
												style="background:#f4f8fc;"	
												:props="defaultProps">
											</el-tree>
											<!-- <el-checkbox-group @change="angecyName(form.checkedOne)" v-model="form.checkedOne">
												<div class="AllLabor">
													<el-checkbox v-for="(item,index) in certificateOne" :key="index" :label="item"><span class="letter">{{item.name}}</span></el-checkbox>
												</div>
											</el-checkbox-group> -->
										</el-form>
									</div>
								</div>
							</div>
						<div class="daterun">
							<el-form :model="ruleForm" ref="ruleForm" label-width="147px" size="medium" class="demo-ruleForm"> 
								<div class="height31">
									<el-form-item label="住宿日期：">
										<el-col :span="11">
											<div class="position height30 mb24">
												<el-form-item prop="date1">
													<el-date-picker type="date" placeholder="入住日期" v-model="ruleForm.minWorkDate" style="width: 173px;margin-left:-45px;" value-format="timestamp" @focus="focus1=true" @blur="focus1=false"></el-date-picker>
													<i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
												</el-form-item>
											</div>
										</el-col>
										<div class="centerLine1"></div>
										<el-col :span="11">
											<div class="position1 height30 mb24">
												<el-form-item prop="date2">
													<el-date-picker type="date" placeholder="退宿日期" v-model="ruleForm.maxWorkDate" style="float:left;width: 173px;margin-top:-54px;margin-left: 160px;" value-format="timestamp" @focus="focus2=true" @blur="focus2=false"></el-date-picker>
													<i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
												</el-form-item>
											</div>
										</el-col>
									</el-form-item>		
								</div>
							</el-form>
						</div>
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
			dataList: [],
			resulatArr: [],
			originalArray: [],
			show: false, 
			_timeOut: '',
			ruleForm: {
				minWorkDate: '',
				maxWorkDate: ''
			},
			form:{
				checked: [],
				checkedOne: [],
				list: []
			},
			defaultProps: {
	          	children: 'children',
	          	label: 'name'
	        },
			certificate: [],
			certificateOne: [],
			departmentListShow: false,
			jobListShow: false,
			jobList: [],
			jobListCopy: [],
			value: '',
			value1: '',
			nodeKey: [],  // 用工部门列表
			nodeKey1: [],
			nodeKeyOne: [],  //招聘者列表
			nodeKeyOne1: [],
			focus1: false,
			focus2: false,
			checked: false,
			checkedOne: false

		}
	},
	watch: {
		value(val) {
			this.$refs.tree.filter(val);
		},
		value1(val) {
			this.$refs.tree1.filter(val);
		}
	},
	created() {
		this.init()
		this.initDepartments()
	},
	mounted () {
		this.show = true
	},
	methods: {
		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},
		// allListOne(checkedOne) {
		// 	let arr=[],arr1=[]
		// 	if(checkedOne == true){
		// 		this.certificateOne.forEach(i=>{
		// 			this.form.checkedOne.push(i)
		// 			arr.push({ name: i.name })
		// 			arr1.push(i.id)
		// 		})
		// 		this.nodeKeyOne=[...new Set(arr)]
		// 		this.nodeKeyOne1=[...new Set(arr1)]
		// 	}else if(checkedOne == false){
		// 		this.form.checkedOne=[]
		// 		this.nodeKeyOne=[]
		// 		this.nodeKeyOne1=[]
		// 	}
		// },
		// angecyName(data) {
		// 	let arr=[],arr1=[]
		// 	data.forEach(i=>{
		// 		arr.push({ name: i.name })
		// 		arr1.push(i.id)
		// 	})
		// 	this.nodeKeyOne=[...new Set(arr)]
		// 	this.nodeKeyOne1=[...new Set(arr1)]
		// 	if(this.nodeKeyOne.length<this.certificateOne.length){
		// 		this.checkedOne = false
		// 	}else if(this.nodeKeyOne.length==this.certificateOne.length){
		// 		this.checkedOne = true
		// 	}
		// },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('panelShow')
			}, 200)
		},
		subBtn() {
			if (this.ruleForm.maxWorkDate<this.ruleForm.minWorkDate) {
				this.$message({
	                message: '数据输入错误',
	                type: 'error'
	            });
				return
			}
			let obj = Object.assign({
									nodeKey:this.nodeKey1,
									nodeKeyOne:this.nodeKeyOne1
			},this.ruleForm)
			this.$store.dispatch('advancedSearchParams',obj)
			this.reload()
			this.cancel()
		},
		resetBtn() {
			this.ruleForm = {
				minWorkDate: '',
				maxWorkDate: ''}
				this.value = ''
			this.nodeKey = []
			this.nodeKeyOne = []	
			if (this.$refs.tree) {
				this.$refs.tree.setCheckedKeys(this.nodeKey)
			}	
		},
		deleteTag(k) {
			this.nodeKey.splice(k,1)
			this.nodeKey1.splice(k,1)
			this.$refs.tree.setCheckedKeys(this.nodeKey1)
		},
		deleteTag1(k) {
			this.nodeKeyOne.splice(k,1)
			// this.nodeKeyOne1.splice(k,1)
			// this.form.checkedOne.splice(k,1)
			// this.checkedOne=false
			let arr = this.nodeKeyOne.map(i=>i.id)
            if(this.$refs.tree1){
                this.$refs.tree1.setCheckedKeys(arr,true)
            }
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
                url:this.$urls.getAgency
            })
            .then(res=>{     
                this.certificateOne = res.data.content
            })
            .catch(e=>{
                
            })
		},
		initDepartments() {
			this.$axios({
                method: 'get',
                url:this.$urls.departments
            })
            .then(res=>{     
				console.log(res) 
				this.dataList = Object.values(this.$base.formattingJson(res.data))
				this.resulatArr = this.dataList 
				this.originalArray = res.data  
            })
            .catch(e=>{
                
            })
		},
		handleNodeClick(checkedNodes,checkedKeys) {
			let arr=[]
			this.nodeKey = checkedKeys.checkedNodes
			checkedKeys.checkedNodes.forEach(i=>{
				arr.push(i.id)
			})
			this.nodeKey1=[...new Set(arr)]
		},
		handleNodeClick1(checkedNodes,checkedKeys) {
			this.nodeKeyOne = checkedKeys.checkedNodes
			this.nodeKeyOne1 = checkedKeys.checkedKeys
        },
		jobSearchKeyUp(e) {
			if (e.target.value) {
				this.jobList = this.jobFilterResult		
			} else {
				this.jobList = this.jobListCopy
				this.jobList.forEach(i=>{
					if (i.txt==this.nodeKeyOne[0]) {
						i.check = true
					}
				})
			}
		},
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
	.height31{
		margin-top: 20px;
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
		// overflow:hidden; 
        margin-left: -20px;
        margin-bottom: 24px;
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
			overflow:hidden;
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
	.formListHeadOne{
		float: left;
		margin-left: -20px;
		margin-top: 20px;
        margin-bottom: 5px;
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
			margin-left: 19px;
			overflow:hidden;
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
		margin:0px 0 0px 100px;
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
				float: left;
				width: 386px;
				height: 185px;
				line-height: 25px;
				font-size: 12px;
				padding: 0 22px;
				margin-top: 5px;
				margin-left: -21px;
				.letter{
						font-size: 12px;
						color: #444950;
					}
				.AllLabor{
					width: 400px;
					display: flex;
					flex-wrap: wrap;
					margin-left: -68px;
				}
			}
		}
	}
	.daterun{
		float: left;
	}
        .centerLine1{
			float: left;
			width: 18px;
			border-top: 1px dashed #d4d4d4;
			color: #ccc;
			margin-top: 16px;
			margin-left: -41px;
		}
		.position{
			position: relative;
			i{
				position: absolute;
				right: 60px;
				top:9px;
				color: #c0c4cc;
				transition: all .2s;
			}
			.focus1{
				transform: rotate(180deg);
			}
		}
		.position1{
			position: relative;
			i{
				position: absolute;
				right: -145px;
				top:-45px;
				color: #c0c4cc;
				transition: all .2s;
			}
			.focus1{
				transform: rotate(180deg);
			}
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
