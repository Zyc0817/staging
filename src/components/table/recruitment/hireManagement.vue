<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
                    <th width="86" v-if="tableType!=2" class="min-width">
						<div class="checkBox" :class="{'border':allChecked}" @click="allCheckedBtn">
							<div class="checked" v-if="allChecked"></div>
						</div>
					</th>
					<th v-if="tableType!=2&&tableType!=3" class="minW">操作</th>
					<th class="minW">序号</th>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>年龄</th>
                    <th>岗位</th>
                    <th>用工部门</th>
                    <th width="180">用工日期</th>
                    <th width="180">用工单号</th>
                    <th class="minW50">状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
                    <td v-if="tableType!=2">
						<div v-if="i.isReject!='Y'" class="checkBox" :class="{'border':checkBoxList[k]}" @click="checkBtn(k)">
							<div class="checked" v-if="checkBoxList[k]"></div>
						</div>
						<div v-else class="null"></div>
					</td>
					<td v-if="tableType!=2&&i.isReject=='N'" class="operation">
                        <a class="back" @click="back(i)">退回</a>
                    </td>
					<td v-if="tableType!=2&&i.isReject=='Y'">
						<div class="null"></div>
					</td>
                    <td>{{k+1}}</td>
                    <td>
						<a class="operation" @click="detailName(i.id)">{{i.username}}</a>
					</td>
                    <td v-if="i.gender=='male'">男</td>
					<td v-else>女</td>
                    <td>{{$base.age(i.birthday)}}</td>
                    <td>{{i.post}}</td>
                    <td>{{i.department}}</td>
                    <td>{{$base.formattingTime(i.startDate)}} 至 {{$base.formattingTime(i.endDate)}}</td>
                    <td>{{i.no}}</td>
                    <td v-if="i.isReject=='N'">已安排</td>
					<td v-else>已退回</td>
                </tr>
			</tbody>		
		</table>
	</div>
</template>
<script>

export default {
    name: 'hireManagement',
    props: ['dataList','tableType','orderInit'],
    data () {
        return {
            allChecked: false,
			checkBoxList: []
        }
    },
    watch:{
		dataList() {
			if (this.tableType == 0||this.tableType == 1) {
				this.init()
			}	
		}
	},
    mounted() {
    },
    methods: {
		backAll() {
			let arr = []
			this.checkBoxList.forEach((i,k)=>{
				console.log(1)
				if (i) {
					arr.push(this.dataList[k].certNo)
				}
			})
			return arr
		},
        back(id) {	
            const h = this.$createElement;
	 		this.$msgbox({
	          	title: '退回',
				message:h('div',null,[
					h('p', { style: 'width:210px;margin:0 auto;text-align:left;font-size: 14px;color: #444950;margin-top:80px;' }, 
						'确认退回' + '“' + id.username + '”' + '吗？'),
					h('div',{style:'display:flex;justify-content:center;margin-top:5px;'},[
						h('div',{style:'width: 12px;height: 12px;line-height:12px;text-align-center;font-size:12px;color:white;background-color:#e45a3c;border-radius:50%;margin:2.5px 10px 0 0'},'!'),
						h('div',{style:'color:#666666;font-size: 12px;'},'退回后的人员将进入到已退回列表中')
					])
				]), 
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
	        	this.$axios({
					method: 'post',
					url: this.$urls.returnUser,
					data: [id.certNo]
				}).then(res =>{
					console.log(res)
					if(res.data.message == '成功'){
						this.$message({
							type: 'success',
							message: '退回成功!'
						});
						this.orderInit()
					}
				}).catch(err =>{
					console.log(err)
					this.$message({
						type: 'error',
						message: '退回失败!'
					}); 
				})
	        }).catch((err) => {
				console.log(err)
				this.$message({
                    type: 'error',
                    message: '已取消!'
                }); 
            })

        },
        init() {
	 		this.checkBoxList = []
	 		for (let i = 0;i<this.dataList.length;i++) {
				if (this.dataList[i].isReject!='Y') {
					this.checkBoxList.push(false)
				} else {
					this.checkBoxList.push(null)
				}	
			}
			this.allChecked = false
		 },
		detailName(id) {
			let params = {title:'个人信息',operation:0,type:'recruitmentManagement',id}
			this.$store.dispatch('personalInformation',params)
		},
        detailPage(id) {
			return 
            let params = {title:'查看用工单',operation:0,type:'confirm',id}
            this.$store.dispatch('detailPage',params)
        },
        positionDetails(id) {
            this.$store.dispatch('positionDetails')
        },
        allCheckedBtn() {
	 		this.allChecked = !this.allChecked
	 		this.checkBoxList = this.checkBoxList.map((i)=>{
				if (i != null) {
					return this.allChecked
				}	
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

    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.minW{
    min-width: 30px;
}
.minW50{
    min-width: 50px;
}
.operation{
	color: #4c8aff;
	cursor:pointer;
}
.back{
	color: #e45a3c;
	cursor:pointer;
}
.line{
	color: #d4d4d4;
}
.null{
	width: 24px;
	height: 1px;
	background-color: #d4d4d4;
	margin: 0 auto;
	line-height: 0;
}
.checkBox{
	width: 14px;
	height: 14px;
	background-color: #ffffff;
	border: solid 1px #d4d4d4;
	display:flex;
	justify-content:center;
	align-items:center;
	margin:0 auto;
	.checked{
		width: 8px;
		height: 8px;
		background-color: #4c8aff;
	}
}
.border{
	border: solid 1px #4c8aff;
}
</style>
