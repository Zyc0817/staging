<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th width="200" class="first">操作</th>
					<th width="120">序号</th>
					<th width="150">姓名</th>
					<th width="150">性别</th>
                    <th width="150">年龄</th>
					<th width="150">类型</th>
					<th width="200" v-if="enble=='enble'">拉黑原因</th>
					<th width="180" v-if="enble=='disenble'">手机号</th>
					<th width="150" v-if="enble=='disenble'">工作次数</th>
					<th width="180" v-if="enble=='disenble'">累计工时</th>
                    <th width="180" v-if="enble=='disenble'">本月工时</th>
				</tr>
			</thead>
			<tbody v-if="dataList.length>0">
				<tr v-for="(i,k) in dataList" :key="k">
					<td>
						<a v-if="i.state != 'enable'" class="approval" @click="personalInformationOne(i)">编辑</a>
						<a v-if="i.state != 'enable'" class="back" @click="back(i.workerId)">标记</a>
						<a v-if="i.state == 'enable'" class="back" @click="remove(i.workerId)">移除</a>
					</td>
					<td>{{k+1}}</td>
					<td @click="personalDetails(i.state,i)">
						<a class="clickArea">{{i.name}}</a>
					</td>
					<td>{{i.gender | sex}}</td>
					<td>{{$base.age(i.birthday)}}</td>
					<td>{{i.category | TypeOfWork}}</td>
					<td v-if="enble=='enble'">{{i.remark|cutOut}}</td>
					<td v-if="enble=='disenble'"><span v-if="i.phone!=null">{{i.phone | phoneType}}</span><span v-else>--</span></td>
					<td v-if="enble=='disenble'">{{i.allWorkTimes | keepDecimal}}</td>
					<td v-if="enble=='disenble'">{{i.allWorkDuration/3600000 | keepDecimal}}</td>
					<td v-if="enble=='disenble'">{{i.monthWorkDuration/3600000 | keepDecimal}}</td>
				</tr>
			</tbody>	
		</table>
		<div>
			<el-dialog
				title="移除"
				:visible.sync="dialogVisible"
				width="450px"
				top="30.3vh">
				<div class="removeblackname"><span>确认将<span>“{{blackName}}”</span>从黑名单移除吗？</span></div>
				<div class="removeblackprompt"><img src="../../../assets/img/prompt1.svg" alt=""><span>确认后，"{{blackName}}"将回到原"{{category | TypeOfWork}}"列表</span></div>
				<div class="dialogBtn">
					<div class="sub" @click="sure()">确定</div>
					<div class="cancel" @click="dialogVisible=false">取消</div>
				</div>  
        	</el-dialog>
			<el-dialog
				title="标记"
				:visible.sync="dialogVisibleOne"
				width="450px"
				top="30.3vh">
				<el-form :model="ruleForm" ref="ruleForm" label-width="80px" size="medium" style="width:232px;margin: 50px auto;">
					<div class="ruleForm myInputHeight30">
						<span class="laborType">类型：</span>
						<el-select v-model="value" placeholder="请选择" style="width:180px;margin-left:36px">
							<el-option :label= item.type :value= item.typeEng v-for="(item,index) in sexList" :key="index"></el-option>
						</el-select>
						<span class="tiedCard" @click="showIC=!showIC" v-if="(value != 'temporary')&&ruleForm.ICnumber.length==0">绑卡</span>
					</div>
					<div class="expiringDate myInputHeight30" v-if="(value != 'inside')&&(value != 'temporary')">
						<span class="maturityDate">到期日<span @mouseenter="showMarkedWords=true" @mouseleave="showMarkedWords=false"></span>：<span class="markedWords" v-show="showMarkedWords"><span>{{markedWords}}</span><span>{{markedWords1}}</span></span></span>
						<div class="position">
							<el-form-item prop="date1">
								<el-date-picker type="date" placeholder="请选择" v-model="ruleForm.maturityDate" style="float: left;width: 180px;margin-top:-26px;margin-left:-28px;" value-format="timestamp" @focus="focus1=true" @blur="focus1=false"></el-date-picker>
								<i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
							</el-form-item>
						</div>
					</div>
					<div class="worknumber myInputHeight30" v-if="(value == 'inside')&&(value != 'temporary')">
						<div class="laborType">工号：</div>
						<el-input v-model="ruleForm.workNumber" placeholder="请输入" style="margin-left:38px;margin-top:3px;"></el-input>
					</div>
					<div class="showIC" v-if="((showIC&&value != 'temporary')||(value != 'temporary'&&ruleForm.ICnumber.length!=0))&&browser==1">
						<div class="numberIC myInputHeight30">
							<div class="laborType">IC卡号：</div>
							<el-input v-model="ruleForm.ICnumber" placeholder="请读卡" style="float: left;margin-left:82px;margin-top:-25px;width:180px;" readonly></el-input>
							<span class="unbundling" v-if="isunbound" @click="unbound">解绑</span>
						</div>
						<div class="codingIC myInputHeight30">
							<div class="laborType">IC卡编码：</div>
							<el-input v-model="ruleForm.ICcoding" placeholder="请输入" style="float: left;margin-left:82px;margin-top:-25px;width:180px;"></el-input>
						</div>
						<div class="readInformation" v-if="loadingShow">
							<p>IC卡机读取信息中...</p>
						</div>
					</div>
					<div class="browserPrompt" v-if="browser==2&&value != 'temporary'&&showIC">
						<div class="toie">
							<img src="../../../assets/img/toie.png" alt="">
						</div>
						<p>对不起，读取IC卡号请使用IE浏览器</p>
					</div>
				</el-form>
				<div class="dialogBtn">
					<div class="sub" @click="sureOne()">确定</div>
					<div class="cancel" @click="abolish">取消</div>
				</div>  
        	</el-dialog>
			<div class="returnBlack">
                <el-dialog
                    title="黑名单"
                    :visible.sync="dialogVisibleBlack"
                	width="530px"
                    top="30.3vh">
                        <div class="messageWrap batchOperationMessage minHeight">
                            <div class="backWrap">
                                <div class="txtWrap">
                                    <div class="label">拉黑原因：</div>
                                    <textarea placeholder="请输入" v-model="obj.txt" maxlength="200" :class="{'redBorder':redBorder}" @input="writeResion"></textarea>
                                    <div class="txtNum">{{obj.txt.length}}/200</div>
                                </div>
								<span class="showWarning" v-if="redBorder"><img src="../../../assets/img/prompt1.svg" alt="">字数不可超出200字</span>
								<div class="warning"><img src="../../../assets/img/prompt1.svg" alt=""><span>加入黑名单后，该员工将不会再为贵司服务，后期可从黑名单中移除</span></div>
                            </div>
                        </div>
                        <div class="blackBtn">
                            <div class="sub" @click="confirm">确定</div>
                            <div class="cancel" @click="cancel">取消</div>
                        </div>  
                </el-dialog>
            </div>
		</div>
		<object name="IcCardReader" width="0" height="0" id="IcCardReader" classid="clsid:05782014-9FF7-468C-BE96-8EDC73084202"></object>
	</div>
