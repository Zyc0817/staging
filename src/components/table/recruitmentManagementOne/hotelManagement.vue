<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
                    <th width="50">
                        <div class="theBox" :class="{'theBoxBorder': bordercolor}" @click="allList"><div class="bluebox" v-if="bordercolor"></div></div>  
                    </th>
                    <th width="200" v-if="tableType==0" v-cloak>操作</th>
					<th width="130">序号</th>
                    <th width="150">姓名</th>
                    <th width="130">性别</th>
                    <th width="150">用工部门</th>
                    <th width="180">工作日期</th>
                    <th width="180" class="min-width">工作时间</th>
                    <th width="200">招聘者</th>
                    <th width="180">入住时间</th>
                    <th width="180">退宿时间</th>
                    <th width="150">状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
                    <td>
                        <div class="theBox" :class="{'theBoxBorder': chooseList[k]}" @click="Asingle(k)"><div class="bluebox" v-if="chooseList[k]"></div></div>  
                    </td>
                    <td v-if="tableType==0" v-cloak>
                        <a class="operation" @click="checkIn(i)">入住</a>
                        <a class="sendback" @click="returnBlack(i)">退回</a>
                    </td>
                    <td>{{k+1}}</td>
                    <td>
						<a class="operation" @click="employeeWorkInformation(i)">{{i.name}}</a>
					</td>
                    <td>{{i.gender | changSex}}</td>
                    <td>{{i.departmentName}}</td>
                    <td>{{$base.formattingTime(i.workDate)}}</td>
                    <td>{{$base.timeplateTohm(i.startDate)}} - {{$base.timeplateTohm(i.endDate)}}</td>
                    <td>
                        <a class="operation" @click="handleClick(i)">{{i.agencyName | changeRecruiters}}</a>
                    </td>
                    <td v-if="i.checkInTime&&(tableType==2||tableType==1)">{{$base.formattingTime(i.startTime)}} &nbsp;{{$base.formattingHover(i.checkInTime)}}</td>
                    <td v-else class="CheckTime"><p>——</p></td>
                    <td v-if="i.checkOutTime&&tableType==2">{{$base.formattingTime(i.endTime)}} &nbsp;{{$base.formattingHover(i.checkOutTime)}}</td>
                    <td v-else class="CheckTime"><p>——</p></td>
                    <td v-if="tableType==0">{{"待确认"}}</td>
                    <td v-if="tableType==1">{{"住宿中"}}</td>
                    <td v-if="tableType==2">{{"已退宿"}}</td>
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
				title="入住"
				:visible.sync="dialogVisible"
				width="530px"
				top="30.3vh">
                <p>确认安排“{{checkInName}}”入住吗？</p>
				<BatchOperationMessage ref="BatchOperationMessage"></BatchOperationMessage>
				<div class="dialogBtn">
					<div class="sub" @click="refuse">确定</div>
					<div class="cancel" @click="cancelCheckIn">取消</div>
				</div>  
			</el-dialog>
		</div>
        <div class="blackTo">
			<el-dialog
				title="退回"
				:visible.sync="dialogVisibleBlack"
				width="450px"
				top="30.3vh">
				<div class="messageWrap batchOperationMessage minHeight">
                    <div class="backWrap">
                        <div class="txtWrap">
                            <div class="label">退回原因：</div>
                            <textarea placeholder="请输入" v-model="obj.txt" :class="{'border':textareaColor}" @input="writtenLength" maxlength="1000"></textarea>
                            <div class="txtNum">{{obj.txt.length}}/1000</div>
                        </div>
                        <div class="promptInformation" v-if="promptShow"><img src="../../../assets/img/prompt1.svg" alt=""><span>字数不可超过1000字</span></div>
                    </div>
                </div>
				<div class="dialogBtn">
					<div class="sub" @click="confirm">确定</div>
					<div class="cancel" @click="cancelReturn">取消</div>
				</div>  
			</el-dialog>
		</div>
	</div>
