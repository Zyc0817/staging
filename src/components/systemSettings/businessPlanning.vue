<template>
    <div class="businessPlanning">
        <ul class="menu">
            <li 
                v-for="(i,k) in menu"
                :key='k'
                :class="{'select':menuCheck[k]}"
                @click="checkMenu(k)">
                <router-link tag="div" :to="{name:i.path}">{{i.name}}</router-link>
            </li>
        </ul>
        <div class="content">
            <router-view></router-view> 
        </div>
    </div>
</template>
<script>
export default {
    name: 'businessPlanning',
	data () {
		return {
            menu:[{name:'用工准入条件',path:'employmentConditions'},
            {name:'打卡设置',path:'clockSettings'},
            // {name:'用工申请设置',path:'employmentApplicationSetup'},
            {name:'结算单设置',path:'statements'},
            {name:'节假日设置',path:'holidays'},
            {name:'预算设置',path:'budget'},
            {name:'用餐设置',path:'mealSet'},
            {name:'时间设置',path:'timeSet'}],
            menuCheck: [true,false,false,false,false,false,false]
		}
    },
    created() {
        if (this.$route.name=='businessPlanning') {
            this.$router.push({name:'employmentConditions'})
        }
        
    },
    mounted() {
        this.selected()
    },
    methods:{
        checkMenu(k) {
            this.menuCheck = this.menuCheck.map(i=>false)
            this.menuCheck = this.menuCheck.map((i,key)=>{
                if(k==key){
                    return true
                }else{
                    return false
                }
            })
        },
        selected() {
            this.menu.forEach((i,k)=>{
                if(i.path==this.$route.name){
                    this.checkMenu(k)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.businessPlanning{
    padding: 10px 10px;
    display: flex;
    display: -webkit-flex;
    flex-flow:row;
    height: calc(100% - 70px);
    .menu{
        width: 220px;
        background-color: #ffffff;
        border-radius: 2px;
        padding-top: 15px;
        li{
            height: 50px;
            line-height: 50px;
            text-indent: 30px;
            font-size: 14px;
            color: #444950;
            cursor: pointer;
        }
        .select{
            background-color: #eaf3fe;
            color: #4c8aff;
        }
    }
    .content{
        flex:1;
        margin-left: 10px;
        height: 100%;
        overflow-y: scroll;
    }
    .content::-webkit-scrollbar {
        display:none;
    }
}
</style>

