// import { createRouter, createWebHistory } from "vue-router";
import { createRouter, createWebHashHistory } from "vue-router";

// 配置路由
const routes = [
  {
    path: '/',
    redirect: '/login' // 重定向到登录页面
  },
  {
    path: '/login',
    name: 'UserLogin',
    meta: { title: '用户登录' },
    component: () => import("../views/UserLogin.vue")
  },
  {
    path: '/member',
    name: 'ScienceHome',
    meta: { title: '科研主页' },
    redirect: '/member/project/apply',
    component: () => import("../views/MemberHome.vue"),
  },
  // --------- 项目管理
  {
    path: '/member/project',
    component: () => import("../views/MemberHome.vue"),
    children: [
      {
        path: 'apply', // 子路由
        name: 'ProjectApply',
        meta : { title: '项目申请' },
        component: () => import("../components/project/ProjectApply.vue")
      }
    ]
  },
  // 我的项目 - 项目详情 
  {
    path: '/member/project/my',
    component: () => import("../views/MemberHome.vue"),
    children: [
      {
        path: 'detail/:id', // 子路由
        name: 'ProjectDetail',
        meta : { title: '项目详情' },
        component: () => import("../components/project/ProjectDetails.vue")
      }
    ],
  },
  // ------------------ 任务管理
  {
    path: '/member/tasks',
    component: () => import("../views/MemberHome.vue"),
    children: [
      {
        path: 'task', // 子路由
        name: 'Task',
        meta : { title: '任务管理' },
        component: () => import("../components/task/ProjectTask.vue")
      }
    ],
  },
  // ---------------- 经费管理
  {
    path: '/member/funds',
    component: () => import("../views/MemberHome.vue"),
    children: [
      {
        path: 'reimburse', // 子路由
        name: 'FundsReimburse',
        meta : { title: '经费管理' },
        component: () => import("../components/fund/FundsReimburse.vue")
      }
    ],
  },
  // -----------------  成果管理
  {
    path: '/member/achieve',
    component: () => import("../views/MemberHome.vue"),
    children: [
      {
        path: 'result', // 子路由
        name: 'AchieveResult',
        meta : { title: '成果管理' },
        component: () => import("../components/achieve/AchieveManagement")
      }
    ],
  },
  // ---------------- 个人信息
  {
    path: '/member/user',
    component: () => import("../views/MemberHome.vue"),
    children: [
      {
        path: 'info', // 子路由
        name: 'UserInfo',
        meta: { title: '个人信息' },
        component: () => import("../components/user/UserInfo.vue")
      }
    ],
  },


  // ------------- 项目负责人
  {
    path: '/director',
    name: 'DirectorHome',
    meta: { title: '项目负责人主页' },
    redirect: '/director/project/apply',
    component: () => import("../views/DirectorHome.vue"),
  },
  // --------- 项目管理
  {
    path: '/director/project',
    component: () => import("../views/DirectorHome.vue"),
    children: [
      {
        path: 'apply', // 子路由
        name: 'DirectorProjectApply',
        meta: { title: '项目申请' },
        component: () => import("../components/project/ProjectApply2.vue")
      }
    ],
  },
  // 我的项目 - 项目详情 
  {
    path: '/director/project/my',
    component: () => import("../views/DirectorHome.vue"),
    children: [
      {
        path: 'detail/:id', // 子路由
        name: 'directorProjectMyDetailId',
        meta: { title: '项目详情' },
        component: () => import("../components/project/ProjectDetails.vue")
      }
    ],
  },
  // ------------------ 任务管理
  {
    path: '/director/tasks',
    component: () => import("../views/DirectorHome.vue"),
    children: [
      {
        path: 'task', // 子路由
        name: 'director/tasks/task',
        meta: { title: '任务管理' },
        component: () => import("../components/task/ProjectTask2.vue")
      }
    ],
  },
  // ---------------- 经费管理
  {
    path: '/director/funds',
    component: () => import("../views/DirectorHome.vue"),
    children: [
      {
        path: 'reimburse', // 子路由
        name: 'director/funds/reimburse',
        meta: { title: '经费管理' },
        component: () => import("../components/fund/FundsReimburse2.vue")
      }
    ],
  },
  // -----------------  成果管理
  {
    path: '/director/achieve',
    component: () => import("../views/DirectorHome.vue"),
    children: [
      {
        path: 'result', // 子路由
        name: 'DirectorAchieveResult',
        meta: { title: '成果管理' },
        component: () => import("../components/achieve/AchieveManagement2")
      }
    ],
  },
  // ---------------- 个人信息
  {
    path: '/director/user',
    component: () => import("../views/DirectorHome.vue"),
    children: [
      {
        path: 'info', // 子路由
        name: 'DirectorUserInfo',
        meta: { title: '个人信息' },
        component: () => import("../components/user/UserInfo.vue")
      }
    ],
  },


  // ----------------- 管理员
  {
    path: '/admin',
    name: 'AdminHome',
    meta: { title: '管理员主页' },
    redirect: '/admin/project/apply',
    component: () => import("../views/AdminHome.vue"),
  },
  // --------- 项目管理
  {
    path: '/admin/project',
    component: () => import("../views/AdminHome.vue"),
    children: [
      {
        path: 'apply', // 子路由
        name: 'AdminProjectApply',
        component: () => import("../components/project/ProjectApply3.vue")
      }
    ],
  },
  // 我的项目 - 项目详情 
  {
    path: '/admin/project/my',
    component: () => import("../views/AdminHome.vue"),
    children: [
      {
        path: 'detail/:id', // 子路由
        name: 'adminProjectMyDetailId',
        component: () => import("../components/project/ProjectDetails.vue")
      }
    ],
  },
  // ---------------- 经费管理
  {
    path: '/admin/funds',
    component: () => import("../views/AdminHome.vue"),
    children: [
      {
        path: 'reimburse', // 子路由
        name: 'adminFundsReimburse',
        // component: () => import("../components/fund/FundsReimburse3.vue")
        component: () => import("../components/fund/FundsApprovedList.vue")
      }
    ],
  },
  // -----------------  成果管理
  {
    path: '/admin/achieve',
    component: () => import("../views/AdminHome.vue"),
    children: [
      {
        path: 'result', // 子路由
        name: 'AdminAchieveResult',
        // component: () => import("../components/achieve/AchieveManagement3")
        component: () => import("../components/achieve/AchieveApprovedList.vue")
      }
    ],
  },
  // ---------------- 个人信息
  {
    path: '/admin/user',
    component: () => import("../views/AdminHome.vue"),
    children: [
      {
        path: 'info', // 子路由
        name: 'AdminrUserInfo',
        component: () => import("../components/user/UserInfo.vue")
      },
      {
        path: 'grant', // 子路由
        name: 'AdminrUserGrant',
        component: () => import("../components/user/UserGrant.vue")
      }
    ],
  }
];

// 创建路由实例
const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes: routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const now = new Date();
  const t = JSON.parse(sessionStorage.getItem("tokenTimeout"))
  let diffInDays = Math.floor((now - t))
  // token 失效跳转到登录界面
  if (to.name !== 'UserLogin' && 
        (!JSON.parse(sessionStorage.getItem("satoken")) ||
        (diffInDays > 0))) {
    sessionStorage.removeItem("satoken"); // 清除token
    sessionStorage.removeItem("tokenTimeout");
    next({ name: 'UserLogin' });
  } else {
    next();
  }
});

// 以router暴露出去
export default router