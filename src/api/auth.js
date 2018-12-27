import Vue from 'vue'
import params from '../configs/parameter'

export default {
  login (username, password) {
    return Vue.http.post(`${params.apiBaseUrl}/v1/client/login`, {
      username,
      password,
      source: 'web'
    })
  },
  getUserInfo () {
    return Vue.http.get(`${params.apiBaseUrl}/v1/web/my/info`)
  },
  getQrcodeLoginConfig () {
    return Vue.http.get(`${params.apiBaseUrl}/qrlogin/config`)
  }
}
