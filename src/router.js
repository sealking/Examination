import Vue from 'vue'
import Router from 'vue-router'
//import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./components/vue-login.vue')
    },
    {
      path: '/',
      name: 'index',
      component: () => import('./components/vue-index.vue')
    },
    {
      path: '/offline',
      name: 'offline',
      component: () => import('./components/vue-offline.vue')
    },
    {
      path: '/examConfirm',
      name: 'examConfirm',
      component: () => import('./components/vue-examConfirm.vue')
    },
    {
      path: '/examIndex',
      name: 'examIndex',
      component: () => import('./components/vue-examIndex.vue')
    },
    {
      path: '/mockQuestionSelect',
      name: 'mockQuestionSelect',
      component: () => import('./components/vue-mockQuestionSelect.vue')
    },
    {
      path: '/scoreConfirm',
      name: 'scoreConfirm',
      component: () => import('./components/vue-scoreConfirm.vue')
    },
    {
      path: '/fileDownload',
      name: 'fileDownload',
      component: () => import('./components/vue-fileDownload.vue')
    }
  ]
})
