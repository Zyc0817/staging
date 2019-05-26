<template>
	<div class="organizationMenu">
        <div class="searchWrap">
            <div class="searchIcon icon-search"></div>
            <input type="text" name="" placeholder="部门名称" v-model="searchValue" class="searchInput">
        </div>
        <div class="line"></div>
        <el-tree
            class="filter-tree"
            :data="menuData"
            :props="defaultProps"
            default-expand-all
            :draggable="draggable"
            :expand-on-click-node='false'
            @node-drop="handleDrop"
            :filter-node-method="filterNode"
            ref="tree">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="label" @click="nodeClick(data)"><i class="icon"></i><span>{{ node.label }}</span><span v-if="data.parentId">({{data.actualTotal}}/{{data.planTotal}})</span></span>
                <div v-if="iconShow" class="operation" @mouseover="() => operation(data)">
                    <div></div>
                    <div></div>
                    <div></div>
                    <ul class="operationList" v-if="checkList[data.id]">
                        <li @click.stop="addDepartment(data)">新增子部门</li>
                        <li v-if="data.parentId" @click.stop="edit(data)">编辑</li>
                        <li v-if="data.parentId" @click.stop="deleteDepartment(data)">删除</li>
                    </ul>
                </div>
            </span>
        </el-tree>
	</div>
