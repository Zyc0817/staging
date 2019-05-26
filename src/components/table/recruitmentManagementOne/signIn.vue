<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th v-if="tableType!=3">操作</th>
					<th>序号</th>
                    <th>姓名</th>
                    <th>用工部门</th>
                    <th>工作时间</th>
                    <th>招聘者</th>
                    <th>签到时间</th>
                    <th>上班时间</th>
                    <th>下班时间</th>
                    <th>签退时间</th>
                    <th>状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td v-if="tableType!=3">
                        <div v-if="tableType==0&&!i.clockTimeStart" class="clickAreaRed" @click="resign(i)">重签</div>
                        <div v-if="tableType==0&&i.clockTimeStart" class="null"></div>
                        <div v-if="tableType==1||tableType==2" class="clickAreaRed" @click="handsignBack(i)">手工签退</div>
                        
					</td>
                    <td>{{k+1}}</td>
                    <td>
                        <div class="clickArea" @click="info(i)">{{i.workerName}}</div>
                    </td>
					<td>{{i.departmentName}}</td>
                    <td>{{$base.timeplateTohm(i.workTimeStart)}} - {{$base.timeplateTohm(i.workTimeEnd)}}</td>
                    <td>
                        <div class="clickArea" @click="agencyDetail(i)">{{i.agencyName|txtLength}}</div>
                    </td>
                    <td>
                        <div v-if="i.signInTime">{{$base.formatTimeToMDHM(i.signInTime)}}</div>
                        <div v-else class="null"></div>
                    </td>
                    <td>
                        <div v-if="i.clockTimeStart">{{$base.formatTimeToMDHM(i.clockTimeStart)}}</div>
                        <div v-else class="null"></div>
                    </td>
                    <td>
                        <div v-if="i.clockTimeEnd">{{$base.formatTimeToMDHM(i.clockTimeEnd)}}</div>
                        <div v-else class="null"></div>
                    </td>
                    <td>
                        <div v-if="i.signOutTime">{{$base.formatTimeToMDHM(i.signOutTime)}}</div>
                        <div v-else class="null"></div>
                    </td>
                    <td v-if="tableType==0">已签到</td>
                    <td v-if="tableType==1">已下班</td>
                    <td v-if="tableType==2">滞留中</td>
                    <td v-if="tableType==3">已签退</td>
				</tr>
			</tbody>

		</table>
        <el-dialog
            title="查看详情"
            :visible.sync="dialogVisible"
            :width="'450px'"
            :custom-class="'signInDialog'"
            top="30.3vh">
            <div class="dialog">
                <p style="margin-top:50px">招聘者：{{recruiter}}</p>
                <p>联络人：{{personName}}</p>
                <p>手机号码：{{phone}}</p>
            </div>
            <div class="dialogBtn1">
                <div class="cancel" @click="dialogVisible=false">关闭</div>
            </div>  
        </el-dialog>
        <el-dialog
            title="重签"
            :visible.sync="dialogVisible1"
            :width="'450px'"
            :custom-class="'signInDialog'"
            top="30.3vh">
            <div class="dialog1">
                <p>确认给“{{data.workerName}}”重新签到吗？</p>
            </div>
            <div class="dialogBtn">
                <div class="sub" @click="sure">确定</div>
                <div class="cancel" @click="dialogVisible1=false">取消</div>
            </div>  
        </el-dialog>
	</div>
</template>
<script>

export default {
	name: 'signIn',
	props: ['dataList','tableType'],
	data () {
		return {
            dialogVisible:false,
            dialogVisible1: false,
            data: {},
            recruiter: '',
            personName: '',
            phone: ''

		}
	},
	filters:{
        txtLength(val) {
            if(val.length>6) {
                return val.substring(0,6)+'...'
            }else{
                return val
            }
        }
    },
	methods: {
        handsignBack(data) {
            this.$store.dispatch('signoutPageShow',{type:'handsignBack',data})
        },
        sure() {
            this.dialogVisible1 = false
            this.$store.dispatch('signPageShow',{type:'resign',data:this.data})
        },
        resign(data) {
            this.dialogVisible1 = true
            this.data = data
        },
        info(data) {
            this.$store.dispatch('signInInfoShow',{data,type:this.tableType})
        },
        agencyDetail(data) {
            this.$axios({
                method: 'get',
                url: this.$urls.getRecruiters + data.agencyId
                // params: {
                //     agencyId:data.agencyId
                // }
            }).then(res=>{
                console.log(res)
                this.recruiter = res.data.name
				this.personName = res.data.legal
				this.phone = res.data.phone
            }).catch(err=>{
                
            })
            this.dialogVisible = true
        }
	}
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.dialog{
    p{
        margin-bottom: 20px;
        margin-left: 98px;
        font-size: 16px;
    }
}
.dialog1{
    p{
        margin-top: 80px;
        text-align: center;
        font-size: 16px;
    }
}
.dialogBtn1{
    width: 90px;
    margin-left: -45px;
}
.dialogBtn1 div{
    font-size: 14px;
    width: 28px;
    height: 20px;
    padding: 4px 30px;
}
.dialogBtn{
    width: 240px;
    left: 105px;
    div{
        width: 28px;
        height: 20px;
        font-size: 14px;
        padding: 4px 30px;
    }
}

</style>
