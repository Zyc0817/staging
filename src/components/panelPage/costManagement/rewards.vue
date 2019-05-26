<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">奖惩</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
                <div class="minH rewards">
                    <div class="title mt15">基本信息</div>
                    <div class="infoWrap mt15">
                        <div class="mb24">
                            <div class="item width122">
                                <div class="left width70">姓名：</div>
                                <div class="right">{{name}}</div>
                            </div>
                            <div class="item ml107">
                                <div class="left width56">性别：</div>
                                <div class="right">{{gender}}</div>
                            </div>
                            <div class="item ml121">
                                <div class="left">年龄：</div>
                                <div class="right">{{birthday}}岁</div>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="item width178">
                            <div class="left">证件类型：</div>
                            <div class="right">{{certType}}</div>
                        </div>
                        <div class="item ml51">
                            <div class="left">证件号：</div>
                            <div class="right">{{cardId}}</div>
                            <img :src= pictrue_data class="eye" @click="idCardShow=!idCardShow" alt="">
                        </div> 
                        <div class="headWrap">
                            <img v-if="!avatar" src="../../../assets/img/head@3x.svg" class="head" alt="">
                            <img v-else :src="avatar" alt="" class="head">
                        </div>
                        
                    </div> 
                    <div class="title mt15">今日工作</div>
                    <div class="infoWrap mt15">
                        <div class="item">
                            <div class="left">用工计划：</div>
                            <div class="right">{{departmentName}}，{{postName}}，{{startDate}} - {{endDate}}，{{agencyName}}</div>
                            <div class="label1">详情</div>
                        </div>
                    </div>
                    <div class="line"></div>
                    <div class="checkTab">
                        <div class="left" @click="checkTab=true" :class="{'select':checkTab}">奖励</div>
                        <div class="right" @click="checkTab=false" :class="{'select':!checkTab}">惩罚</div>
                    </div>
                    <div v-if="checkTab" class="infoWrap">
                        <div class="mb24 overflow">
                            <div class="item label inputHeight30">
                                <span style="color:rgb(228, 90, 60)" class="floatL">*</span>
                                <div class="floatL">
                                    <div v-if="checkTab" class="floatL">奖励</div>
                                    项目：
                                </div>
                                <div class="floatL ml10 width180">
                                    <el-select v-model="form.categoryId" placeholder="请选择">
                                        <el-option :label="i.name" v-for="(i,k) in dataList" :key="k" :value="i.id"></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="item label inputHeight30 ml142">
                                <span style="color:rgb(228, 90, 60)" class="floatL">*</span>
                                <div class="floatL">
                                    <div v-if="checkTab" class="floatL">奖励</div>
                                    金额：
                                </div>
                                <div class="floatL ml10 width180">
                                    <el-input placeholder="请输入" type="number" v-model="form.amount"></el-input>
									<div class="template">元</div>
                                </div>
                            </div>
                        </div>
                        <div class="mb24 upload">
                            <span style="color:rgb(228, 90, 60);opacity:0" class="floatL">*</span>
                            <div class="left">上传凭证：</div>
                            <div class="right">
                                <el-upload
                                    :action="imgAction"
                                    list-type="picture-card"
                                    :on-preview="handlePictureCardPreview"
                                    :on-success="imgFileSuccess"
                                    :limit="4"
                                    :file-list="imgArr"
                                    :headers="uploadHeader"
                                    :on-exceed="handleExceedImg"
                                    :on-remove="handleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog 
                                    :visible.sync="imgDialog"
                                    :lock-scroll="false"
                                    :modal-append-to-body="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                                <div class="right1">最多上传4张，最大不超过8M</div>
                            </div>
                            
                            <div class="rewardTime">奖励日期：<span>{{rewardTime}}</span></div>
                        </div>
                        <div class="reasonWrap">
                            <div class="left"><span style="color:rgb(228, 90, 60);line-height:24px;" class="floatL">*</span>调整原因：</div>
                            <div class="right">
                                <textarea placeholder="请输入" v-model="txt"></textarea>
                                <div class="num">{{txt.length}}/1000</div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="infoWrap">
                        <div class="mb24 overflow">
                            <div class="item label inputHeight30">
                                <div class="floatL">
                                    <span style="color:rgb(228, 90, 60)" class="floatL">*</span>
                                    <div v-if="!checkTab" class="floatL">惩罚</div>
                                    项目：
                                </div>
                                <div class="floatL ml10 width180">
                                    <el-select v-model="form.categoryId1" placeholder="请选择">
                                        <el-option :label="i.name" v-for="(i,k) in dataList1" :key="k" :value="i.id"></el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="item label inputHeight30 ml142">
                                <div class="floatL">
                                    <span style="color:rgb(228, 90, 60)" class="floatL">*</span>
                                    <div v-if="!checkTab" class="floatL">惩罚</div>
                                    金额：
                                </div>
                                <div class="floatL ml10 width180">
                                    <el-input placeholder="请输入" type="number" v-model="form.amount1"></el-input>
									<div class="template">元</div>
                                </div>
                            </div>
                        </div>
                        <div class="mb24 upload">
                            <span style="color:rgb(228, 90, 60);opacity:0" class="floatL">*</span>
                            <div class="left">上传凭证：</div>
                            <div class="right">
                                <el-upload
                                    :action="imgAction"
                                    list-type="picture-card"
                                    :on-preview="handlePictureCardPreview"
                                    :on-success="imgFileSuccess"
                                    :headers="uploadHeader"
                                    :limit="4"
                                    :file-list="imgArr1"
                                    :on-exceed="handleExceedImg"
                                    :on-remove="handleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog 
                                    :visible.sync="imgDialog"
                                    :lock-scroll="false"
                                    :modal-append-to-body="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                                <div class="right1">最多上传4张，最大不超过8M</div>
                            </div>
                            
                            <div class="rewardTime">惩罚日期：<span>{{rewardTime}}</span></div>
                        </div>
                        <div class="reasonWrap">
                            <div class="left"><span style="color:rgb(228, 90, 60);line-height:24px;" class="floatL">*</span>调整原因：</div>
                            <div class="right">
                                <textarea placeholder="请输入" v-model="txt1"></textarea>
                                <div class="num">{{txt.length}}/1000</div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
				<div class="btnWrap">
                    <div class="sure" @click="submit">确定</div>
                    <div class="close" @click="cancel">取消</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
