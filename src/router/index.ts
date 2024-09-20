import {
  createRouter,
  createWebHistory,
  RouteRecordRaw
} from 'vue-router'
import { GET_TOKEN } from '../utils/token'


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  // 登录
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/index.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../layout/index.vue'),
    redirect: 'list',
    children: [
      {
        path: '/list',
        name: 'userList',
        component: () => import('../views/user/userList.vue'),
        children: [
          // 视频通话
          {
            path: 'chat',
            name: 'chat',
            component: () => import('../views/chat/chat.vue'),
          },
        ]
      },
      {
        path: '/userAdd',
        name: 'userAdd',
        component: () => import('../views/user/userAdd.vue'),
        children: [
          {
            path: '/add',
            name: "add",
            component: () => import("../views/user/add.vue"),
          },
        ]
      }
    ]
  },

]

const router = createRouter({
  // 路由的history模式，共有三种模式，
  // createWebHistory、createWebHashHistory、createMemoryHistory
  history: createWebHistory(),
  // 路由配置
  routes,
  // 是否严格匹配路由
  strict: true,
  // 路由跳转完成后，页面滚动行为
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach((to, from, next) => {
  let token = GET_TOKEN()
  if (to.name != 'Login') {
    if (!token) {
      next({
        name: 'Login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router