</template>
<script>
import BatchOperationMessage from '../../common/batchOperationMessageThe'
export default {
    name: 'hotelManagement',
    props: ['dataList','tableType','order'],
    data () {
        return {
            obj: {
                txt: ''
            },
			dataListParams: {
                current: 1,
                size: 8
			},
			agencyId: this.dataList.agencyId,
            centerDialogVisible: false,
            dialogVisible: false,
            dialogVisibleBlack: false,
            bordercolor: false,
            textareaColor: false,
            promptShow: false,
			recruiter: '',
			personName: '',
            phone: '',
            checkInName: '',
            chooseList: [],
            LodgeId: ''
        }
    },
    watch:{
        dataList() {
            this.init()
        }
	},
    created() {
        this.init()
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
			if(val&&val.length>6){
				return val.substring(0,6) + "..."
			}else if(val&&val.length<=6&&val.length>0){
				return val
			}
		},
		minusSign(val){
            if(val<0){
                return val = -val
            }else{
                return val = val
            }
        },
        changSex(val) {
            if(val == 'male'){
                return '男'
            }else{
                return '女'
            }
        }
	},
    methods: {
        init(){
            this.bordercolor = false
            this.chooseList = []
            for(let i=0; i<this.dataList.length; i++){
                this.chooseList.push(false)
            }
        },
        checkIn(i) {
            this.dialogVisible = true
            this.LodgeId = i.lodgId
            this.checkInName = i.name
        },
        returnBlack(i) {
            this.dialogVisibleBlack = true
            this.LodgeId = i.lodgId
        },
        allList() {
            this.bordercolor = !this.bordercolor
            this.chooseList = this.chooseList.map(i=>{
                if(i!=null){
                    return this.bordercolor
                }
            }) 
        },
        Asingle(k) {
            this.chooseList = this.chooseList.map((i,key)=>{
                if(key == k){
                    return !i
                }
                this.bordercolor = false
                return i 
            })
        },
        refuse() {
            this.$axios({
                method: 'post',
                url: this.$urls.add,
                data: {
                    LodgeId: [this.LodgeId],
                    remark: this.$refs.BatchOperationMessage.obj.txt
                }
            }).then(res=>{
                if(res.data.message == '成功'){
                    this.order()
                    this.$message({
                        message: "入住成功",
                        type: 'success',
                        duration: 5 * 1000,			
                    })
                }else{
                    this.$message({
                        message: "入住失败",
                        type: 'error',
                        duration: 5 * 1000,			
                    })
                }
            }).catch(err=>{
                this.$message({
                        message: "错误",
                        type: 'error',
                        duration: 5 * 1000,			
                    })
            })
            this.$refs.BatchOperationMessage.obj.txt = ''
            this.dialogVisible=false
        },
        cancelCheckIn() {
            this.$refs.BatchOperationMessage.obj.txt = ''
            this.$refs.BatchOperationMessage.borderColor = false
            this.$refs.BatchOperationMessage.promptShow = false
            this.dialogVisible = false
        },
        confirm() {
            this.$axios({
                method: 'post',
                url: this.$urls.del,
                data: {
                    LodgeId: [this.LodgeId],
                    remark: this.obj.txt
                }
            }).then(res=>{
                if(res.data.message == '成功'){
                    this.order()
                    this.$message({
                        message: "退回成功",
                        type: 'success',
                        duration: 5 * 1000,			
                    })
                }else{
                    this.$message({
                        message: "退回失败",
                        type: 'error',
                        duration: 5 * 1000,			
                    })
                }
            }).catch(err=>{
                this.$message({
                        message: "错误",
                        type: 'error',
                        duration: 5 * 1000,			
                    })
            })
            this.obj.txt = ''
            this.dialogVisibleBlack = false
        },
        cancelReturn() {
            this.obj.txt = ''
            this.promptShow = false
			this.textareaColor = false
            this.dialogVisibleBlack = false
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
		 personalInformations(id,val) {
			let params = {title:'个人信息',operation:0,type:'recruitmentManagement',id,val}
			this.$store.dispatch('personalInformations',params)
         },
         returnCheckArr() {
             let arr = []
             this.chooseList.forEach((i,k)=>{
                 if(i){
                     arr.push(this.dataList[k].lodgId)
                 }
                 
             })
             return arr
         },
         employeeWorkInformation(id) {
            //  console.log(id)
			let params = {title:'个人信息',operation:1,type:'employeeWorkInformation',id}
			this.$store.dispatch('employeeWorkInformation',params)
         },
         writtenLength() {
             if(this.obj.txt.length==1000){
				this.promptShow = true
				this.textareaColor = true
			}else if(this.obj.txt.length==0||this.obj.txt.length<1000){
				this.promptShow = false
				this.textareaColor = false
			}
         }
    },
    components: {
        BatchOperationMessage
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
[v-cloak]{
    display: none;
}
.minW{
    min-width: 30px;
}
.minW50{
    min-width: 60px;
}
.min-width{
    min-width: 180px;
}
.operation{
    color: #4c8aff;
    cursor: pointer;
}
.back{
    color: #e45a3c;
    cursor: pointer;
}
.line{
	color: #d4d4d4;
}
.CheckTime{
    p{ color: #ccc; }
}
.theBox{
    width: 16px;
    height: 16px;
    margin-left: 25px;
    border: 1px solid #d4d4d4;
    cursor: pointer;
    .bluebox{
        width: 8px;
        height: 8px;
        background: #4c8aff;
        margin: 4px auto;
    }
}
.theBoxBorder{
    border: 1px solid #4c8aff;
}
.sendback{
    margin-left: 15px;
    color: #e45a3c;
    cursor: pointer;
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
.discharge{
    p{
      width: 170px;
      margin: 30px auto;
  }
  .dialogBtn{
      .cancel{
          margin-left: 60px;
      }
  }
}
.blackTo{
    .minHeight{
	    height:206px;
}
.messageWrap{
	.backWrap{
        margin-top:20px;
        .promptInformation{
            float: left;
			height: 17px;
			margin-left: 82px;
			margin-top: 10px;
			img{
				float: left;
				width: 12px;
				height: 12px;
				margin-top: 2.5px;
				margin-right: 5px;
			}
			span{
				font-size: 12px;
				color: #e45a3c;
			}
		}
	}
	.txtWrap{
        float: left;
		overflow:hidden;
		margin:30px 5px 0 5px;
		position:relative;
		.label{
			float:left;
			height: 20px;
			line-height:20px;
			font-size: 14px;
			color: #444950;
		}
		textarea{
			width:330px;
			height:90px;
			font-size:14px;
			border: solid 1px #ececec;
			color: #444950;
			outline:none;
			resize:none;
			padding:5px 10px;
			box-sizing:border-box;
			float:left;
			margin-left:10px;
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
        textarea::-webkit-scrollbar{
            display: none;
        }
        textarea::-ms-scrollbar{
            display: none;
        }
        textarea:-ms-scrollbar{
            display: none;
        }
        textarea::-moz-scrollbar{
            display: none;
        }
        textarea:-moz-scrollbar{
            display: none;
        }
        .border{
            border: solid 1px #e45a3c;
        }
		.txtNum{
            position:absolute;
            top: 71px;
			right:14px;
			font-size: 14px;
			color: #999999;
			bottom:5px;
		}
	}
}
}
</style>
