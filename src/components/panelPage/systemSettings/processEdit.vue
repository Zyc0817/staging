<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt" v-if="$store.state.systemSettings.states.id">编辑</div>
                        <div class="txt" v-else>新增流程</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div style="height:50px;" v-if="fixed"></div>
                <div class="processEdit contentWrap inputHeight30 postEdit addEmploymentApplication">
					<el-form ref="form" :model="form" label-width="80px" size="medium">
                        <div class="mb24 height30">
                            <el-form-item label="流程类型：">
                                <el-select v-model="form.category" :disabled="disable" placeholder="请选择">
                                    <el-option label="用工申请" value="apply"></el-option>
                                    <el-option label="用工申请-紧急审批" value="special"></el-option>
                                    <el-option label="用工费用" value="pay"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="mb24 height30">
                            <el-form-item label="流程名称：">
                                <el-input v-model="form.name" placeholder="请输入"></el-input>
                            </el-form-item>
						</div>
                        <div v-if="form.category=='special'" class="mb24 height30">
                            <el-form-item label="申请次数：">
                                <el-input v-model="form.number" type="number" placeholder="请输入"></el-input>
                                <div class="template">次/月</div>		
                            </el-form-item>
						</div>
                        <div class="item mb14" :class="{'mb30':!selectDepartments.length}">
                            <div class="left">发起部门：</div>
                            <div class="right">
                                <div class="mb10 tagWrap" v-for="(i,k) in selectDepartments" :key="k">
                                    <div class="tag">{{i.name}}</div>
                                    <div class="delete" v-if="$store.state.systemSettings.states.type!='edit'||selectDepartments.length>1" @click="delDepartment(k,i)">×</div>
                                </div>
                                <div class="addBtn mb10" @click='dialogVisible=true'>
                                    <div class="icon"></div>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="item">
                            <div class="left">审批人：</div>
                            <div class="right">
                                <div v-for="(i,k) in approval" :key="k">
                                    <div class="tagWrap" v-for="(item,key) in i.approve" :key="key" @click.stop="detail(k,key)" style="margin-bottom:10px;">
                                        <div class="tag">{{item.title}}</div>
                                        <div class="delete" v-if="$store.state.systemSettings.states.type!='edit'||i.approve.length>1" @click.stop="delPost(k,key)">×</div>
                                    </div>
                                    <div class="clear"></div>
                                    <div class="arrowRight" v-if="$store.state.systemSettings.states.type!='edit'||k!=approval.length-1">
                                        <img src="../../../assets/img/arrowDown.svg" alt="">
                                    </div>
                                </div>
                                <div v-if="$store.state.systemSettings.states.type!='edit'" class="addBtn" @click='addApproval("add")' :class="{'mt10':selectPost.length>=2}">
                                    <div class="icon"></div>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
					</el-form>   
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
                        :check-strictly="false"
                        :check-on-click-node="true"
                        :filter-node-method="filterNode"
                        node-key="id"
                        ref="tree3">
                        <span class="custom-tree-node" slot-scope="{node}">
                            <span class="label"><i class="icon"></i>{{ node.label }}</span>
                        </span>
                    </el-tree>
                </div>
				<div class="subBtnWrap">
					<div class="subBtn" @click="subBtn">确定</div>
					<div class="resetBtn" @click="cancel">取消</div>
				</div>
                <el-dialog
                    title="发起部门"
                    :visible.sync="dialogVisible"
                    width="600px"
                    top="30.3vh"
                    :modal-append-to-body="false"
                    height="420px">
                    <div class="body">
                        <div style="height:20px;"></div>
                        <div class="useWrap">
                            <div class="left">
                                <div class="search">
                                    <div class="searchIcon icon-search"></div>
                                    <input type="text" placeholder="请输入关键字" v-model="useValue"/>
                                </div>	
                                <div class="treeWrap processEdit">
                                    <el-tree
                                        class="filter-tree"
                                        show-checkbox
                                        :data="menuData"
                                        :props="defaultProps"
                                        :expand-on-click-node='false'
                                        @check="getKey"
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
                <el-dialog
                    title="审批人"
                    :visible.sync="dialogVisible1"
                    width="600px"
                    top="30.3vh"
                    :modal-append-to-body="false"
                    height="420px">
                    <div class="body approver">
                        <div class="scrollWrap" id="scrollWrap">
                            <div class="useWrap mb10">
                                <div class="left">
                                    <div class="search">
                                        <div class="searchIcon icon-search"></div>
                                        <input type="text" placeholder="请输入关键字" v-model="useValue1"/>
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
                                    <div class="title">已选择的审批人：</div>
                                    <div class="selectItem" v-for="(i,k) in checkedNodes1" :key='k'>
                                        <div class="icon1"></div>
                                        <div class="txt">{{i.title}}</div>
                                        <div class="deleteBtn" @click="deleteSelect1(i,k)"></div>    
                                    </div> 
                                </div>
                            </div>
                            <div class="checkBoxWrap processEdit1">
                                <el-checkbox v-model="checked">此节点添加知会人</el-checkbox>
                            </div>
                            <div v-if="checked" class="useWrap mb10" style="margin-top:10px;">
                                <div class="addFd" v-if="!checked"></div>
                                <div class="left">
                                    <div class="search">
                                        <div class="searchIcon icon-search"></div>
                                        <input type="text" placeholder="请输入关键字" v-model="useValue2"/>
                                    </div>	
                                    <div class="treeWrap processEdit">
                                        <el-tree
                                            class="filter-tree"
                                            show-checkbox
                                            :data="post"
                                            :props="defaultProps1"
                                            :expand-on-click-node='false'
                                            @check='getKey2'
                                            default-expand-all
                                            :check-strictly="true"
                                            :check-on-click-node="true"
                                            :filter-node-method="filterNode2"
                                            node-key="id"
                                            ref="tree2">
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
                                    <div class="title">已选择的知会人：</div>
                                    <div class="selectItem" v-for="(i,k) in checkedNodes2" :key='k'>
                                        <div class="icon1"></div>
                                        <div class="txt">{{i.title}}</div>
                                        <div class="deleteBtn" @click="deleteSelect2(i,k)"></div>    
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div class="dialogBtn">
                            <div class="sub" @click="sure1">确定</div>
                            <div class="cancel" @click="dialogVisible1=false">取消</div>
                        </div>  
                    </div>
                </el-dialog>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
    name: 'processEdit',
    props: ['reload'],
    mixins: [mixin],
	data () {
		return {
			show: false, 
            _timeOut: '',
            form: {
                category: '',
                departmentId: [],
                name: '',
                nodeVoList: [],
                workflowId: '',
                number: '',
            },
            dialogVisible: false,
            dialogVisible1: false,
            useValue: '',
            useValue1: '',
            useValue2: '',
            menuData: [],
            defaultProps: {
	          	children: 'children',
	          	label: 'name'
            },
            defaultProps1: {
	          	children: 'children',
	          	label: 'title'
            },
            checkedNodes: [],
            checkedNodes1: [],
            checkedNodes2: [],
            checked: false,
            post: [],
            selectDepartments:[],
            selectPost: [],
            approval:[],
            type: '',
            k: 0,
            disable: false,
		}
    },
    watch: {
        useValue(val) {
            this.$refs.tree.filter(val);
        },
        useValue1(val) {
            this.$refs.tree1.filter(val);
        },
        useValue2(val) {
            this.$refs.tree2.filter(val);
        },
        dialogVisible(val) {
            if(val){
                this.tagInit()
            }
        },
        dialogVisible1(val) {
            if(val){
                this.tagInit1()
            }
        },
        checked(val) {
            if(val) {
                this.$nextTick(()=>{
                    let oDiv = document.getElementById('scrollWrap')
                    oDiv.scrollTop=300
                })
            }else{
                this.$nextTick(()=>{
                    let oDiv = document.getElementById('scrollWrap')
                    oDiv.scrollTop=0
                })
                this.checkedNodes2 = []
                this.$refs.tree2.setCheckedKeys([])
            }
        }
    },
    created() {
        this.init()
        if(this.$store.state.systemSettings.states.type=="edit"){
            this.disable = true
        }
        
    },
	mounted () {
		this.show = true
	},
	methods: {
        addApproval(type){
            this.type = type
            this.dialogVisible1 = true
        },
        subBtn() {
            if(!this.form.category){
                this.$message({
                    message: "请选择流程类型",
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
            if(!this.form.name){
                this.$message({
                    message: "请输入流程名称",
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
            if(!this.form.number&&this.form.category == 'special'){
                this.$message({
                    message: "请输入申请次数",
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
            if(this.$store.state.systemSettings.states.type=="edit"){
                this.form.workflowId = this.$store.state.systemSettings.states.id
            }
            this.form.departmentId = this.selectDepartments.map(i=>i.id)
            if(!this.form.departmentId.length){
                this.$message({
                    message: "请选择发起部门",
                    type: 'error',
                    duration: 5 * 1000
                })
                return
            }
            this.form.nodeVoList = []
            this.approval.forEach((i,k)=>{
                i.approve.forEach(item=>{
                    let obj = {
                        orders: k+1,
                        postAction: 'approve',
                        postId: item.id,
                        postName: item.title
                    }
                    this.form.nodeVoList.push(obj)
                })
                i.notify.forEach(item=>{
                    let obj = {
                        orders: k+1,
                        postAction: 'notify',
                        postId: item.id,
                        postName: item.title
                    }
                    this.form.nodeVoList.push(obj)
                })
            })
            this.$axios({
                method: 'post',
                url:this.$urls.saveWorkflow,
                data:this.form
            })
            .then(res=>{
               	if(res.data.code==0){
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    })
                    this.reload()
                    this.cancel()
                }else{
                    this.$message({
                        message: res.data.msg||'操作失败',
                        type: 'error'
                    })
                }
            })
            .catch(e=>{

            })	
        },
        tagInit() {
            this.checkedNodes = this.selectDepartments.map(i=>i)
            let arr = this.selectDepartments.map(i=>i.id)
            this.$nextTick(()=>{
                this.$refs.tree.setCheckedKeys(arr)
            })    
            
        },
        tagInit1() {
            let arr = [],
                arr1 = []
            if(this.type == 'add') {
                this.checkedNodes1 = []
                this.checkedNodes2 = []
                this.checked = false
            }else{
                arr = this.approval[this.k].approve.map(i=>i.id)
                arr1 = this.approval[this.k].notify.map(i=>i.id)
                this.checkedNodes1 = this.approval[this.k].approve.map(i=>i)
                this.checkedNodes2 = this.approval[this.k].notify.map(i=>i)
                if(arr1.length){
                    this.checked = true
                }
            }
            // this.checkedNodes1 = this.selectPost.map(i=>i)
            this.$nextTick(()=>{
                this.$refs.tree1.setCheckedKeys(arr)
                if(this.checked){
                    this.$refs.tree2.setCheckedKeys(arr1)
                }
            })   
        },
        delDepartment(k,i) {
            if(this.$store.state.systemSettings.states.type=="edit"){
                if(this.selectDepartments.length==1){
                    this.$message({
                        message: '至少保留一个部门节点',
                        type: 'error'
                    })
                }else{
                    let a = this.selectDepartments.map(i=>i.id)
                    this.$refs.tree3.setCheckedKeys([])
                    let arr = this.selectDepartments.map(i=>{
                        return i.id
                    })
                    this.$refs.tree3.setCheckedKeys(arr)
                    this.$refs.tree3.setChecked(i.id,false,true)
                    let b = this.$refs.tree3.getCheckedNodes().map(i=>i.id)
                    if(b.length==0){
                        this.$message({
                            message: '至少保留一个部门节点',
                            type: 'error'
                        })
                        return 
                    }
                    let c = a.concat(b)
                    let d = c.filter((i,v,arr)=>{
                        return arr.indexOf(i) == arr.lastIndexOf(i)
                    })
                    this.checkWorkflowDept(d,'del').then(res=>{
                        if(res.code==0) {
                            this.$refs.tree3.setCheckedKeys([])
                            let arr = this.selectDepartments.map(i=>{
                                return i.id
                            })
                            this.$refs.tree3.setCheckedKeys(arr)
                            this.$refs.tree3.setChecked(i.id,false,true)
                            this.selectDepartments = this.$refs.tree3.getCheckedNodes()
                        }else{
                            this.$message({
                                message: res.msg||'操作失败',
                                type: 'error'
                            })
                        }
                    })
                    
                }
            }else{
                this.$refs.tree3.setCheckedKeys([])
                let arr = this.selectDepartments.map(i=>{
                    return i.id
                })
                this.$refs.tree3.setCheckedKeys(arr)
                this.$refs.tree3.setChecked(i.id,false,true)
                this.selectDepartments = this.$refs.tree3.getCheckedNodes()
            }
        },
        //编辑下删除添加部门验证
        checkWorkflowDept(arr,type) {
            return this.$axios({
                method: 'get',
                url:this.$urls.checkWorkflowDept,
                params:{
                    departmentIds:arr,
                    workflowId: this.$store.state.systemSettings.states.id,
                    category: this.form.category,
                    actionType: type
                },
				paramsSerializer: params => this.qs.stringify(params, {arrayFormat: 'repeat'})
            })
            .then(res=>{
               	return res.data
            })
            .catch(e=>{

            })	
        },
        delPost(k,key) {
            if(this.$store.state.systemSettings.states.type=="edit"){
                if(this.approval[k].approve.length==1){
                    this.$message({
                        message: '至少保留一个审批人节点',
                        type: 'error'
                    })
                }else{
                    this.approval[k].approve.splice(key,1)
                    if(!this.approval[k].approve.length){
                        this.approval.splice(k,1)
                    }
                }
            }else{
                this.approval[k].approve.splice(key,1)
                if(!this.approval[k].approve.length){
                    this.approval.splice(k,1)
                }
            }
        },
        detail(k,key) {
            this.type = 'edit'
            this.k = k
            this.dialogVisible1 = true
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('processEdit')
			}, 200)
        },
        sure() {
            if(this.$store.state.systemSettings.states.type=="edit") {
                if(this.checkedNodes.length==0) {
                    this.$message({
                        message: '至少保留一个部门节点',
                        type: 'error'
                    })
                }else{
                    this.selectDepartments = this.checkedNodes.map(i=>i)
                    this.dialogVisible = false
                }
            }else{
                this.selectDepartments = this.checkedNodes.map(i=>i)
                this.dialogVisible = false
            }
            
        },
        sure1() {
            let arr = this.$refs.tree1.getCheckedNodes()
            let arr1 = []
            if(this.checked) {
                arr1 = this.$refs.tree2.getCheckedNodes()
            }
            if(this.$store.state.systemSettings.states.type=="edit"&&arr.length==0) {
                this.$message({
                    message: '至少保留一个审批人节点',
                    type: 'error'
                })
                return 
            }
            if(this.type=='add') {
                this.approval.push({approve:arr,notify:arr1})
            }else{
                this.approval[this.k].approve = arr
                this.approval[this.k].notify = arr1
            }
            this.dialogVisible1 = false
        },
        deleteSelect(i,k) {
            if(this.$store.state.systemSettings.states.type=="edit") {
                let a = this.checkedNodes.map(i=>i.id)
                this.$refs.tree.setChecked(i.id,false,true)
                let b = this.$refs.tree.getCheckedNodes().map(i=>i.id)
                let c = a.concat(b)
                let d = c.filter((i,v,arr)=>{
                    return arr.indexOf(i) == arr.lastIndexOf(i)
                })
                this.checkWorkflowDept(d,'del').then(res=>{
                    if(res.code==0) {
                        // this.$refs.tree.setChecked(i.id,false,true)
                        this.checkedNodes = this.$refs.tree.getCheckedNodes()
                    }else{
                        this.$refs.tree.setChecked(i.id,true,true)
                        this.checkedNodes = this.$refs.tree.getCheckedNodes()
                        this.$message({
                            message: res.msg||'操作失败',
                            type: 'error'
                        })
                    }
                })
            }else{
                this.$refs.tree.setChecked(i.id,false,true)
                this.checkedNodes = this.$refs.tree.getCheckedNodes()
            }
        },
        deleteSelect1(i,k) {
            this.checkedNodes1.splice(k,1)
            let arr = []
            this.checkedNodes1.forEach(i=>{
                arr.push(i.id)
            })
            this.$refs.tree1.setCheckedKeys(arr)
        },
        deleteSelect2(i,k) {
            this.checkedNodes2.splice(k,1)
            let arr = []
            this.checkedNodes2.forEach(i=>{
                arr.push(i.id) 
            })
            this.$refs.tree2.setCheckedKeys(arr)
        },
        checkdel(data,check) {
            if(check){
                
            }else{
                this.checkedNodes = this.$refs.tree.getCheckedNodes()
            }
        },
        getKey(checkedNodes,checkedKeys) {
            if(this.$store.state.systemSettings.states.type=="edit"){
                let a = checkedKeys.checkedNodes.map(i=>i.id)
                let b = this.checkedNodes.map(i=>i.id)
                let c = a.concat(b)
                let d = c.filter((i,v,arr)=>{
                    return arr.indexOf(i) == arr.lastIndexOf(i)
                })
                if(checkedKeys.checkedNodes.length>this.checkedNodes.length){
                    //添加节点  
                    this.checkWorkflowDept(d,'add').then(res=>{
                        if(res.code==0) {
                            this.checkedNodes = this.$refs.tree.getCheckedNodes()
                        }else{
                            this.$refs.tree.setChecked(checkedNodes.id,false,true)
                            this.$refs.tree.setCheckedKeys(this.checkedNodes.map(i=>i.id))
                            console.log(this.checkedNodes)
                            this.$message({
                                message: res.msg||'操作失败',
                                type: 'error'
                            })
                        }
                    })
                }else{
                    // 删除节点
                    this.checkWorkflowDept(d,'del').then(res=>{
                        if(res.code==0) {
                            this.checkedNodes = this.$refs.tree.getCheckedNodes()
                        }else{
                            this.$refs.tree.setChecked(checkedNodes.id,true,true)
                            this.$refs.tree.setCheckedKeys(this.checkedNodes.map(i=>i.id))
                            this.$message({
                                message: res.msg||'操作失败',
                                type: 'error'
                            })
                        }
                    })
                }
            }else{
                this.checkedNodes = checkedKeys.checkedNodes
            }   
        },
        getKey1(checkedNodes,checkedKeys) {
            this.checkedNodes1 = checkedKeys.checkedNodes
        },
        getKey2(checkedNodes,checkedKeys) {
            this.checkedNodes2 = checkedKeys.checkedNodes
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        filterNode1(value, data) {
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        filterNode2(value, data) {
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.departments
            })
            .then(res=>{
               	this.menuData = Object.values(this.$base.formattingJson(res.data))       
            })
            .catch(e=>{

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
            if(this.$store.state.systemSettings.states.id){
                this.$axios({
                    method: 'get',
                    url:this.$urls.workflowGetDetail+'/'+this.$store.state.systemSettings.states.id
                })
                .then(res=>{
                    if(res.data.status==200){
                        let obj = res.data.content
                        this.form.category = obj.category
                        this.form.name = obj.name
                        this.form.number = obj.number
                        this.form.departmentId = obj.workflowDepartmentVoList.map(i=>i.workflowDepartmentId)
                        this.selectDepartments = obj.workflowDepartmentVoList.map(i=>{
                            return {
                                id: i.workflowDepartmentId,
                                name: i.workflowDepartmentName
                            }
                        })
                        this.form.nodeVoList = obj.nodeVoList
                        let a = 0
                        obj.nodeVoList.forEach((i,k)=>{
                            if(a<i.orders){
                                a = i.orders
                            }
                        })
                        this.approval = []
                        for(let i = 0;i<a;i++){
                            this.approval.push({approve:[],notify:[]})
                        }
                        obj.nodeVoList.forEach((i,k)=>{
                            if(i.postAction=='approve'){
                                this.approval[i.orders-1].approve.push({title:i.postName,id:i.postId})
                            }else{
                                this.approval[i.orders-1].notify.push({title:i.postName,id:i.postId})
                            }
                        })
                    }
                })
                .catch(e=>{

                })	
            }
        },
		
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
.template{
    position: absolute;
    right: 10px;
    top: 1px;
}
.panel{
    width:400px;
    overflow-y:scroll;
    .fixed{
        width: 360px;
    }
	.contentWrap{
		padding: 24px 20px;
        min-height: calc(100% - 159px);
        .txt{
            font-size: 12px;
            color: #999999;
            position: relative;
            top: 1px;
            left: 10px;
        }
        .height30{
            height: 30px;
        }
        .mb14{
            margin-bottom: 14px;
        }
        .mb30{
            margin-bottom: 24px;
        }
        .mb24{
            margin-bottom: 24px;
        }
        .floatL{
            float: left;
        }
        .item{
            .left{
                width: 70px;
                float: left;
                font-size: 14px;
                color: #444950;
                height: 27px;
                line-height: 27px;
            }
            .right{
                float: left;
                width: 280px;
                margin-left: 10px;
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
                .mt10{
                    margin-top: 10px;
                }
                .tagWrap{
                    width: 78px;
                    text-align: center;
                    height: 25px;
                    line-height: 25px;
                    border: 1px solid #4c8aff;
                    color: #4c8aff;
                    position: relative;
                    float: left;
                    border-radius: 1px;
                    margin-right: 10px;
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
                .arrowRight{
                    width: 80px;
                    height: 25px;
                    text-align: center;
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
    .dialogBtn{
        left: 190px;
    }
    .body{
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
        background-color: #f4f8fc;
        margin: 0px auto;
        box-sizing: border-box;
        position: relative;
        .addFd{
            width: 100%;
            height:100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1000;
        }
        .left,.right{
            float: left;
            width:50%;
            height: 100%;
        }
        .right{
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
                width: 1px;
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
                    width: 14px;
                    height: 16px;
                    background: url("../../../assets/img/department.svg") no-repeat;
                    background-size: 100% 100%;
                    margin-left: 22px;
                    margin-top: 2px;
                }
                .icon1{
                    width: 14px;
                    height: 16px;
                    background: url("../../../assets/img/person.svg") no-repeat;
                    background-size: 100% 100%;
                    margin-left: 22px;
                    margin-top: 2px;
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
                    margin-right: 21px;
                    margin-top: 5px;
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
                padding: 0px 10px 10px 14px;
                overflow-y: scroll;
                height: 200px;
                margin-top: 10px;
                .el-tree{
                    background-color: #f4f8fc;
                    font-size: 12px;
                    width: 500px;
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
    }
    .mb10{
        margin-bottom: 10px;
    }
    .dialogBtn{
        .cancel{
            margin-top: 0;
            font-size: 12px;  
        }
    }
    .checkBoxWrap{
        margin-left: 10px;
    }
}
	
</style>