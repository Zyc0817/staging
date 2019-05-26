<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt" v-if="$store.state.systemSettings.states.id">编辑</div>
						<div class="txt" v-else>新增账号</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div style="height:50px;" v-if="fixed"></div>
				<div class="contentWrap accountEdit inputHeight30 departmentEdit addEmploymentApplication">
					<el-form ref="form" :model="form" :rules="rules" label-width="80px" size="medium">
						<div class="height30 mb24">
                            <el-form-item label="姓名：">
                                <el-input v-model="form.name" placeholder="请输入"></el-input>
                            </el-form-item>
                        </div>
						<div class="height30 mb24">
                            <el-form-item label="岗位：">
                                <el-select v-model="form.postId"
                                            :popper-append-to-body="false"
                                            filterable 
                                            placeholder="请选择">
                                    <div class="searchDepartment">
                                        <div class="searchIcon"></div>
                                        <input type="text" name="" v-model="fuzzySearch" placeholder="请输入关键字">
                                    </div>
                                    <el-option
                                        v-for="(i,k) in filterResult"
                                        :key="k"
                                        :label="i.title"
                                        :value="i.id">       
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
						<div class="height30 mb24">
                            <el-form-item label="手机号：" prop="phone">
                                <div class="tel"><div>+86</div><i class="el-icon-caret-bottom icon"></i></div>
                                <div class="telInput">
                                    <el-input v-model="form.phone" placeholder="请输入"></el-input>
                                </div>
                            </el-form-item>
                        </div>
						<div class="height30 mb24">
                            <el-form-item label="登录账号：" prop="account">
							    <el-input v-model="form.account" :disabled="$store.state.systemSettings.states.id?true:false" placeholder="请输入工作邮箱"></el-input>
						    </el-form-item>
                        </div>
						<div class="item">
                            <div class="left">角色名称：</div>
                            <div class="right width">
                                <div class="tagWrap mb10" v-for="(i,k) in selectTagWrap" :key="k">
                                    <div class="tag">{{i.roleName}}</div>
                                    <div class="delete" @click.stop="delBtn(k)">×</div>
                                </div>
                                <div class="addBtn" @click='dialogVisible=true'>
                                    <div class="icon"></div>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="item mt30">
                            <div class="left">管理范围
                                <el-tooltip class="item" effect="light" placement="bottom">
                                    <div slot="content">管理范围涉及用工申请、签到签退、员工<br/>上班、员工档案、用工费用和报表中心，<br/>其他模块没有管理范围限制</div>
                                    <img src="../../../assets/img/icon3x.svg" alt="">
                                </el-tooltip>
                                ：
                            </div>
                            <div class="right">
                                <div class="radioWrap">
                                    <el-radio v-model="form.scope" label="dept">所在部门</el-radio>
                                </div>
                                <div class="radioWrap">
                                    <el-radio v-model="form.scope" label="group">所在部门及子部门</el-radio>
                                </div>
                                <div class="radioWrap">
                                    <el-radio v-model="form.scope" label="all">全公司</el-radio>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
					</el-form>
				</div>
				<div class="subBtnWrap">
					<div class="subBtn" @click="subBtn1">确定</div>
					<div class="resetBtn" @click="cancel">取消</div>
				</div>
			</div>
		</transition>
        <el-dialog
            title="添加角色名称"
            :visible.sync="dialogVisible"
            width="600px"
            top="30.3vh"
            :modal-append-to-body="false"
            height="420px">
            <div class="body">
                <div class="addTagWrap">
                    <div class="tagWrap" @click="tagCheck(i,k)" v-for="(i,k) in tagWrap" :key='k' :class="{'selectTag':i.check}">{{i.roleName}}</div>
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
import mixin from '../../../assets/js/mixin/mixin'
export default {
    name: 'accountEdit',
    mixins: [mixin],
    props:['departments','reload'],
	data () {
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            } else {
                const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/
                console.log(reg.test(value));
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('请输入正确的手机号'));
                }
            }
        }
        var checkEmail = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('登录账号不能为空'));
            } else {
                const reg = /^([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-]+)?@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
                console.log(reg.test(value));
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('请输入正确的邮箱'));
                }
            }
        }
		return {
			show: false,
			_timeOut: '',
			form: {
                name: '',
                phone : '',
                account : '',
                scope : 'dept',
                roleList: [],
                postId: '',
                userId:'',
            },
            dialogVisible: false,
            departmentList: [],
            tagWrap: [],
            selectTagWrap: [],
            fuzzySearch: '',
            rules: {
				phone: [
                    { required: true, validator: checkPhone, message: '请输入正确手机号', trigger: 'blur' }
                ],
                account: [
                    { required: true, validator: checkEmail, trigger: 'blur' }
                ],
			},
		}
    },
    watch:{
        dialogVisible(val) {
            if(val){
                this.dialogInit()
            }
        },
        filterResult(val) {
            if(!val.length) {
                this.$nextTick(()=>{
                    document.getElementsByClassName('el-scrollbar')[0].style.display="block"
                })
            }
        }
    },
    computed: {
        filterResult() {
            return this.departmentList.filter(value => new RegExp(this.fuzzySearch, 'i').test(value.title))
            if(!fil.length) {
                return [{title:'无数据'}]
            }else{
                return fil
            }
        }
    },
    created() {
        this.init()
        this.getCharacter()
    },
	mounted () {
		this.show = true
	},
	methods: {
        delBtn(k) {
            this.selectTagWrap.splice(k,1)
        },
        dialogInit() {
            this.tagWrap.forEach(i=>{
                i.check = false
            })
            console.log(this.selectTagWrap)
            this.selectTagWrap.forEach(item=>{
                this.tagWrap.forEach(i=>{
                    if(i.roleName==item.roleName){
                        i.check = true
                    }
                })
            })
            this.tagWrap = [].concat(this.tagWrap)
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.posts,
                params: {
                    departmentIds:this.departments.id,
                    scope:'inside'
                }
            })
            .then(res=>{
                this.departmentList = res.data
            })
            .catch(e=>{
                this.departmentList = []
            })
            if(this.$store.state.systemSettings.states.id){
                this.$axios({
                    method: 'get',
                    url:this.$urls.userGetvo+this.$store.state.systemSettings.states.id
                })
                .then(res=>{
                    // console.log(res)
                    this.form.name = res.data.name
                    this.form.phone = res.data.phone
                    this.form.account = res.data.account
                    this.form.scope = res.data.scope
                    this.form.postId = res.data.postId
                    res.data.roleList.forEach(i=>{
                        this.form.roleList.push({id:i.id,roleName:i.roleName})
                    })
                    this.selectTagWrap = this.form.roleList.map(i=>i)
                })
                .catch(e=>{

                })
            }
        },
        getCharacter() {
            this.$axios({
                method: 'get',
                url:this.$urls.roleGet,
            })
            .then(res=>{
                this.tagWrap = res.data
            })
            .catch(e=>{
                this.tagWrap = []
            })
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('accountEdit')
			}, 200)
        },
        subBtn1(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.subBtn()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
		subBtn() {

            if(!this.form.name&&!this.form.postId&&!this.form.phone&&!this.form.account&&!this.form.scope){
                this.$message({
					message: "请完善账号信息",
					type: 'error',
					duration: 5 * 1000
                })
                return
            }
            if(!this.selectTagWrap.length){
                this.$message({
					message: "请选择角色名称",
					type: 'error',
					duration: 5 * 1000
                })
                return
            }
            if(this.$store.state.systemSettings.states.id){
                this.form.userId = this.$store.state.systemSettings.states.id
            }
            this.form.roleList = []
            this.selectTagWrap.forEach(i=>{
                this.form.roleList.push({id:i.id,roleName:i.roleName})
            })
            this.$axios({
                method: 'post',
                url:this.$urls.saveAccount,
                data:this.form
            })
            .then(res=>{
                console.log(res)
                if(res.data.status == 200){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                    // this.email()
                    this.reload()
                    this.cancel()
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
        email() {
            this.$axios({
                method: 'post',
                url:this.$urls.userEmail+this.form.account,
            })
            .then(res=>{
                if(res.data.code == 0){

                }else{

                }
            })
            .catch(e=>{

            })
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
        tagCheck(i,k) {
            this.tagWrap.forEach((item,key)=>{
                if (i.roleName == item.roleName) {
                    item.check = !item.check
                }
            })
            this.tagWrap = [].concat(this.tagWrap)
        }


	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.border{
	width: 280px;
	height: 150px;
	border-radius: 1px;
    border: solid 1px #ececec;
    overflow-y: scroll;
    float: right;
    padding-top: 10px;
    box-sizing: border-box;
}
.border::-webkit-scrollbar {
    display:none;
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
            height: 25px;
            line-height: 25px;
            border: 1px solid #ececec;
            background-color: #ffffff;
            border-radius: 1px;
            color: #999999;
            font-size: 12px;
            padding: 0 10px;
            float: left;
            margin-bottom: 20px;
            margin-right: 20px;
            text-align: center;
        }
        .selectTag{
            border: solid 1px #4c8aff;
            color: #4c8aff;
        }
    }
}
.dialogBtn{
    left: 190px;
}
.panel{
    width:400px;
    .mb10{
        margin-bottom: 10px;
    }
    .height30{
        height: 30px;
    }
    .mb24{
        margin-bottom: 24px;
    }
	.contentWrap{
		padding: 24px 20px;
		min-height: calc(100% - 159px);
		.checkTxt{
			font-size: 12px;
			color: #666666;
        }
        .tel{
            float: left;
            width: 60px;
            height: 30px;
            box-sizing: border-box;
            border: 1px solid #ececec;
            line-height: 28px;
            text-indent: 10px;
            border-radius: 1px;
            margin-top: 0.5px;
            div{
                float: left;
                width: 26px;
                font-size: 12px;
            }
            .icon{
                float: left;
                margin-top: 6px;
                color:#999999;
            }
        }
        .telInput{
            float: left;
            margin-left: 10px;
            height: 30px;
            width: 210px;
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
                .radioWrap{
                    height: 27px;
                    line-height: 27px;
                    margin-bottom: 10px;
                }
                .addBtn{
                    width: 78px;
                    height: 25px;
                    background-color: #ffffff;
                    border-radius: 1px;
                    border: dashed 1px #4c8aff;
                    float: left;
                    margin-bottom: 10px;
                    .icon{
                        background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
                        width: 14px;
                        height: 14px;
                        margin: 6px auto;
                    }
                }
                .tagWrap{
                    width: 80px;
                    text-align: center;
                    height: 27px;
                    line-height: 27px;
                    border: 1px solid #4c8aff;
                    color: #4c8aff;
                    position: relative;
                    float: left;
                    border-radius: 1px;
                    margin-right: 10px;
                    box-sizing: border-box;
                    .tag{
                        margin: 0 auto;
                        width: 78%;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap
                    }
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
            .width{
                width: 280px;
            }
            .clear{
                clear: both;
            }
        }
        .mt30{
            margin-top: 14px;
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
