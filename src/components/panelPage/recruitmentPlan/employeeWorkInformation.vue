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
                <div style="height:50px;" v-if="fixed"></div>
                <div class="minH">
                    <div class="title">基本信息</div>
                    <div class="wrapContent">
                        <div class="headPortrait">
                            <img src="../../../assets/img/head@3x.svg" alt="" v-if="!avatar">
                            <img :src= avatar alt="" v-else>
                        </div>
                        <div class="nameOne">
                            <div class="item1">姓名：<span>{{userName}}</span></div>
                            <div class="item2">性别：<span>{{gender | meal}}</span></div>
                        </div>
                        <div class="bornDate">
                            <div class="item1">出生日期：<span>{{borthday}}</span></div>
                            <div class="item2">年龄：<span>{{age}}</span></div>
                        </div>
                        <div class="heightTop">
                            <div class="item1">身高：<span>{{height}}cm</span></div>
                            <div class="item2">手机号：<span>{{phone | phoneType}}</span></div>
                        </div>
                        <div class="QQcode">
                            <div class="item1">QQ号：<span>{{qq}}</span></div>
                            <div class="item2">微信号：<span>{{wechat}}</span></div>
                        </div>
                        <div class="certType">
                            <div class="item1">证件类型：<span>{{certType | chang}}</span></div>
                            <div class="item2" v-if="certShow">证件号：<span>{{workerId | certNoChange}}</span><img :src="picture_data.src" alt="" @click="switchCert"></div>
                            <div class="item2" v-else>证件号：<span>{{workerId}}</span><img :src="picture_data.src" alt="" @click="switchCert"></div>                            
                        </div>
                    </div>
                    <div v-if="blacknamepersonal != 'enable'">
                        <div class="title">今日工作</div>
                        <div class="wrapContenttwo">
                            <div class="item1"><span>用工计划：</span><span>{{department}}, &nbsp;{{postName}}, &nbsp;{{startTime}} - <span v-if="parseInt(endTime/(24*3600000))>0">次日</span>{{$base.timeplateTohm(endTime%(24*3600000))}}, &nbsp;{{agencyName}}</span>
                                <el-tooltip placement="bottom" :effect="'light'">
                                    <div class="content" slot="content" style="font-size: 14px;">
                                        <div v-if="true">
                                            <p>招聘者：{{agencyName}}</p>
                                            <p  style="margin:10px 0">联络人：{{contact}}</p>
                                            <p>手机号码：{{mobilePhone}}</p>
                                        </div>
                                        <p v-else class="infoNull" style="color: #999999;margin-top:10px;">无联络人信息</p>
                                    </div>
                                    <div class="detail">详情</div>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="title">工作信息</div>
                        <div class="wrapContentone">  
                            <div class="item1">本月工时：<span>{{monthWorkDuration/3600000 | keepDecimal}}小时</span></div>
                            <div class="item2">累计工时：<span>{{allWorkDuration/3600000 | keepDecimal}}小时</span></div>
                            <div class="item3">工作总次数：<span>{{allWorkTimes | keepDecimal}}次</span></div>
                        </div>
                    </div>      
                    <div v-if="(blacknamepersonal != 'enable')&&certs.length!=0">
                        <div class="title">从业资格证信息</div>
                        <div class="certificateWrap">
                            <div class="certificate">
                                <div :class="{'select':certificateCheck[index]}" @click="handleCert(index)" v-for="(cert,index) in certs" :key="index">{{cert.certName}}</div>
                            </div>
                            <div>
                                <div class="certificateContent">
                                    <div class="left" v-for="(cert,index) in computedCerts" :key="index">
                                        <div class="item">证号：<span>{{cert.certNo}}</span></div>
                                        <div class="item">有效期：<span>{{$base.formattingTime(cert.certStartDate)}}—{{$base.formattingTime(cert.certEndDate)}}</span></div>
                                        <div class="item">发证机关：<span>{{cert.certOrg}}</span></div>
                                        <div class="certPicture"><img src="../../../assets/img/lanniao.png" alt=""><img src="../../../assets/img/logo.png" alt=""></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="subBtn">
                    <div @click="cancel" class="Shutdown">关闭</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