</template>
<script>
export default {
    name: 'organizationMenu',
    props: ['iconShow','reload','isDraggable'],
  	data () {
      	return {
            searchValue: '',
            defaultProps: {
	          	children: 'children',
	          	label: 'name'
            },
            menuData: [],      
            checkList: {},    
            getNode: {},
            draggable:false,    
      	}
    },
    watch: {
        searchValue(val) {
            this.$refs.tree.filter(val);
        },
    },
    created() {
        this.init()
        this.draggable = this.isDraggable
    },
    mounted() {
        document.addEventListener("click", this.cancel,false)
    },
    destroyed() {
        document.removeEventListener("click",this.cancel)
    },
    methods: {
        handleDrop(draggingNode, dropNode, type, ev) {
            console.log(draggingNode)
            console.log(dropNode)
            console.log(type)
            let newOrders = parseInt(dropNode.data.orders)
            let newParentId = dropNode.data.parentId
            if(type=='after'){
                if(newParentId==draggingNode.data.parentId&&draggingNode.data.orders>newOrders){
                    newOrders++
                }
            }else if(type=='inner'){
                newOrders = 1
                newParentId = dropNode.data.id
            }else {
                if(newParentId==draggingNode.data.parentId&&draggingNode.data.orders<newOrders){
                    newOrders--
                }
            }
            this.$axios({
                method: 'post',
				url:this.$urls.updateDepartment,
				data: {
                    name:draggingNode.data.name,
                    newParentId,
                    id: draggingNode.data.id,
                    parentId:draggingNode.data.parentId,
                    orders:draggingNode.data.orders,
                    newOrders,
                    planTotal:draggingNode.data.planTotal,
                    actualTotal:draggingNode.data.actualTotal,
                    needSplit: draggingNode.data.needSplit
                }
            })
            .then(res=>{
				if(res.data.code==0){
					this.$message({
						message: "操作成功",
						type: 'success',
						duration: 5 * 1000
                    })
                    this.init()
				}else{
					this.$message({
						message: res.data.msg||"操作失败",
						type: 'error',
						duration: 5 * 1000
                    })
                    this.init()
				}		
            })
            .catch(e=>{
		
            })	
        },
        nodeClick(data) {
            this.getNode = data
            this.reload()
        },
        getNodeClick() {
            return this.getNode
        },
        addDepartment(id) {
            this.cancel()
            this.$store.dispatch('organizationEdit',{id,type:'add'})
        },
        deleteDepartment(data) {
            this.cancel()
            const h = this.$createElement;
            if (data.children&&data.children.length) {
                this.$msgbox({
                    title: '删除',
                    message: h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;'}, `请删除“${data.name}”下面的子部门或岗位后，再删除此部门`),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(action => {
                    
                }).catch(() => {
                        
                })
            } else {
                this.$msgbox({
                    title: '删除',
                    message: h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;'}, `确认删除“${data.name}”部门吗`),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(action => {
                    this.$axios({
                        method: 'post',
                        url:this.$urls.delDepartment,
                        params:{departmentId:data.id}
                    })
                    .then(res=>{
                        if(res.data.code==0){
                            this.$message({
                                message: "操作成功",
                                type: 'success',
                                duration: 5 * 1000,			
                            })
                            this.init()
                        }else{
                            this.$message({
                                message: res.data.msg||"操作失败",
                                type: 'error',
                                duration: 5 * 1000,			
                            })
                        }
                    })
                    .catch(e=>{
                        
                    })	
                }).catch(() => {
                        
                })
            }
	 		
        },
        edit(id) {
            this.cancel()
            this.$store.dispatch('organizationEdit',{id,type:'edit'})
        },
        cancel() {
            for (let i in this.checkList) {
                this.checkList[i] = false
            }
            this.checkList = Object.assign({}, this.checkList)
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.departments
            })
            .then(res=>{
               	this.menuData = Object.values(this.$base.buildTree1(res.data))       
                if(!this.getNode.id){
                    this.getNode = res.data.find(i=>i.parentId==0)
                    this.reload()
                }
                res.data.forEach((i)=>{
                    this.checkList[i.id] = false
                })
            })
            .catch(e=>{

            })	
        },
        operation(data) {
            for (let i in this.checkList) {
                this.checkList[i] = false
            }
            this.checkList[data.id] = !this.checkList[data.id]
            this.checkList = Object.assign({}, this.checkList)
        }
    }
}
</script>
<style scoped lang="less">
.organizationMenu{
    height: 100%;
    background-color: #fff;
    padding-top: 10px;
    box-sizing: border-box;
    min-width: 220px;
    .filter-tree{
        padding-left: 4px;
        padding-top: 3px;
        overflow-x: scroll;
        overflow-y: scroll;
        height: calc(100% - 50px);
    }
    .searchWrap{
        width: calc(100% - 20px);
        height: 33px;
        border: 1px solid #ececec;
        box-sizing: border-box;
        border-radius: 16.5px;
        margin: 0 auto;
        .searchIcon{
            float: left;
            margin: 8px 10px 0;
            font-size: 17px;
        }
        .searchInput{
            width: 150px;
            border: none;
            outline: none;
            float: left;
            margin-top: 7px;
            font-size: 12px;
            color: #666;
            height: 17px;
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
    .line{
        border-top: 2px dashed #ececec;
        width: calc(100% - 20px);
        margin: 0 auto;
        margin-top: 12px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        // justify-content: space-between;
        font-size: 12px;
        padding-right: 10px;
        color: #444950;
        padding-top: 5px;
        padding-bottom: 5px;
        .label{
            .icon{
                width: 14px;
                height: 14px;
                display: inline-block;
                vertical-align: top;
                background: url("../../../assets/img/organizationMenu1.svg") no-repeat;
                background-size: 100% 100%;
                margin-right: 8px;
                margin-top: 1px;
            }
        }
        .operation{
            display: none;
            height: 16px;
            position: relative;
            margin-left: 10px;
            .operationList{
                width: 80px;
                position: absolute;
                background-color: #ffffff;
                box-shadow: 0px 0px 4px 0px 
                    rgba(51, 51, 51, 0.1);
                border-radius: 2px;
                right: -85px;
                top: 9px;
                padding: 5px 0;
                li{
                    height: 27px;
                    line-height: 27px;
                    text-indent: 10px;
                    font-size: 12px;
                    color: #666666;
                }
                li:hover{
                    background-color: #eaf3fe;
                }
            }
            div{
                float: left;
                width: 3px;
                height: 3px;
                background-color: #4c8aff;
                margin-left: 2px;
                border-radius: 50%;
                margin-top: 6.5px;
            }
        }
    }
    .custom-tree-node:hover{
        .operation{
            display: block;
        }
    }
}
</style>
