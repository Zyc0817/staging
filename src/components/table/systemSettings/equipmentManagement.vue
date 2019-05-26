<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="170">操作</th>
					<th>序号</th>
                    <th>类型</th>
                    <th width="170">云序列号</th>
                    <th>使用部门</th>
                    <th width="190">设备管理员</th>
                    <th width="170">状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td>
                        <a class="clickArea" @click="editEquipment(i.id)">编辑</a>
                        <a class="clickDelete" @click="deleteProject(i.id,i.serialNo)">删除</a>
					</td>
                    <td>{{k+1}}</td>
                    <td>{{i.businessType | changeType}}</td>
                    <td>
                        <a class="clickArea" @click="checkEquipment(i.id)">{{i.serialNo}}</a>
                    </td>
                    <td><span v-for="(item,k) in i.departments.slice(0, 2)" :key="k">{{item.value}}<span v-if="i.departments.length>=2">，</span></span><span v-if="i.departments.length>2">...</span></td>
                    <td><span v-for="(val,index) in i.managers" :key="index">{{val.value}}<span v-if="i.managers.length>=2">，</span></span><span v-if="i.managers.length>2">...</span></td>
                    <td v-if="i.state=='on'">在线</td>
					<td v-if="i.state=='off'">离线</td>
				</tr>
			</tbody>
		</table>
		<el-dialog
			title="删除"
			:visible.sync="dialogVisible"
			width="450px"
			top="30.3vh">
			<div class="removeblackname"><span>确认删除设备“{{blackName}}”吗？</span></div>
			<div class="removeblackprompt"><img src="../../../assets/img/prompt1.svg" alt=""><span>删除后，该设备将无法正常打卡</span></div>
			<div class="dialogBtn">
				<div class="sub" @click="sure()">确定</div>
				<div class="cancel" @click="dialogVisible=false">取消</div>
			</div>  
        </el-dialog>
	</div>
</template>
<script>

export default {
	name: 'recruitmentManagement',
	props: ['dataList','roled'],
	data () {
		return {
			dialogVisible: false,
			blackName: '',
			id: ''
		}
	},
	filters:{
        whetherEmpty(val) {
			console.log(val)  
        },
        changeType(val) {
            if(val == 'work'){
                return '考勤打卡'
            }else if(val == 'meal'){
                return '用餐打卡'
            }else { return '暂无类型' }
        },
		txtLength(val) {
			if(val&&val.length>6){
				return val.substring(0,6)+'...'
			}else{
				return val
			}
			
		},
		segmentation(val) {
			if(val){
			   return val + '，'
			}else{

			}
		}	
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			console.log(this.dataList)
		},
		editEquipment(id) {
			let params = {title: '编辑设备',operation: 0,type: 'editEquipment',id}
			this.$store.dispatch('editEquipment',params)
		},
		deleteProject(id,serialNo) {
			this.dialogVisible = true
			this.id = id
			this.blackName = serialNo
		},
		sure() {
			this.$axios({
				method: 'delete',
				url: this.$urls.machinedDelete,
				params: { id: this.id}
			}).then(res=>{
				if(res.data.message == '成功'){
					this.$message({
						message: '删除成功',
						type: 'success',
						duration: 5*1000
					})
					this.roled()
				}else{
					this.$message({
						message: '删除失败',
						type: 'error',
						duration: 5*1000
					})
				}
			}).catch(err=>{
				this.$message({
					message: '错误',
					type: 'error',
					duration: 5*1000
				})
			})
			this.dialogVisible = false
		},
		checkEquipment(id) {
			let params = {title: '查看设备',operation: 0,type: 'checkEquipment',id}
			this.$store.dispatch('checkEquipment',params)
		}
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.ml20{
    margin-left: 20px;
}
.clickAreaRed{
	color: #e45a3c;
	cursor:pointer;
}
.clickArea{
	cursor:pointer;
    color: #4c8aff;
}
.clickDelete{
    margin-left: 18px;
    cursor:pointer;
    color: #e45a3c;
}
.removeblackname{
	width: 226px;
	height: 20px;
	margin: 80px auto;
	text-align: center;
	line-height: 20px;
	span{
		font-size: 14px;
		color: #444950;
	}
}
.removeblackprompt{
	width: 186px;
	height: 17px;
	margin-top: -74.2px;
	margin-left: 109px;
	text-align: center;
	line-height: 17px;
	img{
		float: left;
		margin-top: 3px;
		width: 12px;
		height: 12px;
	}
	span{
		font-size: 12px;
		color: #666666;
	}
}
</style>
