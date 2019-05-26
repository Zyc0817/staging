import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

import recruitmentPlan from './modules/recruitmentPlan'
import headTabBar from './modules/headTabBar'
import recruitment from './modules/recruitment'
import systemSettings from './modules/systemSettings'
import costManagement from './modules/costManagement'
export default new Vuex.Store({
	state: {
		menuItem:[],  // 导航菜单，登陆成功后添加
		hotalId: '',
		hotalName: '',
		personal: false,
		avatar: '',
		quickEntry: false
	},
	actions: {
		setHotal({commit},params) {  // 二级面板展开折叠
			commit('setHotal',params)
		},
		setMenu({commit},params) {  // 二级面板展开折叠
			commit('setMenu',params)
		},
		personal({commit},params) {  // 二级面板展开折叠
			commit('personal',params)
		},
		setAvatar({commit},params) {
			commit('setAvatar',params)
		},
		setQuickEntry({commit},params) {
			commit('setQuickEntry',params)
		},
	},
	mutations:{
		setQuickEntry(state,params) {  // 二级面板展开折叠
			state.quickEntry = !state.quickEntry
		},
		setAvatar(state,params) {  // 二级面板展开折叠
			state.avatar = params
		},
		personal(state,params) {  // 二级面板展开折叠
			state.personal = !state.personal
		},
		setMenu(state,params) {  // 二级面板展开折叠
			if(params) {
				state.menuItem = params
			}else {
				state.menuItem = []
			}
			
		},
		setHotal(state,params) {  // 二级面板展开折叠
			state.hotalId = params.id
			state.hotalName = params.name
			state.avatar = params.avatar
		},
	},
	modules: {
		recruitmentPlan,
		headTabBar,
		recruitment,
		systemSettings,
		costManagement
	}

})