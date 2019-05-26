<template>
	<div class="panelWrap">
		<div class="fd"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">岗位详情</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="minH">
                    <div class="title">岗位描述</div>
                    <div class="wrapContent mt20">
                        <div class="item">
                            <div class="left">岗位：<span>服务员</span></div>
                            <div class="right">用工部门：<span>宴会部</span></div>
                        </div>
                        <div class="item">
                            <div class="left">用工日期：<span>2018/10/01 至 2018/10/03，共3天</span></div>
                            <div class="right">工作时间：<span>09:00 - 18：00</span></div>
                        </div>
                        <div class="item">
                            <div class="left">用餐：<span>包午餐、晚餐</span></div>
                            <div class="right">培/休时间：<span>30分钟</span></div>
                        </div>
                        <div class="item">
                            <div class="left">用工单号：<span>WO0118091101</span></div>
                            <div class="right">申请总人数：<span>15人</span></div>
                        </div>
                        <div class="item">
                            <div class="reason">申请事由：<span>桌婚宴，每桌10人，共计100人，需加派服务员</span></div>
                        </div>
                    </div>
                    <div class="title">招聘渠道</div>
                    <div class="wrapContent mt14">
                        <div class="wrap">
                            <div class="item1">招聘渠道：<span>劳务派遣</span></div>
                            <div class="item1 center">招聘者：<span>杭州集合劳务有限公司</span></div>
                            <div class="item1">工资：<span>15元/小时</span></div>
                            <div class="item1">招聘人数：<span>共10人</span>
                                <div class="manAndWomen">
                                    <div>男员工 5 名，年龄 20-35岁，身高 175-180cm；</div>
                                    <div>女员工 5 名，年龄 18-35岁，身高 170-175cm；</div>
                                </div>
                            </div>
                        </div>
                        <div class="item2">
                            <div class="item2">人员要求：</div>
                            <div class="tag">无纹身染发</div>
                            <div class="tag">女士淡妆</div>
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
		}
	},
	mounted () {
		this.show = true
	},
	methods: {
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('positionDetails')
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
.panel{
    width:750px;
    overflow-y: scroll;
    .fixed{
        width: 710px;
    }
    .minH{
		min-height: calc(100% - 167px);
    }    
	.title{
        height: 22px;
        line-height: 22px;
        font-size: 16px;
        color: #666666;
        padding: 30px 20px 0;
    }
    .subBtn{
		height:71px;
		border-top:1px solid #ececec;
		margin-top:30px;
		div{
			width: 80px;
			height: 25px;
			border-radius: 14.5px;
			text-align:center;
			line-height:25px;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #4c8aff;
            margin: 22px auto;
		}
	}
    .wrapContent{
        width: 710px;
        margin: 0 auto;
        background-color: #f4f8fc;
        border-radius: 2px;
        padding: 30px;
        box-sizing: border-box;
        overflow: hidden;
        .item1{
            margin-bottom: 30px;
            font-size: 14px;
            color: #444950;
            float: left;
            span{
                margin-left: 10px;
            }
            .manAndWomen{
                display: inline-block;
                vertical-align:top;
                margin-left: 10px;
            }
        }
        .wrap{
            overflow: hidden;
        }
        .item2{
            font-size: 14px;
            color: #444950;
            height: 27px;
            line-height: 27px;
            float: left;
            .tag{
                height: 25px;
                line-height: 25px;
                border: 1px solid #4c8aff;
                float: left;
                margin: 0 10px;
                padding: 0 10px;
                font-size: 12px;
                color: #4c8aff;
                background-color: #ffffff;
            }
        }
        .center{
            margin: 0 80px;
        }
        .item{
            overflow: hidden;
            .left,.right{
                float: left;
                font-size: 14px;
                color: #444950;
                height: 22px;
                line-height: 22px;
                margin-bottom: 30px;
                span{
                    margin-left: 10px;
                }
            }
            .left{
                width: 420px;
            }
            .reason{
                font-size: 14px;
                color: #444950;
                span{
                    margin-left: 10px;
                }
            }
        }
    }
    .mt20{
        margin-top: 20px;
    }
    .mt14{
        margin-top: 14px;
    }
    .width100{
        width: 100%;
    }
}
	
</style>