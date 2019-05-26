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
					<div class="formListHead">
						<div class="left">
							<div class="txt" :class="{'mt4':nodeKey.length}">用工部门：</div>
							<div class="department">
								<div class="all" v-if="nodeKey.length==0">全部</div>
								<div class="departmentCheck" v-else v-for="(i,k) in nodeKey" :key="k">
									<div class="tagTitle">{{i}}</div>
									<div class="deleteTag" @click="deleteTag(i)">×</div>
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
							<el-tree
								:data="dataList"
								show-checkbox
								node-key="name"
								ref="tree"
								:check-strictly="true"
								@check="handleNodeClick"
								:expand-on-click-node='false'
								:default-checked-keys="nodeKey"
								:filter-node-method="filterNode"
								:props="defaultProps">
							</el-tree>
						</div>
					</div>
					<div class="floatL" style="margin-top:24px;" v-if="type=='companyConfirm'||type=='hireManagement'">
						<div class="formListHead">
							<div class="left">
								<div class="txt width75" :class="{'mt4':jobNodeList.length}">岗位：</div>
								<div class="department">
									<div class="all" v-if="jobNodeList.length==0">全部</div>
									<div class="departmentCheck" v-else v-for="(i,k) in jobNodeList" :key="k">
										<div class="tagTitle">{{i}}</div>
										<div class="deleteTag" @click="deleteJobTag(i)">×</div>
									</div>
								</div>					
							</div>
							<div class="right" @click="jobListShow=!jobListShow">
								<div class="iconArrow" :class="{'departmentListShow':jobListShow}"></div>
								<div class="txt" v-if="!jobListShow">展开</div>
								<div class="txt" v-else>收起</div>
							</div>
						</div>
						<div class="departmentList" v-if="jobListShow" :class="{'mt10':!jobNodeList.length}">
							<div class="departmentListContent">
								<div class="search">
									<div class="searchIcon icon-search"></div>
									<input type="text" placeholder="请输入关键字" v-model="value1" @keyup="jobSearchKeyUp"/>
								</div>	
								<div class="jobListWrap">
									<div class="jobItem" :class="{'lastItem':k % 3 == 2}" v-for="(i,k) in jobList" :key="k" >
										<el-checkbox v-model="jobList[k].check" @change="(check)=>{return jobItemChange(check,i.title,k)}">{{i.title}}</el-checkbox>
									</div>	
								</div>
							</div>
						</div>
					</div>
					<div class="formWrap inputHeight30 height30">
						<el-form :model="ruleForm" ref="ruleForm" label-width="80px" size="medium" class="demo-ruleForm">
							<el-form-item label="用工日期：">
								<el-col :span="11">
									<div class="position height30 mb24">
										<el-form-item prop="date1">
											<el-date-picker type="date" placeholder="开始日期" v-model="ruleForm.minWorkDate" style="width: 100%;" value-format="timestamp" @focus="focus1=true" @blur="focus1=false"></el-date-picker>
											<i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
										</el-form-item>
									</div>
								</el-col>
								<div class="centerLine"></div>
								<el-col :span="11">
									<div class="position height30 mb24">
										<el-form-item prop="date2">
											<el-date-picker type="date" placeholder="结束日期" v-model="ruleForm.maxWorkDate" style="width: 100%;" value-format="timestamp" @focus="focus2=true" @blur="focus2=false"></el-date-picker>
											<i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
										</el-form-item>
									</div>
								</el-col>
							</el-form-item>	
							<div v-if="type!='companyConfirm'&&type!='hireManagement'">
								<el-form-item :label="txt1">
									<el-col :span="11">
										<div class="height30 mb24">
											<el-form-item prop="date1">
												<el-input v-model="ruleForm.minEmployees" placeholder="最少"></el-input>
											</el-form-item>
										</div>
									</el-col>
									<div class="centerLine"></div>
									<el-col :span="11">
										<div class="height30 mb24">
											<el-form-item prop="date2">
												<el-input v-model="ruleForm.maxEmployees" placeholder="最多"></el-input>
											</el-form-item>
										</div>
									</el-col>
								</el-form-item>	
							</div>
							<div class="height30" v-if="type!='companyConfirm'&&type!='hireManagement'">
								<el-form-item  label="下单日期：">
									<el-col :span="11">
										<div class="position height30">
											<el-form-item prop="date3">
												<el-date-picker type="date" placeholder="开始日期" v-model="ruleForm.minCreateDate" style="width: 100%;" value-format="timestamp" @focus="focus3=true" @blur="focus3=false"></el-date-picker>
												<i class="el-icon-arrow-down" :class="{'focus1':focus3}"></i>
											</el-form-item>
										</div>
									</el-col>
									<div class="centerLine"></div>
									<el-col :span="11">
										<div class="position height30">
											<el-form-item prop="date4">
												<el-date-picker type="date" placeholder="结束日期" v-model="ruleForm.maxCreateDate" style="width: 100%;" value-format="timestamp" @focus="focus4=true" @blur="focus4=false"></el-date-picker>
												<i class="el-icon-arrow-down" :class="{'focus1':focus4}"></i>
											</el-form-item>
										</div>
									</el-col>
								</el-form-item>		
							</div>
							<div v-if="type=='companyConfirm'" class="height30">
								<el-form-item label="用工时间：">
									<el-col :span="11">
										<div class="position">
											<el-time-picker
												placeholder="上班时间" 
												v-model="ruleForm.startTime" 
												value-format="HH:mm" format="HH:mm"
												@focus="focus5=true" @blur="focus5=false"
												style="width: 100%;"></el-time-picker>
												<i class="el-icon-arrow-down" :class="{'focus1':focus5}"></i>
										</div>
									</el-col>
									<div class="centerLine"></div>
									<el-col :span="11">
										<div class="position">
											<el-time-picker
											placeholder="下班时间" 
											v-model="ruleForm.endTime" 
											@focus="focus6=true" @blur="focus6=false"
											value-format="HH:mm" format="HH:mm"
											style="width: 100%;"></el-time-picker>
											<i class="el-icon-arrow-down" :class="{'focus1':focus6}"></i>
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
	name: 'advancedSearch',
	props:['reload','searchTxt','type'],
		//  重新请求全部列表，搜索的字段文字，类型（不同菜单进入的高级搜索）
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			txt1: `${this.searchTxt}人数：`,
			ruleForm: {
				minWorkDate: '',
				maxWorkDate: '',
				minEmployees: '',
				maxEmployees: '',
				minCreateDate: '',
				maxCreateDate: '',
				startTime: '',
				endTime: ''
			},
			departmentListShow: false,
			jobListShow: false,
			value: '',
			value1: '',
	        dataList: [],
			resulatArr: [],
			originalArray: [],  // 原始扁平状数组
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
			focus6: false

		}
	},
	watch: {
		value(val) {
			this.$refs.tree2.filter(val);
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
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		jobItemChange(check,txt,k) {
			if (check) {
				this.jobNodeList.push(txt)
			} else {
				this.jobNodeList.forEach((i,j)=>{
					if (i == txt) {
						this.jobNodeList.splice(j,1)
					}
				})
			}	
		},
		deleteJobTag(txt) {
			this.jobNodeList.forEach((i,j)=>{
				if (i == txt) {
					this.jobNodeList.splice(j,1)
				}
			})
			this.jobList.forEach((i,k)=>{
				if (i.title==txt) {
					this.jobList[k].check = false
				}
			})	
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('panelShow')
			}, 200)
		},
		subBtn() {
			if ((this.ruleForm.maxCreateDate<this.ruleForm.minCreateDate)||(this.ruleForm.maxWorkDate<this.ruleForm.minWorkDate)||(this.ruleForm.minEmployees>this.ruleForm.maxEmployees)) {
				this.$message({
	                message: '数据输入错误',
	                type: 'error'
	            });
				return
			}
			this.jobList.forEach(i=>{
				if (i.check) {
					this.post.push(i.id)
				}
			})
			let obj = Object.assign({departments:this.departments,
									posts:this.post,
									nodeKey:this.nodeKey,
									jobNodeList:this.jobNodeList,
			},this.ruleForm)
			this.$store.dispatch('advancedSearchParams',obj)
			this.reload()
			this.cancel()
		},
		resetBtn() {
			this.ruleForm = {minWorkDate: '',
				maxWorkDate: '',
				minEmployees: '',
				maxEmployees: '',
				minCreateDate: '',
				startTime: '',
				endTime: '',
				maxCreateDate: '',}
			this.nodeKey = []
			this.post = []
			this.jobList = []
			this.jobListCopy = []
			this.jobNodeList = []
			if (this.$refs.tree) {
				this.$refs.tree.setCheckedKeys(this.nodeKey)
			}	
		},
		postInit(arr) {
			this.$axios({
                method: 'get',
				url:this.$urls.getOutsidePostByDept,
				params:{departmentId:arr},
				paramsSerializer: params => this.qs.stringify(params, {arrayFormat: 'repeat'})
            })
            .then(res=>{
				this.jobList = res.data
				this.jobListCopy = res.data	
				this.jobList.forEach(i=>{
					this.posts.forEach(j=>{
						if(i.id==j) {
							i.check = true
						}else {
							i.check=false
						}
					})
					
				})	
				this.jobListCopy.forEach(i=>{
					this.posts.forEach(j=>{
						if(i.id==j) {
							i.check = true
						}else {
							i.check=false
						}
					})
				})	
			})
            .catch(e=>{

            })	
		},
		handleNodeClick(checkedNodes,checkedKeys) {
			this.nodeKey = checkedKeys.checkedKeys
			let arr = checkedKeys.checkedNodes.map(i=>i.id)
			this.postInit(arr)
		},
		deleteTag(a) {
			let parent,
				child
			function deleteItem(item) {
				
				if (item.children) {
					item.children.forEach((i,k)=>{
						if(i.name == a) {
							parent = item.name
							return
						} else {
							if (i.children) {
								deleteItem(i)
							}	
							return 
						}
					})
				}	
			}
			this.dataList.forEach((item,key)=>{
				if (item.children) {
					deleteItem(item)
				}		
			})
			this.nodeKey = this.nodeKey.filter(i=>{
				if (a != i && parent != i) {
					
					return i
				}
			})
			this.$refs.tree.setCheckedKeys(this.nodeKey)
		},
		searchKeyUp(e) {
			if (e.target.value) {
				this.dataList = this.filterResult
			} else {
				this.dataList = this.resulatArr
			}
		},
		jobSearchKeyUp(e) {
			if (e.target.value) {
				this.jobList = this.jobFilterResult		
			} else {
				this.jobList = this.jobListCopy
				this.jobList.forEach(i=>{
					if (i.txt==this.jobNodeList[0]) {
						i.check = true
					}
				})
			}
		},
		init() {
			this.$axios({
                method: 'get',
                url:this.$urls.departments
            })
            .then(res=>{
               	this.dataList = Object.values(this.$base.formattingJson(res.data))
				this.resulatArr = this.dataList 
				this.originalArray = res.data   
					
            })
            .catch(e=>{
			})	

			let obj = this.$store.state.recruitmentPlan.advancedSearchParams
			console.log(obj)
			this.ruleForm.minWorkDate = obj.minWorkDate||''
			this.ruleForm.maxWorkDate = obj.maxWorkDate||''
			this.ruleForm.minEmployees = obj.minEmployees||''
			this.ruleForm.maxEmployees = obj.maxEmployees||''
			this.ruleForm.minCreateDate = obj.minCreateDate||''
			this.ruleForm.maxCreateDate = obj.maxCreateDate||''
			this.ruleForm.startTime = obj.startTime||''
			this.ruleForm.endTime = obj.endTime||''
			this.departments = obj.departments||[]
			
			if (obj.departments&&obj.departments.length) {
				this.departmentListShow = true
				this.nodeKey = obj.nodeKey||[]
				this.postInit(this.departments)   
			}   
			if(obj.posts&&obj.posts.length) {
				this.jobListShow = true
				this.posts = obj.posts||[]
			}  
			if(obj.jobNodeList&&obj.jobNodeList.length) {
				this.jobNodeList = obj.jobNodeList
			}
				
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
	
	.formListHead{
		overflow:hidden;
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
				// margin-top:24px;
				width: 80px;
			}
			.mt4{
				margin-top: 2.5px;
			}
			.department{
				width:320px;
				overflow:hidden;
				float:left;
				// margin-top:24px;
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
			margin:0px 20px 0 0;
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
		width:400px;
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
	.departmentList::-webkit-scrollbar {
		display:none;
	}
	.mt10{
		margin-top: 10px;
	}
	.formWrap{
		float:left;
		margin-top:24px;
		padding:0 20px;
		width: 100%;
		box-sizing: border-box;
		.line{
			text-align:center;
			color:#d4d4d4;
		}
		.centerLine{
			float: left;
			width: 18px;
			border-top: 1px dashed #d4d4d4;
			margin: 14.5px 10px;
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