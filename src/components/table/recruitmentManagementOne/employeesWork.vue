<template>
	<div id="table">
		<table style="width:100%" class="table" v-if="tableType != 3">
			<thead>
				<tr>
					<th width="130" v-if="tableType==1||tableType==2">
						<div class="checkBox" :class="{'border':allChecked}" @click="allCheckedBtn">
							<div class="checked" v-if="allChecked"></div>
						</div>
					</th>
					<th width="300" class="min-width" v-if="tableType!=0">操作</th>
                    <th width="150" class="min-width2">序号</th>
                    <th width="150" class="min-width1">姓名</th>
                    <th width="150" class="department">用工部门</th>
					<!-- <th width="150" v-if="tableType == 3" class="department">岗位</th> -->
                    <th width="180" class="min-width">工作时间</th>
                    <th width="180">用工单号</th>
                    <th width="220" class="minW50">招聘者</th>
                    <th width="180" v-if="tableType!=0">签到时间</th>
                    <th width="200" class="min-width1" v-if="tableType!=0">上班时间</th>
                    <th width="200" class="min-width1" v-if="tableType!=0">下班时间</th>
                    <!-- <th width="180" v-if="tableType==3">签退时间</th> -->
                    <th width="150" v-if="tableType==0">状态</th>
				</tr>
			</thead>
			<tbody v-if="dataList.length>0">
				<tr v-for="(i,k) in dataList" :key="k">
					<td v-if="(tableType==1||tableType==2)&&state[k]&&i.state!='reject'&&i.state!='pending'">
						<div class="checkBox" :class="{'border':singleChecked[k]}" @click="singleCheckedBtn(k)">
							<div class="checked" v-if="singleChecked[k]"></div>
						</div>
					</td>
					<td v-else-if="(tableType==1||tableType==2)&&(!state[k]||i.state=='reject'||i.state=='pending')"><span style="color:lightgray;">—</span></td>
					<td v-else-if="(tableType==1||tableType==2)&&(i.state=='reject'||i.state=='pending')"><span style="color:lightgray;">—</span></td>
					<td v-if="tableType!=0" class="min-width">
						<a class="RewardsAndPunishments" @click="rewardsAndPunishmentsPage(i)">奖惩</a>
						<a v-if="(tableType == 1||tableType == 2)&&!state[k]" :class="{'accommodationcolor':!state[k]}" :title="i.remarks">住宿</a>
						<a v-if="(tableType == 1||tableType == 2)&&(i.state=='reject'||i.state=='pending')" :class="{'accommodationcolor':i.state=='reject'||i.state=='pending'}" :title="i.remarks">住宿</a>
						<a v-if="(tableType == 1||tableType == 2)&&i.state!='reject'&&state[k]&&i.state!='pending'" class="accommodation" @click="accommodation(i,k)">住宿</a>
						<a v-if="(tableType == 1||tableType == 2)&&i.clockTimeStart&&i.clockTimeEnd" :class="{'accommodationcolor':i.clockTimeStart&&i.clockTimeEnd}">补卡</a>
						<a v-if="(tableType == 1||tableType == 2)&&(!i.clockTimeStart||!i.clockTimeEnd)" class="accommodation" @click="newCard(i,k)">补卡</a>
						<a v-if="tableType == 1||tableType == 2" class="refuse" @click="personalInformations(i)">辞退</a>
						<!-- <a v-if="tableType == 3" class="attendance" @click="modulationInformations(i)">调整考勤</a> -->
					</td>
                    <td>{{k+1}}</td>
                    <td>
						<a class="operation" @click="employeeWorkInformation(i)">{{i.workerName}}</a>
					</td>
                    <td>{{i.departmentName}}</td>		
					<!-- <td v-if="tableType == 3">{{i.departmentName}}</td>			 -->
                    <td>{{$base.timeplateTohm(i.workTimeStart)}} - <span v-if="parseInt(i.workTimeEnd/(24*3600000))>0">次日</span>{{$base.timeplateTohm(i.workTimeEnd%(24*3600000))}}</td>
                    <td>
						<a class="operation" @click="detailPage(i.orderId)">{{i.orderNo}}</a>
					</td>
                    <td>
						<a class="operation" @click="agencyName(i)">{{i.agencyName|changeRecruiters}}</a>
					</td>
                    <td v-if="tableType!=0&&i.signInTime!=null">{{$base.formatTimeToMDHM(i.signInTime)}}</td>
					<td v-else-if="tableType!=0&&i.signInTime==null"><p class="striping">—</p></td>

                    <td v-if="tableType!=0&&i.clockTimeStart!=null" class="workTime">
						<span>{{$base.formatTimeToMDHM(i.clockTimeStart)}}</span>
						<el-tooltip placement="bottom" :effect="'light'">
                            <div class="content" slot="content" style="font-size: 14px;">
                                <div><p style="font-size:12px;color:#666;">{{$base.formatTimeToMDHM(i.times)}} &nbsp;{{i.creatorName}}({{i.postTitle}})</p><p style="font-size:12px;color:#666;margin-top:5px;">补卡原因：{{i.comment}}</p></div>
                            </div>
                            <img src="../../../assets/img/butime.png" alt="" v-if="i.comment">
                        </el-tooltip>
					</td>
					<td v-else-if="tableType!=0&&i.clockTimeStart==null"><p class="striping">—</p></td>

                    <td v-if="tableType!=0&&i.clockTimeEnd!=null" class="overWorkTime">
						<span>{{$base.formatTimeToMDHM(i.clockTimeEnd)}}</span>
						<el-tooltip placement="bottom" :effect="'light'">
                            <div class="content" slot="content" style="font-size: 14px;">
                                <div><p style="font-size:12px;color:#666;">{{$base.formatTimeToMDHM(i.times)}} &nbsp;{{i.creatorName}}{{(i.postTitle)}}</p><p style="font-size:12px;color:#666;margin-top:5px;">补卡原因：{{i.comment}}</p></div>
                            </div>
                            <img src="../../../assets/img/butime.png" alt="" v-if="i.comment">
                        </el-tooltip>
					</td>
					<td v-else-if="tableType!=0&&i.clockTimeEnd==null"><p class="striping">—</p></td>

                    <!-- <td v-if="tableType==3&&i.signOutTime!=null">{{$base.formatTimeToMDHM(i.signOutTime)}}</td> -->
					<!-- <td v-else-if="tableType==3&&i.signOutTime==null"><p class="striping">—</p></td> -->

					<td v-if="tableType==0">未签到</td>				
                </tr>
			</tbody>		
		</table>
		<div class="recruiters">
			<el-dialog
				title="查看详情"
				:visible.sync="centerDialogVisible"
				width="30%"
				center>
				<div class="recruitersone"><span>招聘者：</span><span>{{recruiter}}</span></div>
				<div class="recruiterstwo"><span>联络人：</span><span>{{personName}}</span></div>
				<div class="recruitersthe"><span>手机号码：</span><span>{{phone}}</span></div>
				<span slot="footer" class="dialog-footer" @click="centerDialogVisible = false">
					<span>关闭</span>
				</span>
			</el-dialog>
		</div>
		<div class="discharge">
			<el-dialog
				title="辞退"
				:visible.sync="dialogVisible"
				width="530px"
				top="30.3vh">
				<BatchOperationMessage ref="BatchOperationMessage" :batch="'batch'"></BatchOperationMessage>
				<div class="dialogBtn">
					<div class="sub" @click="refuse">确定</div>
					<div class="cancel" @click="abolish">取消</div>
				</div>  
			</el-dialog>
		</div>
		<div class="clockTimeStart">
			<el-dialog
				title="补卡"
				:visible.sync="dialogVisibleClockTimeStart"
				width="530px"
				top="30.3vh">
				<div class="workerTime" v-if="workTime"><span>上班时间：</span>
					<el-date-picker
						v-model="startTime"
						type="datetime"
						:clearable="false"
						value-format="timestamp" 
						:picker-options="PickerOptions"
						placeholder="请选择" @focus="focus1=true" @blur="focus1=false">
					</el-date-picker>
					<i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
				</div>
				<div class="workerTime" v-else><span>上班时间：</span><span style="margin-left:5px;">{{$base.formatTimeToMDHM(workday)}}</span></div>
				<div class="workerTime" v-if="overWorkTime"><span>下班时间：</span>
					<el-date-picker
						v-model="endTime"
						type="datetime"
						:clearable="false"
						value-format="timestamp" 
						:picker-options="PickerOptions1"
						placeholder="请选择" @focus="focus2=true" @blur="focus2=false">
					</el-date-picker>
					<i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
				</div>
				<div class="workerTime" v-else><span>下班时间：</span><span style="margin-left:5px;">{{$base.formatTimeToMDHM(overWorkday)}}</span></div>
				<div class="txtWrap">
                    <div class="label">补卡原因：</div>
                    <textarea placeholder="请输入" v-model="obj.txt" maxlength="200" :class="{'textareaBorder': textareaBorder}" @input="handlResion"></textarea>
                    <div class="txtNum">{{obj.txt.length}}/200</div>
                    <p v-if="textareaBorder"><img src="../../../assets/img/prompt1.svg" alt=""><span>字数不可超过200字</span></p>
                </div>
				<div class="dialogBtn">
					<div class="sub" @click="goToWork">确定</div>
					<div class="cancel" @click="makeNewCard">取消</div>
				</div>  
			</el-dialog>
		</div>
		<div class="accommodation">
			<el-dialog
				title="住宿"
				:visible.sync="accommodationDialogVisible"
				width="450px"
				top="30.3vh"
				center>
				<div class="accommodation1"><span>确认安排“ {{residents}} ”住宿吗？</span></div>
				<div class="accommodation2"><img src="../../../assets/img/prompt1.svg" alt=""><span>确认后，将进入“住宿管理”的"待确认"</span></div>
				<div class="dialogBtn">
					<div class="sub" @click="accommodationSure(list)">确定</div>
					<div class="cancel" @click="accommodationDialogVisible=false">取消</div>
				</div>  
			</el-dialog>
		</div>
		<div :style="{width:screenWidth}" class="scrollWrap" v-if="tableType == 3">
			<table style="width:100%" class="table" :style="{width:tableWidth}">
				<thead>
					<tr>
						<th class="fixed width120">操作</th>
						<th class="width60">序号</th>
						<th class="width60">姓名</th>
						<th class="width100">用工日期</th>
						<!--  -->
						<th v-for="(i,k) in dataList1" :key="k">{{i.fieldName}}</th>
						<!--  -->
						<th class="width120"><div>核算费用 (元)</div></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(i,k) in dataList2" :key="k">
						<!-- <td class="width60 op0">
							<div class="checkBox" :class="{'border':checkBoxList[k]}">
								<div class="checked" v-if="checkBoxList[k]"></div>
							</div>
						</td> -->
						<td class="width120 op0">
							<a class="clickArea">奖惩</a>
							<a class="clickArea ml20">调整考勤</a>
						</td>
						<td class="width60 op0">{{k+1}}</td>
						<td class="width60 op0">{{i.workerName}}</td>	
						<td class="width100 op0">{{$base.formattingTime(i.workerDate)}}</td>
						<!--  -->
						<td v-for="(j,a) in dataHead(i)" :key="a">{{j}}</td>
						<!--  -->
						<td class="width120"><div class="op0">{{(i.calCost?i.calCost/100:0).toFixed(2)}}</div></td>
					</tr>
				</tbody>
			</table>
			<table class="tableleft">
				<thead>
					<tr>
						<!-- <th class="width60">
							<div class="checkBox" :class="{'border':allChecked}" @click="allCheckedBtn">
								<div class="checked" v-if="allChecked"></div>
							</div>
						</th> -->
						<th class="width120">操作</th>
						<th class="width60">序号</th>
						<th class="width60">姓名</th>
						<th class="width100">用工日期</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(i,k) in dataList2" :key="k">
						<!-- <td class="width80">
							<div class="checkBox" :class="{'border':checkBoxList[k]}" @click="checkBtn(k)">
								<div class="checked" v-if="checkBoxList[k]"></div>
							</div>
						</td> -->
						<td class="width120">
							<a class="clickArea" @click="rewards(i)">奖惩</a>
							<a class="clickArea ml20" @click="adjustAttendance(i)">调整考勤</a>
						</td>
						<td class="width60">{{k+1}}</td>
						<td class="width120">{{i.workerName}}</td>
						<td class="width100">{{$base.formattingTime(i.workerDate)}}</td>
					</tr>
				</tbody>
			</table>
			<table class="tableright">
				<thead>
					<tr>
						<th class="width120">核算费用 (元)</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(i,k) in dataList2" :key="k">
						<td class="width120">{{calCost(i).toFixed(2)}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
import BatchOperationMessage from '../../common/batchOperationMessage2'
export default {
    name: 'rewardsAndPunishments',
    props: ['dataList','tableType','orderInit','dataList1','dataList2'],
    data () {
        return {
			allChecked: false,    //草稿箱全选反选
			singleChecked: [],
			dataListParams: {
                current: 1,
                size: 8
			},
			obj: { txt:'' },
			agencyId: this.dataList.agencyId,
			centerDialogVisible: false,
			recruiter: '',
			personName: '',
			workerName: '',
			phone: '',
			startTime: '',
			endTime: '',
			residents: '',
			workerId: '',
			list: '',
			id: '',
			postId: '',
			postTitle: '',
			recordId: '',
			signTime: '',
			screenWidth: '',
			tableWidth: '',
			focus1: false,
			focus2: false,
			fas: [],
			dialogVisible: false,
			workday: '',
			overWorkday: '',
			state: [],
			workTime: false,
			overWorkTime: false,
			textareaBorder: false,
			accommodationDialogVisible: false,
			dialogVisibleClockTimeStart: false,
			dialogVisibleClockTimeEnd: false
        }
    },
    watch:{
		dataList() {
			this.init()
		},
		dataList1() {
			if(this.tableType==3){
				this.tableResize()
			}
		}
	},
    mounted() {
		this.tableResize()
		window.onresize = ()=>{
			this.tableResize()
		}
	},
	filters:{
		changeType(val){
			if(val == 'reward'){
				return '奖励'
			}else{
				return '惩罚'
			}
		},
		changeRecruiters(val){
			if(val){
				return val.substring(0,6) + "..."
			}else{
				return ''
			}
		},
		minusSign(val){
            if(val<0){
                return val = -val
            }else{
                return val = val
            }
        }
	},
	computed: {
		PickerOptions() {
			let _this = this
			return{
				disabledDate(time) {
					if(_this.endTime&&!_this.overWorkday){
						return time.getTime() > _this.endTime||time.getTime() <_this.endTime - 8.64e7
					}else if(!_this.endTime&&_this.overWorkday){
						return time.getTime() > _this.overWorkday||time.getTime() <_this.overWorkday - 8.64e7
					}else if(!_this.endTime&&!_this.overWorkday){
						return time.getTime() > _this.signTime + 8.64e7||time.getTime() <_this.signTime - 8.64e7
					}
				}
			}
		},
		PickerOptions1() {
			let _this = this
			return{
				disabledDate(time) {
					if(_this.workday&&!_this.startTime){
						return time.getTime() > _this.workday + 8.64e7||time.getTime() <_this.workday 
					}else if(!_this.workday&&_this.startTime){
						return time.getTime() > _this.startTime + 8.64e7||time.getTime() <_this.startTime 
					}else if(!_this.workday&&!_this.startTime){
						return time.getTime() > _this.signTime + 8.64e7||time.getTime() <_this.signTime - 8.64e7
					}
				}
			}
		}
	},
    methods: {
		calCost(i) {
			return (i.calCost+(i.adjustWorkTime/1000/60/60)*i.onDayshift+i.allowanceCost+i.workerPerformanceAmount+i.adjustWorkCost)/100
		},
		dataHead(data) {
			// console.log(data)
			let arr = []
			this.dataList1.forEach(i=>{
				for(let j in data) {
					if(i.field==j){
						if(i.field=='postId'){
							arr.push(data.postName)
						}else if(i.field=='workerCertNo'){
							arr.push(`**************${data.workerCertNo.substring(data.workerCertNo.length-4,data.workerCertNo.length)}`)
						}else if(i.field=='workTimeStart'){
							arr.push(`${this.$base.timeplateTohm(data.workTimeStart)} - ${this.$base.timeplateTohm(data.workTimeEnd)}`)
						}else if(i.field=='signInTime'){
							arr.push(this.$base.formattingHover(data.signInTime))
						}else if(i.field=='signOutTime'){
							arr.push(this.$base.formattingHover(data.signOutTime))
						}else if(i.field=='workTotalTime'){
							arr.push(this.$base.timeplateToZhCn(data.workTotalTime))
						}else if(i.field=='totalTime'){
							arr.push(this.$base.timeplateToZhCn(data.totalTime))
						}else if(i.field=='mealTotalTime'){
							arr.push((data.mealTotalTime/(1000*60*60)).toFixed(2))
						}else if(i.field=='restTime'){
							arr.push(data.restTime/(1000*60*60))
						}else if(i.field=='planTime'){
							arr.push(data.planTime/(1000*60*60))
						}else if(i.field=='earlyArrivalTime'){
							arr.push(data.earlyArrivalTime/(1000*60*60)+'小时')
						}else if(i.field=='goLateTime'){
							arr.push(data.goLateTime/(1000*60*60)+'小时')
						}else if(i.field=='onDayshiftTime'){
							arr.push(data.onDayshiftTime/(1000*60*60))
						}else if(i.field=='onDayshift'){
							arr.push(data.onDayshift/100)
						}else if(i.field=='onNightshiftTime'){
							arr.push(data.onNightshiftTime/(1000*60*60))
						}else if(i.field=='onNightshift'){
							arr.push(data.onNightshift/100)
						}else if(i.field=='workTime'){
							arr.push((data.workTime/(1000*60*60)).toFixed(2))
						}else if(i.field=='adjustWorkTime'){
							arr.push(data.adjustWorkTime/(1000*60*60))
						}else if(i.field=='calTime'){
							arr.push((data.calTime/(1000*60*60)).toFixed(2))
						}else if(i.field=='adjustWorkCost'){
							arr.push(data.adjustWorkCost/100)
						}else if(i.field=='allowanceCost'){
							arr.push(data.allowanceCost/100)
						}else if(i.field=='clockTimeStart'){
							arr.push(this.$base.formattingHover(data.clockTimeStart))
						}else if(i.field=='clockTimeEnd'){
							arr.push(this.$base.formattingHover(data.clockTimeEnd))
						}else if(i.field=='workerPerformanceAmount'){
							arr.push((data.workerPerformanceAmount/100).toFixed(2))
						}else if(i.field=='deductMealMode'){
							if(data.deductMealMode=='fact'){
								arr.push('根据实际用餐扣减')
							}else if(data.deductMealMode=='plan'){
								arr.push('根据用工计划扣减')
							}else{
								arr.push('根据用工计划/实际用餐的最多次数扣减')
							}
						}
						else{
							arr.push(data[j])
						}
					}
				}
			})
			return arr
		},
		init() {
			console.log(this.dataList1)
			this.allChecked = false
	 		this.singleChecked = []
	 		for (let i = 0;i<this.dataList.length;i++) {
				this.singleChecked.push(false)	
				this.fas.push(false)
				this.state.push(true)
			}
		 },
		 
		agencyName(data){
			this.centerDialogVisible = !this.centerDialogVisible
			this.$axios({
					method: 'get',
					url: this.$urls.getRecruiters + data.agencyId
				}).then(res=>{
					this.recruiter = res.data.name
					this.personName = res.data.legal
					this.phone = res.data.phone
				})
		},
		detailPage(id){
			let params = {title:'查看用工单',operation:0,type:'detailPage',id}
			this.$store.dispatch('detailPage',params)
		},
		allCheckedBtn(){
			this.allChecked = !this.allChecked
			this.singleChecked = this.singleChecked.map(i=>{
				if(i!=null){
					return this.allChecked
				}
			})
		},
		singleCheckedBtn(k){
			this.singleChecked = this.singleChecked.map((i,key)=>{
				if(k == key){
					return !i
				}
				this.allChecked = false
				return i
			})
		},
		returnCheckArr() {
			let arr = []
			this.singleChecked.forEach((i,k)=>{
				if (i) {
					arr.push({id: this.dataList[k].id,workerId: this.dataList[k].workerId})
				}
			})
			return arr
		},
		handleClick(data) {
			this.centerDialogVisible = !this.centerDialogVisible
			this.$axios({
					method: 'get',
					url: this.$urls.getRecruiters + data.agencyId
				}).then(res=>{
					this.recruiter = res.data.name
					this.personName = res.data.legal
					this.phone = res.data.phone
				})
		},
		personalInformations(item){
			this.workerId = item.workerId
			this.dialogVisible = !this.dialogVisible
		},
		accommodation(data,k){
			this.accommodationDialogVisible = !this.accommodationDialogVisible
			this.residents = data.workerName
			this.workerId = data.workerId
			this.id = data.id
			this.list = k
		},
		 employeeWorkInformation(id) {
			let params = {title:'个人信息',operation:0,type:'employeeWorkInformation',id}
			this.$store.dispatch('employeeWorkInformation',params)
		 },
		 refuse(){
			 this.$axios({
				 method: 'post',
				 url: this.$urls.remove,
				 data: { removeVo:{
					 remark: this.$refs.BatchOperationMessage.obj.txt,
					 state: this.$refs.BatchOperationMessage.obj.checked,
					 workerId: this.workerId
				 } }
			 }).then(res=>{
				 console.log(res)
				 if(res.data.message == '成功'){
					 this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000,			
                    })
				 }else{
					 this.$message({
                        message: "操作失败",
                        type: 'error',
                        duration: 5 * 1000,			
                    })
				 }
			 }).catch(err=>{

			 })
			 this.dialogVisible = false
		 },
		 newCard(i,k) {
			console.log(i)
			this.signTime = i.signInTime
			this.postId = i.postId
			this.postTitle = i.postName
			this.recordId = i.id
			this.workday = i.clockTimeStart
			this.overWorkday = i.clockTimeEnd
			if(i.clockTimeStart==null&&i.clockTimeEnd){
				this.workTime=true
				this.overWorkTime = false
			}else if(i.clockTimeStart==null&&i.clockTimeEnd==null){
				this.workTime=true
				this.overWorkTime = true
			}
			if(i.clockTimeStart&&i.clockTimeEnd==null){
				this.workTime=false
				this.overWorkTime = true
			}
			this.dialogVisibleClockTimeStart = true
		 },
		 handlResion() {
			 if(this.obj.txt.length==200){
                this.textareaBorder = true
            }else if(this.obj.txt.length<200){
                this.textareaBorder = false
            }
		 },
		 goToWork(){
			 if(!this.startTime||!this.endTime){
				 this.$message({
					 message: '请选择补卡时间',
					 type: 'error',
					 duration: 5*1000
				 })
				 return
			 }
			 if(!this.obj.txt){
				 this.$message({
					 message: '原因不可为空',
					 type: 'error',
					 duration: 5*1000
				 })
				 return
			 }
			 this.$axios({
				 method: 'post',
				 url: this.$urls.addition,
				 data:{
					recordId: this.recordId,
					remark: this.obj.txt,
					clockTimeStart: this.startTime,
					clockTimeEnd: this.endTime?this.endTime:'',
					postId: this.postId,
					postTitle: this.postTitle
				 }
			 }).then(res=>{
				 if(res.data.message == '成功'){
					 this.orderInit()
					 this.startTime = ''
					  this.endTime = ''
					  this.obj.txt = ''
					 this.$message({
                        message: "补录成功",
                        type: 'success',
                        duration: 5 * 1000,			
                    })
				 }else{
					 this.$message({
                        message: res.data.message,
                        type: 'error',
                        duration: 5 * 1000,			
                    })
				 }
			 })
			 this.dialogVisibleClockTimeStart = false
		 },
		 makeNewCard() {
			 this.startTime = ''
			 this.endTime = ''
			 this.obj.txt = ''
			 this.dialogVisibleClockTimeStart = false
		 },
		 startWork(data) {
			 this.id = data.id
			 this.workerName = data.workerName
			 this.dialogVisibleClockTimeStart = true
		 },
		 endWork(data) {
			 this.id = data.id
			 this.workerName = data.workerName
			 this.dialogVisibleClockTimeEnd = true
		 },
		 accommodationSure(k){
			 this.$axios({
				 method: 'post',
				 url: this.$urls.addLodging,
				 data:[{id: this.id, workerId: this.workerId}]
			 }).then(res=>{
				 if(res.data.status==200){
					 this.state = this.state.map((i,key)=>{
						 if(k == key){
							 return !i
						 }
						 return i
					 })
					 this.fas = this.fas.map((i,key)=>{
						 if(k == key){
							 return !i
						 }
						 return i
					 })
					 this.$message({
                        message: "住宿操作成功",
                        type: 'success',
                        duration: 5 * 1000,			
                    }) 
				 }
			 })
			 this.accommodationDialogVisible = false
		 },
		 rewardsAndPunishmentsPage(id){
			 let params = {}
			 params = {title:'奖惩',type:'rewardsAndPunishmentsPage',operation:0,id}
			 this.$store.dispatch('rewardsAndPunishmentsPage',params)
		 },
		 abolish() {
			 this.$refs.BatchOperationMessage.obj.txt = ''
			 this.$refs.BatchOperationMessage.promptShow = false
			 this.dialogVisible=false
		 },
		 modulationInformations(id) {
			 console.log(id)
			 let params = {}
			 params = {title:'调整考勤',type:'modulationInformations',operation:0,id}
			 this.$store.dispatch('modulationInformations',params)
		 },
		 rewards(data) {
			 this.$store.dispatch('costRewards1',{panelType:'out',data})
		 },
		 adjustAttendance(data) {
			 this.$store.dispatch('adjustAttendance1',{panelType:'out',data})	
		 },
		 tableResize() {
			window.screenWidth = document.body.clientWidth-250
			this.screenWidth = window.screenWidth + 'px'
			this.tableWidth = 110*this.dataList1.length<window.screenWidth?this.screenWidth:110*this.dataList1.length + 'px'
		}
	},
	components:{
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
	.checked{
		width: 8px;
		height: 8px;
		background-color: #4c8aff;
	}
}
.scrollWrap{
	overflow-x: scroll;
	.tableleft,.tableright{
		position: absolute;
		border-collapse: collapse;
		z-index: 10;
		background-color: #fff;
		thead{		
			tr{
				height: 47px;
				border-bottom:2px solid #4c8aff;
				th{
					height: 17px;
					line-height: 17px;
					color: #444950;
					font-size: 12px;
				}
			}
		}
		tbody{
			tr{
				height: 47px;
				background-color: #f4f8fc;
				td{
					height: 17px;
					line-height: 17px;
					text-align:center;
					font-size: 12px;
					color: #444950;
					.clickArea{
						color: #4c8aff;
						cursor: pointer;
					}
					.clickAreaRed{
						color: #e45a3c;
						cursor: pointer;
					}
					.ml20{
						margin-left: 20px;
					}
					.mr20{
						margin-right: 20px;
					}
				}
			}
			tr:nth-of-type(2n){
				background-color: #fff;
			}
		}
	}
	.width-80{
		width: 80%;
	}
	.tableleft{
		left: 210px;
		top: 266px;
		width: 330px;
		max-width: 400px;
		// background: #ccc;
	}
	.tableright{
		right: 40px;
		top: 266px;
	}
}
.workTime,.overWorkTime{
	img{
		width: 12px;
		height: 12px;
		margin: -1px 0 0 5px;
		cursor: pointer;
	}
}

