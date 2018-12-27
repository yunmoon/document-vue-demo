import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/documents'
    },
    {
      path: '/login',
      name: 'Login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/Login')
    },
    {
      path: '/documents',
      name: 'documentList',
      component: () => import('@/views/Document')
    },
    {
      path: '/document/editor/:fileId',
      name: 'documentEditor',
      component: () => import('@/views/DocumentEditor')
    }
  ]
})
