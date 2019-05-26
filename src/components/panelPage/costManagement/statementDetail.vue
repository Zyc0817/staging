<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="minH">
                    <div class="panelTitleWrap" :class="{'fixed':fixed}">
                        <div class="panelTitle">
                            <div class="line"></div>
                            <div class="txt" v-if="$store.state.costManagement.props.reSubmit">重新提交结算单<div class="txtSpan">（{{$store.state.costManagement.props.data.billOrderId||$store.state.costManagement.props.data.billOrderNo}}）</div></div>
                            <div class="txt" v-else>结算单详情<div class="txtSpan">（{{$store.state.costManagement.props.data.billOrderId||$store.state.costManagement.props.data.billOrderNo}}）</div></div>
                        </div>
                        <div class="cancel icon-Close" @click="cancel"></div>
                    </div>
                    <div style="height:50px;" v-if="fixed"></div>
                    <div class="infoWrap">
                        <div class="head">
                            <div class="left">
                                <div class="item mb24">
                                    <div class="left">结算单名称：</div>
                                    <div class="right">{{title}}</div>
                                </div>
                                <div class="item mb24">
                                    <div class="left">用工日期：</div>
                                    <div class="right">{{$base.formattingTime(startTime)}} 至 {{$base.formattingTime(endTime)}}</div>
                                </div>
                                <div class="item mb24">
                                    <div class="left">招聘者：</div>
                                    <div class="right">{{agencyName}}</div>
                                </div>
                                <div class="item mb24">
                                    <div class="left clickArea">总费用：</div>
                                    <div class="right clickArea">{{totalCost|money}} 元</div>
                                </div>
                            </div>
                            <div class="right ml220">
                                <div class="item mb24">
                                    <div class="left">用工部门：</div>
                                    <div class="right">{{departmentName}}</div>
                                </div>
                                <div class="item mb24">
                                    <div class="left">结算人：</div>
                                    <div class="right">{{creatorName}}</div>
                                </div>
                                <div class="item mb24">
                                    <div class="left">创建日期：</div>
                                    <div class="right">{{$base.formattingTime(createTime)}}</div>
                                </div>
                            </div>
                            <div class="on" @click="detailShow=!detailShow">
                                <div class="txt" v-if="!detailShow">展开筛选</div>
                                <div class="txt" v-else>收起筛选</div>
                                <div class="iconArrow" :class="{'departmentListShow':detailShow}"></div>
                            </div>
                        </div>
                        <div v-if="detailShow" class="line mb24"></div>
                        <div v-if="detailShow" class="screeningWrap">
                            <el-form ref="form" :model="form" label-width="80px" size="medium">
                                <div class="height30 inputHeight30 mb24">
                                    <el-form-item label="费用状态：">
                                        <el-select v-model="form.workBillState" @change="dataListInit" placeholder="请选择">
                                            <el-option :label="'已调整'" :value="'adjusted'"></el-option>			
                                            <el-option :label="'未调整'" :value="'unadjusted'"></el-option>	
                                            <el-option :label="'复核异常'" :value="'hasTags'"></el-option>							
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="height30 inputHeight30 ml366 mb24">
                                    <el-form-item label="岗位：">
                                        <el-select v-model="form.postId" @change="dataListInit" placeholder="请选择">
                                            <el-option v-for="(i,k) in postList" :key="k" :label="i.title" :value="i.id"></el-option>			
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="height30 inputHeight30 mb24">
                                    <el-form-item label="统计方式：">
                                        <el-select v-model="form.statisticalMethods" @change="dataListInit" placeholder="请选择">
                                            <el-option :label="'按人统计'" :value="'byPerson'"></el-option>	
                                            <el-option :label="'按日期统计'" :value="'byDate'"></el-option>		
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-form>

                        </div>
                    </div>
                    <div class="infoWrap1">
                        <Tabel 
                            :data-list="dataList" 
                            :data-list1="dataList1"
                            ref="table"
                            :type="type"></Tabel>
                    </div>
                </div>
                <div class="subWrap btn2" v-if="$store.state.costManagement.props.reSubmit">
                    <div class="submit" @click="submit">提交</div>
                    <div class="close" @click="cancel">关闭</div>
                </div>
                <div v-else class="subWrap" :class="{'btn2':($store.state.costManagement.props.type=='C4200'&&($store.state.costManagement.props.data.position=='pending'||($store.state.costManagement.props.data.position=='pass'&&$store.state.costManagement.props.data.payState=='Y')))||($store.state.costManagement.props.type=='C4300'&&$store.state.costManagement.props.data.billApproveState!='pending')||($store.state.costManagement.props.type=='C4400'&&$store.state.costManagement.props.data.payState=='Y')}">
                    <div class="undo" v-if="$store.state.costManagement.props.type=='C4100'" @click="undo">撤销</div>
                    <div class="submit" v-if="$store.state.costManagement.props.type=='C4100'" @click="submit">提交</div>
                    <div class="print" v-if="$store.state.costManagement.props.type=='C4200'&&$store.state.costManagement.props.data.position=='pass'&&$store.state.costManagement.props.data.payState=='N'" @click="print">打印</div>
                    <div class="resubmit" @click="submit" v-if="$store.state.costManagement.props.type=='C4200'&&$store.state.costManagement.props.data.position=='reject'">重新提交</div> 
                    <div class="approvals" v-if="$store.state.costManagement.props.type=='C4200'" @click="approvals">审批进度</div> 
                    <div class="undo" v-if="$store.state.costManagement.props.type=='C4300'&&$store.state.costManagement.props.data.billApproveState=='pending'" @click="c43btn1">退回</div>
                    <div class="submit" v-if="$store.state.costManagement.props.type=='C4300'&&$store.state.costManagement.props.data.billApproveState=='pending'" @click="c43btn2">审批</div>
                    <div class="approvals" v-if="$store.state.costManagement.props.type=='C4300'&&$store.state.costManagement.props.data.billApproveState!='pending'" @click="approvals">审批进度</div> 
                    <div class="print" @click="payment" v-if="$store.state.costManagement.props.type=='C4400'&&$store.state.costManagement.props.data.payState=='N'">付款</div>
                    <div class="approvals" v-if="$store.state.costManagement.props.type=='C4400'" @click="exportList">导出</div> 
                    <div class="close" @click="cancel">关闭</div>
                </div>
			</div>
		</transition>
        <FieldSet v-if="$store.state.costManagement.fieldSet" :order-init="init"></FieldSet>
        <AdjustAttendance v-if="$store.state.costManagement.adjustAttendance" :order-init="dataListInit"></AdjustAttendance>
        <Rewards v-if="$store.state.costManagement.rewards" :order-init="init"></Rewards>
        <Approvals v-if="$store.state.recruitmentPlan.progressin"></Approvals>
        <Approvals1 v-if="$store.state.recruitmentPlan.progress1in"></Approvals1>
        <el-dialog
            title="退回"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            width="450px"
            top="30.3vh">
            <BatchOperationMessage ref="BatchOperationMessage" :batch="'batch'"></BatchOperationMessage>
            <div class="dialogBtn">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
