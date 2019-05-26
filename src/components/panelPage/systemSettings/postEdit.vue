<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt" v-if="$store.state.systemSettings.states.id&&$store.state.systemSettings.states.type=='edit'">编辑</div>
                        <div class="txt" v-else>新增岗位</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="searchDepartmentWrap applyList" ref="applyList" v-if="searchDepartmentWrapShow">
					<div class="searchDepartment">
						<div class="searchIcon"></div>
						<input type="text" name="" v-model="val" placeholder="请输入关键字">
					</div>
					<div class="treeList">
						<el-tree 
							:data="departmentList" 
							:props="defaultProps" 
                            ref="tree"
							:filter-node-method="filterNode"
							@node-click="handleNodeClick">
						</el-tree>
					</div>
				</div>
				<div class="contentWrap postEdit addEmploymentApplication inputHeight30">
					<el-form ref="form" :model="form" label-width="80px" size="medium">
						<div class="height30 mb24">
                            <el-form-item label="岗位名称：">
                                <el-input v-model="form.title" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
						<div class="height30 mb24">
                            <el-form-item label="所属部门：">
                                <div @click="searchDepartmentWrapShow=!searchDepartmentWrapShow">
                                    <el-input 
                                        v-model="form.department" 
                                        popper-class="applyList" 
                                        placeholder="请选择"></el-input>
                                </div>
                            </el-form-item>
                        </div>
                        <!-- <div class="radioWrap mb24">
                            <div class="label">岗位性质：</div>
                            <div style="float:left">
                                <div class="mb20">
                                    <el-radio v-model="form.scope" label="inside">内部管理</el-radio>   
                                    <span class="txt">(用于添加账号、流程审批)</span>
                                </div>
                                <div>
                                    <el-radio v-model="form.scope" label="outside">对外招聘</el-radio>
                                    <span class="txt">(用工申请时选择的岗位)</span>
                                </div>    
                            </div>  
                            <div class="clear"></div>
                        </div>
                        <div v-if="this.form.scope=='outside'">
                            <div class="radioWrap mb24">
                                <div class="label">签到控制：</div>
                                <div style="float:left">
                                    <div class="mb20">
                                        <el-radio v-model="form.signOverControl" label="reject">大于计划人数时不予签到</el-radio>   
                                    </div>
                                    <div class="mb20">
                                        <el-radio v-model="form.signOverControl" label="confirm">大于计划人数时仅给出提示，可继续签到</el-radio>     
                                    </div>   
                                    <div>
                                        <el-radio v-model="form.signOverControl" label="limited">
                                            超出计划<input type="text" v-model="form.signOverLimited" class="sign">人以上时不予签到
                                        </el-radio>     
                                    </div>      
                                </div>
                            </div>
                            <div class="item">
                                <div class="left">必备从业资格证
                                    <el-tooltip effect="light" content="若该岗位的员工没有必备从业资格证，则无法签到成功" placement="bottom">
                                        <img src="../../../assets/img/icon3x.svg" alt="">
                                    </el-tooltip>
                                    ：
                                </div>
                                <div class="right">
                                    <div class="tagWrap" v-for="(i,k) in selectTagWrap" :key="k">
                                        <div class="tag">{{i.name}}</div>
                                        <div class="delete" @click="deleteTag(k)">×</div>
                                    </div>
                                    <div class="addBtn" @click='dialogVisible=true'>
                                        <div class="icon"></div>
                                    </div>
                                </div>
                            </div>
                        </div> -->
					</el-form>
                    
				</div>
				<div class="subBtnWrap">
					<div class="subBtn" @click="subBtn">确定</div>
					<div class="resetBtn" @click="cancel">取消</div>
				</div>		
			</div>
		</transition>
        <el-dialog
            title="添加从业资格证"
            :visible.sync="dialogVisible"
            width="600px"
            top="30.3vh"
            :modal-append-to-body="false"
            height="420px">
            <div class="body">
                <div class="addTagWrap">
                    <div class="search">
                        <div class="searchIcon icon-search"></div>
                        <input type="text" placeholder="请输入关键字" v-model="value"/>
                    </div>	
                    <div class="tagWrap" @click="tagCheck(i,k)" v-for="(i,k) in filterResult" :key='k' :class="{'selectTag':i.check}">{{i.name}}</div>
                </div>
                <div class="dialogBtn">
                    <div class="sub" @click="sure">确定</div>
                    <div class="cancel" @click="dialogVisible=false">取消</div>
                </div>  
            </div>
        </el-dialog>
	</div>
