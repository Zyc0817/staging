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
                        <img src="../../../assets/img/head@3x.svg" alt="" class="headPhoto" v-if="!avatar">
                        <img :src= avatar alt="" class="headPhoto" v-else>
                        <div class="basicinformation">
                            <div class="item1">姓名：<span>{{userName}}</span></div>
                            <div class="item2">性别：<span>{{gender | meal}}</span></div>
                            <div class="item3">年龄：<span>{{$base.age(age)}}岁</span></div>
                        </div>
                        <div class="certificateinformation">
                            <div class="item1">证件类型：<span>{{certificateType | chang}}</span></div>
                            <div class="item2" v-if="cover">证件号：<span>{{certificateId | coverType}}</span><img :src="picture_data.src" alt="" @click="changeType"></div>
                            <div class="item2" v-else>证件号：<span>{{certificateId}}</span><img :src="picture_data.src" alt="" @click="changeType"></div>                           
                        </div>
                    </div>
                    <div class="title">工作信息</div>
                    <div class="wrapContent1">
                        <div class="jobinformation">
                            <div class="mbt0">工作计划：<span>{{departmentName}}, &nbsp;{{postName}}, &nbsp;{{$base.timeplateTohm(startWorkTimes)}} - <span v-if="parseInt(endWorkTimes/(24*3600000))>0">次日</span>{{$base.timeplateTohm(endWorkTimes%(24*3600000))}}, &nbsp;{{agencyName}}</span><span style="font-size:12px;color:#999999;">详情</span></div>
                            <div class="item5">用工单号：<span>{{no}}</span></div>
                        </div>
                    </div>
                    <div v-if="category == 'punishment'">
                        <div class="title">惩罚</div>
                        <div class="punishmentproject">
                            <div class="tab">
                                <div class="punishment"><span>惩罚项目：</span><span>{{categoryName}}</span></div>
                                <div class="punishmentone"><div><span>惩罚金额：</span><span>{{amount | minusSign}}元</span></div></div>
                            </div>
                            <div class="tabone">
                                <div class="punishment"><span>图片：</span><span v-if="photoList.length==0" style="margin-left:79px;">无</span><img :src= photoUrl+i.filepath+i.filedate alt="" v-for="(i,k) in photoList" :key="k" v-else></div>
                                <div class="punishmentone"><div><span>惩罚日期：</span><span>{{$base.formattingTime(createTimes)}}</span></div></div>
                            </div>
                            <div class="tabTwo">
                                <div class="punishment"><span>惩罚原因：</span><span>{{remark}}</span></div>
                                <div class="doDate">操作日期：<span>{{$base.formattingTime(createTimes)}} {{$base.formattingHover(createTimes)}}</span></div>
                            </div>          
                        </div>
                    </div>
                    <div v-if="category == 'reward'">
                        <div class="title">奖励</div>
                        <div class="rewardprogram">
                            <div class="tab">
                                <div class="punishment"><span>奖励项目：</span><span>{{categoryName}}</span></div>
                                <div class="reward"><span>奖励金额：</span><span>{{amount | minusSign}}元</span></div>
                            </div>
                            <div class="tabone">
                                <div class="rewardOne"><span>图片：</span><span v-if="photoList.length==0" style="margin-left:79px;">无</span><img :src= photoUrl+i.filepath+i.filedate alt="" v-for="(i,k) in photoList" :key="k" v-else></div>
                                <div class="punishment"><div><span>奖励日期：</span><span>{{$base.formattingTime(createTimes)}}</span></div></div>
                            </div>
                            <div class="tabTwo">
                                <div class="punishment"><span>奖励原因：</span><span>{{remark}}</span></div>
                                <div class="doDate">操作日期：<span>{{$base.formattingTime(createTimes)}} {{$base.formattingHover(createTimes)}}</span></div>
                            </div>          
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
import _ from 'lodash'
export default {
    name: 'personalInformations',
    mixins: [mixin],
	data () {
		return {
            picture_data: {
                src: require('../../../assets/img/closeeye.svg')
            },
            photoUrl: 'https://company-test.lanniao.com/upload/',
            show: false, 
            cover: true,
            _timeOut: '',
            userName: '',
            gender: '',
            age: '',
            avatar: '',
            departmentName: '',
            phone: '',
            postName: '',
            certificateType: '',
            certificateId: '',
            startWorkTimes: '',
            endWorkTimes: '',
            agencyName: '',
            no: '',
            categoryName: '',
            amount: '',
            src: '',
            createTimes: '',
            remark: '',
            category: '',
            photoList: []
		}
	},
	mounted () {
        this.show = true
        this.init()
    },
    filters:{
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
                return val = -val/100
            }else{
                return val = val/100
            }
        },
        coverType(val) {
            if(val){
                return '**************' + val.substring(14,18)
            }else{
                return ''
            }
        }
    },
	methods: {
        changeType() {
            this.cover = !this.cover
            this.picture_data.src=this.picture_data.src == require('../../../assets/img/closeeye.svg')?require('../../../assets/img/openeye.svg'):require('../../../assets/img/closeeye.svg')
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('personalInformations')
			}, 200)
        },
        init() {
            this.$axios({
                method: 'post',
                url: this.$urls.message,
                data: {
                    workerId: this.$store.state.recruitmentPlan.id.workerId,
                    signId: this.$store.state.recruitmentPlan.id.signId,
                    orderId: this.$store.state.recruitmentPlan.id.orderId,
                    orderDetailId: this.$store.state.recruitmentPlan.id.orderDetailId,
                    performanceId: this.$store.state.recruitmentPlan.id.performanceId,
                    agencyId: parseInt(this.$store.state.recruitmentPlan.id.agencyId)
                }
            })
            .then(res => {
                // console.log(res)
                this.userName = _.get(res,'data.worker.name','')
                this.gender = _.get(res,'data.worker.gender','')
                this.age = _.get(res,'data.worker.birthday','')
                this.avatar = _.get(res,'data.worker.avatar','')
                this.certificateType = _.get(res,'data.worker.certType','')
                this.certificateId = _.get(res,'data.worker.certNo','')
                this.departmentName = _.get(res,'data.todayVo.departmentName','')
                this.postName = _.get(res,'data.todayVo.postName','')
                this.startWorkTimes = _.get(res,'data.todayVo.startDate','')
                this.endWorkTimes = _.get(res,'data.todayVo.endDate','')
                this.agencyName = _.get(res,'data.sign.agencyName','')
                this.no = _.get(res,'data.todayVo.no','')
                this.categoryName = _.get(res,'data.workerPerformanceManagerVo.performanceCategory.name','')
                this.amount = _.get(res,'data.workerPerformanceManagerVo.workerPerformance.amount','')
                this.createTimes = _.get(res,'data.workerPerformanceManagerVo.workerPerformance.createTime','0')
                this.remark = _.get(res,'data.workerPerformanceManagerVo.workerPerformance.remark','')
                this.category = _.get(res,'data.workerPerformanceManagerVo.performanceCategory.category','')
                this.photoList = _.get(res,'data.workerPerformanceManagerVo.attaches',[])
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
.panel{
    width:750px;
    height: 810px;
    overflow-y: scroll;
    .fixed{
        width: 710px;
    }
	.minH{
		min-height: calc(100% - 141px);
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
        margin-top: 15px;
        margin-left: 20px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        .headPhoto{
            width: 90px;
            height: 90px;
            position: absolute;
            top: 11px;
            left: 596px;
            border-radius: 100%;
        }
        .basicinformation{
            display: flex;
            margin-top: 24px;
            margin-left: 20px;
            margin-bottom: 21px;
            .item1,.item2,.item3{
                font-size: 14px;
                color: #444950;
            }
            .item1{
                span{ margin-left: 37.5px; }
            }
            .item2{
                margin-left: 93px;
                span{ margin-left: 25px; }
            }
            .item3{
                margin-left: 126px;
                span{ margin-left: 10px; }
            }
        }
        .certificateinformation{
            display: flex;
            position: relative;
            margin-left: 20px;
            margin-bottom: 24px;
            .item1,.item2{
                font-size: 14px;
                color: #444950;
            }
            .item1{
                span{ margin-left: 10px; }
            }
            .item2{ position: absolute;
                top: 0;
                left: 215px;
                span{ margin-left: 10px; }
                img{
                    width: 14px;
                    height: 12px;
                    margin-left: 10px;
                    cursor: pointer;
                }
            } 
        }
    }
    .wrapContent1{
        width: 710px;
        background-color: #f4f8fc;
        border-radius: 2px;
        margin-top: 15px;
        margin-left: 20px;
        font-size: 14px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        .jobinformation{
            margin-top: 24px;
            margin-left: 20px; 
            .mbt0{
                margin-bottom: 21px;
                span{
                    margin-left: 10px;
                }
            } 
            .item5{
                margin-bottom: 24px;
                span{
                    margin-left: 10px;
                }
            }
        }
        
    }
    .punishmentproject{
        width: 710px;
        height: 240px;
        background-color: #f4f8fc;
        border-radius: 2px;
        margin-top: 15px;
        margin-left: 20px;
        box-sizing: border-box;
        // overflow: hidden;
        .tab{
            width: 100%;
            display: flex;
            justify-content: space-between;
            height: 40px;
            margin-left: -35px;
            .punishment{
                text-align: center;
                height: 100%;
                line-height: 38px;
                color: #444950;
                font-size: 14px;
                box-sizing: border-box;
                margin-top: 14px;
                margin-left: 60px;   
                span:nth-child(2){
                    margin-left: 10px;
                }     
            }
            .punishmentone{
                width: 120px;
                text-align: center;
                height: 100%;
                line-height: 38px;
                color: #444950;
                font-size: 14px;
                box-sizing: border-box;
                margin-top: 14px;
                div{
                    margin-left: -272px; 
                    span:nth-child(2){
                        margin-left: 10px;
                    }
                }
            }
        }
        .tabone{
            width: 100%;
            display: flex;
            justify-content: space-between;
            height: 40px;
            margin-left: 29px;
            margin-top: 24px;
            .punishment{
                width: 280px;
                // background: #ddd;
                font-size: 14px;
                color: #444950;
                margin-right: 41px;
                position: relative;
                span{
                    position: absolute;
                    top: 0;
                    left: 0;
                    // float: left;
                    // margin-left: -3px;
                }
                img{
                    margin-left: 75px;
                    margin-bottom: 124px;
                    width: 60px;
                    height: 60px;
                    // border: 1px solid #ccc;
                }
                img:nth-of-type(2){
                    margin-left: 10px;
                }
            }
            .punishmentone{
                width: 194px;
                font-size: 14px;
                color: #444950;
                margin-right: 123px;
                div{
                    span:nth-child(1){
                        margin-left: -5px;
                    }
                    span:nth-child(2){
                        margin-left: 10px;
                    }
                }
            }
        }
        .tabTwo{
            width: 100%;
            // display: flex;
            // justify-content: space-between;
            height: 40px;
            margin-left: 29px;
            margin-top: 48px;
            .punishment{
                font-size: 14px;
                color: #444950;
                span:nth-child(2){
                    margin-left: 10px;
                }
            }
            .doDate{
                margin-top: 24px;
                font-size: 14px;
                color: #444950;
                span:nth-child(1){
                    margin-left: 10px;
                }
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
    .rewardprogram{
        width: 710px;
        height: 240px;
        background-color: #f4f8fc;
        border-radius: 2px;
        margin-top: 15px;
        margin-left: 20px;
        box-sizing: border-box;
        // overflow: hidden;
        .tab{
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            .punishment{
                text-align: center;
                color: #444950;
                font-size: 14px;
                margin-left: 25px;
                margin-top:24px;
                box-sizing: border-box;
                span:nth-child(2){
                    margin-left: 10px;
                }     
            }
            .reward{
                position: relative;
                width: 135px;
                text-align: center;
                color: #444950;
                font-size: 14px;
                margin-top:24px;
                margin-right: 182px;
                box-sizing: border-box;
                    span:nth-child(2){
                        position: absolute;
                        top: 0;
                        right: -22px;
                    }
            }
        }
        .tabone{
            width: 100%;
            display: flex;
            justify-content: space-between;
            height: 40px;
            margin-left: 29px;
            margin-top: 24px;
            .rewardOne{
                width: 280px;
                margin-right: 33px;
                margin-top: 6px;
                font-size: 14px;
                color: #444950;
                position: relative;
                // background: #ddd;
                span{
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                img{
                    margin-left: 75px;
                    margin-bottom: 124px;
                    width: 60px;
                    height: 60px;
                    border: 1px solid #ccc;
                }
                img:nth-of-type(2){
                    margin-left: 10px;
                    
                }
            }
            .punishment{
                // width: 194px;
                font-size: 14px;
                color: #444950;
                margin-right: 163px;
                div{
                    span:nth-child(2){
                        margin-left: 10px;
                    }
                }
            }
        }
        .tabTwo{
            width: 100%;
            // display: flex;
            // justify-content: space-between;
            height: 40px;
            margin-left: 29px;
            margin-top: 48px;
            .punishment{
                font-size: 14px;
                color: #444950;
                span:nth-child(2){
                    margin-left: 10px;
                }
            }
            .doDate{
                margin-top: 24px;
                font-size: 14px;
                color: #444950;
                span:nth-child(1){
                    margin-left: 10px;
                }
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
    .subBtn{
		height:57px;
		border-top:1px solid #ececec;
		margin-top:15px;
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