<template>
	<div class="panelWrap">
		<div class="fd"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">查看招聘者</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="minH">
                    <div class="title">基本信息</div>
                    <div class="informationWrap">
                        <div class="mb24">
                            <div class="item">
                                <div class="left">招聘渠道：</div>
                                <span>劳务派遣</span>
                            </div>
                            <div class="item ml">
                                <div class="left">招聘者：</div>
                                <span>杭州新新人力有限公司</span>
                            </div>
                        </div>
                        <div class="mb24">
                            <div class="item">
                                <div class="left">联系人：</div>
                                <span>张楚</span>
                            </div>
                            <div class="item ml">
                                <div class="left">联系电话：</div>
                                <span>150-8870-5033</span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="left">状态：</div>
                            <span>启用</span>
                        </div>
                    </div>
                    <div class="title">计费标准</div>
                    <div class="informationWrap">
                        <div class="titleTxt mb24">计费模式：<span>标准时薪制</span></div>
                        <div class="tableWrap">
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
                                    <th width="177">生效日期</th>
                                </tr>
                                <tr>
                                    <td>PA技工</td>
                                    <td>16元/小时</td> 
                                    <td>18元/小时</td>
                                    <td>32元/小时</td>
                                    <td>35元/小时</td>
                                    <td>2018/01/01</td>
                                </tr>
                                <tr>
                                    <td>PA技工</td>
                                    <td>16元/小时</td> 
                                    <td>18元/小时</td>
                                    <td>32元/小时</td>
                                    <td>35元/小时</td>
                                    <td>2018/01/01</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="title">补贴</div>
                    <div class="informationWrap">
                        <div class="mb24">
                            <div class="item">
                                <div class="left">补贴类型：</div>
                                <span>车补</span>
                            </div>
                        </div>
                        <div class="item">
                            <div class="left">补贴规则：</div>
                            <span>当上班时间早于 6:00 ，或下班时间晚于 22:00 ，且工时大于等于10小时，补贴金额 20 元</span>
                        </div>
                    </div>
                </div>	
                <div class="btnWrap">
                    <div class="sub1 enable">启用</div>
                    <div class="sub2">编辑</div>
                    <div class="sub3" @click="cancel">返回</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	name: 'parttimeDetail',
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
				this.$store.dispatch('parttimeDetail')
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
	width:1140px;
	.minH{
        min-height: calc(100% - 156px);
        border-bottom: 1px solid #ececec;
        padding-bottom: 30px;
        .title{
            margin:15px 0 0 20px;
            font-size: 14px;
            color: #666666;
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
                span{
                    margin-left: 10px;
                    color: #444950;
                    label{
                        font-size: 12px;
                        color: #444950;
                    }
                }
                .left{
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
                    th{
                        font-size: 14px;
                        color: #444950;
                        font-weight: normal;
                        position: relative;
                        .out{
                            content: "";
                            position: absolute;
                            width: 1px;
                            height:178px;/*这里需要自己调整，根据td的宽度和高度*/
                            top:0;
                            left:0;
                            background-color: #ececec;
                            display: block;
                            transform: rotate(-74.5deg);/*这里需要自己调整，根据线的位置*/
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
                    tr{
                        height: 50px;
                    }
                }
                table,table tr th, table tr td{
                    border:1px solid #ececec; 
                }
            }
            .titleTxt{
                font-size: 14px;
                color: #444950;
                span{
                    margin-left: 10px;
                }
            }
        }
    }
    .btnWrap{
        width: 360px;
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
        .enable{
            background-color: #4c8aff;
            border:1px solid #4c8aff;
        }
        .sub3{
            background-color: #fff;
            color: #4c8aff;
        }
    }
}
	
</style>