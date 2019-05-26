const recruitment = {
	state:{
        decomposition: false,
        props: {},
        positionDetails: false,
        //
        personalInformation: false,
        //
        switchBtnCheck: false
	},
	actions: {		
        decomposition({commit},params) {
            commit('decomposition',params)
        },
        positionDetails({commit},params) {
            commit('positionDetails',params)
        },
        personalInformation({commit},params) {
            commit('personalInformation',params)
        },
        changeConditions({commit},params) {
            commit('changeConditions',params)
        },
	},

	mutations: {
        decomposition(state,params) {
            state.decomposition = !state.decomposition
            if (params) {
                state.props = params
            } else {
                state.props = {}
            }
        },
        positionDetails(state,params) {
            state.positionDetails = !state.positionDetails
            if (params) {
                state.props = params
            } else {
                state.props = {}
            }
        },
        personalInformation(state,params) {
            state.personalInformation = !state.personalInformation
            if (params) {
                state.props = params
            } else {
                state.props = {}
            }
        },
        changeConditions(state,params) {
            state.switchBtnCheck = params.switchBtnCheck
        },
        
       
	}
}
export default recruitment