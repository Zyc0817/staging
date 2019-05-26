<template>
    <div class="processSet">
        <div class="headWrap">
            <div class="btn" @click="add">新增招聘者</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" v-model="dataListParams.search" placeholder="招聘渠道/招聘者/姓名/手机号" class="searchInput">
                <div class="searchBtn" @click="init">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <div class="tableWrap">
            <div class="listWrap">
                <Table :data-list="dataList"
                    ref="table"></Table> 
                <div class="dataListNull" v-if="dataList.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>  
            </div>
        </div>
        <CompanyDetail v-if="$store.state.systemSettings.companyDetail" :edit-page="editPage"></CompanyDetail> 
        <ParttimeDetail v-if="$store.state.systemSettings.parttimeDetail"></ParttimeDetail>
        <AddRecruiters v-if="$store.state.systemSettings.addRecruiters" :reload="init"></AddRecruiters>
    </div>
</template>
<script>
import Table from '../table/systemSettings/recruitmentManagement'
import CompanyDetail from '../panelPage/systemSettings/companyDetail'
import ParttimeDetail from '../panelPage/systemSettings/parttimeDetail'
import AddRecruiters from '../panelPage/systemSettings/addRecruiters'

export default {
    name: 'processSet',
    data() {
        return {
            dataList: [],
            dataListParams: {  //  请求数据参数
                search: ''
            },
            total: 0
        }
    },
    created() {
        this.init()
        
    },
    methods: {
        editPage(id) {
            this.$store.dispatch('addRecruiters',{id})
        },
        add() {
            this.$store.dispatch('addRecruiters',{id:''})
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.getHotalAgency,
                params:this.dataListParams
            })
            .then(res=>{
                this.dataList = res.data
            })
            .catch(e=>{
                this.dataList = []
            })
        },
    },
    components:{
        Table,
        CompanyDetail,
        ParttimeDetail,
        AddRecruiters
    }
}
</script>
<style lang="less" scoped>
.processSet::-webkit-scrollbar {
	display:none;
}
.processSet{
    height: calc(100% - 50px);
    overflow-y: scroll;
    .headWrap{
        overflow:hidden;
        .btn{
            width:72px;
            height:17px;
            padding: 8px 14px;
            background-color: #4c8aff;
            border-radius: 16.5px;
            font-size:12px;
            color:#fff;
            text-align:center;
            float:left;
            margin:10px 0 0 10px;
            cursor:pointer;
        }
        .searchWrap{
            width: 375px;
            height: 33px;
            background-color: #ffffff;
            border-radius: 22.5px;
            float:right;
            margin:10px 10px 0 0;
            .searchInput{
                float:left;
                height:100%;
                width:250px;
                margin-left:10px;
                box-sizing:border-box;
                outline:none;
                border:none;
                color: #444950;
                font-size: 12px;
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
            .searchIcon{
                font-size: 18px;
                float:left;
                margin:7.5px 0 0 20px;
            }
            .searchBtn{
                height:17px;
                line-height:17px;
                float:right;
                font-size:12px;
                color:#666;
                margin:8px 20px 0 0;
                cursor:pointer;
            }
            .line{
                width:1px;
                height:18px;
                background-color:#ececec;
                float:right;
                margin: 7.5px 20px 0 0;
            }
        }
    }
    .tableWrap{
        padding:0 10px 10px 10px;
        margin-top:10px;
        height: 100%;
        .listWrap{
            background-color: #fff;
            min-height: calc(100% - 133px);
            padding-bottom: 20px;
        }
    }
}
    
</style>

