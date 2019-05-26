<template>
    <div class="homePage"> 
        <div class="title">待处理</div>
        <div class="wrap">
            <div class="item" @click="toPath('approvalEmployment')">
                <img src="../../assets/img/homepage/13.png" class="bg" alt="">
                <p class="title1">
                    <span>待审批</span><span>用工单</span>
                </p>
                <div class="num" v-if="pending">
                    <div class="div1">{{pending}}</div>
                    <div class="div2">单</div>
                </div>
                <div v-else class="null">暂无数据</div>
            </div>
            <div class="item" @click="toPath('decomposition')">
                <img src="../../assets/img/homepage/14.png" class="bg" alt="">
                <p class="title1">
                    <span>待分解</span><span>用工单</span>
                </p>
                <div class="num" v-if="not_split">
                    <div class="div1">{{not_split}}</div>
                    <div class="div2">单</div>
                </div>
                <div v-else class="null">暂无数据</div>
            </div>
            <div class="item" @click="toPath('costApproval')">
                <img src="../../assets/img/homepage/15.png" class="bg" alt="">
                <p class="title1">
                    <span>待审批</span><span>结算单</span>
                </p>
                <div class="num" v-if="billPending">
                    <div class="div1">{{billPending}}</div>
                    <div class="div2">单</div>
                </div>
                <div v-else class="null">暂无数据</div>
            </div>  
        </div>
        <div class="title">今日用工概况</div>
        <div class="wrap">
            <div class="item1">
                <div class="left">
                    <img src="../../assets/img/homepage/4.svg" alt="">
                </div>
                <div class="line"></div>
                <div class="right">
                    <div class="div1 color1">{{totalMan}}</div>
                    <div class="div2">计划（人)</div> 
                </div>
            </div>
            <div class="item1">
                <div class="left">
                    <img src="../../assets/img/homepage/5.svg" alt="">
                </div>
                <div class="line"></div>
                <div class="right">
                    <div class="div1 color2">{{signIn}}</div>
                    <div class="div2">已签到（人)</div> 
                </div>
            </div>
            <div class="item1">
                <div class="left">
                    <img src="../../assets/img/homepage/6.svg" alt="">
                </div>
                <div class="line"></div>
                <div class="right">
                    <div class="div1 color3">{{signOut}}</div>
                    <div class="div2">已签退（人)</div> 
                </div>
            </div>
        </div>
        <div class="title">快捷入口<img @click="quickEntry" src="../../assets/img/homepage/7.svg" alt=""></div>
        <div class="wrap">
            <div class="item2" v-for="(i,k) in dataList2" :key="k" @click="toPath1(i.name)">
                <img :src="i.src" alt="">
                <p>{{i.title}}</p>
            </div>
        </div>
        <QuickEntry v-if="$store.state.quickEntry" :order-init="quickEntryInit"></QuickEntry>
    </div>

</template>

