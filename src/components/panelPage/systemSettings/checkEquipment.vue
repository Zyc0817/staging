<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">查看设备</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="editContent">
                    <el-form :model="ruleForm" ref="ruleForm" size="medium" class="demo-ruleForm">
                        <div class="equipment">
                            <el-form-item label="设备类型：" style="heigth:20px;">
                                <span>{{equipmentType | changeType}}</span>
                            </el-form-item>
                        </div>
                        <div class="serialNumber">
                            <el-form-item label="云序列号：" style="width:380px;">
                                <span class="cloudNumber">{{cloudSerialNumber}}</span><span class="onLine" v-if="state=='on'">在线</span><span class="offLine" v-if="state=='off'">离线</span>
                            </el-form-item>
                        </div>
                        <div class="equipmentIP">
                            <el-form-item label="设备IP：" style="width:380px;">
                                <span>{{equipmentIP}}</span>
                            </el-form-item>
                        </div>
                        <div class="userDepartment">
                            <el-form-item label="使用部门：" style="width:380px;">
                                <div class="userDepartmentBorder">
                                    <div class="tagWrap" v-for="(i,k) in departmentList" :key="k">
                                        <div class="tag">{{i.value|changeType1}}</div>
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                        <div class="deviceManager">
                            <div class="deviceManagerTitle">管理员<span @mouseenter="showTheClues=true" @mouseleave="showTheClues=false"></span>：<div class="theClues triangle" v-show="showTheClues"><div class="word1">{{titleWord}}</div><div class="word2">{{word}}</div></div></div>
                                <div class="userDepartmentBorder">
                                    <div class="tagWrap" v-for="(item,index) in equipmentList" :key="index">
                                        <div class="tag">{{item.value|changeType1}}</div>   
                                    </div>
                                </div>
                            </div>
                        <div class="equipmentLocation">
                            <el-form-item label="设备位置：" style="width:380px;">
                                <span>{{equipmentLocation}}</span>
                            </el-form-item>
                        </div>
                        <div class="equipmentFigure">
                            <el-form-item label="图片：" style="width:380px;">
                                <div class="equipmentFigureBorder">
                                    <img :src= photoUrl+i.filepath+i.filedate  alt="" v-for="(i,k) in photoList" :key="k">
                                </div>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div class="btnWrap">
                    <div class="sub3" @click="cancel">关闭</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import Table from '../../table/systemSettings/contract'
