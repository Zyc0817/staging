<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">新增设备</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="editContent">
                    <el-form :model="ruleForm" ref="ruleForm" size="medium" class="demo-ruleForm">
                        <div class="equipment">
                            <el-form-item label="设备类型：" style="100px;">
                                <el-select v-model="value" placeholder="请选择" style="margin-left:10px;">
                                    <el-option :label= item.punchCard :value= item.punchCardEng v-for="(item,index) in deviceType" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="serialNumber">
                            <el-form-item label="云序列号：" style="width:380px;">
                                <el-input v-model="ruleForm.serial" placeholder="请输入" style="margin-left:10px;"></el-input>
                            </el-form-item>
                        </div>
                        <div class="equipmentIP">
                            <el-form-item label="设备IP：" style="width:380px;">
                                <el-input v-model="ruleForm.equipment" placeholder="请输入" style="margin-left:25px;"></el-input>
                            </el-form-item>
                        </div>
                        <div class="userDepartment">
                            <el-form-item label="使用部门：" style="width:380px;">
                                <div class="userDepartmentBorder">
                                    <div class="tagWrap" v-for="(i,k) in departmentList" :key="k">
                                        <div class="tag">{{i.name|changeType}}</div>
                                        <div class="delete" @click="deleteDepartment(i,k)">×</div>
                                    </div>
                                    <div class="clickDepartment" @click="dialogVisibleOne=true">
                                        <div class="icon"></div>
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                        <div class="deviceManager">
                            <div class="deviceManagerTitle">管理员<span></span>：</div>
                                <div class="userDepartmentBorder">
                                    <div class="tagWrap" v-for="(item,index) in equipmentList" :key="index">
                                        <div class="tag">{{item.title|changeType}}</div>   
                                        <div class="delete" @click="deleteManager(item,index)">×</div>
                                    </div>
                                    <div class="clickDepartment" @click="dialogVisibleTwo=true">
                                        <div class="icon"></div>
                                    </div>
                                </div>
                            </div>
                        <div class="equipmentIP">
                            <el-form-item label="设备位置：" style="width:380px;">
                                <el-input v-model="ruleForm.location" placeholder="请输入 (选填)" style="margin-left:10px;"></el-input>
                            </el-form-item>
                        </div>
                        <div class="equipmentFigure">
                            <el-form-item label="图片：" style="width:380px;">
                                <div class="equipmentFigureBorder">
                                    <el-upload
                                        :action='dialogVisibleUrl'
                                        list-type="picture-card"
                                        :limit= 2
                                        :on-exceed="handleExceedImg"
                                        :on-preview="handlePictureCardPreview"
                                        :on-success="imgFileSuccess"
                                        :on-remove="handleRemove">
                                        <i class="el-icon-plus"></i>
                                        <span class="cross"></span>
                                        <span class="vertical"></span>
                                    </el-upload>
                                    <el-dialog
                                        :visible.sync="imgDialog"
                                        :lock-scroll="false"
								        :modal-append-to-body="false">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </div>
                                <span>最多上传2张，最大不超过8M (选填)</span>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div class="btnWrap">
                    <div class="sub2" @click="confirm">确定</div>
                    <div class="sub3" @click="cancel">取消</div>
                </div>
                <div class="userdepartement">
                    <el-dialog
                        title="使用部门"
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
                                            :check-strictly="false"
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
                                    <div class="title">已选择的使用部门：</div>
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
                        title="设备管理员"
                        :visible.sync="dialogVisibleTwo"
                        :modal-append-to-body="false"
                        width="600px"
                        top="28vh">
                        <div class="body">
                            <div class="useWrap">
                                <div class="left">
                                    <div class="divider"></div>
                                    <div class="search">
                                        <div class="searchIcon icon-search"></div>
                                        <input type="text" placeholder="请输入关键字" style="width:168px;height:28px;padding-left:30px;border:1px solid #d4d4d4;outline:none;" v-model="useValue1"/>
                                    </div>	
                                    <div class="treeWrap processEdit">
                                        <el-tree
                                            class="filter-tree"
                                            show-checkbox
                                            :data="post"
                                            :props="defaultProps1"
                                            @check='getKey1'
                                            default-expand-all
                                            :expand-on-click-node='false'
                                            :check-on-click-node="true"
                                            :check-strictly="true"
                                            :filter-node-method="filterNode1"
                                            node-key="id"
                                            ref="tree1">
                                            <span class="custom-tree-node" slot-scope="{ node,data }">
                                                <span class="label">
                                                    <div v-if="!data.disabled" class="icon1"></div>
                                                    <div v-else class="icon2"></div>
                                                    <div style="float:left">{{ node.label }}</div>
                                                </span>
                                            </span>
                                        </el-tree>
                                    </div>
                                </div>
                                <div class="right">
                                    <div class="line"></div>
                                    <div class="title">已选择的使用范围：</div>
                                    <div class="selectItem" v-for="(i,k) in checkedNodes1" :key='k'>
                                        <div class="icon1"></div>
                                        <div class="txt">{{i.title}}</div>
                                        <div class="deleteBtn" @click="deleteSelect1(i,k)">×</div>    
                                    </div> 
                                </div>
                            </div>
                            <div class="dialogButton">
                                <div class="sub" @click="ofCourse">确定</div>
                                <div class="cancel" @click="dialogVisibleTwo=false">取消</div>
                            </div>  
                        </div>
                    </el-dialog>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import Table from '../../table/systemSettings/contract'
