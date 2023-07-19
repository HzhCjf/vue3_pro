import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import { ElMessage } from 'element-plus'
import { staticRoutes, allAsyncRoutes } from '@/router/routes'
import { login, getUserInfo } from '@/api/user'
import router from '@/router/index'
import type { RouteRecordRaw } from 'vue-router';
import _ from 'lodash';


function filtratrAllSyncRoutes(routes: RouteRecordRaw[], userRoutes: string[]): RouteRecordRaw[] {
    const newRoures: RouteRecordRaw[] = []
    routes.forEach((r) => {
        if (userRoutes.includes(r.name as string)) {
            if (r.children && r.children.length > 0) {
                r.children = filtratrAllSyncRoutes(r.children, userRoutes)
            }
            newRoures.push(r)
        }
    })
    return newRoures;
}

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

    // user 仓库中存放的数据
    state: (): UserInfoState => ({
        // 登录成功后的用户 token
        token: getToken() as string,
        // 登录成功后的用户名
        name: '',
        // 登录成功后的用户头像
        avatar: '',
        // 登录成功后的用户角色列表
        roles: [],
        // 登录成功后的用户菜单,路由列表
        routes: [],
        // 登录成功后的用户按钮(页面功能)列表
        buttons: [],
        // 不同角色的用户将要显示的管理菜单
        menuRoutes: []
    }),

    actions: {
        // 用户登录
        async login(username: string, password: string) {
            // return new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         if (username === 'admin' && password === '111111') {
            //             const token = 'token-atguigu'
            //             setToken(token)
            //             this.token = token
            //             resolve(token)
            //         } else {
            //             // 给程序使用
            //             reject(new Error('用户名或密码错误!'))
            //             // 提示用户看的
            //             ElMessage.error('用户名或密码错误!')
            //         }
            //     }, 1000)
            // })

            try {
                const res = await login(username, password);
                // console.log(res);
                // 把用户登录成功后的 token 保存到 localStorage 中（持久化）
                setToken(res.token);
                // 存储 token 到 pinia
                this.token = res.token;
            } catch (e) {
                ElMessage.error('用户名或密码错误!');
                throw new Error('用户名或密码错误!');
            }
        },

        async getInfo() {
            // return new Promise((resolve, reject) => {
            // setTimeout(() => {
            //     this.name = 'admin'
            //     this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
            //     this.menuRoutes = staticRoutes
            //     resolve({name: this.name, avatar: this.avatar, token: this.token})
            // }, 1000)
            // })

            try {
                const res = await getUserInfo();
                // 把获取到用户名称和头像保存到pinia
                this.name = res.name;
                this.avatar = res.avatar;
                this.roles = res.roles;
                this.routes = res.routes
                this.buttons = res.buttons
                // - 问题一：过滤得到的菜单数据不正确
                // - 解决：不要直接传递allAsyncRoutes
                const userRoutes = filtratrAllSyncRoutes(_.cloneDeep(allAsyncRoutes), this.routes)
                // - 问题二：重复菜单
                // - 解决：每次新的菜单永远都是 = 静态菜单（而不是上一次的菜单） + 过滤后的菜单
                this.menuRoutes = [...staticRoutes, ...userRoutes]

                userRoutes.forEach((r) => router.addRoute(r))
            } catch (e) {
                throw new Error('出错了');
            }

        },
                                                                                                                                                                                          
        reset() {
            // 删除local中保存的token
            removeToken()
            // 提交重置用户信息的mutation
            this.token = ''
            this.name = ''
            this.avatar = ''
            //问题三：最新一次登录的用户可以访问之前登录用户的所有注册路由
            //- 解决：每次用户退出从路由表中移除动态路由
            allAsyncRoutes.forEach((r) => {
                const isEixt = router.hasRoute(r.name as string)
                router.removeRoute(r.name as string)
            })
        },
    },
});
