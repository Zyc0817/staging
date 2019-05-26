<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">查看合同</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div class="minH">
                    <div class="title">合同概况</div>
                    <div class="informationWrap">
                        <div class="floatL">
                            <div class="left">合同名称：</div>
                            <div class="right">{{contractName}}</div>
                        </div>
                        <div class="floatL ml217">
                            <div class="left">合同期限：</div>
                            <div class="right">{{$base.formattingTime(startTime)}} 至 {{$base.formattingTime(endTime)}}</div>
                        </div>
                        <div class="clear"></div>
                        <div class="floatL mt24">
                            <div class="left">附件：</div>
                            <div class="right">
                                <div v-for="(i,k) in fileList" :key="k" :class="{'mt24':k!=fileList.length-1}">{{i}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="title">计费标准</div>
                    <div class="informationWrap">
                        <div class="floatL">
                            <div class="left">计费模式：</div>
                            <div class="right">{{salaryRule}}</div>
                        </div>
                        <div class="clear"></div>
                        <div class="tableWrap mt24">
                            <table border="1" cellspacing="0" cellpadding="0">
                                <tr>
                                    <th width="177">
                                        <div class="out"></div>
                                        <b>岗位</b>
                                        <em>费用</em>
                                    </th>
                                    <th width="177">白班</th>
                                    <th width="177">夜班</th>
                                    <th width="177">节假日白班</th>
                                    <th width="177">节假日夜班</th>
                                </tr>
                                <tr v-for="(i,k) in contractList" :key="k">
                                    <td>{{i.postName}}</td>
                                    <td>{{i.dayshift/100}}元/小时</td>
                                    <td>{{i.nightshift/100}}元/小时</td>
                                    <td>{{i.holidayDayshift/100}}元/小时</td>
                                    <td>{{i.holidayNightshift/100}}元/小时</td>            
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="title">补贴</div>
                    <div class="informationWrap">
                        <div class="floatL">
                            <div class="left">补贴类型：</div>
                            <div class="right">{{category}}</div>
                        </div>
                        <div class="clear"></div>
                        <div class="floatL mt24">
                            <div class="left">补贴规则：</div>
                            <div class="right">当上班时间早于 {{beforeTime}} ，或下班时间晚于 {{afterTime}} ，且工时大于等于 {{duration}} 小时，补贴金额 {{amount}} 元</div>
                        </div>
                    </div>
                </div>
                <div class="btn">
					<div @click="cancel">关闭</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'contractDetail',
	mixins: [mixin],
	data () {
		return {
			show: false, 
            _timeOut: '',
            contractList: [],
            contractName: '',
            startTime: '',
            endTime: '',
            fileList: [],
            salaryRule: '',
            afterTime: '',
            beforeTime: '',
            amount: '',
            duration: '',
            category: '',
		}
    },
    created() {
        this.init()
    },
	mounted () {
		this.show = true
	},
	methods: {
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('contractDetail')
			}, 200)
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.getContract,
                params:{
                    contractId: this.$store.state.systemSettings.states.id
                }
            })
            .then(res=>{      
                this.contractName = res.data.contract.contractName
                this.startTime = res.data.contract.startTime
                this.endTime = res.data.contract.endTime
                this.contractList = res.data.salaryRuleVos
                if(res.data.allowanceRule.category=='traffic'){
                    this.category = '车补'
                }
                this.fileList = res.data.contractAttachVos.map(i=>i.filename)
                this.afterTime = this.$base.timeplateTohm(res.data.allowanceRule.afterTime)
                this.beforeTime = this.$base.timeplateTohm(res.data.allowanceRule.beforeTime)
                this.duration = parseInt(res.data.allowanceRule.duration/(1000*60*60))
                this.amount = res.data.allowanceRule.amount/100
                if(res.data.contract.salaryRule=='step'){
                    this.salaryRule = '阶梯时薪制'
                }else{
                    this.salaryRule = '标准时薪制'
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
.panel{
    width:940px;
    overflow-y: scroll;
	.fixed{
        width: 900px; 
    }
    .btn{
		height:57px;
		border-top:1px solid #ececec;
		cursor:pointer;
		div{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			background-color: #fff;
			border-radius: 14.5px;
			color:#4c8aff;
			font-size: 12px;
			text-align:center;
			margin:15px auto;
			border:1px solid #4c8aff;
		}
	}
    .minH{
        min-height: calc(100% - 126px);
        .title{
            margin:15px 0 0 20px;
            font-size: 14px;
            font-weight: bold;
            color: #666666;
        }
        .informationWrap{
            width: 900px;
            margin: 0 auto;
            padding: 24px;
            margin-top: 15px;
            background-color: #f4f8fc;
            border-radius: 2px;
            box-sizing: border-box;    
            overflow: hidden;
            .floatL{
                float: left;
                overflow: hidden;
                .left,.right{
                    float: left;
                    font-size: 14px;
                    min-height: 20px;
                }
                .left{
                    width: 80px;
                }
            }
            .ml217{
                margin-left: 217px;
            }
            .mt24{
                margin-top: 24px;
            }
            .clear{
                clear: both;
            }
            .tableWrap{
                width: 852px;
                background-color: #ffffff;
                table{
                    width: 100%;
                    height: 100%;
                    tr{
                        height: 50px;
                    }
                    th{
                        font-size: 14px;
                        color: #444950;
                        font-weight: normal;
                        position: relative;
                        .out{
                            content: "";
                            position: absolute;
                            width: 1px;
                            height:173px;/*这里需要自己调整，根据td的宽度和高度*/
                            top:0;
                            left:0;
                            background-color: #ececec;
                            display: block;
                            transform: rotate(-74deg);/*这里需要自己调整，根据线的位置*/
                            transform-origin: top;
                        }
                        b{font-style:normal;display:block;position:absolute;top:20px;left:10px;width:35px;font-weight: normal;}
                        em{font-style:normal;display:block;position:absolute;top:10px;right:10px;width:55x;}
                    }
                    td{
                        text-align: center;
                        font-size: 14px;
                        color: #444950;
                    }
                }
                table,table tr th, table tr td{
                    border:1px solid #ececec; 
                }
            }
        }
    }
}
	
</style>