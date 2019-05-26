<template>
    <div class="employmentConditions">
        <div class="wrap"> 
            <div class="item">
                <div class="title">最小年龄</div>
                <div class="line"></div>
                <div class="rulesWrap" v-for="(i,k) in minAgeList" :key='k' :class="{'pt14':k>0}">
                    <div class="dashed" v-if="k!=0"></div>
                    <div class="list">
                        <div class="deleteBtn" v-if="k!=0" @click="deleteBtn(k)">
                            <div>删除</div>
                        </div>
                        <div class="left">规则：</div>
                        <div class="right">
                            <input type="text" v-model="i.age">周岁以下的人员，不予签到
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="list mt30">
                        <div class="left height27">使用范围：</div>
                        <div class="right">
                            <div class="tagWrap" v-for="(item,key) in i.tag" :key="key">
                                <div class="tag">{{item.name}}</div>
                                <div class="delete" @click.stop="delTag(0,k,key,item)">×</div>
                            </div>
                            <div class="addBtn" @click='dialogVisibleShow(0,k)'>
                                <div class="icon"></div>
                            </div>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="addJobs white" v-if="k==minAgeList.length-1" @click="addminAge">
                        <div class="wrap">
                            <div class="addicon"></div>
                            <div class="txt">设置更多最小年龄</div>
                        </div>
                    </div>
                </div>      
            </div>
            <div class="item">
                <div class="title">最多月工时</div>
                <div class="line"></div>
                <div class="rulesWrap" v-for="(i,k) in workingHoursList" :key='k'>
                    <div class="dashed" v-if="k!=0"></div>
                    <div class="list">
                        <div class="deleteBtn" v-if="k!=0" @click="deleteHoverBtn(k)">
                            <div>删除</div>
                        </div>
                        <div class="left">规则：</div>
                        <div class="right">
                            每人每月在本企业最多工作时长&nbsp;&nbsp;<input type="text" v-model="i.hover">小时，超出后将不予签到
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="list mt30">
                        <div class="left height27">使用范围：</div>
                        <div class="right">
                            <div class="tagWrap" v-for="(item,key) in i.tag" :key="key">
                                <div class="tag">{{item.name}}</div>
                                <div class="delete" @click.stop="delTag(1,k,key,item)">×</div>
                            </div>
                            <div class="addBtn" @click='dialogVisibleShow(1,k)'>
                                <div class="icon"></div>
                            </div>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="addJobs" v-if="k==workingHoursList.length-1" @click="addHover">
                        <div class="wrap width106">
                            <div class="addicon"></div>
                            <div class="txt">设置更多月工时</div>
                        </div>
                    </div>
                </div>      
            </div>
            <div class="item pd14">
                <div class="title">仅允许预安排的人签到</div>
                <div class="line"></div>
                <div class="rulesWrap">
                    <div class="list">
                        <div class="left">规则：</div>
                        <div class="right">
                            必须根据劳务公司安排的人员才能签到，否则无法签到
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="list mt30">
                        <div class="left height27">使用范围：</div>
                        <div class="right">
                            <div class="tagWrap" v-for="(i,key) in WritingList" :key='key'>
                                <div class="tag">{{i.name}}</div>
                                <div class="delete" @click.stop="delTag(2,0,key,i)">×</div>
                            </div>
                            <div class="addBtn" @click='dialogVisibleShow(2,0)'>
                                <div class="icon"></div>
                            </div>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>      
            </div>
        </div>
        <div style="height:0;overflow:hidden;">
            <el-tree
                class="filter-tree"
                show-checkbox
                :data="menuData"
                :props="defaultProps"
                :expand-on-click-node='false'
                @check='getKey'
                default-expand-all
                :check-strictly="strictly"
                :filter-node-method="filterNode"
                node-key="id"
                ref="tree2">
                <span class="custom-tree-node" slot-scope="{ node }">
                    <span class="label"><i class="icon"></i>{{ node.label }}</span>
                </span>
            </el-tree>
        </div>
        <div class="btn">
            <div class="sub" @click="submit">保存</div>
            <div class="cancel">取消</div>
        </div>
        <el-dialog
            title="添加使用范围"
            :visible.sync="dialogVisible"
            width="600px"
            top="30.3vh"
            :modal-append-to-body="false"
            height="420px">
            <div class="body">
                <div class="useWrap">
                    <div class="left">
                        <div class="search">
                            <div class="searchIcon icon-search"></div>
                            <input type="text" placeholder="请输入关键字" v-model="useValue"/>
                        </div>	
                        <div class="treeWrap">
                            <el-tree
                                class="filter-tree"
                                show-checkbox
                                :data="menuData"
                                :props="defaultProps"
                                :expand-on-click-node='false'
                                @check='getKey'
                                default-expand-all
                                :check-strictly="strictly"
                                :filter-node-method="filterNode"
                                node-key="id"
                                ref="tree">
                                <span class="custom-tree-node" slot-scope="{ node }">
                                    <span class="label"><i class="icon"></i>{{ node.label }}</span>
                                </span>
                            </el-tree>
                        </div>
                    </div>
                    <div class="right">
                        <div class="line"></div>
                        <div class="title">已选择的使用范围：</div>
                        <div class="selectItem" v-for="(i,k) in checkedNodes" :key='k'>
                            <div class="icon"></div>
                            <div class="txt">{{i.name}}</div>
                            <div class="deleteBtn" @click="deleteSelect(i,k)"></div>    
                        </div> 
                    </div>
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
    name: 'employmentConditions',
    data() {
        return {
            minAgeList: [{age:'',tag:[]}],
            workingHoursList: [{hover:'',tag:[]}],
            WritingList:[],
            switchBtn: false,
            dialogVisible: false,
            useValue: '',
            menuData: [],
            defaultProps: {
	          	children: 'children',
	          	label: 'name'
            },
            checkedNodes: [],
            dialogVisibleState: 0,
            k:0,
            strictly: false
        } 
    },
    watch: {
        useValue(val) {
            this.$refs.tree.filter(val);
        },
        dialogVisible(val) {
            if(val) {
                // this.tagInit()
                this.checkedNodes = []
            }  
        }
    },
    created() {
        this.init()
        this.tagInit()
    },
    methods: {
        submit() {
            for(let i = 0;i<this.minAgeList.length;i++){
                if(!this.minAgeList[i].age){
                    this.$message({
                        message: "请输入最小年龄",
                        type: 'error',
                        duration: 5 * 1000
                    })
                    return
                }
                if(!this.$base.isPositiveInteger(this.minAgeList[i].age)){
                    this.$message({
                        message: "请输入正确的最小年龄",
                        type: 'error',
                        duration: 5 * 1000
                    })
                    return
                }
            }
            for(let i = 0;i<this.workingHoursList.length;i++){
                if(!this.workingHoursList[i].hover){
                    this.$message({
                        message: "请输入最多月工时",
                        type: 'error',
                        duration: 5 * 1000
                    })
                    return
                }
                if(!this.$base.isPositiveInteger(this.workingHoursList[i].hover)){
                    this.$message({
                        message: "请输入正确的月工时",
                        type: 'error',
                        duration: 5 * 1000
                    })
                    return
                }
            }
            let arr = []
            this.minAgeList.forEach(i=>{
                let departmentIds = i.tag.map(item=>item.id)
                let obj = {
                    column:'tag0',
                    hotalId:this.$store.state.hotalId,
                    number:i.age,
                    departmentIds
                }
                arr.push(obj)
            })
            this.workingHoursList.forEach(i=>{
                let departmentIds = i.tag.map(item=>item.id)
                let obj = {
                    column:'tag1',
                    hotalId:this.$store.state.hotalId,
                    number:i.hover,
                    departmentIds
                }
                arr.push(obj)
            })
            let departmentIds = [] 
            this.WritingList.forEach(i=>{
                departmentIds.push(i.id)  
            })
            let obj = {
                column:'tag2',
                hotalId:this.$store.state.hotalId,
                number: 0,
                departmentIds:departmentIds
            }
            arr.push(obj)
            this.$axios({
                method: 'put',
                url:this.$urls.leadInto,
                data:arr
            })
            .then(res=>{
                if(res.data.status==200){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
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
        delTag(state,k,key,i) {
            if(state==0){
                // this.minAgeList[k].tag.splice(key,1)
                this.$refs.tree2.setCheckedKeys([])
                let arr = this.minAgeList[k].tag.map(i=>{
                    return i.id
                })
                this.$refs.tree2.setCheckedKeys(arr)
                this.$refs.tree2.setChecked(i.id,false,true)
                this.minAgeList[k].tag = this.$refs.tree2.getCheckedNodes()
            }else if(state==1){
                // this.workingHoursList[k].tag.splice(key,1)
                this.$refs.tree2.setCheckedKeys([])
                let arr = this.workingHoursList[k].tag.map(i=>{
                    return i.id
                })
                this.$refs.tree2.setCheckedKeys(arr)
                this.$refs.tree2.setChecked(i.id,false,true)
                this.workingHoursList[k].tag = this.$refs.tree2.getCheckedNodes()
            }else{
                // this.WritingList.splice(key,1)
                this.$refs.tree2.setCheckedKeys([])
                let arr = this.WritingList.map(i=>{
                    return i.id
                })
                this.$refs.tree2.setCheckedKeys(arr)
                this.$refs.tree2.setChecked(i.id,false,true)
                this.WritingList = this.$refs.tree2.getCheckedNodes()
            }
        },
        sure() {
            let a = this.$refs.tree.getCheckedNodes()
            if(this.dialogVisibleState==0){
                this.minAgeList[this.k].tag = this.checkedNodes
            }else if(this.dialogVisibleState==1){
                this.workingHoursList[this.k].tag = this.checkedNodes
            }else{
                this.WritingList = this.checkedNodes
            }
            this.dialogVisible = false
        },
        dialogVisibleShow(state,k) {
            this.dialogVisibleState = state
            this.dialogVisible = true
            this.k = k
            this.$nextTick(()=>{
                if(state==0){
                    let arr = this.minAgeList[k].tag.map(i=>{
                        return i.id
                    })
                    this.checkedNodes = this.minAgeList[k].tag
                    this.$refs.tree.setCheckedKeys(arr)
                }else if(state==1){
                    let arr = this.workingHoursList[k].tag.map(i=>{
                        return i.id
                    })
                    this.checkedNodes = this.workingHoursList[k].tag
                    this.$refs.tree.setCheckedKeys(arr)
                }else{
                    let arr = this.WritingList.map(i=>{
                        return i.id
                    })
                    this.checkedNodes = this.WritingList
                    this.$refs.tree.setCheckedKeys(arr)
                }
                
            })    
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
        getKey(checkedNodes,checkedKeys) {
            this.checkedNodes = checkedKeys.checkedNodes
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        addminAge() {
            this.minAgeList.push({age:'',tag:[]})
        },
        deleteBtn(k) {
            this.minAgeList.splice(k,1)
        },
        addHover() {
            this.workingHoursList.push({hover:'',tag:[]})
        },
        deleteHoverBtn(k) {
            this.workingHoursList.splice(k,1)
        },
        tagInit() {
            this.$axios({
                method: 'get',
                url:this.$urls.departments
            })
            .then(res=>{
               	this.menuData = Object.values(this.$base.formattingJson(res.data))       
            })
            .catch(e=>{

            })	
        },
        init() {  
            this.$axios({
                method: 'get',
                url:this.$urls.getCondition
            })
            .then(res=>{
               	if(res.data.status==200){
                    if(res.data.content.tag0.length) {
                        this.minAgeList = []
                        res.data.content.tag0.forEach(i=>{
                            this.minAgeList.push({age:i.number,tag:i.departments})
                        })
                    }   
                    if(res.data.content.tag1.length) {
                        this.workingHoursList = []
                        res.data.content.tag1.forEach(i=>{
                            this.workingHoursList.push({hover:i.number,tag:i.departments})
                        })
                    }             
                    this.WritingList = res.data.content.tag2[0].departments

                }
            })
            .catch(e=>{

            })	
        },
    }
}
</script>
<style lang="less" scoped>
.employmentConditions{
    height: 100%;
    .wrap{
        min-height: calc(100% - 79px);
    }
    .dialogBtn{
        left: 190px;
    }
    .body{
        min-height: 338px;
    }
    .useWrap{
        width: 560px;
        height: 259px;
        background-color: #f4f8fc;
        margin: 20px auto;
        box-sizing: border-box;
        .left,.right{
            float: left;
            width:50%;
            height: 100%;
            overflow-y: scroll;
        }
        .left::-webkit-scrollbar,
        .right::-webkit-scrollbar {
            display:none
        }
        .right{
            position: relative;
            .line{
                position: absolute;
                width: 2px;
                height: 215px;
                background:#ececec;
                left: 0px;
                top: 22px;
            }
            .title{
                padding: 15px 0 0 22px;
                font-size: 14px;
            }
            .selectItem{
                overflow: hidden;
                height: 20px;
                margin-top: 10px;
                div{
                    float: left;
                }
                .icon{
                    width: 15px;
                    height: 12px;
                    background: url("../../../assets/img/department.svg") no-repeat;
                    background-size: 100% 100%;
                    margin-left: 22px;
                    margin-top: 4px;
                }
                .txt{
                    margin-left: 10px;
                }
                .deleteBtn{
                    width: 9px;
                    height: 9px;
                    background: url("../../../assets/img/delx.svg") no-repeat;
                    background-size: 100% 100%;
                    float: right;
                    color: #909399;
                    font-weight: bold;
                    font-size: 14px;
                    margin-top: 5px;
                    margin-right: 21px;
                }
                .deleteBtn:hover{
                    background: url("../../../assets/img/delx-select.svg") no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
        .left{
            .search{	
				width:200px;
                height:27px;
                margin: 10px 0 0 20px;
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
					width:150px;
					padding:0 0 0 10px;
					color:#999;
					font-size: 12px;
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
            .treeWrap{
                padding: 10px;
                padding-top: 0;
                .el-tree{
                    background-color: #f4f8fc;
                    font-size: 12px;
                }
                .custom-tree-node {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    padding-right: 10px;
                    color: #444950;
                    .label{
                        .icon{
                            width: 14px;
                            height: 14px;
                            display: inline-block;
                            vertical-align: top;
                            background: url("../../../assets/img/department.svg") no-repeat;
                            background-size: 100% 100%;
                            margin-right: 8px;
                            margin-top: 3px;
                        }
                    }
                }
            }
        }
    }
    .btn{
        width: 220px;
        margin: 0px auto;
        margin-top: 30px;
        margin-bottom: 20px;
        overflow: hidden;
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
        }
        .cancel{
            float: right;
            background-color: #fff;
            color: #4c8aff;
            border: 1px solid #4c8aff;
        }
    }
    .item{
        background-color: #fff;
        margin-bottom: 10px;
        padding-bottom: 24px;
        .title{
            height: 50px;
            line-height: 50px;
            text-indent: 20px;
            font-size: 14px;
            color: #666666;
            font-weight: bold;
            border-left: 4px solid #4d83ff;
            .switch{
                float: right;
                margin-right: 20px;
            }
        }
        .line{
            height: 1px;
            background-color: #ececee; 
        }
        .rulesWrap{
            padding: 14px 24px 0 24px;    
            font-size: 14px;
            color: #444950;
            position: relative;
            .deleteBtn{
                background: url('../../../assets/img/deleteBtn.svg') no-repeat;
                background-size: 100% 100%;
				width: 45px;
				height: 45px;
				position:absolute;
				left:0px;
				top:14px;
				color:#fff;
				font-size: 12px;
				cursor:pointer;
				div{
					width: 29px;
					height: 29px;
					line-height:29px;
					text-align:center;
					transform:rotate(-45deg);
				}
				
			}
            .dashed{
                border-top: 1px dashed #d4d4d4;
                margin-bottom: 30px;
            }
            .mt30{
                margin-top: 24px;
            }
            .left{
                width: 80px;
                float: left
            }
            .height27{
                height: 27px;
                line-height: 27px;
            }
            .clear{
                clear: both;
            }
            .right{
                float: left;
                width: calc(100% - 80px);
                input{
                    width: 60px;
                    border: none;
                    outline: none;
                    border-bottom: 1px solid #d4d4d4;
                    text-align: center;
                    margin-right: 10px;
                    font-size: 14px;
                }
                .addBtn{
                    width: 78px;
                    height: 25px;
                    background-color: #ffffff;
                    border-radius: 1px;
                    border: dashed 1px #4c8aff;
                    float: left;
                    cursor: pointer;
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
                    margin-right: 20px;
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
                        line-height: 13px;
                        border-radius: 50%;
                        cursor: pointer;

                    }

                }
            }
        }
        .pt14{
            padding-top: 14px;
        }
        .addJobs{
			height: 43px;
			background-color: #fff;
			border: dashed 1px #4c8aff;
			margin:0 auto;
            margin-top:14px;
            cursor:pointer;
            .wrap{
                width: 118px;
                text-align: center;
                margin: 0 auto;
                overflow: hidden;
            }
            .width106{
                width: 106px;
                .txt{
                    width: 84px;
                }
            }
			.addicon{
				background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
				width: 14px;
				height: 14px;
                float:left;
                margin-top: 13.5px;
			}
			.txt{
				width: 96px;
				float:left;
				font-size: 12px;
				color: #4c8aff;
				margin:13px 0 0 8px;
			}
        }
        .addJobs:hover{
            background-color: #eaf3fe;  
            transition: all .2s;
        }
    }
    .pd14{
        padding-bottom: 14px;
    }
}
</style>

