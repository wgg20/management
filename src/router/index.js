import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Login = () => import('../components/Login.vue');

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
];

const router = new Router({
  routes,
  mode: 'history',
});

export default router;
