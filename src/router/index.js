import { h } from 'vue';
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
  RouterView,
} from 'vue-router';
import DanmuList from '@/module/danmu/views/danmu-list';
import Login from '@/views/login';

export const routes = [
  {
    path: '/',
    name: 'home',
    component: {
      render() {
        return h(RouterView);
      },
    },
  },
  {
    path: '/danmu',
    name: 'danmu',
    component: DanmuList,
  },

  {
    path: '/login',
    name: 'user.login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'user.logout',
    component: Login,
  },
];

const router = createRouter({
  history: process.env.NODE_ENV === 'production'
    ? createWebHistory()
    : createWebHashHistory(),
  scrollBehavior(to) {
    if (to.hash && !/^#/.test(to.hash)) {
      return { selector: to.hash };
    }
    return { top: 0 };
  },
  routes,
  linkActiveClass: 'active',
});

export default router;
