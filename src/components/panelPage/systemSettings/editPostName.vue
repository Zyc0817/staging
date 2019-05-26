<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">编辑岗位</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="editContent">
                    <el-form :model="ruleForm" ref="ruleForm" size="medium" class="demo-ruleForm">
                        <div class="serialNumber">
                            <el-form-item label="岗位名称：" style="width:380px;">
                                <el-input v-model="ruleForm.postName" placeholder="请输入" style="margin-left:10px;"></el-input>
                            </el-form-item>
                        </div>
                        <div class="userDepartment">
                            <el-form-item label="用工部门：" style="width:380px;">
                                <div class="userDepartmentBorder">
                                    <div class="tagWrap" v-for="(i,k) in departmentList" :key="k">
                                        <div class="tag">{{i.name}}</div> 
                                        <div class="delete" @click="deleteDepartment(k)">×</div>
                                    </div>
                                    <div class="clickDepartment" @click="dialogVisibleOne=true">
                                        <div class="icon"></div>
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                        <div class="deviceManager">
                            <div class="deviceManagerTitle">必备从业资格证<span></span>：</div>
                                <div class="userDepartmentBorder">
                                    <div class="tagWrap" v-for="(item,key) in equipmentList" :key="key">
                                        <div class="tag">{{item.certName}}</div>   
                                        <div class="delete" @click="deviceManager(key)">×</div>
                                    </div>
                                    <div class="clickDepartment" @click="dialogVisible=true">
                                        <div class="icon"></div>
                                    </div>
                                </div>
                            </div>
                    </el-form>
                </div>
                <div class="btnWrap">
                    <div class="sub2" @click="confirm">确定</div>
                    <div class="sub3" @click="cancel">取消</div>
                </div>
                <div class="userdepartement">
                    <el-dialog
                        title="用工部门"
                        :visible.sync="dialogVisibleOne"
                        :modal-append-to-body="false"
                        width="600px"
                        top="28vh">
                        <div class="body">
                            <div class="useWrap">
                                <div class="left">
                                    <div class="divider"></div>
                                    <div class="search">
                                        <div class="searchIcon icon-search"></div>
                                        <input type="text" placeholder="请输入关键字" style="width:168px;height:28px;padding-left:30px;border:1px solid #d4d4d4;outline:none;" v-model="useValue"/>
                                    </div>	
                                    <div class="treeWrap processEdit">
                                        <el-tree
                                            class="filter-tree"
                                            show-checkbox
                                            :data="menuData"
                                            :props="defaultProps"
                                            :expand-on-click-node='false'
                                            @check='getKey'
                                            default-expand-all
                                            :check-strictly="true"
                                            :check-on-click-node="true"
                                            :filter-node-method="filterNode"
                                            node-key="id"
                                            ref="tree">
                                            <span class="custom-tree-node" slot-scope="{node}">
                                                <span class="label"><i class="icon"></i>{{ node.label }}</span>
                                            </span>
                                        </el-tree>
                                    </div>
                                </div>
                                <div class="right">
                                    <div class="title">已选择的用工部门：</div>
                                    <div class="theparcel">
                                        <div class="selectItem" v-for="(i,k) in checkedNodes" :key='k' @mouseenter="blueShowOn(k)" @mouseleave="blueShowOff(k)">
                                            <div class="icon"></div>
                                            <div class="txt">{{i.name}}</div>
                                            <div class="deleteBtn" :class="{'blue':blueShow[k]}" @click="deleteSelect(i,k)">×</div>    
                                        </div> 
                                    </div>
                                </div>
                            </div>
                            <div class="dialogButton">
                                <div class="sub" @click="sure">确定</div>
                                <div class="cancel" @click="dialogVisibleOne=false">取消</div>
                            </div>  
                        </div>
                    </el-dialog>
                </div>  
                <div class="deviceKeeper">
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
                                    <input type="text" placeholder="请输入关键字" style="width:490px;height:33px;padding-left:30px;border:1px solid #d4d4d4;outline:none;" v-model="useValue1"/>
                                </div>
                                <div class="tagWrapTop"><div class="tagWrap" @click="tagCheck(i,k)" v-for="(i,k) in tagWrap" :key='k' :class="{'selectTag':i.check}">{{i.name}}</div></div>
                            </div>
                            <div class="dialogBtnCert">
                                <div class="sure" @click="sure1">确定</div>
                                <div class="cancelCert" @click="dialogVisible=false">取消</div>
                            </div>
                        </div>
                    </el-dialog>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
    name: 'editPostName',
    props:['roledEdit'],
    mixins: [mixin],
	data () {
		return {
            show: false,
            ruleForm: {
                postName: '',
            },
            defaultProps: {
	          	children: 'children',
	          	label: 'name'
            },
            dialogVisible: false,
            dialogVisibleOne: false,
            dialogVisibleTwo: false,
            blueShow: [],
            equipmentList: [],
            equipmentList1: [],
            departmentList: [],
            departmentList1: [],
            menuData: [],
            post: [],
            checkedNodes: [],
            checkedNodes1: [],
            useValue: '',
            useValue1: '',
            departmentId: '',
            id: '',
            tagWrap: [],
            chooseList: [],
            userdepart: [],
            userdep: [],
            usercert: [],
            usercert1: [],
            usercert2: [],
            createTime: '',
            creator: '',
            department: '',
            departmentId: '',
            hotalId: ''
		}
    },
    watch: {
        useValue(val) {
            this.$refs.tree.filter(val);
        },
        useValue1(val) {   
            this.tagWrap.forEach(i=>{
                if(i.name===val){
                    this.tagWrap=[]
                    this.tagWrap.push(i)
                }
                if(i.name!==val){
                    this.tagWrap = this.tagWrap
                }
                if(!val){
                    this.getCharacter()
                }
            })
        },
        dialogVisible(val) {
            if(val){
                this.dialogInit()
            }
        },
        dialogVisibleOne(val) {
            if(val){
                this.dialogInit1()
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
        dialogInit() {
            this.equipmentList.forEach(item=>{
                this.tagWrap.forEach(i=>{
                    if(i.name==item.certName){
                        i.check = true
                    }
                })
            })
            this.tagWrap = [].concat(this.tagWrap)
        },
        dialogInit1() {
            this.checkedNodes = this.departmentList.map(i=>i)
            let arr = this.departmentList.map(i=>i.id)
            this.$nextTick(()=>{
                this.$refs.tree.setCheckedKeys(arr)
            })    
        },
        tagCheck(i,k) {
            this.tagWrap.forEach((item,key)=>{
                if (i.name == item.name) {
                    item.check = !item.check
                }
            })
            this.tagWrap = [].concat(this.tagWrap)
            
        },
        getCharacter() {
            this.$axios({
                method: 'get',
                url:this.$urls.getCertType,
            })
            .then(res=>{
                this.tagWrap = res.data
                for(let i=0;i<this.tagWrap.length;i++){
                   this.chooseList.push(false)
                }
            })
            .catch(e=>{
                this.tagWrap = []
            })
        },
        sure() { 
            this.departmentList = this.checkedNodes.map(i=>i)
            this.dialogVisibleOne = false
        },
        sure1() {
            let arr = []
            this.equipmentList = []
            this.tagWrap.forEach(i=>{
                if(i.check){
                    arr.push({
                        id:i.id,
                        certName:i.name
                    })
                    this.usercert.push({
                        certTypeId: i.id
                    })
                }
            })
            this.equipmentList = [...new Set(arr)]
            this.dialogVisible = false
        },
        deleteSelect(i,k) {
            this.checkedNodes.splice(k,1)
            let arr =[]
            this.checkedNodes.forEach(i=>{
                arr.push(i.id)
            })
            this.$refs.tree.setCheckedKeys(arr)
        },
        deleteSelect1(k) {
            this.checkedNodes1.splice(k,1)
            let arr =[]
            this.checkedNodes1.forEach(i=>{
                arr.push(i.id)
            })
            this.$refs.tree1.setCheckedKeys(arr)
        },
        init() {
            this.$axios({
                method: 'get',
                url: this.$urls.getOutsidePost,
                params: { postId: this.$store.state.systemSettings.id }
            }).then(res=>{
                this.ruleForm.postName = res.data.content.title
                this.departmentList = res.data.content.postDepartments.map(i=>{
                    return {
                        id: i.departmentId,
                        name: i.department
                    }
                })
                
                this.departmentList.forEach(i=>{
                    this.userdep.push(i.departmentId)
                })
                this.departmentList1 = res.data.content.postDepartments
                this.equipmentList = res.data.content.postCertList
                this.equipmentList.forEach(i=>{
                    this.usercert2.push({
                        certTypeId: i.certTypeId
                    })
                })
                this.equipmentList1 = res.data.content.postCertList
                this.id = res.data.content.id
                this.createTime = res.data.content.createTime
                this.creator = res.data.content.creator
                this.department = res.data.content.department
                this.departmentId = res.data.content.departmentId
                this.hotalId = res.data.content.hotalId
            })
            this.$axios({
                method: 'get',
                url:this.$urls.departments
            }).then(res=>{
               	this.menuData = Object.values(this.$base.formattingJson(res.data))       
            }).catch(e=>{

            })
        },
        getKey(checkedNodes,checkedKeys) {
            this.checkedNodes = checkedKeys.checkedNodes
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        confirm() {
            let arrDepartment = []
            this.departmentList.map(i=>{
                arrDepartment.push(i.id)
            })
            this.$axios({
                method: 'post',
                url: this.$urls.updateOutsidePost,
                data: { 
                    departmentIds: arrDepartment,
                    post: { 
                        createTime:this.createTime,
                        creator: this.creator,
                        department: this.department,
                        departmentId: this.departmentId,
                        hotalId: this.hotalId,
                        id: this.id,
                        scope: 'outside',
                        title: this.ruleForm.postName
                     },
                    postCertList: this.usercert.length==0?this.usercert2:this.usercert
                }
            }).then(res=>{
                if(res.data.status==200){
                    this.roledEdit()
                    this.$message({
                        message: '编辑成功',
                        type: 'success',
                        duration: 5*1000
                    })
                }else{
                    this.$message({
                        message: '编辑失败',
                        type: 'error',
                        duration: 5*1000
                    })
                }
            })
            this.cancel()
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('editPostName')
			}, 200)
        },
        deleteDepartment(k) {
            this.departmentList.splice(k,1)
            if(this.userdep.length!=0){
                this.userdep.splice(k,1)
            }
            if(this.usercert1.length!=0){
                this.usercert1.splice(k,1)
            }

        },
		deviceManager(k) {
           this.equipmentList.splice(k,1)
           if(this.usercert2.length!=0){
                this.usercert2.splice(k,1)
            }
            if(this.usercert.length!=0){
                this.usercert.splice(k,1)
            }
        },
        blueShowOn(k) {
            this.blueShow=this.blueShow.map((i,key)=>{
                if(key == k){
                    return true
                }
            })
        },
        blueShowOff(k) {
            this.blueShow=this.blueShow.map((i,key)=>{
                if(key == k){
                    return false
                }
            })
        }
	},
	destroyed() {
		clearTimeout(this._timeOut)
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
    overflow-y: scroll;
    width:400px;
    .editContent{
        margin-top: 24px;
        min-height: calc(100% - 135px);
        .serialNumber,.userDepartment,.deviceManager{
            margin-left: 20px;
            margin-top: 21px;
        }
        .userDepartment{
            .userDepartmentBorder{
                display: flex;
                flex-wrap: wrap;
                width: 185px;
                margin-left: 135px;
                margin-top: -8px;
                .tagWrap{
                    position: relative;
                    margin-top: 10px;
                    .tag{
                        width: 80px;
                        height: 27px;
                        text-align: center;
                        line-height: 27px;
                        color: #4c8aff;
                        border: 1px solid #4c8aff;
                    }
                    .delete{
                        position: absolute;
                        top:-7px;
                        left: 74px;
                        width: 14px;
                        height: 14px;
                        background: #4c8aff;
                        border-radius: 100%;
                        text-align: center;
                        line-height: 14px;
                        color: #fff;
                    }
                }
                .tagWrap:nth-child(2n-1){
                    margin-left: 0px;
                    margin-right: 10px;
                }
                .clickDepartment{
                    float: left;
                    width: 80px;
                    height: 27px;
                    margin-top: 10px;
                    cursor: pointer;
                    border: 1px dashed #4c8aff;
                    .icon{
                        background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
                        width: 14px;
                        height: 14px;
                        margin: 6px auto;
                    }
                }
            }
        }
        .deviceManager{
            display: flex;
            .deviceManagerTitle{
                width: 135px;
                font-size: 14px;
                color: #444950;
                // background: #ccc;
                span{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    margin-left: 5px;
                    margin-right: 5px;
                    border-radius: 100%;
                    background: url('../../../assets/img/logo.png') no-repeat -326px -160px;
                }
            }
            .userDepartmentBorder{
                display: flex;
                flex-wrap: wrap;
                width: 185px;
                margin-top: -12px;
                .tagWrap{
                    position: relative;
                    margin-top: 10px;
                    .tag{
                        width: 85px;
                        height: 27px;
                        text-align: center;
                        line-height: 27px;
                        color: #4c8aff;
                        font-size: 14px;
                        border: 1px solid #4c8aff;
                    }
                    .delete{
                        position: absolute;
                        top:-7px;
                        left: 78.5px;
                        width: 14px;
                        height: 14px;
                        background: #4c8aff;
                        border-radius: 100%;
                        text-align: center;
                        line-height: 14px;
                        color: #fff;
                    }
                }
                .tagWrap:nth-child(2n-1){
                    margin-left: 0px;
                    margin-right: 10px;
                }
                .clickDepartment{
                    float: left;
                    width: 80px;
                    height: 27px;
                    margin-top: 10px;
                    cursor: pointer;
                    border: 1px dashed #4c8aff;
                    .icon{
                        background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
                        width: 14px;
                        height: 14px;
                        margin: 6px auto;
                    }
                }
            }
        }
    }
    .btnWrap{
        // position: absolute;
        // top: 505px;
        // display: flex;
        // justify-content: center;
        float: left;
        width: 100%;
        height: 57px;
        // margin: 404px auto;
        border-top: 1px solid #ececec;
        .sub2,.sub3{
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
        .sub3{
            color:#4c8aff;
			background-color: #fff;
			border:1px solid #4c8aff;
			cursor:pointer;
			margin:15px 0 0 60px;
        }
    }
	.title{
        margin:15px 0 0 20px;
        font-size: 14px;
        color: #666666;
        font-weight: bold;
    }
    .information1{
        width: 1100px;
        margin: 0 auto;
        margin-top: 15px;
        background-color: #f4f8fc;
        padding: 0 4px 24px 4px;
    }
    .informationWrap{
        width: 1100px;
        margin: 0 auto;
        padding: 24px;
        margin-top: 15px;
        background-color: #f4f8fc;
        border-radius: 2px;
        box-sizing: border-box;    
        overflow: hidden;
        .item{
            font-size: 14px;
            color: #444950;
            min-width: 136px;
            float: left;
            overflow: hidden;
            span{
                margin-left: 10px;
                color: #444950;
                label{
                    font-size: 12px;
                    color: #444950;
                }
            }
            .left{
                float: left;
                width: 70px;
            }
        }
        .ml{
            width: auto;
            margin-left: 484px;
        }
        .mb24{
            overflow: hidden;
            margin-bottom: 24px;
        }
        .tableWrap{
            width: 1052px;
            background-color: #ffffff;
            table{
                width: 100%;
                height: 100%;
                tr{
                    height: 50px;
                }
                th{
                    font-size: 14px;
                    color: #444950;
                }
                td{
                    text-align: center;
                    font-size: 14px;
                    color: #444950;
                }
            }
            table,table tr th, table tr td{
                border:1px solid #ececec; 
            }
        }
    }
    .userdepartement{
        .body{
            position: relative;
            min-height: 369px;
            .scrollWrap{
                height: 288px;
                overflow-y: scroll;
                padding-top: 20px;
                transition: .3s;
            }
            .scrollWrap::-webkit-scrollbar {
                display:none
            }
        }
            .useWrap{
                width: 560px;
                height: 259px;
                margin: 20px auto;
                background: #f4f8fc;
                .left{
                    float: left;
                    width: 50%;
                    height: 100%;
                    position: relative;
                    .divider{
                        position: absolute;
                        left: 279px;
                        top: 22px;
                        width: 2px;
                        height: 215px;
                        background: #ececec;
                        z-index: 1000;
                    }
                    .search{
                        float: left;
                        margin-left: 20px;
                        margin-top: 10px;
                        position: relative;
                        .searchIcon{
                            position: absolute;
                            top: 7px;
                            left: 10px;
                        }
                    }
                    input::-webkit-input-placeholder{
                        color: #d4d4d4;
                        font-size: 14px;
                    }
                    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
                        color:#d4d4d4;
                        font-size: 14px;
                    }
                    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                        color:#d4d4d4;
                        font-size: 14px;
                    }
                    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                        color:#d4d4d4;
                        font-size: 14px;
                    }
                    .treeWrap{
                        overflow-y: scroll;
                        width: 275px;
                        height: 210px;
                        margin-top: 10px;
                        margin-left: 11px;
                        margin-top: 50px;
                        .el-tree{
                            background-color: #f4f8fc;
                            font-size: 12px;
                        }
                        .custom-tree-node {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            font-size: 12px;
                            padding-right: 10px;
                            color: #444950;
                            .label{
                                font-size: 14px;
                                .icon{
                                    width: 14px;
                                    height: 16px;
                                    display: inline-block;
                                    vertical-align: top;
                                    background: url("../../../assets/img/department.svg") no-repeat;
                                    background-size: 100% 100%;
                                    margin-right: 8px;
                                    margin-top: 1px;
                                }
                                .icon1{
                                    width: 14px;
                                    height: 16px;
                                    float: left;
                                    background: url("../../../assets/img/person.svg") no-repeat;
                                    background-size: 100% 100%;
                                    margin-right: 10px;
                                    margin-top: 1px;
                                }
                                .icon2{
                                    width: 14px;
                                    height: 16px;
                                    float: left;
                                    background: url("../../../assets/img/department.svg") no-repeat;
                                    background-size: 100% 100%;
                                    margin-right: 10px;
                                    margin-top: 2px;
                                    margin-left: 3px;
                                }
                            }
                        }
                    }
                    .treeWrap::-webkit-scrollbar{
                        display: none;
                    }
                    .treeWrap::-moz-scrollbar{
                        display: none;
                    }
                    .treeWrap:-moz-scrollbar{
                        display: none;
                    }
                    .treeWrap:-ms-scrollbar{
                        display: none;
                    }
                }
                .right{
                    overflow-y: scroll;
                    margin-top: 0px;
                    width: 50%;
                    height: 100%;
                    margin-left: 282px;
                    position: relative;
                    .title{
                        position: absolute;
                        top: 0;
                        left: 0;
                        color: #444950;
                        font-size: 14px;
                    }
                    .theparcel{
                        .selectItem{
                            float: left;
                            position: relative;
                            margin-top: 10px;
                            .icon{
                                display: inline-block;
                                width: 15px;
                                height: 12px;
                                margin-left: 20px;
                                margin-right: 3px;
                                background: url('../../../assets/img/department.svg')
                            }
                            .txt,.deleteBtn{
                                display: inline-block;
                            }
                            .txt{
                                margin-right: 158px;
                            }
                            .deleteBtn{
                                position: absolute;
                                top: 0;
                                left: 248px;
                                font-size: 18px;
                                text-align: center;
                                cursor: pointer;
                            }
                            .blue{
                                color: #4c8aff;
                            }
                        }
                        .selectItem:nth-child(1){
                            margin-top: 45px;
                        }
                    } 
                }
                .right::-webkit-scrollbar{
                    display: none;
                }
                .right::-moz-scrollbar{
                    display: none;
                }
                .right:-moz-scrollbar{
                    display: none;
                }
                .right:-ms-scrollbar{
                    display: none;
                }
            }
            .dialogButton{
                position: absolute;
                bottom: 15px;
                width: 600px;
                height: 27px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: -15px;
                .sub{
                    font-size: 14px;
                    color: #fff;
                    width: 80px;
                    height: 27px;
                    background: #4c8aff;
                    text-align: center;
                    line-height: 27px;
                    border: .5px solid #4c8aff;
                    border-radius: 14.5px;
                }
                .cancel{
                    font-size: 14px;
                    color: #4c8aff;
                    width: 80px;
                    height: 27px;
                    margin-top: -1px;
                    margin-left: 60px;
                    border: .5px solid #4c8aff;
                    text-align: center;
                    line-height: 28px;
                    border-radius: 14.5px;
                }
            }
    } 
    .deviceKeeper{
        .body{
            min-height: 338px;
            .addTagWrap{
                width: 560px;
                height: 259px;
                background-color: #f4f8fc;
                margin: 20px auto;
                padding: 20px;
                box-sizing: border-box;
                .search{
                    position: relative;
                    .searchIcon{
                        position: absolute;
                        top: 10px;
                        left: 10px;
                    }
                }
                input::-webkit-input-placeholder{
                    color: #d4d4d4;
                    font-size: 12px;
                }
                input::-moz-placeholder{   /* Mozilla Firefox 19+ */
                    color:#d4d4d4;
                    font-size: 12px;
                }
                input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                    color:#d4d4d4;
                    font-size: 12px;
                }
                input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                    color:#d4d4d4;
                    font-size: 12px;
                }
                .tagWrapTop{
                    margin-top: 20px;
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
                        margin-bottom: 10px;
                        margin-right: 10px;
                        text-align: center;
                    }
                    .selectTag{
                        border: solid 1px #4c8aff;
                        color: #4c8aff;
                    }
                }
                
            }
            .dialogBtnCert{
                position: absolute;
                left: 20px;
                bottom: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 560px;
                height: 29px;
                .sure{
                    font-size: 14px;
                    color: #fff;
                    width: 80px;
                    height: 27px;
                    background: #4c8aff;
                    text-align: center;
                    line-height: 27px;
                    border: .5px solid #4c8aff;
                    border-radius: 14.5px;
                }
                .cancelCert{
                    font-size: 14px;
                    color: #4c8aff;
                    width: 80px;
                    height: 27px;
                    margin-top: -1px;
                    margin-left: 60px;
                    border: .5px solid #4c8aff;
                    text-align: center;
                    line-height: 28px;
                    border-radius: 14.5px;
                }
            }
        }
    }
}
</style>

