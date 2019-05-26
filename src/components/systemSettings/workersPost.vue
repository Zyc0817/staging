<template>
    <div class="processSet">
        <div class="headWrap">
            <div class="btn" @click="addPostName(dataList)">新增用工岗位</div>
            <div class="searchWrap">
                <div class="searchIcon icon-search"></div>
                <input type="text" name="" v-model="dataListParams.search" 
                placeholder="岗位名称/用工部门"
                class="searchInput"
                @keyup.enter="fuzzySearch">
                <div class="searchBtn" @click="init">搜索</div>
                <div class="line"></div>
            </div>
        </div>
        <div class="tableWrap">
            <div class="listWrap">
                <Table :data-list="dataList" ref="table" :roled='init'></Table> 
                <div class="dataListNull" v-if="dataList.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>  
            </div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="dataListParams.current"
                :page-sizes="[8,10]"
                :page-size="dataListParams.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
              </el-pagination>
        </div>
        <EditPostName v-if="$store.state.systemSettings.editPostNameShow" :roledEdit="init"></EditPostName> 
        <AddPostName v-if="$store.state.systemSettings.addPostNameShow" :roled="init"></AddPostName>
        <CheckPostName v-if="$store.state.systemSettings.checkPostNameShow"></CheckPostName>
    </div>
</template>
<script>
import Table from '../table/systemSettings/workersPost'
import EditPostName from '../panelPage/systemSettings/editPostName'
import AddPostName from '../panelPage/systemSettings/addPostName'
import CheckPostName from '../panelPage/systemSettings/checkPostName'
import _ from 'lodash'
export default {
    name: 'workersPost',
    data() {
        return {
            dataList: [],
            dataListParams: {  //  请求数据参数
                current: 1,
                size: 8,
                search: ''
            },
            total: 0
        }
    },
    created() {
        this.init()
    },
    methods: {
        handleSizeChange(val) {
        	this.dataListParams.size = val
            this.init()
          },
          handleCurrentChange(val) {
        	this.dataListParams.current = val
            this.init()
      	},
        addPostName(id) {
            let params = {title: '新增用工岗位',operation: 0,type: 'addPostName',id}
            this.$store.dispatch('addPostName',params)
        },
        fuzzySearch() {
            this.init()
        },
        init() {
            this.$axios({
                method: 'post',
                url:this.$urls.getOutsidePostList,
                data: this.dataListParams
            })
            .then(res=>{
                this.dataList = _.get(res,'data.records',[])
                this.total = _.get(res,'data.total',0)
            })
            .catch(e=>{
                this.dataList = []
            })
        },
    },
    components:{
        Table,
        EditPostName,
        AddPostName,
        CheckPostName
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




