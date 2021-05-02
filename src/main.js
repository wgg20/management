import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './assets/css/base.css';
import ElementUI from 'element-ui'; // 导入 elementUI
import 'element-ui/lib/theme-chalk/index.css'; // 导入 css
import './assets/fonts/iconfont.css'; //导入字符图标文件

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  ElementUI,
  render: (h) => h(App),
}).$mount('#app');
