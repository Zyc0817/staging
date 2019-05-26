const ajaxUrls = {
	// 用工计划 用工申请
	orders: '/orders/',  // 全部列表
	delOrder: '/orders/delOrder',  // 草稿箱删除
	updateOrder: '/orders/updateOrder',  // 草稿箱修改
	// 新增用工申请
	departments: '/departments/',  // 用工部门列表
	withScope: '/departments/withScope',
	createOrder: '/orders/createOrder',  // 新增用工申请
	singlefile: 'orders/singlefile',  // beo上传
	cancelOrder: '/orders/cancelOrder',  //撤销用工单
	// 添加岗位
	addPostTitle: '/orders/addPostTitle',  // 添加岗位
	getOutsidePostByDept: '/departments/getOutsidePostByDept',  // 岗位列表
	getChannel: '/orders/getChannel',  // 招聘渠道
	// 详情
	getOrder: '/orders/getOrder',  // 查看工单详情
	downfile: '/orders/downfile',  // beo下载
	updateOrderDetailState: '/orders/updateOrderDetailState',  // 修改岗位状态
	// 审批进度
	getWorkflow: '/orders/getWorkflow',  // 查看审批进度
	// 用工审批
	getThrough: '/orderApprove/getThrough',  // 审批通过
	directReturn: '/orderApprove/directReturn',  // 退回
	udpPop: '/orderApprove/udpPop',
	advertiseList: '/advertise/advertiseList',
	showResolve: '/advertise/showResolve',
	saveResolve: '/advertise/saveResolve',
	employeeList: '/advertise/employeeList',
	//用工招聘，劳务公司确认
	labourList: '/advertise/labourList',
	reminder: '/advertise/reminder/news',
	clickOrder: '/advertise/clickOrder',
	//用工招聘，岗位详情
	clickStation: '/advertise/clickStation',
	//用工招聘，聘用管理
	clickUsername: '/advertise/clickUsername',
	returnUser: '/advertise/returnUser',
	getHotalAgencys: '/orders/getHotalAgencys',
	getTags: '/orders/getTags',
	delTags: '/orders/delTags',
	addTags: '/orders/addTags',
	posts: '/departments/posts',
	getAgency: '/advertise/getAgency',
	getAgencySalaryRule: '/orders/getAgencySalaryRule',
	orderApprove: '/orderApprove/',
	getHotalAgency: '/orders/getHotalAgency',
	certUpload: 'advertise/certUpload',
	addDepartment: '/departments/addDepartment',
	delDepartment: '/departments/delDepartment',
	addPost: '/departments/addPost',
	getCertType: '/departments/getCertType',
	getDepartment: '/departments/getDepartment',
	updateDepartment: '/departments/updateDepartment',
	getPost: '/departments/getPost',
	delPost: '/departments/delPost/',
	userList: '/user/list',
	roleList: '/role/list',
	saveRole: '/role/saveRole',
	delRole: '/role/delRole',
	//登陆相关
	getAllHotal: '/getAllHotal',

	getAllHotal: '/index/getAllHotal',
	login: '/index/login',
	addDepartment: '/departments/addDepartment',
	saveAccount: '/user/saveAccount',
	userGet: '/user/get',
	delAccount: '/user/delAccount',
	userEmail: '/user/email/',
	leadInto: '/company/leadInto',
	getCondition: '/company/getCondition',
	userGetvo: '/user/getVo/',
	roleGet: '/role/get',
	recruitApply: '/company/recruitApply',
	getRecruitApply: '/company/getRecruitApply',
	billConstraint: '/company/billConstraint',
	hotels: '/index/hotels',
	bespeakExam: '/bespeakExam',
	getImage: '/getImage',
	hotels: '/index/hotels',
	captcha: '/index/findPwd/captcha',
	bespeakExam: '/index/bespeakExam',
	getImage: '/index/getImage',
	getBillConstraint: '/company/getBillConstraint',
	budgetShow: '/company/budgetShow',
	mealConstraint: '/company/mealConstraint',
	getMealConstraint: '/company/getMealConstraint',
	updatePost: '/departments/updatePost',
	timeConstraint: '/company/timeConstraint',
	getTimeConstraint: '/company/getTimeConstraint',
	findPwd: '/index/findPwd',
	getHotalAgency: '/orders/getHotalAgency',
  workflowList: '/workflow/list',
	festivalAdd: '/company/festivalAdd',
	festivalShow: '/company/festivalShow',
	workflowGetPost: '/workflow/getPost',
	saveWorkflow: '/workflow/saveWorkflow',
	stopWorkflow: '/workflow/stopWorkflow',
	workflowGetDetail: '/workflow/getDetail',
	festivalCollect: '/company/festivalCollect',
	festivalDelete: '/company/festivalDelete',
	listMenus: '/role/listMenus',
	addHotalContract: '/orders/addHotalContract',
	addContract: '/orders/addContract',
	getContracts: '/orders/getContracts',
	getContractAgency: '/orders/getContractAgency',
	updateHotalAgency: '/orders/updateHotalAgency',
	getContract: '/orders/getContract',
	//用工管理 奖惩管理
	performanceList: '/performance/list',
	getWorkerDetail: '/performance/getWorkerDetail',
	getWorkerPerformance: '/performance/getWorkerPerformance',
	getRecruiters: '/performance/getRecruiters/',
	delContract: '/orders/delContract',
	budgetConstraint:'/company/budgetConstraint',
	getRecord: '/performance/getRecord/',
	//员工档案  黑名单列表
	getBlackList: '/black/getBlackList',
	getBlackDetail: '/black/getBlackDetail/',
	delBlackList: '/black/delBlackList/',
	addBlackList: '/black/addBlackList',
	//员工档案
	file: '/file/',
	roleDetail: '/role/detail/',
	message: '/file/message',
	tag: '/file/tag',
	certType: '/file/certType',
	udpMessage: '/file/udpMessage',
	delFiles: '/file/delFiles',
	//员工上班
	employeesCommuting: '/EmployeesCommuting/',
	add: '/lodge/add',
	addLodging: '/lodge/addLodging',
	remove: '/EmployeesCommuting/remove',
	addition: '/EmployeesCommuting/addition',
	getAllAgency: '/advertise/getAllAgency',
	updateContractState: '/orders/updateContractState',
	getPerformance: '/performance/getPerformance',
	addperformance: '/performance/addPerformance',
	getCategory: '/performance/getCategory',
	updateSign: '/EmployeesCommuting/updateSign',
	//住宿管理
	lodge: '/lodge/',
	adds: '/lodge/adds',
	del: '/lodge/del',
	getStatistics: '/home/getStatistics',
	getHomePersonal: '/home/getPersonal',
	savePersonal: '/home/savePersonal',
	dinner: '/company/dinner',
	getBillOrder: '/billOrder/getBillOrder',
	getBillField: '/billOrder/getBillField',
	createBillOrder: '/billOrder/createBillOrder',
	getBillOrderByPosition: '/billOrder/getBillOrderByPosition',
	addBillOrderApprove: '/billOrder/addBillOrderApprove',
	getBill: '/billOrder/getBill',
	getWorkerBill: '/billOrder/getWorkerBill',
	delBillOrder: '/billOrder/delBillOrder',
	getWorkBill: '/EmployeesCommuting/getWorkBill',
	getBillApprove: '/billOrder/getBillApprove',
	getBillOrderTag: '/billOrder/getBillOrderTag',
	getBillOrderApprove: '/billOrder/getBillOrderApprove',
	batchBillOrderApprove: '/billOrder/batchBillOrderApprove',
	getBillOrderPayState: '/billOrder/getBillOrderPayState',
	updateBillOrderPayState: '/billOrder/updateBillOrderPayState',
	addBillUserField: '/billOrder/addBillUserField',
	updateWorkBill: '/EmployeesCommuting/updateWorkBill',
	getBillDetail: '/EmployeesCommuting/getBillDetail',
	//设备管理相关接口
	machineList: '/machine/list',
	getBillOrderWorkerList: '/billOrder/getBillOrderWorkerList',
	machinedDelete: '/machine/delete',
	machinedSearch: '/machine/search',
	machinedEdit: '/machine/edit',
	machineImgUpload: '/machine/imgUpload',
	machinedAdd: '/machine/add',
	sign: '/sign/',
	getPlanTodayDept: '/sign/getPlanTodayDept',
	getPlanToday: '/sign/getPlanToday',
	addSign: '/sign/addSign',
	getPersonal: '/sign/in',
	getPersonalOut: '/sign/out',
	addSignOut: '/sign/addSignOut',
	saveSignWork: '/EmployeesCommuting/saveSignWork',
	getSignOut: '/sign/getSignOut',
	setClock: '/company/setClock',
	getClockSet: '/company/getClockSet',
	// 用工岗位相关接口
	showPosts: '/departments/showPosts',
	getListAgency: '/EmployeesCommuting/getListAgency/',
	getOutsidePostList: '/departments/getOutsidePostList',
	delOutsidePost: '/departments/delOutsidePost',
	getOutsidePost: '/departments/getOutsidePost',
	addOutsidePost: '/departments/addOutsidePost',
	updateOutsidePost: '/departments/updateOutsidePost',
	getBudget: '/orders/getBudget',
	getDraftOrder: '/orders/getDraftOrder',
	getDetailTotal: '/orsders/getDetailTotal',
	getSpecialFile: '/orders/getSpecialFile',
	getIcCard: '/sign/getIcCard',
	getHotalLogo: '/billOrder/getHotalLogo',
	generatePdfInfo: '/billOrder/generatePdfInfo',
	getDeptNumber: '/workflow/getDeptNumber',
	checkWorkflowDept: '/workflow/checkWorkflowDept',
	updPassword: '/user/updPassword',
	getShortcutMenu: '/home/getShortcutMenu',
	getLinkin: '/home/getLinkin',
	saveShortcutMenu: '/home/saveShortcutMenu',
	preMeals: '/report/preMeals',
	actualMeal: '/report/ActualMeal',
	workerActMeal: '/report/WorkerActMeal',
	generatePreMealsPdf: '/report/generatePreMealsPdf',
	generateActMealsPdf: '/report/generateActMealsPdf',
	generateWorkerActMealsPdf: '/report/generateWorkerActMealsPdf',
	attendance: '/report/attendance',
	generateAttendancePdf: '/report/generateAttendancePdf',
	workerCost: '/report/workerCost',
	workerCostSum: '/report/WorkerCostSum',
	paymentStatistics: '/report/paymentStatistics',
	generateWorkerCostSumPdf: '/report/generateWorkerCostSumPdf',
	generatePaymentStatisticsPdf: '/report/generatePaymentStatisticsPdf',
}
export default ajaxUrls;