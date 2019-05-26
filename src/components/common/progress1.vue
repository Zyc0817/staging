<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt" v-if="$store.state.recruitmentPlan.approval.title==1">审批进度</div>
                        <div class="txt" v-if="$store.state.recruitmentPlan.approval.title==2">调整记录</div>
                        <div class="txt" v-if="$store.state.recruitmentPlan.approval.title==3">查看复核</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div class="minH">
                    <div class="item item1" v-for="(i,k) in dataList" :key="k+'1'">
                        <div class="div1 approve">
                            <div></div>
                        </div>
                        <div class="div2">
                            <el-tooltip 
                                effect="light"  
                                placement="bottom-start">
                                <div style="max-width:200px" slot="content">{{title(i.makerName)}}</div>
                                <p class="p1">{{i.makerName}}（{{i.makerTitle}}）</p>      
                            </el-tooltip>   
                            <p class="p2">
                                <span v-if="i.state!='pending'">{{$base.formattingTime(i.createTime)}}</span>
                                <span v-if="i.state!='pending'">{{$base.formattingHover(i.createTime)}}</span>
                            </p>
                            <p class="p3">原因：{{i.comments}}</p>
        
                        </div>
                        <div class="div3" v-if="dataList.length-1!=k"></div>
                        <div class="clear"></div>
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
import mixin from '../../assets/js/mixin/mixin'
export default {
	name: 'approvals',
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
            dataList: [],
		}
    },
    filters:{
        txtLimit(val) {
            return val
            if(val.length>25) {
                return val.substring(0,25)+'...'
            }else{
                return val
            }
        }
    },
	created() {
        this.init()
	},
	mounted () {
		this.show = true
	},
	methods: {
        title(nodePosts) {
            return nodePosts
            let str = ''
            nodePosts.forEach(i=>{
                i.users.forEach((j,k)=>{
                    if(k!=i.users.length-1) {
                        str+=`${j.name} (${i.postName}) / `
                    }else{
                        str+=`${j.name} (${i.postName})`
                    }         
                })
            })
            return str
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
                if(this.$store.state.recruitmentPlan.approval.type=="in"){
                    this.$store.dispatch('progress1in')
                }
			}, 200)
		},
        init() {
            let data = this.$store.state.recruitmentPlan.approval.data
            this.$axios({
                method: 'get',
                url:this.$urls.getBillOrderTag,
                params: {
                    billOrderId:data.billOrderId,
                    workBillId:data.id
                }
            })
            .then(res=>{
                if(res.data.length){
                    this.dataList = res.data
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
@import '../../assets/css/panelPage.less';
.panel{
	width:400px;
	overflow-y:scroll;
	.fixed{
		width: 360px;
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
        padding: 20px;
        min-height:calc(100% - 150px);
        .item{
            position: relative;
            margin-bottom: 22px;
            .div1{
                width: 14px;
                height: 14px;
                background-color: rgba(212, 212, 212, 0.5);
                border-radius: 50%;
                float: left;
                margin-top: 8px;
                div{
                    width: 8px;
                    height: 8px;
                    background-color: #d4d4d4;
                    border-radius: 50%;
                    margin: 3px;
                }
            }
            .approve{
                background-color: rgba(76, 138, 255, 0.5);
                div{
                    background-color: #4c8aff;
                }
            }
            .reject{
                background-color: rgba(228, 90, 60, 0.5);
                div{
                    background-color: #e45a3c;
                }
            }
            .div2{
                width: 336px;
                height: 62px;
                background: url("../../assets/img/approve1.png") no-repeat;
                background-size: 100% 100%;
                border-radius: 2.3px;
                float: left;
                margin-left: 10px;
                overflow-y: scroll;
                box-sizing: border-box;
                padding: 10px 15px 10px 21px;
                .p1{
                    font-size: 14px;
                    color: #444950;
                }
                .p2{
                    font-size: 12px;
                    color: #999999;
                    margin-top: 5px;
                    span{
                        display: inline-block;
                        height: 17px;
                        line-height: 17px;
                        margin-right: 7px;
                    }
                    .color{
                        color: #4c8aff;
                    }
                }
                .p3{
                    font-size: 12px;
                    color: #666666;
                    margin-top: 5px;
                }
                .p4{
                    font-size: 12px;
					color: #666666;
					margin-top:5px;
					.span1{
						display:inline-block;
						background: url('../../assets/img/logo.png') no-repeat -242px -102px;
						width: 13px;
						height: 10px;
						margin:0 10px;
					}
                }
                .p5{
                    font-size: 12px;
                    color: #666666;
                    margin-top: 5px;
                }
            }
            .div2::-webkit-scrollbar {
                display:none;
            }
            .div3{
                position: absolute;
                height: calc(100% - 2px);
                width: 0px;
                border-left: 1px dashed #d4d4d4;
                left: 7px;
                top: 27px;
            }
            .clear{
                clear: both;
            }
        }
        .item1{
            .div2{
                height: 102px;
                background: url("../../assets/img/approve2.png") no-repeat;
                background-size: 100% 100%;
            }
        }
        
		
	}
	
}
	
</style>