<template>
    <div class="headTabBar">
        <div class="headTabBarItem" v-for="(i,k) in headTabBar" :key="k" @click="headTabBarHandleClick(k)" :class="{selectTabBar:checkHeadTabBar[k]}">
            <div class="number">{{i.num}}</div>
            <div class="tag">{{checkTxt(i.txt)}}{{tabState}}</div>
            <div class="line" v-show="k!=headTabBar.length-1&&!checkHeadTabBar[k+1]"></div>
        </div>
        <div v-if="isCheck!='nocheck'" class="switchBtn" @click="changeConditions">
            <div>{{switchBtn}}</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'headTabBar',
    props: ['headTabBar','init','allList','checkBar','checkTab','isCheck','type'], 
            // 数字和文字，父组件init，显示全部的数组，所有tab显示未选中状态，是否截取部分文字,是否有切换按钮,类型
    data() {
        return {
            checkHeadTabBar: [true,false,false,false,false],
            switchBtn: '人数', 
            switchBtnCheck: false,
            tableType: 0, 
            tabState: this.type?this.type:'（单）',
        }
    },
    mounted() {
        
    },
    watch:{
        checkBar(val) {
            if (val){
                this.checkHeadTabBar = this.checkHeadTabBar.map((item,i)=>{
                    return false
                })
            }
        },
    },
    methods: {
        checkTxt(txt) {
            if (this.checkTab&&this.switchBtnCheck) {
                if (txt.length==5) {
                    return txt.substring(0,2)
                } else {
                    return txt.substring(0,3)
                }
            } else {
                return txt
            }
        },
        headTabBarHandleClick(k) {
            
            this.checkHeadTabBar = this.checkHeadTabBar.map((item,i)=>{
              	if(k==i) {
                   	return true
              	}
              	return false
            })
            let obj = {k,position: ''}

            if (k==1) {
                obj.position = this.allList[1]
            } else if (k==2) {
                obj.position = this.allList[2]
            } else if (k==3) {
                obj.position = this.allList[3]
            } else if (k==4) {
                obj.position = this.allList[4]
            } else if (k==0) {
                obj.position = this.allList[0]
            } 
            this.$store.dispatch('states',obj)
        },
        changeConditions() {
            if (this.switchBtnCheck) {
                this.switchBtn = '人数'
                this.tabState = '（单）'
            } else {
                this.switchBtn = '工单数'
                this.tabState = '（人）'
            }
            this.switchBtnCheck = !this.switchBtnCheck
            this.$store.dispatch('changeConditions',{switchBtnCheck:this.switchBtnCheck})
        }
    },
    destroyed() {
        this.switchBtnCheck = false
        this.$store.dispatch('changeConditions',{switchBtnCheck:this.switchBtnCheck})
    }
}
</script>
<style scoped lang="less">
    .headTabBar{
        height:110px;
        margin-top:10px;
        display:flex;
        padding:0 10px;
        position:relative;
        .switchBtn{
            width:45px;
            height:45px;
            position:absolute;
            background: url('../../assets/img/Triangle-right@3x.svg') no-repeat;
            background-size: 100% 100%;
            overflow:hidden;
            right:10px;
            top:0;
            color:#fff;
            font-size:12px;
            div{
                width: 45px;
                height: 45px;
                text-align:center;
                line-height:27px;
                float:right;
                transform:rotate(45deg);
            }
        }
        .headTabBarItem{
            flex:1;
            height:100%;
            background-color:#fff;
            position:relative;
            cursor:pointer;
            .number{
                font-family: 'Engschrift';
                height:41px;
                text-align:center;
                font-size:48px;
                margin-top:22px;
            }
            .tag{
                height:20px;
                line-height:20px;
                text-align:center;
                font-size: 14px;
                color: #666;
                margin-top:14px;
            }
            .line{
                width:1px;
                height:50px;
                background-color:#ececec;
                position:absolute;
                right:0;
                top:30px;
            }
        }
        .selectTabBar{
            background-color:#fafafa;
            .tag{
                color:#444950;
            }
            .line{
              display:none;
            }
        }
        .headTabBarItem:nth-of-type(1){
            color:#4c8aff;
        }
        .headTabBarItem:nth-of-type(2){
            color:#e45a3c;
        }
        .headTabBarItem:nth-of-type(3){
            color:#2fb768;
        }
        .headTabBarItem:nth-of-type(4){
            color:#fab334;
        }
        .headTabBarItem:nth-of-type(5){
            color:#666
        }
    }
</style>