import _ from 'lodash'
export default {
	name: 'checkEquipment',
	data () {
		return {
            show: false,
            ruleForm: {

            },
            Png: '.png',
            state: '',
            equipmentType: '',
            cloudSerialNumber: '',
            equipmentIP: '',
            userDepartment: '',
            deviceManager: '',
            equipmentLocation: '',
            imageOne: '',
            imageTwo: '',
            picture_data: '',
            picture_data1: '',
            titleWord: '当设备出现断网等异常情况，系统将通过',
            word: '邮件/手机提醒管理员',
            showTheClues: false,
            equipmentList: [],
            departmentList: [],
            photoList: [],
            photoUrl: 'https://company-test.lanniao.com/upload/'
		}
    },
    created() {
        this.init()
    },  
	mounted () {
		this.show = true
    },
    filters: {
        changeType(val) {
            if(val == 'work'){
                return '考勤打卡'
            }else if(val == 'meal'){
                return '用餐打卡'
            }else { return '暂无类型' }
        },
        changeType1(val) {
            if(val){
                if(val.length<=5){
                    return val
                }else{
                    return val.substring(0,5)+'...'
                }
            }else{
                return ''
            }
        }
    },
	methods: {
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.machinedSearch,
                params:{ id: this.$store.state.systemSettings.id }
            })
            .then(res=>{     
                // console.log(res)
                this.state = _.get(res,'data.content.state','')
                this.equipmentType = _.get(res,'data.content.businessType','')
                this.cloudSerialNumber = _.get(res,'data.content.serialNo','')
                this.equipmentIP = _.get(res,'data.content.ip','')
                this.equipmentList = _.get(res,'data.content.managers',[])
                this.departmentList = _.get(res,'data.content.departments',[])
                this.equipmentLocation = _.get(res,'data.content.location','')
                this.photoList = _.get(res,'data.content.attachList',[])
            })
            .catch(err=>{
                
            })
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('checkEquipment')
			}, 200)
		}
	},
	destroyed() {
		clearTimeout(this._timeOut)
    },
    components:{
        Table
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
    overflow-y:scroll;
    width:400px;
    .editContent{
        min-height: calc(100% - 125px);
        margin-top: 14px;
        .equipment{
            margin-left: 20px;
            line-height: 20px;
            span{ 
                margin-left: 10px;
                font-size: 14px;
                color: #444950;
            }
        }
        .serialNumber{
            margin-left: 20px;
            .cloudNumber{
                margin-left: 10px;
                margin-right: 10px;
                font-size: 14px;
                color: #444950;
            }
            .onLine{
                font-size: 12px;
                color: #4c8aff;
            }
            .offLine{
                font-size: 12px;
                color: #e45a3c;
            }
        }
        .equipmentIP{
            margin-left: 20px;
            margin-top: 0px;
            span{
                margin-left: 25px;
                font-size: 14px;
                color: #444950;
            }
        }
        .userDepartment{
            margin-left: 20px;
            margin-top: 12px;
            .userDepartmentBorder{
                display: flex;
                flex-wrap: wrap;
                margin-top: -7px;
                .tagWrap{
                    position: relative;
                    margin-left: 10px;
                    margin-top: 10px;
                    .tag{
                        width: 80px;
                        height: 27px;
                        text-align: center;
                        line-height: 27px;
                        color: #4c8aff;
                        border: 1px solid #4c8aff;
                    }
                }
            }
        }
        .deviceManager{
            display: flex;
            margin-left: 20px;
            margin-top: 22px;
            .deviceManagerTitle{
                position: relative;
                width: 120px;
                font-size: 14px;
                color: #444950;
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
                .theClues{
                    position: absolute;
                    top: 30px;
                    left: 58px;
                    display: inline-block;
                    width: 260px;
                    height: 66px;
                    background: #fff;
                    border: 1px solid #ccc;
                    box-shadow: 5px 5px 5px rgba(225, 225, 225, .7);
                    border-radius: 5px;
                    z-index: 1;
                    text-align: center;
                    line-height: 30px;
                    font-size: 12px;
                    color: #444950;
                    .word1{
                        width: 216px;
                        margin-top: 10px;
                        margin-left: 22px;
                    }
                    .word2{
                        width: 120px;
                        margin-top: -10px;
                        margin-left: 19px;
                    }
                    
                }
                .triangle:before{
                        content: '';
                        border-bottom: 8px solid #000;
                        border-left: 8px solid transparent;
                        border-right: 8px solid transparent;
                        border-top: 0;
                        position: absolute;
                        left: 13px;
                        top: -8px;
                    }
                    .triangle:after{
                        content: '';
                        border-bottom: 8px solid #fff;
                        border-right: 8px solid transparent;
                        border-left: 8px solid transparent;
                        border-top: 0;
                        position: absolute;
                        left: 13px;
                        top: -8px;
                    }
            }
            .userDepartmentBorder{
                display: flex;
                flex-wrap: wrap;
                width: 385px;
                margin-left: -27px;
                margin-top: -10px;
                .tagWrap{
                    position: relative;
                    margin-left: 10px;
                    margin-top: 10px;
                    .tag{
                        width: 80px;
                        height: 27px;
                        text-align: center;
                        line-height: 27px;
                        color: #4c8aff;
                        border: 1px solid #4c8aff;
                    }
                }
            }
        }
        .equipmentLocation{
            margin-left: 20px;
            margin-top: 14px;
            span{
                margin-left: 12px;
                margin-right: 10px;
                font-size: 14px;
                color: #444950;
            }
        }
        .equipmentFigure{
            
            margin-left: 20px;
            margin-top: 15px;
            .equipmentFigureBorder{
                margin-left: 82px;
                img{
                    width: 60px;
                    height: 60px;
                }
                img:nth-of-type(2){
                    margin-left: 10px;
                }
            }
        }
    }
    .btnWrap{
        display: flex;
        justify-content: center;
        width: 400px;
        height: 57px;
        border-top: 1px solid #ececec;
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
            margin-top: 15px;
        }
        .sub3{
            background-color: #fff;
            color: #4c8aff;
        }
    }
}
	
</style>

