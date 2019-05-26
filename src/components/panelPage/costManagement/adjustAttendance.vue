<template>
	<div class="panelWrap adjustAttendance">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">调整考勤</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
                <div class="minH">
                    <div class="title">基本信息</div>
                    <div class="infoWrap mt15">
                        <div class="mb24">
                            <div class="item width122">
                                <div class="left width70">姓名：</div>
                                <div class="right">{{name}}</div>
                            </div>
                            <div class="item ml107">
                                <div class="left width56">性别：</div>
                                <div class="right">{{gender}}</div>
                            </div>
                            <div class="item ml121">
                                <div class="left">年龄：</div>
                                <div class="right">{{birthday}}岁</div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="item width178">
                            <div class="left">证件类型：</div>
                            <div class="right">{{certType}}</div>
                        </div>
                        <div class="item ml51">
                            <div class="left">证件号：</div>
                            <div class="right">{{cardId}}</div>
                            <img :src= pictrue_data  class="eye" @click="idCardShow=!idCardShow" alt="">
                        </div> 
                        <div class="headWrap">
                            <img v-if="!avatar" src="../../../assets/img/head@3x.svg" class="head" alt="">
                            <img v-else :src="avatar" alt="" class="head">
                        </div>
                    </div> 
                    <div class="title mt15">今日工作</div>
                    <div class="infoWrap mt15 inputHeight30 width520">
                        <div class="floatL label">用工计划：</div>
                        <div class="floatL ml10 item1">
                            <span>{{department}}，{{postName}}，{{$base.timeplateTohm(startDate)}}-
                            <span v-if="parseInt(endDate/(24*3600000))>0">次日</span>{{$base.timeplateTohm(endDate%(24*3600000))}}，{{agencyName}}</span>
                            <span @click="planShow">调整</span>
                        </div>
                    </div>
                    <div class="title mt15">考勤信息</div>
                    <div class="infoWrap mt15">
                        <div class="recalculate" v-if="recalculate">重新计算考勤中...</div>
                        <div class="mb24 attendanceStatus">考勤状态：<span v-if="initialTime>0">{{initialTime|keepDecimal}}</span><span v-if="overTime<0">{{overTime|keepDecimal1}}</span><span v-if="initialTime<=0&&overTime>=0">正常</span></div>
                        <div class="mb24">
                            <div class="item" style="width:170px">
                                <div class="left">核算工时：</div>
                                <div class="right">{{(calTime+adjustWorkTime).toFixed(2)}}小时</div>
                            </div>
                            <div class="item" style="margin-left:257px;">
                                <div class="left">核算费用：</div>
                                <div class="right">{{(calCost+adjustWorkCost).toFixed(2)}}元</div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="mb24 addJobs">
                            <div class="item MenOrWomenWrap">
                                <div class="left">加减工时：</div>
                                <div class="right">
                                    <el-input-number 
                                        size="mini" 
                                        v-model="adjustWorkTime" 
                                        :disabled="recalculate"
                                    ></el-input-number>
                                </div>
                            </div>
                            <div class="item MenOrWomenWrap" style="margin-left:258px;">
                                <div class="left">加减费用：</div>
                                <div class="right">
                                    <el-input-number 
                                        size="mini" 
                                        v-model="adjustWorkCost" 
                                        :disabled="recalculate"
                                    ></el-input-number>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="reasonWrap">
                            <div class="left">调整原因：</div>
                            <div class="right ml10">
                                <textarea placeholder="请输入" v-model="form.adjustRemark" :disabled="recalculate"></textarea>
                                <div class="num">{{form.adjustRemark.length}}/1000</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="sure" @click="sub">确定</div>
                    <div class="close" @click="cancel">取消</div>
                </div>
			</div>
		</transition>
        <el-dialog
            title="用工计划"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            :width="'600px'"
            top="30.3vh">
            <div class="dialog">
                <div class="head">
                    <div class="checkBtn" :class="{'select':checkBtn==1}" @click="checkhead(1)">部门</div>
                    <div class="checkBtn" :class="{'select':checkBtn==2}" @click="checkhead(2)">工作时间</div>
                    <div class="checkBtn" :class="{'select':checkBtn==3}" @click="checkhead(3)">招聘者</div>
                </div>
                <div class="body">
                    <div class="step1" v-if="checkBtn==1">
                        <div class="tagWrap" @click="tagCheck(i,k)" v-for="(i,k) in dataList" :key='k' :class="{'selectTag':i.check}">{{i.name}}</div>
                    </div>
                    <div class="step2" v-if="checkBtn==2">
                        <div class="bodyTitle">{{this.department}}</div>
                        <div class="listWrap">
                            <div class="item" @click="tagCheck1(i,k)" v-for="(i,k) in dataList1" :key="k" :class="{'borderBottom':k!=dataList1.length,'select1':i.check}">
                                <div class="div1">{{$base.timeplateTohm(i.startTime)}}-{{$base.timeplateTohm(i.endTime)}}</div>
                                <div class="div2">{{i.postName}}</div>
                                <div class="div3" v-if="i.check"></div>
                            </div>
                        </div>
                    </div>
                    <div class="step3" v-if="checkBtn==3">
                        <div class="bodyTitle">{{this.department+'&nbsp;&nbsp;&nbsp;&nbsp;'+this.workTime+'&nbsp;&nbsp;&nbsp;&nbsp;'+this.agencyName}}</div>
                        <div class="listWrap">
                            <div class="item" @click="tagCheck2(i,k)" v-for="(i,k) in dataList2" :key="k" :class="{'borderBottom':k!=dataList2.length,'select1':i.check}">
                                <div class="div1">{{i.name}}</div>
                                <div class="div3" v-if="i.check"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="checkBtn<3" class="dialogBtn1">
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
            <div v-else class="dialogBtn" style="left:190px">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div> 
        </el-dialog>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'adjustAttendance',
    mixins: [mixin],
    props: ['orderInit'],
	data () {
		return {
			show: false, 
            _timeOut: '',
            form: {
                signId: '',
                adjustWorkCost: 0,
                adjustWorkTime: 0,
                adjustRemark: ''
            },
            adjustWorkTime: 0,
            adjustWorkCost: 0,
            txt: '',
            name: '',
            gender: '',
            birthday: '',
            certType: '',
            certNo: '',
            idCardShow: false,
            calTime: 0,
            calCost: 0,
            recalculate: false,
            dialogVisible: false,
            checkBtn:1,
            dataList: [],
            dataList1: [],
            dataList2: [],
            department: '',
            workTime: '',
            agencyName: '',
            startDate: '',
            endDate: '',
            workTxt: '请选择',
            initialTime: '',
            overTime: '',
            pictrue_data: require('../../../assets/img/closeeye.svg'),
            compare: [false,false,false],
            detailObj:{},
            msg: '',
            obj:{
                agencyId: '',
                agencyName: '',
                departmentId: '',
                departmentName: '',
                postId: '',
                postName: '',
                workTimeEnd: '',
                signInTime: '',
                workTimeStart: '',
            },
            postName: '',
            adjustAgencyId: '',
            adjustAgencyName: '',
            adjustDepartmentId: '',
            adjustDepartmentName: '',
            adjustSignId: '',
            adjustPostId: '',
            adjustPostName: '',
            adjustWorkTimeEnd: '',
            adjustWorkTimeStart: '',
            avatar: ''
		}
    },
    computed:{
        cardId() {
			if(!this.idCardShow){
                this.pictrue_data = require('../../../assets/img/closeeye.svg')
				return `**************${this.certNo.substring(this.certNo.length-4,this.certNo.length)}`
			}else{
                this.pictrue_data = require('../../../assets/img/openeye.svg')
				return this.certNo
			}
		},
    },
    filters:{
        phoneNumber(val) {
            if(val) {
                return `${val.substring(0,3)}-${val.substring(3,7)}-${val.substring(7,11)}`
            }
        },
        keepDecimal(val){
			if(val){
                if(val>0){
                    if(val.toFixed(1).substring(3,2)>5){
                        return '早到'+parseInt((val+1))+'.0'+'小时'
                    }else if(val.toFixed(1).substring(3,2)<5){
                        return '早到'+parseInt(val)+'.0'+'小时'
                    }else if(val.toFixed(1).substring(3,2)==5){
                        return '早到'+val.toFixed(1)+'小时'
                    }
                }
			}else{
				return ''
			}
        },
        keepDecimal1(val){
			if(val){
                if(val<0){
                    let str = val.toFixed(1).substring(4,3)
                    if(str>5){
                        return '晚走'+parseInt((-val+1))+'.0'+'小时'
                    }else if(str<5){
                        return '晚走'+parseInt(-val)+'.0'+'小时'
                    }else if(str==5){
                        return '晚走'+-val.toFixed(1)+'小时'
                    }
                }
			}else{
				return ''
			}
		}
    },
    created() {
        this.init()
    },
	mounted () {
        this.show = true
	},
	methods: {
        checkhead(data) {
            if(data==2&&!this.compare[0]){
                return
            }
            if(data==3&&(!this.compare[0]||!this.compare[1])){
                return
            }
            this.checkBtn = data
        },
        sure() {
            if(!this.department||!this.workTime||!this.agencyName){
                return
            }
            let obj = {}
            obj.agencyId = this.adjustAgencyId
            obj.agencyName = this.adjustAgencyName
            obj.departmentId = this.adjustDepartmentId
            obj.departmentName = this.adjustDepartmentName
            obj.id = this.adjustSignId
            obj.postId = this.adjustPostId
            obj.postName = this.adjustPostName
            obj.workTimeEnd = this.adjustWorkTimeEnd
            obj.workTimeStart = this.adjustWorkTimeStart
            this.$axios({
                method: 'post',
                url: this.$urls.updateSign,
                data: obj
            }).then(res=>{
                if(res.data.status==200){
                    setTimeout(()=>{
                        this.init()
                        this.recalculate=false
                    },5000)
                    this.recalculate=true
                    this.$message({
                        message: res.data.message,
                        type: 'success',
                        duration: 5 * 1000,			
                    })
                }else{
                    this.$message({
                        message: res.data.message,
                        type: 'error',
                        duration: 5 * 1000,			
                    })
                }
            }).catch(err=>{
                
            })
            // this.workTxt = this.department+this.workTime+this.agencyName
            this.dialogVisible = false
        },
        tagCheck(i,k) {
            this.dataList.forEach((item,key)=>{
                item.check = false
                if (i.name == item.name) {
                    item.check = !item.check
                    this.department = i.name+'，'
                    this.obj.departmentId = i.id
                    this.obj.departmentName = i.name
                }
            })
            this.adjustDepartmentName = i.name
            this.adjustDepartmentId = i.id
            this.dataList = [].concat(this.dataList)
            this.compare[0] = true
            this.compare = [].concat(this.compare)
            this.checkTag()
        },
        tagCheck1(i,k) {
            this.dataList1.forEach((i,key)=>{
                i.check = false
                if(k==key) {
                    i.check = !i.check
                    this.workTime = `${this.$base.timeplateTohm(i.startTime)}-${this.$base.timeplateTohm(i.endTime)}，${i.postName}，`
                    this.obj.workTimeStart = i.startTime
                    this.obj.workTimeEnd = i.endTime
                    this.obj.postId = i.postId
                    this.obj.postName = i.postName
                }
            })
            this.$axios({
                method: 'get',
                url:this.$urls.getListAgency+this.obj.postId
            })
            .then(res=>{      
                if(res.data.status==200){
                    this.dataList2 = res.data.content
                    this.dataList2.forEach(i=>{
                        i.check = false
                    })
                }
            })
            .catch(e=>{
                
            })
            this.adjustWorkTimeStart = i.startTime
            this.adjustWorkTimeEnd = i.endTime
            this.adjustPostName = i.postName
            this.adjustPostId = i.postId
            this.dataList1 = [].concat(this.dataList1)
            this.compare[1] = true
            this.compare = [].concat(this.compare)
            this.checkTag()
        },
        tagCheck2(i,k) {
            this.dataList2.forEach((i,key)=>{
                i.check = false
                if(k==key) {
                    i.check = !i.check
                    this.agencyName = i.name
                    this.detailObj = i
                    this.obj.agencyId = i.id
                    this.obj.agencyName = i.name
                }
            })
            this.adjustAgencyName = i.name
            this.adjustAgencyId = i.id
            this.compare[2] = true
            this.compare = [].concat(this.compare)
        },
        planShow() {
            if(this.msg) {
                this.$message({
                    message: this.msg,
                    type: 'error',
                    duration: 5 * 1000,			
                })
                return
            }
            this.dialogVisible = true
        },
        checkTag() {
            setTimeout(()=>{
                this.checkBtn++
            },300)
        },
        sub() {
            if(this.calTime+this.adjustWorkTime<0){
                this.$message({
                    message: "核算工时不能为负数",
                    type: 'error',
                    duration: 5 * 1000,			
                })
                return
            }
            if(!this.form.adjustRemark){
                this.$message({
                    message: '调整原因不可为空',
                    type: 'error',
                    duration: 5*1000
                })
                return
            }
            this.form.signId = this.$store.state.costManagement.panelType.data.signId
            if(!this.msg) {
                this.$axios({
                    method: 'post',
                    url:this.$urls.saveSignWork,
                    data:this.obj
                })
                .then(res=>{      
                    
                })
                .catch(e=>{
                    
                })
            }
            this.$axios({
                method: 'post',
                url:this.$urls.updateWorkBill,
                data:{
                    signId: this.$store.state.costManagement.panelType.data.signId,
                    adjustWorkCost: this.adjustWorkCost*100,
                    adjustWorkTime: this.adjustWorkTime*60*60*1000,
                    adjustRemark: this.form.adjustRemark
                }
            })
            .then(res=>{      
                if(res.data.code==0){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000,			
                    })
                    this.orderInit()
                    this.cancel()
                }else{
                    this.$message({
                        message: res.data.message||"操作失败",
                        type: 'error',
                        duration: 5 * 1000,			
                    })
                }
            })
            .catch(e=>{
                
            })
            
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
                if(this.$store.state.costManagement.panelType.panelType=='out'){
                    this.$store.dispatch('adjustAttendance1')
                }else{
                    this.$store.dispatch('adjustAttendance')
                }	
			}, 200)
        },
        init() {
            let data = this.$store.state.costManagement.panelType.data
            // console.log(data)
            this.adjustSignId = data.signId
            // this.initialTime = data.earlyArrivalTime/(1000*60*60)
            // this.overTime = data.goLateTime/(1000*60*60)
            this.calTime = data.workTime/(1000*60*60)
            this.adjustWorkTime = data.adjustWorkTime/1000/60/60
            this.adjustWorkCost = data.adjustWorkCost/100
            this.form.adjustWorkTime = data.adjustWorkTime/(1000*60*60)
            this.form.adjustWorkCost = data.adjustWorkCost/100
            this.calCost = data.calCost/100
            this.form.adjustRemark = data.adjustRemark
            
            this.$axios({
                method: 'post',
                url:this.$urls.message,
                data:{
                    signId:data.signId,
                    workerId:data.workerId,
                    agencyId:data.agencyId
                }
            })
            .then(res=>{  
                this.name = res.data.worker.name
                this.avatar = res.data.worker.avatar
                this.birthday = this.$base.age(res.data.worker.birthday)
                this.certNo = res.data.worker.certNo
                this.phone = res.data.worker.phone
                if(res.data.worker.gender=='male'){
                    this.gender = '男'
                }else{
                    this.gender = '女'
                }
                if(res.data.worker.certType == 'id-card'){
                    this.certType = '中国居民身份证'
                }else if(res.data.worker.certType == 'passport') {
                    this.certType = '护照'
                }else if(res.data.worker.certType == 'home-card') {
                    this.certType = '回乡证'
                }else if(res.data.worker.certType == 'tw-card') {
                    this.certType = '台胞证'
                } 
                this.startDate = res.data.todayVo.startDate
                this.endDate = res.data.todayVo.endDate
                this.department = res.data.todayVo.departmentName
                this.postName = res.data.todayVo.postName
                this.initialTime = (this.$base.timeplateToss(this.$base.timeplateTohm(this.startDate)) - this.$base.timeplateToss(this.$base.formattingHover(data.signInTime)))/3600000
                this.overTime = (this.$base.timeplateToss(this.$base.timeplateTohm(this.endDate)) - this.$base.timeplateToss(this.$base.formattingHover(data.signOutTime)))/3600000
                this.workTime = `${this.$base.timeplateTohm(res.data.todayVo.startDate)}-${this.$base.timeplateTohm(res.data.todayVo.endDate)}，${res.data.todayVo.postName}，`
                this.agencyName = res.data.sign.agencyName
                this.workTxt = this.department+this.workTime+this.agencyName
                this.detailObj = res.data.agency
                this.obj.signInTime = res.data.sign.signInTime
                // console.log(this.overTime)
            })
            .catch(e=>{
                
            })
            this.$axios({
                method: 'get',
                url:this.$urls.getBillDetail,
                params:{
                    startTime: data.signInTime
                }
            })
            .then(res=>{  
                if(res.data.status==200) {
                    this.dataList = res.data.content.departmentList
                    this.dataList.forEach(i=>{
                        i.check = false
                    })
                
                    this.dataList1 = res.data.content.orderDetailList
                    this.dataList1.forEach(i=>{
                        i.check = false
                    })
                }else{
                    this.msg = res.data.message
                }
            })
            .catch(e=>{
                
            })
        }
		
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.width70{
    width: 70px;
}
.width56{
    width: 56px;
}
.dialog{
    box-sizing: border-box;
    height: 369px;
    .head{
        height: 40px;
        background-color: #eaf3fe;
        padding: 0 10px;
        .checkBtn{
            width: 80px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            color: #444950;
            float: left;
            margin-left: 44px;
            
        }
        .select{
            border-bottom: 2px solid #4c8aff;
            color: #4c8aff;
        }
    }
    .body{
        .bodyTitle{
            font-size: 14px;
            color: #999999;
            padding: 20px;
        }
        .listWrap{
            width: 560px;
            height: 157px;
            margin: 0 auto;
            border: solid 1px #ececec;
            overflow-y: scroll;
            .item{
                overflow: hidden;
                div{    
                    height: 38px;
                    line-height: 38px;
                    float: left;
                }
                .div1{
                    margin-left: 30px;
                    width: 115px;
                }
                .div2{
                    margin-left: 69px;
                    width: 42px;
                }
                .div3{
                    width: 17px;
                    height: 12px;
                    float: right;
                    margin: 13px 30px 0 0;
                    background: url("../../../assets/img/dagou.png") no-repeat;
                    background-size: 100% 100%;
                } 
            }
            .select1{
                color: #4c8aff;
            }
            .borderBottom{
                border-bottom: 1px solid #ececec;
            }
        }
        .step1{
            overflow: hidden;
            padding: 20px;
            .tagWrap{
                min-width: 58px;
                height: 25px;
                line-height: 25px;
                border: 1px solid #ececec;
                background-color: #ffffff;
                border-radius: 1px;
                color: #999999;
                font-size: 12px;
                padding: 0 10px;
                float: left;
                margin-bottom: 20px;
                margin-right: 20px;
                text-align: center;
            }
            .selectTag{
                border: solid 1px #4c8aff;
                color: #4c8aff;
            }
        }
        .step3{
            .listWrap{
                .item{
                    .div1{
                        width: auto;
                    }
                }
            }
        }
    }
}
.panel{
    width:750px;
    overflow-y: scroll;
    
	.fixed{
        width: 710px;
    }
    .mt15{
        margin-top: 15px;
    }
    .ml107{
        margin-left: 107px;
    }
    .ml121{
        margin-left: 121px;
    }
    .mb24{
        margin-bottom: 24px;
    }
    .ml51{
        margin-left: 51px;
    }
    .clear{
        clear: both;
    }
    .floatL{
        float: left;
    }
    .ml10{
        margin-left: 10px;
    }
    .width122{
        width: 122px;
    }
    .width178{
        width: 178px;
    }
    .btnWrap{
        height: 57px;
        padding: 15px 265px;
        box-sizing: border-box;
        border-top: 1px solid #ececec;
        div{
            cursor: pointer;
        }
        .sure{
            width: 80px;
            border-radius: 14.5px;
            background-color: #4c8aff;
            padding: 5.5px 0;
            text-align: center;
            color: #ffffff;
            font-size: 12px;
            float: left;
        }
        .close{
            width: 78px;
            border-radius: 14.5px;
            border: 1px solid #4c8aff;
            padding: 4.5px 0;
            text-align: center;
            color: #4c8aff;
            font-size: 12px;
            float: left;
            margin-left: 60px;
        }
    }
    .minH{
        min-height: calc(100% - 140px);
        padding: 15px 20px;
        
        .title{
            font-size: 14px;
            color: #666666;
            font-weight: bold;
        }
        .infoWrap{
            position: relative;
            padding: 24px;
            background-color: #f4f8fc;
            border-radius: 2px;
            overflow: hidden;
            .recalculate{
                position: absolute;
                top: 3px;
                left: 210px;
                width: 300px;
                height: 70px;
                font-size: 20px;
                color: #fff;
                text-align: center;
                line-height: 70px;
                border-radius: 5px;
                background-color: rgba(68, 73, 80, 0.51);
                z-index: 99;
            }
            .attendanceStatus{
                font-size: 14px;
                color: #444950;
                span{
                    margin-left: 10px;
                }
            }
            .reasonWrap{
                overflow: hidden;
                .left{
                    float: left;
                    margin-top: 4px;
                    font-size: 14px;
                    color: #444950;
                }
                .right{
                    float: left;
                    position: relative;
                    .num{
                        position: absolute;
                        right: 10px;
                        bottom: 5px;
                        height: 20px;
                        color: #999999;
                        line-height: 20px;
                        font-size: 14px;
                    }
                    textarea{
                        width: 582px;
                        height: 100px;
                        background-color: #ffffff;
                        border-radius: 1px;
                        border: solid 1px #ececec;
                        outline: none;
                        resize: none;
                        padding: 5px 10px;
                        box-sizing: border-box;
                        font-size: 14px;
                    }
                    textarea::-webkit-input-placeholder{
                        color:#999999;
                    }
                    textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
                        color:#999999;
                    }
                    textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                        color:#999999;
                    }
                    textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                        color:#999999;
                    }
                }
            }
            .headWrap{
                position: absolute;
                width: 90px;
                height: 90px;
                border-radius: 50%;
                overflow: hidden;
                top: 11px;
                right: 24px;
                .head{
                    width: 100%;    
                }
            }
            .label{
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                color: #444950;
            }
            .item1{
                    position: relative;
                    float: left;
                    font-size: 14px;
                    color: #444950;
                    span:nth-child(2){
                        height: 30px;
                        font-size: 12px;
                        line-height: 30px;
                        margin-left: 7px;
                        color: #4c8aff;
                        cursor: pointer;
                    }
                }
            .item{
                float: left;
                overflow: hidden;
                .eye{
                    float: left;
                    margin:4px 0 0 10px;
                }
                .left,.right{
                    float: left;
                    font-size: 14px;
                    color: #444950;
                    height: 20px;
                    line-height: 20px;
                }
                .right{
                    margin-left: 10px;
                }
                img{ cursor: pointer; }
            }
        }
    }
}
	
</style>