import Tabel from '../../table/costManagement/detail'
import FieldSet from './fieldSet'
import Approvals from '../../common/progress2'
import Approvals1 from '../../common/progress1'
import AdjustAttendance from './adjustAttendance'
import Rewards from './rewards'
import BatchOperationMessage from '../../common/batchOperationMessage'
import print from 'print-js'
export default {
    name: 'statementDetail',
    props:['orderInit'],
	mixins: [mixin],
	data () {
		return {
			show: false, 
            _timeOut: '',
            detailShow: false,
            form: {
                workBillState: '',
                postId: '',
                statisticalMethods: 'byDate'
            },
            dataList: [],
            dataList1: [],
            postList: [],
            type: '',
            dialogVisible: false,
            agencyName: '',
            createTime: '',
            creatorName: '',
            departmentName: '',
            endTime: '',
            startTime: '',
            title: '',
            totalCost: '',
		}
    },
    created() {
        this.type = this.$store.state.costManagement.props.type
        this.init()
        this.dataListInit()
    },
	mounted () {
		this.show = true
    },
    filters:{
        money(val) {
            if (val) {
				return (val/100).toFixed(2)
			}else{
				return val/100
			}
        }
    },
	methods: {
        exportList() {
            this.$axios({
                method: 'post',
                url: this.$urls.getBillOrderWorkerList,
                data: {
                    billOrderIds: [this.$store.state.costManagement.props.data.id]
                }
            }).then(res=>{
                if(res.data.length){
                    let arr = res.data;
                    arr.forEach((i,k)=>{
                        i.idx = k+1
                    })
                    arr.push({idx:'', certName:'', workerCertNo:'', bankName:'', subBankName:'', bankNo:'', calCost:''});
                    arr.push({idx:'', certName:'', workerCertNo:'', bankName:'', subBankName:'', bankNo:'', calCost:''});
                    arr.push({idx:'导出时间', certName:new Date(), workerCertNo:'', bankName:'', subBankName:'', bankNo:'', calCost:''});
                    this.$excel.downXlsxFromJson(arr, this.$excelTemp.costHeader, '费用清单.xlsx')
                }
            }).catch(e=>{

            })
        },
        print() {
            this.$axios({
                method: 'post',
                url:this.$urls.generatePdfInfo+'?generateState=costPdf',
                data:{
					billOrderId:this.$store.state.costManagement.props.data.id,
					statisticalMethods: this.form.statisticalMethods
				}
            })
            .then(res=>{
                if(res.data.status==200){
					let url = this.$baseApi.split('/hotelApi')
					let i = res.data.content
					this.$printJS('/upload/'+i.filepath+i.filedate)
				}else{
					this.$message({
						message: res.data.message||'操作失败',
						type: 'error',
						duration: 5 * 1000
					})
				}
            })
            .catch(e=>{

            })
        },
        payment() {
            const h = this.$createElement
            let data = this.$store.state.costManagement.props.data
	 		this.$msgbox({
	          	title: '付款',
				message: h('div',null,[
					h('p', { style: 'font-size: 14px;color: #444950;margin:0 auto;text-align:left;margin-top:80px;width:294px;' }, 
					`确认已给“${data.title}"结算单付款吗？`)
				]),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	this.$axios({
					method: 'post',
					url: this.$urls.updateBillOrderPayState,
					data: {
						billOrderIds: [data.id]
					}
				}).then(res=>{
					if(res.data.code==0) {
						this.$message({
							message: "操作成功",
							type: 'success',
							duration: 5 * 1000
						})
                        this.orderInit()
                        this.cancel()
					}else{
						this.$message({
							message: res.data.msg||"操作失败",
							type: 'error',
							duration: 5 * 1000
						})
					}	
				}).catch(e=>{
					
				})	
	        }).catch(() => {
				
            })
        },
        sure() {
            let obj = this.$refs.BatchOperationMessage.returnMsg(),
				init = this.$refs.BatchOperationMessage.init	
			if (!obj) {
				return
			}
			this.$axios({
				method: 'post',
				url: this.$urls.batchBillOrderApprove,
				data: {
					billOrderVos:[{
						billOrderId:this.$store.state.costManagement.props.data.id,
						billOrderTags: []
					}],
					comments: obj.txt,
					state: 'reject',
					mine: obj.checked?'Y':'N'
				}
			}).then(res=>{
				if(res.data.code==0) {
					this.$message({
						message: "操作成功",
						type: 'success',
						duration: 5 * 1000
					})
                    this.orderInit()
                    this.cancel()
					init()
				}else{
					this.$message({
						message: res.data.msg||"操作失败",
						type: 'error',
						duration: 5 * 1000
					})
				}
			}).catch(e=>{
				
			})	
            this.dialogVisible = false
        },
        c43btn1() {
            this.dialogVisible = true
        },
        c43btn2() {
            let billOrderTags = this.$refs.table.returnbillOrderTags()
            const h = this.$createElement;
	 		this.$msgbox({
	          	title: '审批',
				message: h('div',null,[
					h('p', { style: 'font-size: 14px;color: #444950;margin-top:80px;' }, 
					`确认审批通过所选的结算单吗？`)
				]),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	this.$axios({
					method: 'post',
					url: this.$urls.batchBillOrderApprove,
					data: {
						billOrderVos:[{
							billOrderId:this.$store.state.costManagement.props.data.id,
							billOrderTags: billOrderTags
						}],
						comments: '',
						state: 'pass',
						mine: ''
						
					}
				}).then(res=>{
					if(res.data.code==0) {
						this.$message({
							message: "操作成功",
							type: 'success',
							duration: 5 * 1000
						})
						this.orderInit()
					}else{
						this.$message({
							message: res.data.msg||"操作失败",
							type: 'error',
							duration: 5 * 1000
						})
					}	
				}).catch(e=>{
					
				})	
	        }).catch(() => {
				
            })
        },
        approvals() {
            this.$store.dispatch('progressin',{type:'in',title:1,id:this.$store.state.costManagement.props.data.id})
        },
        undo() {
            let data = this.$store.state.costManagement.props.data
            const h = this.$createElement;
	 		this.$msgbox({
	          	title: '撤销',
				message:h('div',{style:'width:296px;margin:0 auto;'},[
					h('p', { style: 'font-size: 14px;color: #444950;margin-top:70px;text-align:left;' }, 
						`确认撤销“${data.departmentName}-${data.agencyName}-${this.$base.formattingTime(data.startTime)}至${this.$base.formattingTime(data.endTime)}”的预结算单吗？`),
					h('div',{style:'display:flex;margin-top:5px;'},[
						h('div',{style:'width: 12px;height: 12px;line-height:12px;font-size:12px;color:white;background-color:#e45a3c;border-radius:50%;margin:2.5px 10px 0 0'},'!'),
						h('div',{style:'color:#666666;font-size: 12px;'},'撤销后，请前往“未结算”查看')
					])
				]), 
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
				this.$axios({
					method: 'post',
					url: this.$urls.delBillOrder,
					params: {
						billOrderId:data.billOrderId,
					}
				}).then(res=>{
					if(res.data.code == 0){
						this.$message({
							message: "撤销成功",
							type: 'success',
							duration: 5 * 1000
						})
                        this.orderInit()
                        this.cancel()
					}else{
						this.$message({
							message: res.data.msg||"撤销失败",
							type: 'error',
							duration: 5 * 1000
						})
					}	
				}).catch(err=>{
					
				})
	        }).catch((err) => {
		
            })
        },
        submit() {
            let data = this.$store.state.costManagement.props.data
            const h = this.$createElement;
	 		this.$msgbox({
	          	title: '提交',
				message:h('div',{style:'width:296px;margin:0 auto;'},[
					h('p', { style: 'font-size: 14px;color: #444950;margin-top:70px;text-align:left;' }, 
						`确认提交“${data.departmentName}-${data.agencyName}-${this.$base.formattingTime(data.startTime)}至${this.$base.formattingTime(data.endTime)}”的预结算单吗？`),
					h('div',{style:'display:flex;margin-top:5px;'},[
						h('div',{style:'width: 12px;height: 12px;line-height:12px;font-size:12px;color:white;background-color:#e45a3c;border-radius:50%;margin:2.5px 10px 0 0'},'!'),
						h('div',{style:'color:#666666;font-size: 12px;'},'确认后，将开始审批，并且不可撤销')
					])
				]), 
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
				this.$axios({
					method: 'post',
					url: this.$urls.addBillOrderApprove,
					data: {
						departmentId:data.departmentId,
						id:data.id
					}
				}).then(res=>{
					if(res.data.code == 0){
						this.$message({
							message: "提交成功",
							type: 'success',
							duration: 5 * 1000
						})
                        this.orderInit()
                        this.cancel()
					}else{
						this.$message({
							message: res.data.msg||"提交失败",
							type: 'error',
							duration: 5 * 1000
						})
					}	
				}).catch(err=>{
					
				})
	        }).catch((err) => {
		
            })
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('costDetail')
			}, 200)
        },
        dataListInit() {
            let data = this.$store.state.costManagement.props.data,
                id = ''
            if(this.$store.state.costManagement.props.type=='C4100') {
                id = data.billOrderId
            }else{
                id = data.id
            }
            this.$axios({
                method: 'post',
                url: this.$urls.getWorkerBill,
                data: Object.assign(this.form,{billOrderId:id})
            }).then(res=>{
                if(res.data.length){
                    this.dataList = res.data.filter(i=>{
                        return typeof i =='object'
                    })
                }	
            }).catch(err=>{
                
            })
        },
        init() {
            let data = this.$store.state.costManagement.props.data,
                id = ''
            if(this.$store.state.costManagement.props.type=='C4100') {
                id = data.billOrderId
            }else {
                id = data.id
            }
            this.$axios({
                method: 'get',
                url: this.$urls.getBill,
                params: {
                    billOrderId:id
                }
            }).then(res=>{
                this.agencyName = res.data.agencyName
                this.createTime = res.data.createTime
                this.creatorName = res.data.creatorName
                this.departmentName = res.data.departmentName
                this.endTime = res.data.endTime
                this.startTime = res.data.startTime
                this.title = res.data.title
                this.totalCost = res.data.totalCost
            }).catch(err=>{
                
            })

            this.$axios({
                method: 'get',
                url: this.$urls.getOutsidePostByDept,
                params: {
                    departmentId: data.departmentId,
                }
            }).then(res=>{
                if(res.data.length){
                    this.postList = res.data
                }	
            }).catch(err=>{
                
            })

            this.$axios({
                method: 'get',
                url: this.$urls.getBillField,
                params:{settingType: 'examine'} 
            })
            .then(res=>{
                if(res.data.length) {
                    this.dataList1 = res.data.filter(i=>!i.userId)
                }
            })  
            .catch(e=>{
                
            })
        }
		
	},
	destroyed() {
		clearTimeout(this._timeOut)
    },
    components:{
        Tabel,
        FieldSet,
        Approvals,
        BatchOperationMessage,
        AdjustAttendance,
        Rewards,
        Approvals1
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
    width:1140px;
    overflow-y:scroll;
    .txt{
        .txtSpan{
            display: inline-block;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            font-weight: normal;
            margin-left: 8px;
            color: #444950;
        }
    }
    .fixed{
        width: 1100px;
    }
    .minH{
        min-height: calc(100% - 79px);
    }
    .subWrap{
        height: 57px;
        border-top: 1px solid #ececec;
        padding: 15px 390px;
        box-sizing: border-box;
        div{
            cursor: pointer;
        }
        .resubmit{
            width: 80px;
            border-radius: 14.5px;
            background-color: #4c8aff;
            padding: 5.5px 0;
            text-align: center;
            color: #ffffff;
            font-size: 12px;
            float: left;
        }
        .undo{
            width: 80px;
            border-radius: 14.5px;
            background-color: #e45a3c;
            padding: 5.5px 0;
            text-align: center;
            color: #ffffff;
            font-size: 12px;
            float: left;
        }
        .submit{
            width: 80px;
            border-radius: 14.5px;
            background-color: #4c8aff;
            padding: 5.5px 0;
            text-align: center;
            color: #ffffff;
            font-size: 12px;
            float: left;
            margin-left: 60px;
        }
        .close{
            width: 78px;
            border-radius: 14.5px;
            border: 1px solid #4c8aff;
            padding: 4.5px 0;
            text-align: center;
            color: #4c8aff;
            font-size: 12px;
            float: left;
            margin-left: 60px;
        }
        .approvals{
            width: 80px;
            border-radius: 14.5px;
            background-color: #4c8aff;
            padding: 5.5px 0;
            text-align: center;
            color: #ffffff;
            font-size: 12px;
            float: left;
            margin-left: 60px;
        }
        .print{
            width: 80px;
            border-radius: 14.5px;
            background-color: #4c8aff;
            padding: 5.5px 0;
            text-align: center;
            color: #ffffff;
            font-size: 12px;
            float: left;
        }
    }
    .btn2{
        padding: 15px 400px;
    }
    .infoWrap1{
        width: 1100px;
        background-color: #f4f8fc;
        border-radius: 2px;
        box-sizing: border-box;
        margin: 0 auto;
        margin-top: 20px;
        padding: 0 4px 24px;
        margin-bottom: 20px;
    }
    .infoWrap{
        width: 1100px;
        background-color: #f4f8fc;
        border-radius: 2px;
        box-sizing: border-box;
        padding: 24px 24px 0;
        margin: 0 auto;
        margin-top: 20px;
        .head{
            position: relative;
            overflow: hidden;
        }
        .screeningWrap{
            overflow: hidden;
            .ml366{
                margin-left: 366px;
            }
        }
        .line{
            width: 1052px;
            border-top: dashed 2px #d4d4d4;
        }
        .mb24{
            margin-bottom: 24px;
        }
        .height30{
            height: 30px;
            float: left;
        }
        .on{
            position: absolute;
            overflow: hidden;
            right: 0px;
            bottom: 24px;
            cursor: pointer;
            .iconArrow{
                float: left;
                background: url('../../../assets/img/logo.png') no-repeat -203px -104px;
                width: 8px;
                height: 6px;
                margin:5.5px 0 0 6px;
                transition:all .3s;
            }
            .departmentListShow{
                transform:rotate(180deg);
                transform-origin: center center;
            }
            .txt{
                float: left;
                height: 17px;
                line-height:17px;
                color: #4c8aff;
                font-size: 12px;
            }
        }
        .left,.right{
            float: left;
            .item{
                overflow: hidden;
                height: 20px;
                line-height: 20px;
                .left,.right{
                    float: left;
                    font-size: 14px;
                    color: #444950;
                }
                .clickArea{
                    color: #4c8aff;
                }
                .left{
                    width: 94px;
                }
            }
        }
        .left{
            width: 626px;
        }
        .right{
            .item{
                .left{
                    width: 80px;
                }
            }
        }
        .ml220{
            margin-left: 0px;
        }
    }
	
}
	
</style>