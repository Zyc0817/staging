<template>
	<div class="panelWrap updateDecomposition">
		<div class="fd" @click="cancel"></div>
		<transition name="slide-fade">
			<div class="panel" v-if="show" @scroll="onScroll">
				<div class="panelTitleWrap">
					<div class="panelTitle">
						<div class="line"></div>
						<div class="txt" v-if="$store.state.recruitment.props.type=='decomposition'">分解 <div class="txtSpan">(用工单号：{{$store.state.recruitment.props.no}})</div></div>
                        <div class="txt" v-else>修改 <div class="txtSpan">(用工单号：{{$store.state.recruitment.props.no}})</div></div>
					</div>
					<div class="cancel icon-Close" @click="cancel"></div>
				</div>
                <div class="minH">
					<div class="title">用工需求</div>
					<div class="content content1">
						<div class="div1">用工部门：<span>{{departmentName}}</span></div>
						<div class="div2">用工日期：<span>{{startDate}} &nbsp;至&nbsp; {{endDate}}</span> <span>共计{{dateCount}}天</span></div>
						<div class="div3">申请事由：<span>{{reasons}}</span></div>
					</div>
                    <div class="decompositionWrap" :class="{'fixed': fixed}">
                        <nav class="wrap">
                            <div class="div1">渠道分解</div>
                            <div class="div2">总分解人数：<span>{{total}}人</span></div>
                            <div class="div2">已分解人数：<span>{{resolved}}人</span></div>
                            <div class="div3">待分解人数：<span>{{breakDown}}人</span></div>
                        </nav>
                    </div>
                    <div class="indent" v-if="fixed"></div>
                    <div class="decompositionList" v-for="(i,k) in listWrap" :key="k">           
                        <div class="content content2">
                            <div class="itemTag">{{k+1}}</div>
                            <div class="wrap">
                                <div class="item2">岗位：<span>{{i.post}}</span></div>
                                <div class="item1">工作时间：<span>{{$base.timeplateTohm(i.startTime)}}&nbsp;-&nbsp;{{$base.timeplateTohm(i.endTime)}}</span></div>
                                <div class="item2">培/休时间：<span>{{restTime(i.restTime)}}</span></div>
                            </div>
                            <div class="wrap mt30">
                                <div class="item2">用餐：<span>{{mealTimes(i.mealTimes)}}</span>       
                                </div>
                                <div class="item1">招聘人数：<span>共{{i.totalCount}}人</span>
                                    <div class="requirements" v-if="i.orderAddVoList&&i.orderAddVoList.length">
                                        <span v-for="(i,k) in i.orderAddVoList" :key="k">
                                            <label v-if="i.gender=='male'">男员工 {{i.total}} 名，年龄 {{i.ageMin}}-{{i.ageMax}}岁，身高 {{i.heightMin}}-{{i.heightMax}}cm；<br/></label>
                                            <label v-if="i.gender=='female'">女员工 {{i.total}} 名，年龄 {{i.ageMin}}-{{i.ageMax}}岁，身高 {{i.heightMin}}-{{i.heightMax}}cm；</label>
                                        </span>                 
                                    </div>
                                </div>
                                <div class="item2"></div>
                            </div>
                            <div class="wrap1 mt30">
                                <div class="item">员工要求：</div>
                                <div class="tag" v-for="(t,a) in tags(i.tags)" :key="a">{{t}}</div>
                            </div>
                        </div>
                        <el-form ref="form" size="small" label-width="80px"> 
                            <div class="content content3 inputHeight30" :class="{'pad20':j!=0}" v-for="(item,j) in form[k].a" :key="j">
                                <div class="deleteTag" @click="deleteDecomposition(k,j,i.orderAddVoList.length)" v-if="j!=0">
                                    <div>删除</div>
                                </div>
                                <div class="toBreakDown" v-if="j==form[k].a.length-1">待分解人数：{{breakDownArr[k].total}}人</div>  
                                <div class="wrap">
                                    <div class="item height30">
                                        <el-form-item label="招聘渠道：">
                                            <el-select v-model="item.channelId" placeholder="请选择" @change="changeValue1">
                                                <el-option v-for="(i,k) in getChannel" :key="k" :label="i.name" :value="i.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="item">
                                        <el-form-item label="招聘者：">
                                            <el-select v-model="item.agencyId" placeholder="请选择" @change="changeValue1">
                                                <el-option v-for="(i,k) in getAgency" :key="k" :label="i.name" :value="i.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <div class="item1">工资：<span>15元/小时</span></div>
                                </div>
                                <div v-if="i.orderAddVoList.length" class="wrap1 mt30">
                                    招聘人数：男：<div class="ml10"><el-input-number size="mini" @change="InputNumberChange(k,j,1)" v-model="item.maleCount" :min="0" :max="breakDownArr[k].a[j].maleCount"></el-input-number>&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    女：<div class="ml10"><el-input-number size="mini" @change="InputNumberChange(k,j,1)" v-model="item.femaleCount" :min="0" :max="breakDownArr[k].a[j].femaleCount"></el-input-number></div>
                                </div>  
                                <div v-else class="wrap1 mt30">
                                    招聘人数：<div class="ml10">
                                        <el-input-number size="mini" @change="InputNumberChange(k,j,0)" v-model="item.totalCount" :min="0" :max="item.totalCount+breakDownArr[k].total"></el-input-number>
                                    </div>
                                </div>              
                                <div class="addDecomposition" v-if="j==form[k].a.length-1&&breakDownArr[k].total!=0" @click="addDecomposition(k,j,i.orderAddVoList.length)">
                                    <div class="addicon"></div>
                                    <div class="txt">添加更多分解</div>
                                </div>
                                <div class="addDecomposition disable" v-if="j==form[k].a.length-1&&breakDownArr[k].total==0">
                                    <div class="addicon"></div>
                                    <div class="txt">添加更多分解</div>
                                </div>
                            </div>
                        </el-form>
                    </div>
                </div>	
                <div class="submitBtnWrap">
                    <div class="subBtn" @click="sub">确定</div>
                    <div class="cancelBtn" @click="cancel">取消</div>
                </div>	
			</div>
		</transition>
	</div>
