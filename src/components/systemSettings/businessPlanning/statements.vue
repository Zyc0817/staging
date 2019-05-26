<template>
    <div class="employmentConditions statements">
        <div class="wrap">
            <div class="item">
                <div class="title">调整考勤</div>
                <div class="line"></div>
                <div class="rulesWrap">
                    <div class="list pd0">
                        <div class="left">操作时限：</div>
                        <div class="right">
                            自开始核算之日起，超过&nbsp;&nbsp;<input v-model="dayLimit" type="number">天将不能操作核算/奖惩/调整考勤，请务必在规定时间内操作完成
                        </div>
                    </div>
                    <div class="list">
                        <div class="left">调整时长：</div>
                        <div class="right">
                            在核算过程中，调整时长不能超过&nbsp;&nbsp;<input v-model="adjustDuration" type="number">个小时
                        </div>
                    </div>
                    <div class="list1 pd1">
                        <div class="left">调整费用：</div>
                        <div class="right switch">
                            <el-switch
                                :width="52"
                                v-model="form.adjustSalary"
                                active-value="enable"
                                inactive-value="disable"
                                active-color="#4c8aff"         
                                >
                            </el-switch>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item">
                <div class="title">打印设置</div>
                <div class="line"></div>
                <div class="rulesWrap">
                    <div class="list pd0">
                        <div class="left">企业Logo：</div>
                        <div class="right">
                            <el-upload
								:action="action"
								list-type="picture-card"
								:on-preview="handlePictureCardPreview"
								:on-success="imgFileSuccess"
								:limit="1"
								:before-upload="beforeAvatarUpload1"
								:headers="uploadHeader"
								:on-exceed="handleExceedImg"
								:file-list="fileList2"
								:on-remove="handleRemove">
								<i class="el-icon-plus"></i>
							</el-upload>
							<el-dialog 
								:visible.sync="imgDialog"
								:lock-scroll="false"
								:modal-append-to-body="false">
								<img width="100%" :src="dialogImageUrl" alt="">
							</el-dialog>
                        </div>
                        <div class="right1">支持PNG，JPG格式，建议尺寸宽120px，高60px</div>
                    </div>
                    <div class="list">
                        <div class="left height27">表头字段：</div>
                        <div class="right rightwidth">
                            <div class="tagWrap" v-for="(item,key) in tag" :key="key">
                                <div class="tag">{{item.fieldName}}</div>
                                <div class="delete" @click.stop="delTag(key)">×</div>
                            </div>
                            <div class="addBtn" @click='dialogVisibleShow'>
                                <div class="icon"></div>
                            </div>
                        </div>
                        <div class="clear"></div>
                    </div>                

                    <div class="list1 pd2">
                        <div class="txt">打印《结算单》时，默认同时打印对应的劳务合同：</div>
                        <div class="right switch">
                            <el-switch
                                :width="52"
                                v-model="form.printWithContract"
                                active-value="Y"
                                inactive-value="N"
                                active-color="#4c8aff"         
                                >
                            </el-switch>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>
        <div class="btn">
            <div class="sub" @click="submit">保存</div>
            <div class="cancel">取消</div>
        </div>
        <el-dialog
            title="表头字段"
            :visible.sync="dialogVisible"
            width="600px"
            top="30.3vh"
            :modal-append-to-body="false"
            height="420px">
            <div class="body">
                <div class="srcollWrap">
                    <div class="item" 
                    v-for="(i,k) in dataList1" 
                    @click="checkTag(k)"
                    :class="{'select':i.check}"
                    :key="k">{{i.fieldName}}</div>
                </div>
                <div class="dialogBtn">
                    <div class="sub" @click="sure">确定</div>
                    <div class="cancel" @click="dialogVisible=false">取消</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
    name: 'statements',
    mixins: [mixin],
    data() {
        return {
            switchBtn1: false,
            dayLimit:'',
            adjustDuration: '',
            form: {
                hotalId:this.$store.state.hotalId,
                adjustDuration: '',
                adjustSalary: '',
                dayLimit: '',
                printWithContract: '',
                hotalLogoId: '',
            },
            fileList2: [],
            imgDialog: false,
            dialogImageUrl: '',
            imgArr: [],
            action: this.$baseApi + this.$urls.singlefile,
            tag: [],
            dataList1: [],
            dialogVisible: false,
            arr: [],
        }
    },
    created() {
        this.init()
    },
    methods:{
        checkTag(k) {
            this.dataList1[k].check = !this.dataList1[k].check 
            this.dataList1 = [].concat(this.dataList1)
        },
        sure() {
            this.tag = this.dataList1.filter(i=>i.check)
            this.dialogVisible = false
        },
        delTag(k) {
            this.tag.splice(k,1)
            this.dataList1.forEach(i=>{
                i.check = false
                this.tag.forEach(j=>{
                    if(i.fieldName==j.fieldName){
                        i.check = true
                    }
                })
            })
            this.dataList1 = [].concat(this.dataList1)
        },
        dialogVisibleShow() {
            this.dataList1.forEach(i=>{
                i.check = false
                this.tag.forEach(j=>{
                    if(i.fieldName==j.fieldName){
                        i.check = true
                    }
                })
            })
            this.dataList1 = [].concat(this.dataList1)
            this.dialogVisible = true
        },
        handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.imgDialog = true;
		},
        imgFileSuccess(file,fileList,f) {
			if(file.status==200){
				this.imgArr.push(file.content.id)
			}else{
				f.splice(f.length-1,1)
				this.$message({
					message: file.message||"上传失败",
					type: 'error',
					duration: 5 * 1000
				})
			}
        },
        beforeAvatarUpload1(file){
			// const isLt2M = file.size / 1024 / 1024 < 8
			// if (!isLt2M) {
			// 	this.$message({
			// 		message: "上传图片大小不能超过 8MB!",
			// 		type: 'error',
			// 		duration: 5 * 1000
			// 	})
			// }
            // return isLt2M;
            return true
        },
        handleExceedImg(files, fileList) {
			this.$message({
				message: "最多上传一张照片",
				type: 'error',
				duration: 5 * 1000,			
			})
        },
        handleRemove(file, fileList) {
            this.imgArr.splice(0,1)
            this.form.hotalLogoId = ''
		},
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.getBillConstraint
            })
            .then(res=>{
                if(res.data.status==200){
                    this.form.adjustDuration = res.data.content.adjustDuration
                    this.form.adjustSalary = res.data.content.adjustSalary
                    this.form.dayLimit = res.data.content.dayLimit
                    this.form.printWithContract = res.data.content.printWithContract
                    if(res.data.content.dayLimit) {
                        this.dayLimit = res.data.content.dayLimit/(24*60*60*1000)
                    }
                    if(res.data.content.adjustDuration) {
                        this.adjustDuration = res.data.content.adjustDuration/(60*60*1000)
                    }
                    
                }
            })
            .catch(e=>{

            })	

            this.$axios({
                method: 'get',
                url: this.$urls.getBillField,
                params:{settingType: 'print'} 
            })
            .then(res=>{
                if(res.data.length) {
                    this.dataList1 = res.data
                    this.dataList1.forEach(i=>{
                        if(!i.userId){
                            i.check = true
                        }else{
                            i.check = false
                        }
                    })
                    this.tag = res.data.filter(i=>!i.userId)
                    this.dataList1 = [].concat(this.dataList1)
                }
            })  
            .catch(e=>{
                
            })
            this.$axios({
                method: 'post',
                url: this.$urls.getHotalLogo
            })
            .then(res=>{
                if(res.data.filename){
                    let url = this.$baseApi.split('/hotelApi')
                    this.fileList2 = []
                    this.imgArr = []
                    this.fileList2.push({
                        name: res.data.filename,
                        url:url[0]+'/upload/'+res.data.filepath+res.data.filedate
                    })
                    this.imgArr.push(res.data.id)
                }   
            })  
            .catch(e=>{
                
            })
        },
        tableHead() {
            let arr = [],
                arr1 = []
            arr = this.dataList1.filter(i=>!i.check)
            if(!arr.length){
                arr1.push({settingType: 'print'})
            }else{
                arr.forEach(i=>{
                    arr1.push({
                        billFieldId:i.id,
                        settingType: 'print'
                    })
                })
            }
            this.$axios({
                method: 'post',
                url: this.$urls.addBillUserField,
                data:arr1
            })
            .then(res=>{
                if(res.data.code==0) {
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                    this.init()
                }else{
                    this.$message({
                        message: res.data.msg||"操作失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            })  
            .catch(e=>{
                
            })
        },
        submit() {
            if((this.dayLimit&&!this.$base.isPositiveInteger(this.dayLimit))||(this.adjustDuration&&!this.$base.isPositiveInteger(this.adjustDuration))){
                this.$message({
                    message: "请输入正确时间",
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            if(this.imgArr[0]) {
                this.form.hotalLogoId = this.imgArr[0]
            }
            this.form.dayLimit = this.dayLimit*24*60*60*1000
            this.form.adjustDuration = this.adjustDuration*60*60*1000
            this.$axios({
                method: 'put',
                url:this.$urls.billConstraint,
                data:this.form
            })
            .then(res=>{
                if(res.data.status==200){
                    this.tableHead()
                }else{
                    this.$message({
                        message: res.data.message||"操作失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            })
            .catch(e=>{

            })	
        }
    }
}
</script>
<style lang="less" scoped>
.body{
    height: 349px;
    padding-top: 20px;
    .srcollWrap{
        width: 560px;
        height: 255px;
        margin: 0 auto;
        background-color: #f4f8fc;
        padding: 20px 20px 10px 20px;
        overflow-y: scroll;
        box-sizing: border-box;
        .item{
            float: left;
            width: 80px;
            height: 27px;
            background-color: #ffffff;
            border-radius: 1px;
            text-align: center;
            line-height: 27px;
            border: solid 1px #ececec;
            font-size: 12px;
            box-sizing: border-box;
            margin-right: 20px;
            color: #999999;
        }
        .select{
            border: solid 1px #4c8aff;
            color: #4c8aff;
        }
    }
    .srcollWrap::-webkit-scrollbar {
		display:none;
    }
    .dialogBtn{
        left: 190px;
    }
}
.rightwidth{
    width: calc(100% - 80px);
}
.statements{
     height: 100%;
     .item{
        background-color: #fff;
        margin-bottom: 10px;
        .title{
            height: 50px;
            line-height: 50px;
            text-indent: 24px;
            font-size: 14px;
            color: #666666;
            font-weight: bold;
            border-left: 4px solid #4d83ff;
            .switch{
                float: right;
                margin-right: 20px;
            }
        }
        .line{
            height: 1px;
            background-color: #ececee; 
        }
        .rulesWrap{
            padding: 24px;
            font-size: 14px;
            color: #444950;
            overflow: hidden;
            position: relative;
        }
     }
    .wrap{
        min-height: calc(100% - 79px);
        .list{
            padding-top: 24px;
            font-size: 14px;
            color: #444950;
            overflow: hidden;
        }
        .pd0{
            padding-top:0;
        }
        .list1{
            height: 30px;        
            font-size: 14px;
            color: #444950;
            padding-top: 24px;
            .txt{
                height: 30px;
                line-height: 23px;
                float: left;
                margin-right: 10px;
            }
        }
        .pd1{
            padding-top: 27px;
        }
        .pd2{
            padding-top: 15px
        }
        .left{
            width: 80px;
            float: left
        }
        .right{
            float: left;
            input{
                width: 60px;
                border: none;
                outline: none;
                border-bottom: 1px solid #d4d4d4;
                text-align: center;
                margin-right: 10px;
                font-size: 14px;
            }
        }
        .height27{
            height: 27px;
            line-height: 27px;
        }
        .right1{
            margin-top: 43px;
            font-size: 12px;
            color: #999999;
            margin-left: 10px;
            float: left;
        }
        .addBtn{
            width: 78px;
            height: 25px;
            background-color: #ffffff;
            border-radius: 1px;
            border: dashed 1px #4c8aff;
            float: left;
            margin-bottom: 10px;
            cursor: pointer;
            .icon{
                background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
                width: 14px;
                height: 14px;
                margin: 6px auto;
            }
        }
        .tagWrap{
            min-width: 58px;
            text-align: center;
            padding: 0 10px;
            height: 25px;
            line-height: 25px;
            border: 1px solid #4c8aff;
            color: #4c8aff;
            position: relative;
            float: left;
            border-radius: 1px;
            margin-right: 20px;
            margin-bottom: 10px;
            .delete{
                position: absolute;
                width: 14px;
                height: 14px;
                background-color: #4c8aff;
                color: #fff;
                top: -7px;
                right: -7px;
                text-align: center;
                line-height: 13px;
                border-radius: 50%;
                cursor: pointer;
            }

        }
    }
    .btn{
        width: 220px;
        margin: 0px auto;
        margin-top: 30px;
        margin-bottom: 20px;
        overflow: hidden;
        div{
            float:left;
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			background-color: #4c8aff;
			border-radius: 14.5px;
			color:#fff;
			text-align:center;
			font-size:12px;
			border:1px solid #4c8aff;
			cursor:pointer;
        }
        .cancel{
            float: right;
            background-color: #fff;
            color: #4c8aff;
            border: 1px solid #4c8aff;
        }
    }
}
</style>

