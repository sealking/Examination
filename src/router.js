import Vue from 'vue'
import Router from 'vue-router'
//import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/boot',
      name: 'boot',
      component: () => import('./components/vue-boot.vue'),
      meta: {
        // 底部是否显示
        showFooter: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./components/vue-login.vue'),
      meta: {
        // 底部是否显示
        showFooter: false
      }
    },
    {
      path: '/',
      name: 'index',
      component: () => import('./components/vue-index.vue'),
      meta: {
        // 底部是否显示
        showFooter: true
      }
    },
    {
      path: '/myPage',
      name: 'myPage',
      component: () => import('./components/vue-myPage.vue'),
      meta: {
        // 底部是否显示
        showFooter: true
      }
    },
    {
      path: '/offline',
      name: 'offline',
      component: () => import('./components/vue-offline.vue'),
      meta: {
        // 底部是否显示
        showFooter: false
      }
    },
    {
      path: '/examConfirm',
      name: 'examConfirm',
      component: () => import('./components/vue-examConfirm.vue'),
      meta: {
        // 底部是否显示
        showFooter: false
      }
    },
    {
      path: '/examIndex',
      name: 'examIndex',
      component: () => import('./components/vue-examIndex.vue'),
      meta: {
        // 底部是否显示
        showFooter: false
      }
    },
    {
      path: '/mockQuestionSelect',
      name: 'mockQuestionSelect',
      component: () => import('./components/vue-mockQuestionSelect.vue'),
      meta: {
        // 底部是否显示
        showFooter: false
      }
    },
    {
      path: '/scoreConfirm',
      name: 'scoreConfirm',
      component: () => import('./components/vue-scoreConfirm.vue'),
      meta: {
        // 底部是否显示
        showFooter: false
      }
    },
    {
      path: '/fileDownload',
      name: 'fileDownload',
      component: () => import('./components/vue-fileDownload.vue'),
      meta: {
        // 底部是否显示
        showFooter: false
      }
    }
  ]
})
