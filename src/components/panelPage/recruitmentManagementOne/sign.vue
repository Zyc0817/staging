<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
                        <div v-if="$store.state.recruitmentPlan.signParams.type=='resign'" class="txt">重签</div>
						<div v-else class="txt">签到</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
                <div class="minH sign" v-if="browser=='1'">
                    <el-form ref="form" :model="form" label-width="90px" size="medium">
                        <div class="title">今日工作</div>
                        <div class="wrap wrap3">
                            <div class="inputHeight30 floatL">
                                <el-form-item label="用工计划：">
                                    <div style="width:660px">
                                        <el-select v-model="unuse" :placeholder="workTxt" @focus="planShow"></el-select>
                                    </div>
                                </el-form-item>
                            </div>
                            <div v-if="!detailObj.legal" class="floatL detailbtn">详情</div>
                            <el-tooltip v-else placement="bottom" :effect="'light'">
                                <div class="content" slot="content" style="font-size: 14px;">
                                    <p>招聘者：{{agencyName}}</p>
                                    <p v-if="detailObj.legal" style="margin:10px 0">联络人：{{detailObj.legal}}</p>
                                    <p v-if="detailObj.legal">手机号码：{{detailObj.phone}}</p>
                                    <p v-else class="infoNull" style="color: #999999;margin-top:10px;">无联络人信息</p>
                                </div>
                                <div class="floatL detailbtn">详情</div>
                            </el-tooltip>
                            <div class="clear"></div>
                            <div class="reasonWrap">
                                <div class="left">备注：</div>
                                <div class="right ml10">
                                    <textarea placeholder="可输入押金信息…" v-model="form.remark"></textarea>
                                    <div class="num">{{form.remark.length}}/1000</div>
                                </div>
                            </div>
                        </div>
                        <div class="title">基本信息</div>
                        <div class="wrap wrap1">
                            <div class="inputHeight30 floatL">
                                <el-form-item label="姓名：">
                                    <el-input v-model="form.workerName" disabled></el-input>
                                </el-form-item>
                            </div>
                            <div class="inputHeight30 floatL" style="margin-left:65px;">
                                <el-form-item label="证件类型：">
                                    <el-select v-model="form.worker.certType" placeholder="请选择">
                                        <el-option :label="'中国居民身份证'" :value="'id-card'"></el-option>
                                        <el-option :label="'护照'" :value="'passport'"></el-option>
                                        <el-option :label="'回乡证'" :value="'home-card'"></el-option>
                                        <el-option :label="'台胞证'" :value="'tw-card'"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="inputHeight30 sex" style="margin-top:0px;float: left;clear:both;">
                                <el-form-item label="性别：" label-width="74px">
                                    <el-radio-group v-model="gender" style="margin-left:18px;">
                                        <el-radio :label="1" disabled>男</el-radio>
                                        <el-radio :label="0" disabled>女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                            <div class="inputHeight30 floatL width274" style="margin-left:65px;">
                                <el-form-item label="证件号：" :label-width="'74px'">
                                    <el-input v-model="form.worker.certNo" style="margin-left:17.2px;" disabled></el-input>
                                </el-form-item>
                            </div>
                            
                            <div class="inputHeight30 floatL mb0" style="margin-left:0px;clear:both;">
                                <el-form-item label="出生日期：">
                                    <div class="floatL input position height30">
                                        <el-form-item>
                                            <el-input v-model="form.worker.birthday" disabled></el-input>
                                        </el-form-item>
                                        <!-- <el-date-picker type="date" :clearable="false" placeholder="开始日期" v-model="form.worker.birthday" style="width: 100%;" value-format="timestamp" @focus="focus1=true" @blur="focus1=false"></el-date-picker>
                                        <i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i> -->
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="inputHeight30 floatL mb0" style="margin-left:65px;width:300px;">
                                <el-form-item label="手机号：" :label-width="'74px'">
                                    <div class="tel" style="margin-left:16.5px;">+86<i class="el-icon-caret-bottom icon"></i></div>
                                    <div class="telInput">
                                        <el-input v-model="form.worker.phone" type="number" placeholder="请输入"></el-input>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="headWrap">
                                <img v-if="!form.worker.avatar" src="../../../assets/img/head@3x.svg" class="head" alt="">
                                <img v-else :src="form.worker.avatar" class="head" alt="">
                            </div>

                        </div>
                        <div class="title">IC卡信息</div>
                        <div class="wrap wrap2">
                            <div class="inputHeight30 floatL mb0">
                                <el-form-item label="IC卡号：">
                                    <el-input v-model="form.worker.icCardNo" disabled></el-input>
                                </el-form-item>
                            </div>
                            <div class="inputHeight30 floatL mb0" style="margin-left:142px;">
                                <el-form-item label="IC卡编码：">
                                    <el-input v-model="form.worker.icCardSeq" @change="icCardChange" placeholder="请输入"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                    </el-form>
                    <div v-if="loadingShow" class="bounced">卡机读取信息中…</div>
                </div>
                <div v-if="browser=='1'" class="btnWrap">
                    <div class="subBtn floatL btn1" @click="readcard">读卡</div>
                    <div class="subBtn floatL btn2" :class="{'uncomplate':!this.compare1[0]||!this.compare1[1]||!this.compare1[2]}" @click="signIn">确认无误，正常签到</div>
                </div>
                <div class="toie" v-if="browser==2">
                    <div>
                        <img src="../../../assets/img/toie.png" alt="">
                    </div>
                    <p>读卡器加载失败，请使用IE浏览器</p>
                </div>
			</div>
		</transition>
        <el-dialog
            title="用工计划"
            :visible.sync="dialogVisible"
            :modal-append-to-body="false"
            :width="'600px'"
            :custom-class="'signInDialog'"
            top="30.3vh">
            <div class="dialog">
                <div class="head">
                    <div class="checkBtn" :class="{'select':checkBtn==1}" @click="checkhead(1)">部门</div>
                    <div class="checkBtn" :class="{'select':checkBtn==2}" @click="checkhead(2)">工作时间</div>
                    <div class="checkBtn" :class="{'select':checkBtn==3}" @click="checkhead(3)">招聘者</div>
                </div>
                <div class="body">
                    <div class="step1" v-if="checkBtn==1">
                        <div class="top">
                            <div class="tagWrap" @click="tagCheck(i,k)" v-for="(i,k) in dataList" :key='k' :class="{'selectTag':i.check}">{{i.name}}</div>
                        </div>
                        <div class="line"></div>
                        <p class="txt">以下部门将在未来12小时内开始签到：</p>
                        <div class="bottom">
                            <div class="tagWrap" @click="tagCheck3(i,k)" v-for="(i,k) in dataList3" :key='k'>{{i.name}}</div>
                        </div>
                    </div>
                    <div class="step2" v-if="checkBtn==2">
                        <div class="bodyTitle">{{this.department}}</div>
                        <div class="listWrap">
                            <div class="item" @click="tagCheck1(k)" v-for="(i,k) in dataList1" :key="k" :class="{'borderBottom':k!=dataList1.length,'select1':i.check}">
                                <div class="div1">{{$base.timeplateTohm(i.startTime)}} - {{$base.timeplateTohm(i.endTime)}}</div>
                                <div class="div2">{{i.postName}}</div>
                                <div v-if="i.check" class="div3"></div>
                            </div>
                        </div>
                    </div>
                    <div class="step3" v-if="checkBtn==3">
                        <div class="bodyTitle">{{this.department+this.workTime+this.agencyName}}</div>
                        <div class="listWrap">
                            <div class="item" @click="tagCheck2(k)" v-for="(i,k) in dataList2" :key="k" :class="{'borderBottom':k!=dataList2.length,'select1':i.check}">
                                <div class="div1">{{i.name}}</div>
                                <div v-if="i.check" class="div3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="checkBtn<3" class="dialogBtn1">
                <div class="cancel" @click="dialogVisible=false">取消</div>
            </div>
            <div v-else class="dialogBtn" style="left:180px">
                <div class="sub" @click="sure">确定</div>
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
            <div class="dialog1">
                <p v-if="status==1" class="txt">“{{this.form.workerName}}”签到成功</p>
                <p v-if="status==2||status==3" class="txt">{{msg}}</p>
                <!-- <div class="error">
                    <p class="txt">“张三”已超过每月最多工时280小时，本月无法签到</p>
                    <div class="alert">
                        <div class="floatL div1">!</div>
                        <div class="floatL div2">请员工注意休息，劳逸结合</div>
                    </div>
                </div> -->
            </div>
            <div v-if="status==1" class="dialogBtn1">
                <div class="cancel" @click="status1Close">关闭</div>
            </div>
            <div v-if="status==2" class="dialogBtn">
                <div class="sub" @click="status2Close">确定</div>
                <div class="cancel" @click="dialogVisible1=false">关闭</div>
            </div>
            <div v-if="status==3" class="dialogBtn">
                <div class="sub" @click="status1Close">确定</div>
                <div class="cancel" @click="dialogVisible1=false">关闭</div>
            </div>
            <!-- <div class="dialogBtn nextSign">
                <div class="sub" @click="cancel">请下一位签到</div>
                <div class="cancel" @click="dialogVisible1=false">关闭</div>
            </div>   -->
        </el-dialog>
        <el-dialog
            title="签到失败"
            :visible.sync="dialogVisible2"
            :modal-append-to-body="false"
            :width="'450px'"
            :custom-class="'signInDialog'"
            top="30.3vh">
            <div class="dialog2" v-if="showWaring">{{showWaring}}</div>
            <div class="signFailed">
                <div class="cancel" @click="dialogVisible2=false">关闭</div>
            </div>  
        </el-dialog>
        <object id="CertCtl" name="CertCtl" type="application/cert-reader" width="0" height="0"></object>
        <object name="IcCardReader" width="0" height="0" id="IcCardReader" classid="clsid:05782014-9FF7-468C-BE96-8EDC73084202"></object>
    </div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'sign',
    mixins: [mixin],
    props: ['orderInit'],
	data () {
		return {
			show: false,
            _timeOut: '',
            step: 1,
            gender: '',
            form: {
                remark: "",
                agencyId: '',
                agencyName: '',
                orderId: '',
                orderDetailId: '',
                workerId: '',
                workerCertNo: '',
                orderNo: '',
                workerName: '',
                departmentId: '',
                departmentName: '',
                postId: '',
                postName: '',
                workTimeStart: '',
                workTimeEnd: '',
                verify: '',
                signInTime: '',
                signAgain: 'N',
                id: '',
                gender: '',
                icCardNo: '',
                icCardSeq: '',
                worker: {
                    name: '',
                    avatar: '',
                    icCardNo: '',
                    icCardSeq: '',
                    gender: '',
                    birthday: '',
                    certType: '',
                    certNo: '',
                    phone: ''
                },
            },

            focus1: false,
            cardList: [],
            dialogVisible: false,
            checkBtn:1,
            dataList: [],
            dataList1: [],
            dataList2: [],
            dataList3: [],
            department: '',
            workTime: '',
            agencyName: '',
            certificateCheck: true,
            workTxt: '请选择',
            compare: [false,false,false],
            dialogVisible1: false,
            dialogVisible2: false,
            birthday: '',
            age: '',
            browser: '',
            loadingShow: false,
            time1: '',
            time2: '',
            detailObj: {},
            unuse: '',
            compare1: [false, false, false],
            status: '',
            msg: '',
            showWaring: ''
		}
    },
    created() {
        if(this.$base.getBrowser()=='IE'){
            this.init()
            this.browser = '1'  
        }else{
            this.browser = '2'
        }
    },
	mounted () {
        this.show = true
	},
	methods: {
        readcard() {
            clearInterval(this.time1)
            clearInterval(this.time2)
            this.loadingShow = true
            if(this.browser=='1'){
                this.step1init()
                this.time1 = setInterval(() => {
                    this.step1init()
                }, 1000);
            }
        },
        status2Close() {
            this.dialogVisible1 = false
            this.form.verify = 'Y'
            this.signIn()
        },
        status1Close() {
            this.dialogVisible1 = false
        },
        icCardChange(e) {
            if(e.length) {
                this.compare1[0] = true
                this.compare1 = [].concat(this.compare1)
            }
        },
        init() {
            let date = new Date()
            this.$axios({
                method: 'get',
                url:this.$urls.getBillDetail+'?timeplate='+date.getTime()
            })
            .then(res=>{
                this.dataList = res.data.content.departmentList
                this.dataList.forEach(i=>{
                    i.check = false
                })
                
                this.dataList1 = res.data.content.orderDetailList
                this.dataList1.forEach(i=>{
                    i.check = false
                })
                this.dataList3 = res.data.content.departments
                this.dataList3.forEach(i=>{
                    i.check = false
                })
                
            })
            .catch(e=>{

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
                        this.form.worker.icCardNo = `00${strls.substring(11,13)}${strls.substring(9,11)}${strls.substring(7,9)}${strls.substring(5,7)}`
                        let date = new Date()
                        this.$axios({
                            method: 'get',
                            url:this.$urls.getPersonal+'?timeplate='+date.getTime(),
                            params:{icCardNo:this.form.worker.icCardNo,timestamp:new Date().getTime()}
                        })
                        .then(res=>{
                            console.log(res)
                            if(res.data.status==200) {
                                clearInterval(this.time1);
                                this.form.workerName = res.data.content.name
                                if(res.data.content.gender=='male'){
                                    this.gender = 1
                                }else{
                                    this.gender = 0
                                }
                                this.form.worker.birthday = this.$base.formattingTime(res.data.content.birthday)
                                this.form.worker.phone = res.data.content.phone
                                this.form.worker.certNo = res.data.content.certNo
                                this.form.worker.certType = res.data.content.certType
                                this.form.worker.avatar = res.data.content.avatar
                                this.compare1[1] = true                           
                            }else if(res.data.status==404){
                                clearInterval(this.time1);
                                this.showWaring = res.data.message
                                this.dialogVisible2=true
                            }else{
                                clearInterval(this.time1);
                                this.step2init()
                                this.time2 = setInterval(() => {
                                    this.step2init()
                                }, 2000);
                            }
                        })
                        .catch(e=>{
                            this.dataList = []
                        })
                        this.$axios({
                            method: 'get',
                            url:this.$urls.getIcCard+'?icCardNo='+this.form.worker.icCardNo,
                        })
                        .then(res=>{
                            if(res.data.status==200){
                                this.form.worker.icCardSeq = res.data.content.icCardSeq
                                this.compare1[0] = true
                                this.compare1 = [].concat(this.compare1)
                            }
                        })
                        .catch(e=>{
                            
                        })
                        this.loadingShow = false
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
                    console.log(idCardResultObj.resultContent);
                    clearInterval(this.time2);
                    this.form.workerName = idCardResultObj.resultContent.partyName
                    this.gender = idCardResultObj.resultContent.gender
                    let date = idCardResultObj.resultContent.bornDay
                    let numberString = idCardResultObj.resultContent.certNumber.substring(6,14)
                    // this.form.worker.birthday = this.$base.dateforTimestamp(date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8))
                    this.form.worker.birthday = numberString.substring(0,4)+'-'+numberString.substring(4,6)+'-'+numberString.substring(6,8)
                    console.log(this.form.worker.birthday)
                    this.age = this.$base.age(this.form.bornDay)
                    this.form.worker.certNo = idCardResultObj.resultContent.certNumber
                    this.form.worker.avatar = "data:image/png;base64,"+idCardResultObj.resultContent.identityPic
                    this.form.worker.certType = 'id-card'
                    checkIDCard = false;
                    this.compare1[1] = true
                    this.compare1 = [].concat(this.compare1)
                }
            }
        },
        signIn() {
            if(!this.compare1[2]) {
                this.$message({
                    message: "请选择用工计划",
                    type: 'error',
                    duration: 5 * 1000,			
                })
                return 
            }
            if(!this.form.worker.icCardSeq) {
                this.$message({
                    message: "请输入IC卡编码",
                    type: 'error',
                    duration: 5 * 1000,			
                })
                return 
            }
            if(!this.compare1[0]||!this.compare1[1]||!this.compare1[2]){
                return
            }
            this.form.workerCertNo = this.form.worker.certNo
            this.form.worker.name = this.form.workerName
            this.form.icCardSeq = this.form.worker.icCardSeq
            this.form.icCardNo = this.form.worker.icCardNo
            if(this.gender==1) {
                this.form.worker.gender = 'male'
            }else{
                this.form.worker.gender = 'female'
            }
            this.form.gender = this.form.worker.gender
            if(this.$store.state.recruitmentPlan.signParams.type=='resign') {
                this.form.id = this.$store.state.recruitmentPlan.signParams.data.id
                this.form.orderNo = this.$store.state.recruitmentPlan.signParams.data.orderNo
                this.form.workerId = this.$store.state.recruitmentPlan.signParams.data.workerId
                this.form.signInTime = this.$store.state.recruitmentPlan.signParams.data.signInTime
                this.form.signAgain = 'Y'
            }
            this.$axios({
                method: 'post',
                url:this.$urls.addSign,
                data:this.form
            })
            .then(res=>{
                if(res.data.status==200) {
                    this.status = 1
                    this.gender = ''
                    this.form.remark = ''
                    this.form.workerName = ''
                    this.form.worker.certType = ''
                    this.form.worker.certNo = ''
                    this.form.worker.birthday = ''
                    this.form.worker.phone = ''
                    this.form.worker.avatar = ''
                    this.form.worker.icCardNo = ''
                    this.form.worker.icCardSeq = ''
                    this.dialogVisible1 = true
                }else if(res.data.status==401) {
                    this.status = 2
                    this.msg = res.data.message
                    this.dialogVisible1 = true
                }else {
                    this.status = 3
                    this.msg = res.data.message
                    this.dialogVisible1 = true
                }
            })
            .catch(e=>{

            })
        },
        checkhead(data) {
            if(data==2&&!this.compare[0]){
                return
            }
            if(data==3&&(!this.compare[0]||!this.compare[1])){
                return
            }
            this.checkBtn = data
        },
        sure() {
            if(!this.department||!this.workTime||!this.agencyName){
                return
            }
            this.workTxt = this.department+this.workTime+this.agencyName
            this.dialogVisible = false
            this.compare1[2] = true
            this.compare1 = [].concat(this.compare1)
        },
        tagCheck(i,k) {
            this.dataList.forEach((item,key)=>{
                item.check = false
                if (i.name == item.name) {
                    item.check = !item.check
                    this.department = i.name+'，'
                    this.form.departmentId = i.id
                    this.form.departmentName = i.name
                }
            })
            this.dataList = [].concat(this.dataList)
            this.compare[0] = true
            this.compare = [].concat(this.compare)
            this.checkTag()
        },
        tagCheck1(k) {
            this.dataList1.forEach((i,key)=>{
                i.check = false
                if(k==key) {
                    i.check = !i.check
                    this.workTime = `${this.$base.timeplateTohm(i.startTime)}-${this.$base.timeplateTohm(i.endTime)}，${i.postName}，`
                    this.form.postId = i.postId
                    this.form.postName = i.postName
                    this.form.workTimeStart = i.startTime
                    this.form.workTimeEnd = i.endTime
                    this.form.orderDetailId = i.id
                    this.form.orderId = i.orderId
                }
            })
            let date = new Date()
            this.$axios({
                method: 'get',
                url:this.$urls.getListAgency+this.form.postId+'?timeplate='+date.getTime()
            })
            .then(res=>{      
                if(res.data.status==200){
                    this.dataList2 = res.data.content
                    this.dataList2.forEach(i=>{
                        i.check = false
                    })
                }
            })
            .catch(e=>{
                
            })
            this.dataList1 = [].concat(this.dataList1)
            this.compare[1] = true
            this.compare = [].concat(this.compare)
            this.checkTag()
        },
        tagCheck2(k) {
            this.dataList2.forEach((i,key)=>{
                i.check = false
                if(k==key) {
                    i.check = !i.check
                    this.agencyName = i.name
                    this.detailObj = i
                    this.form.agencyId = i.id
                    this.form.agencyName = i.name
                }
            })
            this.compare[2] = true
            this.compare = [].concat(this.compare)
        },
        checkTag() {
            setTimeout(()=>{
                this.checkBtn++
            },200)
        },
		cancel() {
            this.show = false
            this.orderInit()
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('signPageShow')
			}, 200)
        },
        planShow() {
            this.dialogVisible = true
        },

	},
	destroyed() {
        clearInterval(this.time1)
        clearInterval(this.time2)
        clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
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
.dialog1{
    .txt{
        margin-top: 80px;
        text-align: center;
        font-size: 16px;
    }
    .error{
        width: 270px;
        margin: 0 auto;
        .txt{
            text-align: left;
        }
        .alert{
            overflow: hidden;
            margin-top: 5px;
            .div1{
                width: 12px;
                height: 12px;
                border-radius: 50%;
                line-height:12px;
                font-size:12px;
                color:white;
                text-align: center;
                margin:2.5px 6px 0 0;
                background-color:#e45a3c;
            }
            .div2{
                font-size: 12px;
                color: #666666;
            }
        }
    }
    .floatL{
        float: left;
    }

}
.dialogBtn{
    width: 270px;
    left: 90px;
    div{
        width: 28px;
        padding: 4px 30px;
        font-size: 14px;
        height: 20px;
    }

}
.nextSign{
    .sub{
        width: 84px;
        padding: 4px 17px;
    }
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
.dialog{
    box-sizing: border-box;
    height: 369px;
    .head{
        height: 40px;
        background-color: #eaf3fe;
        padding: 0 10px;
        .checkBtn{
            width: 80px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            color: #444950;
            float: left;
            margin-left: 44px;
            font-size: 16px;
        }
        .select{
            border-bottom: 2px solid #4c8aff;
            color: #4c8aff;
        }
    }
    .body{
        .bodyTitle{
            font-size: 16px;
            color: #999999;
            padding: 20px;
        }
        .listWrap{
            width: 560px;
            height: 157px;
            margin: 0 auto;
            border: solid 1px #ececec;
            overflow-y: scroll;
            .item{
                overflow: hidden;
                font-size: 16px;
                div{
                    height: 38px;
                    line-height: 38px;
                    float: left;
                }
                .div1{
                    margin-left: 30px;
                    width: 115px;
                }
                .div2{
                    margin-left: 69px;
                }
                .div3{
                    width: 17px;
                    height: 12px;
                    float: right;
                    margin: 13px 30px 0 0;
                    background: url("../../../assets/img/dagou.png") no-repeat;
                    background-size: 100% 100%;
                }
            }
            .select1{
                color: #4c8aff;
            }
            .borderBottom{
                border-bottom: 1px solid #ececec;
            }
        }
        .step1{
            overflow: hidden;
            padding: 20px;
            .top{
                overflow: hidden;
                height: 84px;
                overflow-y: scroll;
            }
            .bottom{
                overflow: hidden;
            }
            .line{
                width: 560px;
                margin: 10px auto;
                border-top: 1px dashed #d4d4d4;
            }
            .txt{
                font-size: 14px;
                color: #999999;
                margin: 20px 0;
            }
            .tagWrap{
                min-width: 68px;
                height: 22px;
                line-height: 22px;
                border: 1px solid #ececec;
                background-color: #ffffff;
                border-radius: 1px;
                color: #999999;
                font-size: 16px;
                padding: 3px 10px;
                float: left;
                margin-bottom: 20px;
                margin-right: 20px;
                text-align: center;
            }
            .selectTag{
                border: solid 1px #4c8aff;
                color: #4c8aff;
            }
        }
        .step3{
            .listWrap{
                .item{
                    .div1{
                        width: auto;
                    }
                }
            }
        }
    }
}
.panelWrap .panel .panelTitleWrap .panelTitle .txt{
    font-size: 16px;
}
.panel{
	width:900px;
    overflow-y: scroll;
    .floatL{
        float: left;
    }
    .minH{
        min-height: calc(100% - 155px);
        margin-bottom: 30px;
        position: relative;
        .bounced{
            position: absolute;
            width: 300px;
            height: 70px;
            background-color: rgba(68, 73, 80, 0.51);
            border-radius: 5px;
            font-size: 20px;
            color: #ffffff;
            text-align: center;
            line-height: 70px;
            top: 50%;
            margin-top: -35px;
            left: 50%;
            margin-left: -150px;
        }
        .stepWrap{
            width: 610px;
            height: 66px;
            margin: 0 auto;
            margin-top: 25px;
            .step{
                width: 140px;
                position: relative;
                float: left;
                .top{
                    width: 36px;
                    height: 36px;
                    border: solid 1px #d4d4d4;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 36px;
                    color: #d4d4d4;
                    margin: 0 auto;
                }
                .bottom{
                    font-size: 14px;
                    color: #999999;
                    margin-top: 10px;
                    text-align: center;
                }
                .line{
                    width: 184px;
                    height: 1px;
                    background-color: #d4d4d4;
                    position: absolute;
                    top: 18px;
                    left: 95px;
                }
                .complete1{
                    background-color: #4c8aff;
                }
            }
            .step2,.step3{
                margin-left: 95px;
            }
            .complete{
                .top{
                    border: solid 1px #4c8aff;
                    color: #4c8aff;
                }
                .bottom{
                    color: #4c8aff;
                }
            }
        }
        .dashedLine{
            width: 710px;
            border-top: dashed 1px #d4d4d4;
            margin: 0 auto;
            margin-top: 24px;
        }
        .title{
            font-size: 16px;
            color: #666666;
            font-weight: bold;
            margin: 15px 0 0 20px;
        }
        .wrap{
            padding: 24px;
            background-color: #f4f8fc;
            border-radius: 2px;
            width: 860px;
            box-sizing: border-box;
            margin: 0 auto;
            margin-top: 15px;
            overflow: hidden;
            .inputHeight30{
                // background: #ccc;
                height: 30px;
                width: 290px;
                margin-bottom: 24px;
                position: relative;
                .template{
                    position: absolute;
                    right: 10px;
                    top: 0px;
                }
                .tel{
                    float: left;
                    width: 60px;
                    height: 30px;
                    box-sizing: border-box;
                    border: 1px solid #ececec;
                    line-height: 28px;
                    text-indent: 8px;
                    border-radius: 1px;
                    background-color: #fff;
                    font-size: 16px;
                    margin-top: 0.5px;
                    position: relative;
                    .icon{
                        color:#999999;
                        position: absolute;
                        top: 7px;
                        right: 8px;
                        font-size: 13px;
                    }
                }
                .telInput{
                    float: left;
                    margin-left: 5px;
                    height: 30px;
                    width: 135px;
                }
            }
            .mb0{
                margin-bottom: 0;
            }
            .clear{
                clear: both;
            }
        }
        .wrap1{
            position: relative;
            .width274{
                width: 274px;
            }
            .wrap1Btn{
                font-size: 12px;
                color: #4c8aff;
                margin: 7px 0 0 10px;
                cursor: pointer;
            }
            .headWrap{
                width: 150px;
                height: 150px;
                border-radius: 50%;
                overflow: hidden;
                position: absolute;
                top: 21px;
                right: 24px;
                img{
                    width: 100%;
                }
            }
            .head{
                width: 150px;
            }
            .sex .el-form-item .el-form-item--medium{
                float: left;
                margin-top: 110px;
            }
        }
        .wrap3{
            .reasonWrap{
                overflow: hidden;
                .left{
                    float: left;
                    margin-top: 4px;
                    font-size: 16px;
                    color: #444950;
                    width: 90px;
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
            .inputHeight30{
                width: 750px;

            }
            .detailbtn{
                font-size: 14px;
                color: #999999;
                margin: 4px 0 0 10px;
            }
            .content{
                p{
                    color: #444950;
                    font-size: 12px;
                }
            }
        }
        .wrap4{
            .item{
                overflow: hidden;
                font-size: 14px;
                float: left;
                height: 20px;
                line-height: 20px;
                .left{
                    float: left;
                    width: 80px;
                }
                .right{
                    float: left;
                }
            }
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
    }
    .btnWrap{
        height: 57px;
        overflow: hidden;
        cursor: pointer;
        .subBtn{
            width: 50%;
            height: 57px;
            background-color: #4c8aff;
            line-height: 57px;
            text-align: center;
            font-size: 18px;
            color: #ffffff;
        }
        .btn1{
            background-color: #eaf3fe;
            color: #4c8aff;
        }
        .uncomplate{
            background-color: #ececec;
            color: #999999;
        }
    }
    .fixed{
        width: 860px;
    }
    .position{
        position: relative;
        i{
            position: absolute;
            right: 10px;
            top:9px;
            color: #c0c4cc;
            transition: all .2s;
        }
        .focus1{
            transform: rotate(180deg);
        }
    }
    
}
.dialog2{
    width: 100%;
    height: 27px;
    float: left;
    text-align: center;
    line-height: 27px;
    margin: -120px auto;
    color: #444950;
}
.signFailed{
    display: flex;
    justify-content: center;
    margin-top: 205px;
    .cancel{
        width: 80px;
        height: 27px;
        line-height: 27px;
        text-align: center;
        border: .5px solid #4c8aff;
        border-radius: 14.5px;
        color: #4c8aff;
        cursor: pointer;
    }
}
</style>