.border{
	border: 1px solid #4c8aff;
}
.striping{
	color: #d4d4d4;
}
.width60{
	width: 60px;
}
.width120{
	width: 120px;
}
.op0{
	opacity: 0;
}
.min-width{
	min-width: 200px; 
}
.min-width1{
	min-width: 90px;
}
.min-width2{
	min-width: 50px;
}
.minW{
    min-width: 30px;
}
.minW50{
    min-width: 100px;
}
.department{
	min-width: 60px;
}
.RewardsAndPunishments{
	margin-left: 0px;
	color: #4c8aff;  
	cursor: pointer;
}
.accommodation{
	margin-left: 22px;
	color: #4c8aff;
	cursor: pointer;
}
.attendance{
	margin-left: 10px;
	color: #4c8aff;
	cursor: pointer;
}
.operation{
	color: #4c8aff;
	cursor: pointer;
}
.refuse{
	margin-left: 22px;
	color: #e45a3c;
	cursor: pointer;
}
.line{
	color: #d4d4d4;
}
.accommodationcolor{
	margin-left: 22px;
	color: #d4d4d4;
}
.null{
	width: 24px;
	height: 1px;
	background-color: #d4d4d4;
	margin: 0 auto;
	line-height: 0;
}
.recruiters{
	.recruitersone{
		width: 255px;
		height: 20px;
		margin: 20px auto;
		font-size: 14px;
		color: #444950;
	}
	.recruiterstwo{
		width: 100px;
		height: 20px;
		margin-left: 72px;
		font-size: 14px;
		color: #444950;
	}
	.recruitersthe{
		width: 200px;
		height: 20px;
		margin-left: 72px;
		margin-top: 20px;
		font-size: 14px;
		color: #444950;
	}
}
.accommodation{
	.accommodation1{
		width: 175px;
		height: 20px;
		margin: 45px 85px 0px;
		font-size: 14px;
		color: #444950;
	}
	.accommodation2{
		width: 236px;
		height: 20px;
		margin-left: 85px;
		margin-top: 5px;
		font-size: 12px;
		color: #666666;
		img{
			width: 12px;
			height: 12px;
			float: left;
			margin-top: 2px;
			margin-right: 5px;
		}
	}
}
.discharge{
	.dialogBtn{
		.cancel{
			margin-left: 60px;
		}
	}
}
.clockTimeStart{
	.txtWrap{
		float: left;
        overflow:hidden;
		margin-left: 20px;
        .label{
            float:left;
            height: 20px;
            line-height:20px;
            font-size: 14px;
            color: #444950;
        }
        textarea{
            width:390px;
            height:90px;
            font-size:14px;
            border: solid 1px #ececec;
            color: #444950;
            outline:none;
            resize:none;
            padding:5px 10px;
            box-sizing:border-box;
            float:left;
            margin-left: 4px;
        }
        textarea::-webkit-input-placeholder{
            font-size: 14px;
            color:#999999;;
        }
        textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
            font-size: 14px;
            color:#999999;
        }
        textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
            font-size: 14px;
            color:#999999;
        }
        textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
            font-size: 14px;
            color:#999999;
        }
        .textareaBorder{
            border-color: #e45a3c;
        }
        .txtNum{
            position:absolute;
            top: 248px;
            right:42px;
            font-size: 14px;
            color: #999999;
            bottom:5px;
		}
		p{
			float: left;
			margin-left: 74px;
			margin-top: 3px;
			font-size: 12px;
			color: #e45a3c;
			img{
				float: left;
				width: 13px;
				height: 12px;
				margin-top: 2px;
				margin-right: 5px;
			}
		}
    }
	.workerTime{
		font-size: 14px;
		color: #444950;
		margin: 30px auto;
		position: relative;
		span{
			margin-left: 20px;
		}
		i{
			position: absolute;
			right: 237px;
			top:4px;
			color: #c0c4cc;
			transition: all .2s;
		}
		.focus1{
			transform: rotate(180deg);
		}
	}
	.dialogBtn{
		width: 100%;
		display: flex;
		justify-content: center;
		margin-left: -115px;
		.cancel{
			margin-left: 60px;
		}
	}
}
</style>
