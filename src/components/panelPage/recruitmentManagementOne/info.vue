<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">个人信息</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
                <div class="minH">
                    <div class="title">今日工作</div>
                    <div class="wrap wrap1">
                        <div class="item" :class="{'mb0':$store.state.recruitmentPlan.signParams.type!=3}">
                            <div class="left" :class="{'width122':$store.state.recruitmentPlan.signParams.type==3}">用工计划：</div>
                            <div class="right">{{plan}}</div>
                            <el-tooltip placement="bottom" :effect="'light'">
                                <div class="content" slot="content" style="font-size: 14px;">
                                    <p>招聘者：{{agencyName}}</p>
                                    <p v-if="data&&data.legal" style="margin:10px 0">联络人：{{data.legal}}</p>
                                    <p v-if="data&&data.legal">手机号码：{{data.phone}}</p>
									<p v-else class="infoNull" style="color: #999999;margin-top:10px;">无联络人信息</p>
                                </div>
                                <div class="detail floatL">详情</div>
                            </el-tooltip>
                        </div>
                        <div class="clear"></div>
                        <div class="item" v-if="$store.state.recruitmentPlan.signParams.type==3">
                            <div class="left width122">备注：</div>
                            <div class="right">{{remark}}</div>
                        </div>
                        <div class="clear"></div>
                        <div class="item mb0" v-if="$store.state.recruitmentPlan.signParams.type==3">
                            <div class="left width122">手工签退理由：</div>
                            <div class="right">{{removedRemark}}</div>
                        </div>
                    </div>
                    <div class="title">基本信息</div>
                    <div class="wrap">
                        <div class="width500">
                            <div class="item">
                                <div class="left">姓名：</div>
                                <div class="right">{{workerName}}</div>
                            </div>
                            <div class="item ml78">
                                <div class="left width74">性别：</div>
                                <div class="right">{{gender}}</div>
                            </div>
                            <div class="item">
                                <div class="left">出生日期：</div>
                                <div class="right">{{birthday}}</div>
                            </div>
                            <div class="item ml78">
                                <div class="left width74">手机号：</div>
                                <div class="right">{{phone|phoneNumber}}</div>
                            </div>
                            <div class="item mb0">
                                <div class="left">证件类型：</div>
                                <div class="right">{{certType}}</div>
                            </div>
                            <div class="item ml78 mb0 width218">
                                <div class="left width74">证件号：</div>
                                <div class="right">{{cardId}}</div>
                                <img src="../../../assets/img/closeeye.svg" v-if="!idCardShow" class="eye" @click="idCardShow=true" alt="">
                                <img src="../../../assets/img/openeye.svg" v-else class="eye" @click="idCardShow=false" alt="">
                            </div>
                        </div>
                        
                        <div class="head">
                            <img v-if="!avatar" src="../../../assets/img/head@3x.svg" alt="">
                            <img  v-else :src="avatar" alt="">
                        </div>
                    </div>
                    <div class="title">IC卡信息</div>
                    <div class="wrap wrap1">
                        <div class="item mb0">
                            <div class="left">IC卡号：</div>
                            <div class="right">{{icCardNo}}</div>
                        </div>
                        <div class="item floatR mb0">
                            <div class="left">IC卡编码：</div>
                            <div class="right">{{icCardSeq}}</div>
                        </div>
                    </div>
                </div>
                <div class="subBtn">    
                    <div @click="cancel">关闭</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: '',
	mixins: [mixin],
	data () {
		return {
			show: false, 
            _timeOut: '',
            idCardShow: false,
            certificateCheck: true,
            workerName: '',
            gender: '',
            birthday: '',
            phone: '',
            certNo:'',
            certType: '',
            avatar: '',
            plan: '',
            remark: '',
            data: {},
            icCardSeq: '',
            msg: '',
            workerId: '',  
            agencyName: '', 
            icCardNo: '',
            removedRemark: ''
		}
    },
    computed:{
        cardId() {
			if(!this.idCardShow){
				return `**************${this.certNo.substring(this.certNo.length-4,this.certNo.length)}`
			}else{
				return this.certNo
			}
		},
    },
    created() {
        this.init()
    },
	mounted () {
		this.show = true
	},
	methods: {
        init() {
            let data = this.$store.state.recruitmentPlan.signParams.data
            this.$axios({
                method: 'post',
                url: this.$urls.message,
                data: {
                    agencyId: data.agencyId,
                    orderDetailId: data.orderDetailId,
                    orderId: data.orderId,
                    signId: data.id,
                    workerId: data.workerId
                }
            }).then(res=>{
                this.plan = `${res.data.todayVo.departmentName},${res.data.todayVo.postName},${this.$base.timeplateTohm(res.data.todayVo.startDate)}-${this.$base.timeplateTohm(res.data.todayVo.endDate)},${res.data.agency.name}`
                this.data = res.data.agency
                this.agencyName = res.data.agency.name
                this.remark = res.data.sign.remark
                this.workerName = res.data.worker.name
                if(res.data.worker.gender=='male'){
                    this.gender = '男'
                }else{
                    this.gender = '女'
                }
                this.birthday = this.$base.formattingTime(res.data.worker.birthday)
                this.phone = res.data.worker.phone
                if(res.data.worker.certType == 'id-card'){
                    this.certType = '中国居民身份证'
                }else if(res.data.worker.certType == 'passport') {
                    this.certType = '护照'
                }else if(res.data.worker.certType == 'home-card') {
                    this.certType = '回乡证'
                }else if(res.data.worker.certType == 'tw-card') {
                    this.certType = '台胞证'
                } 
                this.avatar = res.data.worker.avatar
                this.certNo = res.data.worker.certNo
                this.icCardNo = res.data.sign.icCardNo
                this.icCardSeq = res.data.sign.icCardSeq
                this.removedRemark = res.data.sign.removedRemark
            }).catch(err=>{
                
            })
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('signInInfoShow')
			}, 200)
		},
		
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panelWrap .panel .panelTitleWrap .panelTitle .txt{
    font-size: 16px;
}
.panel{
	width:900px;
    overflow-y: scroll;
    .minH{
        min-height: calc(100% - 155px);
        .title{
            font-size: 16px;
            color: #666666;
            font-weight: bold;
            margin: 15px 0 0 20px;
        }
        .certificateWrap{
            width: 710px;
            margin: 0 auto;
            background-color: #f4f8fc;
            border-radius: 2px;
            padding: 0px 0px 24px;
            margin-top: 20px;
            box-sizing: border-box;
            overflow: hidden;
            .tab{
                height: 40px;
                background-color: #eaf3fe;
                div{
                    float: left;
                    width: 80px;
                    text-align: center;
                    height: 100%;
                    line-height: 38px;
                    color: #444950;
                    font-size: 14px;
                    box-sizing: border-box;
                    margin-left: 60px;        
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
                }
            }
        }
        .wrap{
            width: 860px;
            padding: 24px;
            box-sizing: border-box;
            background-color: #f4f8fc;
            border-radius: 2px;
            margin: 0 auto;
            margin-top: 15px;
            position: relative;
            overflow: hidden;
            .width500{
                width: 620px;
                overflow: hidden;
            }
            .clear{
                clear: both;
            }
            
            .item{
                width: 202px;
                overflow: hidden;
                font-size: 16px;
                float: left;
                margin-bottom: 24px;
                height: 22px;
                line-height: 22px;
                .left{
                    float: left;
                    width: 90px;
                }
                .width122{
                    width: 122px;
                }
                .width74{
                    width: 74px;
                }
                .right{
                    float: left;
                }
            }
            .width218{
                width: 260px;
                .eye{
                    margin-left: 10px;
                    position: relative;
                    top: -2px;
                    cursor: pointer;
                }
            }
            .ml78{
                margin-left: 148px;
            }
            .mb0{
                margin-bottom: 0;
            }
            .head{
                position: absolute;
                width: 120px;
                top: 21px;
                right: 60px;
                height: 120px;
                border-radius: 50%;
                overflow: hidden;
                img{
                    width: 100%;
                }
            }
        }
        .wrap1{
            .clear{
                clear: both;
            }
            .item{
                width: auto;
            }
            .detail{
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                color: #999999;
                margin-left: 10px;
                margin-top: 0.5px;
            }
            .floatR{
                float: right;
                margin-right: 152px;
            }
        }
    }
    .fixed{
        width: 860px;
    }
    .floatL{
        float: left;
    }
    .subBtn{
		height:57px;
		border-top:1px solid #ececec;
		margin-top:30px;
		div{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #4c8aff;
            margin: 15px auto;
		}
	}

}
	
</style>