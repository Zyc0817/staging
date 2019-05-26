<template>
    <div class="dining"> 
        <div class="headTabBar">
            <div><p class="width140" :class="{'select':tabBar[0]}" @click="checkTabBar(0)">计划备餐表</p></div>
            <div><p class="width140" :class="{'select':tabBar[1]}" @click="checkTabBar(1)">实际用餐表</p></div>
            <div><p class="width180" :class="{'select':tabBar[2]}" @click="checkTabBar(2)">员工实际用餐明细表</p></div>
        </div>
        <div class="bodyWrap">
            <div class="form" v-if="tabBar[0]">
                <el-form ref="form" :model="form" label-width="80px" size="medium">
                    <div class="floatL width340 inputHeight30">
                        <el-form-item label="用工日期：">
                            <el-date-picker
                                v-model="form.startTime"
                                type="daterange"
                                @change="init"
                                value-format="timestamp"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="floatL width260 inputHeight30 ml184 position">
                        <el-form-item label="用工部门：">
                            <div @click="searchDepartmentWrapShow=!searchDepartmentWrapShow">
                                <el-input 
                                    v-model="form.departmentName" 
                                    popper-class="applyList" 
                                    @focus="focus=true"
                                    placeholder="请选择"></el-input>
                            </div>
                            <i class="el-icon-arrow-down" :class="{'focus1':focus}"></i>
                        </el-form-item>
                    </div>
                    <div class="searchDepartmentWrap applyList" ref="applyList" v-if="searchDepartmentWrapShow">
                        <div class="searchDepartment">
                            <div class="searchIcon"></div>
                            <input type="text" name="" v-model="val" placeholder="请输入关键字">
                        </div>
                        <div class="treeList">
                            <el-tree 
                                :data="departmentList" 
                                :props="defaultProps" 
                                ref="tree"
                                :filter-node-method="filterNode"
                                @node-click="handleNodeClick">
                            </el-tree>
                        </div>
                    </div>
                </el-form>   
            </div>
            <div class="form" v-if="tabBar[1]">
                <el-form ref="form" :model="form" label-width="80px" size="medium">
                    <div class="floatL width340 inputHeight30">
                        <el-form-item label="用工日期：">
                            <el-date-picker
                                v-model="form.startTime1"
                                type="daterange"
                                @change="init1"
                                value-format="timestamp"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="floatL width260 inputHeight30 ml184 position">
                        <el-form-item label="用工部门：">
                            <div @click="searchDepartmentWrapShow=!searchDepartmentWrapShow">
                                <el-input 
                                    v-model="form.departmentName1" 
                                    popper-class="applyList" 
                                    @focus="focus=true"
                                    placeholder="请选择"></el-input>
                            </div>
                            <i class="el-icon-arrow-down" :class="{'focus1':focus}"></i>
                        </el-form-item>
                    </div>
                    <div class="searchDepartmentWrap applyList" ref="applyList" v-if="searchDepartmentWrapShow">
                        <div class="searchDepartment">
                            <div class="searchIcon"></div>
                            <input type="text" name="" v-model="val" placeholder="请输入关键字">
                        </div>
                        <div class="treeList">
                            <el-tree 
                                :data="departmentList" 
                                :props="defaultProps" 
                                ref="tree"
                                :filter-node-method="filterNode"
                                @node-click="handleNodeClick1">
                            </el-tree>
                        </div>
                    </div>
                </el-form>   
            </div>
            <div class="form" v-if="tabBar[2]">
                <el-form ref="form" :model="form" label-width="80px" size="medium">
                    <div class="floatL width340 inputHeight30">
                        <el-form-item label="用工日期：">
                            <el-date-picker
                                v-model="form.startTime2"
                                type="daterange"
                                @change="init2"
                                value-format="timestamp"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </div>
                    <div class="floatL width260 inputHeight30 ml184 position">
                        <el-form-item label="用工部门：">
                            <div @click="searchDepartmentWrapShow=!searchDepartmentWrapShow">
                                <el-input 
                                    v-model="form.departmentName2" 
                                    popper-class="applyList" 
                                    @focus="focus=true"
                                    placeholder="请选择"></el-input>
                            </div>
                            <i class="el-icon-arrow-down" :class="{'focus1':focus}"></i>
                        </el-form-item>
                    </div>
                    <div class="searchDepartmentWrap applyList" ref="applyList" v-if="searchDepartmentWrapShow">
                        <div class="searchDepartment">
                            <div class="searchIcon"></div>
                            <input type="text" name="" v-model="val" placeholder="请输入关键字">
                        </div>
                        <div class="treeList">
                            <el-tree 
                                :data="departmentList" 
                                :props="defaultProps" 
                                ref="tree"
                                :filter-node-method="filterNode"
                                @node-click="handleNodeClick2">
                            </el-tree>
                        </div>
                    </div>
                    <div class="floatL width232 inputHeight30" v-if="tabBar[2]">
                        <el-form-item label="姓名：" label-width="52px">
                            <el-input v-model="form.workerName" placeholder="请输入" @blur="init2"></el-input>
                        </el-form-item>
                    </div>
                </el-form>   
            </div>
            <div class="line"></div>
            <div class="total" v-if="tabBar[0]">
                <span class="mr40">早餐：<span class="color">{{total1.breakfast}}次</span></span>
                <span class="mr40">午餐：<span class="color">{{total1.lunch}}次</span></span>
                <span class="mr40">晚餐：<span class="color">{{total1.dinner}}次</span></span>
                <span class="mr40">夜宵：<span class="color">{{total1.supper}}次</span></span>
                <span class="mr40">总餐次：<span class="color">{{total1.total}}次</span></span>
                <span class="floatR color ml20 cursor" @click="pringt1">打印</span>
                <span class="floatR color cursor" @click="exportList1">导出</span>
            </div>
            <div class="total" v-if="tabBar[1]">
                <span class="mr40">计划总餐次：<span class="color">{{total2.mealPlanTimes}}次</span></span>
                <span class="mr40">实际早餐：<span class="color">{{total2.breakfast}}次</span></span>
                <span class="mr40">实际午餐：<span class="color">{{total2.lunch}}次</span></span>
                <span class="mr40">实际晚餐：<span class="color">{{total2.dinner}}次</span></span>
                <span class="mr40">实际夜宵：<span class="color">{{total2.supper}}次</span></span>
                <span class="mr40">实际总餐次：<span class="color">{{total2.totalTimes}}次</span></span>
                <span class="floatR color ml20 cursor" @click="pringt2">打印</span>
                <span class="floatR color cursor" @click="exportList2">导出</span>
            </div>
            <div class="total" v-if="tabBar[2]">
                <span class="mr40">核算工时：<span class="color">{{total3.time}}小时</span></span>
                <span class="mr40">计划总餐次：<span class="color">{{total3.mealPlanTimes}}次</span></span>
                <span class="mr40">早餐打卡：<span class="color">{{total3.breakfastDate}}次</span></span>
                <span class="mr40">午餐打卡：<span class="color">{{total3.lunchDate}}次</span></span>
                <span class="mr40">晚餐打卡：<span class="color">{{total3.dinnerDate}}次</span></span>
                <span class="mr40">夜宵打卡：<span class="color">{{total3.supperDate}}次</span></span>
                <span class="mr40">打卡总餐次：<span class="color">{{total3.totalTimes}}次</span></span>
                <span class="floatR color ml20 cursor" @click="pringt3">打印</span>
                <span class="floatR color cursor" @click="exportList3">导出</span>
            </div>
            <div class="table" v-if="tabBar[0]">
                <ul class="title" :class="{'borderbottom':dataList.length==0}">
                    <li>序号</li>
                    <li>用工日期</li>
                    <li>用工部门</li>
                    <li>早餐（次)</li>
                    <li>午餐（次)</li>
                    <li>晚餐（次)</li>
                    <li>夜宵（次)</li>
                    <li>总餐次</li>
                </ul>
                <div v-for="(i,k) in dataList" :key="k">
                    <ul v-if="i.departmentName!='subtotal'">
                        <li>{{k+1}}</li>
                        <li>{{i.date}}</li>
                        <li>{{i.departmentName}}</li>
                        <li>{{i.breakfast}}</li>
                        <li>{{i.lunch}}</li>
                        <li>{{i.dinner}}</li>
                        <li>{{i.supper}}</li>
                        <li>{{i.total}}</li>
                    </ul>
                    <ul v-else class="subtotal" :class="{'borderbottom':dataList.length-1==k}">
                        <li></li>
                        <li></li>
                        <li class="color">小计：</li>
                        <li class="color">{{i.breakfast}}</li>
                        <li class="color">{{i.lunch}}</li>
                        <li class="color">{{i.dinner}}</li>
                        <li class="color">{{i.supper}}</li>
                        <li class="color">{{i.total}}</li>
                    </ul>
                </div>
                <div class="dataListNull" v-if="dataList.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>  
            </div>
            
            <div class="table" v-if="tabBar[1]">
                <ul class="title" :class="{'borderbottom':dataList2.length==0}">
                    <li>序号</li>
                    <li>用工日期</li>
                    <li>用工部门</li>
                    <li>计划总餐次</li>
                    <li>实际早餐（次)</li>
                    <li>实际午餐（次)</li>
                    <li>实际晚餐（次)</li>
                    <li>实际夜宵（次)</li>
                    <li>实际总餐次</li>
                </ul>
                <div v-for="(i,k) in dataList2" :key="k">
                    <ul v-if="i.departmentName!='subtotal'">
                        <li>{{k+1}}</li>
                        <li>{{i.date}}</li>
                        <li>{{i.departmentName}}</li>
                        <li>{{i.mealPlanTimes}}</li>
                        <li>{{i.breakfast}}</li>
                        <li>{{i.lunch}}</li>
                        <li>{{i.dinner}}</li>
                        <li>{{i.supper}}</li>
                        <li>{{i.totalTimes}}</li>
                    </ul>
                    <ul v-else class="subtotal" :class="{'borderbottom':dataList2.length-1==k}">
                        <li></li>
                        <li></li>
                        <li class="color">小计：</li>
                        <li class="color">{{i.mealPlanTimes}}</li>
                        <li class="color">{{i.breakfast}}</li>
                        <li class="color">{{i.lunch}}</li>
                        <li class="color">{{i.dinner}}</li>
                        <li class="color">{{i.supper}}</li>
                        <li class="color">{{i.totalTimes}}</li>
                    </ul>
                </div>
                <div class="dataListNull" v-if="dataList2.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>  
            </div>
            <div class="table" v-if="tabBar[2]">
                <ul class="title" :class="{'borderbottom':dataList3.length==0}">
                    <li>序号</li>
                    <li>用工日期</li>
                    <li>用工部门</li>
                    <li>招聘者</li>
                    <li>姓名</li>
                    <li>核算工时</li>
                    <li>计划总餐次</li>
                    <li>早餐打卡</li>
                    <li>午餐打卡</li>
                    <li>晚餐打卡</li>
                    <li>夜宵打卡</li>
                    <li>打卡总餐次</li>
                </ul>
                <div v-for="(i,k) in dataList3" :key="k">
                    <ul v-if="i.workerName!='subtotal'">
                        <li>{{k+1}}</li>
                        <li>{{i.date}}</li>
                        <li>{{i.departmentName}}</li>
                        <li>{{i.agencyName|agencyName}}</li>
                        <li>{{i.workerName}}</li>
                        <li>{{i.time}}</li>
                        <li>{{i.mealPlanTimes}}</li>
                        <li>
                            <div v-if="i.breakfastDate">{{i.breakfastDate}}</div>
                            <div v-else class="null"></div>
                        </li>
                        <li>
                            <div v-if="i.lunchDate">{{i.lunchDate}}</div>
                            <div v-else class="null"></div>
                        </li>
                        <li>
                            <div v-if="i.dinnerDate">{{i.dinnerDate}}</div>
                            <div v-else class="null"></div>
                        </li>
                        <li>
                            <div v-if="i.supperDate">{{i.supperDate}}</div>
                            <div v-else class="null"></div>
                        </li>
                        <li>{{i.totalTimes}}</li>
                    </ul>
                    <ul v-else class="subtotal" :class="{'borderbottom':dataList3.length-1==k}">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li class="color">小计：</li>
                        <li class="color">{{i.time}}</li>
                        <li class="color">{{i.mealPlanTimes}}</li>
                        <li class="color">{{i.breakfastDate}}</li>
                        <li class="color">{{i.lunchDate}}</li>
                        <li class="color">{{i.dinnerDate}}</li>
                        <li class="color">{{i.supperDate}}</li>
                        <li class="color">{{i.totalTimes}}</li>
                    </ul>
                </div>
                <div class="dataListNull" v-if="dataList3.length==0">
                    <img src="../../assets/img/zwsj.png" alt="">
                    <p>暂无相关数据</p>
                </div>  
            </div>
        </div>
    </div>
