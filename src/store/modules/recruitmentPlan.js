const recruitmentPlan = {
	state:{
		panelShow: false,  // 二级面板展开折叠
		addEmploymentApplicationShow: false,  //新增用工申请展开折叠
		addJobs: false,  // 添加更多用工计划
		draftBoxUpdateId: '',  //草稿箱->编辑的id
		panelTitle: '', // 折叠面板标题
		ApprovalsShow: false, // 查看审批进度菜单
		id: '', // 用工详情页面查询id
		val: '',
		detailPageShow: false,  // 用工详情面板展开折叠
		informationShow: false,  // 查看详情面板展开折叠
		employeeWorkInformationShow: false,  // 员工上班面板展开折叠
		personalDetailsShow: false,  // 个人详情面板展开折叠
		personalInformationOneShow: false,  // 员工详情面板展开折叠
		detailsEmploymentShow: false,  // 用工详情面板展开折叠
		rewardsAndPunishmentsPageShow: false,   // 奖惩详情面板展开折叠
		modulationInformationsShow: false,   //调整考勤详情面板展开折叠
		type: '',  // 申请or审批
		jobDetailShow: false,  // 岗位详情
		detailApprovalsShow: false,  // 查看用工申请->审批进度
		operation: 1,  // 用工详情岗位列表操作1显示0隐藏
		messageShow: false,  // 批量操作显示隐藏
		state: '',  // 用工审批5状态
		isRecord: '',  // 查看调整记录
		advancedSearchParams: {},
		form: {},  // 新增用工申请form
		addJobParams: {},  // 添加更多岗位参数
		getDetail: {},  //查看用工申请列表详情
		progressout: false,
		progressin: false,
		approval: {},
		signInInfo: false,
		signParams: {},
		signPage: false,
		signoutPageShow: false,
		addJobInfoObj: {},
		progress1in:false,
		data: {}
	},

	actions: {
		progressout({commit},params) {  // 二级面板展开折叠
			commit('progressout',params)
		},
		progressin({commit},params) {  // 二级面板展开折叠
			commit('progressin',params)
		},
		progress1in({commit},params) {  // 二级面板展开折叠
			commit('progress1in',params)
		},
		panelShow({commit}) {  // 二级面板展开折叠
			commit('panelShow')
		},
		addEmploymentApplicationShow({commit},params) {  // 二级面板展开折叠
			commit('addEmploymentApplicationShow',params)
		},
		addJobs({commit},params) {
			commit('addJobs',params)
		},
		ApprovalsShowBtn({commit},params) {
			commit('ApprovalsShowBtn',params)
		},
		personalInformations({commit},params) {
			commit('personalInformations',params)
		},
		detailPage({commit},params) {
			commit('detailPage',params)
		},
		detailsEmployment({commit},params){
			commit('detailsEmployment',params)
		},
		personalDetails({commit},params){
			commit('personalDetails',params)
		},
		employeeWorkInformation({commit},params){
			commit('employeeWorkInformation',params)
		},
		rewardsAndPunishmentsPage({commit},params){
			commit('rewardsAndPunishmentsPage',params)
		},
		personalInformationOne({commit},params){
			commit('personalInformationOne',params)
		},
		jobDetail({commit},params) {
			commit('jobDetail',params)
		},
		detailApprovalsShow({commit},params) {
			commit('detailApprovalsShow',params)
		},
		modulationInformations({commit},params) {
			commit('modulationInformations',params)
		},
		messageShow({commit}) {
			commit('messageShow')
		},
		advancedSearchParams({commit},params) {
			commit('advancedSearchParams',params)
		},
		addJobParams({commit},params) {
			commit('addJobParams',params)
		},
		getDetail({commit},params) {
			commit('getDetail',params)
		},
		signInInfoShow({commit},params) {
			commit('signInInfoShow',params)
		},
		signPageShow({commit},params) {
			commit('signPageShow',params)
		},
		signoutPageShow({commit},params) {
			commit('signoutPageShow',params)
		},
		addJobInfo({commit},params) {
			commit('addJobInfo',params)
		}
	},

	mutations: {
		addJobInfo(state,params) {  // 二级面板展开折叠
			state.addJobInfoObj = params
		},
		signoutPageShow(state,params) {  // 二级面板展开折叠
			state.signoutPageShow = !state.signoutPageShow
			if(params) {
				state.signParams = params
			}else{
				state.signParams = {}
			}
		},
		signPageShow(state,params) {  // 二级面板展开折叠
			state.signPage = !state.signPage
			if(params) {
				state.signParams = params
			}else{
				state.signParams = {}
			}
		},
		signInInfoShow(state,params) {  // 二级面板展开折叠
			state.signInInfo = !state.signInInfo
			if(params) {
				state.signParams = params
			}else{
				state.signParams = {}
			}
		},
		progressout(state,params) {  // 二级面板展开折叠
			state.progressout = !state.progressout
			if(params) {
				state.approval = params
			}else{
				state.approval = {}
			}
		},
		progressin(state,params) {  // 二级面板展开折叠
			state.progressin = !state.progressin
			if(params) {
				state.approval = params
			}else{
				state.approval = {}
			}
		},
		progress1in(state,params) {  // 二级面板展开折叠
			state.progress1in = !state.progress1in
			if(params) {
				state.approval = params
			}else{
				state.approval = {}
			}
		},
		panelShow(state) {  // 二级面板展开折叠
			state.panelShow = !state.panelShow
		},
		addEmploymentApplicationShow(state,params) {  // 二级面板展开折叠
			state.addEmploymentApplicationShow = !state.addEmploymentApplicationShow
			if (params) {
				state.id = params.id
				state.panelTitle = params.title
				state.operation = params.operation
				state.type = params.type
				if (params.state) {
					state.state = params.state
				}
			} else {
				state.id = ''
				state.panelTitle = ''
				state.operation = ''
				state.type = ''
				state.state = ''
			}		
		},
		addJobs(state,params) {
			state.addJobs = !state.addJobs
			if (params) {
				state.form = params
			} else {
				state.form = ''
			}
		},
		ApprovalsShowBtn(state,params) {
			state.ApprovalsShow = !state.ApprovalsShow
			if (params) {
				state.panelTitle = params.title
				state.id = params.id
			} else {
				state.panelTitle = ''
				state.id = ''
			}
		},
		modulationInformations(state,params) {
			state.modulationInformationsShow = !state.modulationInformationsShow
			if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.state = params.state
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.state = ''
			}
		},
		detailPage(state,params) {
			state.detailPageShow = !state.detailPageShow
			if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.state = params.state
				state.data = params.data
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.state = ''
				state.data = ''
			}
		},
		detailsEmployment(state,params){
			state.detailsEmploymentShow = !state.detailsEmploymentShow
			if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.state = params.state
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.state = ''
			}
		},
		personalDetails(state,params){
			state.personalDetailsShow = !state.personalDetailsShow
			if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.state = params.state
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.state = ''
			}
		},
		employeeWorkInformation(state,params){
			state.employeeWorkInformationShow = !state.employeeWorkInformationShow
			if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.state = params.state
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.state = ''
			}
		},
		rewardsAndPunishmentsPage(state,params){
			state.rewardsAndPunishmentsPageShow = !state.rewardsAndPunishmentsPageShow
			if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.state = params.state
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.state = ''
			}
		},
		personalInformationOne(state,params){
			state.personalInformationOneShow = !state.personalInformationOneShow
			if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.state = params.state
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.state = ''
			}
		},
		personalInformations(state,params) {
			state.informationShow = !state.informationShow
			if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.val = params.val
				state.type = params.type
				state.operation = params.operation
				state.state = params.state
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.state = ''
			}
		},
		jobDetail(state,params) {
			state.jobDetailShow = !state.jobDetailShow
			if (params) {
				state.getDetail = params
			} else {
				state.getDetail = ''
			}
		},
		detailApprovalsShow(state,params) {
			state.detailApprovalsShow = !state.detailApprovalsShow
			if (params) {
				state.isRecord = params.isRecord
			} else {
				state.isRecord = ''
			}
		},
		messageShow(state) {
			state.messageShow = !state.messageShow
		},
		advancedSearchParams(state,params) {
			state.advancedSearchParams = params
		},
		addJobParams(state,params) {
			state.addJobParams = params
		},
		getDetail(state,params) {
			state.getDetail = params
		}
	}
}
export default recruitmentPlan