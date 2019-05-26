import { stat } from "fs";

const systemSettings = {
	state:{
        states: {},
        organizationEdit: false,
        postEdit: false,
        accountEdit: false,
        roleEdit: false,
        processEdit: false,
        processDetail: false,
        companyDetail: false,
        editEquipmentShow: false,
        checkEquipmentShow: false,
        newEquipmentShow: false,
        editPostNameShow: false,
        addPostNameShow: false,
        checkPostNameShow: false,
        parttimeDetail: false,
        addRecruiters: false,
        addContract: false,
        departments:{},
        contractDetail: false,
        userDetail: false,
        roleDetail: false,
    },
    
	actions: {		
        roleDetail({commit},params) {
            commit('roleDetail',params)
        },
        userDetail({commit},params) {
            commit('userDetail',params)
        },
        organizationEdit({commit},params) {
            commit('organizationEdit',params)
        },
        postEdit({commit},params) {
            commit('postEdit',params)
        },
        accountEdit({commit},params) {
            commit('accountEdit',params)
        },
        editEquipment({commit},params) {
            commit('editEquipment',params)
        },
        checkEquipment({commit},params) {
            commit('checkEquipment',params)
        },
        newEquipment({commit},params) {
            commit('newEquipment',params)
        },
        editPostName({commit},params) {
            commit('editPostName',params)
        },
        addPostName({commit},params) {
            commit('addPostName',params)
        },
        checkPostName({commit},params) {
            commit('checkPostName',params)
        },
        roleEdit({commit},params) {
            commit('roleEdit',params)
        },
        processEdit({commit},params) {
            commit('processEdit',params)
        },
        processDetail({commit},params) {
            commit('processDetail',params)
        },
        companyDetail({commit},params) {
            commit('companyDetail',params)
        },
        parttimeDetail({commit},params) {
            commit('parttimeDetail',params)
        },
        addRecruiters({commit},params) {
            commit('addRecruiters',params)
        },
        addContract({commit},params) {
            commit('addContract',params)
        },
        getDepartments({commit},params) {
            commit('getDepartments',params)
        },
        contractDetail({commit},params) {
            commit('contractDetail',params)
        },
        
	},

	mutations: {
        roleDetail(state,params) {
            state.roleDetail = !state.roleDetail
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        userDetail(state,params) {
            state.userDetail = !state.userDetail
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        organizationEdit(state,params) {
            state.organizationEdit = !state.organizationEdit
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        postEdit(state,params) {
            state.postEdit = !state.postEdit
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        accountEdit(state,params) {
            state.accountEdit = !state.accountEdit
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        editEquipment(state,params) {
            state.editEquipmentShow = !state.editEquipmentShow
            if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.states = params
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.states = ''
			}
        },
        checkEquipment(state,params) {
            state.checkEquipmentShow = !state.checkEquipmentShow
            if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.states = params
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.states = ''
			}
        },
        newEquipment(state,params) {
            state.newEquipmentShow = !state.newEquipmentShow
            if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.states = params
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.states = ''
			}
        },
        editPostName(state,params) {
            state.editPostNameShow = !state.editPostNameShow
            if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.states = params
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.states = ''
			}
        },
        addPostName(state,params) {
            state.addPostNameShow = !state.addPostNameShow
            if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.states = params
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.states = ''
			}
        },
        checkPostName(state,params) {
            state.checkPostNameShow = !state.checkPostNameShow
            if (params) {
				state.panelTitle = params.title
				state.id = params.id
				state.type = params.type
				state.operation = params.operation
				state.states = params
			} else {
				state.panelTitle = ''
				state.id = ''
				state.type = ''
				state.operation = ''
				state.states = ''
			}
        },
        roleEdit(state,params) {
            state.roleEdit = !state.roleEdit
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        processEdit(state,params) {
            state.processEdit = !state.processEdit
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        processDetail(state,params) {
            state.processDetail = !state.processDetail
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        companyDetail(state,params) {
            state.companyDetail = !state.companyDetail
            if (params) {
                state.states = params
            }
        },
        parttimeDetail(state,params) {
            state.parttimeDetail = !state.parttimeDetail
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        addRecruiters(state,params) {
            state.addRecruiters = !state.addRecruiters
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        addContract(state,params) {
            state.addContract = !state.addContract
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
        getDepartments(state,params) {
            if (params) {
                state.departments = params
            } else {
                state.departments = ''
            }
        },
        contractDetail(state,params) {
            state.contractDetail = !state.contractDetail
            if (params) {
                state.states = params
            } else {
                state.states = ''
            }
        },
	}
}
export default systemSettings