const headTabBar = {
        state:{
                states: {}
        },
        actions: {		
                states({commit},params) {
                        commit('states',params)
                }
        },

        mutations: {
                states(state,params) {
                        state.states = params
                }
        }
}
export default headTabBar