import _ from 'lodash'
export default {
	name: 'rewards',
    mixins: [mixin],
    props: ['orderInit'],
	data () {
		return {
			show: false, 
            _timeOut: '',
            checkTab: true,
            dataList: [],
            dataList1: [],
            form: {},
            dialogImageUrl: '',
            imgAction: this.$baseApi + this.$urls.certUpload,
            imgDialog: false,
            imgArr: [],
            imgArr1: [],
            txt: '',
            txt1: '',
            name: '',
            gender: '',
            birthday: '',
            certType: '',
            certNo: '',
            departmentName: '',
            postName: '',
            agencyName: '',
            idCardShow: false,
            startDate: '',
            endDate: '',
            agencyId: '',
            orderDetailId: '',
            orderId: '',
            rewardTime: '',
            pictrue_data: require('../../../assets/img/closeeye.svg'),
            avatar: '',
		}
    },
    created() {
        this.init()
        this.getCategoryList()
    },
	mounted () {
		this.show = true
    },
    computed:{
        cardId() {
			if(!this.idCardShow){
                this.pictrue_data = require('../../../assets/img/closeeye.svg')
				return `**************${this.certNo.substring(this.certNo.length-4,this.certNo.length)}`
			}else{
                this.pictrue_data = require('../../../assets/img/openeye.svg')
				return this.certNo
			}
		},
    },
	methods: {
        submit() {
            let arr = [],
                obj = {},
                obj1 = {},
                data = this.$store.state.costManagement.panelType.data
            if(this.form.categoryId){
                
                obj.agencyId = this.agencyId
                obj.orderDetailId = this.orderDetailId
                obj.orderId = this.orderId
                obj.workerCertNo = this.$store.state.costManagement.panelType.data.workerCertNo
                obj.workerId = this.$store.state.costManagement.panelType.data.workerId
                obj.workerName = this.$store.state.costManagement.panelType.data.workerName
                obj.signInTime = this.$store.state.costManagement.panelType.data.signInTime
                obj.amount = this.form.amount*100
                obj.signId = data.signId
                obj.categoryId = this.form.categoryId
                obj.remark = this.txt
                obj.attaches = this.imgArr.map(i=>{
                    return i.id
                })
                arr.push(obj)
            }
            
            if(this.form.categoryId1){
                
                obj1.agencyId = this.agencyId
                obj1.orderDetailId = this.orderDetailId
                obj1.orderId = this.orderId
                obj1.workerCertNo = this.$store.state.costManagement.panelType.data.workerCertNo
                obj1.workerId = this.$store.state.costManagement.panelType.data.workerId
                obj1.workerName = this.$store.state.costManagement.panelType.data.workerName
                obj.signInTime = this.$store.state.costManagement.panelType.data.signInTime
                obj1.amount = 0-parseInt(this.form.amount1)*100
                obj.signId = data.signId
                obj1.categoryId = this.form.categoryId1
                obj1.remark = this.txt1
                obj1.attaches = this.imgArr1.map(i=>{
                    return i.id
                })
                arr.push(obj1)
            }
            if(!arr.length){
                this.cancel()
                return 
            }
            this.$axios({
                method: 'post',
                url:this.$urls.addperformance,
                data:arr
            })
            .then(res=>{      
                if(res.data.status==200) {
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000,			
                    })
                    this.orderInit()
                    this.cancel()
                }else{
                    this.$message({
                        message: res.data.message||"操作失败",
                        type: 'error',
                        duration: 5 * 1000,			
                    })
                }
            })
            .catch(e=>{
                
            })
            
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
                if(this.$store.state.costManagement.panelType.panelType=='out'){
                    this.$store.dispatch('costRewards1')
                }else{
                    this.$store.dispatch('costRewards')
                }	
			}, 200)
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
			this.imgDialog = true;
        },
        imgFileSuccess(file,fileList) {
            if(this.checkTab) {
                this.imgArr.push({id:file.content.id,url:fileList.url})
            }else{
                this.imgArr1.push({id:file.content.id,url:fileList.url})
            }
        },
        handleExceedImg(files, fileList) {
			this.$message({
				message: "最多上传四张照片",
				type: 'error',
				duration: 5 * 1000,			
			})
        },
        handleRemove(file, fileList) {
			this.imgArr.forEach((i,k)=>{
				if(i==file.response.content.id){
                    if(this.checkTab){
                        this.imgArr.splice(k,1)
                    }else{
                        this.imgArr1.splice(k,1)
                    }
				}
			})
        },
        init() {
            let data = this.$store.state.costManagement.panelType.data
            console.log(data)
            this.$axios({
                method: 'post',
                url:this.$urls.message,
                data:{
                    agencyId:data.agencyId,
                    orderDetailId:data.orderDetailId,
                    orderId:data.orderId,
                    performanceId:'',
                    signId:data.signId,
                    workerId:data.workerId
                }
            })
            .then(res=>{  
                
                this.name = _.get(res,'data.worker.name','')
                this.avatar = res.data.worker.avatar
                this.birthday = this.$base.age(res.data.worker.birthday)
                this.certNo = res.data.worker.certNo
                this.departmentName = res.data.todayVo.departmentName
                this.postName = res.data.todayVo.postName
                this.agencyName = res.data.agency.name
                this.agencyId = data.agencyId
                this.orderDetailId = data.orderDetailId
                this.orderId = data.orderId
                this.startDate = this.$base.timeplateTohm(res.data.todayVo.startDate)
                this.endDate = this.$base.timeplateTohm(res.data.todayVo.endDate)
                if(res.data.worker.gender=='male'){
                    this.gender = '男'
                }else{
                    this.gender = '女'
                }
                if(res.data.worker.certType == 'id-card'){
                    this.certType = '中国居民身份证'
                }else if(res.data.worker.certType == 'passport') {
                    this.certType = '护照'
                }else if(res.data.worker.certType == 'home-card') {
                    this.certType = '回乡证'
                }else if(res.data.worker.certType == 'tw-card') {
                    this.certType = '台胞证'
                } 
            })
            .catch(e=>{
                
            })
            this.rewardTime = this.$base.formattingTime(data.workerDate)
        },
        getCategoryList() {
            this.$axios({
                method: 'get',
                url:this.$urls.getCategory,
                params:{
                    category:'reward'
                }
            })
            .then(res=>{      
                if(res.data.status==200) {
                    this.dataList = res.data.content
                }
            })
            .catch(e=>{
                
            })
            this.$axios({
                method: 'get',
                url:this.$urls.getCategory,
                params:{
                    category:'punishment'
                }
            })
            .then(res=>{      
                if(res.data.status==200) {
                    this.dataList1 = res.data.content
                }
            })
            .catch(e=>{
                
            })
        },

		
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.width70{
    width: 70px;
}
.width56{
    width: 56px;
}
.panel{
    width:750px;
    overflow-y: scroll;
    .fixed{
        width: 710px;
    }
    .btnWrap{
        height: 57px;
        padding: 15px 265px;
        box-sizing: border-box;
        border-top: 1px solid #ececec;
        div{
            cursor: pointer;
        }
        .sure{
            width: 80px;
            border-radius: 14.5px;
            background-color: #4c8aff;
            padding: 5.5px 0;
            text-align: center;
            color: #ffffff;
            font-size: 12px;
            float: left;
        }
        .close{
            width: 78px;
            border-radius: 14.5px;
            border: 1px solid #4c8aff;
            padding: 4.5px 0;
            text-align: center;
            color: #4c8aff;
            font-size: 12px;
            float: left;
            margin-left: 60px;
        }
    }
	.minH{
        padding: 0 20px;
        min-height: calc(100% - 125px);
        .title{
            font-size: 14px;
            color: #666666;
            font-weight: bold;
        }
        .line{
            margin: 24px 0;
            width: 710px;
            border-top: dashed 2px #d4d4d4;
        }
        .checkTab{
            height: 45px;
            background-color: #eaf3fe;
            text-align: center;
            cursor: pointer;
            .left{
                float: left;
                width: 80px;
                height: 45px;
                line-height: 45px;
                box-sizing: border-box;
                font-size: 18px;
                color: #444950;
                margin-left: 138px;
            }
            .right{
                float: left;
                width: 80px;
                height: 45px;
                line-height: 45px;
                box-sizing: border-box;
                font-size: 18px;
                color: #444950;
                margin-left: 275px;
            }
            .select{
                color: #4c8aff;
                border-bottom: 2px solid #4c8aff;
            }
        } 
        .infoWrap{
            padding: 24px;
            background-color: #f4f8fc;
            border-radius: 2px;
            overflow: hidden;
            position: relative;
            .reasonWrap{
                overflow: hidden;
                .left{
                    float: left;
                    margin-top: 4px;
                    font-size: 14px;
                    color: #444950;
                    width: 80px;
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
                        font-size: 14px;
                    }
                    textarea{
                        width: 578px;
                        height: 100px;
                        background-color: #ffffff;
                        border-radius: 1px;
                        border: solid 1px #ececec;
                        outline: none;
                        resize: none;
                        padding: 5px 10px;
                        box-sizing: border-box;
                        font-size: 14px;
                        margin-left: 2px;
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
            .upload{
                overflow: hidden;
                .left{
                    float: left;
                    font-size: 14px;
                    width: 80px;
                    color: #444950;
                }
                .right{
                    float: left;
                    height: 82px;
                }
                .right1{
                    float: left;
                    font-size: 12px;
                    margin-top: 5px;
                    color: #999999;
                }
                .rewardTime{
                    float: right;
                    color: #444950;
                    font-size: 14px;
                    margin-right: 113px;
                    margin-top: 1px;
                    span{ margin-left: 12px; }
                }
            }
            .headWrap{
                position: absolute;
                width: 90px;
                height: 90px;
                border-radius: 50%;
                overflow: hidden;
                top: 11px;
                right: 24px;
                .head{
                    width: 100%;    
                }
            }
            .label{
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                color: #444950;

            }
            .label1{
                height: 30px;
                line-height: 30px;
                font-size: 12px;
                color: #999999;
                margin-left: 10px;
            }
            .item{
                float: left;
                overflow: hidden;
                .left,.right{
                    float: left;
                    font-size: 14px;
                    color: #444950;
                    height: 20px;
                    line-height: 20px;
                }
                .right{
                    margin-left: 10px;
                }
                .eye{
                    float: left;
                    margin:4px 0 0 10px;
                }
                .label{
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                    color: #444950;
                }
                .label1{
                    float: left;
                    font-size: 12px;
                    color: #999999;
                    height: 20px;
                    line-height: 20px;
                }
                img{ cursor: pointer; }
            }
        }
    }
    .mt15{
        margin-top: 15px;
    }
    .ml135{
        margin-left: 135px;
    }
    .ml107{
        margin-left: 107px;
    }
    .ml121{
        margin-left: 121px;
    }
    .mb24{
        margin-bottom: 24px;
    }
    .ml142{
        margin-left: 126px;
    }
    .ml51{
        margin-left: 49px;
    }
    .width122{
        width: 122px;
    }
    .width178{
        width: 180px;
    }
    .clear{
        clear: both;
    }
    .floatL{
        float: left;
    }
    .ml10{
        margin-left: 10px;
    }
    .overflow{
        overflow: hidden;
    }
    .width180{
        width: 180px;
        position: relative;
        .template{
            position: absolute;
            right: 10px;
            top: 2px;
            font-size: 14px;
        }
    }
}
	
</style>