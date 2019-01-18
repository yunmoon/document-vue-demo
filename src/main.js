import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'

// import 'element-ui/lib/theme-chalk/index.css'
import {
  Table,
  TableColumn,
  Pagination,
  Button,
  Upload,
  Card,
  Form,
  FormItem,
  Input,
  Notification,
  Row,
  Col,
  Message,
  MessageBox,
  RadioGroup,
  RadioButton
} from 'element-ui'

import store from './store/index'
const axiosInstance = axios.create()
Vue.http = axiosInstance
Vue.prototype.$http = axiosInstance

Vue.config.productionTip = false
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Button)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$confirm = MessageBox.confirm
router.beforeEach((to, from, next) => {
  const token = store.state.user.token
  const userInfo = store.state.user.user
  const whiteList = ['Login', 'documentEditor', 'oauth']
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    if (!userInfo) {
      store.dispatch('user/getUserInfo').then(() => {
        next()
      }).catch(error => {
        Notification.error({
          title: '提示',
          message: error.message
        })
      })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.name) === -1) {
      next({ path: '/login' })
    } else {
      next()
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
