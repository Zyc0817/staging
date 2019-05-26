<template>
    <div class="mealSet addJobs inputHeight30 employmentConditions">
        <el-form ref="form" :model="form" label-width="108px" size="medium">
            <div class="item">
                <div class="title">用餐时间</div>
                <div class="line"></div>
                <div class="rulesWrap">
                    <div class="mb list height30">
                        <el-form-item label="每餐扣除时间：">
                            <el-select v-model="form.deductTime" placeholder="0">
                                <el-option v-for="(i,k) in hoverItem" :key="k" :label="i" :value="i"></el-option>
                            </el-select>
                            <span class="ml10">小时</span>
                        </el-form-item>
                    </div>
                    <div class="mb list height30">
                        <el-form-item label="早餐:">
                            <el-col :span="11">
                                <div class="position height30">
                                    <el-time-picker
                                    placeholder="开始时间" 
                                    :clearable="false"
                                    v-model="form.breakfastStart" 
                                    @focus="focus1=true" @blur="focus1=false"
                                    value-format="HH:mm" format="HH:mm"
                                    style="width: 100%;"></el-time-picker>
                                    <i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
                                    <!-- <el-time-picker
                                    style="width: 100%;"
                                    v-model="form.breakfastStart"
                                    placeholder="任意时间点">
                                    </el-time-picker> -->

                                </div>
                            </el-col>
                            <el-col class="line1" :span="2">-----</el-col>
                            <el-col :span="11">
                                <div class="position height30">
                                    <el-time-picker
                                    placeholder="结束时间" 
                                    :clearable="false"
                                    v-model="form.breakfastEnd" 
                                    @focus="focus2=true" @blur="focus2=false"
                                    value-format="HH:mm" format="HH:mm"
                                    style="width: 100%;"></el-time-picker>
                                    <i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
                                </div>
                            </el-col>
                        </el-form-item>
                    </div>
                    <div class="mb list height30">
                        <el-form-item label="午餐:">
                            <el-col :span="11">
                                <div class="position height30">
                                    <el-time-picker
                                    placeholder="开始时间" 
                                    :clearable="false"
                                    v-model="form.lunchStart" 
                                    @focus="focus3=true" @blur="focus3=false"
                                    value-format="HH:mm" format="HH:mm"
                                    style="width: 100%;"></el-time-picker>
                                    <i class="el-icon-arrow-down" :class="{'focus1':focus3}"></i>
                                </div>
                            </el-col>
                            <el-col class="line1" :span="2">-----</el-col>
                            <el-col :span="11">
                                <div class="position height30">
                                    <el-time-picker
                                    placeholder="结束时间" 
                                    :clearable="false"
                                    v-model="form.lunchEnd" 
                                    @focus="focus4=true" @blur="focus4=false"
                                    value-format="HH:mm" format="HH:mm"
                                    style="width: 100%;"></el-time-picker>
                                    <i class="el-icon-arrow-down" :class="{'focus1':focus4}"></i>
                                </div>
                            </el-col>
                        </el-form-item>
                    </div>
                    <div class="mb list height30">
                        <el-form-item label="晚餐:">
                            <el-col :span="11">
                                <div class="position height30">
                                    <el-time-picker
                                    placeholder="开始时间" 
                                    :clearable="false"
                                    v-model="form.dinnerStart" 
                                    @focus="focus5=true" @blur="focus5=false"
                                    value-format="HH:mm" format="HH:mm"
                                    style="width: 100%;"></el-time-picker>
                                    <i class="el-icon-arrow-down" :class="{'focus1':focus5}"></i>
                                </div>
                            </el-col>
                            <el-col class="line1" :span="2">-----</el-col>
                            <el-col :span="11">
                                <div class="position height30">
                                    <el-time-picker
                                    placeholder="结束时间" 
                                    :clearable="false"
                                    v-model="form.dinnerEnd" 
                                    @focus="focus6=true" @blur="focus6=false"
                                    value-format="HH:mm" format="HH:mm"
                                    style="width: 100%;"></el-time-picker>
                                    <i class="el-icon-arrow-down" :class="{'focus1':focus6}"></i>
                                </div>
                            </el-col>
                        </el-form-item>
                    </div>
                    <div class="list height30">
                        <el-form-item label="夜宵:">
                            <el-col :span="11">
                                <div class="position height30">
                                    <el-time-picker
                                    placeholder="开始时间" 
                                    :clearable="false"
                                    v-model="form.supperStart" 
                                    @focus="focus7=true" @blur="focus7=false"
                                    value-format="HH:mm" format="HH:mm"
                                    style="width: 100%;"></el-time-picker>
                                    <i class="el-icon-arrow-down" :class="{'focus1':focus7}"></i>
                                </div>
                            </el-col>
                            <el-col class="line1" :span="2">-----</el-col>
                            <el-col :span="11">
                                <div class="position height30">
                                    <el-time-picker
                                    placeholder="结束时间" 
                                    :clearable="false"
                                    v-model="form.supperEnd" 
                                    @focus="focus8=true" @blur="focus8=false"
                                    value-format="HH:mm" format="HH:mm"
                                    style="width: 100%;"></el-time-picker>
                                    <i class="el-icon-arrow-down" :class="{'focus1':focus8}"></i>
                                </div>
                            </el-col>
                        </el-form-item>
                    </div>
                </div>      
            </div>
            <div class="item">
                <div class="title">用餐打卡时间</div>
                <div class="line"></div>
                <div class="rulesWrap">
                    <div class="mb list">
                        <el-radio v-model="form.mealMode" label="clock">只能在工作时间内用餐，即只能打完上班卡后，再打用餐卡</el-radio>
                    </div>
                    <div class="list">
                        <el-radio v-model="form.mealMode" label="sign">不限制用餐时间，即签到后就可以用餐</el-radio>
                    </div>
                </div>      
            </div>
            <div class="item">
                <div class="title">用餐打卡限制
                    <div class="switch">   
                        <el-switch
                            :width="52"
                            v-model="form.mealConstraints"
                            active-value="enable"
                            inactive-value="disable"
                            active-color="#4c8aff"         
                            >
                        </el-switch>
                    </div>
                </div>
                <div class="line"></div>
                <div class="rulesWrap">
                    <div>规则：员工用餐打卡受到用餐计划限制，超出次数则用餐打卡失败</div>
                    <div class="clear"></div>
                </div>      
            </div>
            <div class="item">
                <div class="title">用餐扣除方式</div>
                <div class="line"></div>
                <div class="rulesWrap">
                    <div class="mb list">
                        <el-radio v-model="form.deductMode" label="plan">根据用工计划扣减</el-radio>
                    </div>
                    <div class="mb list">
                        <el-radio v-model="form.deductMode" label="fact">根据实际用餐扣减</el-radio>
                    </div>
                    <div class="list">
                        <el-radio v-model="form.deductMode" label="mix">根据用工计划/实际用餐的最多次数扣减</el-radio>
                    </div>
                </div>      
            </div>
            
            <div class="item">
                <div class="title">餐次管理
                    <div class="switch">   
                        <el-switch
                            :width="52"
                            v-model="form.switchBtn1"
                            active-color="#4c8aff"         
                            >
                        </el-switch>
                    </div>
                </div>
                <div class="line"></div>
                <div class="rulesWrap">
                    <div class="rulesWrapFd" v-if="!form.switchBtn1"></div>
                    <div class="mb">
                        <div class="left">规则：</div>
                        <div class="right">
                            在“新增用工申请”的“新增岗位”中，每隔<input v-model="form.mealStep " type="text">小时，系统自动产生一个餐次
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div>
                        <div class="left">是否允许修改：</div>
                        <div class="right">
                            <el-radio v-model="form.mealGenerate" label="active">允许</el-radio>
                            <el-radio v-model="form.mealGenerate" label="fixed">不允许</el-radio>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div>      
            </div>
        </el-form>
        <div class="btn">
            <div class="sub" @click="submit">保存</div>
            <div class="cancel">取消</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'mealSet',
    data() {
        return {
            form: {
                deductTime: '',
                breakfastEnd: '',
                breakfastStart: '',
                switchBtn1: false,
                mealGenerate: '',
                mealStep : '',
                deductMode: '',
                dinnerEnd: '',
                dinnerStart: '',
                lunchEnd: '',
                lunchStart: '',
                mealMode: '',
                supperEnd: '',
                mealConstraints: '',
                supperStart: ''
            },
            value1: '',
            hoverItem: [0,.5,1],
            focus1: false,
            focus2: false,
            focus3: false,
            focus4: false,
            focus5: false,
            focus6: false,
            focus7: false,
			focus8: false
        }
    },
    created() {
        this.init()
    },
    methods:{
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.getMealConstraint
            })
            .then(res=>{
                if(res.data.status==200){
                    let obj = res.data.content
                    this.form.deductTime = obj.deductTime/3600000
                    if(obj.breakfastStart){
                        this.form.breakfastStart = `${(obj.breakfastStart-obj.breakfastStart%(60*60*1000))/(60*60*1000)<10?"0"+(obj.breakfastStart-obj.breakfastStart%(60*60*1000))/(60*60*1000):(obj.breakfastStart-obj.breakfastStart%(60*60*1000))/(60*60*1000)}:${(obj.breakfastStart%(60*60*1000))/60000<10?"0"+(obj.breakfastStart%(60*60*1000))/60000:(obj.breakfastStart%(60*60*1000))/60000}`
                        // console.log(this.form.breakfastStart)
                        // this.form.breakfastStart = new Date(2016, 9, 10, 18, 40)
                    }else{
                        this.form.breakfastStart = ''
                    }
                    if(obj.breakfastEnd){
                        this.form.breakfastEnd = `${(obj.breakfastEnd-obj.breakfastEnd%(60*60*1000))/(60*60*1000)<10?"0"+(obj.breakfastEnd-obj.breakfastEnd%(60*60*1000))/(60*60*1000):(obj.breakfastEnd-obj.breakfastEnd%(60*60*1000))/(60*60*1000)}:${(obj.breakfastEnd%(60*60*1000))/60000<10?"0"+(obj.breakfastEnd%(60*60*1000))/60000:(obj.breakfastEnd%(60*60*1000))/60000}`
                    }else{
                        this.form.breakfastEnd = ''
                    }
                    if(obj.lunchStart){
                        this.form.lunchStart = `${(obj.lunchStart-obj.lunchStart%(60*60*1000))/(60*60*1000)<10?"0"+(obj.lunchStart-obj.lunchStart%(60*60*1000))/(60*60*1000):(obj.lunchStart-obj.lunchStart%(60*60*1000))/(60*60*1000)}:${(obj.lunchStart%(60*60*1000))/60000<10?"0"+(obj.lunchStart%(60*60*1000))/60000:(obj.lunchStart%(60*60*1000))/60000}`
                    }else{
                        this.form.lunchStart = ''
                    }
                    if(obj.lunchEnd){
                        this.form.lunchEnd = `${(obj.lunchEnd-obj.lunchEnd%(60*60*1000))/(60*60*1000)<10?"0"+(obj.lunchEnd-obj.lunchEnd%(60*60*1000))/(60*60*1000):(obj.lunchEnd-obj.lunchEnd%(60*60*1000))/(60*60*1000)}:${(obj.lunchEnd%(60*60*1000))/60000<10?"0"+(obj.lunchEnd%(60*60*1000))/60000:(obj.lunchEnd%(60*60*1000))/60000}`
                    }else{
                        this.form.lunchEnd = ''
                    }
                    if(obj.dinnerStart){
                        this.form.dinnerStart = `${(obj.dinnerStart-obj.dinnerStart%(60*60*1000))/(60*60*1000)<10?"0"+(obj.dinnerStart-obj.dinnerStart%(60*60*1000))/(60*60*1000):(obj.dinnerStart-obj.dinnerStart%(60*60*1000))/(60*60*1000)}:${(obj.dinnerStart%(60*60*1000))/60000<10?"0"+(obj.dinnerStart%(60*60*1000))/60000:(obj.dinnerStart%(60*60*1000))/60000}`
                    }else{
                        this.form.dinnerStart = ''
                    }
                    if(obj.dinnerEnd){
                        this.form.dinnerEnd = `${(obj.dinnerEnd-obj.dinnerEnd%(60*60*1000))/(60*60*1000)<10?"0"+(obj.dinnerEnd-obj.dinnerEnd%(60*60*1000))/(60*60*1000):(obj.dinnerEnd-obj.dinnerEnd%(60*60*1000))/(60*60*1000)}:${(obj.dinnerEnd%(60*60*1000))/60000<10?"0"+(obj.dinnerEnd%(60*60*1000))/60000:(obj.dinnerEnd%(60*60*1000))/60000}`
                    }else{
                        this.form.dinnerEnd = ''
                    }
                    if(obj.supperEnd){
                        this.form.supperEnd = `${(obj.supperEnd-obj.supperEnd%(60*60*1000))/(60*60*1000)<10?"0"+(obj.supperEnd-obj.supperEnd%(60*60*1000))/(60*60*1000):(obj.supperEnd-obj.supperEnd%(60*60*1000))/(60*60*1000)}:${(obj.supperEnd%(60*60*1000))/60000<10?"0"+(obj.supperEnd%(60*60*1000))/60000:(obj.supperEnd%(60*60*1000))/60000}`
                    }else{
                        this.form.supperEnd = ''
                    }
                    if(obj.supperStart){
                        this.form.supperStart = `${(obj.supperStart-obj.supperStart%(60*60*1000))/(60*60*1000)<10?"0"+(obj.supperStart-obj.supperStart%(60*60*1000))/(60*60*1000):(obj.supperStart-obj.supperStart%(60*60*1000))/(60*60*1000)}:${(obj.supperStart%(60*60*1000))/60000<10?"0"+(obj.supperStart%(60*60*1000))/60000:(obj.supperStart%(60*60*1000))/60000}`
                    }else{
                        this.form.supperStart = ''
                    }
                    this.form.deductMode = obj.deductMode 
                    this.form.mealMode = obj.mealMode 
                    this.form.mealConstraints = obj.mealConstraints 
                    if(obj.mealGenerate=='none') {
                        this.form.switchBtn1 = false    
                    }else{
                        this.form.switchBtn1 = true
                        if(obj.mealStep){
                            this.form.mealStep = obj.mealStep/(60*60*1000)
                        }else{
                            this.form.mealStep = ''
                        }
                        this.form.mealGenerate = obj.mealGenerate
                    }
                }
               	
            })
            .catch(e=>{

            })	
        },
        submit() {
            let obj = {}
            obj.deductTime = this.form.deductTime*3600000
            if(this.form.breakfastStart){
                obj.breakfastStart = this.form.breakfastStart.split(':')[0]*60*60*1000+this.form.breakfastStart.split(':')[1]*60000
            }else{
                obj.breakfastStart = ''
            }
            if(this.form.breakfastEnd){
                obj.breakfastEnd = this.form.breakfastEnd.split(':')[0]*60*60*1000+this.form.breakfastEnd.split(':')[1]*60000
            }else{
                obj.breakfastEnd = ''
            }
            if(this.form.lunchStart){
                obj.lunchStart = this.form.lunchStart.split(':')[0]*60*60*1000+this.form.lunchStart.split(':')[1]*60000
            }else{
                obj.lunchStart = ''
            }
            if(this.form.lunchEnd){
                obj.lunchEnd = this.form.lunchEnd.split(':')[0]*60*60*1000+this.form.lunchEnd.split(':')[1]*60000
            }else{
                obj.lunchEnd = ''
            }
            if(this.form.dinnerEnd){
                obj.dinnerEnd = this.form.dinnerEnd.split(':')[0]*60*60*1000+this.form.dinnerEnd.split(':')[1]*60000
            }else{
                obj.dinnerEnd = ''
            }
            if(this.form.dinnerStart){
                obj.dinnerStart = this.form.dinnerStart.split(':')[0]*60*60*1000+this.form.dinnerStart.split(':')[1]*60000
            }else{
                obj.dinnerStart = ''
            }
            if(this.form.supperEnd){
                obj.supperEnd = this.form.supperEnd.split(':')[0]*60*60*1000+this.form.supperEnd.split(':')[1]*60000
            }else{
                obj.supperEnd = ''
            }
            if(this.form.supperStart){
                obj.supperStart = this.form.supperStart.split(':')[0]*60*60*1000+this.form.supperStart.split(':')[1]*60000
            }else{
                obj.supperStart = ''
            }
            if(!this.form.switchBtn1) {
                obj.mealGenerate = 'none'
            }else {
                obj.mealGenerate = this.form.mealGenerate
            }
            obj.mealMode = this.form.mealMode 
            obj.deductMode = this.form.deductMode 
            if(this.form.mealStep){
                obj.mealStep = this.form.mealStep*60*60*1000
            }else{
                obj.mealStep = 0
            }
            obj.hotalId = this.$store.state.hotalId
            obj.mealConstraints = this.form.mealConstraints 
            this.$axios({
                method: 'put',
                url:this.$urls.mealConstraint,
                data:obj
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
.mealSet{
    .height30{
        height: 30px;
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
    .item{
        background-color: #fff;
        margin-bottom: 10px;
        .title{
            height: 50px;
            line-height: 50px;
            text-indent: 24px;
            font-size: 14px;
            color: #666666;
            font-weight: bold;
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
            position: relative;
            .rulesWrapFd{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                z-index: 1;
            }
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
                width: 108px;
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
                }
            }
            .clear{
                clear:both;
            }
        }
    }
}
</style>
