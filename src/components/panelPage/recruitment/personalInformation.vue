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
                <div class="minH">
                    <div class="title">基本信息</div>
                    <div class="wrapContent">
                        <div class="item1">姓名：<span>{{userName}}</span></div>
                        <div class="item2">性别：<span>{{gender | meal}}</span></div>
                        <div class="item3">年龄：<span>{{$base.age(age)}}岁</span></div>
                        <div class="item1">身高：<span>{{height}}cm</span></div>
                        <div class="item2">手机号：<span>{{phone}}</span></div>
                        <div class="item1">QQ号：<span>{{qq}}</span></div>
                        <div class="item2">微信号：<span>{{microLetter}}</span></div>
                        <div class="item1 mbt0">证件类型：<span>{{certificateType | chang}}</span></div>
                        <div class="item2 mbt0">证件号：<span>{{certificateId}}</span></div>
                    </div>
                    <div class="title">工作信息</div>
                    <div class="wrapContent height">
                        <img class="state" v-if="isReject=='N'" src="../../../assets/img/arrange.png" alt="">
                        <img class="state" v-if="isReject=='Y'" src="../../../assets/img/back.png" alt="">
                        <div class="item4 mbt0">工作次数：<span>{{workTimes}}次</span></div>
                        <div class="item4 mbt0">累计工时：<span>{{allWorkDuration/3600000}}小时</span></div>
                        <div class="item4 mbt0">本月工时：<span>{{monthWorkDuration/3600000}}小时</span></div>
                    </div>
                    <div v-if="workerCertListOne.length != 0">
                        <div class="title">从业资格证信息</div>
                        <div class="certificateWrap">
                            <div class="tab">
                                <div :class="{'select':certificateCheck}" @click="certificateCheck=true">{{health}}</div>
                                <div :class="{'select':!certificateCheck}" @click="certificateCheck=false">{{cooker}}</div>
                            </div>
                            <div v-for="i in workerCertListOne" :key="i.value">
                                <div class="certificateContent" v-if="certificateCheck&&i.certName=='健康证'">
                                    <div class="left">
                                        <div class="item">证号：<span>{{i.certNo}}</span></div>
                                        <div class="item">有效期：<span>{{$base.formattingTime(i.certStartDate)}}—{{$base.formattingTime(i.certEndDate)}}</span></div>
                                        <div class="item">发证机关：<span>{{i.certOrg}}</span></div>
                                    </div>
                                </div>
                                <div v-else-if="!certificateCheck&&i.certName=='厨师证'" class="certificateContent">
                                    <div class="left">
                                        <div class="item">证号：<span>{{i.certNo}}</span></div>
                                        <div class="item">有效期：<span>{{$base.formattingTime(i.certStartDate)}}—{{$base.formattingTime(i.certEndDate)}}</span></div>
                                        <div class="item">发证机关：<span>{{i.certOrg}}</span></div>
                                    </div>
                                </div>       
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
export default {
    name: 'personalInformation',
    mixins: [mixin],
	data () {
		return {
			show: false, 
            _timeOut: '',
            certificateCheck: true,
            userName: '',
            gender: '',
            age: '',
            height: '',
            phone: '',
            qq: '',
            microLetter: '',
            certificateType: '',
            certificateId: '',
            workTimes: '',
            allWorkDuration: '',
            monthWorkDuration: '',
            health: '',
            cooker: '',
            workerCertListOne: [],
            information: [],
            isReject: ''
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
                return "身份证"
            }else if(id == 'passport'){
                return "护照"
            }else if(id == 'home-card'){
                return '回乡证'
            }else if(id == 'tw-card'){
                return '台胞证'
            }
        }
    },
	methods: {
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('personalInformation')
			}, 200)
        },
        init() {
            this.$axios({
                method: 'get',
                url: this.$urls.clickUsername,
                params: {'userId':this.$store.state.recruitment.props.id}
            })
            .then(res => {
                console.log(res)
                let obj = res.data.content
                this.userName = obj.name
                this.gender = obj.gender
                this.age = obj.birthday
                this.height = obj.height
                this.phone = obj.phone
                this.qq = obj.qq
                this.microLetter = obj.wechat
                this.certificateType = obj.certType
                this.certificateId = obj.certNo
                this.workTimes = obj.workTimes
                this.allWorkDuration = obj.allWorkDuration
                this.monthWorkDuration = obj.monthWorkDuration
                this.information = obj.workTodayVos
                this.health = obj.workerCertList[0].certName
                this.cooker = obj.workerCertList[1].certName
                this.workerCertListOne = obj.workerCertList
                this.isReject = obj.isReject
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
        padding: 15px 20px 0;
    }
    .wrapContent{
        width: 710px;
        margin: 0 auto;
        background-color: #f4f8fc;
        border-radius: 2px;
        padding: 24px;
        margin-top: 15px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        .state{
            width: 120px;
            position: absolute;
            bottom: 40px;
            right: 0;
        }
        .item1,.item2,.item3{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-bottom: 24px;
            span{
                margin-left: 10px;
            }
            .detail{
                font-size: 12px;
                color: #999999;
            }
        }   
        .mbt0{
            margin-bottom: 0;
        } 
        .item3{
            width: 120px;
        }
        .item4{
            float: left;
            font-size: 14px;
            color: #444950;
            span{
                margin-left: 10px;
            }
        }
        .item4:nth-of-type(2) {
            margin: 0 120px;
        }
        .width100{
            width: 100%;
        }
    }
    .height{
        height: 68px;
        overflow: visible
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