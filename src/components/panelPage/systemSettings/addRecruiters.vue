<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt" v-if="!$store.state.systemSettings.states.id">新增招聘者</div>
                        <div class="txt" v-else>编辑</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div style="height:50px;" v-if="fixed"></div>
                <div class="minH addJobs inputHeight30 addRecruiters">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="medium">
                        <div class="title">基本信息</div>
                        <div class="informationWrap">     
                            <div class="mb24">
                                <div class="item height30">
                                    <el-form-item label="招聘渠道：" prop="channelId">
                                        <el-select v-model="form.channelId" @change="channelChange">
                                            <el-option v-for="(i,k) in channelItem" :key="k" :label="i.name" :value="i.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="item ml height30 pdr30">
                                    <el-form-item label="招聘者：" prop="agencyId">
                                        <el-select v-model="form.agencyId" @change="changeAgency">
                                            <el-option v-for="(i,k) in agencyItem" :key="k" :label="i.name" :value="i.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="mb19">
                                <div class="item height30">
                                    <el-form-item label="联系人：" prop="linkman">
                                        <el-input placeholder="请输入" v-model="form.linkman" type="text"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="item ml height30">
                                    <el-form-item label="联系电话：" prop="phone">
                                        <div class="tel">+86<i class="el-icon-caret-bottom icon"></i></div>
                                        <div class="telInput">
                                            <el-input v-model="form.phone" placeholder="请输入"></el-input>
                                        </div>
                                    </el-form-item>
                                </div>
                                <div class="clear"></div>
                            </div>
                            <div class="height30" :class="{'mb19':!channelCompare&&compare}">
                                <el-form-item label="状态：">
                                    <el-radio-group v-model="form.state">
                                        <el-radio label="enable">启用</el-radio>
                                        <el-radio label="disable">停用</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                            <div v-if="!channelCompare&&compare">
                                <div class="tableWrap mb18">
                                    <table border="1" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <th width="177">标准时薪制</th>
                                            <th width="177">白班</th>
                                            <th width="177">夜班</th>
                                            <th width="177">节假日白班</th>
                                            <th width="177">节假日夜班</th>
                                            <th width="177">状态</th>
                                        </tr>
                                        <tr v-for="(i,k) in dataList" :key="k">
                                            <td>{{i.postName}}</td>
                                            <td>{{i.dayshift/100}}元/小时</td>
                                            <td>{{i.nightshift/100}}元/小时</td>
                                            <td>{{i.holidayDayshift/100}}元/小时</td>
                                            <td>{{i.holidayNightshift/100}}元/小时</td>
                                            <td v-if="i.state=='enable'">生效中</td>
                                            <td v-else>已失效</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="mt height30">
                                    <el-form-item label="补贴类型：">
                                        车补<span class="fs12">（当上班时间早于 {{beforeTime}} ，或下班时间晚于 {{afterTime}} ，且工时大于等于 {{duration}} 小时，补贴金额 {{amount}} 元）</span>
                                    </el-form-item>
                                </div>
                            </div>    
                        </div>
                        <p v-if="!compare&&!channelCompare" class="txtP">*确认基本信息后，方可进行合同管理</p>
                        <div v-if="!channelCompare&&compare">
                            <div class="title">合同管理</div>
                            <div class="informationWrap1">
                                <Table :data-list="contractList" :reload="getContracts"></Table>
                                <div class="addJobsBtn" @click="addContract">
                                    <div class="addicon"></div>
                                    <div class="txt">添加更多合同</div>
                                </div>
                            </div>
                        </div>
                        <div v-if="channelCompare">
                            <div class="title">计费标准</div>
                            <div class="informationWrap" style="padding-bottom:24px;">
                                <div class="height30" style="margin-bottom:19px;">
                                    <el-form-item label="计费模式：">
                                        <el-select v-model="form.value3" @change="pricingChange">
                                            <el-option v-for="(i,k) in pricingModel" :key="k" :label="i" :value="i"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                                <div class="pricingItem" v-for="(i,k) in pricingList" :key="k">
                                    <div class="dashed" v-if="k!=0"></div>
                                    <div class="deleteBtn" v-if="k!=0" @click="del(k)">
                                        <div>删除</div>
                                    </div>
                                    <div v-if="!pricingCompare" class="list mb24">
                                        <div class="left">第{{k+1}}级：</div>
                                        <div class="right">
                                            <div class="floatL">
                                                <input type="text" placeholder="最少工时">至&nbsp;&nbsp;<input placeholder="最多工时" type="text">工时
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
                                            <tr v-for="(item,key) in i.postFee" class="costList" :key="key">
                                                <td class="post center">
                                                    <div class="deleteBtn" v-if="key!=0" @click="itemDel(k,key)">
                                                        <div>删除</div>
                                                    </div>
                                                    <div class="height30">
                                                        <el-select v-model="form.value5">
                                                            <el-option v-for="(i,k) in post" :key="k" :label="i" :value="i"></el-option>
                                                        </el-select>
                                                    </div>
                                                </td>
                                                <td>
                                                    <input class="salaryInput" type="text" placeholder="请输入">元/小时
                                                </td> 
                                                <td>
                                                    <input class="salaryInput" type="text" placeholder="请输入">元/小时
                                                </td>
                                                <td>
                                                    <input class="salaryInput" type="text" placeholder="请输入">元/小时
                                                </td>
                                                <td>
                                                    <input class="salaryInput" type="text" placeholder="请输入">元/小时
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
                                <div class="addJobsBtn" v-if="!pricingCompare" @click="addmore">
                                    <div class="addicon"></div>
                                    <div class="txt">添加更多阶梯</div>
                                </div>
                            </div>
                            <div class="title">补贴</div>
                            <div class="informationWrap">
                                <div class="mb24 height30">
                                    <el-form-item label="补贴类型：">
                                        <el-select v-model="form.value1" @change="channelChange">
                                            <el-option v-for="(i,k) in channelItem" :key="k" :label="i.name" :value="i.id"></el-option>
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
                                                v-model="form.startTime" 
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
                                                v-model="form.endTime"
                                                @focus="focus2=true" @blur="focus2=false" 
                                                value-format="HH:mm" format="HH:mm"
                                                style="width: 100%;">
                                            </el-time-picker>
                                            <i class="el-icon-arrow-down" :class="{'focus1':focus2}"></i>
                                        </div>
                                        <div class="floatL">
                                            且工时大于等于&nbsp;&nbsp;<input type="text">小时，补贴金额&nbsp;&nbsp;<input type="text">元
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
                <div class="btnWrap">
                    <div class="sub1" @click="submit('form')">确定</div>
                    <div class="sub2" @click="cancel">取消</div>
                </div>
			</div>
		</transition>
        <AddContract v-if="$store.state.systemSettings.addContract" :get-contracts="getContracts" :info-init="infoInit"></AddContract>
        <ContractDetail v-if="$store.state.systemSettings.contractDetail"></ContractDetail>
    </div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
