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
                        <img src="../../../assets/img/head@3x.svg" alt="" class="headPhoto" v-if="!avatar">
                        <img :src= avatar alt="" class="headPhoto" v-else>
                        <div class="nameOne">
                            <div class="item1">姓名：<span>{{userName}}</span></div>
                            <div class="item2">性别：<span>{{gender | meal}}</span></div>
                            <div class="item3">年龄：<span>{{age}}岁</span></div>
                        </div>
                        <div class="certType">
                            <div class="item1">证件类型：<span>{{certType | chang}}</span></div>
                            <div class="item2" v-if="certShow">证件号：<span>{{workerId | certNoChange}}</span><img :src="picture_data.src" alt="" @click="switchCert"></div>
                            <div class="item2" v-else>证件号：<span>{{workerId}}</span><img :src="picture_data.src" alt="" @click="switchCert"></div>
                        </div>
                    </div>
                    <div>
                        <div class="title">今日工作</div>
                        <div class="wrapContenttwo">
                            <div class="item1"><span>用工计划：</span>
                            <span>{{department}}, &nbsp;{{postName}}, &nbsp;{{$base.timeplateTohm(startTime)}} - 
                                <span v-if="parseInt(endTime/(24*3600000))>0">次日</span>{{$base.timeplateTohm(endTime%(24*3600000))}}, &nbsp;{{agencyName}}</span>
                                <span style="font-size:12px;color:#999999;margin-left:10px;">详情</span></div>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="title"></div>
                        <div class="certificateWrap">
                            <div class="certificate">
                                <div :class="{'select':certificateCheck}" @click="certificateCheck=true">奖励</div>
                                <div :class="{'select':!certificateCheck}" @click="certificateCheck=!certificateCheck">惩罚</div>
                            </div>
                            <div v-if="certificateCheck">
                                <div class="certificateContent">
                                    <div class="left">
                                        <el-form :model="ruleForm" ref="ruleForm" label-width="80px" size="medium" style="width:232px;margin: 50px auto;">
                                            <div class="rewardProgram inputHeight30">
                                                <el-form-item label="奖励项目：">
                                                    <el-select v-model="value" placeholder="请选择" style="width:180px;">
                                                        <el-option :label= item.name :value= item.id v-for="(item,key) in projectList" :key="key"></el-option>
                                                    </el-select>
                                                </el-form-item>	
                                                <el-form-item label="奖励金额：" style="margin-left:142px;">
                                                    <el-input v-model="ruleForm.amount" placeholder="请输入">
                                                        <span slot="suffix" style="color:#444950;">元</span>
                                                    </el-input>
                                                </el-form-item>	
                                            </div>
                                        </el-form>
                                    </div>
                                    <div class="rewadDate">
                                        <div class="pictrue">
                                            <div class="item">图片：</div>
                                            <div class="pictrueTwo">
                                                <el-upload
                                                    :action= "dialogVisibleUrl"
                                                    list-type="picture-card"
                                                    :limit= 2
                                                    :file-list="imgArr"
                                                    :on-success="imgFileSuccess"
                                                    :on-error="imgError"
                                                    :headers="uploadHeader"
                                                    :on-exceed="handleExceedImg"
                                                    :before-upload="beforeAvatarUpload1"
                                                    :on-preview="handlePictureCardPreview"
                                                    :on-remove="handleRemove">
                                                    <!-- <i class="el-icon-plus"></i> -->
                                                    <span class="cross"></span>
                                                    <span class="vertical"></span>
                                                </el-upload>
                                                <div class="limit"><span>最多上传两张，最大不超过8M</span></div>
                                                <el-dialog :visible.sync="dialogVisible">
                                                    <img width="100%" :src="dialogImageUrl" alt="">
                                                </el-dialog>
                                            </div>
                                        </div>
                                        <div class="exactDate">奖励日期：<span v-if="checkDate">{{$base.formattingTime(checkDate)}}</span></div>
                                    </div>   
                                    <div class="txtWrap">
                                        <div class="label">奖励原因：</div>
                                        <textarea placeholder="请输入" v-model="obj.txt" maxlength="1000" @input="writeResion" :class="{'bordercolor':borderColor}"></textarea>
                                        <div class="txtNum">{{obj.txt.length}}/1000</div>
                                    </div>
                                    <span class="showWord" v-if="borderColor"><img src="../../../assets/img/prompt1.svg" alt="">字数不可超过1000字</span>
                                </div>
                            </div>
                            <div v-if="!certificateCheck">
                                <div class="certificateContent">
                                    <div class="left">
                                        <el-form :model="ruleForm" ref="ruleForm" label-width="80px" size="medium" style="width:232px;margin: 50px auto;">
                                            <div class="rewardProgram1 inputHeight30">
                                                <el-form-item label="惩罚项目：">
                                                    <el-select v-model="value1" placeholder="请选择" style="width:180px;">
                                                        <el-option :label= item.name :value= item.id v-for="(item,key) in punishmentProject" :key="key"></el-option>
                                                    </el-select>
                                                </el-form-item>	
                                                <el-form-item label="惩罚金额：" style="margin-left:142px;">
                                                    <el-input v-model="ruleForm.amountOne" placeholder="请输入">
                                                        <span slot="suffix" style="color:#444950;">元</span>
                                                    </el-input>
                                                </el-form-item>	
                                            </div>
                                        </el-form>
                                    </div>
                                    <div class="rewadDate1">
                                        <div class="pictrue">
                                            <div class="item">图片：</div>
                                            <div class="pictrueTwo">
                                                <el-upload
                                                    :action= "dialogVisibleUrl"
                                                    list-type="picture-card"
                                                    :limit= 2
                                                    :file-list="imgArr1"
                                                    :on-success="imgFileSuccess1"
                                                    :on-error="imgError"
                                                    :headers="uploadHeader"
                                                    :on-exceed="handleExceedImg"
                                                    :on-preview="handlePictureCardPreview"
                                                    :before-upload="beforeAvatarUpload1"
                                                    :on-remove="handleRemove1">
                                                    <!-- <i class="el-icon-plus"></i> -->
                                                    <span class="cross"></span>
                                                    <span class="vertical"></span>
                                                </el-upload>
                                                <div class="limit"><span>最多上传两张，最大不超过8M</span></div>
                                                <el-dialog :visible.sync="dialogVisible">
                                                    <img width="100%" :src="dialogImageUrl" alt="">
                                                </el-dialog>
                                            </div>
                                        </div>
                                        <div class="exactDate">惩罚日期：<span v-if="checkDate">{{$base.formattingTime(checkDate)}}</span></div>
                                    </div>  
                                    <div class="txtWrap1">
                                        <div class="label">惩罚原因：</div>
                                        <textarea placeholder="请输入" v-model="obj1.txt" maxlength="1000" @input="writeResion" :class="{'bordercolor':borderColor1}"></textarea>
                                        <div class="txtNum">{{obj1.txt.length}}/1000</div>
                                    </div>
                                    <span class="showWord" v-if="borderColor1"><img src="../../../assets/img/prompt1.svg" alt="">字数不可超过1000字</span>      
                                </div>
                            </div>
                            <div class="disciplinaryrecords" @click="moveOne" v-if="rapList.length!=0">                         
                                <span>奖惩记录</span>
                                <div class="iconArrow" :class="{'twirl': move}"></div>
                            </div>
                            <div v-if="rewardsAndPunishmentsShow">
                                <div class="disciplinaryrecord1" v-for="(value,index) in punishmentList" :key="index">
                                    <div class="rewardstime"><div>{{$base.formattingTime(value.workerPerformance.createTime)}}</div><div>{{$base.formattingHover(value.workerPerformance.createTime)}}</div></div>
                                    <div class="punishment">惩罚</div>
                                    <div class="Themanager"><span>{{value.performanceCategory.name}}</span><span>惩罚{{value.workerPerformance.amount|minusSign}}元</span><div>{{value.workerPerformance.remark}}</div></div>
                                    <div class="processline" v-if="newList.length>0"></div>
                                    <img :src= photoUrl+i.filepath+i.filedate v-for="(i,k) in value.attaches" :key="k" alt="">
                                </div>
                                <div>
                                    <div class="disciplinaryrecord2" v-for="(i,k) in computedNewList" :key="k">
                                        <div class="rewardstime"><div>{{$base.formattingTime(i.workerPerformance.createTime)}}</div><div>{{$base.formattingHover(i.workerPerformance.createTime)}}</div></div>
                                        <div class="punishment">奖励</div>
                                        <div class="Themanager"><span>{{i.performanceCategory.name}}</span><span>奖励{{i.workerPerformance.amount|minusSign}}元</span><div>{{i.workerPerformance.remark}}</div></div>
                                        <!-- <div class="processline" v-if="showLine[k]"></div> -->
                                        <img :src= photoUrl+j.filepath+j.filedate v-for="(j,m) in i.attaches" :key="m" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="subBtn">
                    <div @click="submite" class="confirm">确定</div>
                    <div @click="cancel" class="Shutdown">取消</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