<script>
import QuickEntry from '../panelPage/homePage/quickEntry'
export default {
    name: 'homePage',
    data () {
        return {
            pending: 0,
            not_split: 0,
            billPending: 0,
            totalMan: 0,
            signIn: 0,
            signOut: 0,
            dataList2: [],
            dataList: [],
            menuList: [{
                title: '用工申请',
                src:require('../../assets/img/homepage/RecruitApply.png'),
                name: 'employmentApplication'
            },{
                title: '员工上班',
                src:require('../../assets/img/homepage/StaffWork.png'),
                name: 'employeesWork'
            },{
                title: '用工费用',
                src:require('../../assets/img/homepage/RecruitCost.png'),
                name: 'laborCosts'
            },{
                title: '费用结算',
                src:require('../../assets/img/homepage/CostSettle.png'),
                name: 'costSettlement'
            },{
                title: '用工审批',
                src:require('../../assets/img/homepage/RecruitApprove.png'),
                name: 'approvalEmployment'
            },{
                title: '招聘分解',
                src:require('../../assets/img/homepage/AdvertiseResolve.png'),
                name: 'decomposition'
            },{
                title: '聘用管理',
                src:require('../../assets/img/homepage/EmployManage.png'),
                name: 'hireManagement'
            },{
                title: '劳务确认',
                src:require('../../assets/img/homepage/LabourConfirm.png'),
                name: 'companyConfirm'
            },{
                title: '签到签退',
                src:require('../../assets/img/homepage/SignINSignOut.png'),
                name: 'signIn'
            },{
                title: '住宿管理',
                src:require('../../assets/img/homepage/LodgingManage.png'),
                name: 'hotelManagement'
            },{
                title: '奖惩管理',
                src:require('../../assets/img/homepage/R&PManage.png'),
                name: 'rewardsAndPunishments'
            },{
                title: '员工档案',
                src:require('../../assets/img/homepage/StaffRecords.png'),
                name: 'employeeFiles'
            },{
                title: '费用审批',
                src:require('../../assets/img/homepage/CostApprove.png'),
                name: 'costApproval'
            },{
                title: '财务付款',
                src:require('../../assets/img/homepage/FinancePay.png'),
                name: 'costPay'
            }]
        }
    },
    created() {
        this.init()
        this.quickEntryInit()
    },
    methods:{
        quickEntry() {
            this.$store.dispatch('setQuickEntry')
        },
        toPath(name) {
            this.$router.push({name,params:{state:2}})
        },
        toPath1(name) {
            this.$router.push({name})
        },
        quickEntryInit() {
            
            this.$axios({
                method: 'get',
                url:this.$urls.getShortcutMenu,
            })
            .then(res=>{      
                if(res.data.status==200){
                    if(res.data.content.length>1){
                        this.dataList2 = []
                        this.menuList.forEach(i=>{
                            res.data.content.forEach(j=>{
                                if(i.title==j.zhCn){
                                    this.dataList2.push(i)
                                }
                            })
                        })
                    }else{
                        let a = JSON.parse(localStorage.getItem('menuList'))
                        a = a.filter(i=>i.parentId!=0)
                        a = a.filter((i,k)=>k<4)
                        this.menuList.forEach(i=>{
                            a.forEach(j=>{
                                if(i.title==j.zhCn){
                                    this.dataList2.push(i)
                                }
                            })
                        })
                    }
                }
            })
            .catch(e=>{
                
            })
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.getStatistics,
            })
            .then(res=>{      
                if(res.data.status==200){
                    this.pending = res.data.statistics.pending
                    this.billPending = res.data.statistics.billPending
                    this.not_split = res.data.statistics.not_split
                    this.signIn = res.data.statistics.signIn
                    this.signOut = res.data.statistics.signOut
                    this.totalMan = res.data.statistics.totalMan
                }
            })
            .catch(e=>{
                
            })
        }
    },
    components:{
        QuickEntry
    }
}
</script>
<style scoped lang="less">
.homePage{
    .title{
        font-size: 16px;
        color: #666666;
        font-weight: 500;
        margin: 15px 10px;
        img{
            float: right;
        }
    }
    .wrap{
        display: flex;
        flex-direction:row;
        padding: 0 10px;
        .item{
            height: 200px;
            border-radius: 2px;
            flex: 1;
            overflow: hidden;
            position: relative;
            cursor: pointer;
            .bg{
                width: 222px;
                height: 200px;
                position: absolute;
                right: 0;
                top: 0;
            }
            .title1{
                margin: 20px 0 0 20px;
                span{
                    font-size: 16px;
                    color: #ffffff;
                    margin-right: 10px;
                }
            }
            .num{
                overflow: hidden; 
                text-align: center;
                margin: 0 auto;
                margin-top: 36px;
                position: relative;
                z-index: 2;
                .div2{
                    display: inline-block;
                    color: #ffffff;
                    font-size: 18px;
                    margin-left: 10px;
                }
                .div1{
                    display: inline-block;
                    color: #ffffff;
                    font-family: 'Engschrift';
                    height: 45px;
                    font-size: 52px;
                }

            }
            .null{
                font-size: 24px;
                color: #ffffff;
                text-align: center;
                margin-top: 40px;
                position: relative;
                z-index: 2;
            }
        }
        .item:nth-of-type(1){
            background: url("../../assets/img/homepage/1.png") no-repeat;
            background-size: 100% 100%;
        }
        .item:nth-of-type(2){
            background: url("../../assets/img/homepage/2.png") no-repeat;
            background-size: 100% 100%;
            margin: 0 11px;
        }
        .item:nth-of-type(3){
            background: url("../../assets/img/homepage/3.png") no-repeat;
            background-size: 100% 100%;
        }
        .item1{
            height: 150px;
            background-color: #ffffff;
            border-radius: 2px;
            flex: 1;
            overflow: hidden;
            .left{
                float: left;
                width: 150px;
                height: 100%;
                img{
                    margin: 50px;
                }
            }
            .line{
                float: left;
                width: 1px;
                height: 110px;
                background-color: #ececec;
                margin-top: 20px;
            }
            .right{
                float: left;
                width: calc(100% - 151px);
                height: 100%;
                text-align: center;
                .div1{
                    font-family: 'Engschrift';
                    height: 45px;
                    font-size: 52px;
                    margin-top: 27px;
                }
                .div2{
                    font-size: 16px;
                    color: #444950;
                    margin-top: 20px;
                }
                .color1{
                    color: #4c8aff;
                }
                .color2{
                    color: #2fb768;
                }
                .color3{
                    color: #fab334;
                }
            }
        }
        .item1:nth-of-type(2){
            margin: 0 10px;
        }
        .item2{
            background: #fff;
            flex:1;
            height: 162px;
            text-align: center;
            cursor: pointer;
            img{
                margin-top: 40px;
                height: 48px;
                width: 40px;
            }
            p{
                margin-top: 12px;
                font-size: 16px;
                color: #444950;
            }
        }
    }
}
</style>
