<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">{{$store.state.recruitmentPlan.panelTitle}}</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div style="height:50px;" v-if="fixed"></div>
                <div class="minH">
                    <div class="title">基本信息</div>
                    <div class="wrapContent">
                        <div class="headPhoto">
                            <img src="../../../assets/img/head@3x.svg" alt="" v-if="!avator">
                            <img :src= avator alt="" v-else>
                        </div>
                        <el-form :model="ruleForm" ref="ruleForm" size="medium" class="demo-ruleForm">
                            <div class="personalNameOne">
                                <el-form-item label="姓名:" label-width="80px;" style="margin-left:26px;">
									<span>{{userName}}</span>
								</el-form-item>
                                <el-form-item label="性别:" style="margin-left:140.5px;">
                                    <el-radio v-model="radio" label="male">男</el-radio>
                                    <el-radio v-model="radio" label="female">女</el-radio>
								</el-form-item>
                            </div>
                            <div class="dateBirth">
                                <div class="personalPosition">
                                    <el-form-item label="出生日期:">
                                        <el-date-picker type="date" placeholder="请选择日期" v-model="ruleForm.CreateDate" style="width: 100%;" @focus="focus3=true" @blur="focus3=false"></el-date-picker>
                                        <i class="el-icon-arrow-down" :class="{'focus1':focus3}"></i>
                                    </el-form-item>
                                </div>
                                <div class="age"><el-form-item label="年龄:" label-width="80px;">
									<span>{{age}}岁</span>
								</el-form-item></div>
                            </div>
                            <div class="HeightCode">
                                <el-form-item label="身高:">
                                    <div class="personalHeight">
                                        <el-input v-model="ruleForm.height" placeholder="请输入" style="width:180px;">
                                            <span slot="suffix" class="heightcm">cm</span>
                                        </el-input>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="MobileCode">
                                <el-form-item label="手机号:">
                                    <div class="MobileCodeTwo">
                                        <el-select v-model="ruleForm.region" placeholder="+86" style="width:60px;" @focus="focus4=true" @blur="focus4=false">
                                            <el-option label="+86" value="+86"></el-option>
                                        </el-select>
                                        <img src="../../../assets/img/Triangle.svg" alt="" :class="{'focus1':focus4}">
                                    </div>
                                    <div class="MobileCodeOne">
                                        <el-input v-model="ruleForm.phone" placeholder="请输入" style="width:118px;"></el-input>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="NumberCode">
                                <el-form-item label="QQ号:" style="width:260px;">
                                    <div class="qqCodeThe">
                                        <el-input v-model="ruleForm.qq" placeholder="请输入" style="width:180px;"></el-input>
                                    </div>
                                </el-form-item>
                                <div class="NumberCodeOne">
                                    <el-form-item label="微信号:" style="width:260px;">
                                        <el-input v-model="ruleForm.wechart" placeholder="请输入" style="width:180px;"></el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="CertificateCode">
                                <el-form-item label="证件类型:" style="width:260px;">
                                    <span>{{certType | chang}}</span>
                                </el-form-item>
                                <div class="CertificateCodeOne">
                                    <el-form-item label="证件号:" style="width:260px;">
                                        <span v-if="cover">{{certNo | certNoType}}</span>
                                        <span v-else>{{certNo}}</span>
                                       <img :src='registration_data.src' alt="" @click="changeType">
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="TypeCode">
                                <el-form-item label="类型:" style="width:260px;">
                                    <span>{{category | TypeOfWork}}</span>
                                </el-form-item>
                                <div class="TypeCodeOne">
                                    <el-form-item style="width:260px;">
                                       <el-checkbox v-model="ruleForm.checked" v-for="BlackName in BlackNameList" :key="BlackName" @change="black(ruleForm.checked)">{{BlackName}}</el-checkbox>
                                    </el-form-item>
                                </div>
                            </div>
                        </el-form>
                    </div>
                    <div class="blackname" v-if="blacknamepersonal == 'enable'"><img src="../../../assets/img/heimingdan.png" alt=""></div>
                    <div v-if="blacknamepersonal != 'enable'">
                        <div class="title">支付信息</div>
                        <div class="wrapContenttwo">
                            <el-form :model="ruleForm" ref="ruleForm" size="medium">
                                <div class="banktype">
                                    <div class="banktypeOne">
                                        <el-form-item label="银行名称:" style="width:260px;">
                                            <div class="MobileCodeThe">
                                                <el-input v-model="ruleForm.bankName" placeholder="请输入" style="width:176px;"></el-input>
                                            </div>
                                        </el-form-item>
                                    </div>
                                    <div class="banktypeTwo">
                                        <el-form-item label="开户支行:" style="width:260px;">
                                            <el-input v-model="ruleForm.subBankName" placeholder="请输入" style="width:176px;"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="banktypeThe">
                                    <el-form-item label="银行卡号:" style="width:260px;">
                                        <el-input v-model="ruleForm.BankId" placeholder="请输入" style="width:176px;"></el-input>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </div>
                    </div>
                    <div>
                        <div class="title">工作信息</div>
                        <div class="wrapContentone">
                            <div class="item1">本月工时：<span>{{monthWorkDuration/3600000 | keepDecimal}}小时</span></div>                            
                            <div class="item2">累计工时：<span>{{allWorkDuration/3600000 | keepDecimal}}小时</span></div>
                            <div class="item3">工作总次数：<span>{{allWorkTimes | workTime}}次</span></div>
                        </div>
                    </div>      
                    <div v-if="(blacknamepersonal != 'enable')&&(this.certs!=null)">
                        <div class="title">从业资格证信息</div>
                        <div class="certificateWrap">
                            <div class="certificate">
                                <div class="originallyCert" :class="{'select':certificateCheck[index]}" @click="itemTitle(index)" v-for="(cert,index) in certs" :key="index">{{cert.certName}}</div>
                                <div class="otherCertInformation"><div :class="{'select':otherCertificateCheck[k]}"  @click="handleOtherCert(k)" v-for="(i,k) in appObject" :key="k"><span v-if="i.certName.length==0">{{i.theUnknown}}</span><span v-else>{{i.certName}}</span></div></div>
                            </div>
                            <div class="allCertificate">
                                <div class="existingcert" v-for="(cert,index) in certs" :key="index">
                                    <div class="left" v-if="certificateCheck[index]">
                                        <div class="img" @click="deleteOriginallyCert(index)"><span>删除</span></div>
                                        <el-form :model="ruleForm" ref="ruleForm" size="medium">
                                            <div class="certType">
                                                <div class="localDocuments">
                                                    <el-form-item label="证件类型:" style="100px;">
                                                        <el-select v-model="cert.certName" placeholder="请选择" @change="chooseTypeCert(cert.certName,index)">
                                                            <el-option :label= item.name :value= item.name v-for="(item,index) in certTypeList" :key="index"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                                <div class="certTypeTwo">
                                                    <el-form-item label="证号:" style="width:260px;">
                                                        <el-input v-model="cert.certNo" placeholder="请输入" style="width:176px;" @change="chooseTypeCert1(cert.certNo,index)"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                            <div class="periodValidity">
                                                <div class="positionOne">
                                                    <el-form-item label="有效期:">
                                                        <el-date-picker type="date" placeholder="请选择日期" v-model="cert.certStartDate" style="width: 100%;margin-left:1px;" @focus="focus2=true" @blur="focus2=false" @change="chooseTypeCert2(cert.certStartDate,index)"></el-date-picker>
                                                        <i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
                                                    </el-form-item>
                                                </div>
                                                <div class="dashLine"></div>
                                                <div class="positionTwo">
                                                    <el-form-item>
                                                        <el-date-picker type="date" placeholder="请选择日期" v-model="cert.certEndDate" style="width: 100%;" @focus="focus1=true" @blur="focus1=false" @change="chooseTypeCert3(cert.certEndDate,index)"></el-date-picker>
                                                        <i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                            <div class="organ">
                                                <div class="organOne">
                                                    <el-form-item label="发证机关:" style="width:260px;">
                                                        <el-input v-model="cert.certOrg" placeholder="请输入" style="width:176px;" @change="chooseTypeCert4(cert.certOrg,index)"></el-input>
                                                    </el-form-item>
                                                </div>               
                                                <div class="certPhoto">
                                                    <div class="picphoto" v-for="(i,k) in cert.attachList" :key="k">
                                                        <img :src= photoUrl+i.filepath+i.filedate alt="">
                                                    </div>
                                                    <div class="organTwo wipeOut" v-if="cert.attachList.length<2">
                                                        <el-upload
                                                            :action= "actionUrl"
                                                            list-type="picture-card"
                                                            :limit="cert.attachList.length==1?1:2"
                                                            :on-success="imgFileSuccess1"
                                                            :on-exceed="handleExceedImg"
                                                            :on-preview="handlePictureCardPreview"
                                                            :on-remove="handleRemove">
                                                            <span class="cross"></span>
                                                            <span class="vertical"></span>
                                                        </el-upload>
                                                        <el-dialog :visible.sync="dialogVisible">
                                                            <img width="100%" :src="dialogImageUrl" :modal-append-to-body="false" alt="">
                                                        </el-dialog>
                                                    </div>
                                                </div>
                                            </div>
                                        </el-form>
                                    </div> 
                                </div>

                                <div>
                                    <div class="certificateContent" v-for="(i,k) in appObject" :key="k">
                                        <div v-if="otherCertificateCheck[k]">
                                            <div class="img" @click="deleteCert(k)"><span>删除</span></div>
                                            <div class="left">
                                                <el-form  ref="ruleForm" size="medium">
                                                    <div class="certType">
                                                        <div class="localDocuments">
                                                            <el-form-item label="证件类型:" style="100px;">
                                                                    <el-select v-model="i.certName" placeholder="请选择" @change="chooseType(certTypeList,i.certName,k)">
                                                                        <el-option :label= item.name :value= item.name v-for="(item,index) in certTypeList" :key="index"></el-option>
                                                                    </el-select>
                                                            </el-form-item>
                                                        </div>
                                                        <div class="certTypeTwo">
                                                            <el-form-item label="证号:" style="width:260px;">
                                                                <el-input v-model="i.certNo" placeholder="请输入" style="width:176px;"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </div>
                                                    <div class="periodValidity">
                                                        <div class="positionOne">
                                                            <el-form-item label="有效期:">
                                                                <el-date-picker type="date" placeholder="请选择日期" v-model="i.certStartDate" style="width: 100%;" @focus="focus2=true" @blur="focus2=false"></el-date-picker>
                                                                <i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
                                                            </el-form-item>
                                                        </div>
                                                        <div class="dashLine"></div>
                                                        <div class="positionTwo">
                                                            <el-form-item>
                                                                <el-date-picker type="date" placeholder="请选择日期" v-model="i.certEndDate" style="width: 100%;" @focus="focus1=true" @blur="focus1=false"></el-date-picker>
                                                                <i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
                                                            </el-form-item>
                                                        </div>
                                                    </div>
                                                    <div class="organ">
                                                        <div class="organOne">
                                                            <el-form-item label="发证机关:" style="width:260px;">
                                                                <el-input v-model="i.certOrg" placeholder="请输入" style="width:176px;"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                        <div class="organTwo">
                                                            <el-upload
                                                                :action= "actionUrl"
                                                                list-type="picture-card"
                                                                :limit= 2
                                                                :on-success="imgFileSuccess"
                                                                :on-exceed="handleExceedImg"
                                                                :on-preview="handlePictureCardPreview"
                                                                :on-remove="handleRemove">
                                                                <i class="el-icon-plus"></i>
                                                                <span class="cross"></span>
                                                                <span class="vertical"></span>
                                                            </el-upload>
                                                            <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
                                                                <img width="100%" :src="dialogImageUrl" alt="">
                                                            </el-dialog>
                                                        </div>
                                                    </div>
                                                </el-form>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                                <div class="addmore" @click="qualificationCertificate()"><div class="addicons"></div><span>添加更多从业资格证</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="subBtn">
                    <div @click="confirm">确定</div>
                    <div @click="cancel">取消</div>
                </div>
			</div>
		</transition>
        
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
import _ from 'lodash'
export default {
    name: 'personalInformationOne',
    mixins: [mixin],
	data () {
		return {
            ruleForm:{
                label: '',
                CreateDate: '',
                CreateDateNoChange: '',
                name: '',
                height: '',
                region: '+86',
                phone: '',
                wechart: '',
                qq: '',
                bankName: '',
                subBankName: '',
                BankId: '',
                checked: false
            },
            value: '',
            appObject: [],
            appObject1: [],
            registration_data:{
                src: require('../../../assets/img/closeeye.svg')
            },
            radio: '',
            BlackNameList: ['黑名单'],
            actionUrl: this.$baseApi + this.$urls.singlefile,
            certs: [],
            show: false, 
            certificateCheck: [true],
            otherCertificateCheck: [],
            cover: true,  //是否遮盖证件号
            certTypeList: [],
            _timeOut: '',
            userName: '',
            age: '',
            certType: '',
            certNo: '',
            allWorkTimes: '',
            allWorkDuration: '',
            monthWorkDuration: '',
            category: '',
            blacknamepersonal: '',
            focus1: false,
			focus2: false,
            focus3: false,
            focus4: false,
            fixed: false,
            dialogVisible: false,
            dialogImageUrl: '',
            avator: '',
            id: '',
            imgArr: [],
            Arr: [],
            Arr1: [],
            attachList: [],
            // attachSize: 0,
            // originalArr: [],
            index: 0,
            code: 0,
            photoUrl: 'https://company-test.lanniao.com/upload/'
		}
    },
    watch: {
        
    },
	mounted () {
        this.show = true
        if(this.$store.state.recruitmentPlan.state == 5){
            this.blackname()
        }else{ this.init() }
    },
    created() {
        this.initCertType()
    },
    filters:{
        workTime(val) {
            if(!val){
                return '0'
            }else{ return val }
        },
        keepDecimal(val){
			if(val&&val!==0){
				return val.toFixed(1)
			}else if(val===0){
				return '0'
			}
		},
        meal(str){
            if(str == 'male'){
                return '男'
            }else{
                return '女'
            }
        },
        chang(id){
            if(id == 'id-card'){
                return "中国居民身份证"
            }else if(id == 'passport'){
                return "护照"
            }else if(id == 'home-card'){
                return '回乡证'
            }else if(id == 'tw-card'){
                return '台胞证'
            }
        },
        minusSign(val){
            if(val<0){
                return val = -val
            }else{
                return val = val
            }
        },
        phoneType(phone){
			if(phone){
				return phone.substring(0,3) + "-" + phone.substring(3,7) + "-" + phone.substring(7,13)
			}else{
				return ''
			}
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
        certNoType(cert) {
            if(cert){
                return '**************' + cert.substring(14,18)
            }else{
                return ''
            }
        }
    },
	methods: {
        chooseTypeCert(value,k) {
            this.Arr[k].certName = value
        },
        chooseTypeCert1(value,k) {
            this.Arr[k].certNo = value
        },
        chooseTypeCert2(value,k) {
            this.Arr[k].certStartDate = new Date(value).getTime()
        },
        chooseTypeCert3(value,k) {
            this.Arr[k].certEndDate = new Date(value).getTime()
        },
        chooseTypeCert4(value,k) {
            this.Arr[k].certOrg = value
        },
        chooseType(cert,item,k) {
            cert.forEach((i)=>{
                if(item==i.name){
                    this.appObject[k].id=i.id
                }
            })
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
			this.dialogVisible = true;
        },
        handleRemove(file, fileList) {
            this.imgArr.forEach((i,k)=>{
				if(i==file.response.content.id){
					this.imgArr.splice(k,1)
				}
			})
        },
        imgFileSuccess(file) {
            if(file.status==200){
                this.appObject.forEach(i=>{
                    i.attachList.push({id:file.content.id,index: this.index})
                })
			}else{
				this.$message({
					message: response.message||"上传失败",
					type: 'error',
					duration: 5 * 1000
				})
            }
        },
        imgFileSuccess1(file) {
            if(file.status==200){
                this.Arr1.push({id:file.content.id,index: this.code})
                this.Arr.forEach(i=>{
                    i.attachList=i.attachList.concat(this.Arr1)
                })
                console.log(this.Arr)
			}else{
				this.$message({
					message: response.message||"上传失败",
					type: 'error',
					duration: 5 * 1000
				})
            }
        },
        handleExceedImg(files, fileList) {
            this.$message({
				message: "最多上传两张照片",
				type: 'error',
				duration: 5 * 1000,			
			})
        },
        changeType() {
            this.cover = !this.cover
            this.registration_data.src=this.registration_data.src == require("../../../assets/img/closeeye.svg") ? require("../../../assets/img/openeye.svg") : require("../../../assets/img/closeeye.svg");
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('personalInformationOne')
			}, 200)
        },
        init() {
            this.$axios({
                method: 'post',
                url: this.$urls.message,
                data: {
                    workerId: this.$store.state.recruitmentPlan.id.workerId,
                    agencyId: this.$store.state.recruitmentPlan.id.agencyId,
                    orderDetailId: this.$store.state.recruitmentPlan.id.orderDetailId,
                    orderId: this.$store.state.recruitmentPlan.id.orderId,
                    signId: this.$store.state.recruitmentPlan.id.id
                }
            })
            .then(res => {
                // console.log(res)
                let newArr=[]
                this.avator = _.get(res,'data.worker.avatar','')
                this.userName = _.get(res,'data.worker.name','')
                if(_.get(res,'data.worker.gender','') == 'male'){
					this.radio = 'male'
				}else if(_.get(res,'data.worker.gender','') == 'female'){
					this.radio = 'female'
				}
                this.ruleForm.CreateDate = this.$base.formattingTime(_.get(res,'data.worker.birthday',''))
                this.ruleForm.CreateDateNoChange = _.get(res,'data.worker.birthday','')
                this.age = this.$base.age(_.get(res,'data.worker.birthday',''))
                this.ruleForm.height = _.get(res,'data.worker.height','')
                this.ruleForm.phone = _.get(res,'data.worker.phone','').substring(3,14)
                this.ruleForm.qq = _.get(res,'data.worker.qq','')
                this.ruleForm.wechart = _.get(res,'data.worker.wechat','')
                this.certType = _.get(res,'data.worker.certType','')
                this.certNo = _.get(res,'data.worker.certNo','')
                this.category = _.get(res,'data.worker.category','')
                this.ruleForm.bankName = _.get(res,'data.worker.bankName','')
                this.ruleForm.subBankName = _.get(res,'data.worker.subBankName','')
                this.bankNo = _.get(res,'data.worker.bankNo','')
                this.ruleForm.BankId = _.get(res,'data.worker.bankNo','')
                this.id = _.get(res,'data.worker.id','')
                if(!res.data.workerTime){
                    this.allWorkDuration==0
                    this.monthWorkDuration==0
                    this.allWorkTimes==0
                }else{ 
                    this.allWorkDuration = res.data.workerTime.allWorkDuration
                    this.monthWorkDuration = res.data.workerTime.monthWorkDuration
                    this.allWorkTimes = res.data.workerTime.allWorkTimes
                    }
                newArr = _.get(res,'data.workerCertManagerVoList',[])
                let hash={}
                newArr=newArr.reduce(function(item, next){
                     hash[next.certName] ? '' : hash[next.certName] = true&&item.push(next);
                     return item
                },[])
                this.certs = newArr
                for(let i=0;i<this.certs.length;i++){
                    this.certificateCheck.push(false)
                }
                this.certs.forEach((i,k)=>{
                    // console.log(i)
                    this.Arr.push({
                        attachList: i.attachList,
                        certName: i.certName,
                        certNo: i.certNo,
                        certStartDate: i.certStartDate,
                        certEndDate: i.certEndDate,
                        certOrg: i.certOrg,
                        certTypeId: i.certTypeId,
                        createTime:i.createTime,
                        creator: i.creator,
                        hotalId: i.hotalId,
                        workerId: i.workerId,
                        id: i.id
                    })
                })
                if(this.certs.length==0){
                    this.otherCertificateCheck = [true]
                    this.appObject.push({
                        theUnknown: '未知',
                        index: this.index,
                        id: '',
                        certName: '',
                        certNo: '',
                        certStartDate: '',
                        certEndDate: '',
                        certOrg: '',
                        attachList: []})
                }
            })
        },
        blackname() {
            this.$axios({
                method: 'post',
                url: this.$urls.message,
                data: {
                    workerId: this.$store.state.recruitmentPlan.id
                }
            })
            .then(res => {
                let newArr=[]
                this.avator = _.get(res,'data.worker.avatar','')
                this.userName = _.get(res,'data.worker.name','')
                if(_.get(res,'data.worker.gender','') == 'male'){
					this.radio = 'male'
				}else if(_.get(res,'data.worker.gender','') == 'female'){
					this.radio = 'female'
				}
                this.ruleForm.CreateDate = this.$base.formattingTime(_.get(res,'data.worker.birthday',''))
                this.ruleForm.CreateDateNoChange = _.get(res,'data.worker.birthday','')
                this.age = this.$base.age(_.get(res,'data.worker.birthday',''))
                this.ruleForm.height = _.get(res,'data.worker.height','')
                this.ruleForm.phone = _.get(res,'data.worker.phone','').substring(3,14)
                this.ruleForm.qq = _.get(res,'data.worker.qq','')
                this.ruleForm.wechart = _.get(res,'data.worker.wechat','')
                this.certType = _.get(res,'data.worker.certType','')
                this.certNo = _.get(res,'data.worker.certNo','')
                this.category = _.get(res,'data.worker.category','')
                this.ruleForm.bankName = _.get(res,'data.worker.bankName','')
                this.ruleForm.subBankName = _.get(res,'data.worker.subBankName','')
                this.bankNo = _.get(res,'data.worker.bankNo','')
                this.ruleForm.BankId = _.get(res,'data.worker.bankNo','')
                this.id = _.get(res,'data.worker.id','')
                if(!res.data.workerTime){
                    this.allWorkDuration==0
                    this.monthWorkDuration==0
                    this.allWorkTimes==0
                }else{ 
                    this.allWorkDuration = res.data.workerTime.allWorkDuration
                    this.monthWorkDuration = res.data.workerTime.monthWorkDuration
                    this.allWorkTimes = res.data.workerTime.allWorkTimes
                    }
                newArr = _.get(res,'data.workerCertList',[])
                let hash={}
                newArr=newArr.reduce(function(item, next){
                     hash[next.certName] ? '' : hash[next.certName] = true&&item.push(next);
                     return item
                },[])
                this.certs = newArr
                for(let i=0;i<this.certs.length;i++){
                    this.certificateCheck.push(false)
                }
                this.certs.forEach((i,k)=>{
                    this.Arr.push({
                        certName: i.certName,
                        certNo: i.certNo,
                        certStartDate: i.certStartDate,
                        certEndDate: i.certEndDate,
                        certOrg: i.certOrg,
                        certTypeId: i.certTypeId,
                        createTime:i.createTime,
                        creator: i.creator,
                        hotalId: i.hotalId,
                        workerId: i.workerId,
                        id: i.id
                    })
                })
                if(this.certs.length==0){
                    this.otherCertificateCheck = [true]
                    this.appObject.push({
                        theUnknown: '未知',
                        id: '',
                        certName: '',
                        certNo: '',
                        certStartDate: '',
                        certEndDate: '',
                        certOrg: '',
                        attachList: []})
                }
            })
        },
        initCertType() {
            this.$axios({
                method: 'get',
                url: this.$urls.certType,
            }).then(res=>{
                this.certTypeList = res.data.content
            })
        },
        confirm() {
            let arr = []
            this.appObject.forEach((i,k)=>{  
               arr.push({
                    attachList: i.attachList,
                    certTypeId : i.id,
                    certName : i.certName,
                    certNo : i.certNo,
                    certStartDate : new Date(i.certStartDate).getTime(),
                    certEndDate : new Date(i.certEndDate).getTime(),
                    certOrg : i.certOrg,
                    index: i.index
                }) 
            })
            arr.map(i=>{
                i.attachList=i.attachList.map(j=>{
                    if(j.index!=i.index){
                        return {id: 0}
                    }else if(j.index==i.index){
                        return j
                    }
                })
            })
            let arr1 = arr.concat(this.Arr)
            this.$axios({
                method: 'post',
                url: this.$urls.udpMessage,
                data: {
                    worker: {
                        name: this.userName,
                        gender: this.radio,
                        birthday: this.ruleForm.CreateDateNoChange,
                        height: this.ruleForm.height,
                        phone: this.ruleForm.region + this.ruleForm.phone,
                        qq: this.ruleForm.qq,
                        wechat: this.ruleForm.wechart,
                        certType: this.certType,
                        category: this.category,
                        bankName: this.ruleForm.bankName,
                        subBankName: this.ruleForm.subBankName,
                        bankNo: this.ruleForm.BankId,
                        id: this.id
                    },
                    workerCertManagerVoList: !arr1[0].certName?[]:arr1
                }
                }).then(res=>{
                    if(res.data.message == '成功'){
                        this.cancel()
                        this.$message({
                            message: "编辑成功",
                            type: 'success',
                            duration: 5 * 1000
                        })
                    }else{
                        this.$message({
                            message: "编辑失败",
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
        },
        black(item) {
            if(item == true){
               this.$parent.borther()
            }
        },
        qualificationCertificate() {
            if(this.appObject.length+this.certs.length<=4){
                this.index++
                this.appObject.push({
                    theUnknown: '未知',
                    index: this.index,
                    id: null,
                    certName: '',
                    certNo: '',
                    certStartDate: '',
                    certEndDate: '',
                    certOrg: '',
                    attachList: []})
            }else if(this.appObject.length+this.certs.length>4){
                this.certificateCheck[0] = true
                this.$message({
                        message: "添加证件信息已达上限",
                        type: 'info',
                        duration: 5 * 1000,			
                    })
                return
            }
            console.log(this.index)
            this.otherCertificateCheck = [true]
            for(let i=0;i<this.appObject.length;i++){
                this.otherCertificateCheck.push(false)
            }
            if(this.otherCertificateCheck.length>0){
                this.certificateCheck = this.certificateCheck.map((i,k)=>{
                    return false
                })
            }      
        },
        deleteCert(k) {
            if(this.appObject.splice(k,1)){
                if(k>0&&k<this.appObject.length){
                    this.otherCertificateCheck[k] = true
                    this.otherCertificateCheck[k-1] = false
                }else if(k==0||k==this.appObject.length){
                    this.otherCertificateCheck[k-1] = true
                    this.otherCertificateCheck[k+1] = false
                }
            }
            if(this.appObject.length==0){
                this.certificateCheck[0] = true
            }
        },
        itemTitle(k) {
            this.code++
            this.certificateCheck=this.certificateCheck.map((i,key)=>{
                if(key == k){
                    return true
                }
            })
            this.otherCertificateCheck=this.otherCertificateCheck.map((i,key)=>{
                return false
            })
        },
        handleOtherCert(index) {
            this.otherCertificateCheck=this.otherCertificateCheck.map((i,key)=>{
                if(key == index){
                    return true
                }
            })
            this.certificateCheck = this.certificateCheck.map((i,k)=>{
                return false 
            })
        },
        deleteOriginallyCert(index) {
            let obj = this.certs.splice(index,1)
            if(obj){
                if(index>0&&index<this.certs.length){
                    this.certificateCheck[index] = true
                    this.certificateCheck[index-1] = false
                }else if(index==0||index==this.certs.length){
                    this.certificateCheck[index-1] = true
                    this.certificateCheck[index+1] = false
                }
            }
            this.$axios({
                method: 'delete',
                url: this.$urls.delFiles,
                params: {
                    workerCertId: obj[0].id,
                    workerId: obj[0].workerId
                }
            }).then(res=>{
                console.log(res)
            })
        }
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
    width:750px;
    // height: 1500px;
    overflow-y: scroll;
    .fixed{
        width: 710px;
    }
	.minH{
        position: relative;
        min-height: calc(100% - 141px);
        .blackname{
            position: absolute;
            top: 273px;
            left: 630px;
            img{
                width: 100px;
                height: 100px;
            }
        }
    }    
	.title{
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #666666;
        margin-top: 15px;
        margin-left: 20px;
        font-weight: bold;
    }
    .wrapContent{
        width: 710px;
        background-color: #f4f8fc;
        border-radius: 2px;
        padding-bottom: 24px;
        margin-top: 15px;
        margin-left: 20px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        .headPhoto{
            position: absolute;
            top: 58px;
            left: 536px;
            img{
                width: 150px;
                height: 150px;
                border-radius: 100%;
            }
        }
        .personalNameOne{
            display: flex;
            width: 520px;
            margin-top: 11px;
            span{
                margin-left: 45px;
            }
        }
        .dateBirth{
            display: flex;
            margin-top: 14px;
            margin-left: 26px;
            width: 520px;
            .personalPosition{
                position: relative;
                width: 200px;
			i{
				position: absolute;
				right: -70px;
				top:10px;
				color: #c0c4cc;
				transition: all .2s;
			}
			.focus1{
				transform: rotate(180deg);
			  }
            }
            .age{
                margin-left: 145px;
                width: 230px;
                span{
                    margin-left: 30px;
                }
            }
        }
        .MobileCode{
            margin-top: 21.5px;
            .MobileCodeTwo{
                position: relative;
                img{ 
                    width: 11px;
                    height: 11px;
                    position: absolute;
                    top: 12px;
                    left: 147px;
                    transition: all .2s;
                 }
                 .focus1{
                     transform: rotate(180deg);
                 }
            }
        }
        .HeightCode{
            margin-top: -19px;
            .personalHeight{
                position: relative;
                .heightcm{
                    position: absolute;
                    top: 0;
                    left: 15px;
                    color: #444950;
                }
            }
            
        }
        .NumberCode{
            display: flex;
            margin-top: -19px;
            .NumberCodeOne{
                margin-left: 60px;
            }
        }
        .CertificateCode{
            display: flex;
            margin-top: 14px;
            span{
                margin-left: 18px;
                font-size: 14px;
                color: #444950;
            }
            .CertificateCodeOne{
                margin-left: 64px;
                img{
                    width: 14px;
                    height: 12px;
                    margin-left: 8px;
                    cursor: pointer;
                }
            }
        }
        .TypeCode{
            
            display: flex;
            margin-top: 5px;
            span{
                margin-left: 47px;
                font-size: 14px;
                color: #444950;
            }
            .TypeCodeOne{
                margin-left: 64px;
            }
        }
        .nameTwo{
            margin-top: -26px;
            width: 500px;
            display: flex;
            .item1{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 24px;
            
            span{
                margin-left: 10px;
            }
            .detail{
                font-size: 12px;
                color: #999999;
            }
          } 
          .item2{
            width: 246px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 130px;
          }
        }
        .state{
            width: 120px;
            position: absolute;
            bottom: 40px;
            right: 0;
        }
          
        .item3{
            width: 230px;
            font-size: 14px;
            color: #444950;
            margin-top: 60px;
            margin-left: 24px;
            span{
                margin-left: 10px;
            }
            .detail{
                font-size: 12px;
                color: #999999;
            }
        }
        .item6{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 0px;
            margin-left: 48px;
            span{
                margin-left: 10px;
            }
            .detail{
                font-size: 12px;
                color: #999999;
            }
        }
        .mbt0{
            margin-bottom: 24px;
        } 
        .item3{
            width: 156px;
        }
        .item4{
            float: left;
            margin-top: 24px;
            margin-left: 20px;
            font-size: 14px;
            color: #444950;
            span{
                margin-left: 10px;
            }
        }
        .item5 {
            float: left;
            margin: 64px 0px 24px -498px;
            font-size: 14px;
            color: #444950;
            span{
                margin-left: 10px;
            }
        }
        .width100{
            width: 100%;
        }
    }
    .wrapContentone{
        display: flex;
        justify-content: space-around;
        width: 710px;
        height: 68px;
        margin: 15px auto;
        line-height: 68px;
        background: #f4f8fc;
        .item1{
            font-size: 14px;
            margin-left: -30px;
            span{
                margin-left: 10px;
            }
        }
        .item2,.item3{
            font-size: 14px;
            span{
                margin-left: 10px;
            }
        }
    }
    .wrapContenttwo{
        width: 710px;
        height: 132px;
        margin: 15px auto;
        // overflow: hidden;
        background-color: #f4f8fc;
        .item1{
            float: left;
            width: 100%;
            display: flex;
            justify-content: space-around;
            font-size: 14px;
            margin-top: 24px;
            margin-left: -79px;
            span{
                margin-left: 10px;
            }
        }
        .item2{
            float: left;
            font-size: 14px;
            margin-left: 24px;
            margin-top: 24px;
            span{
                margin-left: 10px;
            }
        }
        .banktype{
            display: flex;
            margin-left: 26px;
            .banktypeOne{
                margin-top: 24px;
            }
            .banktypeTwo{
                margin-top: 24px;
                margin-left: 142px;
            }
        }
        .banktypeThe{
            margin-left: 26px;
            margin-top: 15px;
        }
    }
    .certificateWrap{
        width: 710px;
        height: 365px;
        background-color: #f4f8fc;
        border-radius: 2px;
        margin-top: 15px;
        margin-left: 20px;
        box-sizing: border-box;
        .certificate{
            width: 710px;
            height: 40px;
            font-size: 14px;
            line-height: 40px;
            background-color: #eaf3fe;
            .originallyCert{
                display: inline-block;
                width: 100px;
                text-align: center;
                margin-left: 30px;
                cursor: pointer;
            }
            .originallyCert:nth-child(1){
                margin-left: 45px;
            }
            .select{
                color: #4c8aff;
                border-bottom: 2px solid #4c8aff;
            }
            .otherCertInformation{
                display: inline;
                margin-left: 20px;
                div{
                    display: inline-block;
                    width: 100px;
                    text-align: center;
                    margin-left: 25px;
                    cursor: pointer;
                }
                div:nth-child(1){
                    margin-left: 10px;
                }
            }
        }
        .allCertificate{
            position: relative;
            .existingcert{
                padding: 0 30px;
                overflow: hidden;
                position: relative;
                .left{
                    position: relative;
                    width: 50%;
                    float: left;
                    font-size: 14px;
                    color: #444950;
                    .img{
                        position: absolute;
                        top: 0;
                        left: -30px;
                        width: 45px;
                        height: 45px;
                        font-size: 12px;
                        color: #fff;
                        cursor: pointer;
                        overflow: hidden;
                        background: url('../../../assets/img/deleteBtn.svg') no-repeat;
                        span{
                            float: left;
                            display: inline-block;
                            width: 45px;
                            height: 45px;
                            transform: rotate(-45deg);
                            margin-left: 9px;
                            margin-top: -4px;
                        }
                    }
                    .certType{
                        display: flex;
                        margin-top: 23px;
                        .certTypeTwo{
                            margin-left: 130px;
                        }
                    }
                    .periodValidity{
                        position: relative;
                        display: flex;
                        width: 500px;
                        margin-top: 20px;
                        .positionOne{
                            i{
                                position: absolute;
                                right: 10px;
                                top:10px;
                                color: #c0c4cc;
                                transition: all .2s;
                            }
                            .focus1{
                                transform: rotate(180deg);
                            }
                        }
                        .dashLine{
                            position: absolute;
                            top: 14px;
                            left: 268px;
                            width: 23px;
                            height: 2px;
                            border-bottom: 1px dashed #d4d4d4;
                            background: none;
                        }
                        .positionTwo{
                            margin-left: -258px;
                            margin-top:72.5px;
                            i{
                            position: absolute;
                            right: 10px;
                            top:-61px;
                            color: #c0c4cc;
                            transition: all .2s;
                        }
                        .focus1{
                            transform: rotate(180deg);
                            }
                        } 
                    }
                    .organ{
                        display: flex;
                        width: 710px;
                        margin-top: -54px;
                        .certPhoto{
                            display: flex;
                            flex-wrap: wrap;
                            .picphoto{
                                float: left;
                                margin-left: 10px;
                                margin-top: 3px;
                                img{ width: 160px;
                                height: 100px;}
                            }
                            .picphoto:nth-of-type(1){
                                margin-left: 43px;
                            }
                            .organTwo{
                                float: left;
                                margin-top: 3px;
                                margin-left: 10px;
                            }
                        }
                    } 
                }
            }
            .certificateContent{
            padding: 0 30px;
            overflow: hidden;
            position: relative;
            .img{
                position: absolute;
                top: 0;
                left: 0;
                width: 45px;
                height: 45px;
                font-size: 12px;
                color: #fff;
                cursor: pointer;
                overflow: hidden;
                background: url('../../../assets/img/deleteBtn.svg') no-repeat;
                span{
                    float: left;
                    display: inline-block;
                    width: 45px;
                    height: 45px;
                    transform: rotate(-45deg);
                    margin-left: 9px;
                    margin-top: -4px;
                }
            }
            .left{
                width: 50%;
                float: left;
                font-size: 14px;
                color: #444950;
                .certType{
                    display: flex;
                    margin-top: 23px;
                    .certTypeTwo{
                        margin-left: 130px;
                    }
                }
                .periodValidity{
                    position: relative;
                    margin-top: 20px;
                    .positionOne{
                        position: relative;
                    i{
                        position: absolute;
                        right: 76px;
                        top:10px;
                        color: #c0c4cc;
                        transition: all .2s;
                    }
                    .focus1{
                        transform: rotate(180deg);
                      }
                    }
                    .dashLine{
                            position: absolute;
                            top: 14px;
                            left: 268px;
                            width: 23px;
                            height: 2px;
                            border-bottom: 1px dashed #d4d4d4;
                            background: none;
                        }
                    .positionTwo{
                        i{
                        position: absolute;
                        right: -146px;
                        top:-61px;
                        color: #c0c4cc;
                        transition: all .2s;
                    }
                    .focus1{
                        transform: rotate(180deg);
                      }
                    }
                }
                .organ{
                    display: flex;
                    width: 710px;
                    margin-top: -54px;
                    .organTwo{
                        float: left;
                        // height: 210px;
                        margin-top: 3px;
                        margin-left: 42px;
                    }
                }
            } 
        }
        .addmore{
                // position: absolute;
                // top: 256px;
                // left: 24px;
                width: 662px;
                height: 45px;
                margin-left: 26px;
                margin-top: 20px;
                background: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px dashed #4c8aff;
                cursor: pointer;
                &:hover {
                    background: #eaf3fe;
                }
                .addicons{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    background: url("../../../assets/img/logo.png") no-repeat;
                    background-position: 44.3% 46.5%;
                    
                }
                span{
                    margin-left: 5px;
                    font-size: 12px;
                    color: #4c8aff;
                }
            }
    }
}
    .subBtn{
        display: flex;
        justify-content: center;
        // width: 750px;
		height:57px;
		border-top:1px solid #ececec;
        margin-top:15px;
        // background: #ccc;
        div:nth-child(1){
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #ffffff;
            margin: 15px 0;
            background-color: #4c8aff;
		}
		div:nth-child(2){
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #4c8aff;
            margin: 15px 60px;
		}
	}
.cross{
    display: inline-block;
    width: 40px;
    height: 4px;
    margin: 45px auto;
    border-radius: 2.1px;
    background: #ececec;
}
}

</style>