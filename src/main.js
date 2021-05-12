import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/base.css';
import ElementUI from 'element-ui'; // 导入 elementUI
import 'element-ui/lib/theme-chalk/index.css'; // 导入 css
import './assets/fonts/iconfont.css'; //导入字符图标文件
import axios from 'axios'; //引入axios
import zkTable from 'vue-table-with-tree-grid';

Vue.component('zk-table', zkTable);
Vue.use(ElementUI);
//给element-ui的message组件增加一个原型
// Vue.prototype.$message = ElementUI.Message;
//给element-ui的confirm组件增加一个原型
// Vue.prototype.$confirm = ElementUI.MessageBox;
//配置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//将axios挂载到vue原型中
Vue.prototype.$http = axios;
//请求数据
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});

Vue.config.productionTip = false;

new Vue({
  router,
  ElementUI,
  render: (h) => h(App),
}).$mount('#app');
