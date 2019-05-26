<template>
    <div class="holidays">
        <div class="left">
            <div class="line"></div>
            <div class="calendar">
                <ve-calendar 
                    v-model="selected"
                    mode="mini"
                    :lunar="true"
                    :right-menu='false'
                    :height="'416px'"
                    @change="handleChange"
                    @refresh-calendar="refresh"
                ></ve-calendar>
            </div>
        </div>
        <div class="right">
            <div class="title">
                {{year}}年度节假日汇总<span>共计{{selected.length}}天</span>
            </div>
            <div class="date" v-for="(i,k) in filterHolidaysList" :key="k">
                <div class="div1">{{i.month}}月</div>
                <div class="div2"></div>
                <div class="dateWrap">
                    <div class="div3" v-for="(item,key) in i.dates" :key="key">
                        <div>{{item | txtLength}}</div>
                        <div class="delBtn" @click="delBtn(item)">x</div>
                    </div>
                </div>
                <div class="div4"></div>
                <div class="clear"></div>
            </div>
        </div>
    </div>
</template>
<script>
import veCalendar from "ve-calendar";
export default {
    name: 'holidays',
    data() {
        return {
            selected: [],
            holidaysList: [],
            length:0,
            selectDate:[],
            year: new Date().getFullYear
        }
    },
    computed: {
        filterHolidaysList() {
            return this.holidaysList.filter(i=>{
                if(i.dates.length){
                    return i
                }
            })
        }
    },
    filters:{
        txtLength(val){      
            let date = new Date(val),
            M = parseInt(date.getMonth()+1),
            D = parseInt(date.getDate())
            return `${M}月${D}日`
        }
    },
    created() {
        this.holidaysListInit()
        this.init()
    },
    mounted() {
        
    },
    methods:{
        refresh({year,month},monthData) {
            let date = new Date(`${year}-${month}-01`);
            this.init(date.getTime())
            this.year = year
        },
        handleChange(selectedDate) {
            this.holidaysListInit()
            if(selectedDate.length) {
                selectedDate.forEach((i,k)=>{
                    this.holidaysList.forEach((item,key)=>{
                        if(item.month==parseInt(i.substring(5,7))){
                            let date = new Date(i)
                            item.dates.push(date.getTime())
                            item.dates = item.dates.sort()
                        }
                    })
                }) 
            }
            this.$nextTick(()=>{
                this.filterHolidaysList.forEach((i,k)=>{
                    document.getElementsByClassName('div4')[k].style.display="block"
                    if(!document.getElementsByClassName('div4')[k+1]) {
                        document.getElementsByClassName('div4')[k].style.display="none"
                    }
                })
            })
            if(this.length<selectedDate.length){
                //添加
                this.addHoliday(selectedDate,this.selectDate)      
            }else{
                //删除
                let arr = this.getArrDifference(selectedDate,this.selectDate)
                let arr1 = []
                arr.forEach(i=>{
                    let date = new Date(i)
                    arr1.push(date.getTime())
                })
                this.delHoliday(arr1)  
            }
            this.length = selectedDate.length
            this.selectDate = selectedDate.filter(i=>i)
        },
        holidaysListInit() {
            this.holidaysList = []
            for(let i = 1;i<13;i++) {
                this.holidaysList.push({
                    month:i,
                    dates:[]
                })
            }
        },
        init(date) {
            this.$axios({
                method: 'get',
                url:this.$urls.festivalCollect,
                params:{
                    year: date?date:new Date().getTime()
                }
            })
            .then(res=>{
                if(res.data.status==200){
                    this.selected = []
                    res.data.content.forEach(i=>{
                        this.selected.push(this.$base.formattingTime(i,'-'))
                    })
                    this.total = res.data.content.length
                    this.length = res.data.content.length
                    this.selectDate = res.data.content.map(i=>this.$base.formattingTime(i,'-'))
                }
            })
            .catch(e=>{

            })	
        },
        delHoliday(date) {
            if(!date.length){
                return
            }
            this.$axios({
                method: 'delete',
                url:this.$urls.festivalDelete,
                data:date
            })
            .then(res=>{
                if(res.data.status==200){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
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
        addHoliday(selectedDate,selectDate) {
            let addDate = this.getArrDifference(selectedDate,selectDate)
            let arr = []
            addDate.forEach(i=>{
                let date = new Date(i)
                arr.push({holiday:date.getTime(),hotalId:this.$store.state.hotalId})
            })
            this.$axios({
                method: 'post',
                url:this.$urls.festivalAdd,
                data:arr
            })
            .then(res=>{
                if(res.data.status==200){
                    this.$message({
                        message: "添加成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                }else{
                    this.$message({
                        message: res.data.message||"添加失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            })
            .catch(e=>{

            })	
        },
        getArrDifference(arr1, arr2) {
            return arr1.concat(arr2).filter(function(v, i, arr) {  
                return arr.indexOf(v) === arr.lastIndexOf(v)      
            })  
        },
        delBtn(item) {
            let arr = []
            arr.push(item) 
            let date = new Date(item),
                Y = date.getFullYear(),
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
                D = date.getDate()<10?'0'+date.getDate():date.getDate()
            this.selected.forEach((i,k)=>{
                if(i==`${Y}-${M}-${D}`){
                    this.selected.splice(k,1)
                }
            })
            this.handleChange(this.selected)
            
        }
    },
    components: {
        veCalendar
    }
}
</script>
<style lang="less" scoped>
.holidays{
    height: 100%;
    background-color: #fff;
    display: flex;
    display: -webkit-flex;
    flex-flow:row;
    .left{
        flex: 1;
        position: relative;
        .line{
            position: absolute;
            width: 2px;
            height: calc(100% - 40px);
            background-color: #ececec;
            right: 0;
            top: 20px;
        }
        .calendar{
            padding-top: 21px;
            width:calc(100% - 40px);
            max-width: 960px;
            margin: 0 auto;
        }
    }
    .right{
        width: 386px;
        .title{
            font-size: 18px;
            color: #444950;
            padding-top: 30px;
            margin-bottom: 50px;
            text-align: center;
            line-height: 25px;
            height: 25px;
            span{
                font-size: 12px;
                color: #4c8aff;
                margin-left: 10px;
                display: inline-block;
                vertical-align: top;
            }
        }
        .date{
            position: relative;
            min-height: 85px;
            .div1,.div2,.div3{
                float: left;
            }
            .div1{
                margin-left: 13px;
                font-size: 16px;
                height: 27px;
                line-height: 27px;
                min-width: 35px;
                color: #444950;
            }
            .div2{
                width: 11px;
                height: 11px;
                background-color: #4c8aff;
                border-radius: 50%;
                margin-left: 10px;
                margin-top: 7.5px;
            }
            .dateWrap{
                width: 280px;
                float: left;
                margin-left: 20px;
            }
            .div3{
                min-width: 46px;
                position: relative;
                padding: 0 16px;
                text-align: center;
                height: 25px;
                line-height: 25px;
                border: 1px solid #4c8aff;
                color: #4c8aff;
                font-size: 12px;
                margin-bottom: 10px;
                margin-right: 20px;
                .delBtn{
                    position: absolute;
                    width: 14px;
                    height: 14px;
                    background-color: #4c8aff;
                    color: #fff;
                    border-radius: 50%;
                    top: -7px;
                    right: -7px;
                    text-align: center;
                    line-height: 12px;
                    cursor: pointer;
                }
            }
            .div3:nth-of-type(3n){
                margin-right: 0px;
            }
            .div4{  
                position: absolute;
                width: 1px;
                min-height: 50px;
                height: calc(100% - 33px);
                background-color: #d4d4d4;
                left: 63.5px;
                top: 28px;
            }
            .clear{
                clear: both;
            }
        }
    }
}
</style>