</template>
<script>
export default {
	name: 'decomposition',
	data () {
		return {
			show: false, 
            _timeOut: '',
            departmentName: '',
            startDate: '',
            endDate: '',
            reasons: '',
            dateCount: '',
            total: 0,
            resolved: 0,
            breakDown: 0,
            form: [],
            getChannel: [],
            getAgency: [],
            listWrap: [],
            fixed: false,
            clientWidth:'',
            breakDownArr:[],
		}
    },
    created() {
        this.init()
    },
	mounted () {
        this.show = true
	},
	methods: {
        getHotalAgency() {
            this.$axios({
                method: 'get',
                url: this.$urls.getHotalAgency
            }).then(res=>{
                this.getAgency = res.data
            }).catch(e=>{
                
            })	
        },
        sub() {      
            if (this.breakDown) {
                this.$message({
					message: "请分解完后再提交",
					type: 'error',
					duration: 5 * 1000
                })
                return
            }
            let arr = []
            this.form.forEach((item,k)=>{
                item.a.forEach((i,j)=>{
                    i.hotalId = item.hotalId
                    i.orderDetailId = item.orderDetailId
                    i.orderId = item.orderId
                    i.totalCount += (i.maleCount+i.femaleCount)
                    arr.push(i)
                })
            })
            for(let i = 0;i<arr.length;i++) {
                if(!arr[i].agencyId){
                    this.$message({
                        message: "请选择招聘者",
                        type: 'error',
                        duration: 5 * 1000
                    })
                    return 
                }
                if(!arr[i].channelId){
                    this.$message({
                        message: "请选择招聘渠道",
                        type: 'error',
                        duration: 5 * 1000
                    })
                    return
                }
            }
            this.$axios({
                method: 'post',
                url: this.$urls.saveResolve,
                data: arr
            }).then(res=>{
                this.$message({
					message: "操作成功",
					type: 'success',
					duration: 5 * 1000
                })
                this.cancel()
            }).catch(e=>{
                this.$message({
					message: "操作失败",
					type: 'error',
					duration: 5 * 1000
				})
            })	

        },
        InputNumberChange(k,j,type) {
            let total = this.breakDownArr[k].totalCount
            if (type) {
                let add = 0
                this.breakDownArr[k].a.forEach((i,key)=>{
                    add += (this.form[k].a[key].maleCount + this.form[k].a[key].femaleCount)
                })
                this.breakDownArr[k].total = this.breakDownArr[k].totalCount - add
                this.breakDownArr[k].a.forEach((i,key)=>{         
                    i.femaleCount = this.form[k].a[key].femaleCount + this.breakDownArr[k].total
                    i.maleCount = this.form[k].a[key].maleCount + this.breakDownArr[k].total
                })
            } else {
                let add = 0
                 this.form[k].a.forEach((i,key)=>{
                    add += this.form[k].a[key].totalCount
                })
                this.breakDownArr[k].total = this.breakDownArr[k].totalCount - add
            }    
            this.breakDown = 0
            this.breakDownArr.forEach(i=>{
                this.breakDown += i.total
            })
            this.resolved = this.total - this.breakDown
        },
        addDecomposition(k,j,length) {
            this.form[k].a.push({
                agencyId: '',
                channelId: 100000000000,
                femaleCount: 0,
                maleCount: 0,
                totalCount: 0,
            })
            let total = this.breakDownArr[k].totalCount,
            count = 0,
            add = 0   
            if (length) {
                this.breakDownArr[k].a.forEach((i,key)=>{
                    add += (this.form[k].a[key].maleCount + this.form[k].a[key].femaleCount)  
                })
                count = total - add
                this.breakDownArr[k].a.push({femaleCount:count,maleCount:count})
            } else {
                this.form[k].a.forEach((i,key)=>{
                    add += this.form[k].a[key].totalCount
                })
                count = total - add
            }
            this.breakDownArr[k].total = count         
            this.breakDownArr[k].totalCount = total
        },
        deleteDecomposition(k,j,length) {
            if (length) {
                this.breakDownArr[k].total += (this.form[k].a[j].maleCount + this.form[k].a[j].femaleCount)
            } else {
                this.breakDownArr[k].total += this.form[k].a[j].totalCount
            }
            this.breakDownArr[k].a.splice(j,1)
            this.form[k].a.splice(j,1)
            this.breakDownArr[k].a.forEach((i,key)=>{         
                i.femaleCount = this.form[k].a[key].femaleCount + this.breakDownArr[k].total
                i.maleCount = this.form[k].a[key].maleCount + this.breakDownArr[k].total
            })   
            this.breakDown = 0
            this.breakDownArr.forEach(i=>{
                this.breakDown += i.total
            })
            this.resolved = this.total - this.breakDown    
        },
        tags(a) {
            if (a) {
                return a.split("|")
            }
        },
        mealTimes(a) {
            if (a) {
                let arr = a.split(""),         
                arr1 = [],
                str = ''
                if (arr[0]==1) {
                    arr1.push('早餐')
                } else if (arr[1]==1) {
                    arr1.push('午餐')
                } else if (arr[2]==1) {
                    arr1.push('晚餐')
                } else if (arr[3]==1) {
                    arr1.push('宵夜')
                } 
                arr1.forEach((i,k)=>{
                    if (k!=arr1.length-1) {
                        str += i + '、'
                    } else {
                        str += i
                    }   
                })
                return arr1.length?'包'+str:''
            }
        },
        onScroll() {
            let top = document.getElementsByClassName("panel")[0].scrollTop
            if (top>=270) {
                this.fixed = true
            } else {
                this.fixed = false
            }
        },
		cancel() {
			this.show = false
			this._timeOut = setTimeout(()=>{
				this.$store.dispatch('decomposition')
			}, 200)
        },
        changeValue1() {
            console.log(this.form)
        },
        init() {
            this.$axios({
                method: 'get',
				url:this.$urls.showResolve,
				params: {
                    orderId: this.$store.state.recruitment.props.id,
                }
            })
            .then(res=>{
                let obj = res.data.content
                this.departmentName = obj.department
                this.startDate = this.$base.formattingTime(obj.startDate)
                this.endDate = this.$base.formattingTime(obj.endDate)
                this.dateCount = this.$base.timeDifference('day',obj.startDate,obj.endDate)
                this.reasons = obj.reasons
                this.listWrap = obj.orderResolveVoList        
                obj.orderResolveVoList.forEach((i,k)=>{
                    let form = {
                        hotalId: this.$store.state.hotalId,
                        id: '',
                        a: [],
                        orderDetailId: i.id,
                        orderId: this.$store.state.recruitment.props.id}
                    this.breakDownArr.push({total:i.totalCount,totalCount:i.totalCount,a:[{maleCount:i.totalCount,femaleCount:i.totalCount}]})
                    if (this.$store.state.recruitment.props.type=='update') {
                        this.breakDownArr[k].a = []
                        i.resolveVoList.forEach((item,j)=>{
                            let obj = {
                                agencyId: item.agencyId,
                                channelId: item.channelId,
                                femaleCount: item.femaleCount,
                                maleCount: item.maleCount,
                                totalCount: item.totalCount,
                            }
                            form.a.push(obj)     
                            this.breakDownArr[k].total -= item.totalCount
                            this.breakDownArr[k].a.push({maleCount:i.totalCount,femaleCount:i.totalCount})
                        })
                        this.breakDown = 0
                    } else {
                        let obj = {
                            agencyId: '',
                            channelId: 100000000000,
                            femaleCount: 0,
                            maleCount: 0,
                            totalCount: 0,
                        }
                        form.a.push(obj)
                        this.breakDown += i.totalCount
                    }
                    this.total += i.totalCount
                    this.form.push(form)
                    this.resolved = this.total - this.breakDown
                })
            })
            .catch(e=>{
				
            })	
            this.$axios({
                method: 'get',
                url: this.$urls.getChannel
            }).then(res=>{
                this.getChannel = res.data          
            }).catch(e=>{
            
            })	
            this.getHotalAgency()
        },
        restTime(t) {
            let time = t / 60000
            if (time>60) {
                return `${time/60}小时${time%60}分钟`
            } else if (time==60) {
                return `1小时`
            } else {
                return `${time}分钟`
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
    width:1140px;
    overflow-y:scroll;
    .minH{
		min-height: calc(100% - 156px);
    }
    .mt30{
        margin-top: 24px;
    }
    .ml10{
        margin-left: 10px;
        display: inline-block;
    }
    .height30{
        height: 30px;
    }
    .mb24{
        margin-bottom: 24px;
    }
    .txt{
        .txtSpan{
            display: inline-block;
            height: 22px;
            line-height: 22px;
            font-size: 12px;
            font-weight: normal;
            margin-left: 8px;
        }
    }
    .submitBtnWrap{
		height:57px;
		border-top:1px solid #ececec;
		margin-top:30px;
		div{
			float:left;
			width: 24px;
			height: 17px;
			padding: 4px 27px;
			border-radius: 14.5px;
			text-align:center;
			font-size: 12px;
			border:1px solid #4c8aff;
			cursor:pointer;
		}
		.subBtn{
			background-color: #4c8aff;
			color:#fff;
			margin:15px 0 0 460px;
		}
		.cancelBtn{
			color: #4c8aff;
			margin:15px 0 0 60px;
		}
	}
    .title{
        width: 1100px;
        margin: 0 auto;
		height:22px;
		line-height:22px;
		font-size: 14px;
		color: #666666;
        margin-top:15px;
        font-weight: bold;
    }
    .decompositionWrap{
        overflow: hidden;
        background: #fff;
        height: 50px;
        font-size: 14px;
        color: #666666;
        
        .wrap{
            width: 1100px;
            margin: 0 auto;
            overflow: hidden;
        }
        div{
            float: left;
            height: 22px;
            line-height: 22px;
            padding: 14px 0;
        }
        .div1{
            margin-right: 60px;
            font-weight: bold;
        }
        .div2{
            margin-right: 120px;
            span{
                color: #4c8aff;
            }
        }
        .div3{
            span{
                color: #e45a3c;
            }
        }
    }
    .indent{
        height: 62px;
    }
    .fixed{
        width: 1140px;
        position: fixed;
        top: 0;
        right: 0;
        margin-top: 0;
        z-index: 10;
    }
	.content{
		width: 1100px;
		background-color: #f4f8fc;
		border-radius: 2px;
		margin: 0 auto;	
		box-sizing:border-box;
		overflow:hidden;
		.div1,.div2,.div3{
			float:left;
			font-size: 14px;
			color: #444950;
			span{
				margin-left:10px;
			}
		}
		.div2{
			margin:0 0 0 384px;
			span:nth-of-type(2) {
				font-size: 12px;
				color: #999999;
			}
		}
		.div3{
			width:100%;
			margin-top:24px;
		}
	}
	.content1{
        margin-top:15px;
		padding:24px;
    }
    .content2{
        padding: 24px;
        border-bottom: 1px solid #d4d4d4;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        position: relative;
        .itemTag{
            position: absolute;
            left: 0px;
            top: 0px;
            width: 45px;
            height: 45px;
            background: url("../../../assets/img/Triangle-left@3x.svg") no-repeat;
            background-size: 100% 100%;
            color:#fff;
            text-indent: 9px;
            line-height: 30px;
            font-size: 14px;
        }
        .wrap{
            display: flex;
            justify-content: center;
            div{        
                font-size: 14px;
                color: #444950;
                span{
                    margin-left: 10px;
                }
            }
            .item1{
                flex: 3.5;
                .requirements{
                    display: inline-block;
                }
            }
            .item2{
                flex: 2.2;
            }
        }
        .wrap1{
            font-size: 14px;
            color: #444950;
            .item{
                float: left;
                height: 27px;
                line-height: 27px;
            }
            .tag{
                min-width: 58px;
                text-align: center;
                height: 25px;
                line-height: 25px;
                border: 1px solid #4c8aff;
                float: left;
                margin: 0 10px;
                padding: 0 10px;
                font-size: 12px;
                color: #4c8aff;
                background-color: #ffffff;
            }
        }
    }
    .decompositionList{
        margin-bottom: 15px;
    }
    .content3{
        padding: 24px 24px 24px 24px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom: 2px solid #fff;
        position: relative;
        .deleteTag{
            width: 45px;
            height: 45px;
            position: absolute;
            background: url("../../../assets/img/delete.svg") no-repeat;
            background-size: 100% 100%;
            left: 0;
            top: 0;
            color: #fff;
            div{
                width: 45px;
                height: 45px;
                line-height: 23px;
                text-align: center;
                transform: rotate(-45deg);
            }
        }
        .toBreakDown{
            font-size: 16px;
            color: #4c8aff;
            margin-bottom: 24px;
        }
        .addDecomposition{
            width: 1040px;
			height: 43px;
			background-color: #fff;
			border: dashed 1px #4c8aff;
			margin:0 auto;
			margin-top:24px;
			cursor:pointer;
            .addicon{
				background: url('../../../assets/img/logo.png') no-repeat -284px -100px;
				width: 14px;
				height: 14px;
				float:left;
				margin:13.5px 0 0 478px;
			}
			.txt{
				width: 120px;
				float:left;
				font-size: 12px;
				color: #4c8aff;
				margin:13px 0 0 10px;
			}
        }
        .addDecomposition:hover{
            background-color: #eaf3fe;
			transition: all .2s;
        }
        .disable{
            opacity: 0.5;
        }
        .disable:hover{
            background-color: #fff;
        }
        .wrap{
            display: flex;
            justify-content: center;
            .item{
                flex: 2.87;
            }
            .item1{
                flex: 2.2;
                font-size: 14px;
                color: #444950;
                line-height: 29px;
            }
        }
        .wrap1{
            font-size: 14px;
            color: #444950;
        }
    }
	.pad20{
        padding: 20px 30px 30px 30px;
    }
}
	
</style>