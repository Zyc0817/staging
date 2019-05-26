<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">{{$store.state.recruitmentPlan.panelTitle}}</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="minH">
                    <div class="title">基本信息</div>
                    <div class="wrapContent">
                        <img src="../../../assets/img/head@3x.svg" alt="" class="headTop" v-if="!avatar">
                        <img :src= avatar alt="" class="headTop" v-else>
                        <div class="nameOne">
                            <div class="item1">姓名：<span>{{userName}}</span></div>
                            <div class="item2">性别：<span>{{gender | meal}}</span></div>
                            <div class="item3">年龄：<span>{{age}}岁</span></div>
                        </div>
                        <div class="certType">
                            <div class="item1">证件类型：<span>{{certType | chang}}</span></div>
                            <div class="item2" v-if="certShow">证件号：<span>{{workerId | certNoChange}}</span><img :src="picture_data.src" alt="" @click="switchCert"></div>
                            <div class="item2" v-else>证件号：<span>{{workerId}}</span><img :src="picture_data.src" alt="" @click="switchCert"></div>
                        </div>
                    </div>
                    <div class="todayWork">
                        <div class="title">今日工作</div>
                        <div class="wrapContenttwo">
                            <div class="item1 ml10 ">用工计划：
                                <span>{{workTxt}}</span><span @click="planShow">调整</span>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="recalculate" v-if="recalculate">重新计算考勤中...</div>
                        <div class="title">考勤信息</div>
                        <div class="certificateWrap">
                            <div class="borderbox">
                                <div class="attendanceStatus" v-cloak>考勤状态：<span v-if="initialTime>0">{{initialTime|keepDecimal}}</span><span v-if="overTime<0">{{overTime|keepDecimal1}}</span><span v-if="initialTime<=0&&overTime>=0">正常</span></div>
                                <div class="certificate">
                                    <div class="AccountingWork">核算工时：<span>{{(aFew+form.total).toFixed(1)}}小时</span></div>
                                    <div class="CostAccounting"><span>核算费用：</span><span>{{(calCost+form.cost).toFixed(1)}}元</span></div>
                                </div>
                                <div class="certificate1">
                                    <div class="div1">
                                        <div class="label">加减工时：</div>
                                        <el-input-number v-model="form.total" size="mini" :step= number style="margin-left:-7px;" :disabled="recalculate"></el-input-number>
                                    </div>
                                    <div class="div2">
                                        <div class="label">加减费用：</div>	
                                        <el-input-number v-model="form.cost" size="mini" style="margin-left:-7px;" :disabled="recalculate"></el-input-number>
                                    </div>
                                </div>
                                <div class="certificate2">
                                    <div class="txtWrap">
                                        <div class="label">调整原因：</div>
                                        <textarea placeholder="请输入" v-model="obj.txt" maxlength="1000" :class="{'textareaBorder': textareaBorder}" @input="handlResion" :disabled="recalculate"></textarea>
                                        <div class="txtNum">{{obj.txt.length}}/1000</div>
                                        <p v-if="textareaBorder"><img src="../../../assets/img/prompt1.svg" alt=""><span>字数不可超过1000字</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="subBtn">
                    <div @click="submite" class="confirm">确定</div>
                    <div @click="cancel" class="Shutdown">取消</div>
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
                            <div class="item" @click="tagCheck2(i,k)" v-for="(i,k) in dataList2" :key="k" :class="{'borderBottom':k!=dataList2.length,'select1':pitchUp}">
                                <div class="div1">{{i.name}}</div>
                                <div class="div3" v-if="pitchUp"></div>
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
import _ from 'lodash'
export default {
    name: 'modulationInformations',
    mixins: [mixin],
	data () {
		return {
            form: {total: 0,cost: 0},
            aFew: 0,
            calCost: 0,
            obj: {txt: ''},
            picture_data: {
                src: require("../../../assets/img/closeeye.svg")
            },
            certShow: true,
            textareaBorder: false,
            avatar: '',
            show: false, 
            _timeOut: '',
            userName: '',
            gender: '',
            age: '',
            certType: '',
            workerId: '',
            department: '',
            postName: '',
            startTime: '',
            endTime: '',
            reward: 'reward',
            agencyName: '',
            workTxt: '请输入',
            msg: '',
            liaisons: '',
            liaisonsPhone: '',
            dialogVisible: false,
            dataList: [],
            dataList1: [],
            dataList2: [],
            checkBtn: 1,
            compare: [false,false,false],
            obj1:{
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
            pitchUp: false,
            recalculate: false,
            initialTime: '',
            overTime: '',
            number: .5,
            adjustAgencyId: '',
            adjustAgencyName: '',
            adjustDepartmentId: '',
            adjustDepartmentName: '',
            adjustSignId: '',
            adjustPostId: '',
            adjustPostName: '',
            adjustWorkTimeEnd: '',
            adjustWorkTimeStart: ''
		}
	},
	mounted () {
        this.show = true
        this.init()
    },
    filters:{
        decimal(val) {
            if(val){
                return val.toFixed(1)
            }else{ return '' }
        },
        keepDecimal(val){
			if(val){
                if(val>0){
                    let str = val.toFixed(1).substring(3,2)
                    if(str>5){
                        return '早到'+parseInt((val+1))+'.0'+'小时'
                    }else if(str<5){
                        return '早到'+parseInt(val)+'.0'+'小时'
                    }else if(str==5){
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
		},
        meal(str){
            if(str == 'male'){
                return '男'
            }else{
                return '女'
            }
        },
        chang(id){
            if(id == 'id-card'){
                return "中国居民身份证"
            }else if(id == 'passport'){
                return "护照"
            }else if(id == 'home-card'){
                return '回乡证'
            }else if(id == 'tw-card'){
                return '台胞证'
            }
        },
        certNoChange(cert) {
            if(cert){
                return '**************' + cert.substring(14,18)
            }else{
                return ''
            }
        }
    },
	methods: {
        handlResion() {
            if(this.obj.txt.length==1000){
                this.textareaBorder = true
            }else if(this.obj.txt.length<1000){
                this.textareaBorder = false
            }
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('modulationInformations')
			}, 200)
        },
        init() {
            this.$axios({
                method: 'post',
                url: this.$urls.message,
                data: {
                    workerId: this.$store.state.recruitmentPlan.id.workerId,
                    agencyId: this.$store.state.recruitmentPlan.id.agencyId,
                    orderDetailId: this.$store.state.recruitmentPlan.id.orderDetailId,
                    orderId: this.$store.state.recruitmentPlan.id.orderId,
                    signId: this.$store.state.recruitmentPlan.id.id,
                }
            })
            .then(res => {
                console.log(res)
                this.adjustSignId = _.get(res,'data.sign.id','')
                this.avatar = _.get(res,'data.worker.avatar','')
                this.userName = _.get(res,'data.worker.name','')
                this.gender = _.get(res,'data.worker.gender','')
                this.age = this.$base.age(_.get(res,'data.worker.birthday',''))
                this.certType = _.get(res,'data.worker.certType','')
                this.workerId = _.get(res,'data.worker.certNo','')
                this.department = _.get(res,'data.todayVo.departmentName','')
                this.postName = _.get(res,'data.todayVo.postName','')
                this.agencyName = _.get(res,'data.agency.name','')
                this.startTime = _.get(res,'data.todayVo.startDate','')
                this.endTime = _.get(res,'data.todayVo.endDate','')
                this.liaisons = _.get(res,'data.agency.legal','')
                this.liaisonsPhone = _.get(res,'data.agency.phone','')
                this.form.total = _.get(res,'data.workerBill.adjustWorkTime','')/(1000 * 60 * 60)
                this.form.cost = parseInt( _.get(res,'data.workerBill.adjustWorkCost','')/(10 * 10))
                this.calCost = parseInt( _.get(res,'data.workerBill.calCost','')/(10 * 10))
                this.aFew =  _.get(res,'data.workerBill.adjustWorkTime','0')/(1000 * 60 * 60) + _.get(res,'data.workerBill.workTime','0')/(1000 * 60 * 60)
                let str = `${this.$base.timeplateTohm(this.startTime)}-${this.$base.timeplateTohm(this.endTime)}`
                this.workTxt = this.department+'，'+this.postName+'，'+str+'，'+this.agencyName
                this.initialTime = (this.$base.timeplateToss(this.$base.timeplateTohm(this.startTime)) - this.$base.timeplateToss(this.$base.formattingHover(this.$store.state.recruitmentPlan.id.signInTime)))/3600000
                this.overTime = (this.$base.timeplateToss(this.$base.timeplateTohm(this.endTime)) - this.$base.timeplateToss(this.$base.formattingHover(this.$store.state.recruitmentPlan.id.signOutTime)))/3600000
            })
            this.$axios({
                method: 'get',
                url:this.$urls.getBillDetail,
                params:{
                    startTime: this.$store.state.recruitmentPlan.id.signInTime
                }
            }).then(res=>{  
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
            }).catch(e=>{
                
            })
            
        },
        tagCheck(i,k) {
            this.dataList.forEach((item,key)=>{
                item.check = false
                if (i.name == item.name) {
                    item.check = !item.check
                    this.department = i.name+'，'
                    this.obj1.departmentId = i.id
                    this.obj1.departmentName = i.name
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
                    this.obj1.workTimeStart = i.startTime
                    this.obj1.workTimeEnd = i.endTime
                    this.obj1.postId = i.postId
                    this.obj1.postName = i.postName
                }
            })
            this.$axios({
                method: 'get',
                url:this.$urls.getListAgency+this.obj1.postId
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
            this.pitchUp = false
            this.compare = [].concat(this.compare)
            this.checkTag()
        },
        tagCheck2(i,k) {
            this.dataList2.forEach((i,key)=>{
                i.check = false
                if(k==key) {
                    // i.check = !i.check
                    this.pitchUp = !this.pitchUp
                    this.agencyName = i.name
                    this.detailObj = i
                    this.obj1.agencyId = i.id
                    this.obj1.agencyName = i.name
                }
            })
            this.adjustAgencyName = i.name
            this.adjustAgencyId = i.id
            this.compare[2] = true
            this.compare = [].concat(this.compare)
        },
        checkTag() {
            setTimeout(()=>{
                this.checkBtn++
            },300)
        },
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
                    setTimeout(()=>{this.init(),this.recalculate = false},5000)
                    this.recalculate = true
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
            this.workTxt = this.department+this.workTime+this.agencyName
            this.dialogVisible = false
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
        submite() {
            if(!this.obj.txt){
                this.$message({
                    message: '调整原因不可为空',
                    type: 'error',
                    duration: 5 * 1000,			
                })
                return
            }
            this.$axios({
                method: 'post',
                url: this.$urls.updateWorkBill,
                data: {
                    signId: this.$store.state.recruitmentPlan.id.id,
                    adjustWorkCost: this.form.cost*100,
                    adjustWorkTime: this.form.total*3600000,
                    adjustRemark: this.obj.txt
                }
            }).then(res=>{
                console.log(res)
                if(res.data.code==0){
                    this.$message({
                        message: '考勤调整成功',
                        type: 'success',
                        duration: 5 * 1000,			
                    })
                    this.cancel()
                }else{
                    this.$message({
                        message: res.data.msg,
                        type: 'error',
                        duration: 5 * 1000,			
                    })
                }
            }).catch(err=>{ console.log(err) })
        },
        switchCert() {
            this.certShow = !this.certShow
            this.picture_data.src=this.picture_data.src==require("../../../assets/img/closeeye.svg")?require("../../../assets/img/openeye.svg"):require("../../../assets/img/closeeye.svg")
        },
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
[v-cloak]{
    display: none;
}
.dialog{
    box-sizing: border-box;
    height: 369px;
    .head{
        width: 580px;
        height: 40px;
        margin-left: -15px;
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
        .checkBtn:nth-of-type(1){
            margin-left: 70px;
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
    height: 810px;
    overflow-y: scroll;
    .fixed{
        width: 710px;
    }
	.minH{
        position: relative;
        min-height: calc(100% - 141px);
        .blackname{
            position: absolute;
            top: 273px;
            left: 630px;
            img{
                width: 100px;
                height: 100px;
            }
        }
    }    
	.title{
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #666666;
        margin-top: 15px;
        margin-left: 20px;
        font-weight: bold;
    }
    .wrapContent{
        width: 710px;
        background-color: #f4f8fc;
        border-radius: 2px;
        padding-bottom: 24px;
        margin-top: 15px;
        margin-left: 20px;
        // margin-bottom: 24px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        .headTop{
            width: 90px;
            height: 90px;
            position: absolute;
            top: 11px;
            left: 596px;
            border-radius: 100%;
        }
        .nameOne{
            // width: 500px;
            display: flex;
            .item1{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 24px;
            span{
                margin-left: 38px;
            }
          } 
          .item2{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left:0px;
            span{
                margin-left: 25px;
            }
          }
          .item3{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: -40px;
            span{
                // margin-left: 25px;
            }
          }
        }
        .certType{
            width: 500px;
            display: flex;
            .item1{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 24px;
            span{
                margin-left: 10px;
            }
          } 
          .item2{
            // width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 0px;
            span{
                margin-left: 12px;
            }
            img{
              margin-left: 10px;
              width: 14px;
              height: 12px;
              cursor: pointer;
            }
          }
        }
        .state{
            width: 120px;
            position: absolute;
            bottom: 40px;
            right: 0;
        }
          
        .item3{
            width: 230px;
            font-size: 14px;
            color: #444950;
            margin-top: 60px;
            margin-left: 24px;
            span{
                margin-left: 10px;
            }
            .detail{
                font-size: 12px;
                color: #999999;
            }
        }
        .item6{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 0px;
            margin-left: 48px;
            span{
                margin-left: 10px;
            }
            .detail{
                font-size: 12px;
                color: #999999;
            }
        }
        .mbt0{
            margin-bottom: 24px;
        } 
        .item3{
            width: 156px;
        }
        .item4{
            float: left;
            margin-top: 24px;
            margin-left: 20px;
            font-size: 14px;
            color: #444950;
            span{
                margin-left: 10px;
            }
        }
        .item5 {
            float: left;
            margin: 64px 0px 24px -498px;
            font-size: 14px;
            color: #444950;
            span{
                margin-left: 10px;
            }
        }
        .width100{
            width: 100%;
        }
    }
    .todayWork{
        .wrapContenttwo{
            width: 710px;
            height: 68px;
            margin: 15px auto;
            // overflow: hidden;
            background-color: #f4f8fc;
            .item1{
                position: relative;
                float: left;
                width: 710px;
                font-size: 14px;
                margin-top: 19px;
                margin-left: 29px;
                color: #444950;
                span:nth-child(2){
                    height: 30px;
                    font-size: 12px;
                    line-height: 30px;
                    margin-left: 3px;
                    padding-left: 10px;
                    color: #4c8aff;
                    cursor: pointer;
                }
            }
            input::-webkit-input-placeholder{
                font-size: 14px;
                color:#999999;
            }
        }
    }
    .footer{
        position: relative;
        .title{
            margin-bottom: 15px;
        }
        .recalculate{
            position: absolute;
            top: 5%;
            left: 210px;
            width: 300px;
            height: 70px;
            text-align: center;
            line-height: 70px;
            font-size: 20px;
            color: #fff;
            border-radius: 5px;
            z-index: 99;
            background-color: rgba(68, 73, 80, 0.51);
        }
        .certificateWrap{
        width: 710px;
        // height: 245px;
        background-color: #f4f8fc;
        border-radius: 2px;
        margin-left: 20px;
        padding-bottom: 150px;
        box-sizing: border-box;
        p{
            float: left;
            margin-left: 80px;
            margin-top: 3px;
            color: #e45a3c;
            img{
                width: 13px;
                height: 13px;
                float: left;
                margin-top: 2px;
                margin-right: 5px;
            }
        }
        .borderbox{
            
            .attendanceStatus{
                float: left;
                margin-top: 24px;
                margin-left: 26px;
                font-size: 14px;
                color: #444950;
                span{ margin-left: 9px; }
            }
            .certificate{
                position: relative;
                float: left;
                display: flex;
                width: 710px;
                height: 40px;
                font-size: 18px;
                line-height: 40px;
                margin-top: 15px;
                margin-bottom: 20px;
                margin-left: 26px;
                color: #444950;
                .AccountingWork{
                    font-size: 14px;
                    span{
                        margin-left: 10px;
                    }
                }
                .CostAccounting{
                    position: absolute;
                    top: 0;
                    right: 30px;
                    width: 280px;
                    font-size: 14px;
                    span:nth-of-type(1){
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                    span:nth-of-type(2){
                        margin-left: 80px;
                    }
                }
          }
          .certificate1{
              clear: both;
              height: 21px; 
              display: flex;
              margin-left: -65px;
              justify-content: center;
              .div1{
                  margin-left: -22px;
                  font-size: 14px;
                  .label{
                      display: inline-block;
                      margin-right: 13px;
                  }
              }
              .div2{
                  margin-left: 230px;
                  font-size: 14px;
                  .label{
                      display: inline-block;
                      margin-right: 13px;
                  }
              }
          }
          .certificate2{
              position: relative;
              .txtWrap{
                position: absolute;
                top: 24px;
                left: 28px;
                overflow:hidden;
                .label{
                    float:left;
                    height: 20px;
                    line-height:20px;
                    font-size: 14px;
                    color: #444950;
                }
                textarea{
                    width:582px;
                    height:100px;
                    font-size:14px;
                    border: solid 1px #ececec;
                    color: #444950;
                    outline:none;
                    resize:none;
                    padding:5px 10px;
                    box-sizing:border-box;
                    float:left;
                    margin-left:10px;
                }
                textarea::-webkit-input-placeholder{
                    font-size: 14px;
                    color:#999999;;
                }
                textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
                    font-size: 14px;
                    color:#999999;
                }
                textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                    font-size: 14px;
                    color:#999999;
                }
                textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                    font-size: 14px;
                    color:#999999;
                }
                .textareaBorder{
                    border-color: #e45a3c;
                }
                .txtNum{
                    position:absolute;
                    top: 80px;
                    right:20px;
                    font-size: 14px;
                    color: #999999;
                    bottom:5px;
                }
            }
          }
        }
      }
    }
    .subBtn{
        display: flex;
        justify-content: center;
        align-items: center;
		height:57px;
		border-top:1px solid #ececec;
        margin-top:15px;
        .confirm{
            width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #ffffff;
            background: #4c8aff;
        }
        .Shutdown{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #4c8aff;
            margin-left: 60px;
		}
	}
}
	
</style>