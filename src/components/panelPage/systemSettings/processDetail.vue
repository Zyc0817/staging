<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">查看流程</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="wrap">
                    <div class="item1">
                        <div class="left">流程类型：</div>
                        <div class="right">{{category}}</div>
                    </div>
                    <div class="item1">
                        <div class="left">流程名称：</div>
                        <div class="right">{{name}}</div>
                    </div>
                    <div v-if="number" class="item1">
                        <div class="left">申请次数：</div>
                        <div class="right">{{number}}次/月</div>
                    </div>
                    <div class="item2 mb14">
                        <div class="left">发起部门：</div>
                        <div class="right">
                            <div class="tag" v-for="(i,k) in workflowDepartmentVoList" :key="k"><div>{{i.workflowDepartmentName}}</div></div>
                        </div>
                    </div>
                    <div class="item2">
                        <div class="left">审批人：</div>
                        <div class="right">
                            <div class="approveWrap" v-for="(i,k) in approval" :key="k">
                                <div class="tag" v-for="(item,key) in i.approve" :key="key"><div>{{item.title}}</div></div>    
                                <div class="clear"></div>    
                                <div class="arrowRight" v-if="k!=approval.length-1">
                                    <img src="../../../assets/img/arrowDown.svg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="subBtnWrap">
					<div class="resetBtn" @click="cancel">关闭</div>
				</div>	
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	name: 'processDetail',
	data () {
		return {
			show: false, 
            _timeOut: '',
            category: '',
            name: '',
            workflowDepartmentVoList: [],
            approval:[],
            number: 0
		}
    },
    created() {
        this.init()
    },
	mounted () {
		this.show = true
	},
	methods: {
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('processDetail')
			}, 200)
        },
        subBtn() {

        },
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.workflowGetDetail+'/'+this.$store.state.systemSettings.states.id
            })
            .then(res=>{
               	if(res.data.status==200){
                    let obj = res.data.content
                    if(obj.category=='apply'){
                        this.category = '用工申请'
                    }else if(obj.category=='special'){
                        this.category = '用工申请-紧急审批'
                        this.number = obj.number
                    }else{
                        this.category = '用工费用'
                    }
                    this.name = obj.name
                    this.workflowDepartmentVoList = obj.workflowDepartmentVoList
                    let a = 0
                    obj.nodeVoList.forEach((i,k)=>{
                        if(a<i.orders){
                            a = i.orders
                        }
                    })
                    this.approval = []
                    for(let i = 0;i<a;i++){
                        this.approval.push({approve:[],notify:[]})
                    }
                    obj.nodeVoList.forEach((i,k)=>{
                        if(i.postAction=='approve'){
                            this.approval[i.orders-1].approve.push({title:i.postName,id:i.postId})
                        }else{
                            this.approval[i.orders-1].notify.push({title:i.postName,id:i.postId})
                        }
                    })
                }
            })
            .catch(e=>{

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
	.wrap{
        padding: 24px 20px;
        min-height: calc(100% - 159px);
        .item1{
            overflow: hidden;
            margin-bottom: 24px;
            .left,.right{
                float: left;
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                color: #444950;
            }
            .left{
                width: 80px;
            }
        }
        .item2{
            overflow: hidden;
            margin-bottom: 24px;
            .left,.right{
                float: left;   
                font-size: 14px;
                color: #444950;
            }
            .left{
                width: 80px;
                height: 27px;
                line-height: 27px;
            }
            .right{
                width: 280px;
                height: auto;
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
            .clear{
                clear: both;
            }
            .arrowRight{
                line-height: 1;
                width: 80px;
                height: 22px;
                text-align: center;
            }
        }
        .mb14{
            margin-bottom: 14px;
        }
    }
    .subBtnWrap{
		height:57px;
		width:100%;
		border-top:1px solid #ececec;
		.resetBtn{
			float:left;
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			background-color: #4c8aff;
			border-radius: 14.5px;
			color:#fff;
			text-align:center;
			font-size:12px;
			margin:15px 0 0 90px;
			border:1px solid #4c8aff;
			cursor:pointer;
		}
		.resetBtn{
			color:#4c8aff;
			background-color: #fff;
			border:1px solid #4c8aff;
			cursor:pointer;
			margin:15px 0 0 160px;
		}
	}
}
	
</style>