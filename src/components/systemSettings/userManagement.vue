<template>
    <div class="managementWrap">
        <div class="wrap">
            <div class="contentWrap">
                <div class="tabBar">
                    <div class="left" :class="{'select':tabBarCheck}" @click="tabBarCheck=true">账号管理</div>
                    <div class="right" :class="{'select':!tabBarCheck}" @click="tabBarCheck=false">角色权限管理</div>
                </div>  
            </div>
            <div v-if="tabBarCheck" class="userWrap">
                <div class="menu">
                    <OrganizationMenu :icon-show="false" ref="menu" :reload="init"></OrganizationMenu>
                </div>
                <div style="flex:1;">
                    <div class="tableWrap">
                        <div class="add" @click="add">新增账号</div>
                        <Table :data-list="dataList" ref="table" :reload="init"></Table>     
                        <div class="dataListNull" v-if="dataList.length==0">
                            <img src="../../assets/img/zwsj.png" alt="">
                            <p>暂无相关数据</p>
                        </div> 
                    </div>
                </div>
            </div>
            <div v-if="!tabBarCheck" style="height:calc(100% - 70px)">
                <div class="tableWrap" >
                    <div class="add" @click="addRole">新增角色</div>
                    <RoleManagement :data-list="roleDataList" ref="table" :reload="roleInit"></RoleManagement>     
                    <div class="dataListNull" v-if="roleDataList.length==0">
                        <img src="../../assets/img/zwsj.png" alt="">
                        <p>暂无相关数据</p>
                    </div>       
                </div>    
            </div>
        </div>
        <AccountEdit v-if="$store.state.systemSettings.accountEdit" :departments="departments" :reload="init"></AccountEdit>
        <RoleEdit v-if="$store.state.systemSettings.roleEdit" :reload="roleInit"></RoleEdit>
        <UserDetail v-if="$store.state.systemSettings.userDetail"></UserDetail>
        <RoleDetail v-if="$store.state.systemSettings.roleDetail"></RoleDetail>
    </div> 
</template>
<script>
import OrganizationMenu from '../common/systemSettings/organizationMenu'
import Table from '../table/systemSettings/userManagement'
import AccountEdit from '../panelPage/systemSettings/accountEdit'
import RoleManagement from '../table/systemSettings/roleManagement'
import RoleEdit from '../panelPage/systemSettings/roleEdit'
import UserDetail from '../panelPage/systemSettings/userDetail'
import RoleDetail from '../panelPage/systemSettings/roleDetail'
export default {
    name: 'userManagement',
	data () {
		return {
            dataList: [],
            roleDataList: [],
            total: 0,
            tabBarCheck: true,
            departments: {}
		}
    },
    watch:{
        tabBarCheck(val) {
            if(val){
                this.$nextTick(()=>{
                    this.init()     
                })
            } else {
                this.roleInit()
            }
        }
    },
    created() {
        // this.init()
    },
    methods: {
        add() {
            const id = ''
            this.$store.dispatch('accountEdit',{id})
        },
        addRole() {
            const id = ''
            this.$store.dispatch('roleEdit',{id})
        },
        roleInit() {
            this.$axios({
                method: 'get',
                url:this.$urls.roleList,
            })
            .then(res=>{      
                this.roleDataList = res.data
            })
            .catch(e=>{
                
            })
        },
        init() {
            let data = this.$refs.menu.getNodeClick()
            if(!data.id){
                return
            }
            this.departments = data
            this.$axios({
                method: 'get',
                url:this.$urls.userList,
                params: {
                    departmentIds: data.id
                }
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
        AccountEdit,
        RoleManagement,
        RoleEdit,
        UserDetail,
        RoleDetail
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
    .userWrap{
        display: flex;
        display: -webkit-flex;
        flex-flow:row;
        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
        height: calc(100% - 72px);      
        overflow-y: scroll;
    }
    .menu{
        width: 220px;
        margin-top: 1px;
        margin-right: 10px;
    }
    .wrap{
        width: 100%;
        .contentWrap{
            background-color: #fff;
            .tabBar{
                height: 60px;
                width: 779px;
                margin: 0 auto;
                color: #444950;
                margin-bottom: 10px;
                div{
                    width: 150px;
                    height: 100%;
                    line-height: 60px;
                    font-size: 16px;
                    float: left;    
                    text-align: center;
                    cursor: pointer;
                }
                .right{
                    float: right;
                }
            }
            .select{
                color: #4c8aff;
                border-bottom:2px solid #4c8aff;
            }
        }
        .tableWrap{
            background-color: #fff;
            margin-top: 2px;
            flex: 1;
            padding: 10px 0px;
            height: calc(100% - 70px);
            overflow-y: scroll;
            .add{
                width:72px;
                height:17px;
                padding: 8px 14px;
                background-color: #4c8aff;
                border-radius: 16.5px;
                color: #fff;
                font-size: 12px;
                text-align: center;
                margin-left: 20px;
                cursor: pointer;
            }
        }
        .tableWrap::-webkit-scrollbar {
            display:none;
        }
    }
}
</style>