</template>
<script>
export default {
    name: 'postEdit',
    props: ['reload','department'],
	data () {
		return {
			show: false, 
			_timeOut: '',
			form: {
                title: '',
                departmentId: '',
                department: '',
                scope: 'inside',
                signOverLimited : '',
                signOverControl: '',
                id:''
            },
            dialogVisible: false,
            value: '',
            tagWrap: [],
            selectTagWrap: [],
            departmentList: [],
            searchDepartmentWrapShow: false,
            val: '',
            defaultProps: {
				children: 'children',
				label: 'name'
			},

		}
    },
    computed: {
        filterResult() {
            return this.tagWrap.filter(value => new RegExp(this.value, 'i').test(value.name))
		},
    },
    watch: {
        dialogVisible(val) {
            if (val) {
                this.tagInit()
            }
        },
        val(val) {
			this.$refs.tree.filter(val);
		}
    },
    created() {
        this.init()
    },
	mounted () {
        this.show = true
        setTimeout(()=>{
            this.tagInit()
        },200)
        document.addEventListener('click',(e)=>{
			if(this.$refs.applyList&&!this.$refs.applyList.contains(e.target)){
				this.searchDepartmentWrapShow = false
			}
		})
	},
	methods: {
        filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},
        handleNodeClick(data) {
			this.searchDepartmentWrapShow = false
			this.form.departmentId = data.id
			this.form.department = data.name
		},
        handleChange(data){
            this.form.department = this.departmentList.find(i=>i.id==data).name
        },
        subBtn() {
            if(!this.form.title||!this.form.departmentId||!this.form.scope){
                this.$message({
                    message: "请完善岗位信息",
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
            let arr = []
            this.selectTagWrap.forEach(i=>{
                arr.push({certTypeId:i.id,certName:i.name})
            })
            if(this.$store.state.systemSettings.states.type=="edit"){
                this.form.id = this.$store.state.systemSettings.states.id
            }
            this.$axios({
                method: 'post',
                url:this.$store.state.systemSettings.states.type=='edit'?this.$urls.updatePost:this.$urls.addPost,
                data:Object.assign({post:this.form},{postCertList:arr})
            })
            .then(res=>{
               	if(this.$store.state.systemSettings.states.type!='edit'&&res.data.status==200){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                    this.cancel()
                    this.reload()
                    return 
                } else if(this.$store.state.systemSettings.states.type!='edit'&&res.data.status!=200) {
                    this.$message({
                        message: res.data.message||"操作失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
                    return 
                }
                if(this.$store.state.systemSettings.states.id&&res.data.code==0){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                    this.cancel()
                    this.reload()
                    return 
                } else {
                    this.$message({
                        message: res.data.msg||"操作失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            })
            .catch(e=>{

            })	
        },
        deleteTag(k) {
            this.selectTagWrap.splice(k,1)
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.departments
            })
            .then(res=>{
               	this.departmentList = res.data    
                if(this.department.id) {
                    this.form.departmentId = this.department.id
                }
                
            })
            .catch(e=>{

            })	
            if(this.$store.state.systemSettings.states.id){
                this.$axios({
                    method: 'get',
                    url:this.$urls.getPost,
                    params:{postId:this.$store.state.systemSettings.states.id}
                })
                .then(res=>{
                    console.log(res.data)
                    this.form.title = res.data.post.title
                    this.form.departmentId = res.data.post.departmentId
                    this.form.scope = res.data.post.scope
                    this.form.department = res.data.post.department
                    this.form.signOverControl = res.data.post.signOverControl
                    this.form.signOverLimited = res.data.post.signOverLimited
                    res.data.postCertList.forEach(i=>{
                        let obj = {}
                        obj.check = true
                        obj.id = i.certTypeId
                        obj.name = i.certName
                        this.selectTagWrap.push(obj)
                    })
                })
                .catch(e=>{

                })	
            }
        },
        tagCheck(i,k) {
            this.tagWrap.forEach((item,key)=>{
                if (i.name == item.name) {
                    item.check = !item.check
                }
            })   
            this.tagWrap = [].concat(this.tagWrap)
        },
        tagInit() {
            this.value = ''
            this.$axios({
                method: 'get',
                url:this.$urls.getCertType
            })
            .then(res=>{
                this.tagWrap = res.data    
                this.tagWrap.forEach((i)=>{
                    i.check = false
                })
                this.selectTagWrap.forEach(i=>{
                    this.tagWrap.forEach(item=>{
                        if(i.name==item.name){
                            item.check = true
                        }
                    })
                })
                this.tagWrap = [].concat(this.tagWrap)
            })
            .catch(e=>{

            })	
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('postEdit')
			}, 200)
		},
        sure() {
            this.selectTagWrap = []
            this.tagWrap.forEach(i=>{
                if(i.check){
                    this.selectTagWrap.push(i)
                }
            })
            this.dialogVisible = false
        },
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.searchDepartmentWrap{
	width: 278px;
	height: 210px;
	background-color: #ffffff;
	box-shadow: 0px 0px 5px 0px rgba(68, 73, 80, 0.1);
	position: absolute;
	z-index: 10;
	top:167px;
	left: 101px;
	padding-top: 6px;
	box-sizing: border-box;
}
.searchDepartment{
	height:30px;
	margin:4px 5px 10px 5px;
	border: solid 1px #ececec;
	.searchIcon{
		background: url('../../../assets/img/logo.png') no-repeat -145px -31px;
		width: 26px;
		height: 26px;
		float:left;
		transform:scale(.6);
		margin: 1px 5px 0 5px;
	}
	input{
		float:left;
		height:100%;
		box-sizing:border-box;
		border:none;
		outline:none;
		color:#999;
		font-size: 12px;
		width: 120px;
	}
	input::-webkit-input-placeholder{
		color:#d4d4d4;
	}
	input::-moz-placeholder{   /* Mozilla Firefox 19+ */
		color:#d4d4d4;
	}
	input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
		color:#d4d4d4;
	}
	input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
		color:#d4d4d4;
	}
}
.body{
    min-height: 338px;
    .addTagWrap{
        width: 560px;
        height: 259px;
        background-color: #f4f8fc;
        margin: 20px auto;
        padding: 20px;
        box-sizing: border-box;
        .tagWrap{
            min-width: 58px;
            text-align: center;
            height: 25px;
            line-height: 25px;
            border: 1px solid #ececec;
            background-color: #ffffff;
            border-radius: 1px;
            color: #999999;
            font-size: 12px;
            padding: 0 10px;
            float: left;
            margin-top: 20px;
            margin-right: 20px;
        }
        .selectTag{
            border: solid 1px #4c8aff;
            color: #4c8aff;
        }
        .search{	
            width:520px;
            height:29px;
            margin:0 auto;
            background-color:#fff;
            border: solid 1px #ececec;
            .searchIcon{
                float:left;
                margin:8px 0 0 12px;
                font-size: 14px;
            }
            input{
                float:left;
                border:none;
                outline:none;
                height:100%;
                width:450px;
                padding:0 0 0 10px;
                color:#999;
                font-size: 12px;
                color: #d4d4d4;
            }
            input::-webkit-input-placeholder{
                color:#d4d4d4;
            }
            input::-moz-placeholder{   /* Mozilla Firefox 19+ */
                color:#d4d4d4;
            }
            input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                color:#d4d4d4;
            }
            input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                color:#d4d4d4;
            }
        }
    }
}
.dialogBtn{
    left: 190px;
}
.panel{
    width:400px;
    .height30{
        height: 30px;
    }
    .mb24{
        margin-bottom: 24px;
    }
    .mb20{
        margin-bottom: 20px;
    }
	.contentWrap{
		padding: 24px 20px 30px 20px;
        min-height: calc(100% - 165px);
        .sign{
            width: 60px;
            border: none;
            outline: none;
            border-bottom: 1px solid #d4d4d4;
            text-align: center;
            margin:0 10px;
        }
        .radioWrap{
            overflow: hidden;
            .label{
                float: left;
                font-size: 14px;
                color: #444950;
                line-height: 1;
            }     
        }
        .txt{
            font-size: 12px;
            color: #999999;
            position: relative;
            top: 1px;
            left: 10px;
        }
        .item{
            .left{
                float: left;
                font-size: 14px;
                color: #444950;
                height: 27px;
                line-height: 27px;
                img{
                    width: 12px;
                    height: 12px;
                }
            }
            .right{
                float: left;
                margin-left: 10px;
                width: 215px;
                .addBtn{
                    width: 78px;
                    height: 25px;
                    background-color: #ffffff;
                    border-radius: 1px;
                    border: dashed 1px #4c8aff;
                    float: left;
                    .icon{
                        background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
                        width: 14px;
                        height: 14px;
                        margin: 6px auto;
                    }
                }
                .tagWrap{
                    min-width: 58px;
                    text-align: center;
                    padding: 0 10px;
                    height: 25px;
                    line-height: 25px;
                    border: 1px solid #4c8aff;
                    color: #4c8aff;
                    position: relative;
                    float: left;
                    border-radius: 1px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    .delete{
                        position: absolute;
                        width: 14px;
                        height: 14px;
                        background-color: #4c8aff;
                        color: #fff;
                        top: -7px;
                        right: -7px;
                        text-align: center;
                        line-height: 12px;
                        border-radius: 50%;

                    }

                }
            }
            .clear{
                clear: both;
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