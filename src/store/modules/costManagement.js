const costManagement = {
	state:{
        costDetail: false,
        props: {},
        fieldSet: false,
        approvals: false,
        approvals1: false,
        approvalsType: '',
        adjustAttendance: false,
        adjustObj: {},
        rewards: false,
        rewardsObj: {},
        visibleCheck: false,
        visibleCheckObj: {},
        costRewards1: false,
        panelType: {},
        adjustAttendance1: false,

	},
	actions: {		
        costDetail({commit},params) {
            commit('costDetail',params)
        },
        fieldSet({commit},params) {
            commit('fieldSet',params)
        },
        costApprovals({commit},params) {
            commit('approvals',params)
        },
        costApprovals1({commit},params) {
            commit('costApprovals1',params)
        },
        adjustAttendance({commit},params) {
            commit('adjustAttendance',params)
        },
        costRewards({commit},params) {
            commit('costRewards',params)
        },
        visibleCheck({commit},params) {
            commit('visibleCheck',params)
        },
        costRewards1({commit},params) {
            commit('costRewards1',params)
        },
        adjustAttendance1({commit},params) {
            commit('adjustAttendance1',params)
        },
        
	},

	mutations: {
        adjustAttendance1(state,params) {
            state.adjustAttendance1 = !state.adjustAttendance1
            if(params) {
                state.panelType = params
            }
        },
        costRewards1(state,params) {
            state.costRewards1 = !state.costRewards1
            if(params) {
                state.panelType = params
            }
        },
        visibleCheck(state,params) {
            state.visibleCheck = !state.visibleCheck
            if(params) {
                state.visibleCheckObj = params
            }else{
                state.visibleCheckObj = {}
            }
        },
        costRewards(state,params) {
            state.rewards = !state.rewards
            if(params) {
                state.panelType = params
            }
        },
        adjustAttendance(state,params) {
            state.adjustAttendance = !state.adjustAttendance
            
            if(params) {
                state.panelType = params
            }
        },
        costApprovals1(state,params) {
            state.approvals1 = !state.approvals1
            if(params) {
                state.approvalsType = params.approvalsType
            }
            
        },
        approvals(state,params) {
            state.approvals = !state.approvals
            if(params) {
                state.approvalsType = params.approvalsType
            }
            
        },
        fieldSet(state,params) {
            state.fieldSet = !state.fieldSet
        },
        costDetail(state,params) {
            state.costDetail = !state.costDetail
            if (params) {
                state.props = params
            } else {
                state.props = {}
            }
        },
	}
}
export default costManagement