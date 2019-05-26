<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div v-if="$store.state.recruitmentPlan.signParams.type=='handsignBack'" class="txt">手工签退</div>
						<div v-else class="txt">签退</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
				<div v-if="signOutCheck==1" class="minH">
                    <div class="title">今日工作</div>
                    <div class="wrap wrap1">
                        <div class="item">
                            <div class="left" :class="{'width122':$store.state.recruitmentPlan.signParams.type=='handsignBack'}">用工计划：</div>
                            <div class="right">{{plan}}</div>
                            <el-tooltip placement="bottom" :effect="'light'">
                                <div class="content" slot="content" style="font-size: 14px;">
                                    <p>招聘者：{{agencyName}}</p>
                                    <p v-if="data&&data.linkman" style="margin:10px 0">联络人：{{data.linkman}}</p>
                                    <p v-if="data&&data.linkman">手机号码：{{data.phone}}</p>
									<p v-else class="infoNull" style="color: #999999;margin-top:10px;">无联络人信息</p>
                                </div>
                                <div class="detail floatL">详情</div>
                            </el-tooltip>
                        </div>
                        <div class="clear"></div>
						<div class="item mb0">
                            <div class="left" :class="{'width122':$store.state.recruitmentPlan.signParams.type=='handsignBack'}">备注：</div>
                            <div class="right">{{remark}}</div>
                        </div>
						<div class="reasonWrap" v-if="$store.state.recruitmentPlan.signParams.type=='handsignBack'">
							<div class="left">手工签退理由：</div>
							<div class="right ml10">
								<textarea placeholder="请输入" v-model="form.remark"></textarea>
								<div class="num">{{form.remark.length}}/1000</div>
							</div>
						</div>
                    </div>
                    <div class="title">基本信息</div>
                    <div class="wrap">
                        <div class="width500">
                            <div class="item">
                                <div class="left">姓名：</div>
                                <div class="right">{{workerName}}</div>
                            </div>
                            <div class="item ml78">
                                <div class="left width74">性别：</div>
                                <div class="right">{{gender}}</div>
                            </div>
                            <div class="item">
                                <div class="left">出生日期：</div>
                                <div class="right">{{birthday}}</div>
                            </div>
                            <div class="item ml78">
                                <div class="left width74">手机号：</div>
                                <div class="right">{{phone}}</div>
                            </div>
                            <div class="item mb0">
                                <div class="left">证件类型：</div>
                                <div class="right">{{certType}}</div>
                            </div>
                            <div class="item ml78 mb0 width218">
                                <div class="left width74">证件号：</div>
                                <div class="right">{{cardId}}</div>
                                <img src="../../../assets/img/closeeye.svg" v-if="!idCardShow" class="eye" @click="idCardShow=true" alt="">
                                <img src="../../../assets/img/openeye.svg" v-else class="eye" @click="idCardShow=false" alt="">
                            </div>
                        </div>
                        <div class="head">
                            <img v-if="!avatar" src="../../../assets/img/head@3x.svg" alt="">
                            <img  v-else :src="avatar" alt="">
                        </div>
						<div class="blacklist">
							<el-checkbox v-model="checked" @change="blackListShow">黑名单</el-checkbox>
						</div>
                    </div>
                    <div class="title">IC卡信息</div>
                    <div class="wrap wrap1">
                        <div class="item mb0">
                            <div class="left">IC卡号：</div>
                            <div class="right">{{icCardNo}}</div>
                        </div>
                        <div class="item floatR mb0">
                            <div class="left">IC卡编码：</div>
                            <div class="right">{{icCardSeq}}</div>
                        </div>
                    </div>
                </div>
				<div v-if="signOutCheck=='1'&&$store.state.recruitmentPlan.signParams.type=='handsignBack'" class="btnWrap" :class="{'uncomplate':!form.remark.length&&$store.state.recruitmentPlan.signParams.type=='handsignBack'}">
                    <div class="subBtn floatL" @click="signOut">确认无误，正常签退</div>
                </div>
                <div v-if="signOutCheck=='1'&&$store.state.recruitmentPlan.signParams.type!='handsignBack'" class="btnWrap">
                    <div class="subBtn floatL btn1" @click="readCard">读卡</div>
                    <div class="subBtn floatL btn2" @click="signOut">确认无误，正常签退</div>
                </div>
				<div class="useIc" v-if="signOutCheck==2">
					<div>
                        <img src="../../../assets/img/signout.png" alt="">
                    </div>
                    <p v-if="warning">{{warning}}</p>
                    <p v-else>请刷IC卡进行签退</p>
                    <div class="btn" @click="readCard">读卡</div>
				</div>
				<div class="toie" v-if="signOutCheck==3">
                    <div>
                        <img src="../../../assets/img/toie.png" alt="">
                    </div>
                    <p>读卡器加载失败，请使用IE浏览器</p>
                </div>
			</div>
		</transition>
		<el-dialog
            title="黑名单"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            :width="'530px'"
            :custom-class="'signInDialog'"
            top="30.3vh">
            <div class="dialog">
				<div class="wrap">
					<div class="left">拉黑原因：</div>
					<textarea placeholder="请输入" v-model="txt"></textarea>
					<div class="txtNum">{{txt.length}}/1000</div>
				</div>
				<div class="alert">
					<div class="floatL div1">!</div>
					<div class="floatL div2">加入黑名单后，该员工将不会再为贵司服务，后期可从黑名单中移除</div>
				</div>
            </div>	
            <div class="dialogBtn">
                <div class="sub" @click="submit">确定</div>
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>  
        </el-dialog>
		<el-dialog
            title="提示"
            :visible.sync="dialogVisible1"
            :modal-append-to-body="false"
            :width="'450px'"
            :custom-class="'signInDialog'"
            top="30.3vh">
            <div class="dialog dialog1">
				<p>{{msg}}</p>
				<!-- <div class="alert">
					<div class="floatL div1">!</div>
					<div class="floatL div2">请员工打完下班卡后，再签退</div>
				</div> -->
            </div>	
            <div class="dialogBtn1">
                <div class="cancel" @click="dialogVisible1=false">关闭</div>
            </div>  
        </el-dialog>
        <object id="CertCtl" name="CertCtl" type="application/cert-reader" width="0" height="0"></object>
        <object name="IcCardReader" width="0" height="0" id="IcCardReader" classid="clsid:05782014-9FF7-468C-BE96-8EDC73084202"></object>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'signout',
    mixins: [mixin],
    props:['orderInit'],
	data () {
		return {
			show: false, 
			_timeOut: '',
			checked: false,
			signOutCheck: '',
			dialogVisible: false,
			txt: '',
			dialogVisible1: false,
            txt1:'',
            time1: '',
            time2: '',
            warning: '',
            icCardNo: '',
            workerName: '',
            gender: '',
            birthday: '',
            phone: '',
            certNo:'',
            certType: '',
            avatar: '',
            plan: '',
            remark: '',
            data: {},
            icCardSeq: '',
            msg: '',
            workerId: '',  
            agencyName: '', 
            form:{
                orderDetailId:'',
                icCardNo: '',
                remark: '',
            },
            blackCheck: false,
            idCardShow: false,
		}
    },
    watch:{
        dialogVisible(val) {
            if(!val&&!this.blackCheck) {
                this.checked = false
            }
        }
    },
    computed:{
        cardId() {
			if(!this.idCardShow){
				return `**************${this.certNo.substring(this.certNo.length-4,this.certNo.length)}`
			}else{
				return this.certNo
			}
		},
    },
    created() {             
        if(this.$base.getBrowser()=='IE'||this.$store.state.recruitmentPlan.signParams.type=='handsignBack'){
            this.signOutCheck = '2'
        }else{
            this.signOutCheck = '3'
        }
    },
	mounted () {
        this.show = true
        if(this.$store.state.recruitmentPlan.signParams.type=='handsignBack'){
            this.signOutCheck = '1'
            this.init1()
        }
	},
	methods: {
        readCard() {
            this.step1init()
        },
        init1() {
            let data = this.$store.state.recruitmentPlan.signParams.data
            this.icCardNo = data.icCardNo
            let date = new Date()
            this.$axios({
                method: 'get',
                url:this.$urls.getPersonalOut,
                params:{icCardNo:this.icCardNo}
            })
            .then(res=>{   
                if(res.data.status==200) {
                    this.signOutCheck = 1
                    this.workerName = res.data.content.name
                    if(res.data.content.gender=='male'){
                        this.gender = '男'
                    }else{
                        this.gender = '女'
                    }
                    this.birthday = this.$base.formattingTime(res.data.content.birthday,'-')
                    this.phone = res.data.content.phone
                    this.certNo = res.data.content.certNo
                    if(res.data.content.certType=='id-card'){
                        this.certType = '中国居民身份证'
                    }else if(res.data.content.certType=='passport'){
                        this.certType = '护照'
                    }else if(res.data.content.certType=='home-card') {
                        this.certType = '回乡证'
                    }else if(res.data.content.certType=='tw-card') {
                        this.certType = '台胞证'
                    }
                    this.avatar = res.data.content.avatar
                }else {
                    this.warning = res.data.message
                    // this.time2 = setInterval(() => {
                    //     this.step2init()
                    // }, 2000);
                }
            })
            .catch(e=>{
                
            })
            let agencyId = ''
            this.$axios({
                method: 'post',
                url:this.$urls.getSignOut,
                data:{icCardNo:this.icCardNo}
            })
            .then(res=>{    
                if(res.data.departmentName){
                    this.plan = `${res.data.departmentName},${res.data.postName},${this.$base.timeplateTohm(res.data.workTimeStart)}-${this.$base.timeplateTohm(res.data.workTimeEnd)},${res.data.agencyName}`
                    this.agencyName = res.data.agencyName
                    this.remark = res.data.remark
                    agencyId = res.data.agencyId
                    this.icCardSeq = res.data.icCardSeq
                    this.form.orderDetailId = res.data.orderDetailId
                    this.form.icCardNo = res.data.icCardNo
                    this.workerId = res.data.workerId
                }    
            })
            .catch(e=>{
                
            })
            this.$axios({
                method: 'get',
                url: this.$urls.getContractAgency+'?timeplate='+date.getTime(),
                params: {
                    agencyId:agencyId
                }
            }).then(res=>{
                this.data = res.data[0]
                
            }).catch(err=>{
                
            })
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
                        this.icCardNo = `00${strls.substring(11,13)}${strls.substring(9,11)}${strls.substring(7,9)}${strls.substring(5,7)}`
                        // clearInterval(this.time1)
                        let date = new Date()
                        this.$axios({
                            method: 'get',
                            url:this.$urls.getPersonalOut,
                            params:{icCardNo:this.icCardNo}
                        })
                        .then(res=>{   
                            if(res.data.status==200) {
                                this.signOutCheck = 1
                                this.workerName = res.data.content.name
                                if(res.data.content.gender=='male'){
                                    this.gender = '男'
                                }else{
                                    this.gender = '女'
                                }
                                this.birthday = this.$base.formattingTime(res.data.content.birthday,'-')
                                this.phone = res.data.content.phone
                                this.certNo = res.data.content.certNo
                                if(res.data.content.certType=='id-card'){
                                    this.certType = '中国居民身份证'
                                }else if(res.data.content.certType=='passport'){
                                    this.certType = '护照'
                                }else if(res.data.content.certType=='home-card') {
                                    this.certType = '回乡证'
                                }else if(res.data.content.certType=='tw-card') {
                                    this.certType = '台胞证'
                                }
                                this.avatar = res.data.content.avatar
                            }else {
                                this.warning = res.data.message
                                // this.time2 = setInterval(() => {
                                //     this.step2init()
                                // }, 2000);
                            }
                        })
                        .catch(e=>{
                            
                        })
                        let agencyId = ''
                        this.$axios({
                            method: 'post',
                            url:this.$urls.getSignOut,
                            data:{icCardNo:this.icCardNo}
                        })
                        .then(res=>{    
                            if(res.data.departmentName){
                                this.plan = `${res.data.departmentName},${res.data.postName},${this.$base.timeplateTohm(res.data.workTimeStart)}-${this.$base.timeplateTohm(res.data.workTimeEnd)},${res.data.agencyName}`
                                this.agencyName = res.data.agencyName
                                this.remark = res.data.remark
                                agencyId = res.data.agencyId
                                this.icCardSeq = res.data.icCardSeq
                                this.form.orderDetailId = res.data.orderDetailId
                                this.form.icCardNo = res.data.icCardNo
                                this.workerId = res.data.workerId
                            }    
                        })
                        .catch(e=>{
                            
                        })
                        this.$axios({
                            method: 'get',
                            url: this.$urls.getContractAgency+'?timeplate='+date.getTime(),
                            params: {
                                agencyId:agencyId
                            }
                        }).then(res=>{
                            this.data = res.data[0]
                            
                        }).catch(err=>{
                            
                        })
                }
            })
        },
        step2init() {
            function toJson(str) {
                return eval('(' + str + ')');
            }
            var idCardResult;
            var idCardResultObj;
            var checkIDCard=true;	
            if (checkIDCard) {
                var result = CertCtl.connect();
                result = toJson(result);
                if (result.resultFlag != 0) {
                    console.log("无法连接身份证读卡器！");
                    return;
                }
                console.log("正在扫描身份证信息...");
                idCardResult = CertCtl.readCert();
                idCardResultObj = toJson(idCardResult);
                if (idCardResultObj.resultFlag == 0) {
                    
                    // clearInterval(this.time2)
                    console.log(idCardResultObj.resultContent);
                    this.workerName = idCardResultObj.resultContent.partyName
                    if(idCardResultObj.resultContent.gender==1) {
                        this.gender = '男'
                    }else {
                        this.gender = '女'
                    }
                    this.certType = '中国居民身份证'
                    let date = idCardResultObj.resultContent.bornDay
                    this.birthday = date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8)
                    this.certNo = idCardResultObj.resultContent.certNumber
                    this.avatar = "data:image/png;base64,"+idCardResultObj.resultContent.identityPic
                    checkIDCard = false;
                }
            }
        },
		submit() {
            
            this.$axios({
                method: 'post',
                url: this.$urls.addBlackList,
                data: {
                    workerId:this.workerId,
                    remark:this.txt
                }
            }).then(res=>{
                if(res.data.status==200){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                    this.blackCheck = true
                    this.dialogVisible = false
                }else{
                    this.$message({
                        message: res.data.message||"操作失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
                }  
            }).catch(err=>{
                
            })
		},
		blackListShow() {
			if(this.checked) {
				this.dialogVisible = true
			}
		},
		signOut() {
			if(this.$store.state.recruitmentPlan.signParams.type=='handsignBack'&&!this.form.remark.length) {
				return 
            }
            this.$axios({
                method: 'post',
                url: this.$urls.addSignOut,
                data: this.form
            }).then(res=>{
                if(res.data.code==0){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                    
                }else{
                    this.msg = res.data.msg
                    this.dialogVisible1 = true
                }  
            }).catch(err=>{
                
            })
			
		},
		cancel() {
            this.show = false
            this.orderInit()
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('signoutPageShow')
			}, 200)
		},
		
	},
	destroyed() {
        clearTimeout(this._timeOut)
        
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.dialogBtn{
    width: 240px;
    left: 90px;
    div{
        width: 28px;
        padding: 4px 30px;
        font-size: 14px;
        height: 20px;
    }
    
}
.toie{
    margin-top: 229px;
    div{
        text-align: center;
        img{
            width: 240px;
        }
    }
    p{
        font-size: 24px;
        color: #666666;
        margin-top: 50px;
        text-align: center;
    }
}
.dialog{
	height: 241px;
	.alert{
		overflow: hidden;
		margin: 10px 0 0 110px;
		.div1{
			width: 14px;
			height: 14px;
			border-radius: 50%;
			line-height:14px;
			font-size:12px;
			color:white;
			text-align: center;
			margin:2.5px 6px 0 0;
			background-color:#e45a3c;
			float: left;
		}
		.div2{
			font-size: 14px;
			float: left;
			color: #666666;
			width: 364px;
		}
	}
	.wrap{
		width: 480px;
		margin: 0 auto;
		overflow: hidden;
		margin-top: 68px;
		position: relative;
		
		.left{
			float: left;
			width: 90px;
			font-size: 16px;
			height: 22px;
			color: #444950;
		}
		textarea{
			width: 390px;
			height: 90px;
			float: left;
			border: solid 1px #ececec;
			resize: none;
			box-sizing: border-box;
			padding: 5px 10px;
			font-size: 16px;
		}
		textarea::-webkit-input-placeholder{
			color:#999999;;
		}
		textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
			color:#999999;
		}
		textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
			color:#999999;
		}
		textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
			color:#999999;
		}
		.txtNum{
			position:absolute;
			right:10px;
			font-size: 16px;
			color: #999999;
			bottom:5px;
		}
	}
}
.dialogBtn{
	left: 145px;
}
.dialogBtn1{
    width: 90px;
    margin-left: -45px;
}
.dialogBtn1 div{
    font-size: 14px;
    width: 28px;
    height: 20px;
    padding: 4px 30px;
}
.dialog1{
	height: auto;
	p{
		font-size: 16px;
		margin-top: 80px;
		text-align: center;
	}
	.alert{
		width: 202px;
		margin: 5px auto;
		.div2{
			width: auto;
		}
	}
}
.panel{
	width:900px;
	overflow-y: scroll;
	.floatL{
        float: left;
	}
	.btnWrap{
        height: 57px;
        overflow: hidden;
        cursor: pointer;
        .subBtn{
            width: 100%;
            height: 57px;
            background-color: #4c8aff;
            line-height: 57px;
            text-align: center;
            font-size: 18px;
            color: #ffffff;
        }
        .btn1{
            width: 50%;
            background-color: #eaf3fe;
            color: #4c8aff;
        }
        .btn2{
            width: 50%;
            background-color: #4c8aff;
        }
	}
	.uncomplate{
        .subBtn{
            background-color: #ececec;
            color: #999999;
            color: #ffffff;
        }
    }
	.useIc{
        padding-top: 229px;
        position: relative;
        height: 100%;
        box-sizing: border-box;
		div{
			text-align: center;
			img{
				width: 240px;
			}
		}
		p{
			font-size: 24px;
			color: #666666;
			margin-top: 50px;
			text-align: center;
        }
        .btn{
            position: absolute;
            width: 100%;
            height: 57px;
            background-color: #eaf3fe;
            line-height: 57px;
            text-align: center;
            font-size: 18px;
            color: #4c8aff;
            bottom:51px;
            cursor: pointer;
        }
	}
	.minH{
		min-height: calc(100% - 155px);
		margin-bottom: 30px;
        .title{
            font-size: 16px;
            color: #666666;
            font-weight: bold;
            margin: 15px 0 0 20px;
        }
        .certificateWrap{
            width: 710px;
            margin: 0 auto;
            background-color: #f4f8fc;
            border-radius: 2px;
            padding: 0px 0px 24px;
            margin-top: 20px;
            box-sizing: border-box;
            overflow: hidden;
            .tab{
                height: 40px;
                background-color: #eaf3fe;
                div{
                    float: left;
                    width: 80px;
                    text-align: center;
                    height: 100%;
                    line-height: 38px;
                    color: #444950;
                    font-size: 14px;
                    box-sizing: border-box;
                    margin-left: 60px;        
                }
                .select{
                    color: #4c8aff;
                    border-bottom: 2px solid #4c8aff;
                }
            }
            .certificateContent{
                padding: 0 30px;
                overflow: hidden;
                .left{
                    width: 50%;
                    float: left;
                    font-size: 14px;
                    color: #444950;
                    .item{
                        margin-top: 24px;
                        span{
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
        .wrap{
            width: 860px;
            padding: 24px;
            box-sizing: border-box;
            background-color: #f4f8fc;
            border-radius: 2px;
            margin: 0 auto;
            margin-top: 15px;
            position: relative;
            overflow: hidden;
            .width500{
                width: 620px;
                overflow: hidden;
            }
            .clear{
                clear: both;
            }
            .item{
                width: 202px;
                overflow: hidden;
                font-size: 16px;
                float: left;
                margin-bottom: 24px;
                height: 22px;
                line-height: 22px;
                .left{
                    float: left;
                    width: 90px;
				}
				.width122{
					width: 122px;
				}
				.width74{
					width: 74px;
				}
                .right{
                    float: left;
                }
            }
            .width218{
                width: 265px;
                .eye{
                    margin-left: 10px;
                }
            }
            .ml78{
                margin-left: 148px;
            }
            .mb0{
                margin-bottom: 0;
            }
            .head{
                position: absolute;
                width: 100px;
                top: 15px;
                right: 70px;
                height: 100px;
                border-radius: 50%;
                overflow: hidden;
                img{
                    width: 100%;
                }
            }
			.blacklist{
				position: absolute;
				right: 82px;
				top: 125px;
			}
        }
        .wrap1{
            .item{
                width: auto;
            }
            .detail{
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                color: #999999;
                margin-left: 10px;
                margin-top: 0.5px;
            }
            .floatR{
                float: right;
                margin-right: 152px;
			}
			.reasonWrap{
				float: left;
				overflow: hidden;
				margin-top: 24px;
                .left{
                    float: left;
                    margin-top: 4px;
                    font-size: 16px;
                    color: #444950;
                    width: 122px;
                }
                .right{
                    float: left;
                    position: relative;
                    .num{
                        position: absolute;
                        right: 10px;
                        bottom: 5px;
                        height: 20px;
                        color: #999999;
                        line-height: 20px;
                        font-size: 16px;
                    }
                    textarea{
                        width: 660px;
                        height: 100px;
                        background-color: #ffffff;
                        border-radius: 1px;
                        border: solid 1px #ececec;
                        outline: none;
                        resize: none;
                        padding: 5px 10px;
                        box-sizing: border-box;
                        font-size: 16px;
                    }
                    textarea::-webkit-input-placeholder{
                        color:#999999;
                    }
                    textarea::-moz-placeholder{   /* Mozilla Firefox 19+ */
                        color:#999999;
                    }
                    textarea:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                        color:#999999;
                    }
                    textarea:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                        color:#999999;
                    }
                }
            }
        }
    }
}
.fixed{
	width: 860px;
}
.panelWrap .panel .panelTitleWrap .panelTitle .txt{
	font-size: 16px;
}
</style>