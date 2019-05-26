<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">快捷入口</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
                <div class="wrap">
                    <div class="tag" 
						v-for="(i,k) in dataList" 
						:key="k" 
						:class="{'select':i.check}"
						@click="selectTag(k)">{{i.zhCn}}</div>
                </div>
				<div class="subBtnWrap">
					<div class="subBtn" @click="submit">确定</div>
					<div class="resetBtn" @click="cancel">关闭</div>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'quickEntry',
	props:['orderInit'],
	mixins: [mixin],
	data () {
		return {
			show: false, 
			_timeOut: '',
			dataList: [],
		}
	},
	created() {
		this.init()
	},
	mounted () {
		this.show = true
	},
	methods: {
        selectTag(k) {
			this.dataList[k].check = !this.dataList[k].check
			this.dataList = [].concat(this.dataList)
        },
        submit() {
			let data = []
			this.dataList.forEach(i=>{
				if(i.check){
					data.push({
						enUs:i.enUs,
						id:i.id,
						zhCn:i.zhCn
					})
				}
			})
			if(data.length!=4){
				this.$message({
					message: '仅能选择4个快捷入口',
					type: 'error',
					duration: 5 * 1000,			
				})
				return 
			}
			this.$axios({
                method: 'put',
				url:this.$urls.saveShortcutMenu,
				data
            })
            .then(res=>{      
                if(res.data.status==200){
					this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 5 * 1000,			
					})
					this.cancel()
					this.orderInit()
				}else{
					this.$message({
                        message: res.data.message||'操作失败',
                        type: 'error',
                        duration: 5 * 1000,			
                    })
				}
            })
            .catch(e=>{
                
			})
		},
		init() {
			this.$axios({
                method: 'get',
                url:this.$urls.getLinkin,
            })
            .then(res=>{      
                if(res.data.status==200){
					let a = res.data.content
					a.forEach(i=>{
						i.check = false
					})
					this.dataList = a
				}
            })
            .catch(e=>{
                
			})
			this.$axios({
                method: 'get',
                url:this.$urls.getShortcutMenu,
            })
            .then(res=>{      
                if(res.data.status==200){
                    this.dataList.forEach(i=>{
						res.data.content.forEach(j=>{
							if(i.zhCn==j.zhCn){
								i.check = true
							}
						})
					})
					
                }
            })
            .catch(e=>{
                
            })
		},
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('setQuickEntry')
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
    overflow-y: scroll;
    .wrap{
        padding: 20px;
        overflow: hidden;
        min-height: calc(100% - 151px);
        .tag{
            float: left;
            width: 80px;
            height: 27px;
            background-color: #ffffff;
            border-radius: 1px;
            border: solid 1px #ececec;
            box-sizing: border-box;
            font-size: 12px;
            color: #999999;
            text-align: center;
			line-height: 25px;
			cursor: pointer;
			margin: 0 10px 10px 0;
        }
        .select{
            color: #4c8aff;
            border: solid 1px #4c8aff;
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
.fixed{
    width: 360px;
}
	
</style>