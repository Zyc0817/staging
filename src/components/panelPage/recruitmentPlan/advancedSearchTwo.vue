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
                    <div class="formWrap inputHeight30">
                            <div class="formListHead">
                                <div class="left">
                                    <div class="txt" :class="{'mt4':nodeKey.length}">用工部门：</div>
                                    <div class="department">
                                        <div class="all" v-if="nodeKey.length==0">全部</div>
                                        <div class="departmentCheck" v-else v-for="(i,k) in nodeKey" :key="k">
                                            <div class="tagTitle">{{i}}</div>
                                            <div class="deleteTag" @click="deleteTag(i,k)">×</div>
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
                            <div class="formListHeadOne">
                                <div class="left">
                                    <div class="txt" :class="{'mt4':nodeKey.length}">岗位：</div>
                                    <div class="department">
                                        <div class="all" v-if="nodeKeyOne.length==0">全部</div>
                                        <div class="departmentCheck" v-else v-for="(i,k) in nodeKeyOne" :key="k">
                                            <div class="tagTitle">{{i.title}}</div>
                                            <div class="deleteTag" @click="deletePost(k)">×</div>
                                        </div>
                                    </div>	
                                </div>
                                <div class="right" @click="postShow=!postShow">
                                    <div class="iconArrow" :class="{'departmentListShow':postShow}"></div>
                                    <div class="txt" v-if="!postShow">展开</div>
                                    <div class="txt" v-else>收起</div>
                                </div>
					        </div>
                            <div class="departmentList" v-if="postShow" :class="{'mt10':!nodeKeyOne.length}">
                                <div class="departmentListContent">
                                    <div class="search">
                                        <div class="searchIcon icon-search"></div>
                                        <input type="text" placeholder="请输入关键字" v-model="value" @keyup="searchKeyUp"/>
                                    </div>	
                                    <div class="tagWrap">
                                        <el-form ref="form" :model="form" label-width="80px" size="medium">	
                                            <div class="postlist">
												<div class="allChoose"><el-checkbox label="全部" @change="allListOne(checkout)"  v-model="checkout"></el-checkbox></div>
												<el-checkbox-group v-model="form.post" @change="workerPost(form.post)">
													<div class="nave">	
														<el-checkbox v-for="(item,index) in certificateTwo" :key="index" :label="item" style="width:52.2px;"><span class="letter">{{item.title}}</span></el-checkbox>
													</div>
												</el-checkbox-group>
											</div>
                                        </el-form>
                                    </div>
                                </div>
                            </div> 
                            <div class="formListHeadTwo">
                                <div class="left">
                                    <div class="txt" :class="{'mt4':nodeKey.length}">招聘者：</div>
                                    <div class="department">
                                        <div class="all" v-if="nodeKeyTwo.length==0">全部</div>
                                        <div class="departmentCheck" v-else v-for="(i,k) in nodeKeyTwo" :key="k">
                                            <div class="tagTitle">{{i.name}}</div>
                                            <div class="deleteTag" @click="deleteAgence(k)">×</div>
                                        </div>
                                    </div>	
                                </div>
                                <div class="right" @click="recruitersShow=!recruitersShow">
                                    <div class="iconArrow" :class="{'departmentListShow':recruitersShow}"></div>
                                    <div class="txt" v-if="!recruitersShow">展开</div>
                                    <div class="txt" v-else>收起</div>
                                </div>
					        </div>
                            <div class="departmentList" v-if="recruitersShow" :class="{'mt10':!nodeKey.length}">
                                <div class="departmentListContent">
                                    <div class="search">
                                        <div class="searchIcon icon-search"></div>
                                        <input type="text" placeholder="请输入关键字" v-model="value" @keyup="searchKeyUp"/>
                                    </div>	
                                    <div class="tagWrapAgency">
                                        <el-form ref="form" :model="form" label-width="80px" size="medium">	
                                            <div class="postlist">
												<div class="allList"><el-checkbox label="全部" @change="allListTwo(checkbox)" v-model="checkbox"></el-checkbox></div>
												<el-checkbox-group v-model="form.recruiters" @change="workerRecruiters(form.recruiters)">
													<div class="AllLabor">
														<el-checkbox v-for="(item,index) in certificateThe" :key="index" :label="item"><span class="letter">{{item.name}}</span></el-checkbox>
													</div>
												</el-checkbox-group>
											</div>
                                        </el-form>
                                    </div>
                                </div>
                            </div>
                        <div class="daterun">
                            <el-form :model="ruleForm" ref="ruleForm" label-width="147px" size="medium" class="demo-ruleForm"> 
                                <div class="height30">
                                    <el-form-item label="工作时间：">
                                        <el-time-select
                                            style="margin-left:-70px;"
                                            placeholder="上班时间"
                                            v-model="ruleForm.startTime"
                                            :picker-options="{
                                            start: '00:00',
                                            step: '00:15',
                                            end: '23:59'
                                            }" @focus="focus1=true" @blur="changeTime(ruleForm.startTime)">
                                        </el-time-select>
										<div class="transformpictureUp"><img src="../../../assets/img/Triangle.svg" alt="" :class="{'focus':focus1}" @click="focus1=!focus1"></div>
                                    </el-form-item>	
                                    <span>-----</span>	
                                    <el-form-item>
                                        <el-time-select
                                            style="margin-left:-150px;"
                                            placeholder="下班时间"
                                            v-model="ruleForm.endTime"
                                            :picker-options="{
                                            start: '00:00',
                                            step: '00:15',
                                            end: '23:59'
                                            }" @focus="focus2=true" @blur="changeTime1(ruleForm.endTime)">
                                        </el-time-select>
										<div class="transformpictureDown"><img src="../../../assets/img/Triangle.svg" alt="" :class="{'focus':focus2}" @click="focus2=!focus2"></div>
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
	name: 'advancedSearchTwo',
	props:['reload','type'],
		//  重新请求全部列表，搜索的字段文字，类型（不同菜单进入的高级搜索）
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			ruleForm: {
				startTime: '',
				endTime: ''
			},
			ruleTime: {
				workTime1: '',
				workTime2: ''
			},
			form:{
                department: [],
                post: [],
				recruiters: []
			},
			defaultProps: {
	          	children: 'children',
	          	label: 'name'
	        },
			List: [],
			certificateOne: [],
			certificateTwo: [],
			certificateThe: [],
            departmentListShow: false,
            postShow: false,
            recruitersShow: false,
			value: '',
	        dataList: [],
			resulatArr: [],
			originalArray: [],  // 原始扁平状数组
			nodeKey: [],  // 用工部门列表
			nodeKey1: [],
			nodeKeyOne: [],  // 岗位列表
			nodeKeyOne1: [],
			nodeKeyTwo: [],  // 招聘者列表
			nodeKeyTwo1: [],
	        departments: [],		
			post: [],
			focus1: false,
			focus2: false,
            checked: false,
            checkout: false,
			checkbox: false			
		}
	},
	created() {
		this.initPost()
		this.initGetAgency()
		this.initDepartments()
	},
	mounted () {
		this.show = true
    },
    watch: {

    },
	computed: {
        filterResult() {
            return this.originalArray.filter(value => new RegExp(this.value, 'i').test(value.name))
		},
		jobFilterResult() {
			// return this.jobList.filter(value => new RegExp(this.value1, 'i').test(value.title))
		}
    },
	methods: {
		changeTime(time) {
			this.focus1=false
			let hour = time.split(':')[0],min = time.split(':')[1]
			let s = Number(hour*3600)+Number(min*60)
			this.ruleTime.workTime1 = s * 1000
		},
		changeTime1(time) {
			this.focus2=false
			let hour = time.split(':')[0],min = time.split(':')[1]
			let s = Number(hour*3600)+Number(min*60)
			this.ruleTime.workTime2 = s * 1000
		},
		handleNodeClick(checkedNodes,checkedKeys) {
			let arr=[]
			this.nodeKey = checkedKeys.checkedKeys
			checkedKeys.checkedNodes.forEach(i=>{
				arr.push(i.id)
			})
			this.nodeKey1=[...new Set(arr)]
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		allList(index){
            if(index == true){
                this.form.department = this.certificateOne
			    this.nodeKey = this.certificateOne
            }else if(index == false){
                this.form.department = []
                this.nodeKey = []
            }	 
        },
        allListOne(index) {
			this.form.post=[],this.nodeKeyOne=[]
            if(index == true){
				 this.certificateTwo.forEach(i=>{
					 this.form.post.push(i)
					 this.nodeKeyOne.push({ title: i.title })
					 this.nodeKeyOne1.push(i.id)
				 })
            }else if(index == false){
                this.form.post = []
				this.nodeKeyOne = []
				this.nodeKeyOne1=[]
            }	
        },
        allListTwo(index) {
			this.form.recruiters=[],this.nodeKeyTwo=[]
            if(index == true){
				this.certificateThe.forEach(i=>{
					this.form.recruiters.push(i)
					this.nodeKeyTwo.push({
						name: i.name
					})
					this.nodeKeyTwo1.push(i.id)
				})
            }else if(index == false){
                this.form.recruiters = []
				this.nodeKeyTwo = []
				this.nodeKeyTwo1= []
			}
        },
		workerName(data) {
			this.nodeKey = data
            if(data.length < this.certificateOne.length){
                this.checked = false
			}
        },
        workerPost(data) {
			let arr=[],arr1=[]
			data.forEach(i=>{
				arr.push({ title: i.title })
				arr1.push(i.id)
			})
			this.nodeKeyOne=[...new Set(arr)]
			this.nodeKeyOne1=[...new Set(arr1)]
            if(data.length < this.certificateTwo.length){
                this.checkout = false
			}
			if(data.length == this.certificateTwo.length){
				this.checkout = true
			}
        },
        workerRecruiters(data) {	
			let arr=[],arr1=[]		
			data.forEach(i=>{
				arr.push({
					name: i.name
				})
				arr1.push(i.id)
			})
			this.nodeKeyTwo=[...new Set(arr)]
			this.nodeKeyTwo1=[...new Set(arr1)]
            if(data.length < this.certificateThe.length){
                this.checkbox = false
			}
			if(this.form.recruiters.length==this.certificateThe.length){
				this.checkbox=true
			}
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('panelShow')
			}, 200)
		},
		subBtn(time) {
			if(!this.nodeKey.length||!this.nodeKeyOne.length||!this.nodeKeyTwo.length){
				this.$message({
					message: '部门，岗位，招聘者为必选项',
					type: 'error',
					duraton: 5 * 1000
				})
				return
			}
			let obj = Object.assign({
									nodeKey:this.nodeKey1,
									nodeKeyOne: this.nodeKeyOne1,
									nodeKeyTwo: this.nodeKeyTwo1
			},this.ruleTime)
			this.$store.dispatch('advancedSearchParams',obj)
			this.reload()
			this.cancel()
		},
		resetBtn() {
			this.ruleForm = {
				startTime: '',
				endTime: ''}
				this.value = ''
			this.nodeKey = []
			this.nodeKeyOne = []
			this.nodeKeyTwo = []
			this.startTime = '',
			this.endTime = ''
		},
		deleteTag(a,k) {
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
			this.nodeKey1.splice(k,1)
			this.$refs.tree.setCheckedKeys(this.nodeKey)
		},
		deletePost(k) {
			this.nodeKeyOne.splice(k,1)
			this.nodeKeyOne1.splice(k,1)
			this.form.post.splice(k,1)
			this.checkout=false
		},
		deleteAgence(k) {
			this.nodeKeyTwo.splice(k,1)
			this.nodeKeyTwo1.splice(k,1)
			this.form.recruiters.splice(k,1)
			this.checkbox=false
		},
		searchKeyUp(e) {
			if (e.target.value) {
				this.dataList = this.filterResult
			} else {
				this.dataList = this.resulatArr
			}
		},
		initPost() {
			this.$axios({
                method: 'post',
                url:this.$urls.getOutsidePostList,
                data:{
                    current:1,
                    size:9999
                }
            })
            .then(res=>{     
				// console.log(res) 
                this.certificateTwo = res.data.records
            })
            .catch(e=>{
                
            })
		},
		initGetAgency() {
			this.$axios({
                method: 'get',
                url:this.$urls.getAgency
            })
            .then(res=>{     
				// console.log(res) 
                this.certificateThe = res.data.content
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
				// console.log(res) 
				this.dataList = Object.values(this.$base.formattingJson(res.data))
				this.resulatArr = this.dataList 
				this.originalArray = res.data  
            })
            .catch(e=>{
                
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
	.formList{
		overflow:hidden;
		min-height:calc(100% - 134px);
		padding-top: 24px;
	}
	.height30{
		height: 30px;
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
        overflow:hidden;
        margin-left: -20px;
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
				margin-left: -25px;
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
    .departmentList{
		width:400px;
		height:208px;
		overflow-y:scroll;
		float:left;
		margin:5px 0 0px 77px;
		.departmentListContent{
			min-height:265px;
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
			.tagWrapdepartment{
				// overflow-y:scroll;
				float: left;
				width: 386px;
				height: 185px;
				line-height: 25px;
				font-size: 12px;
				padding: 0 22px;
				margin-top: 5px;
				.postlist{
					width: 300px;
					display: flex;
					flex-wrap: wrap;
					// margin-left: -80px;
					.allList{
						float: left;
						margin-left: -20px;
					}
				}
				.letter{
					font-size: 12px;
					color: #444950;
					}
				.nave{
					display: flex;
					width: 400px;
					flex-wrap: wrap;
					margin-left: -20px;
				}
			}
			.tagWrap{
				// overflow-y:scroll;
				float: left;
				width: 386px;
				height: 185px;
				line-height: 25px;
				font-size: 12px;
				padding: 0 22px;
				margin-top: 5px;
				.postlist{
					position: relative;
					display: flex;
					width: 400px;
					flex-wrap: wrap;
					.allChoose{
						position: absolute;
						top: 0;
						left: -20px;
						font-size: 10px;
						
					}
					.nave{
						display: flex;
						width: 400px;
						flex-wrap: wrap;
						margin-left: -88px;
						.letter{
							font-size: 12px;
							color: #444950;
							font-weight: normal;
						}
					}
				}
			}
			.tagWrapAgency{
				// overflow-y:scroll;
				float: left;
				width: 386px;
				height: 185px;
				line-height: 25px;
				font-size: 12px;
				padding: 0 22px;
				margin-top: 5px;
				.postlist{
					width: 300px;
					display: flex;
					flex-wrap: wrap;
					.allList{
						float: left;
						margin-left: -20px;
					}
				}
				.letter{
					font-size: 12px;
					color: #444950;
				}
				.idNumber{
					font-size: 12px;
					color: #999999;
					margin-left: 5px;
				}
				.AllLabor{
					display: flex;
					width: 400px;
					flex-wrap: wrap;
					margin-left: -88px;
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
			// margin: 14.5px 0px;
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
			margin-top: -28px;
			.centerLine{
				margin-top: 16px;
				margin-left: 20px;
			}
		}
		.agesize{
			.centerLine{
				float: left;
				margin-top: 28px;
				margin-left: 20px;
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
    .formListHeadTwo,.formListHeadOne{
        float: left;
        // overflow:hidden;
        margin-left: -20px;
        margin-top: 24px;
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
				margin-left: -25px;
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
            margin-left: 43px;
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
    .daterun{
        position: relative;
        float: left;
        margin-top: 24px;
        .height30{
            display: flex;
        }
        span{
            position: absolute;
            top: 6px;
            left: 266px;
            display: inline-block;
            width: 20px;
            color: #ccc;
            z-index: 11;
        }
    }
}
.transformpictureUp{
	position: relative;
	img{
		width: 8px;
		height: 5px;
		position: absolute;
		top: -17px;
		left: 88px;
		cursor: pointer;
		transition: all .2s;
	}
	.focus{
		transform: rotate(180deg);
	}
}
.transformpictureDown{
	position: relative;
	img{
		width: 8px;
		height: 5px;
		position: absolute;
		top: -17px;
		left: 7px;
		cursor: pointer;
		transition: all .2s;
	}
	.focus{
		transform: rotate(180deg);
	}
}
</style>
