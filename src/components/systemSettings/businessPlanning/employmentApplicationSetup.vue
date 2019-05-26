<template>
    <div class="addEmploymentApplication inputHeight30 employmentApplicationSetup">
        <div class="wrap">
            <el-form ref="form" :model="form" label-width="108px" size="medium">
                <div class="width">
                    <div class="height30 mb24">
                        <el-form-item label="最多申请天数：">
                            <el-input placeholder="请输入" type="number" v-model="orderMaxDay"></el-input>
                            <div class="txt">天</div>
                        </el-form-item>		
                    </div>
                    <div class="height30">
                        <el-form-item label="最多申请工时：">
                            <el-input placeholder="请输入" type="number" v-model="workerMaxHour"></el-input>
                            <div class="txt">小时/人/天</div>
                        </el-form-item>		
                    </div>
                </div>
			</el-form>
        </div>
        <div class="btn">
            <div class="sub" @click="submit">保存</div>
            <div class="cancel">取消</div>
        </div>
    </div>
</template>
<script>
export default {
    name:'employmentApplicationSetup',
    data() {
        return {
            form: {
                orderMaxDay: '',
                workerMaxHour: '',
            },
            orderMaxDay: '',
            workerMaxHour: ''
        }
    },
    created() {
        this.init()
    },
    methods:{
        init() {
            this.$axios({
                method: 'get',
                url:this.$urls.getRecruitApply
            })
            .then(res=>{
                if(res.data.status==200){
                    this.orderMaxDay = res.data.content.orderMaxDay/(24*60*60*1000)
                    this.workerMaxHour = res.data.content.workerMaxHour/(60*60*1000)
                }
            })
            .catch(e=>{

            })	
        },
        submit() {
            this.form.orderMaxDay = this.orderMaxDay*24*60*60*1000
            this.form.workerMaxHour = this.workerMaxHour*60*60*1000
            this.$axios({
                method: 'put',
                url:this.$urls.recruitApply,
                data:this.form
            })
            .then(res=>{
                console.log(res)
                if(res.data.status==200){
                    this.$message({
                        message: "操作成功",
                        type: 'success',
                        duration: 5 * 1000
                    })
                }else{
                    this.$message({
                        message: res.data.message||"操作失败",
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
            })
            .catch(e=>{

            })	
        }
    }
}
</script>
<style lang="less" scoped>
.employmentApplicationSetup{
    height: 100%;
    .height30{
		height: 30px;
	}
	.mb24{
		margin-bottom: 24px;
	}
    .wrap{
        min-height: calc(100% - 79px);
        background-color: #fff;
        .width{
            width: 288px;
            padding-top: 24px;
            padding-left: 24px;
            position: relative;
            .txt{
                position: absolute;
                right: 10px;
                top: 1px;
            }
        }
    }
    .btn{
        width: 220px;
        margin: 0px auto;
        margin-top: 30px;
        margin-bottom: 20px;
        overflow: hidden;
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
        }
        .cancel{
            float: right;
            background-color: #fff;
            color: #4c8aff;
            border: 1px solid #4c8aff;
        }
    }
}
</style>