export default {
    name: 'newEquipment',
    props:['roled'],
	data () {
		return {
            show: false,
            ruleForm: {
                serial: '',
                equipment: '',
                location: ''
            },
            defaultProps: {
	          	children: 'children',
	          	label: 'name'
            },
            defaultProps1: {
	          	children: 'children',
	          	label: 'title'
            },
            value: '',
            useValue: '',
            useValue1: '',
            menuData: [],
            post: [],
            dialogVisibleOne: false,
            dialogVisibleTwo: false,
            dialogVisibleUrl: this.$baseApi + this.$urls.singlefile,
            imgDialog: false,
            dialogImageUrl: '',
            checkedNodes:[],
            checkedNodes1: [],
            checkedAdministrator: [],
            blueShow: [],
            blueShow1: [],
            equipmentList: [],
            departmentList: [],
            departmentIds: [],
            managerIds: [],
            imgArr: [],
            imageOne: '',
            imageTwo: '',
            deviceType: [{punchCard:'考勤打卡',punchCardEng:'work'},{punchCard:'用餐打卡',punchCardEng:'meal'}]
		}
    },
    watch: {
        useValue(val) {
            this.$refs.tree.filter(val);
        },
        useValue1(val) {
            this.$refs.tree1.filter(val);
        },
    },
    filters: {
        changeType(val) {
            if(val){
                if(val.length<=5){
                    return val
                }else{
                    return val.substring(0,5)+'...'
                }
            }else{
                return ''
            }
        }
    },
    created() {
        this.init()
    },  
	mounted () {
		this.show = true
	},
	methods: {
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
			this.imgDialog = true;
        },
        handleRemove(file, fileList) {
            this.imgArr.forEach((i,k)=>{
				if(i==file.response.content.id){
					this.imgArr.splice(k,1)
				}
			})
        },
        handleExceedImg(files, fileList) {
            this.$message({
				message: "最多上传两张照片",
				type: 'error',
				duration: 5 * 1000,			
			})
        },
        imgFileSuccess(file,fileList) {
            if(file.status==200){
                this.imgArr.push({id:file.content.id,url:fileList.url})
			}else{
				this.$message({
					message: response.message||"上传失败",
					type: 'error',
					duration: 5 * 1000
				})
			}
        },
        getKey(checkedNodes,checkedKeys) {
            this.checkedNodes = checkedKeys.checkedNodes
        },
        getKey1(checkedNodes,checkedKeys) {
            this.checkedNodes1 = checkedKeys.checkedNodes
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        filterNode1(value, data) {
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.departments
            }).then(res=>{
               	this.menuData = Object.values(this.$base.formattingJson(res.data))       
            }).catch(e=>{

            })
            this.$axios({
                method: 'get',
                url:this.$urls.workflowGetPost
            })
            .then(res=>{
                let post = res.data.map(i=>{
                    return {
                        title: i.name,
                        id: i.id,
                        parentId: i.parentId,
                        disabled: i.postId==-1?true:false
                    }
                })
                this.post = Object.values(this.$base.buildTree(post))
            })
            .catch(e=>{

            })
            for(let i=0;i<this.checkedNodes.length;i++){
                this.blueShow.push(false)
            }
            for(let i=0;i<this.checkedAdministrator.length;i++){
                this.blueShow1.push(false)
            }
        },
        getContracts(agencyId) {
            this.$axios({
                method: 'get',
                url:this.$urls.getContracts,
                params:{agencyId}
            })
            .then(res=>{
                return
                this.dataList = res.data 
            })
            .catch(e=>{

            })	
        },
        sure() {
            this.departmentList = this.checkedNodes
            let arr = []
            this.departmentList.forEach(i=>{
                arr.push({
                    key:i.id,
                    value:i.name
                })
            })
            this.departmentIds = arr
            this.dialogVisibleOne = false
        },
        confirm() {
            if(!this.value){
                this.$message({
                    message: '请选择设备类型',
                    type: 'error',
                    duration: 5*1000
                })
                return
            }
            if(!this.ruleForm.serial){
                this.$message({
                    message: '请输入序列号',
                    type: 'error',
                    duration: 5*1000
                })
                return
            }
            if(!this.ruleForm.equipment){
                this.$message({
                    message: '请输设备IP',
                    type: 'error',
                    duration: 5*1000
                })
                return
            }
            if(this.departmentList.length==0){
                this.$message({
                    message: '请选择使用部门',
                    type: 'error',
                    duration: 5*1000
                })
                return
            }
            let arr=[]
            arr=this.imgArr.map(i=>{
                return i.id
            })
            this.$axios({
                method: 'post',
                url: this.$urls.machinedAdd,
                data: {
                    businessType: this.value,
                    serialNo: this.ruleForm.serial,
                    ip: this.ruleForm.equipment,
                    departments: this.departmentIds,
                    managers: this.managerIds,
                    location: this.ruleForm.location,
                    imageOne: arr[0],
                    imageTwo: arr[1]
                }
            }).then(res=>{
                if(res.data.message == '成功'){
                    this.roled()
                    this.$message({
                        message: '新增成功',
                        type: 'success',
                        duration: 5 * 1000
                    })
                }else{
                    this.$message({
                        message: res.data.message||'新增失败',
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            }).catch(err=>{ 
                this.$message({
                    message: '错误',
                    type: 'error',
                    duration: 5 * 1000
                })
             })
            this.cancel()
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('newEquipment')
			}, 200)
		},
		deleteDepartment(i,k) {
            this.departmentList.splice(k,1)
            let arr = []
            this.checkedNodes.forEach(i=>{
                arr.push(i.id)
            })
            this.$refs.tree.setCheckedKeys(arr)
        },
        deleteManager(i,k) {
            this.equipmentList.splice(k,1)
            let arr = []
            this.checkedNodes1.forEach(i=>{
                arr.push(i.id)
            })
            this.$refs.tree1.setCheckedKeys(arr)
        },
        deleteSelect(i,k) {
            // this.checkedNodes.splice(k,1)
            // let arr = []
            // this.checkedNodes.forEach(i=>{
            //     arr.push(i.id)
            // })
            // this.$refs.tree.setCheckedKeys(arr)
            this.$refs.tree.setChecked(i.id,false,true)
            this.checkedNodes = this.$refs.tree.getCheckedNodes()
        },
        deleteSelect1(i,k) {
            this.checkedNodes1.splice(k,1)
            let arr = []
            this.checkedNodes1.forEach(i=>{
                arr.push(i.id)
            })
            this.$refs.tree1.setCheckedKeys(arr)
        },
        blueShowOn(k) {
            this.blueShow=this.blueShow.map((i,key)=>{
                if(key == k){
                    return true
                }
            })
            this.blueShow1=this.blueShow1.map((i,key)=>{
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
            this.blueShow1=this.blueShow1.map((i,key)=>{
                if(key == k){
                    return false
                }
            })
        },
        ofCourse() {
            this.equipmentList = this.checkedNodes1
            let arr= []
            this.equipmentList.forEach(i=>{
                arr.push({
                    key:i.id,
                    value:i.title
                })
            })
            this.managerIds = arr
            this.dialogVisibleTwo = false
        }
	},  
	destroyed() {
		clearTimeout(this._timeOut)
    },
    components:{
        Table
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
    overflow-y: scroll;
    width:400px;
    .editContent{
        min-height: calc(100% - 135px);
        margin-top: 24px;
        .equipment{
            margin-left: 20px;
        }
        .serialNumber,.equipmentIP,.userDepartment,.deviceManager,.equipmentFigure{
            margin-left: 20px;
            margin-top: 21px;
        }
        .userDepartment{
            .userDepartmentBorder{
                display: flex;
                flex-wrap: wrap;
                // width: 185px;
                margin-left: 81px;
                margin-top: -8px;
                .tagWrap{
                    position: relative;
                    // margin-left: 10px;
                    margin-top: 10px;
                    .tag{
                        width: 80px;
                        height: 27px;
                        text-align: center;
                        line-height: 27px;
                        color: #4c8aff;
                        // margin-left: -10px;
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
                .tagWrap:nth-child(2n-1),.tagWrap:nth-child(2n){
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
                width: 120px;
                font-size: 14px;
                color: #444950;
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
                width: 285px;
                margin-left: -39px;
                // background: #ccc;
                margin-top: -12px;
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
                .tagWrap:nth-child(2n-1),.tagWrap:nth-child(2n){
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
        .equipmentFigure{
            .equipmentFigureBorder{
                height: 60px;
                margin-left: 81px;
                margin-top: 3px;
            }
            span{
                float: left;
                margin-left: 81px;
                margin-top: 0px;
                font-size: 12px;
                color: #999999;
            }
        }
    }
    .btnWrap{
        float: left;
        width: 100%;
        height: 57px;
        border-top: 1px solid #ececec;
        div{
            float:left;
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			background-color: #4c8aff;
			border-radius: 14.5px;
			color:#fff;
			text-align:center;
			font-size:12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            margin-top: 15px;
        }
        .sub2{
            margin-left: 90px;
        }
        .sub3{
            margin-left: 60px;
            background-color: #fff;
            color: #4c8aff;
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
                    width:50%;
                    height: 100%;
                }
                .left{
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
                        margin-left: 11px;
                        margin-top: 50px;
                        // background: #ccc;
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
                }
                .right{
                    width: 50%;
                    height: 100%;
                    margin-left: 282px;
                    overflow-y: scroll;
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
                .left::-webkit-scrollbar,
                .right::-webkit-scrollbar {
                    display:none
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
        // }
    } 
    .deviceKeeper{
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
                        margin-top: 50px;
                        margin-left: 11px;
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
                }
                .right{
                    margin-top: 0px;
                    width: 50%;
                    height: 100%;
                    margin-left: 282px;
                    overflow-y: scroll;
                    position: relative;
                    .title{
                        color: #444950;
                        font-size: 14px;
                        }
                        .selectItem{
                            position: relative;
                            margin-top: 10px;
                            width: 100%;
                            .icon1{
                                float: left;
                                margin-left: 20px;
                                margin-right: 10px;
                                background: url('../../../assets/img/person.svg') no-repeat;
                                background-size: 100% 100%;
                                width: 14px;
                                height: 16px;
                                margin-top: 2px;
                            }
                            .txt{
                                width: 200px;
                            }
                            .deleteBtn{
                                position: absolute;
                                top: 0;
                                left: 246px;
                                font-size: 18px;
                                text-align: center;
                                cursor: pointer;
                            }
                            .blue{
                                color: #4c8aff;
                            }
                        }
                    }
                    .right::-webkit-scrollbar{
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
        // }
    }
}	
</style>

