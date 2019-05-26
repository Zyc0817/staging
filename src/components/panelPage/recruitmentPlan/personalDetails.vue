<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">  
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">{{'个人信息'}}</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div style="height:50px;" v-if="fixed"></div>
                <div class="minH">
                    <div class="title">基本信息</div>
                    <div class="wrapContent">
                        <div class="headphoto">
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
                            <div class="item2" v-if="certShow">证件号：<span>{{workerId | certNoChange}}</span></div>
                            <div class="item2" v-else>证件号：<span>{{workerId}}</span></div>
                            <img :src="picture_data.src" alt="" @click="switchCert">
                        </div>
                        <div class="whether">
                            <div class="item1">类型：<span>{{category | TypeOfWork}}<span class="worknumber" v-if="category=='longterm'">({{new Date().getFullYear()+'/'+(1+new Date().getMonth())+'/'+new Date().getDate()}} - {{$base.formattingTime(invalidTime)|showTime}})</span><span class="worknumber" v-if="category=='inside'">({{workNumber|showTime}})</span></span></div>
                        </div>
                    </div>
                    <div class="blackname" v-if="blacknamepersonal == 'enable'"><img src="../../../assets/img/heimingdan.png" alt=""></div>
                    <div v-if="blacknamepersonal != 'enable'">
                        <div class="title">支付信息</div>
                        <div class="wrapContenttwo">
                            <div v-if="blankName!=''||subBankName!=''||bankNo!=''">
                                <div class="item1">
                                    <div class="bank">银行名称：<span>{{blankName}}</span></div>
                                    <div class="accountbranch">开户支行：<span>{{subBankName}}</span></div>
                                </div>
                                <div class="item2">银行卡号：<span>{{bankNo}}</span></div>
                            </div>
                            <div class="noBankInformation" v-else>暂无银行卡信息</div>
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
                    <div v-if="blacknamepersonal == 'enable'">
                        <div class="title">黑名单信息</div>
                        <div class="blackreason">
                            <div class="package"><div class="item1">拉黑原因：<span>{{remark}}</span></div></div>
                        </div>
                    </div>  
                    <div v-if="(blacknamepersonal != 'enable')&&(certs.length!=0)">
                        <div class="title">从业资格证信息</div>
                        <div class="certificateWrap">
                            <div class="certificate">
                                <div :class="{'select':certificateCheck[index]}" @click="handleCert(index)" v-for="(cert,index) in certs" :key="index">{{cert.certName}}</div>
                            </div>
                            <div>
                                <div class="certificateContent">
                                    <div class="left" v-for="(cert,index) in computedCerts" :key="index">
                                        <div class="item">证号：<span>{{cert.certTypeId}}</span></div>
                                        <div class="item">有效期：<span>{{$base.formattingTime(cert.certStartDate)}}—{{$base.formattingTime(cert.certEndDate)}}</span></div>
                                        <div class="item">发证机关：<span>{{cert.certOrg}}</span></div>
                                        <div class="certPicture"><img :src= photoUrl+i.filepath+i.filedate v-for="(i,k) in cert.attachList" :key="k" alt=""></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="subBtn">
                    <div @click="editor(startId)" v-if="blacknamepersonal != 'enable'" class="editor">编辑</div>
                    <div @click="tag(startId)" v-if="blacknamepersonal != 'enable'" class="tag">标记</div>
                    <div @click="cancel" class="Shutdown">关闭</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import _ from 'lodash'
