<template>
    <div class="timeSet mealSet addJobs inputHeight30 employmentConditions">
        <div class="wrap">
            <el-form ref="form" :model="form" label-width="80px" size="medium">
                <div class="item">
                    <div class="rulesWrap">
                        <div class="list height30">
                            <el-form-item label="夜班时间：">
                                <el-col :span="11">
                                    <div class="position">
                                        <el-time-picker
                                        placeholder="开始时间" 
                                        v-model="nightshiftStart" 
                                        @focus="focus1=true" @blur="focus1=false"
                                        :clearable="false"
                                        value-format="HH:mm" format="HH:mm"
                                        style="width: 100%;"></el-time-picker>
                                        <i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
                                    </div>
                                </el-col>
                                <el-col class="line1" :span="2">-----</el-col>
                                <el-col :span="11">
                                    <div class="position">
                                        <el-time-picker
                                        placeholder="结束时间" 
                                        v-model="nightshiftEnd" 
                                        :clearable="false"
                                        @focus="focus2=true" @blur="focus2=false"
                                        value-format="HH:mm" format="HH:mm"
                                        style="width: 100%;"></el-time-picker>
                                        <i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
                                    </div>
                                </el-col>
                            </el-form-item>
                        </div>
                        <div class="annotation mb">一天24小时，除夜班外都是白班</div>
                        <div class="mb">
                            <div class="left">工时取整：</div>
                            <div class="right">
                                工时大于等于<input type="number" v-model="worktimeFloor">分钟，即算为0.5小时
                            </div>
                            <div class="clear"></div>
                            <div class="annotation"> 若设置大于等于20分钟，那么当员工考勤时间为1小时20分钟，即算是1.5个小时；当考勤时间为1小时50分钟，即算是2小时</div>
                        </div>
                    </div>      
                </div>
            </el-form>
        </div>
        <div class="btn">
            <div class="sub" @click="submit">保存</div>
            <div class="cancel">取消</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'timeSet',
    data() {
        return {
            form: {
                hotalId:this.$store.state.hotalId,
                nightshiftEnd: '',
                nightshiftStart: '',
                worktimeFloor: ''
            },
            nightshiftEnd: '',
            nightshiftStart: '',
            worktimeFloor: '',
            focus1: false,
            focus2: false,
        }
    },
    created() {
        this.init()
    },
    methods:{
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.getTimeConstraint
            })
            .then(res=>{
                if(res.data.status==200){
                    if(res.data.content.nightshiftEnd) {
                        this.form.nightshiftEnd = res.data.content.nightshiftEnd
                        this.nightshiftEnd = `${(res.data.content.nightshiftEnd-res.data.content.nightshiftEnd%(60*60*1000))/(60*60*1000)<10?"0"+(res.data.content.nightshiftEnd-res.data.content.nightshiftEnd%(60*60*1000))/(60*60*1000):(res.data.content.nightshiftEnd-res.data.content.nightshiftEnd%(60*60*1000))/(60*60*1000)}:${(res.data.content.nightshiftEnd%(60*60*1000))/60000<10?"0"+(res.data.content.nightshiftEnd%(60*60*1000))/60000:(res.data.content.nightshiftEnd%(60*60*1000))/60000}`
                    }
                    if(res.data.content.nightshiftStart) {
                        this.form.nightshiftStart = res.data.content.nightshiftStart
                        this.nightshiftStart = `${(res.data.content.nightshiftStart-res.data.content.nightshiftStart%(60*60*1000))/(60*60*1000)<10?"0"+(res.data.content.nightshiftStart-res.data.content.nightshiftStart%(60*60*1000))/(60*60*1000):(res.data.content.nightshiftStart-res.data.content.nightshiftStart%(60*60*1000))/(60*60*1000)}:${(res.data.content.nightshiftStart%(60*60*1000))/60000<10?"0"+(res.data.content.nightshiftStart%(60*60*1000))/60000:(res.data.content.nightshiftStart%(60*60*1000))/60000}`
                    }
                    this.worktimeFloor = res.data.content.worktimeFloor/(60*1000)
                }
            })
            .catch(e=>{

            })	
        },
        submit() {
            if(this.worktimeFloor<1||this.worktimeFloor>30||!this.$base.isPositiveInteger(this.worktimeFloor)) {
                this.$message({
                    message: "工时只能输入1-30之间的整数",
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            this.form.worktimeFloor = this.worktimeFloor*60*1000
            if(this.nightshiftStart) {
                this.form.nightshiftStart = this.nightshiftStart.split(':')[0]*60*60*1000+this.nightshiftStart.split(':')[1]*60000    
            }else{
                this.form.nightshiftStart = 0
            }
            if(this.nightshiftEnd) {
                this.form.nightshiftEnd = this.nightshiftEnd.split(':')[0]*60*60*1000+this.nightshiftEnd.split(':')[1]*60000
            }else{
                this.form.nightshiftEnd = 0
            }
            this.$axios({
                method: 'put',
                url:this.$urls.timeConstraint,
                data:this.form
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
            
        }
    }
}
</script>
<style lang="less" scoped>
.timeSet{
    height: 100%;
    .wrap{
        min-height: calc(100% - 79px);
        background-color: #fff;
    }
    .height30{
        height:30px;
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
    .item{
       
        margin-bottom: 10px;
        .position{
            position: relative;
            i{
                position: absolute;
                right: 10px;
                top:9px;
                color: #c0c4cc;
                transition: all .2s;
            }
            .focus1{
                transform: rotate(180deg);
            }
        }
        .title{
            height: 50px;
            line-height: 50px;
            text-indent: 24px;
            font-size: 16px;
            color: #666666;
            border-left: 4px solid #4d83ff;
            .switch{
                float: right;
                margin-right: 20px;
            }
        }
        .line{
            height: 1px;
            background-color: #ececee; 
        }
        .rulesWrap{
            padding: 24px;
            font-size: 14px;
            color: #444950;
            overflow: hidden;
            .mb{
                margin-bottom: 24px; 
            }
            .list{
                width: 508px;
                .line1{
                    text-align: center;
                    color: #d4d4d4;
                }
                .ml10{
                    margin-left: 10px;
                }
            }
            .left{
                width: 80px;
                float: left
            }
            .right{
                float: left;
                input{
                    width: 60px;
                    border: none;
                    outline: none;
                    border-bottom: 1px solid #d4d4d4;
                    text-align: center;
                    margin-right: 10px;
                    margin-left: 10px;
                    font-size: 14px;
                }
            }
            .clear{
                clear:both;
            }
            .annotation{
                font-size: 12px;
                color: #999999;
                margin-left: 80px;
                margin-top: 10px;
            }
        }
    }
}
</style>
