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
							<div class="txt">用工部门：</div>
							<div class="department">
								<div class="all" v-if="departmentList.length==0">全部</div>
								<div class="departmentCheck" v-else v-for="(i,k) in departmentList" :key="k">
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
						<div class="departmentList" v-if="departmentListShow">
						<div class="departmentListContent sign">
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
								:props="defaultProps">
							</el-tree>
						</div>
					</div>
					</div>
					<!--  -->
                    <div style="clear:both"></div>
                    <div class="formListHead mt11">
						<div class="left">
							<div class="txt">招聘者：</div>
							<div class="department">
								<div class="all" v-if="agencyList.length==0">全部</div>
								<div class="departmentCheck" v-else v-for="(i,k) in agencyList" :key="k">
									<div class="tagTitle">{{i.name}}</div>
									<div class="deleteTag" @click="deleteTag1(k)">×</div>
								</div>
							</div>	
						</div>
						<div class="right" @click="agencyShow=!agencyShow">
							<div class="iconArrow" :class="{'agencyShow':agencyShow}"></div>
							<div class="txt" v-if="!agencyShow">展开</div>
							<div class="txt" v-else>收起</div>
						</div>
					</div>
					<div class="departmentList" v-if="agencyShow">
						<div class="departmentListContent sign">
							<div class="search">
								<div class="searchIcon icon-search"></div>
								<input type="text" placeholder="请输入关键字" v-model="value1"/>
							</div>	
							<el-tree
								:data="dataList1"
								show-checkbox
								node-key="id"
								ref="tree1"
								:check-strictly="true"
								@check="handleNodeClick1"
								:expand-on-click-node='false'
								:filter-node-method="filterNode"
								:props="defaultProps">
							</el-tree>
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
	name: 'advancedSearch1',
	props:['reload','searchTxt','type'],
		//  重新请求全部列表，搜索的字段文字，类型（不同菜单进入的高级搜索）
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
            departmentListShow: false,
            agencyShow: false,
            value: '',
            value1: '',
            dataList: [],
            dataList1: [],
            departmentList: [],
            agencyList: [],
	        defaultProps: {
	          	children: 'children',
	          	label: 'name'
	        },
		}
	},
	watch: {
		value(val) {
			this.$refs.tree.filter(val);
        },
        value1(val) {
			this.$refs.tree1.filter(val);
        },
        departmentListShow(val) {
            if(val) {
                this.$nextTick(()=>{
                    let arr = this.departmentList.map(i=>i.id)
			        this.$refs.tree.setCheckedKeys(arr,true)
                })
            }
        },
        agencyShow(val) {
            if(val) {
                this.$nextTick(()=>{
                    let arr = this.agencyList.map(i=>i.id)
			        this.$refs.tree1.setCheckedKeys(arr,true)
                })
            }
        },
    },
	created() {
		this.init()
	},
	mounted () {
		this.show = true
	},
	methods: {
		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('panelShow')
			}, 200)
        },
        handleNodeClick(checkedNodes,checkedKeys) {
            this.departmentList = checkedKeys.checkedNodes
        },
        handleNodeClick1(checkedNodes,checkedKeys) {
            this.agencyList = checkedKeys.checkedNodes
        },
		subBtn() {
			let obj = {
                departmentList:this.departmentList,
                agencyList: this.agencyList
            }
			this.$store.dispatch('advancedSearchParams',obj)
			this.reload()
			this.cancel()
		},
		resetBtn() {
            this.departmentList = []
            this.agencyList = []
            if(this.$refs.tree){
                this.$refs.tree.setCheckedKeys([],true)
            }
            if(this.$refs.tree1){
                this.$refs.tree1.setCheckedKeys([],true)
            }
		},
		deleteTag(k) {
            this.departmentList.splice(k,1)
            let arr = this.departmentList.map(i=>i.id)
            if(this.$refs.tree){
                this.$refs.tree.setCheckedKeys(arr,true)
            }
			
        },
        deleteTag1(k) {
            this.agencyList.splice(k,1)
            let arr = this.agencyList.map(i=>i.id)
            if(this.$refs.tree1){
                this.$refs.tree1.setCheckedKeys(arr,true)
            }
			
		},
		init() {
			this.$axios({
                method: 'get',
                url:this.$urls.departments
            })
            .then(res=>{
                // this.dataList = Object.values(this.$base.formattingJson(res.data))
                this.dataList = res.data
            })
            .catch(e=>{

            })	
            this.$axios({
                method: 'get',
                url:this.$urls.getAllAgency
            })
            .then(res=>{
                this.dataList1 = res.data
            })
            .catch(e=>{

			})	
            let obj = this.$store.state.recruitmentPlan.advancedSearchParams
            if(obj.departmentList){
                this.departmentList = obj.departmentList
                this.agencyList = obj.agencyList
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
    .mt11{
        margin-top: 11px;
    }
    .mt24{
        margin-top: 21px;
    }
	.fixed{
		width: 480px;
	}
	.floatL{
		float: left;
		width: 100%;
	}
	.height3{
		height: 3px;
	}
	.formList{
		overflow:hidden;
		min-height:calc(100% - 133px);
		padding-top: 22px;
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
				font-size:16px;
				height:27px;
				line-height:27px;
				// margin-top:24px;
				width: 80px;
			}
			.department{
				width:320px;
				overflow:hidden;
				float:left;
				// margin-top:24px;
				.all{
					line-height:27px;
					font-size:16px;
					height:27px;
					margin-left: 2px;
					margin-bottom: 10px;
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
						font-size: 14px;
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
				height:27px;
				line-height:27px;
			}
			.iconArrow{
				background: url('../../../assets/img/logo.png') no-repeat -203px -104px;
				width: 8px;
				height: 6px;
				margin:9px 0 0 5px;
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
					font-size: 14px;
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
	.mt7{
		margin-top: 7px;
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
			width: 28px;
			height: 20px;
			background-color: #4c8aff;
			border-radius: 14.5px;
			color:#fff;
			text-align:center;
			padding: 4px 30px;
			font-size:14px;
			margin:15px 0 0 140px;
			border:1px solid #4c8aff;
			cursor:pointer;
		}
		.resetBtn{
			float:left;
			width: 28px;
			height: 20px;
			padding: 4px 30px;
			border-radius: 14.5px;
			color:#4c8aff;
			text-align:center;
			font-size:14px;
			margin:15px 0 0 60px;
			border:1px solid #4c8aff;
			cursor:pointer;
		}
	}
}
	
</style>