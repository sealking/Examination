import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axiosApi from '@/api/axios.js'
import Mint from 'mint-ui';
import "mint-ui/lib/style.css";
import Mui from 'vue-awesome-mui';
// import "vue-awesome-mui/mui/dist/css/mui.css";



Vue.config.devtools = true

Vue.use(axiosApi);
Vue.use(Mint);
Vue.use(Mui);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
