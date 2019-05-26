<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
                    <th width="80">
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
                    <td>
                        <div class="checkBox" :class="{'border':checkBoxList[k]}" @click="checkBtn(k)">
							<div class="checked" v-if="checkBoxList[k]"></div>
						</div>
					</td>
					<td>
                        <a class="clickArea" @click="exportList(i)">导出</a>
                        <a class="clickArea ml20" v-if="i.payState=='N'" @click="payment(i)">付款</a>
					</td>
                    <td>{{k+1}}</td>
                    <td><a class="clickArea" @click="detail(i)">{{i.billOrderNo}}</a></td>
                    <td>{{i.title}}</td>
                    <td>{{i.departmentName}}</td>
                    <td>{{$base.formattingTime(i.startTime)}} 至 {{$base.formattingTime(i.endTime)}}</td>
                    <td>{{i.agencyName|txtLength}}</td>
                    <td>{{(i.totalCost/100).toFixed(2)}}</td>
                    <td v-if="i.payState=='N'">待付款</td>
					<td v-else>已付款</td>
				</tr>
			</tbody>


		</table>
	</div>
</template>
<script>
import BatchOperationMessage from '../../common/batchOperationMessage'
export default {
	name: 'costPay',
	props: ['dataList','tableType','orderInit'],
	data () {
		return {
            allChecked: false,
            checkBoxList: [],
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
        payment(data) {
            const h = this.$createElement;
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
        returnCheckArr() {
			let arr = []
			this.checkBoxList.forEach((i,k)=>{
				if (i) {
					arr.push(this.dataList[k])
				}
            })
			return arr
		},
        exportList(item) {
			this.$axios({
                method: 'post',
                url: this.$urls.getBillOrderWorkerList,
                data: {
                    billOrderIds: [item.id]
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
        detail(data) {
            this.$store.dispatch('costDetail',{type:'C4400',tableType:this.tableType,operation:1,data})
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

</style>
