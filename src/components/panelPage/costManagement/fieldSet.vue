<template>
	<div class="panelWrap">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap" :class="{'fixed':fixed}">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt">自定义字段</div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
				<div style="height:50px;" v-if="fixed"></div>
                <!-- <div class="checkBar">
                    <div class="left" @click="checkBar=true">
                        <div :class="{'select':checkBar}">查看页面</div>
                    </div>
                    <div class="right" @click="checkBar=false">
                        <div :class="{'select':!checkBar}">付款打印</div>
                    </div>
                </div> -->
                <div v-if="checkBar" class="tagWrap">
                    <div class="tag" 
                        @click="checkTag(k)" 
                        :class="{'select':i.check}"
                        v-for="(i,k) in dataList" 
                        :key="k">{{i.fieldName}}</div>
                </div>
                <div v-else class="tagWrap">
                    <div class="tag" 
                        @click="checkTag1(k)" 
                        :class="{'select':i.check}"
                        v-for="(i,k) in dataList1" 
                        :key="k">{{i.fieldName}}</div>
                </div>
				<div class="btnWrap">
                    <div class="submit" @click="sub">确定</div>
                    <div class="close" @click="cancel">取消</div>
                </div>
			</div>
		</transition>
	</div>
</template>
<script>
import mixin from '../../../assets/js/mixin/mixin'
export default {
	name: 'fieldSet',
    mixins: [mixin],
    props:['orderInit'],
	data () {
		return {
			show: false, 
            _timeOut: '',
            checkBar: true,
            dataList: [],
            dataList1: [],
            settingType: 'examine'
		}
    },
    created() {
        this.init()
    },
	mounted () {
		this.show = true
	},
	methods: {
        sub() {
            let arr = []
            this.dataList.forEach(i=>{
                if(!i.check) {
                    arr.push({
                        billFieldId:i.id,
                        settingType: 'examine'
                    })
                }
            })

            this.dataList1.forEach(i=>{
                if(!i.check) {
                    arr.push({
                        billFieldId:i.id,
                        settingType: 'print'
                    })
                }
            })

            this.$axios({
                method: 'post',
                url: this.$urls.addBillUserField,
                data:arr
            })
            .then(res=>{
                if(res.data.code==0) {
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                    this.orderInit()
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
        checkTag(k) {
            this.dataList[k].check = !this.dataList[k].check
            this.dataList = [].concat(this.dataList)
        },
        checkTag1(k) {
            this.dataList1[k].check = !this.dataList1[k].check
            this.dataList1 = [].concat(this.dataList1)
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('fieldSet')
			}, 200)
		},
		init() {
            this.$axios({
                method: 'get',
                url: this.$urls.getBillField,
                params:{settingType: 'examine'} 
            })
            .then(res=>{
                if(res.data.length) {
                    this.dataList = res.data
                    this.dataList.forEach(i=>{
                        if(!i.userId) {
                            i.check = true
                        }else{
                            i.check = false
                        }
                    })
                    this.dataList = [].concat(this.dataList)
                }
            })  
            .catch(e=>{
                
            })
            
            // this.$axios({
            //     method: 'get',
            //     url: this.$urls.getBillField,
            //     params:{settingType: 'print'} 
            // })
            // .then(res=>{
            //     if(res.data.length) {
            //         this.dataList1 = res.data
            //         this.dataList1.forEach(i=>{
            //             if(i.userId) {
            //                 i.check = true
            //             }else{
            //                 i.check = false
            //             }
            //         })
            //         this.dataList1 = [].concat(this.dataList1)
            //     }
            // })  
            // .catch(e=>{
                
            // })
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
    width:520px;
    overflow-y: scroll;
	.fixed{
        width: 480px;
    }
    .btnWrap{
        border-top: 1px solid #ececec;
        height: 57px;
        padding: 15px 150px;
        box-sizing: border-box;
        .submit, .close{
            font-size: 12px;
            color: #ffffff;
            background-color: #4c8aff;
            border-radius: 14.5px;
            float:left;
            cursor: pointer;
            padding: 5.5px 28px;
        }
        .close{
            margin-left: 60px;
            background: #fff;
            border: 1px solid #4c8aff;
            box-sizing: border-box;
            padding: 4.5px 27px;
            color: #4c8aff;
        }
    }
    .tagWrap{
        padding: 20px;
        min-height: calc(100% - 150px);
        overflow: hidden;
        .tag{
            float: left;
            margin: 0 10px 10px 0;
            min-width: 58px;
            text-align: center;
            padding: 4.5px 10px;
            border: 1px solid #ececec;
            font-size: 12px;
            color: #999999;
            cursor: pointer;
        }
        .select{
            border-color: #4c8aff;
            color: #4c8aff;
        }
    }
    .checkBar{
        height: 40px;
        background-color: #eaf3fe;
        .left,.right{
            width: 50%;
            float: left;
            height: 38px;
            line-height: 38px;
            text-align: center;
            font-size: 14px;
            color: #444950;
            div{
                width: 80px;
                margin: 0 auto;
                box-sizing: border-box;
            }
        }
        .select{
            color: #4c8aff;
            border-bottom: 2px solid #4c8aff;
        }
    }
}
	
</style>