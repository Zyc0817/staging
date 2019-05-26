<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">查看详情</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
                <div class="minH">
                    <div class="item mb24">
                        <div class="left">姓名：</div>
                        <div class="right">{{name}}</div>
                    </div>
                    <div class="item mb24">
                        <div class="left">岗位：</div>
                        <div class="right">CFA</div>
                    </div>
                    <div class="item mb24">
                        <div class="left">手机号：</div>
                        <div class="right">{{phone}}</div>
                    </div>
                    <div class="item mb24">
                        <div class="left">登录账号：</div>
                        <div class="right">{{account}}</div>
                    </div>
                    <div class="item1">
                        <div class="left">角色名称：</div>
                        <div class="right">
                            <div class="tag" v-for="(i,k) in roleList" :key="k"><div>{{i}}</div></div>
                        </div>
                    </div>
                    <div class="item mb24">
                        <div class="left">管理范围
                            <el-tooltip class="item" effect="light" placement="bottom">
                                <div slot="content">管理范围涉及用工申请、签到签退、员工<br/>上班、员工档案、用工费用和报表中心，<br/>其他模块没有管理范围限制</div>
                                <img src="../../../assets/img/icon3x.svg" alt="">
                            </el-tooltip>
                            ：
                            </div>
                        <div class="right">{{scope}}</div>
                    </div>
                </div>
                <div class="btn">
					<div @click="cancel">关闭</div>
				</div>
				
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'userDetail',
	mixins: [mixin],
	data () {
		return {
			show: false, 
            _timeOut: '',
            account: '',
            name: '',
            phone: '',
            roleList: [],
            scope: ''
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
                url:this.$urls.userGetvo+this.$store.state.systemSettings.states.id
            })
            .then(res=>{      
                if(res.status==200){
                    this.account = res.data.account
                    this.name = res.data.name
                    this.phone = res.data.phone
                    this.roleList = res.data.roleList.map(i=>i.roleName)
                    if(res.data.scope=='dept'){
                        this.scope = '所在部门'
                    }else if(res.data.scope=='group'){
                        this.scope = '所在部门及子部门'
                    }else{
                        this.scope = '全公司'
                    }
                } 
            })
            .catch(e=>{
                
            })
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('userDetail')
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
.border{
	width: 280px;
	height: 150px;
	border-radius: 1px;
    border: solid 1px #ececec;
    overflow-y: scroll;
    float: right;
    padding-top: 10px;
    padding-left: 10px;
    box-sizing: border-box;
}
.border::-webkit-scrollbar {
    display:none;
}
.panel{
    width:400px;
    .minH{
        min-height: calc(100% - 111px);
        padding: 24px 20px;
        box-sizing: border-box;
        .item{
            overflow: hidden;
            width: 100%;
            .left,.right{
                float: left;
                height: 20px;
                font-size: 14px;
                line-height: 20px;
            }
            .left{
                width: 80px;
                img{
                    width: 12px;
                    height: 12px;
                }
            }
        }
        .item1{
            overflow: hidden;
            margin-bottom: 14px;
            .left{
                float: left;
                height: 27px;
                font-size: 14px;
                line-height: 27px;
                width: 80px;
            }
            .right{
                float: left;
                overflow: hidden;
                width: 280px;
                .tag{
                    float: left;
                    width: 80px;
                    color: #4c8aff;
                    height: 27px;
                    border: solid 1px #4c8aff;
                    box-sizing: border-box;
                    line-height: 25px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    text-align: center;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    div{
                        font-size: 12px;
                        margin: 0 auto;
                        width: 78%;
                        overflow:hidden;
                        text-overflow:ellipsis;
                        white-space:nowrap
                    }
                }
            }
        }
        .mb24{
            margin-bottom: 24px;
        }
    }
    .fixed{
        width: 400px;
    }
	.btn{
		height:57px;
		border-top:1px solid #ececec;
		cursor:pointer;
		div{
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			background-color: #fff;
			border-radius: 14.5px;
			color:#4c8aff;
			font-size: 12px;
			text-align:center;
			margin:15px auto;
			border:1px solid #4c8aff;
		}
	}
}
	
</style>