</template>
<script>
import mixin from '../../assets/js/mixin/mixin'
export default {
    name: 'dining',
    mixins: [mixin],
    data () {
        return {
            tabBar: [true,false,false],
            searchDepartmentWrapShow:false,
            departmentList:[],
            val: '',
            form:{
                startTime: [],
                departmentName: '',
                startTime1: [],
                departmentName1: '',
                startTime2: [],
                departmentName2: '',
                workerName: ''
            },
            defaultProps: {
				children: 'children',
				label: 'name'
            },
            focus: false,
            department: {},
            department1: {},
            department2: {},
            total1: {
                breakfast: 0,
                dinner: 0,
                lunch: 0,
                supper: 0,
                total: 0
            },
            dataList: [],
            total2: {
                breakfast: 0,
                dinner: 0,
                lunch: 0,
                mealPlanTimes: 0,
                supper: 0,
                time: 0,
                totalTimes: 0
            },
            dataList2: [],
            total3: {
                breakfastDate: 0,
                dinnerDate: 0,
                lunchDate: 0,
                mealPlanTimes: 0,
                supperDate: 0,
                time: 0,
                totalTimes: 0
            },
            dataList3: [],
        }
    },
    watch: {
		val(val) {
			this.$refs.tree.filter(val);
        },
        searchDepartmentWrapShow(val) {
            this.val = ''
        }
    },
    created() {
        let date = new Date(new Date().toLocaleDateString()).getTime()
        this.form.startTime = [date,date]
        this.form.startTime1 = [date,date]
        this.form.startTime2 = [date,date]
        this.init()
        this.departmentInit()
    },
    mounted () {
		document.addEventListener('click',(e)=>{
			if(this.$refs.applyList&&!this.$refs.applyList.contains(e.target)){
                this.searchDepartmentWrapShow = false
                this.focus = false
			}
		})
	},
    methods:{
        exportList1() {
            if(!this.dataList.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            const costHeader = {
                'idx': {label: '序号', format: (v, rIdx) =>{
                    return v !== undefined||NaN ? (v + '') : (parseInt(rIdx) + 1 + '')
                }},
                'date': {label: '用工日期'},
                'departmentName': {label: '用工部门', default: '--'},
                'breakfast': {label: '早餐（次)', default: '--'},
                'lunch': {label: '午餐（次)', default: '--'},
                'dinner': {label: '晚餐（次)', default: '--'},
                'supper': {label: '夜宵（次)', default: '--'},
                'total': {label: '总餐次', default: '--'}
            }
            let arr1 = JSON.stringify(this.dataList)
            let arr = JSON.parse(arr1)
            arr.forEach((i,k)=>{
                
                if(i.departmentName=='subtotal'){
                    i.departmentName='小计'
                    i.idx = ''
                }else{
                    i.idx = k+1
                }
            })
            arr.push({idx:'', date:'', departmentName:'', breakfast:'', lunch:'', dinner:'', supper:'',total: ''});
            arr.push({idx:'', date:'', departmentName:'', breakfast:'', lunch:'', dinner:'', supper:'',total: ''});
            arr.push({idx:'导出时间', date:new Date(), departmentName:'', breakfast:'', lunch:'', dinner:'', supper:'',total: ''});
            this.$excel.downXlsxFromJson(arr, costHeader, '计划备餐表.xlsx')
        },
        exportList2() {
            if(!this.dataList2.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            const costHeader = {
                'idx': {label: '序号', format: (v, rIdx) =>{
                    return v !== undefined||NaN ? (v + '') : (parseInt(rIdx) + 1 + '')
                }},
                'date': {label: '用工日期'},
                'departmentName': {label: '用工部门', default: '--'},
                'mealPlanTimes': {label: '计划总餐次', default: '--'},
                'breakfast': {label: '实际早餐（次)', default: '--'},
                'lunch': {label: '实际午餐（次)', default: '--'},
                'dinner': {label: '实际晚餐（次)', default: '--'},
                'supper': {label: '实际夜宵（次)', default: '--'},
                'totalTimes': {label: '实际总餐次', default: '--'}
            }
            let arr1 = JSON.stringify(this.dataList2)
            let arr = JSON.parse(arr1)
            arr.forEach((i,k)=>{
                
                if(i.departmentName=='subtotal'){
                    i.departmentName='小计'
                    i.idx = ''
                }else{
                    i.idx = k+1
                }
            })
            arr.push({idx:'', date:'', departmentName:'',mealPlanTimes: '', breakfast:'', lunch:'', dinner:'', supper:'',totalTimes: ''});
            arr.push({idx:'', date:'', departmentName:'',mealPlanTimes: '', breakfast:'', lunch:'', dinner:'', supper:'',totalTimes: ''});
            arr.push({idx:'导出时间', date:new Date(), departmentName:'',mealPlanTimes: '', breakfast:'', lunch:'', dinner:'', supper:'',totalTimes: ''});
            this.$excel.downXlsxFromJson(arr, costHeader, '实际用餐表.xlsx')
        },
        exportList3() {
            if(!this.dataList3.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            const costHeader = {
                'idx': {label: '序号', format: (v, rIdx) =>{
                    return v !== undefined||NaN ? (v + '') : (parseInt(rIdx) + 1 + '')
                }},
                'date': {label: '用工日期'},
                'departmentName': {label: '用工部门', default: '--'},
                'agencyName': {label: '招聘者', default: '--'},
                'workerName': {label: '姓名', default: '--'},
                'time': {label: '核算工时', default: '--'},
                'mealPlanTimes': {label: '计划总餐次', default: '--'},
                'breakfastDate': {label: '早餐打卡', default: '--'},
                'lunchDate': {label: '午餐打卡', default: '--'},
                'dinnerDate': {label: '晚餐打卡', default: '--'},
                'supperDate': {label: '夜宵打卡', default: '--'},
                'totalTimes': {label: '打卡总餐次', default: '--'}
            }
            let arr1 = JSON.stringify(this.dataList3)
            let arr = JSON.parse(arr1)
            arr.forEach((i,k)=>{
                if(i.workerName=='subtotal'){
                    i.workerName='小计'
                    i.idx = ''
                }else{
                    i.idx = k+1
                }
            })
            arr.push({idx:'', date:'', departmentName:'',agencyName: '', workerName:'', time:'', mealPlanTimes:'', breakfastDate:'',lunchDate: '',dinnerDate: '',supperDate: '',totalTimes: ''});
            arr.push({idx:'', date:'', departmentName:'',agencyName: '', workerName:'', time:'', mealPlanTimes:'', breakfastDate:'',lunchDate: '',dinnerDate: '',supperDate: '',totalTimes: ''});
            arr.push({idx:'导出时间', date:new Date(), departmentName:'',agencyName: '', workerName:'', time:'', mealPlanTimes:'', breakfastDate:'',lunchDate: '',dinnerDate: '',supperDate: '',totalTimes: ''});
            this.$excel.downXlsxFromJson(arr, costHeader, '员工实际用餐明细表.xlsx')
        },
        pringt1() {
            if(!this.dataList.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            this.$axios({
                method: 'post',
                url:this.$urls.generatePreMealsPdf,
                data:{
                    minWorkDate:this.form.startTime?this.form.startTime[0]:'',
                    maxWorkDate:this.form.startTime?this.form.startTime[1]+86400000:'',
                    departments:this.department.id?[this.department.id]:[]
                }
            })
            .then(res=>{
				if(res.data.status==200){
                    let i = res.data.content
					this.$printJS('/upload/'+i.filepath+i.filedate)
				}else{
					this.$message({
						message: res.data.message||'操作失败',
						type: 'error',
						duration: 5 * 1000
					})
				}
            })
            .catch(e=>{

            })	
        },
        pringt2() {
            if(!this.dataList2.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            this.$axios({
                method: 'post',
                url:this.$urls.generateActMealsPdf,
                data:{
                    minWorkDate:this.form.startTime1?this.form.startTime1[0]:'',
                    maxWorkDate:this.form.startTime1?this.form.startTime1[1]+86400000:'',
                    departments:this.department1.id?[this.department1.id]:[]
                }
            })
            .then(res=>{
				if(res.data.status==200){
                    let i = res.data.content
					this.$printJS('/upload/'+i.filepath+i.filedate)
				}else{
					this.$message({
						message: res.data.message||'操作失败',
						type: 'error',
						duration: 5 * 1000
					})
				}
            })
            .catch(e=>{

            })	
        },
        pringt3() {
            if(!this.dataList3.length){
                this.$message({
                    message: '暂无数据',
                    type: 'error',
                    duration: 5 * 1000
                })
                return 
            }
            this.$axios({
                method: 'post',
                url:this.$urls.generateWorkerActMealsPdf,
                data:{
                    minWorkDate:this.form.startTime2?this.form.startTime2[0]:'',
                    maxWorkDate:this.form.startTime2?this.form.startTime2[1]+86400000:'',
                    departments:this.department2.id?[this.department2.id]:[],
                    workerName:this.form.workerName 
                }
            })
            .then(res=>{
				if(res.data.status==200){
                    let i = res.data.content
					this.$printJS('/upload/'+i.filepath+i.filedate)
				}else{
					this.$message({
						message: res.data.message||'操作失败',
						type: 'error',
						duration: 5 * 1000
					})
				}
            })
            .catch(e=>{

            })	
        },
        checkTabBar(a) {
            this.tabBar = [false,false,false]
            this.tabBar[a] = true
            this.tabBar = [].concat(this.tabBar)
            if(a==0){
                this.init()
            }else if(a==1){
                this.init1()
            }else{
                this.init2()
            }
        },
        filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
        },
        handleNodeClick(data) {
            this.form.departmentName = data.name
            this.department = data
            this.searchDepartmentWrapShow = false
            this.focus = false
            this.init()
        },
        handleNodeClick1(data) {
            this.form.departmentName1 = data.name
            this.department1 = data
            this.searchDepartmentWrapShow = false
            this.focus = false
            this.init1()
        },
         handleNodeClick2(data) {
            this.form.departmentName2 = data.name
            this.department2 = data
            this.searchDepartmentWrapShow = false
            this.focus = false
            this.init2()
        },
        departmentInit() {
            this.$axios({
                method: 'get',
                url:this.$urls.withScope
            })
            .then(res=>{
				this.departmentList = Object.values(this.$base.buildTree1(res.data))
            })
            .catch(e=>{

            })	
        },
        init() {
            this.$axios({
                method: 'post',
                url:this.$urls.preMeals,
                data:{
                    minWorkDate:this.form.startTime[0]?this.form.startTime[0]:'',
                    maxWorkDate:this.form.startTime[1]?this.form.startTime[1]+86400000:'',
                    departments:this.department.id?[this.department.id]:[]
                }
            })
            .then(res=>{
				if(res.data.length){
                    this.total1 = res.data.find(i=>i.date=='total')
                    this.dataList = res.data.filter(i=>i.date!='total')
                }else{
                    this.total1 = {
                        breakfast: 0,
                        dinner: 0,
                        lunch: 0,
                        supper: 0,
                        total: 0
                    },
                    this.dataList = []
                }
            })
            .catch(e=>{

            })	
        },
        init1() {
            this.$axios({
                method: 'post',
                url:this.$urls.actualMeal,
                data:{
                    minWorkDate:this.form.startTime1[0]?this.form.startTime1[0]:'',
                    maxWorkDate:this.form.startTime1[1]?this.form.startTime1[1]+86400000:'',
                    departments:this.department1.id?[this.department1.id]:[]
                }
            })
            .then(res=>{
				if(res.data.length){
                    this.total2 = res.data.find(i=>i.date=='total')
                    this.dataList2 = res.data.filter(i=>i.date!='total')
                }else{
                    this.total2 = {
                        breakfast: 0,
                        dinner: 0,
                        lunch: 0,
                        mealPlanTimes: 0,
                        supper: 0,
                        time: 0,
                        totalTimes: 0
                    }
                    this.dataList2 = []
                }
            })
            .catch(e=>{

            })	
        },
        init2() {
            this.$axios({
                method: 'post',
                url:this.$urls.workerActMeal,
                data:{
                    minWorkDate:this.form.startTime2[0]?this.form.startTime2[0]:'',
                    maxWorkDate:this.form.startTime2[1]?this.form.startTime2[1]+86400000:'',
                    departments:this.department2.id?[this.department2.id]:[],
                    workerName:this.form.workerName 
                }
            })
            .then(res=>{
				if(res.data.length){
                    this.total3 = res.data.find(i=>i.date=='total')
                    this.dataList3 = res.data.filter(i=>i.date!='total')
                }else{
                    this.total3 = {
                        breakfastDate: 0,
                        dinnerDate: 0,
                        lunchDate: 0,
                        mealPlanTimes: 0,
                        supperDate: 0,
                        time: 0,
                        totalTimes: 0
                    },
                    this.dataList3 = []
                }
            })
            .catch(e=>{

            })	
        }
    }
}
</script>
<style scoped lang="less">
.dining{
    height:calc(100% - 50px);
    padding: 10px;
    box-sizing: border-box;
    .headTabBar{
        height: 60px;
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        background-color: #fff;
        div{
            flex: 1;
            height: 100%;
            line-height: 58px;
            font-size: 16px;
            text-align: center;
            p{
                margin: 0 auto;
                cursor: pointer;
            }
            .select{
                border-bottom: 2px solid #4c8aff;
                color: #4c8aff;
            }
            .width140{
                width: 140px;
            }
            .width180{
                width: 180px;
            }
        }
    }
    .bodyWrap{
        margin-top: 10px;
        height: calc(100% - 70px);
        background-color: #fff;
        overflow-y: scroll;
        padding: 24px 20px;
        box-sizing: border-box;
        min-width: 1240px;
        .form{
            height: 53px;
            .searchDepartmentWrap{
                width: 180px;
                height: 210px;
                background-color: #ffffff;
                box-shadow: 0px 0px 5px 0px rgba(68, 73, 80, 0.1);
                position: absolute;
                z-index: 10;
                top:190px;
                left: 806px;
                padding-top: 6px;
                box-sizing: border-box;
                .searchDepartment{
                    height:30px;
                    margin:4px 5px 10px 5px;
                    border: solid 1px #ececec;
                    .searchIcon{
                        background: url('../../assets/img/logo.png') no-repeat -145px -31px;
                        width: 26px;
                        height: 26px;
                        float:left;
                        transform:scale(.6);
                        margin: 1px 5px 0 5px;
                    }
                    input{
                        float:left;
                        height:100%;
                        box-sizing:border-box;
                        border:none;
                        outline:none;
                        color:#999;
                        font-size: 12px;
                        width: 120px;
                    }
                    input::-webkit-input-placeholder{
                        color:#d4d4d4;
                    }
                    input::-moz-placeholder{   /* Mozilla Firefox 19+ */
                        color:#d4d4d4;
                    }
                    input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
                        color:#d4d4d4;
                    }
                    input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
                        color:#d4d4d4;
                    }
                }
            }
            .position{
                position: relative;
                i{
                    position: absolute;
                    right: 10px;
                    top:9px;
                    color: #c0c4cc;
                    transition: all .2s;
                }
                .focus1{
                    transform: rotate(180deg);
                }
            }
        }
        .line{
            border-top: 2px dashed #d4d4d4;
        }
        .total{
            font-size: 14px;
            margin-top: 18px;
            .mr40{
                margin-right: 40px;
            }
            
        }
        .table{
            margin-top: 20px;
            ul{
                border-top: 1px solid #ececec;
                border-left: 1px solid #ececec;
                font-size: 0;
                display: flex;
                display: -webkit-flex;
                box-sizing: border-box;
                li{
                    border-right: 1px solid #ececec;
                    display: inline-block;
                    font-size: 12px;
                    height: 47px;
                    line-height: 47px;
                    text-align: center;
                    flex: 1;
                    box-sizing: border-box;
                    .null{
                        width: 24px;
						height: 1px;
						background-color: #d4d4d4;
						margin: 23px auto;
                    }
                }
                
            }
            .borderbottom{
                border-bottom: 1px solid #ececec;
            }
            .title{
                font-weight: bold;
            }
            .subtotal{
                li{
                    border-right: 1px solid #fff;
                }
                li:nth-last-of-type(1){
                    border-right: 1px solid #ececec;
                }
            }
        }
        .floatL{
            float: left;
        }
        .floatR{
            float: right;
        }
        .width340{
            width: 340px;
        }
        .inputHeight30{
            height: 30px;
        }
        .width260{
            width: 260px;
        }
        .width232{
            width: 232px;
            margin-left: 175.5px;
        }
        .ml184{
            margin-left: 175.5px;
        }
        .ml20{
            margin-left: 20px;
        }
        .cursor{
            cursor: pointer;
        }
        .color{
            color: #4c8aff;
        }
    }
}
</style>
