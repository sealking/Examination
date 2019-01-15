import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI  from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axiosApi from '@/api/axios.js'

Vue.config.devtools = true

Vue.use(ElementUI);
Vue.use(axiosApi);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
