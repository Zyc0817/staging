<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt" v-if="$store.state.systemSettings.states.data">编辑</div>
						<div class="txt" v-else>新增角色</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div class="contentWrap inputHeight30 roleEdit addEmploymentApplication">
					<el-form ref="form" :model="form" label-width="80px" size="medium">
						<div class="height30 mb24">
							<el-form-item label="角色名称：">
								<el-input v-model="form.roleName" placeholder="请输入"></el-input>
							</el-form-item>
						</div>
					</el-form>
                    <div class="roleList">
                        <div class="left">拥有权限：</div>
                        <div class="right">
                            <el-tree
								:data="dataList"
								show-checkbox
								node-key="id"
								:check-strictly="false"
								:expand-on-click-node='false'
								ref="tree"
								:props="defaultProps">
							</el-tree>
                        </div>
                    </div>
				</div>
				<div class="subBtnWrap">
					<div class="subBtn" @click="subBtn">确定</div>
					<div class="resetBtn" @click="cancel">取消</div>
				</div>		
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	name: 'roleEdit',
	props:['reload'],
	data () {
		return {
			show: false, 
			_timeOut: '',
			form: {
				roleId:'',
				roleName: '',
				menuList: []
            },
            dataList: [],
            defaultProps: {
	          	children: 'children',
	          	label: 'zhCn'
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
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('roleEdit')
			}, 200)
		},
		subBtn() {
			if(!this.form.roleName){
				this.$message({
	                message: '请输入角色名称',
	                type: 'error'
				});
				return
			}
			if(this.$store.state.systemSettings.states.data){
				this.form.roleId = this.$store.state.systemSettings.states.data.roleId
			}
			this.form.menuList = this.$refs.tree.getCheckedNodes(false, true).map(i=>{
				return {id:i.id}
			})
			this.$axios({
                method: 'post',
				url:this.$urls.saveRole,
				data:this.form
            })
            .then(res=>{
				if(res.data.status==200){
					this.$message({
						message: '操作成功',
						type: 'success'
					});
					this.cancel()
					this.reload()
				}else{
					this.$message({
						message: res.data.message||'添加失败',
						type: 'error'
					});
				}
				
            })
            .catch(e=>{

            })	
        },
        init() {
			
			this.$axios({
                method: 'get',
                url:this.$urls.listMenus
            })
            .then(res=>{
               	this.dataList = Object.values((this.$base.formattingJson(res.data.content)))
            })
            .catch(e=>{

			})	
			if(this.$store.state.systemSettings.states.data){
				this.$axios({
					method: 'get',
					url:this.$urls.roleDetail+this.$store.state.systemSettings.states.data.roleId
				})
				.then(res=>{
					if(res.data.status==200){
						this.form.roleName = res.data.content.roleName
						let a = res.data.content.menuList.filter(i=>i.parentId)
						let arr = a.map(i=>i.id)
						this.$nextTick(()=>{
							this.$refs.tree.setCheckedKeys(arr)
						})
					}
				})
				.catch(e=>{

				})	
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
    width:400px;
	overflow-y: scroll;
	.height30{
		height: 30px;
	}
	.mb24{
		margin-bottom: 24px;
	}
	.contentWrap{
		padding: 24px 20px;
		min-height: calc(100% - 159px);
		.checkTxt{
			font-size: 12px;
			color: #666666;
        }
        .roleList{
            height: 550px;
            .left{
                float: left;
                width: 80px;
                font-size: 14px;
                color: #444950;
            }
            .right{
                float: right;
                width: 280px;
                height: 100%;
                border-radius: 1px;
                border: solid 1px #ececec;
                box-sizing: border-box;
                overflow-y: scroll;
                padding: 5px 4px 10px 4px;
			}
			.right::-webkit-scrollbar{
				display: none;
			}
        }
	}
	.subBtnWrap{
		height:57px;
		width:100%;
		border-top:1px solid #ececec;
		.subBtn,.resetBtn{
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
			margin:15px 0 0 60px;
		}
	}
}
	
</style>