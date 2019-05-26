
const dynamicRouter =[ //动态路由
  	{
		path: '/recruitmentPlan',
		name: 'recruitmentPlan',
		title:'用工计划',
		meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			roles:['C1000']  //该路由仅admin和user权限访问
	  	},
		icon:'icon-Employment-plan',
		component: resolve => {require(["../components/index"], resolve)},
		children:[
			{
			    path: 'employmentApplication',
			    name: 'employmentApplication',
			    title:'用工申请',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C1100']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/recruitmentPlan/employmentApplication'], resolve)
		  	},
		  	{
		  		path: 'approvalEmployment',
			    name: 'approvalEmployment',
			    title:'用工审批',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C1200']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/recruitmentPlan/approvalEmployment'], resolve)
			},  
		]
	},
	{
		path: '/recruitment',
		name: 'recruitment',
		title:'用工招聘',
		meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			roles:['C2000']  //该路由仅admin和user权限访问
	  	},
		icon:'icon-Employment-recruitment',
		component: resolve => {require(["../components/index"], resolve)},
		children:[
			{
			    path: 'decomposition',
			    name: 'decomposition',
			    title:'招聘分解',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C2100']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/recruitment/decomposition'], resolve)
			}, 
			{
			    path: 'companyConfirm',
			    name: 'companyConfirm',
			    title:'劳务公司确认',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C2200']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/recruitment/companyConfirm'], resolve)
			}, 
			{
			    path: 'hireManagement',
			    name: 'hireManagement',
			    title:'聘用管理',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C2300']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/recruitment/hireManagement'], resolve)
		  	}, 
		]
	},
	{
		path: '/recruitmentManagementOne',
		name: 'recruitmentManagementOne',
		meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			roles:['C3000']  //该路由仅admin和user权限访问
	  	},
		component: resolve => { require(["../components/index"], resolve) },
		icon:'icon-Employment-management',
		title:'用工管理',
		children: [
			{
				path: 'signIn',
				name: 'signIn', 
				title: '签到签退',
				meta: {   //添加meta标签，里面自定义了roles，用来设置权限
					roles:['C3100']    //该路由仅admin和user权限访问
				},
				component: (resolve) => require(['../components/recruitmentManagementOne/signIn'], resolve)
			},
			{
				path: 'employeesWork',
				name: 'employeesWork', 
				title: '员工上班',
				meta: {   //添加meta标签，里面自定义了roles，用来设置权限
					roles:['C3200']    //该路由仅admin和user权限访问
				},
				component: (resolve) => require(['../components/recruitmentManagementOne/employeesWork'], resolve)
			},
			{
				path: 'hotelManagement',
				name: 'hotelManagement',
				title: '住宿管理',
				meta: {   //添加meta标签，里面自定义了roles，用来设置权限
					roles:['C3300']    //该路由仅admin和user权限访问
				},
				component: (resolve) => require(['../components/recruitmentManagementOne/hotelManagement'], resolve)
			},
			{
				path: 'rewardsAndPunishments',
				name: 'rewardsAndPunishments',
				title: '奖惩管理',
				meta: {   //添加meta标签，里面自定义了roles，用来设置权限
					roles:['C3400']   //该路由仅admin和user权限访问
				},
				component: (resolve) => require(['../components/recruitmentManagementOne/rewardsAndPunishments'], resolve)
			},
			{
				path: 'employeeFiles',
				name: 'employeeFiles',
				title: '员工档案',
				meta: {   //添加meta标签，里面自定义了roles，用来设置权限
					roles:['C3500']    //该路由仅admin和user权限访问
				},
				component: (resolve) => require(['../components/recruitmentManagementOne/employeeFiles'], resolve)
			}
		]
	},
	{
		path: '/costManagement',
		name: 'costManagement',
		title:'费用管理',
		meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			roles:['C4000']  //该路由仅admin和user权限访问
	  	},
		icon:'icon-Cost-management',
		component: resolve => {require(["../components/index"], resolve)},
		children:[
			{
			    path: 'laborCosts',
			    name: 'laborCosts',
			    title:'用工费用',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C4100']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/costManagement/laborCosts'], resolve)
			},
			{
			    path: 'costSettlement',
			    name: 'costSettlement',
			    title:'费用结算',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C4200']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/costManagement/costSettlement'], resolve)
			},
			{
			    path: 'costApproval',
			    name: 'costApproval',
			    title:'费用审批',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C4300']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/costManagement/costApproval'], resolve)
			},
			{
			    path: 'costPay',
			    name: 'costPay',
			    title:'财务付款',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C4400']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/costManagement/costPay'], resolve)
		  	},
		  	
		]
	},
	{
		path: '/reportCenter',
		name: 'reportCenter',
		title:'报表中心',
		meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			roles:['C5000']  //该路由仅admin和user权限访问
	  	},
		icon:'icon-Report-center',
		component: resolve => {require(["../components/index"], resolve)},
		children:[
			{
			    path: 'dining',
			    name: 'dining',
			    title:'用餐统计表',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C5100']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/reportCenter/dining'], resolve)
			},
			{
			    path: 'attendance',
			    name: 'attendance',
			    title:'考勤明细表',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C5200']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/reportCenter/attendance'], resolve)
			},
			{
			    path: 'cost',
			    name: 'cost',
			    title:'费用统计表',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C5300']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/reportCenter/cost'], resolve)
			},
			
		]
	},
	{
		path: '/systemSettings',
		name: 'systemSettings',
		title:'系统设置',
		meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			roles:['C6000']  //该路由仅admin和user权限访问
	  	},
		icon:'icon-System-setup',
		component: resolve => {require(["../components/index"], resolve)},
		children: [
			{
			    path: 'organizationManagement',
			    name: 'organizationManagement',
			    title:'组织管理',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C6100']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/systemSettings/organizationManagement'], resolve)
			}, 
			{
			    path: 'workersPost',
			    name: 'workersPost',
			    title:'用工岗位',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C6700']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/systemSettings/workersPost'], resolve)
			}, 
			{
			    path: 'userManagement',
			    name: 'userManagement',
			    title:'用户管理',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C6200']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/systemSettings/userManagement'], resolve)
			}, 
			{
			    path: 'businessPlanning',
			    name: 'businessPlanning',
			    title:'企业规则',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C6300']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/systemSettings/businessPlanning'], resolve),
				children: [
					{
						path: 'employmentConditions',
						name: 'employmentConditions',
						title:'用工准入条件',
						meta: {  //添加meta标签，里面自定义了roles，用来设置权限
							  roles:['admin','user']  //该路由仅admin和user权限访问
						},
						component: (resolve) => require(['../components/systemSettings/businessPlanning/employmentConditions'], resolve)
					}, 
					{
						path: 'clockSettings',
						name: 'clockSettings',
						title:'打卡设置 ',
						meta: {  //添加meta标签，里面自定义了roles，用来设置权限
							  roles:['admin','user']  //该路由仅admin和user权限访问
						},
						component: (resolve) => require(['../components/systemSettings/businessPlanning/clockSettings'], resolve)
					}, 
					{
						path: 'employmentApplicationSetup',
						name: 'employmentApplicationSetup',
						title:'用工申请设置',
						meta: {  //添加meta标签，里面自定义了roles，用来设置权限
							  roles:['admin','user']  //该路由仅admin和user权限访问
						},
						component: (resolve) => require(['../components/systemSettings/businessPlanning/employmentApplicationSetup'], resolve)
					}, 
					{
						path: 'statements',
						name: 'statements',
						title:'结算单设置',
						meta: {  //添加meta标签，里面自定义了roles，用来设置权限
							  roles:['admin','user']  //该路由仅admin和user权限访问
						},
						component: (resolve) => require(['../components/systemSettings/businessPlanning/statements'], resolve)
					}, 
					{
						path: 'budget',
						name: 'budget',
						title:'预算设置',
						meta: {  //添加meta标签，里面自定义了roles，用来设置权限
							  roles:['admin','user']  //该路由仅admin和user权限访问
						},
						component: (resolve) => require(['../components/systemSettings/businessPlanning/budget'], resolve)
					}, 
					{
						path: 'mealSet',
						name: 'mealSet',
						title:'用餐设置',
						meta: {  //添加meta标签，里面自定义了roles，用来设置权限
							  roles:['admin','user']  //该路由仅admin和user权限访问
						},
						component: (resolve) => require(['../components/systemSettings/businessPlanning/mealSet'], resolve)
					}, 
					{
						path: 'timeSet',
						name: 'timeSet',
						title:'时间设置',
						meta: {  //添加meta标签，里面自定义了roles，用来设置权限
							  roles:['admin','user']  //该路由仅admin和user权限访问
						},
						component: (resolve) => require(['../components/systemSettings/businessPlanning/timeSet'], resolve)
					}, 
					{
						path: 'holidays',
						name: 'holidays',
						title:'节假日设置',
						meta: {  //添加meta标签，里面自定义了roles，用来设置权限
							  roles:['admin','user']  //该路由仅admin和user权限访问
						},
						component: (resolve) => require(['../components/systemSettings/businessPlanning/holidays'], resolve)
					}, 
				]
			}, 
			{
			    path: 'processSet',
			    name: 'processSet',
			    title:'流程设置',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C6500']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/systemSettings/processSet'], resolve)
			}, 
			{
			    path: 'recruitmentManagement',
			    name: 'recruitmentManagement',
			    title:'招聘管理',
			    meta: {  //添加meta标签，里面自定义了roles，用来设置权限
			      	roles:['C6400']  //该路由仅admin和user权限访问
			    },
			    component: (resolve) => require(['../components/systemSettings/recruitmentManagement'], resolve)
			}, 
			{
				path: 'equipmentManagement',
				name: 'equipmentManagement',
				title: '设备管理',
				meta: {  //添加meta标签，里面自定义了roles，用来设置权限
					roles: ['C6600']    //该路由仅admin和user权限访问
				},
				component: (resolve) => require(['../components/systemSettings/equipmentManagement'], resolve)
			},	
		]
	}
	
];
export default dynamicRouter