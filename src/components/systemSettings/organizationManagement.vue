<template>
    <div class="managementWrap">
        <div class="menu">
            <OrganizationMenu :icon-show="true" ref="menu" :reload="init" :is-draggable="true"></OrganizationMenu>
        </div>
        <div class="wrap">
            <div class="btnWrap">
                <div class="addDepartment" @click="addDepartment">新增部门</div>
                <div class="addPost" @click="addPost">新增岗位</div>
            </div>
            <div class="tableWrap">
                <div class="title">岗位列表</div>
                <Table :data-list="dataList" ref="table" :reload="init"></Table> 
                <div class="dataListNull" v-if="dataList.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>
            </div>
        </div>
        <DepartmentEdit v-if="$store.state.systemSettings.organizationEdit" :reload="departmentInit"></DepartmentEdit>
        <PostEdit v-if="$store.state.systemSettings.postEdit" :reload="init" :department="department"></PostEdit>
    </div>
</template>
<script>
import OrganizationMenu from '../common/systemSettings/organizationMenu'
import Table from '../table/systemSettings/organizationManagement'
import DepartmentEdit from '../panelPage/systemSettings/departmentEdit'
import PostEdit from '../panelPage/systemSettings/postEdit'
export default {
    name: 'organizationManagement',
	data () {
		return {
            dataList: [],
            department: {}
		}
    },
    created() {
        // this.init()
    },
    methods: {
        addDepartment() {
            this.$store.dispatch('organizationEdit',{id:'',type:'add'})
        },
        addPost() {
            this.$store.dispatch('postEdit',{id:'',type:'add'})
        },
        departmentInit() {
            this.$refs.menu.init()
        },
        init() {
            let data = this.$refs.menu.getNodeClick()
            this.department = data
            this.$axios({
                method: 'get',
                url:this.$urls.posts,
                params: {
                    departmentIds:data.id,
                    scope:''
                },
            })
            .then(res=>{      
                this.dataList = res.data
            })
            .catch(e=>{
                this.dataList = []
            })
        },
    },
    components: {
      	OrganizationMenu,
        Table,
        PostEdit,
        DepartmentEdit  
    }
}
</script>
<style lang='less' scoped>
.managementWrap{
    padding: 10px 10px;
    display: flex;
    display: -webkit-flex;
    flex-flow:row;
    height: calc(100% - 70px);
    .menu{
        width: 220px;
    }
    .wrap{
        flex: 1;
        margin-left: 10px;
        overflow-y: scroll;
        .btnWrap{
            overflow: hidden; 
        }
        .addDepartment,.addPost{
            width:72px;
            height:17px;
            padding: 8px 14px;
            background-color: #4c8aff;
            border-radius: 16.5px;
            color: #fff;
            font-size: 12px;
            text-align: center;
            float: left;
            margin-right: 10px;
            cursor: pointer;
        }
        .tableWrap{
            background-color: #ffffff;
            border-radius: 2px;
            margin-top: 10px;
            padding: 20px 0;
            height: calc(100% - 133px);
            overflow-y: scroll;
            .title{
                font-size: 14px;
                color: #666666;
                text-indent: 20px;
            }
        }
        .tableWrap::-webkit-scrollbar{
            display: none;
        }
    }
    .wrap::-webkit-scrollbar {
        display:none;
    }
}
</style>
