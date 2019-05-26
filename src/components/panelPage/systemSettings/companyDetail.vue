<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">查看招聘者</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div style="height:50px;" v-if="fixed"></div>
                <div class="minH">
                    <div class="title">基本信息</div>
                    <div class="informationWrap">
                        <div class="mb24">
                            <div class="item">
                                <div class="left">招聘渠道：</div>
                                <div class="right">{{channelName}}</div>
                            </div>
                            <div class="item ml">
                                <div class="left">招聘者：</div>
                                <div class="right">{{agencyName}}</div>
                            </div>
                        </div>
                        <div class="mb24">
                            <div class="item">
                                <div class="left">联系人：</div>
                                <div class="right">{{linkman}}</div>
                            </div>
                            <div class="item ml">
                                <div class="left">联系电话：</div>
                                <div class="right">{{phone}}</div>
                            </div>
                        </div>
                        <div class="mb24">
                            <div class="item">
                                <div class="left">状态：</div>
                                <span v-if="state=='enable'">启用</span>
                                <span v-else>停用</span>
                            </div>
                        </div>
                        <div class="tableWrap mb24">
                            <table border="1" cellspacing="0" cellpadding="0">
                                <tr>
                                    <th width="177">标准时薪制</th>
                                    <th width="177">白班</th>
                                    <th width="177">夜班</th>
                                    <th width="177">节假日白班</th>
                                    <th width="177">节假日夜班</th>
                                    <th width="177">状态</th>
                                </tr>
                                <tr v-for="(i,k) in contractList" :key="k">
                                    <td>{{i.postName}}</td>
                                    <td>{{i.dayshift/100}}元/小时</td>
                                    <td>{{i.nightshift/100}}元/小时</td>
                                    <td>{{i.holidayDayshift/100}}元/小时</td>
                                    <td>{{i.holidayNightshift/100}}元/小时</td>
                                    <td v-if="i.state=='enable'">生效中</td>
                                    <td v-else>已失效</td>
                                </tr>
                            </table>
                        </div>
                        <div class="item">
                            <div class="left">补贴类型：</div>
                            <span>车补
                                <label>（当上班时间早于 {{beforeTime}} ，或下班时间晚于 {{afterTime}} ，且工时大于等于 {{duration}} 小时，补贴金额 {{amount}} 元）</label>
                            </span>
                        </div>
                    </div>
                    <div class="title">合同管理</div>
                    <div class="information1">
                        <Table :data-list="dataList"></Table>
                    </div>
                </div>
                <div class="btnWrap">
                    <div class="sub1" @click="edit">编辑</div>
                    <div class="sub3" @click="cancel">返回</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import Table from '../../table/systemSettings/contract'
import mixin from '../../../assets/js/mixin/mixin'
export default {
    name: 'companyDetail',
    props: ['editPage'],
    mixins: [mixin],
	data () {
		return {
			show: false, 
            _timeOut: '',
            channelName: '',
            linkman: '',
            phone: '',
            state: '',
            contractList: [],
            dataList: [],
            agencyName: '',
            afterTime: '',
            beforeTime: '',
            duration: '',
            amount: '',
		}
    },
    created() {
        this.init()
    },  
	mounted () {
		this.show = true
	},
	methods: {
        edit() {
            let id = this.$store.state.systemSettings.states.id
            this.cancel()
            this.editPage(id)
            
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.getContractAgency,
                params:{agencyId:this.$store.state.systemSettings.states.id}
            })
            .then(res=>{      
                this.channelName = res.data[0].channelName
                this.linkman = res.data[0].linkman
                this.phone = res.data[0].phone
                this.state = res.data[0].state
                this.agencyName = res.data[0].agencyName
                this.contractList = res.data[1]
                this.getContracts(res.data[0].agencyId)
                this.afterTime = this.$base.timeplateTohm(res.data[2].afterTime)
                this.beforeTime = this.$base.timeplateTohm(res.data[2].beforeTime)
                this.duration = parseInt(res.data[2].duration/(1000*60*60))
                this.amount = res.data[2].amount/100
            })
            .catch(e=>{
                
            })
        },
        getContracts(agencyId) {
            this.$axios({
                method: 'get',
                url:this.$urls.getContracts,
                params:{agencyId}
            })
            .then(res=>{
                this.dataList = res.data 
            })
            .catch(e=>{

            })	
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('companyDetail')
			}, 200)
		},
		
	},
	destroyed() {
		clearTimeout(this._timeOut)
    },
    components:{
        Table
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
    width:1140px;
    overflow-y: scroll;
    .fixed{
        width: 1100px;
    }
    .minH{
        min-height: calc(100% - 156px);
        border-bottom: 1px solid #ececec;
        padding-bottom: 30px;
    }
    .btnWrap{
        width: 220px;
        height: 57px;
        margin: 0 auto;
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
			margin-left: 60px;
			border:1px solid #4c8aff;
            cursor:pointer;
            margin-top: 15px;
        }
        .sub1{
            margin-left: 0;     
        }
        .disable{
            background-color: #e45a3c;
            border: 1px solid #e45a3c;
        }
        .sub3{
            background-color: #fff;
            color: #4c8aff;
        }
    }
	.title{
        margin:15px 0 0 20px;
        font-size: 14px;
        color: #666666;
        font-weight: bold;
    }
    .information1{
        width: 1100px;
        margin: 0 auto;
        margin-top: 15px;
        background-color: #f4f8fc;
        padding: 0 4px 24px 4px;
    }
    .informationWrap{
        width: 1100px;
        margin: 0 auto;
        padding: 24px;
        margin-top: 15px;
        background-color: #f4f8fc;
        border-radius: 2px;
        box-sizing: border-box;    
        overflow: hidden;
        .item{
            font-size: 14px;
            color: #444950;
            min-width: 136px;
            float: left;
            overflow: hidden;
            .right{
                margin-left: 10px;
                color: #444950;
                float: left;
                height: 20px;
                line-height: 20px;
                label{
                    font-size: 12px;
                    color: #444950;
                }
            }
            .left{
                height: 20px;
                line-height: 20px;
                float: left;
                width: 70px;
            }
        }
        .ml{
            width: auto;
            margin-left: 484px;
        }
        .mb24{
            overflow: hidden;
            margin-bottom: 24px;
        }
        .tableWrap{
            width: 1052px;
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
	
</style>