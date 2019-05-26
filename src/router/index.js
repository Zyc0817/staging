import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{ path: '/', name: 'userLogin', component: resolve => { require(["../components/landing/userLogin"], resolve) } },
		{ path: '/experience', name: 'experience', component: resolve => { require(["../components/landing/experience"], resolve) } },
		{ path: '/retrievePassword', name: 'retrievePassword',component: resolve=> { require(["../components/landing/retrievePassword"], resolve) } },
		{ path: '/appointmentSuccess', name: 'appointmentSuccess',component: resolve=> { require(["../components/landing/appointmentSuccess"], resolve) } },
		{ path: '/retrievePasswordConfirm', name: 'retrievePasswordConfirm',component: resolve=> { require(["../components/landing/retrievePasswordConfirm"], resolve) } },
		{ path: '/resetPasswords', name: 'resetPasswords',component: resolve=> { require(["../components/landing/resetPasswords"], resolve) } },
		{ 
			path: '/index',
			name: 'index',
			children: [
				{
					path: 'homePage',
					name: 'homePage',
					meta: {  //添加meta标签，里面自定义了roles，用来设置权限
						roles: ['admin', 'user']  //该路由仅admin和user权限访问
					},
					component: (resolve) => require(['../components/homePage/homePage'], resolve)
				}
			],
			component: resolve => { require(["../components/index"], resolve) } 
		}
	]
})
