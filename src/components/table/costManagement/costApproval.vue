<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
                    <th width="80" v-if="tableType!='2'&&tableType!='3'">
                        <div class="checkBox" :class="{'border':allChecked}" @click="allCheckedBtn">
							<div class="checked" v-if="allChecked"></div>
						</div>
                    </th>
					<th width="100">操作</th>
                    <th>序号</th>
                    <th>结算单号</th>
                    <th>结算单名称</th>
                    <th>用工部门</th>
                    <th>用工日期</th>
                    <th>招聘者</th>
                    <th>总费用（元)</th>
                    <th>状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
                    <td v-if="tableType!='2'&&tableType!='3'">
                        <div v-if="i.billApproveState=='pending'" class="checkBox" :class="{'border':checkBoxList[k]}" @click="checkBtn(k)">
							<div class="checked" v-if="checkBoxList[k]"></div>
						</div>
						<div class="color null" v-else></div>
					</td>
					<td>
                        <a v-if="i.billApproveState!='pending'" class="clickArea" @click="approvals(i.id)">审批进度</a>
                        <a v-if="i.billApproveState=='pending'" class="clickArea" @click="approval(i)">审批</a>
                        <a v-if="i.billApproveState=='pending'" class="clickAreaRed ml20" @click="back(i.id)">退回</a>
					</td>
                    <td>{{k+1}}</td>
                    <td><a class="clickArea" @click="detail(i)">{{i.billOrderNo}}</a></td>
                    <td>{{i.title}}</td>
                    <td>{{i.departmentName}}</td>
                    <td>{{$base.formattingTime(i.startTime)}} 至 {{$base.formattingTime(i.endTime)}}</td>
                    <td>{{i.agencyName|txtLength}}</td>
                    <td>{{(i.totalCost/100).toFixed(2)}}</td>
                    <td v-if="i.billApproveState=='pending'">审批中</td>
					<td v-else-if="i.billApproveState=='pass'">待付款</td>
					<td v-else-if="i.billApproveState=='reject'">已退回</td>
				</tr>
			</tbody>
			
			
		</table>
        <el-dialog
            title="退回"
            :visible.sync="dialogVisible"
            width="450px"
            top="30.3vh">
            <BatchOperationMessage ref="BatchOperationMessage" :batch="'batch'" :txt-name="'结算单'"></BatchOperationMessage>
            <div class="dialogBtn">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>
import BatchOperationMessage from '../../common/batchOperationMessage'
export default {
	name: 'costApproval',
	props: ['dataList','tableType','orderInit'],
	data () {
		return {
            allChecked: false,
            checkBoxList: [],
            dialogVisible: false,
			id: '',
		}
    },
    created() {
        this.init()
	},
	filters: {
		txtLength(val) {
			if(val&&val.length){
				if(val.length>6){
					return val.substring(0,6) + '...'
				}else{
					return val
				}
			}
		}
	},
	watch: {
		dataList() {
			this.init()
		},
	},
	methods: {
        returnCheckArr() {
			let arr = []
			this.checkBoxList.forEach((i,k)=>{
				if (i) {
					arr.push(this.dataList[k].id)
				}
            })
			return arr
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
						billOrderId:this.id,
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
        back(id) {
			this.dialogVisible = true
			this.id = id
		},
        approval(item) {
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
							billOrderId:item.id,
							billOrderTags: []
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
        allCheckedBtn() {
            this.allChecked = !this.allChecked
	 		this.checkBoxList = this.checkBoxList.map(()=>{
	 			return this.allChecked
			})
        },
        checkBtn(k) {
            this.checkBoxList = this.checkBoxList.map((i,key)=>{
	 			if (k == key) {
	 				return !i
	 			}
	 			return i
	 		})
        },
        init() {
	 		this.checkBoxList = []
	 		for (let i = 0;i<this.dataList.length;i++) {
	 			this.checkBoxList.push(false)
			}
			this.allChecked = false
	 	},
		approvals(id) {
			this.$store.dispatch('progressout',{id,type:'out',title:1})
		},
        detail(data) {
            this.$store.dispatch('costDetail',{type:'C4300',tableType:this.tableType,operation:1,data})
        }  
    },
    components: {
        BatchOperationMessage
  	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.checkBox{
	width: 14px;
	height: 14px;
	background-color: #ffffff;
	border: solid 1px #d4d4d4;
	display:flex;
	justify-content:center;
	align-items:center;
    margin:0 auto;
    cursor: pointer;
	.checked{
		width: 8px;
		height: 8px;
		background-color: #4c8aff;
	}
}
.border{
	border: 1px solid #4c8aff;
}
.null{
	width: 24px;
	height: 1px;
	background-color: #d4d4d4;
	margin: 0 auto;
}

</style>