import _ from 'lodash'
export default {
    name: 'employeeWorkInformation',
    mixins: [mixin],
	data () {
		return {
            dataList: [],
            picture_data: {
                src: require("../../../assets/img/closeeye.svg")
            },
            show: false, 
            certificateCheck: [true],
            _timeOut: '',
            avatar: '',   //  显示头像
            userName: '',
            gender: '',
            borthday: '',
            age: '',
            height: '',
            phone: '',
            qq: '',
            wechat: '',
            certType: '',
            workerId: '',
            blacknamepersonal: '',
            allWorkDuration: '',
            monthWorkDuration: '',
            allWorkTimes: '',
            certName: '',
            certs: [],
            certShow: true,
            fixed: false,
            department: '',
            postName: '',
            startTime: '',
            endTime: '',
            agencyName: '',
            contact: '',
            mobilePhone: ''
		}
	},
	mounted () {
        this.show = true
        if(this.$store.state.recruitmentPlan.operation==0){
            this.init()
        }else if(this.$store.state.recruitmentPlan.operation==1){
            this.init1()
        }
    },
    computed: {
        computedCerts() {
            return this.certs.filter((i,k)=>this.certificateCheck[k])
        }
    },
    filters:{
        keepDecimal(val){
			if(val){
				return val.toFixed(1)
			}else{
				return '0'
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
        minusSign(val){
            if(val<0){
                return val = -val
            }else{
                return val = val
            }
        },
        phoneType(phone){
			if(phone){
				return phone.substring(0,3) + "-" + phone.substring(3,7) + "-" + phone.substring(7,13)
			}else{
				return ''
			}
        },
        TypeOfWork(val){
			if(val == 'temporary'){
				return '小时工'
			}else if(val == 'longterm'){
				return '长期工'
			}else if(val == 'inside'){
				return '内部员工'
			}else{
				return ''
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
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('employeeWorkInformation')
			}, 200)
        },
        init() { 
            this.$axios({
                method: 'post',
                url: this.$urls.message,
                data: {
                    signId: this.$store.state.recruitmentPlan.id.id,
                    workerId: this.$store.state.recruitmentPlan.id.workerId,
                    agencyId: this.$store.state.recruitmentPlan.id.agencyId,
                    orderDetailId: this.$store.state.recruitmentPlan.id.orderDetailId,
                    orderId: this.$store.state.recruitmentPlan.id.orderId
                }
            })
            .then(res => {
                this.userName = _.get(res,'data.worker.name','')
                this.gender = _.get(res,'data.worker.gender','')
                this.borthday = this.$base.formattingTime(_.get(res,'data.worker.birthday',''))
                this.age = this.$base.age(_.get(res,'data.worker.birthday',''))
                this.height = _.get(res,'data.worker.height','')
                this.phone = _.get(res,'data.worker.phone','')
                this.qq = _.get(res,'data.worker.qq','')
                this.wechat = _.get(res,'data.worker.wechat','')
                this.certType = _.get(res,'data.worker.certType','')
                this.workerId = _.get(res,'data.worker.certNo','')
                this.avatar = _.get(res,'data.worker.avatar','')
                this.certs = _.get(res,'data.workerCertList','')
                for(let i=0;i<this.certs.length;i++){
                    this.certificateCheck.push(false)
                }
                this.department = _.get(res,'data.todayVo.departmentName',[])
                this.postName = _.get(res,'data.todayVo.postName','')
                this.agencyName = _.get(res,'data.sign.agencyName','')
                this.contact = _.get(res,'data.agency.legal','')
                this.mobilePhone = _.get(res,'data.agency.phone','')
                this.startTime = this.$base.timeplateTohm(_.get(res,'data.todayVo.startDate','')) 
                this.endTime = _.get(res,'data.todayVo.endDate','')
                this.allWorkDuration = _.get(res,'data.workerTime.allWorkDuration','')
                this.monthWorkDuration = _.get(res,'data.workerTime.monthWorkDuration','')
                this.allWorkTimes = _.get(res,'data.workerTime.allWorkTimes','')
            }) 
        },
        init1() {
            this.$axios({
                method: 'post',
                url: this.$urls.message,
                data: {
                    signId: this.$store.state.recruitmentPlan.id.signId,
                    workerId: this.$store.state.recruitmentPlan.id.workerId,
                    agencyId: this.$store.state.recruitmentPlan.id.agencyId,
                    orderDetailId: this.$store.state.recruitmentPlan.id.orderDetailId,
                    orderId: this.$store.state.recruitmentPlan.id.orderId
                }
            })
            .then(res => {
                console.log(res)
                this.userName = _.get(res,'data.worker.name','')
                this.gender = _.get(res,'data.worker.gender','')
                this.borthday = this.$base.formattingTime(_.get(res,'data.worker.birthday',''))
                this.age = this.$base.age(_.get(res,'data.worker.birthday',''))
                this.height = _.get(res,'data.worker.height','')
                this.phone = _.get(res,'data.worker.phone','')
                this.qq = _.get(res,'data.worker.qq','')
                this.wechat = _.get(res,'data.worker.wechat','')
                this.certType = _.get(res,'data.worker.certType','')
                this.workerId = _.get(res,'data.worker.certNo','')
                this.avatar = _.get(res,'data.worker.avatar','')
                this.certs = _.get(res,'data.workerCertList','')
                for(let i=0;i<this.certs.length;i++){
                    this.certificateCheck.push(false)
                }
                this.department = _.get(res,'data.todayVo.departmentName',[])
                this.postName = _.get(res,'data.todayVo.postName','')
                this.agencyName = _.get(res,'data.sign.agencyName','')
                this.contact = _.get(res,'data.agency.legal','')
                this.mobilePhone = _.get(res,'data.agency.phone','')
                this.startTime = this.$base.timeplateTohm(_.get(res,'data.todayVo.startDate','')) 
                this.endTime = _.get(res,'data.todayVo.endDate','')
                this.allWorkDuration = _.get(res,'data.workerTime.allWorkDuration','')
                this.monthWorkDuration = _.get(res,'data.workerTime.monthWorkDuration','')
                this.allWorkTimes = _.get(res,'data.workerTime.allWorkTimes','')
            })
        },
        switchCert() {
            this.certShow = !this.certShow
            this.picture_data.src=this.picture_data.src==require("../../../assets/img/closeeye.svg")?require("../../../assets/img/openeye.svg"):require("../../../assets/img/closeeye.svg")
        },
        handleCert(k) {
           this.certificateCheck = this.certificateCheck.map((i,key) => {
                if(k==key){
                    return true
                }
            });
        }
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
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
        .headPortrait{
            position: absolute;
            top: 28px;
            left: 536px;
            img{
                width: 150px;
                height: 150px;
                border-radius: 100%;
            }
        }
        .nameOne{
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
                margin-left: 38px;
            }
          } 
          .item2{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 24px;
            span{
                margin-left: 25px;
            }
          }
        }
        .bornDate{
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
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 24px;
            span{
                margin-left: 25px;
            }
          }
        }
        .heightTop{
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
                margin-left: 38px;
            }
          } 
          .item2{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 24px;
            span{
                margin-left: 12px;
            }
          }
        }
        .QQcode{
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
                margin-left: 32px;
            }
          } 
          .item2{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 24px;
            span{
                margin-left: 12px;
            }
          }
        }
        .certType{
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
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 20px;
            span{
                margin-left: 12px;
            }
            img{
                width: 14px;
                height: 12px;
                margin-top: 4px;
                margin-left: 10px;
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
    .wrapContentone{
        display: flex;
        justify-content: space-around;
        width: 710px;
        height: 68px;
        margin: 15px auto;
        line-height: 68px;
        background: #f4f8fc;
        .item1{
            font-size: 14px;
            margin-left: -29px;
            span{
                margin-left: 10px;
            }
        }
        .item2,.item3{
            font-size: 14px;
            span{
                margin-left: 10px;
            }
        }
    }
    .wrapContenttwo{
        width: 710px;
        height: 68px;
        margin: 15px auto;
        // overflow: hidden;
        background-color: #f4f8fc;
        .item1{
            float: left;
            width: 100%;
            font-size: 14px;
            margin-top: 24px;
            margin-left: 29px;
            color: #444950;
            span:nth-child(2){
                margin-left: 10px;
            }
            .detail{
                display: inline-block;
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                color: #999999;
                margin-left: 10px;
                margin-top: 0.5px;
            }
        } 
    }
    .certificateWrap{
        width: 710px;
        height: 196px;
        background-color: #f4f8fc;
        border-radius: 2px;
        margin-top: 15px;
        margin-left: 20px;
        box-sizing: border-box;
        .certificate{
            width: 710px;
            height: 40px;
            font-size: 14px;
            line-height: 40px;
            background-color: #eaf3fe;
            div{
                display: inline-block;
                width: 80px;
                text-align: center;
                margin-left: 60px;
                cursor: pointer;
            }
            .select{
                color: #4c8aff;
                border-bottom: 2px solid #4c8aff;
            }
        }
        .certificateContent{
            padding: 0 30px;
            overflow: hidden;
            .left{
                position: relative;
                width: 50%;
                float: left;
                font-size: 14px;
                color: #444950;
                .item{
                    margin-top: 24px;
                    span{
                        margin-left: 10px;
                    }
                }
                .certPicture{
                    position: absolute;
                    top: 28px;
                    left: 322px;
                    display: flex;
                    img:nth-child(1){ 
                        width: 160px;
                        height: 100px; 
                        border: .5px solid #ccc;
                    }
                    img:nth-child(2){ 
                        float: left;
                        margin-left: 10px;
                        width: 160px;
                        height: 100px; 
                        border: .5px solid #ccc;
                    }
                }
            }
        }
    }
    .subBtn{
        display: flex;
        justify-content: center;
		height:57px;
		border-top:1px solid #ececec;
        margin-top:15px;
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
            margin: 15px 5px;
		}
	}
}
	
</style>