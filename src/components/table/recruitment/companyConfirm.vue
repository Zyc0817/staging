<template>
	<div id="table">
		<table style="width:100%" class="table">
			<thead>
				<tr>
					<th v-if="tableType!=2&&tableType!=3" class="minW">操作</th>
					<th class="minW">序号</th>
                    <th>岗位</th>
                    <th class="minW">人数</th>
                    <th width="210">用工日期</th>
                    <th>工作时间</th>
                    <th>用工部门</th>
                    <th width="210">用工单号</th>
                    <th>招聘者</th>
                    <th class="minW">状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(i,k) in dataList" :key="k">
					<td v-if="tableType!=2&&tableType!=3" class="operation">
                        <a class="operation" @click="handle(i.id,i.agency,i.post)">催办</a>
                    </td>
                    <td>{{k+1}}</td>
                    <td><a class="operation" @click="postDetail(i.id)">{{i.post}}</a></td>
                    <td>{{i.totalCount}}</td>
                    <td>{{getTimt(i.startDate,i.endDate)}}</td>
                    <td>{{$base.formattingHover(i.endTime)}}-{{$base.formattingHover(i.startTime)}}</td>
                    <td>{{i.department}}</td>
                    <td><a class="operation" @click="detailPage(i.id)">{{i.no}}</a></td>
                    <td>{{i.agency|txt}}</td>
                    <td>{{changeLetter(i.state)}}</td>
                </tr>
			</tbody>		
		</table>
	</div>
</template>
<script>
export default {
    name: 'companyConfirm',
    props: ['dataList','tableType'],
    data () {
        return {
            dateCount: 0
        }
    },
    filters: {
		txt(value) {
			if (value&&value.length&&value.length>6) {
				return value.substring(0,6) + '...'
			} else {
				return value
			}
		}
	},
    mounted() {

    },
    methods: {
        postDetail(id) {
            this.$store.dispatch('jobDetail',{id,type:'confirm',dateCount:this.dateCount})
        },
        getTimt(startDate,endDate) {
            this.dateCount = this.$base.timeDifference('day',startDate,endDate)
            return `${this.$base.formattingTime(startDate)}至 ${this.$base.formattingTime(endDate)}`
        },
        detailPage(id) {
            let params = {title:'查看用工单',operation:0,type:'confirm',id}
            this.$store.dispatch('detailPage',params)
        },
        handle(id,agency,post) {
            const h = this.$createElement;
	 		this.$msgbox({
	          	title: '催办',
				message: h('p', { style: 'font-size: 14px;color: #444950;margin:0 auto;width:311px;margin-top:80px' }, `确认催促“${agency}”尽快确认“${post}”岗位吗？`),
				showCancelButton: true,
				confirmButtonText: '确定',
				cancelButtonText: '取消',
	        }).then(action => {
                this.$axios({
                    method: 'post',
                    url:  this.$urls.reminder,  
                    data: {
                        "agencyId": 900000000000,
                        "content":'请尽快办理！',
                        "fromUserld": 0,
                        "id": 0,
                        "isOk": 0,
                        "orderDetailld": 0,
                        "hotalld": 0,
                        "title":'站短催办',
                        "toUserld": 0,
                        "type": 1
                    }
                }).then((res) =>{   
                    if(res.status == 200){
                        this.$message({
                            type: 'success',
                            message: '催办成功!'
                        });
                    }
                    
                }).catch((err) =>{
                    this.$message({
                            type: 'error',
                            message: '催办失败!'
                        });
                })
	        }).catch((err) => {
				this.$message({
                    type: 'info',
                    message: '已取消'
                }); 
            })
        },
        positionDetails(id) {
            this.$store.dispatch('positionDetails')
        },
        changeLetter(state){
            if(state == 'pending'){
                return '确认中'
            } else if(state == 'overdue') {
                return '已完工'
            } else if(state == 'receive') {
                return '已确认'
            }
        }
    }
}
</script>
<style scoped lang="less">
@import '../../../assets/css/table.less';
.minW{
    min-width: 40px;
}
.operation{
    color: #4c8aff; 
    cursor:pointer;
}
</style>
