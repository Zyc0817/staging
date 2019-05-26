<template>
    <div class="budget">
        <div class="wrap" :class="{'minHeight':!setBudget}">
            <div class="head">
                <div class="leftButton" @click="last"><i class="el-icon-arrow-left"></i>上月</div>
                <div class="rightButton" @click="next">下月<i class="el-icon-arrow-right"></i></div>
                <div class="date">
                    <span>{{dateYear}}年</span>
                    <span class="month">{{parseInt(dateMonth)}}月</span>
                    <div class="datePicker">
                        <el-date-picker
                            v-model="selectDate"
                            type="month"
                            value-format="yyyy-MM"
                            format="yyyy-MM"
                            @change="datePicker"
                            :clearable="false"
                            placeholder="选择月">
                        </el-date-picker>  
                    </div>  
                </div>
            </div>
            <div class="line"></div>
            <div class="body">
                <div class="set" v-if="!setBudget" @click="setBudget=true">设置预算</div>
                <div class="departmentList">
                    <div class="head">
                        <div class="left">部门名称</div>
                        <div class="right" id="right">预算金额（元)</div>
                    </div>
                    <div class="line"></div>
                    <el-tree 
                        :data="dataList" 
                        :props="defaultProps" 
                        :expand-on-click-node='false'
                        :default-expand-all="true">
                        <div class="custom-tree-node" slot-scope="{ node, data }">
                            <span class="label"><i class="icon"></i>{{ node.label }}</span>
                            <div v-if="!setBudget" class="input" :style="{width}">{{ data.amount }}</div>
                            <div class="inputChange" :style="{width}" v-if="setBudget">
                                <input type="number" 
                                onkeyup="value=value.replace(/[^\d]/g,'')"
                                onblur="value=value.replace(/[^\d]/g,'')"
                                v-if="!data.children" 
                                @focus="data.amount==0?data.amount='':data.amount"
                                @blur="data.amount==''?data.amount=0:computedCost(data)"
                                v-model="data.amount">
                                <div v-else>{{ data.amount }}</div>
                            </div>
                        </div>     
                    </el-tree>
                    <div class="dataListNull" v-if="dataList.length==0">
                        <img src="../../../assets/img/zwsj.png" alt="">
                        <p>暂无相关数据</p>
                    </div> 
                </div>
            </div>
        </div>
        <div class="btn" v-if="setBudget">
            <div class="sub" @click="sub">保存</div>
            <div class="cancel" @click="setBudget=false,init()">取消</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'budget',
    data() {
        return {
            dateMonth: new Date().getMonth()+1,
            dateYear: new Date().getFullYear(),
            selectDate: '',
            dataList: [],
            dataList1: [],
            width: '',
            defaultProps: {
	          	children: 'children',
	          	label: 'department'
            },
            setBudget: false,
        }
    },
    created() {
        window.addEventListener("resize",this.right,false)
        this.selectDate = `${this.dateYear}-0${this.dateMonth}`
        this.init()
    },
    mounted() {
        this.$nextTick(()=>{
            this.right()
        })
    },
    methods:{
        computedCost(data) {
            let arr = [].concat(this.dataList1)
            arr.forEach(i=>{
                if(i.id==data.id){
                    i.amount = data.amount
                }
            })
            let parents = {}
            let _this = this
            step(data.parentId)
            function step(parentId) {
                if(parentId!="0") {
                    parents = arr.find(i=>i.id==parentId)
                    let total = 0
                    total = arr.reduce((a,i)=>{
                        if(i.parentId==parents.id){
                            return a+parseInt(i.amount)
                        }else{
                            return a
                        }                        
                    },0)
                    let a = arr.find(i=>i.id==data.id)
                    parents.amount= total
                    arr.forEach(i=>{
                        if(i.id==parents.id){
                            i.amount = parseInt(parents.amount)
                        }
                        if(i.id==a.id){
                            i.amount = parseInt(data.amount)
                        }
                    })
                    step(parents.parentId)
                }else{
                    parents = data
                    parents.amount= parseInt(data.amount)
                    let a = arr.find(i=>i.id==data.id)
                    arr.forEach(i=>{
                        if(i.id==parents.id){
                            i.amount = parseInt(parents.amount)
                        }
                        if(i.id==a.id){
                            i.amount = parseInt(data.amount)
                        }
                    })
                    let b = [].concat(arr)
                    arr = Object.values(_this.$base.buildTree(b))
                    _this.dataList = arr
                    _this.dataList1 = _this.dataList1.map(i=>{
                        return {
                            department:i.department,
                            amount:parseInt(i.amount),
                            id:i.id,
                            parentId:i.parentId,
                            departmentId:i.departmentId
                        }
                    })
                    
                }    
            } 
            
        },
        sub() {
            let arr = []
            let _this = this
            function arrchange(data) {
                for(let i = 0;i<data.length;i++){
                    arr.push({
                        amount: data[i].amount*100,
                        departmentId: data[i].id,
                        id:data[i].departmentId,
                        hotalId: _this.$store.state.hotalId,
                        yearMonth: new Date(`${_this.selectDate}-01`).getTime()
                    })
                    if(data[i].children&&data[i].children.length) {
                        arrchange(data[i].children)
                    }
                }                
            }
            arrchange(this.dataList)
            this.$axios({
                method: 'put',
                url:this.$urls.budgetConstraint,
                data: arr
            })
            .then(res=>{
               	if(res.data.status==200){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                    this.init()
                    this.setBudget = false
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
        right() {
            let width = document.getElementById('right').clientWidth
            this.width = width + 'px'
        },
        init() {
            let date = new Date(`${this.selectDate}-01`).getTime()
            
            this.$axios({
                method: 'get',
                url:this.$urls.budgetShow,
                params:{
                    hotalId:this.$store.state.hotalId,
                    yearMonth:date
                }
            })
            .then(res=>{
               	if(res.data.status==200){
                    let data = res.data.content.map(i=>{
                        return {
                            department:i.department,
                            amount:i.amount/100,
                            id:i.departmentId,
                            parentId:i.parentId,
                            departmentId:i.id
                        }
                    })
                    this.dataList1 = res.data.content.map(i=>{
                        return {
                            department:i.department,
                            amount:i.amount/100,
                            id:i.departmentId,
                            parentId:i.parentId,
                            departmentId:i.id
                        }
                    })
                    this.dataList = Object.values(this.$base.buildTree(data))  
                }
            })
            .catch(e=>{

            })	
        },
        handleNodeClick(data) {
            console.log(data)
        },
        datePicker() {
            console.log(this.selectDate)
            this.dateYear = this.selectDate.substring(0,4)
            this.dateMonth = this.selectDate.substring(5,9)
        },
        last() {
            this.dateMonth--
            if (this.dateMonth == 0) {
                this.dateYear--
                this.dateMonth = 12
            }
            this.selectDate = `${this.dateYear}-${this.dateMonth}`
            this.init()
        },
        next() {
            this.dateMonth++
            if (this.dateMonth == 13) {
                this.dateYear++
                this.dateMonth = 1
            }
            this.selectDate = `${this.dateYear}-${this.dateMonth}`
            this.init()
        }
    },
    destroyed() {
        window.removeEventListener("resize",this.right)
    }
}
</script>
<style lang="less" scoped>
.budget{
    height: 100%;
    .wrap{
        min-height: calc(100% - 79px);
        background-color: #fff;
        .width{
            width: 288px;
            padding-top: 24px;
            padding-left: 24px;
            position: relative;
            .txt{
                position: absolute;
                right: 10px;
                top: 1px;
            }
        }
    }
    .minHeight{
        height: 100%;
    }
    .head{
        overflow: hidden;
        font-size: 18px;
        color: #444950;
        .leftButton{
            height: 26px;
            line-height: 26px;
            float: left;
            margin: 18px 0 0 24px;
            cursor: pointer;
        }
        .date{
            width: 135px;
            margin: 18px auto;
            position: relative;
            .datePicker{
                position: absolute;
                top: 0;
                opacity: 0;
            }
            .month{
                margin-left: 30px;
            }
        }
        .rightButton{
            float: right;
            margin: 18px 24px 0 0;
            cursor: pointer;
        }
    }
    .line{
        height: 2px;
        background-color: #f4f8fc;
    }
    .body{
        padding: 10px 0 10px 0px;
        .set{
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
        .departmentList{
            .head{
                overflow: hidden;
                div{
                    float: left;
                    width: 50%;
                    text-align: center;
                    padding-top: 15px;
                    font-size: 12px;
                    color: #444950;
                }
            }
            .line{
                margin-top: 15px;
                background-color: #4c8aff;
            }
            
            .custom-tree-node{
                height: 47px;
                line-height: 47px;  
                width: 100%;
                .icon{
                    width: 14px;
                    height: 14px;
                    display: inline-block;
                    vertical-align: middle;
                    background: url("../../../assets/img/organizationMenu1.svg") no-repeat;
                    background-size: 100% 100%;
                    margin-right: 8px;
                }
                .input{
                    margin: 0 auto;
                    float: right;
                    text-align: center;
                }
                .inputChange{
                    float: right;
                    text-align: center;
                    input{
                        width: 100px;
                        height: 25px;
                        background-color: #ffffff;
                        border-radius: 1px;
                        border: solid 1px #ececec;
                        text-align: center;
                        font-size: 12px;
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
}
</style>