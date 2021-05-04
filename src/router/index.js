import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Login = () => import('../components/Login.vue');
const Home = () => import('../components/Home.vue');

//重写push方法，不然报错
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((error) => error);
};

const routes = [
  {
    path: '',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
  },
];

const router = new Router({
  routes,
  mode: 'history',
});
//挂载路由导航守卫 ·
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //  next()放行 next('/login')强制跳转
  //用户如果要访问的是登录页，则直接放行
  if (to.path === '/login') return next();
  //但是如果用户访问的不是登录页面则先获取token值
  const tokenStr = window.sessionStorage.getItem('token');
  //如果没有获取到token值，说明还没有登录，会强制回到登录页
  if (!tokenStr) return next('/login');
  //如果有token值则直接放行去访问其他页面
  next();
});
export default router;