import mixin from '../../../assets/js/mixin/mixin'
import BatchOperationMessage from '../../common/batchOperationMessage1'
export default {
    name: 'personalDetails',
    props: ['dataList'],
    mixins: [mixin],
	data () {
		return {
            picture_data: {
                src: require("../../../assets/img/closeeye.svg")
            },
            avatar: '',  //   显示头像
            show: false, 
            certShow: true,
            certificateCheck: [true],
            _timeOut: '',
            userName: '',
            gender: '',
            borthday: '',
            age: '',
            height: '',
            phone: '',
            qq: '',
            wechat: '',
            certType: '',
            remark: '',
            category: '',
            workerNo: '',
            workerId: '',
            blacknamepersonal: '',
            allWorkDuration: '',
            monthWorkDuration: '',
            blankName: '',
            subBankName: '',
            bankNo: '',
            allWorkTimes: '',
            certName: '',
            certs: [],
            fixed: false,
            invalidTime: '',
            workNumber: '',
            startId: '',
            attachList: [],
            photoUrl: 'https://company-test.lanniao.com/upload/'
		}
    },
	mounted () {
        this.show = true
        if(this.$store.state.recruitmentPlan.state == 1){
            this.blackname()
        }else{
            this.init()
        }
    },
    computed:{
        computedCerts() {
            return this.certs.filter((i,k)=>this.certificateCheck[k])
        }
    },
    filters:{
        showTime(val) {
            if(val=='NaN/NaN/NaN'||val==null){
                return '未知'
            }else{
                return val
            }
        },
        keepDecimal(val){
			if(val&&val!=0){
				return val.toFixed(1)
			}else if(val==0){
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
				this.$store.dispatch('personalDetails')
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
                    orderId: this.$store.state.recruitmentPlan.id.orderId
                }
            })
            .then(res => {
                // console.log(res)
                this.startId = _.get(res,'data.worker.id','')
                this.userName = _.get(res,'data.worker.name','')
                this.gender = _.get(res,'data.worker.gender','')
                this.borthday = this.$base.formattingTime(_.get(res,'data.worker.birthday','0'))
                this.age = this.$base.age(_.get(res,'data.worker.birthday','0'))
                this.height = _.get(res,'data.worker.height','')
                this.phone = _.get(res,'data.worker.phone','')
                this.qq = _.get(res,'data.worker.qq','')
                this.wechat = _.get(res,'data.worker.wechat','')
                this.certType = _.get(res,'data.worker.certType','')
                this.invalidTime = _.get(res,'data.worker.invalidTime','')
                this.workNumber = _.get(res,'data.worker.workerNo','')
                this.category = _.get(res,'data.worker.category','')
                this.workerNo = _.get(res,'data.worker.workerNo','')
                this.workerId = _.get(res,'data.worker.certNo','')
                this.avatar = _.get(res,'data.worker.avatar','')
                this.blankName = _.get(res,'data.worker.blankName','')
                this.subBankName = _.get(res,'data.worker.subBankName','')
                this.bankNo = _.get(res,'data.worker.bankNo','')
                this.attachList = _.get(res,'data.attachList',[])
                if(!res.data.workerTime){
                    this.allWorkDuration==0
                    this.monthWorkDuration==0
                    this.allWorkTimes==0
                }else{ 
                    this.allWorkDuration = res.data.workerTime.allWorkDuration
                    this.monthWorkDuration = res.data.workerTime.monthWorkDuration
                    this.allWorkTimes = res.data.workerTime.allWorkTimes
                    }
                this.certs = _.get(res,'data.workerCertManagerVoList',[])
                for(let i=0;i<this.certs.length;i++){
                    this.certificateCheck.push(false)
                }
            }).catch(err=>{ console.log(err) }) 
        },
        blackname(){
            this.$axios({
                method: 'post',
                url: this.$urls.message,
                data: {
                    workerId: this.$store.state.recruitmentPlan.id.workerId
                }
            }).then(res=>{
                this.blacknamepersonal = _.get(res,'data.workerBlacklist.state','')
                this.userName = _.get(res,'data.worker.name','')
                this.gender = _.get(res,'data.worker.gender','')
                this.borthday = this.$base.formattingTime(_.get(res,'data.worker.birthday','0'))
                this.age = this.$base.age(_.get(res,'data.worker.birthday','0'))
                this.height = _.get(res,'data.worker.height','')
                this.phone = _.get(res,'data.worker.phone','')
                this.qq = _.get(res,'data.worker.qq','')
                this.wechat = _.get(res,'data.worker.wechat','')
                this.certType = _.get(res,'data.worker.certType','')
                this.workerNo =  _.get(res,'data.worker.workerNo','')
                this.workerId = _.get(res,'data.worker.certNo','')
                this.avatar = _.get(res,'data.worker.avatar','')
                this.category = _.get(res,'data.worker.category','')
                this.remark = _.get(res,'data.workerBlacklist.remark','')
                this.allWorkTimes = _.get(res,'data.workerTime.allWorkTimes','')
                this.allWorkDuration = _.get(res,'data.workerTime.allWorkDuration','')
                this.monthWorkDuration = _.get(res,'data.workerTime.monthWorkDuration','')
            }).catch(err=>{ console.log(err) })
        },
        editor(id){
             let params = {}
			 params = {title:'编辑个人信息',type:'personalInformationOne',operation:0,state:5,id}
			 this.$store.dispatch('personalInformationOne',params)
        },
        tag(item){
            this.$parent.father(item);
        },
        switchCert() {
            this.certShow = !this.certShow
            this.picture_data.src=this.picture_data.src==require("../../../assets/img/closeeye.svg")?require("../../../assets/img/openeye.svg"):require("../../../assets/img/closeeye.svg")
        },
        handleCert(k) {
            this.certificateCheck = this.certificateCheck.map((i,key)=>{
                if(k == key){
                    return true
                }
            })
        }
    },
    components: {
        BatchOperationMessage
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
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        .headphoto{
            position: absolute;
            top: 28px;
            left: 536px;
            img{ width: 150px;height: 150px;border-radius: 100%; }
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
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 20px;
            span{
                margin-left: 13px;
            }
          }
          img{
              width: 14px;
              height: 12px;
              float: left;
              margin-left: 10px;
              margin-top: 28px;
              cursor: pointer;
          }
        }
        .whether{
            width: 500px;
            display: flex;
            .item1{
            // width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 24px;
            .worknumber{
                margin-left: 5px;
                font-size: 12px;
                color: #999999;
            }
            span{
                margin-left: 37px;
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
            margin-left: -30px;
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
    .blackreason{
        width: 710px;       
        margin: 15px auto;
        line-height: 68px;       
        line-height: 300%;
        .package{
            float: left;
            width: 710px;
            background: #f4f8fc;
            .item1{
                font-size: 14px;
                margin-left: 25px;     
                margin-top: 14px;  
                margin-bottom: 14px;    
                span{
                    margin-left: 10px;
                }
            }
        }  
    }
    .wrapContenttwo{
        width: 710px;
        margin: 15px auto;
        overflow: hidden;
        background-color: #f4f8fc;
        .noBankInformation{
            float: left;
            margin-top: 24px;
            margin-left: 24px;
            margin-bottom: 24px;
            font-size: 14px;
            color: #999999;
        }
        .item1{
            float: left;
            width: 100%;
            display: flex;
            font-size: 14px;
            margin-top: 24px;
            margin-left: 25px;
            .bank{
                width: 180px;
            }
            .accountbranch{
                margin-left: 200px;
            }
            span{
                margin-left: 10px;
            }
        }
        .item2{
            float: left;
            font-size: 14px;
            margin-left: 25px;
            margin-top: 24px;
            margin-bottom: 24px;
            span{
                margin-left: 10px;
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
        margin-bottom: 20px;
        box-sizing: border-box;
        .certificate{
            width: 710px;
            height: 40px;
            font-size: 14px;
            line-height: 40px;
            background-color: #eaf3fe;
            div{
                display: inline-block;
                padding: 0 19px;
                text-align: center;
                margin-left: 60px;
                cursor: pointer;
            }
            div:nth-child(1){
                margin-left: 78px;
            }
            .select{
                color: #4c8aff;
                border-bottom: 2px solid #4c8aff;
            }
        }
        .certificateContent{
            padding: 0 30px;
            overflow: hidden;
            position: relative;
            .left{
                width: 50%;
                float: left;
                font-size: 14px;
                color: #444950;
                .certPicture{
                    position: absolute;
                    top: 28px;
                    left: 346px;
                    img{ 
                        width: 160px;
                        height: 100px;
                    }
                    img:nth-of-type(2){
                        margin-left: 10px;
                    }
                }
                .item{
                    margin-top: 24px;
                }
                .item:nth-child(1){
                    span{
                        margin-left: 35px;
                    }
                }
                .item:nth-child(2){
                    span{
                        margin-left: 23px;
                    }
                }
                .item:nth-child(3){
                    span{
                        margin-left: 10px;
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
        .editor{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #ffffff;
            margin: 15px 0;
            background-color: #4c8aff;
		}
		.tag{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #ffffff;
            margin: 15px 60px;
            background-color: #4c8aff;
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
            margin: 15px 5px;
		}
	}
}
	
</style>