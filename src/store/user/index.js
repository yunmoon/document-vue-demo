import storage from 'good-storage'
import authApi from '@/api/auth'
const state = {
  user: storage.get('userInfo'),
  token: storage.get('token')
}

const getters = {
  user (state) {
    return state.user
  },
  token (state) {
    return state.token
  }
}

const actions = {
  doLogin ({ commit }, { username, password }) {
    return new Promise((resolve, reject) => {
      authApi.login(username, password).then(response => {
        commit('setToken', response.data.access_token)
        resolve()
      }).catch(error => {
        if (error.response) {
          reject(new Error(error.response.data.message))
        } else {
          reject(new Error('登录失败'))
        }
      })
    })
  },
  getUserInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      authApi.getUserInfo().then(response => {
        commit('setUser', response.data.data)
        resolve()
      }).catch(error => {
        if (error.response) {
          reject(new Error(error.response.data.message))
        } else {
          reject(new Error('获取用户信息失败'))
        }
      })
    })
  }
}

const mutations = {
  setUser (state, user) {
    state.user = user
    storage.set('userInfo', user)
  },
  setToken (state, token) {
    state.token = token
    storage.set('token', token)
  },
  loginOut (state) {
    state.user = null
    storage.remove('userInfo')
    state.token = null
    storage.remove('token')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
