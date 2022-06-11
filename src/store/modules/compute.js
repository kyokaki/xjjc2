
const state = {
  keystore: undefined,
  keystorePwd: undefined
}

const mutations = {
  GET_COMPUTE: (state, { key }) => {
    debugger
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      return JSON.parse(state[key])
    }
    return {}
  },
  SET_COMPUTE: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }

}

const actions = {
  setCompute({ commit }, data) {
    commit('SET_COMPUTE', data)
  },
  getCompute({ commit }, data) {
    return commit('GET_COMPUTE', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

