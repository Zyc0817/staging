<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt" v-if="!$store.state.systemSettings.states.id">添加合同</div>
                        <div class="txt" v-else>复制合同</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div style="height:50px;" v-if="fixed"></div>
                <div class="minH addJobs inputHeight30 addRecruiters addContract">
                    <el-form ref="form" :model="form" label-width="80px" size="medium">
                        <div class="title">合同概况</div>
                        <div class="informationWrap">
                            <div class="mb24">
                                <div class="item height30">
                                    <el-form-item label="合同名称：">
                                        <el-input placeholder="请输入" type="text" v-model="form.contract.contractName"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="item1 ml">
                                    <div class="date height30">
                                        <el-form-item label="合同期限：">
                                            <div class="position height30 width180">
                                                <el-date-picker 
                                                    type="date" 
                                                    placeholder="开始日期" 
                                                    v-model="form.contract.startTime" 
                                                    @focus="focus3=true" @blur="focus3=false" 
                                                    style="width: 100%;" 
                                                    value-format="timestamp">
                                                </el-date-picker>
                                                <i class="el-icon-arrow-down" :class="{'focus1':focus3}"></i>
                                            </div>
                                            <div class="floatL center"></div>		
                                            <div class="position height30 width180">
                                                <el-date-picker 
                                                    type="date" 
                                                    placeholder="结束日期" 
                                                    v-model="form.contract.endTime" 
                                                    style="width: 100%;" 
                                                    @focus="focus4=true" @blur="focus4=false" 
                                                    value-format="timestamp">
                                                </el-date-picker>
                                                <i class="el-icon-arrow-down" :class="{'focus1':focus4}"></i>
                                            </div>
                                        </el-form-item>
                                    </div>              
                                    <!-- <div class="date left40 height30">
                                        
                                    </div>         -->
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="file">
                                <div class="label floatL">附件：</div>
                                <div class="upload floatL">
                                    <el-upload
                                        class="upload-demo"
                                        :action="action"
                                        :on-success="(res,file)=>{return fileSuccess(res,file)}"
                                        :on-remove="(res,file)=>{return onRemove(res,file)}"	
                                        :on-error="fileError"
                                        :headers="uploadHeader"
                                        :before-upload="beforeAvatarUpload"
                                        :on-exceed="handleExceed"
                                        :file-list="fileList">
                                        <div class="fileWrap">
                                            <div class="fileIcon"></div>
                                            <div class="fileBtn">添加文件</div>
                                            <div class="fileDetail">仅支持png、jpeg、jpg、gif、pdf格式，最大不超过8M</div>		
                                        </div>
                                    </el-upload>
                                </div>
                            </div>
                        </div>
                        <div class="title">计费标准</div>
                        <div class="informationWrap">
                            <div class="mb24 height30">
                                <el-form-item label="计费模式：">
                                    <el-select v-model="form.contract.salaryRule" @change="pricingChange">
                                        <el-option v-for="(i,k) in pricingModel" :key="k" :label="i.name" :value="i.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="pricingItem" v-for="(i,k) in pricingList" :key="k">
                                <div class="dashed" v-if="k!=0"></div>
                                <div class="deleteBtn" v-if="k!=0" @click="deleteHoverBtn(k)">
                                    <div>删除</div>
                                </div>
                                <div v-if="!pricingCompare" class="list mb24">
                                    <div class="left">第{{k+1}}级：</div>
                                    <div class="right">
                                        <div class="floatL">
                                            <input type="number" placeholder="最少工时" v-model="i.minDuration">至&nbsp;&nbsp;<input placeholder="最多工时" type="number" v-model="i.maxDuration">工时
                                        </div>
                                    </div>
                                </div>
                                <div class="tableWrap1">
                                    <table border="1" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <th width="177">
                                                <div class="out"></div>
                                                <b>岗位</b>
                                                <em>费用</em>
                                            </th>
                                            <th width="177">白班</th>
                                            <th width="177">夜班</th>
                                            <th width="177">节假日白班</th>
                                            <th width="177">节假日夜班</th>
                                        </tr>
                                        <tr v-for="(item,key) in i.postFee" :key="key">
                                            <td class="post">
                                                <div class="deleteBtn" v-if="key!=0" @click="itemDel(k,key)">
                                                    <div>删除</div>
                                                </div>
                                                <div class="height30">
                                                    <el-select v-model="item.post">
                                                        <el-option v-for="(i,k) in post" :key="k" :label="i.title" :value="i.id"></el-option>
                                                    </el-select>
                                                </div>
                                            </td>
                                            <td>
                                                <input class="salaryInput" v-model="item.data1" type="text" placeholder="请输入">元/小时
                                            </td> 
                                            <td>
                                                <input class="salaryInput" v-model="item.data2" type="text" placeholder="请输入">元/小时
                                            </td>
                                            <td>
                                                <input class="salaryInput" v-model="item.data3" type="text" placeholder="请输入">元/小时
                                            </td>
                                            <td>
                                                <input class="salaryInput" v-model="item.data4" type="text" placeholder="请输入">元/小时
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="6" class="more" @click="add(k)">
                                                <div class="addicon"></div>
                                                <div class="txt">添加更多岗位费用</div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div class="addJobsBtn" v-if="!pricingCompare" @click="addContract">
                                <div class="addicon"></div>
                                <div class="txt">添加更多阶梯</div>
                            </div>
                        </div>
                        <div class="title">补贴</div>
                        <div class="informationWrap">
                            <div class="mb24 height30">
                                <el-form-item label="补贴类型：">
                                    <el-select @clear="subsidiesClear" clearable v-model="form.allowanceRule.category">
                                        <el-option v-for="(i,k) in category" :key="k" :label="i.name" :value="i.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="list">
                                <div class="left">补贴规则：</div>
                                <div class="right">
                                    <div class="floatL">当上班时间早于</div>
                                    <div class="rules floatL position">
                                        <el-time-picker
                                            placeholder="请选择" 
                                            v-model="beforeTime" 
                                            @focus="focus1=true" @blur="focus1=false"
                                            value-format="HH:mm" format="HH:mm"
                                            style="width: 100%;">
                                        </el-time-picker>
                                        <i class="el-icon-arrow-down" :class="{'focus1':focus1}"></i>
                                    </div>
                                    <div class="floatL">或下班时间晚于</div>
                                    <div class="rules floatL position">
                                        <el-time-picker
                                            placeholder="请选择" 
                                            v-model="afterTime" 
                                            @focus="focus2=true" @blur="focus2=false"
                                            value-format="HH:mm" format="HH:mm"
                                            style="width: 100%;">
                                        </el-time-picker>
                                        <i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
                                    </div>
                                    <div class="floatL">
                                        且工时大于等于&nbsp;&nbsp;<input type="text" v-model="duration">小时，补贴金额&nbsp;&nbsp;<input type="text" v-model="amount">元
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="btnWrap">
                    <div class="sub1" @click="submit">确定</div>
                    <div class="sub2" @click="cancel">取消</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
    name: 'addContract',
    mixins: [mixin],
    props:['getContracts','infoInit'],
	data () {
		return {
			show: false, 
            _timeOut: '',
            form: {
                contract:{
                    contractName: '',
                    agencyId: this.$store.state.systemSettings.states.agencyId,
                    allowanceState: 'enable',
                    endTime: '',
                    hotalId: this.$store.state.hotalId,
                    salaryRule: '',
                    startTime: '',
                    state: 'enable'
                },
                contractAttachVos:[],
                salaryRuleVos: [],
                allowanceRule: {
                    afterTime: '',
                    agencyId: this.$store.state.systemSettings.states.agencyId,
                    amount: '',
                    beforeTime: '',
                    category: '',
                    duration: '',
                    hotalId: this.$store.state.hotalId,
                    state: 'enable'
                }
            },
            afterTime: '',
            beforeTime: '',
            duration: '',
            amount: '',
            fileList: [],
            action: this.$baseApi + this.$urls.singlefile,
            post: [],
            pricingModel: [{name:'标准时薪制',value:'norm'},{name:'阶梯时薪制',value:'step'}],
            category: [{name:'车补',value:'traffic'}],
            pricingCompare: true,
            pricingList: [{
                maxDuration: '',
                minDuration: '',
                postFee:[{
                    data1: '',
                    data2: '',
                    post: '',
                    data3: '',
                    data4: '',
                }],
            }],
            focus1: false,
            focus2: false,
            focus3: false,
			focus4: false,
		}
    },
    created() {
        this.init()
    },
	mounted () {
		this.show = true
	},
	methods: {
        subsidiesClear() {
            this.afterTime = ''
            this.beforeTime = ''
            this.duration = ''
            this.amount = ''
        },
        submit() {
            if(!this.form.contract.contractName){
                this.$message({
                    message: "请输入合同名称",
                    type: 'error',
                    duration: 5 * 1000
                })
                return     
            }
            if(this.form.contract.startTime>this.form.contract.endTime){
                this.$message({
                    message: "请输入正确合同期限",
                    type: 'error',
                    duration: 5 * 1000
                })
                return     
            }
           
            if(this.form.allowanceRule.category&&(!this.afterTime||!this.beforeTime||!this.amount||!this.duration)) {
                this.$message({
                    message: "请完善补贴规则",
                    type: 'error',
                    duration: 5 * 1000
                })
                return     
            }
            for(let i = 0;i<this.pricingList.length;i++){
                for(let j = 0;j<this.pricingList[i].postFee.length;j++){
                    if(!this.pricingList[i].postFee[j].post){
                        this.$message({
                            message: "请完善计费标准",
                            type: 'error',
                            duration: 5 * 1000
                        })
                        return  
                    }
                }
            }
            this.form.allowanceRule.afterTime = this.$base.timeplateToss(this.afterTime)
            this.form.allowanceRule.beforeTime = this.$base.timeplateToss(this.beforeTime)
            this.form.allowanceRule.duration = this.duration*60*60*1000
            this.form.allowanceRule.amount = this.amount*100
            this.form.contractAttachVos = this.fileList.map(i=>{
                return {attachId:i.id}
            })
            this.form.salaryRuleVos = []
            this.pricingList.forEach((i,k)=>{
                i.postFee.forEach((item,key)=>{                    
                    let obj = {
                        postId: item.post,
                        postName: this.post.find(j=>j.id==item.post).title||'',
                        dayshift: item.data1*100,
                        nightshift: item.data2*100,
                        holidayDayshift: item.data3*100,
                        holidayNightshift: item.data4*100,
                        startTime:this.form.contract.startTime,
                        endTime:this.form.contract.endTime
                    }
                    if(this.form.contract.salaryRule=='step'){
                        obj.level = k+1
                        obj.maxDuration = i.maxDuration*60*60*1000
                        obj.minDuration = i.minDuration*60*60*1000
                    }
                    this.form.salaryRuleVos.push(obj)
                }) 
            })
            this.$axios({
                method: 'post',
                url:this.$urls.addContract,
                data:this.form
            })
            .then(res=>{      
                if(res.data.code==0){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                    // this.getContracts()
                    this.infoInit(this.$store.state.systemSettings.states.agencyId)
                    this.cancel()
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
        init() {
            this.$axios({
                method: 'post',
                url:this.$urls.getOutsidePostList,
                data:{
                    current:1,
                    size:9999
                }
            })
            .then(res=>{      
                this.post = res.data.records
            })
            .catch(e=>{
                
            })
            if(this.$store.state.systemSettings.states.id){
                this.$axios({
                    method: 'get',
                    url:this.$urls.getContract,
                    params:{
                        contractId:this.$store.state.systemSettings.states.id
                    }
                })
                .then(res=>{      
                    this.form.contract.contractName = res.data.contract.contractName
                    this.form.contract.endTime = res.data.contract.endTime
                    this.form.contract.startTime = res.data.contract.startTime
                    this.form.contract.salaryRule = res.data.contract.salaryRule
                    this.pricingChange(this.form.contract.salaryRule)    
                    if(res.data.allowanceRule) {
                        this.form.allowanceRule.category = res.data.allowanceRule.category
                        this.form.allowanceRule.afterTime = res.data.allowanceRule.afterTime
                        this.form.allowanceRule.beforeTime = res.data.allowanceRule.beforeTime
                        this.form.allowanceRule.duration = res.data.allowanceRule.duration
                        this.form.allowanceRule.amount = res.data.allowanceRule.amount
                        this.afterTime = this.$base.timeplateTohm(res.data.allowanceRule.afterTime)
                        this.beforeTime = this.$base.timeplateTohm(res.data.allowanceRule.beforeTime)
                        this.duration = parseInt(res.data.allowanceRule.duration/(1000*60*60))
                        this.amount = res.data.allowanceRule.amount/100
                    } 
                    if(res.data.contractAttachVos.length){
                        this.form.contractAttachVos = res.data.contractAttachVos
                        this.fileList = []
                        res.data.contractAttachVos.forEach(i=>{
                            this.fileList.push({name:i.filename,id:i.attachId})
                        })
                    }
                    let a = 0
                    res.data.salaryRuleVos.forEach(i=>{
                        if(i.level&&a<i.level){
                            a++
                        }else{
                            a=1
                        }
                    })     
                    this.pricingList = []
                    for(let i=0;i<a;i++){
                        this.addContract()        
                    }
                    this.pricingList.forEach((i,k)=>{
                        this.pricingList[k].postFee = [] 
                    })    
                    res.data.salaryRuleVos.forEach((item,key)=>{  
                        if(item.level){
                            if(res.data.contract.salaryRule=='step'&&(item.maxDuration||item.minDuration)){
                                this.pricingList[item.level-1].maxDuration = parseInt(item.maxDuration/(1000*60*60))
                                this.pricingList[item.level-1].minDuration = parseInt(item.minDuration/(1000*60*60))
                            }else{
                                this.pricingList[item.level-1].maxDuration = ''
                                this.pricingList[item.level-1].minDuration = ''
                            }
                            this.pricingList[item.level-1].postFee.push({
                                data1: item.dayshift/100,
                                data2: item.nightshift/100,
                                data3: item.holidayDayshift/100,
                                data4: item.holidayNightshift/100,
                                post: item.postId,
                            })
                        }else{   
                            this.pricingList[0].postFee.push({
                                data1: item.dayshift/100,
                                data2: item.nightshift/100,
                                data3: item.holidayDayshift/100,
                                data4: item.holidayNightshift/100,
                                post: item.postId,
                            })
                        }
                    })
                })
                .catch(e=>{
                    
                })
            }
        },
        itemDel(k,key) {
            this.pricingList[k].postFee.splice(key,1)
        },
        add(k) {
            this.pricingList[k].postFee.push({})
        },
        deleteHoverBtn(k) {
            this.pricingList.splice(k,1)
        },
        addContract() {
            this.pricingList.push({
                postFee:[{
                    data1: '',
                    data2: '',
                    post: '',
                    data3: '',
                    data4: '',
                }],
            })
        },
        pricingChange(data) {
            if (data=='norm') {
                this.pricingCompare = true
            } else {
                this.pricingCompare = false
            }
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('addContract')
			}, 200)
        },
        fileSuccess(response, file) {
			let obj = {}
			obj.name = file.name
			obj.id = response.id
			this.fileList.push(obj)
		},
		onRemove(file, fileList) {
            this.fileList.forEach((i,k)=>{
                if(i.id == file.id){
                    this.fileList.splice(k,1)
                }
            })
		},
        fileError(err, file, fileList) {
			this.$message({
				message: "上传失败",
				type: 'error',
				duration: 5 * 1000
			})
        },
        beforeAvatarUpload(file) {
			return true
			var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)				
			const extension = testmsg === 'word'
			const extension2 = testmsg === 'pdf'
			const isLt2M = file.size / 1024 / 1024 < 8
			if(!extension && !extension2) {
				this.$message({
					message: '上传文件只能是 word、pdf格式!',
					type: 'warning'
				});
			}
			if(!isLt2M) {
				this.$message({
					message: '上传文件大小不能超过 8MB!',
					type: 'warning'
				});
			}
			return extension || extension2 && isLt2M
        },
        handleExceed(files, fileList) {
			//文件超出钩子
		},
		
	},
	destroyed() {
		clearTimeout(this._timeOut)
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
    width:940px;
    overflow-y: scroll;
    .fixed{
        width: 900px;
    }
    .height30{
        height: 30px;
    }
    .mb24{
        margin-bottom: 24px;
    }
    .btnWrap{
        width: 220px;
        height: 57px;
        margin: 0 auto;
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
			margin-right: 60px;
			border:1px solid #4c8aff;
            cursor:pointer;
            margin-top: 15px;
        }
        .sub2{
            margin-right: 0;
            background-color: #fff;
            color: #4c8aff;     
        }
    }
	.minH{
        min-height: calc(100% - 156px);
        border-bottom: 1px solid #ececec;
        padding-bottom: 30px;
        .title{
            margin:15px 0 0 20px;
            font-size: 14px;
            color: #666666;
            font-weight: bold;
        }
        .informationWrap1{

        }
        .informationWrap{
            width: 900px;
            margin: 0 auto;
            padding: 24px 24px 20px 24px;
            margin-top: 15px;
            background-color: #f4f8fc;
            border-radius: 2px;
            box-sizing: border-box;    
            overflow: hidden;
            .dashed{
                border-top: 1px dashed #d4d4d4;
                margin: 24px 0 21px 0;
            }
            .pricingItem{
                position: relative;
            }
            .deleteBtn{
                background: url('../../../assets/img/deleteBtn.svg') no-repeat;
                background-size: 100% 100%;
				width: 45px;
				height: 45px;
				position:absolute;
				left:-24px;
				top:0px;
				color:#fff;
				font-size: 12px;
				cursor:pointer;
				div{
					width: 29px;
					height: 29px;
					line-height:29px;
					text-align:center;
					transform:rotate(-45deg);
				}
				
			}
            .addJobsBtn{
                width: 850px;
                height: 43px;
                background-color: #ffffff;
                border: dashed 1px #4c8aff;
                margin:0 auto;
                margin-top:24px;
                cursor:pointer;
                .addicon{
                    background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
                    width: 14px;
                    height: 14px;
                    float:left;
                    margin:13.5px 0 0 379px;
                }
                .txt{
                    width: 120px;
                    float:left;
                    font-size: 12px;
                    color: #4c8aff;
                    margin:13px 0 0 10px;
                }
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
            .addJobsBtn:hover{
                background-color: #eaf3fe;
			    transition: all .2s;
            }
            .item{
                width: 260px;
                float: left;
            }
            .item1{
                width: 480px;
                float: left;
                .date{
                    width: 100%;
                    float: left;
                    .width180{
                        float: left;
                        width: 180px;
                    }
                    .center{
                        float: left;
                        margin:14.5px 10px;
                        width: 20px;
                        border-top: 1px dashed #d4d4d4;
                    }
                }
                .left40{
                    width: 220px;
                }
            }
            .clear{
                clear: both;
            }
            .mb24{
                margin-bottom: 24px;
            }
            .list{
                font-size: 14px;
                color: #444950;
                overflow: hidden;
                .left{
                    width: 80px;
                    float: left;
                    height: 30px;
                    line-height: 30px;
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
                        background-color: #f4f8fc;
                        font-size: 12px;
                    }
                    input::-webkit-input-placeholder{
                        color:#999999;;
                    }
                    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
                        color:#999999;
                    }
                    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                        color:#999999;
                    }
                    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                        color:#999999;
                    }
                    .rules{
                        width: 80px;
                        height: 30px;
                        display: inline-block;
                        margin: 0 10px;
                    }
                    .floatL{
                        float: left;
                        height: 30px;
                        line-height: 30px;
                    }
                }
            }
            .ml{
                margin-left: 112px;
            }
            .file{
                overflow: hidden;
                .floatL{
                    float: left;              
                }
                .label{
                    width: 80px;
                    height: 20px;
                    font-size: 14px;
                    line-height: 20px;
                }
                .fileWrap{
                    overflow: hidden;
                    div{
                        float:left;
                        line-height: 20px;
                    }
                    .fileIcon{
                        background: url('../../../assets/img/logo.png') no-repeat -327px -100px;
                        width: 16px;
                        height: 15px;
                        margin-top:1.5px;
                    }
                    .fileBtn{
                        font-size: 14px;
                        color: #666666;
                        margin-left:5px;
                    }
                    .fileDetail{
                        font-size: 12px;
                        color: #999;
                        margin-left:10px;
                    }

                }
            }
            .tableWrap1{
                width: 852px;
                background-color: #ffffff;
                table{
                    width: 100%;
                    height: 100%;
                    th{
                        font-size: 14px;
                        color: #444950;
                        font-weight: normal;
                        position: relative;
                        .out{
                            content: "";
                            position: absolute;
                            width: 1.5px;
                            height:176px;/*这里需要自己调整，根据td的宽度和高度*/
                            top:0;
                            left:0;
                            background-color: #ececec;
                            display: block;
                            transform: rotate(-74deg);/*这里需要自己调整，根据线的位置*/
                            transform-origin: top;
                        }
                        b{font-style:normal;display:block;position:absolute;top:20px;left:10px;width:35px;font-weight: normal;}
                        em{font-style:normal;display:block;position:absolute;top:10px;right:10px;width:55x;}
                    }
                    td{
                        text-align: center;
                        font-size: 14px;
                        color: #444950;
                        .salaryInput{
                            width: 42px;
                            border: none;
                            outline: none;
                            text-align: center;
                            font-size: 14px;
                            margin-right: 5px;
                        }
                        input::-webkit-input-placeholder{
                            color:#999999;;
                        }
                        input::-moz-placeholder{   /* Mozilla Firefox 19+ */
                            color:#999999;
                        }
                        input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                            color:#999999;
                        }
                        input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                            color:#999999;
                        }
                    }
                    .post{
                        position: relative;
                        .deleteBtn{
                            left: 0;
                            top:-1px;
                            z-index: 10;
                        }
                    }
                    tr{
                        height: 50px;
                    }
                    .more{
                        cursor: pointer;
                        .addicon{
                            background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
                            width: 14px;
                            height: 14px;
                            float:left;
                            margin:1px 0 0 367px;
                        }
                        .txt{
                            float:left;
                            font-size: 12px;
                            color: #4c8aff;
                            margin:0px 0 0 10px;
                        }
                    }
                }
                table,table tr th, table tr td{
                    border:1px solid #ececec; 
                }
            }
        }
    }
}
	
</style>