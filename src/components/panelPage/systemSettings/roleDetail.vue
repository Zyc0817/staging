<template>
	<div class="panelWrap roleDetail roleEdit">
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
                        <div class="left">角色名称：</div>
                        <div class="right">{{roleName}}</div>
                    </div>
                    <div class="item1">
                        <div class="left">拥有权限：</div>
                        <div class="right">
                            <el-tree
								:data="dataList"
								show-checkbox
								node-key="id"
								:expand-on-click-node='false'
								ref="tree"
                                :check-strictly="true"
								:props="defaultProps">
							</el-tree>
                        </div>
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
	name: 'roleDetail',
	mixins: [mixin],
	data () {
		return {
			show: false, 
            _timeOut: '',
            roleName: '',
            dataList: [],
            defaultProps: {
                children: 'children',
                label: 'zhCn'
            }
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
                url:this.$urls.listMenus
            })
            .then(res=>{
                let arr = res.data.content
                arr.forEach(i=>{
                    i.disabled = true
                })
               	this.dataList = Object.values((this.$base.formattingJson(arr)))
            })
            .catch(e=>{

            })	
            if(this.$store.state.systemSettings.states.data){
                this.roleName = this.$store.state.systemSettings.states.data.roleName
                let arr = this.$store.state.systemSettings.states.data.menuList.map(i=>i.id)
                console.log(arr)
				this.$nextTick(()=>{
					this.$refs.tree.setCheckedKeys(arr)
				})
			}
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('roleDetail')
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
                width: 280px;
                overflow: hidden;
                box-sizing: border-box;
                border: 1px solid #ececec;
                height: 550px;
                overflow-y: scroll;
                padding: 10px;
                padding-top: 5px;

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