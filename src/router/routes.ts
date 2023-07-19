import type { RouteRecordRaw } from "vue-router";
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true,
    },
  },

  {
    path: "/404",
    name: "404",
    component: () => import("@/views/error/404.vue"),
    meta: {
      hidden: true,
    },
  },

  {
    path: "/",
    component: () => import("@/layout/index.vue"),
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: {
          title: "首页",
          icon: "ele-HomeFilled",
        },
      },
    ],
  },

  /* 匹配任意的路由 必须最后注册 */
  // {
  //   // /detail/:id(\\d+)
  //   path: "/:pathMatch(.*)",
  //   name: "Any",
  //   redirect: "/404",
  //   meta: {
  //     hidden: true,
  //   },
  // },
];

/**
 * 定义动态路由
 */
export const allAsyncRoutes: Array<RouteRecordRaw> = [
  {
    path: "/acl",
    name: "Acl",
    component: () => import("@/layout/index.vue"),
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "ele-Setting",
    },
    children: [
      {
        name: "User",
        path: "/acl/user/list",
        component: () => import("@/views/acl/user/index.vue"),
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "Role",
        path: "/acl/role/list",
        component: () => import("@/views/acl/role/index.vue"),
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "RoleAuth",
        path: "/acl/role/auth",
        component: () => import("@/views/acl/role/roleAuth.vue"),
        meta: {
          title: "角色管理",
          hidden: true,
          activeMenu: "/acl/role/list",
        },
      },
      {
        name: "Permission",
        path: "/acl/permission/list",
        component: () => import("@/views/acl/permission/index.vue"),
        meta: {
          title: "菜单管理",
        },
      },
    ],
  },
  {
    path: "/product",
    component: () => import("@/layout/index.vue"),
    // redirect: '/product/trademark/index.vue',
    name: "Product",
    meta: {
      title: "商品管理",
      icon: "ele-GoodsFilled",
    },
    children: [
      {
        path: "trademark/list",
        name: "Trademark",
        component: () => import("@/views/product/trademark/index.vue"),
        meta: {
          title: "品牌管理",
        },
      },
      {
        path: "attr/list",
        name: "Attr",
        component: () => import("@/views/product/attr/index.vue"),
        meta: {
          title: "平台属性管理",
        },
      },
      {
        path: "sku/list",
        name: "Sku",
        component: () => import("@/views/product/sku/index.vue"),
        meta: {
          title: "SKU管理",
        },
      },
      {
        path: "spu/list",
        name: "Spu",
        component: () => import("@/views/product/spu/index.vue"),
        meta: {
          title: "SPU管理",
        },
      },
    ],
  },
  {
    path: "/scoped",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "/scoped",
        name: "Scoped",
        component: () => import("@/views/scoped/index.vue"),
        meta: {
          title: "Scoped原理",
        },
      },
    ],
  },
];
