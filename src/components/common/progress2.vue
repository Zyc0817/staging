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
                    
                    <div class="item" v-for="(i,k) in dataList2" :key="k+'3'" :class="{'item1':i.state=='reject'}">
                        <div class="div1" :class="{'approve':i.state&&(i.state=='pending'||i.state=='pass'||i.state=='creator'),'reject':i.state&&i.state=='reject'}">
                            <div></div>
                        </div>
                        <div class="div2">
                            <el-tooltip 
                                effect="light"   
                                placement="bottom-start">
                                <div style="max-width:200px" slot="content">{{i.approverName+' ('+i.approverTitle+')'}}</div>
                                <p class="p1">{{i.approverName}} ({{i.approverTitle}})</p>      
                            </el-tooltip>   
                            <p class="p2">
                                <span v-if="$store.state.recruitmentPlan.approval.title==1&&i.state=='creator'">发起申请</span>
                                <span v-if="$store.state.recruitmentPlan.approval.title==1&&i.state=='pass'">审批通过</span>
                                <span v-if="$store.state.recruitmentPlan.approval.title==1&&i.state=='reject'">审批退回</span>
                                <span class="color" v-if="$store.state.recruitmentPlan.approval.title==1&&i.state=='pending'">审批中</span>
                                <span v-if="$store.state.recruitmentPlan.approval.title==1&&i.state=='cancel'">已撤销</span>
                                <span v-if="i.state!='pending'">{{$base.formattingTime(i.createTime)}}</span>
                                <span v-if="i.state!='pending'">{{$base.formattingHover(i.createTime)}}</span>
                            </p>
                            <p class="p3" v-if="$store.state.recruitmentPlan.approval.title==1&&i.state=='reject'">退回原因：<span>{{i.comments}}</span></p>
                        </div>
                        <div class="div3" v-if="(dataList1&&dataList1.length)||dataList2.length-1!=k"></div>
                        <div class="clear"></div>
                    </div>
                    <div class="item" v-for="(i,k) in dataList1" :key="k+'2'">
                        <div class="div1 approve">
                            <div></div>
                        </div>
                        <div class="div2">
                            <el-tooltip 
                                effect="light"  
                                :content="title(i.nodePostVoLists)" 
                                placement="bottom-start">
                                <div style="max-width:200px" slot="content">{{title(i.nodePostVoLists)}}</div>
                                <p class="p1">{{title(i.nodePostVoLists)|txtLimit}}</p>      
                            </el-tooltip>   
                            <p class="p2">
                                <span class="color" v-if="$store.state.recruitmentPlan.approval.title==1">审批中</span>
                            </p>
                        </div>
                        <div class="div3" v-if="(dataList&&dataList.length)||dataList1.length-1!=k"></div>
                        <div class="clear"></div>
                    </div>
                    <div class="item" v-for="(i,k) in dataList" :key="k+'1'">
                        <div class="div1">
                            <div></div>
                        </div>
                        <div class="div2">
                            <el-tooltip 
                                effect="light"  
                                placement="bottom-start">
                                <div style="max-width:200px" slot="content">{{title(i.nodePostVoLists)}}</div>
                                <p class="p1">{{title(i.nodePostVoLists)|txtLimit}}</p>      
                            </el-tooltip>   
                            <p class="p2">
                                <span v-if="$store.state.recruitmentPlan.approval.title==1">等待审批</span>
                            </p>
                            <!-- <p class="p3">退回原因：没有BEO资料，无法审批！请各部门注意务必
                                            附上BEO单号！还有，申请人数过多！时间太长了！请运
                                            营部门认真预估所需人数，合理申请！审批效率的提高来</p> -->
                            <p class="p4" v-if="$store.state.recruitmentPlan.approval.title==2">
                                <span>8人</span>
								<span class="span1"></span>
								<span>7人</span>	
                            </p>
                            <p class="p5" v-if="$store.state.recruitmentPlan.approval.title==2||$store.state.recruitmentPlan.approval.title==3">原因：7个人足够了</p>
                        </div>
                        <div class="div3" v-if="dataList.length-1!=k"></div>
                        <div class="clear"></div>
                    </div>
                    <div v-if="$store.state.recruitmentPlan.approval.title==2">
                        <div class="item1" v-for="(i,k) in dataList3" :key="k">
                            <div class="div1">
                                <div></div>
                            </div>
                            <div class="div2">
                                <el-tooltip 
                                    effect="light"  
                                    placement="bottom-start">
                                    <div style="max-width:200px" slot="content">{{i.creatorName}}（{{i.creatorPost}}）</div>
                                    <p class="p1">{{i.creatorName}}（{{i.creatorPost}}）</p>      
                                </el-tooltip>   
                                <p class="p2">
                                    <span v-if="i.state=='pass'">审批通过</span>
                                    <span v-if="i.state=='pending'">等待审批</span>
                                    <span v-if="i.state=='reject'">审批驳回</span>
                                    <span>{{$base.formattingTime(i.createTime)}}</span>
                                    <span>{{$base.formattingHover(i.createTime)}}</span>
                                </p>
                                <p class="p4" v-if="$store.state.recruitmentPlan.approval.title==2">
                                    <span>{{i.beforeAdjust}}人</span>
                                    <span class="span1"></span>
                                    <span>{{i.afterAdjust}}人</span>	
                                </p>
                                <p class="p3">调整原因：{{i.comments}}</p>
                            </div>
                            <div class="div3" v-if="dataList3.length-1!=k"></div>
                            <div class="clear"></div>
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
import mixin from '../../assets/js/mixin/mixin'
export default {
	name: 'progress2',
	mixins: [mixin],
	data () {
		return {
            show: false, 
            _timeOut: '',
            dataList: [],
            dataList1: [],
            dataList2: [],
            dataList3: [],
		}
    },
    filters:{
        txtLimit(val) {
            if(val.length>25) {
                return val.substring(0,25)+'...'
            }else{
                return val
            }
        }
    },
	created() {
        if(this.$store.state.recruitmentPlan.approval.title==1){
            this.init1()
        }else if(this.$store.state.recruitmentPlan.approval.title==3){
            this.init3()
        }else{
            this.init2()
        }
	},
	mounted () {
        this.show = true
	},
	methods: {
        title(nodePosts) {
            let str = ''
            let a = [],
                b = []
            if(nodePosts) {
                nodePosts.forEach((i,key)=>{
                    // if(i.users&&i.users.length){
                    //     i.users.forEach((j,k)=>{
                    //         if(k!=i.users.length-1) {
                    //             str+=`${j.name} (${i.postName}) / `
                    //         }else{
                    //             str+=`${j.name} (${i.postName})`
                    //         }         
                    //     })
                    // }else{
                    //     if(key<nodePosts.length) {
                    //         str+=`该岗位无人 (${i.postName}) / `
                    //     }else{
                    //         str+=`该岗位无人 (${i.postName})`
                    //     }
                    // }
                   
                    if(i.users&&i.users.length){
                        a.push(i)
                    }else{
                        b.push(i)
                    }
                })
                a.forEach((i,key)=>{
                    if(i.users&&i.users.length){
                        i.users.forEach((j,k)=>{
                            if(k!=i.users.length-1) {
                                str+=`${j.name} (${i.postName}) / `
                            }else{
                                str+=`${j.name} (${i.postName})`
                            }         
                        })
                    }
                })
                if(b.length){
                    str+=' / '
                    b.forEach((i,key)=>{
                        if(i.users&&i.users.length){
                            
                        }else{
                            if(key<b.length-1) {
                                str+=`该岗位无人 (${i.postName}) / `
                            }else{
                                str+=`该岗位无人 (${i.postName})`
                            }
                        }
                    })
                }    
            }
            return str
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
                if(this.$store.state.recruitmentPlan.approval.type=="in"){
                    this.$store.dispatch('progressin')
                }else{
                    this.$store.dispatch('progressout')
                }
				
			}, 200)
		},
		init1() {
			let id = this.$store.state.recruitmentPlan.approval.id
			if (id) {
				this.$axios({
					method: 'get',
					url:this.$urls.getBillApprove,
					params: {billOrderId:id}
				})
				.then(res=>{
					this.dataList = res.data.nodes
                    this.dataList1 = res.data.n
                    this.dataList2 = res.data.nodeVos
				})
				.catch(e=>{
				
				})	
			}
        },
        init2() {
            let id = this.$store.state.recruitmentPlan.approval.id
			if (id) {
				this.$axios({
					method: 'get',
					url:this.$urls.getDetailTotal,
					params: {detailId:id}
				})
				.then(res=>{
					if(res.data.length){
                        this.dataList3 = res.data
                    }
				})
				.catch(e=>{
				
				})	
			}
        },
        init3() {
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
            .returnReason{
                height: 102px;
                background: url("../../assets/img/approve2.png") no-repeat;
                background-size: 100% 100%;
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
                height: 102px;
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
            .returnReason{
                height: 102px;
                background: url("../../assets/img/approve2.png") no-repeat;
                background-size: 100% 100%;
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
	}
	
}
	
</style>