import Table from '../../table/systemSettings/addRecruiters'
import AddContract from './addContract'
import ContractDetail from './contractDetail'
export default {
    name: 'addRecruiters',
    props:['reload'],
    mixins: [mixin],
	data () {
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            } else {
                const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/
                console.log(reg.test(value));
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('请输入正确的手机号'));
                }
            }
        }
		return {
			show: false, 
            _timeOut: '',
            form:{
                agencyId: '',
                agencyName: '',
                channelId: '',
                channelName: '',
                hotalId: this.$store.state.hotalId,
                linkman: '',
                phone: '',
                state: 'enable'
            },
            afterTime: '',
            beforeTime: '',
            duration: '',
            amount: '',
            channelItem: [],
            agencyItem: [],
            channelCompare: false,
            pricingModel: ['标准时薪制','阶梯时薪制'],
            post: ['PA技工'],
            pricingCompare: true,
            pricingList: [{
                date1: '',
                date2: '',
                post: '',
                date: '',
                postFee:[{}],
            }],
            focus1: false,
            focus2: false,
            compare: false,
            dataList: [],
            contractList: [],
            rules: {
				linkman: [
                    { required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                phone: [
                    { required: true, validator: checkPhone, message: '请输入正确手机号', trigger: 'blur' }
                ],
                channelId: [
                    { required: true, message: '请选择招聘渠道', trigger: 'change' }
                ],
                agencyId: [
                    { required: true, message: '请选择招聘者', trigger: 'change' }
                ],
			},
		}
    },
    created() {
        this.init()
    },
	mounted () {
        this.show = true
	},
	methods: {
        changeAgency() {
            if(this.compare) {
                this.getContracts()
            }
        },
        getContracts() {
            console.log(this.$store.state.systemSettings.states.id)
            this.$axios({
                method: 'get',
                url:this.$urls.getContracts,
                params:{agencyId:this.form.agencyId}
            })
            .then(res=>{
                this.contractList = res.data 
            })
            .catch(e=>{
                
            })	
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false;
                }else{
                    this.form.agencyName = this.agencyItem.find(i=>i.id==this.form.agencyId).name
                    this.$axios({
                        method: 'post',
                        url:this.$store.state.systemSettings.states.id?this.$urls.updateHotalAgency:this.$urls.addHotalContract,
                        data:this.form
                    })
                    .then(res=>{
                        if(res.data.code==0){
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            })
                            this.compare = true
                            this.reload()
                            if(this.contractList.length>0){
                                this.cancel()
                                
                            }
                        }else{
                            this.$message({
                                message: res.data.msg||'操作失败',
                                type: 'error'
                            })
                        }
                    })
                    .catch(e=>{

                    })	
                }
            });
            
        },
        itemDel(k,key) {
            this.pricingList[k].postFee.splice(key,1)
        },
        add(k) {
            this.pricingList[k].postFee.push({})
        },
        del(k) {
            this.pricingList.splice(k,1)
        },
        addmore() {
            this.pricingList.push({
                date1: '',
                date2: '',
                post: '',
                date: '',
                postFee:[{}],
            })
        },
        pricingChange(data) {
            if (data=='标准时薪制') {
                this.pricingCompare = true
            } else {
                this.pricingCompare = false
            }
        },
        channelChange(data) {
            if (data==100000000000) {
                this.channelCompare = false
            } else {
                this.channelCompare = true
            }
            this.form.channelName = this.channelItem.find(i=>i.id==data).name
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('addRecruiters')
			}, 200)
        },	
        addContract() {
            this.$store.dispatch('addContract',{id:'',agencyId:this.form.agencyId})
        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.getChannel
            })
            .then(res=>{
               	this.channelItem = res.data
            })
            .catch(e=>{

            })	
            this.$axios({
                method: 'get',
                url:this.$urls.getAllAgency
            })
            .then(res=>{
               	this.agencyItem = res.data
            })
            .catch(e=>{

            })	
            if(this.$store.state.systemSettings.states.id){
                this.infoInit(this.$store.state.systemSettings.states.id)
                
            }
        },
        infoInit(id) {
            this.$axios({
                method: 'get',
                url:this.$urls.getContractAgency,
                params:{agencyId:id}
            })
            .then(res=>{
                this.compare = true
                this.form.agencyId = res.data[0].agencyId
                this.form.agencyName = res.data[0].agencyName
                this.form.channelId = res.data[0].channelId
                this.form.channelName = res.data[0].channelName
                this.form.linkman = res.data[0].linkman
                this.form.phone = res.data[0].phone
                this.form.state = res.data[0].state
                this.dataList = res.data[1]
                this.afterTime = this.$base.timeplateTohm(res.data[2].afterTime)
                this.beforeTime = this.$base.timeplateTohm(res.data[2].beforeTime)
                this.duration = parseInt(res.data[2].duration/(1000*60*60))
                this.amount = res.data[2].amount/100
                this.getContracts()
            })
            .catch(e=>{

            })	
        }
	},
	destroyed() {
		clearTimeout(this._timeOut)
    },
    components: {
        Table,
        AddContract,
        ContractDetail
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
    width:1140px;
    overflow-y: scroll;
    .fixed{
        width: 1100px;
    }
    .height30{
        height: 30px;
    }
    .mb19{
        margin-bottom: 19px;
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
            font-weight: bold;
            color: #666666;
        }
        .informationWrap1{
            width: 1100px;
            margin: 0 auto;
            margin-top: 15px;
            background-color: #f4f8fc;
            padding: 0 4px 24px 4px;
            box-sizing: border-box;
            .addJobsBtn{
                width: 1050px;
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
                    margin:13.5px 0 0 478px;
                }
                .txt{
                    width: 120px;
                    float:left;
                    font-size: 12px;
                    color: #4c8aff;
                    margin:13px 0 0 10px;
                }
            }
            .addJobsBtn:hover{
                background-color: #eaf3fe;
			    transition: all .2s;
            }
        }
        .informationWrap{
            width: 1100px;
            margin: 0 auto;
            padding: 24px 24px 19px;
            margin-top: 15px;
            background-color: #f4f8fc;
            border-radius: 2px;
            box-sizing: border-box;    
            overflow: hidden;
            .dashed{
                border-top: 1px dashed #d4d4d4;
                margin: 24px 0 19px 0;
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
            .addJobsBtn{
                width: 1050px;
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
                    margin:13.5px 0 0 478px;
                }
                .txt{
                    width: 120px;
                    float:left;
                    font-size: 12px;
                    color: #4c8aff;
                    margin:13px 0 0 10px;
                }
            }
            .addJobsBtn:hover{
                background-color: #eaf3fe;
			    transition: all .2s;
            }
            .item{
                width: 260px;
                float: left;
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
                    font-size: 12px;
                    margin-top: 0.5px;
                    position: relative;
                    .icon{
                        color:#999999;
                        position: absolute;
                        top: 7px;
                        right: 8px;
                    }
                }
                .telInput{
                    float: left;
                    margin-left: 5px;
                    height: 30px;
                    width: 115px;
                }
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
            .mb24{
                margin-bottom: 24px;
            }
            .clear{
                clear: both;
            }
            .ml{
                margin-left: 366px;
            }
            .fs12{
                font-size: 12px;
            }
            .tableWrap{
                width: 1052px;
                background-color: #ffffff;
                table{
                    width: 100%;
                    height: 100%;
                    tr{
                        height: 50px;
                    }
                    th{
                        font-size: 14px;
                        color: #444950;
                    }
                    td{
                        text-align: center;
                        font-size: 14px;
                        color: #444950;
                    }
                }
                table,table tr th, table tr td{
                    border:1px solid #ececec; 
                }
            }
            .mb18{
                margin-bottom: 18px;
            }
            .tableWrap1{
                width: 1052px;
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
                            height:213px;/*这里需要自己调整，根据td的宽度和高度*/
                            top:0;
                            left:0;
                            background-color: #ececec;
                            display: block;
                            transform: rotate(-77deg);/*这里需要自己调整，根据线的位置*/
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
                    .center{
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
                            margin:1px 0 0 467px;
                        }
                        .txt{
                            float:left;
                            font-size: 12px;
                            color: #4c8aff;
                            margin:0px 0 0 10px;
                        }
                    }
                    .more:hover{
                        transition: .2s;
                        background-color: #eaf3fe;
                    }
                }
                table,table tr th, table tr td{
                    border:1px solid #ececec; 
                }
            }
        }
        .txtP{
            font-size: 14px;
            color: #666666;
            margin: 15px 0 0 20px;
        }
    }
}
	
</style>