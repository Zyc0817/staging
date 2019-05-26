<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">查看详情</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="editContent">
                    <el-form :model="ruleForm" ref="ruleForm" size="medium" class="demo-ruleForm">
                        <div class="serialNumber">
                            <el-form-item label="岗位名称：" style="width:380px;">
                                <span>{{title}}</span>
                            </el-form-item>
                        </div>
                        <div class="userDepartment">
                            <el-form-item label="用工部门：" style="width:380px;">
                                <div class="userDepartmentBorder">
                                    <div class="tagWrap" v-for="(i,k) in departmentList" :key="k" v-show="i.department!=null">
                                        <div class="tag">{{i.department}}</div>
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                        <div class="deviceManager">
                            <div class="deviceManagerTitle">必备从业资格证<span></span>：</div>
                                <div class="userDepartmentBorder">
                                    <div class="tagWrap" v-for="(item,key) in equipmentList" :key="key" v-show="item.certName!=null">
                                        <div class="tag">{{item.certName}}</div>   
                                    </div>
                                </div>
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
import mixin from '../../../assets/js/mixin/mixin'
export default {
    name: 'checkPostName',
    mixins: [mixin],
	data () {
		return {
            show: false,
            ruleForm: {

            },
            title: '',
            equipmentList: [],
            departmentList: []
		}
    },
    created() {
        this.init()
    },  
	mounted () {
		this.show = true
	},
	methods: {
        init() {
            this.$axios({
                method: 'get',
                url: this.$urls.getOutsidePost,
                params: { postId: this.$store.state.systemSettings.id }
            }).then(res=>{
                console.log(res)
                this.title = res.data.content.title
                this.departmentList = res.data.content.postDepartments
                this.equipmentList = res.data.content.postCertList
            })
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('checkPostName')
			}, 200)
        }
	},
	destoryed() {
		clearTimeout(this._timeOut)
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/panelPage.less';
.panel{
    overflow-y: scroll;
    width:400px;
    .editContent{
        margin-top: 24px;
        min-height: calc(100% - 135px);
        .serialNumber,.userDepartment,.deviceManager{
            margin-left: 20px;
            margin-top: 21px;
        }
        .serialNumber {
            span{ font-size: 14px;color: #444950;margin-left: 65px; }
        }
        .userDepartment{
            .userDepartmentBorder{
                display: flex;
                flex-wrap: wrap;
                width: 185px;
                margin-left: 135px;
                margin-top: -8px;
                .tagWrap{
                    position: relative;
                    margin-top: 10px;
                    .tag{
                        width: 80px;
                        height: 27px;
                        text-align: center;
                        line-height: 27px;
                        color: #4c8aff;
                        border: 1px solid #4c8aff;
                    }
                    .delete{
                        position: absolute;
                        top:-7px;
                        left: 74px;
                        width: 14px;
                        height: 14px;
                        background: #4c8aff;
                        border-radius: 100%;
                        text-align: center;
                        line-height: 14px;
                        color: #fff;
                    }
                }
                .tagWrap:nth-child(2n-1){
                    margin-left: 0px;
                    margin-right: 10px;
                }
            }
        }
        .deviceManager{
            display: flex;
            .deviceManagerTitle{
                width: 135px;
                font-size: 14px;
                color: #444950;
                // background: #ccc;
                span{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    margin-left: 5px;
                    margin-right: 5px;
                    border-radius: 100%;
                    background: url('../../../assets/img/logo.png') no-repeat -326px -160px;
                }
            }
            .userDepartmentBorder{
                display: flex;
                flex-wrap: wrap;
                width: 185px;
                margin-top: -12px;
                .tagWrap{
                    position: relative;
                    margin-top: 10px;
                    .tag{
                        width: 100px;
                        height: 27px;
                        text-align: center;
                        line-height: 27px;
                        color: #4c8aff;
                        font-size: 14px;
                        border: 1px solid #4c8aff;
                    }
                    .delete{
                        position: absolute;
                        top:-7px;
                        left: 74px;
                        width: 14px;
                        height: 14px;
                        background: #4c8aff;
                        border-radius: 100%;
                        text-align: center;
                        line-height: 14px;
                        color: #fff;
                    }
                }
                .tagWrap:nth-child(2n-1){
                    margin-left: 0px;
                    margin-right: 10px;
                }
            }
        }
    }
    .btnWrap{
        float: left;
        width: 100%;
        height: 57px;
        border-top: 1px solid #ececec;
        .sub3{
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
        .sub3{
            color:#4c8aff;
			background-color: #fff;
			border:1px solid #4c8aff;
			cursor:pointer;
            margin-top: 15px;
            margin-left: 160px;
        }
    }
}
</style>