</template>
<script>
export default {
  	name: 'employeeFiles',
  	props: ['dataList','tableType','order','order1','enble'],
  	data () {
      	return {
         	checkBoxList: [],  // 草稿箱全选反选
		 	llChecked: false,  // 草稿箱全选反选
			check: true,  // 弹框是否分解显示隐藏
			readonly: true,   // IC卡号只读
			dialogVisible: false,
			dialogVisibleOne: false,
			showIC: false,   // 是否绑定IC卡号
			showMarkedWords: false,   // 到期日提示语显示隐藏
			isunbound: false,  //   是否解绑
			loadingShow: false,
			redBorder: false,   //   当字数超出范围显示红框
			id: '',
			ruleForm:{
				maturityDate: '',
				workNumber: '',
				ICnumber: '',
				ICcoding: ''
			},
			obj:{
                txt: ''
            },
			value: '',
			label: '',
			sexList: [{type: '小时工',typeEng:'temporary'},{type: '长期工',typeEng:'longterm'},{type: '内部员工', typeEng: 'inside'}],
			worknumber: false,
			workerId: '',
			blackName: '',
			category: '',
			certNo: '',
			browser: 1,
			focus1: false,
			dialogVisibleBlack: false,
			markedWords: '到期后，IC卡/人脸识别将自动失效，',
			markedWords1: '员工无法直接打卡'
      	}
	},
	watch: {
		dataList() {
			this.init()
		}
	},
  	created() {
		if(this.$base.getBrowser()=='IE'){
            this.init()
			this.browser = '1'
			this.loadingShow = true
        }else{
            this.browser = '2'
        }
	},
  	mounted() {
		if(this.browser=='1'){
        this.step1init()
        this.time1 = setInterval(() => {
            this.step1init()
        }, 2000);
    }
},
	filters:{
		cutOut(val) {
			if(val.length>10){
				return val.substring(0,11) + '...'
			}else{ return val }
		},
		keepDecimal(val){
			if(val){
				return val.toFixed(1)
			}else{
				return '0'
			}
		},
		sex(val){
			if(val == 'male'){
				return '男'
			}else if(val == 'female'){
				return '女'
			}else{return ''}
		},
		TypeOfWork(val){
			if(val == 'temporary'){
				return '小时工'
			}else if(val == 'longterm'){
				return '长期工'
			}else if(val == 'inside'){
				return '内部员工'
			}else{
				return ''
			}
		},
		phoneType(phone){
			if(phone.substring(0,3)=='+86'){
				 return phone.substring(0,6)+'-'+phone.substring(6,10)+'-'+phone.substring(10,14)
			}else{
				return phone.substring(0,3) + "-" + phone.substring(3,7) + "-" + phone.substring(7,13)
			}
			if(!phone){
				return '--'
			}
		}
	  },
  	methods: {
		back(id) {
			this.$axios({
				method: 'post',
				url: this.$urls.message,
				data: { workerId: id }
			}).then(res=>{
				this.value = res.data.worker.category
				this.ruleForm.maturityDate = res.data.worker.invalidTime
				this.ruleForm.workNumber = res.data.worker.workerNo
				if(this.ruleForm.ICnumber.length>0){
					this.isunbound = true
				}
			})
			this.workerId = id
			this.dialogVisibleOne = true
			if(this.browser=='1'){
				this.step1init()
				this.time1 = setInterval(() => {
					this.step1init()
				}, 2000);
			}
		},
		backOne() {
			this.dialogVisibleOne = !this.dialogVisibleOne
		},
		remove(id){
			this.dialogVisible = !this.dialogVisible
			this.$axios({
				method: 'get',
				url: this.$urls.getBlackDetail+id
			}).then(res=>{
				this.category = res.data.category
				this.blackName = res.data.name
				this.certNo = res.data.workerId
			})
		},
	 	init() {
			
	 	},
	 	personalDetails(state,id) {
			let params = {}
			if (state == 'enable') {
				params = {title:'个人信息',type:'employeeFiles',operation:1,state:1,id}
			}else if(state != 'enable'){
				params = {title:'个人信息',type:'employeeFiles',operation:0,state:2,id}
			} 
			this.$store.dispatch('personalDetails',params)
		},
	 	personalInformationOne(id) {
			 this.workerId = id.workerId
			 let params = {}
			 params = {title:'编辑个人信息',type:'personalInformationOne',operation:0,id}
			 this.$store.dispatch('personalInformationOne',params)
		 },
	 	sure() {
			this.$axios({
				 method: 'delete',
				 url: this.$urls.delBlackList + this.certNo
			 }).then(res=>{
				 console.log(res)
				 if(res.data.status == 200){
					 this.order1()
					 this.$message({
						message: "移除成功",
						type: 'success',
						duration: 5 * 1000
					})
				 }else{
					 this.$message({
						message: "移除失败",
						type: 'error',
						duration: 5 * 1000
					})
				 }
			 })
			 this.dialogVisible = false
		},
		sureOne(){
			if(!this.ruleForm.maturityDate&&this.value!='inside'&&this.value!='temporary'){
				this.$message({
					message: '请选择到期时间',
					type: 'error',
					duration: 5*1000
				})
				return
			}
			if(!this.ruleForm.workNumber&&this.value=='inside'&&this.value!='temporary'){
				this.$message({
					message: '请输入工号',
					type: 'error',
					duration: 5*1000
				})
				return
			}
			this.$axios({
				method: 'post',
				url: this.$urls.tag,
				data:{
					workerId: this.workerId,
					category: this.value,
					icCardNo: this.ruleForm.ICnumber,
					icCardSeq: this.ruleForm.ICcoding,
					invalidTime: this.ruleForm.maturityDate,
					workerNo: this.ruleForm.workNumber
				}
			}).then(res=>{
				if(res.data.status == 200){
					this.order()
					this.$message({
						message: "标记成功",
						type: 'success',
						duration: 5 * 1000
					})
				}else{
					this.$message({
						message: "标记失败",
						type: 'error',
						duration: 5 * 1000
					})
				}
			}).catch(err=>{ 
				this.$message({
					message: "错误",
					type: 'error',
					duration: 5 * 1000
				})
			 })
			 this.value = ''
			 this.label = '',
			 this.ruleForm.id = ''
			 this.dialogVisibleOne = false
		},
		abolish() {
			this.order()
			this.showIC = false
			this.dialogVisibleOne = false
		},
		black() {
			this.dialogVisibleBlack = !this.dialogVisibleBlack
		},
		confirm() {
			let _this = this
			if(this.obj.txt.length == 0){
				this.$message({
					message: "拉黑原因为必填项",
					type: 'error',
					duration: 5 * 1000
				})
				return
			}else if(this.obj.txt.length > 0){
				this.$axios({
					method: 'post',
					url: this.$urls.addBlackList,
					data: {
						workerId: this.workerId?this.workerId:this.$store.state.recruitmentPlan.id,
						remark: this.obj.txt
					}
				}).then(res=>{
					if(res.data.message == '成功'){
						this.$message({
							message: "已加入黑名单",
							type: 'success',
							duration: 5 * 1000
						})
					}else{
						this.$message({
							message: "加入黑名单失败",
							type: 'error',
							duration: 5 * 1000
						})
					}
				}).catch(err=>{
					this.$message({
						message: "系统错误",
						type: 'error',
						duration: 5 * 1000
					})
				})
			}
			this.dialogVisibleBlack = false
			this.obj.txt = ''
		},
		writeResion() {
			if(this.obj.txt.length==200){
				this.redBorder = true
			}else{ this.redBorder = false }
		},
		unbound() {
			this.isunbound = false
			this.showIC = false
			this.ruleForm.ICnumber = ''
			this.ruleForm.ICcoding = ''
		},
		cancel() {
			this.$parent.borther1()
			this.dialogVisibleBlack = false
		},
		step1init() {
            this.$nextTick(()=>{
                var strls = "";
                var errorno = "";
                var BLOCK0_EN = 0x01;//读第一块的(16个字节)
                var BLOCK1_EN = 0x02;//读第二块的(16个字节)
                var BLOCK2_EN = 0x04;//读第四块的(16个字节)
                var NEEDSERIAL = 0x08;//仅读指定序列号的卡
                var EXTERNKEY = 0x10;//用明码认证密码,产品开发完成后，建议把密码放到设备的只写区，然后用该区的密码后台认证，这样谁都不知道密码是多少，需要这方面支持请联系
                var NEEDHALT = 0x20;//读/写完卡后立即休眠该卡，相当于这张卡不在感应区。要相重新操作该卡必要拿开卡再放上去
                
                var myctrlword = 0;
                var myareano = 0;
                var authmode = 0;
                var mypiccserial = "";
                var mypicckey = "";
                var piccdata0_2 = "";
                var mypicckey_old = "";//旧密码
                var mypicckey_new = "";//新密码
                var old_company_id = "";
                //指定控制字
                myctrlword = BLOCK0_EN + BLOCK1_EN + BLOCK2_EN + EXTERNKEY;
                //指定区号
                myareano = 8; //指定为第8区
                //批定密码模式
                authmode = 1; //大于0表示用A密码认证，推荐用A密码认证
                //指定序列号，未知卡序列号时可指定为8个0
                mypiccserial = "00000000";
                //指定密码，以下密码为厂家出厂密码
                console.log("正在扫描ic卡信息...");
                mypicckey = "ffffffffffff";
                var IcCardReader = document.getElementById("IcCardReader");
                strls = IcCardReader.piccreadex(myctrlword, mypiccserial, myareano, authmode, mypicckey);
                errorno = strls.substring(0, 4);
                switch (errorno) {
                    case "ER08":
                        //alert("IC读卡器读不到卡信息");
                        break;
                    case "ER09":
                        //alert("IC读卡器读不到卡信息");
                        break;
                    case "ER10":
                        //alert("IC读卡器读不到卡信息");
                        break;

                    case "ER14":
                        // CardIDShower.value = "写卡错误" + "\r\n";
                        // CardIDShower.value = CardIDShower.value + strls + "\r\n";
                        // CardIDShower.value = CardIDShower.value + "其中错误号为：" + errorno + "\r\n";
                        // CardIDShower.value = CardIDShower.value + "卡十六进制序列号为：" + strls.substr(5, 8) + "\r\n";
                        //alert("IC读卡器写卡错误");
                        break;

                    case "ER21":
                        //alert("IC读卡器没找到动态库");
                        break;

                    case "ER22":
                        //alert("IC读卡器动态库或驱动程序异常");
                        break;

                    case "ER23":
                        //alert("IC读卡器未插上或动态库或驱动程序异常");
                        break;
                    case "ER24":
                        //alert("IC读卡器操作超时，一般是动态库没有反应");
                        break;
                    case "ER25":
                        //alert("IC读卡器发送字数不够");
                        break;
                    case "ER26":
                        //alert("IC读卡器发送的CRC错");
                        break;
                    case "ER27":
                        //alert("IC读卡器接收的字数不够");
                        break;
                    case "ER28":
                        //alert("IC读卡器接收的CRC错");
                        break;
                    case "ER29":
                        //alert("IC读卡器函数输入参数格式错误,请仔细查看"	);
                        break;
                    case "ER11":
                        // CardIDShower.value = "IC读卡器密码认证错误\r\n";
                        // CardIDShower.value = CardIDShower.value + strls + "\r\n";
                        // CardIDShower.value = CardIDShower.value + "其中错误号为：" + errorno + "\r\n";
                        // CardIDShower.value = CardIDShower.value + "卡十六进制序列号为：" + strls.substr(5, 8) + "\r\n";
                        //alert("IC读卡器密码认证错误");
                        //break;
                    case "ER12":
                        // CardIDShower.value = "密码认证错误" + "\r\n";
                        // CardIDShower.value = CardIDShower.value + strls + "\r\n";
                        // CardIDShower.value = CardIDShower.value + "其中错误号为：" + errorno + "\r\n";
                        // CardIDShower.value = CardIDShower.value + "卡十六进制序列号为：" + strls.substr(5, 8) + "\r\n";
                        //alert("IC读卡器密码认证错误");
                        //break;
                    case "ER13":
                        // CardIDShower.value = "读卡错误" + "\r\n";
                        // CardIDShower.value = CardIDShower.value + strls + "\r\n";
                        // CardIDShower.value = CardIDShower.value + "其中错误号为：" + errorno + "\r\n";
                        // CardIDShower.value = CardIDShower.value + "卡十六进制序列号为：" + strls.substr(5, 8) + "\r\n";
                        //alert("IC读卡器读卡错误");
                        //break;
                    default :
                        //读卡成功,其中ER00表示完全成功,ER01表示完全没读到卡数据，ER02表示仅读该卡的第一块成功,，ER02表示仅读该卡的第一二块成功，这是刷卡太快原因
                        //CardIDShower.value = "读卡成功" + "\r\n";
                        //CardIDShower.value = CardIDShower.value + strls + "\r\n";
                        //CardIDShower.value = CardIDShower.value + "其中错误号为：" + errorno + "\r\n";
                        //CardIDShower.value = CardIDShower.value + "卡十六进制序列号为：" + strls.substr(5,8) + "\r\n";
                        //CardIDShower.value = CardIDShower.value + "该区第一块十六进制数据为：" + strls.substr(14,32) + "\r\n";
                        //CardIDShower.value = CardIDShower.value + "该区第二块十六进制数据为：" + strls.substr(46,32) + "\r\n";
                        //CardIDShower.value = CardIDShower.value + "该区第三块十六进制数据为：" + strls.substr(78,32) + "\r\n";
                        //卡机号
                        this.ruleForm.ICnumber = `00${strls.substring(11,13)}${strls.substring(9,11)}${strls.substring(7,9)}${strls.substring(5,7)}`
						clearInterval(this.time1)
						this.loadingShow = false
                        
                        // this.$axios({
                        //     method: 'get',
                        //     url:this.$urls.getPersonal,
                        //     params:{icCardNo:this.form.worker.icCardNo}
                        // })
                        // .then(res=>{    
                        //     if(res.data.status==200) {
                        //         this.form.workerName = res.data.content.name
                        //         if(res.data.content.gender=='male'){
                        //             this.gender = 1
                        //         }else{
                        //             this.gender = 0
                        //         }
                        //         this.form.worker.birthday = res.data.content.birthday
                        //         this.form.worker.phone = res.data.content.phone
                        //         this.form.worker.certNo = res.data.content.certNo
                        //         this.form.worker.certType = res.data.content.certType
                        //         this.compare1[1] = true
                        //     }else {
                        //         this.step2init()
                        //         this.time2 = setInterval(() => {
                        //             this.step2init()
                        //         }, 2000);
                        //     }
                        // })
                        // .catch(e=>{
                        //     this.dataList = []
                        // })
                        // this.loadingShow = false
                }
            })
        }
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
.border{
	border: 1px solid #4c8aff;
}
.null{
	width: 24px;
	height: 1px;
	background-color: #d4d4d4;
	margin: 0 auto;
}
.color{
	color: #d4d4d4;
}
.wrap{
	width:70px;
	overflow:hidden;
	margin: 0 auto;
	.thName{
		float:left;
	}
	.iconArrow{
		float:left;
		width:12px;
		height:16px;
		margin: 1px 0 0 10px;
		.top{
			position: relative;
			top: -4.5px;
		}
		.bottom{
			position: relative;
			top: -14px;
		}
		.color{
			color: #4c8aff;
		}
	}
}
.approval{
	color: #4c8aff;
	margin-right:20px;
	cursor: pointer;
}
.back{
	color: #4c8aff;
	cursor: pointer;
}
.progress{
	color: #4c8aff;
}
.clickArea{
	color:#4c8aff;
}
.min-width{
	min-width:60px;
}
.first{
	min-width:90px;
}
.minw40{
	min-width: 40px;
}
.removeblackname{
	width: 244px;
	margin: 80px  auto 0;
	text-align: center;
	span{
		color: #444950;
		font-size: 14px;
	}
}
.removeblackprompt{
	width: 260px;
	margin: 5px  auto 0;
	text-align: center;
	img{
		float: left;
		width: 12px;
		height: 12px;
		margin-top: 3px;
		margin-left: 32px;
	}
	span{
		color: #666666;
		font-size: 12px;
	}
}
.ruleForm{
	position: relative;
	// background: #eee;
	margin-bottom: 15px;
	.laborType{
		margin-left: -30px;
	}
 .tiedCard{
	 width: 30px;
	 position: absolute;
	 top: 7px;
	 left: 243px;
	 font-size: 12px;
	 color: #4c8aff;
	 cursor: pointer;
 }
}
.expiringDate{
	position: relative;
	margin-top: 20px;
	margin-bottom: 15px;
	.maturityDate{
		position: relative;
	 	margin-left: -30px;
	 .markedWords{
		 display: inline-block;
		 width: 220px;
		 height: 63px;
		 border: .5px solid #ccc;
		 border-radius: 0px;
		 position: absolute;
		 top: 25px;
		 left: 20px;
		 z-index: 1000;
		 font-size: 12px;
		 color: #444950;
		 background: #fff;
		 border-radius: 5px;
		span:nth-child(1){
			width: 198px;
			margin-top: 15px;
			margin-left: 10px;
			background: none;
		}
		span:nth-child(2){
			width: 99px;
			margin-left: 10px;
			background: none;
			// margin-top: 15px;
		}
	 }
	 span{
		display: inline-block;
        width: 12px;
        height: 12px;
        margin-left: 5px;
        margin-right: 5px;
		border-radius: 100%;
		cursor: pointer;
        background: url('../../../assets/img/logo.png') no-repeat -326px -160px;
	 }
 }
 .position{
	 position: relative;
	 i{
		 position: absolute;
		 top: -15px;
		 right: 10px;
		 color: #c0c4cc;
		 transition: all .2s;
	 }
	 .focus1{
		 transform: rotate(180deg);
	 }
 }
}
.worknumber{
	width: 400px;
	display: flex;
	.laborType{
		width: 50px;
		margin-top: 10px;
		margin-left: -30px;
	}
}
.showIC{
	position: relative;
	width: 410px;
	height: 200px;
	margin-left: -89px;
	margin-top: 20px;
	border-top: 1px dashed #d4d4d4;
	.numberIC{
		position: relative;
		width: 260px;
		margin-left: 59px;
		margin-top: 25px;
		.laborType{
			width: 60px;
		}
		.unbundling{
			position: absolute;
			top: 0;
			left: 273px;
			width: 26px;
			font-size: 12px;
			color: #e45a3c;
			cursor: pointer;
		}
	}
	.codingIC{
		clear: both;
		width: 260px;
		margin-left: 59px;
		margin-top: 28px;
	}
	.laborType{
		width: 70px;
	}
	.readInformation{
		position: absolute;
		top: 25px;
		left: 110px;
		padding: 20px 30px;
		border-radius: 5px;
		background: rgba(68, 73, 80, 0.41);
		z-index: 1000;
		p{
			color: #fff;
		}
	}
}
.browserPrompt{
	width: 410px;
	height: 200px;
	margin-left: -89px;
	margin-top: 20px;
	border-top: 1px dashed #d4d4d4;
	.toie{
		width: 130px;
		margin: 20px auto;
		img{
		width: 130px;
		height: 70px;
	  }
   }
   p{
	   margin-top: -10px;
	   text-align: center;
	   font-size: 12px;
	   color: #ccc;
   }
}
.returnBlack{
    .minHeight{
	    height:206px;
}
.messageWrap{
	.backWrap{
		margin-top:30px;	
		.showWarning{
			float: left;
			font-size: 12px;
			color: #e45a3c;
			margin-left: 85px;
			margin-top: 5px;
			img{
				width: 11px;
				height: 11px;
				float: left;
				margin-top: 3.5px;
				margin-right: 5px;
			}
		}
	}
	.warning{
			height: 17px;
			float: left;
			margin-left: 85px;
			margin-top: 10px;
			img{
				width: 11px;
				height: 11px;
				float: left;
				margin-top: 3.5px;
				margin-right: 5px;
			}
			span{
				font-size: 10px;
				color: #666666;
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
			margin-left:10px;
		}
		textarea::-webkit-input-placeholder{
			font-size: 14px;
			color:#999999;
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
		.redBorder{ border-color: #e45a3c; }
		.txtNum{
			position:absolute;
			right:18px;
			font-size: 14px;
			color: #999999;
			bottom:5px;
		}
	}
 }
 .blackBtn{
	 display: flex;
	 justify-content: center;
	 margin-top: 28px;
	 .sub{
		 width: 80px;
		 height: 27px;
		 text-align: center;
		 line-height: 27px;
		 background: #4c8aff;
		 color: #ffffff;
		 border: 1px solid #4c8aff;
		 border-radius: 14.5px;
	 }
	 .cancel{
		 width: 80px;
		 height: 27px;
		 text-align: center;
		 line-height: 27px;
		 color: #4c8aff;
		 border: 1px solid #4c8aff;
		 border-radius: 14.5px;
		 margin-left: 60px;
	 }
 }
}	
</style>