import _ from 'lodash'
export default {
    name: 'rewardsAndPunishmentsPage',
    mixins: [mixin],
    props:['role'],
	data () {
		return {
            ruleForm:{
                amount: '',
                amountOne: ''
            },
            obj:{
                txt: ''
            },
            obj1:{
                txt: ''
            },
            picture_data: {
                src: require("../../../assets/img/closeeye.svg")
            },
            photoUrl: 'https://company-test.lanniao.com/upload/',
            dialogVisibleUrl: this.$baseApi + this.$urls.singlefile,
            value: '',
            value1: '',
            imgArr: [],
            imgArr1: [],
            projectList: [],
            punishmentProject:[],
            rapList: [],
            show: false, 
            certificateCheck: true,
            _timeOut: '',
            userName: '',
            gender: '',
            age: '',
            avatar: '',
            certType: '',
            workerId: '',
            certName: '',
            department: '',
            postName: '',
            startTime: '',
            endTime: '',
            reward: 'reward',
            agencyName: '',
            workerCertNo: '',
            dialogVisible: false,
            dialogImageUrl: '',
            move: true,
            fixed: false,           
            certShow: true,
            borderColor: false,
            borderColor1: false,
            categoryId: '',
            category: '',
            rewardList: [],
            punishmentList: [],
            showLine: [],
            newList: [],
            photoId: '',
            checkDate: "",
            photoList: [],
            rewardsAndPunishmentsShow: true,
		}
	},
	mounted () {
        this.show = true
        this.init()
        this.initPlan()
        this.initPlan1()
        this.initrewardPunishmentsPage()
    },
    computed:{
        computedPunishmentList() {
            return this.punishmentList.filter((i,k)=>this.punishmentList.length!=0)
        },
        computedNewList() {
            return this.newList.filter((i,k)=>this.newList.length!=0)
        }
    },
    filters:{
        keepDecimal(val){
			if(val){
				return val.toFixed(1)
			}else{
				return ''
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
                return val = -val/100
            }else{
                return val = val/100
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
        certNoChange(cert) {
            if(cert){
                return '**************' + cert.substring(14,18)
            }else{
                return ''
            }
        }
    },
	methods: {
        imgFileSuccess(file,fileList) {
            this.imgArr.push({id:file.content.id,url:fileList.url})
        },
        imgFileSuccess1(file,fileList) {
            this.imgArr1.push({id:file.content.id,url:fileList.url})
        },
        imgError(err, file, fileList){
			console.log(err)
		},
        handleExceedImg(files, fileList) {
            this.$message({
				message: "最多上传两张照片",
				type: 'error',
				duration: 5 * 1000,			
			})
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
			this.imgDialog = true;
        },
        handleRemove(file, fileList) {
            this.imgArr.forEach((i,k)=>{
				if(i.id==file.id){
					this.imgArr.splice(k,1)
				}
			})
        },
        handleRemove1(file, fileList) {
            this.imgArr1.forEach((i,k)=>{
				if(i.id==file.id){
					this.imgArr1.splice(k,1)
				}
			})
        },
        beforeAvatarUpload1(file){
			const isLt2M = file.size / 1024 / 1024 < 8
			if (!isLt2M) {
				this.$message({
					message: "上传图片大小不能超过 8MB!",
					type: 'error',
					duration: 5 * 1000
				})
			}
			return isLt2M;
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('rewardsAndPunishmentsPage')
			}, 200)
        },
        init() { 
            this.obj.txt = ''
            this.$axios({
                method: 'post',
                url: this.$urls.message,
                data: {
                    performanceId: this.$store.state.recruitmentPlan.id.performanceId,
                    workerId: this.$store.state.recruitmentPlan.id.workerId,
                    agencyId: this.$store.state.recruitmentPlan.id.agencyId,
                    orderDetailId: this.$store.state.recruitmentPlan.id.orderDetailId,
                    orderId: this.$store.state.recruitmentPlan.id.orderId,
                    signId: this.$store.state.recruitmentPlan.id.id
                }
            })
            .then(res => {         
                this.userName = _.get(res,'data.worker.name','')
                this.gender = _.get(res,'data.worker.gender','')
                this.age = this.$base.age(_.get(res,'data.worker.birthday',''))
                this.avatar = _.get(res,'data.worker.avatar','')
                this.certType = _.get(res,'data.worker.certType','')
                this.workerId = _.get(res,'data.worker.certNo','')
                this.department = _.get(res,'data.todayVo.departmentName','')
                this.postName = _.get(res,'data.todayVo.postName','')
                this.agencyName = _.get(res,'data.agency.name','')
                this.startTime = _.get(res,'data.todayVo.startDate','0')
                this.endTime = _.get(res,'data.todayVo.endDate','0')
                this.workerCertNo = _.get(res,'data.sign.workerCertNo','')
                this.categoryId = _.get(res,'data.workerPerformance.categoryId','')
                this.checkDate = _.get(res,'data.sign.signInTime','0')
            }).catch(err=>{

            })
        },
        initPlan() {
            this.$axios({
                method: 'get',
                url: this.$urls.getCategory,
                params: { category: 'reward' }
            }).then(res=>{
                this.projectList = res.data.content
                this.category = res.data.content[0].category
            })
        },
        initrewardPunishmentsPage() {
            this.$axios({
                method: 'get',
                url: this.$urls.getRecord + this.$store.state.recruitmentPlan.id.workerId
            }).then(res=>{
                this.rapList = res.data.content
                this.photoList = res.data.content[0].attaches
                for(let i=0;i<this.rapList.length;i++){
                    this.showLine.push(true)
                }
                this.rapList.map((i) => {
                    if(i.performanceCategory.category=='punishment'){
                        this.punishmentList.push(i)
                    }else if(i.performanceCategory.category=='reward'){
                        this.newList.push(i)
                    }
                    
                });
            })
        },
        initPlan1() {
            this.$axios({
                method: 'get',
                url: this.$urls.getCategory,
                params: { category: 'punishment' }
            }).then(res=>{
                this.punishmentProject = res.data.content
                this.category = res.data.content[0].category
            })
        },
        submite() {
            let arr=[],obj={},obj1={}
            if(this.value){
                obj.agencyId = this.$store.state.recruitmentPlan.id.agencyId,
                obj.orderDetailId = this.$store.state.recruitmentPlan.id.orderDetailId,
                obj.orderId = this.$store.state.recruitmentPlan.id.orderId,
                obj.workerCertNo = this.workerCertNo,
                obj.workerId = this.$store.state.recruitmentPlan.id.workerId,
                obj.workerName = this.$store.state.recruitmentPlan.id.workerName,
                obj.signInTime = this.$store.state.recruitmentPlan.id.signInTime,
                obj.signId = this.$store.state.recruitmentPlan.id.id,
                obj.amount = parseInt(this.ruleForm.amount)*100,
                obj.categoryId = this.value
                obj.remark = this.obj.txt
                obj.attaches = this.imgArr.map(i=>{
                    return i.id
                })
                arr.push(obj)
            }
            if(this.value1){
                obj1.agencyId = this.$store.state.recruitmentPlan.id.agencyId,
                obj1.orderDetailId = this.$store.state.recruitmentPlan.id.orderDetailId,
                obj1.orderId = this.$store.state.recruitmentPlan.id.orderId,
                obj1.workerCertNo = this.workerCertNo,
                obj1.workerId = this.$store.state.recruitmentPlan.id.workerId,
                obj1.workerName = this.$store.state.recruitmentPlan.id.workerName,
                obj1.signInTime = this.$store.state.recruitmentPlan.id.signInTime,
                obj1.signId = this.$store.state.recruitmentPlan.id.id,
                obj1.amount = parseInt(this.ruleForm.amountOne)*100,
                obj1.categoryId = this.value1
                obj1.remark = this.obj1.txt
                obj1.attaches = this.imgArr1.map(i=>{
                    return i.id
                })
                arr.push(obj1)
            }
            if(!this.value&&!this.value1){
                this.$message({
                    message: '奖惩项目为必填项',
                    type: 'error',
                    duration: 5 *1000
                })
                return
            }
            if(!this.ruleForm.amount&&!this.ruleForm.amountOne){
                this.$message({
                    message: '奖惩金额为必填项',
                    type: 'error',
                    duration: 5 *1000
                })
                return
            }
            if(!this.obj.txt&&!this.obj1.txt){
                this.$message({
                    message: '奖惩原因为必填项',
                    type: 'error',
                    duration: 5 *1000
                })
                return
            }
            this.$axios({
                method: 'post',
                url: this.$urls.addperformance,
                data: arr
            }).then(res=>{
                if(res.data.status == 200){
                    this.role()
                    this.$message({
                        message: "奖惩成功",
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
            this.cancel()
        },
        moveOne() {
            this.move = !this.move
            this.showLine[this.showLine.length-1] = false
            this.rewardsAndPunishmentsShow = !this.rewardsAndPunishmentsShow
        },
        switchCert() {
            this.certShow = !this.certShow
            this.picture_data.src=this.picture_data.src==require("../../../assets/img/closeeye.svg")?require("../../../assets/img/openeye.svg"):require("../../../assets/img/closeeye.svg")
        },
        writeResion() {
            if(this.obj.txt.length==1000){
                this.borderColor = true
            }else if(this.obj.txt.length==0||this.obj.txt.length<1000){
                this.borderColor = false
            }
            if(this.obj1.txt.length==1000){
                this.borderColor1 = true
            }else if(this.obj1.txt.length==0||this.obj1.txt.length<1000){
                this.borderColor1 = false
            }
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
    height: 810px;
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
        // margin-bottom: 24px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        .headPhoto{
            position: absolute;
            top: 11px;
            left: 569px;
            width: 90px;
            height: 90px;
            border-radius: 100%;
        }
        .nameOne{
            // width: 500px;
            display: flex;
            .item1{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 24px;
            span{
                margin-left: 38px;
            }
          } 
          .item2{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left:0px;
            span{
                margin-left: 25px;
            }
          }
          .item3{
            width: 230px;
            float: left;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: -40px;
          }
        }
        .certType{
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
          } 
          .item2{
            display: flex;
            font-size: 14px;
            color: #444950;
            margin-top: 24px;
            margin-left: 0px;            
            span{
                margin-left: 12px;
            }
            img{
              width: 14px;
              height: 12px;
              margin-top: 3px;
              margin-left: 10px;
              cursor: pointer;
           }
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
    .wrapContenttwo{
        width: 710px;
        height: 68px;
        margin: 15px auto;
        // overflow: hidden;
        background-color: #f4f8fc;
        .item1{
            float: left;
            width: 100%;
            font-size: 14px;
            margin-top: 24px;
            margin-left: 29px;
            color: #444950;
            span:nth-child(2){
                margin-left: 10px;
            }
        }
    }
    .footer{
        .title{
            width: 710px;
            border-top: 1px dashed #d4d4d4;
            margin-top: 20px;
        }
        .certificateWrap{
        width: 710px;
        padding-bottom: 22px;
        background-color: #f4f8fc;
        border-radius: 2px;
        margin-left: 20px;
        box-sizing: border-box;
        .disciplinaryrecords{
             margin-top: 5px;
             margin-left: 630px;
             cursor: pointer;
             .iconArrow{
                 width: 8px;
                 height: 6px;
                 display: inline-block;
                 margin-left: 3px;
                 background: url('../../../assets/img/logo.png') no-repeat -203px -104px;
             }
             span{
                 font-size: 14px;
                 color: #4c8aff;
             }
         }
        .certificate{
            display: flex;
            justify-content: space-around;
            width: 710px;
            height: 40px;
            font-size: 18px;
            line-height: 40px;
            color: #444950;
            background-color: #eaf3fe;
            div{
                display: inline-block;
                width: 80px;
                text-align: center;
                margin-left: 60px;
                cursor: pointer;
            }
            .select{
                color: #4c8aff;
                border-bottom: 2px solid #4c8aff;
            }
        }
        .certificateContent{
            position: relative;
            padding: 5px 30px;
            
            .txtWrap{
                position: relative;
                margin-top: 48px;
                width: 665px;
                overflow:hidden;
                .label{
                    display: inline-block;
                    float:left;
                    height: 20px;
                    line-height:20px;
                    font-size: 14px;
                    color: #444950;
                }
                textarea{
                    width:582px;
                    height:100px;
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
                .bordercolor{
                    border: solid 1px #e45a3c;
                }
                .txtNum{
                    position:absolute;
                    top: 80px;
                    right:13px;
                    font-size: 14px;
                    color: #999999;
                    bottom:5px;
                    z-index: 1000;
                }
            }
            .showWord{
                    position:absolute;
                    top: 293px;
                    left:110px;
                    color: #e45a3c;
                    z-index: 1000;
                    img{
                        float: left;
                        width: 12px;
                        height: 12px;
                        margin-top: 2.5px;
                        margin-right: 5px;
                    }
                }
            .txtWrap1{
                position: relative;
                margin-top: 48px;
                width: 665px;
                overflow:hidden;
                .label{
                    float:left;
                    height: 20px;
                    line-height:20px;
                    font-size: 14px;
                    color: #444950;
                }
                textarea{
                    width:582px;
                    height:100px;
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
                .bordercolor{
                    border: solid 1px #e45a3c;
                }
                .txtNum{
                    position:absolute;
                    top: 80px;
                    right:13px;
                    font-size: 14px;
                    color: #999999;
                    bottom:5px;
                    z-index: 1000;
                }
            }
            
            .left{
                margin-left: -51px;
                margin-top: -6px;
                display: flex;
                width: 50%;
                font-size: 14px;
                color: #444950;
                .rewardProgram{
                    display: flex;
                    margin-top: -24px;
              }
              .rewardProgram1{
                    display: flex;
                    margin-top: -24px;
              }
            }
            .rewadDate,.rewadDate1{
                margin-top: -7px;
                display: flex;
                .pictrue{
                    display: flex;
                    width: 50%;
                    margin-top: -20px;
                    margin-left: -5px;
                    font-size: 14px;
                    color: #444950;
                    .item{
                        width: 130px;
                        height: 20px;
                    }
                    .pictrueTwo{
                        position: relative;
                        float: left;
                        width: 750px;
                        // height: 210px;
                        margin-left: 40px;
                        .limit{
                            position: absolute;
                            top: 65px;
                            left: 0px;
                            width: 165px;
                            span{
                                font-size: 12px;
                                color: #999999;
                            } 
                        }
                    }
                }
                .exactDate{
                    margin-left: 77px;
                    margin-top: -20px;
                    font-size: 14px;
                    color: #444950;
                    span{
                        margin-left: 12px;
                    }
                }
            }
         }
         .disciplinaryrecord1{
             position: relative;
             display: flex;
             margin-bottom: 10px;
             .rewardstime{
                 margin-left: 110px;
                 font-size: 14px;
                 color: #444950;
                 div:nth-child(2){
                     float: right;
                     margin-top: 3px;
                 }
             }
             .punishment{
                 width: 36px;
                 height: 36px;
                 margin-left: 20px;
                 background: #e45a3c;
                 border-radius: 100%;
                 text-align: center;
                 line-height: 36px;
                 color: #ffffff;
                 font-size: 12px;
             }
             .Themanager{
                 position: absolute;
                 top: -3px;
                 left: 235px;
                 span{
                     margin-left: 20px;
                     font-size: 14px;
                     color: #444950;
                 }
                 div{
                     margin-left: 20px;
                     font-size: 12px;
                     color: #666666;
                 }
             }
             .processline{
                 width: 1px;
                 height: 120px;
                 margin-left: -20px;
                 margin-top: 47px;
                 border: .5px dashed #ccc;
                 background: #fff;
           }
           img{
               float: left;
               width: 60px;
               height: 60px;
               margin: 40px 38px;
           }
           img:nth-of-type(2){
               margin: 40px -30px;
           }
         }
         .disciplinaryrecord2{
             position: relative;
             display: flex;
             padding-top: 10px;
             .rewardstime{
                 margin-left: 110px;
                 font-size: 14px;
                 color: #444950;
                 div:nth-child(2){
                     float: right;
                     margin-top: 3px;
                 }
             }
             .punishment{
                 width: 36px;
                 height: 36px;
                 margin-left: 20px;
                 background: #4c8aff;
                 border-radius: 100%;
                 text-align: center;
                 line-height: 36px;
                 color: #ffffff;
                 font-size: 12px;
             }
             .Themanager{
                 position: absolute;
                 top: 6px;
                 left: 235px;
                 span{
                     margin-left: 20px;
                     font-size: 14px;
                     color: #444950;
                 }
                 div{
                     margin-left: 20px;
                     font-size: 12px;
                     color: #666666;
                 }
             }
             .processline{
                 width: 1px;
                 height: 120px;
                 margin-left: -20px;
                 margin-top: 47px;
                 border: .5px dashed #ccc;
                 background: #fff;
             }
             img{
               float: left;
               width: 60px;
               height: 60px;
               margin: 40px 20px;
           }
           img:nth-of-type(2){
               margin: 40px -10px;
           }
         }
      }
    }
    .subBtn{
        display: flex;
        justify-content: center;
        align-items: center;
		height:57px;
		border-top:1px solid #ececec;
        margin-top:15px;
        .confirm{
            width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #ffffff;
            background: #4c8aff;
        }
        .Shutdown{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
            cursor:pointer;
            color: #4c8aff;
            margin-left: 60px;
		}
	}
.cross{
    display: inline-block;
    width: 20px;
    height: 2px;
    margin: 30px auto;
    border-radius: 2.1px;
    background: #ececec;
}
}
.twirl{
    transform: rotate(180deg);
    transition: all .3s;
}	
</style>