//引入Vue
import Vue from "vue";
import VueRouter from 'vue-router'
import store from "@/store";
//使用插件
Vue.use(VueRouter);
//备份VueRouter.prototype原有的push|replace方法
const originPush = VueRouter.prototype.push;
const originPlace = VueRouter.prototype.replace;
//重写VueRouter.prototype的push方法
VueRouter.prototype.push = function (location, resolve, reject) {//跳转到的路由 成功 失败
    //函数对象的apply与call的区别?
    //相同点:都可以改变函数的上下文一次，而且函数会立即执行一次
    //不同：函数执行的时候，传递参数不同，apply需要的是数组，call传递参数的时候用逗号隔开
    //原始的push方法可以进行路由跳转，但是需要保证上下文this是VueRouter类的实例
    //第一种情况：外部在使用push的时候传递成功与失败的回调
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)//call的第一个参数为函数的this
    } else {
        originPush.call(this, location, () => {
        }, () => {
        })
    }
}
//重写VueRouter.prototype的replace方法
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originPlace.call(this, location, resolve, reject)
    } else {
        originPlace.call(this, location, () => {
        }, () => {
        })
    }
}
//引入路由组件
import routes from "@/router/routes";
import user from "@/store/user";

//创建并暴露一个路由器
const router = new VueRouter({
    routes,
    //滚动行为的设置
    scrollBehavior(to, from, savedPosition) {
        return {y: 0}
    }
})

//全局守卫使用:全局守卫它router【VueRouter类的一个实例】的一个方法
//全局守卫【前置守卫:在路由跳转之前会执行一次】
router.beforeEach(async (to, from, next) => {
    //to:要去哪里【路由信息】
    //from:从哪里来【路由信息】
    //next:是一个函数，放行函数
    //1:next()执行不传递参数【放行：该去哪里去哪里】 2:next(path):放行，放行到准确的某一个路由当中
    //获取仓库中的token,因为如果用户登录了，仓库中一定是有token，用户没有登录，没有token
    let token = store.state.user.token
    let name = store.state.user.userInfo.name
    if (token) {
        //用户登陆了有token，且想去登录页的分支 跳转到首页或者不跳转/
        if (to.path == '/path') {
            next('/home')
        } else {
            //如果去的不是登录页 解决用户信息刷新后消失的问题
            if (name) {
                //如果有用户信息就放行
                next()
            } else {
                //获取用户信息在首页进行展示
                try {
                    //代表用户登录了，但是没有用户信息，发请求让仓库存储用户信息，在进行路由跳转
                    await store.dispatch('user/getuserinfo')
                    //该去哪里去哪里
                    next()

                } catch (err) {
                    //token失效了获取不到用户信息就重新登录
                    await store.dispatch('user/getLogout')
                    next('/login')

                }

            }
        }
    } else {
        //未登录的判断
        //如果用户未登录：去交易页面trade、去支付页面pay、支付成功页面paysuccess、个人中心 center/myorder  center/grouporder
        //用户未登录应该去登录页
        //获取用户未登录想去的路由的路径
        let topath = to.path
        if (topath.indexOf('trade') != -1 || topath.indexOf('pay') != -1 || topath.indexOf('center') != -1 || topath.indexOf('shopcart') != -1) {
            //判断未登录：去trade、去支付、去支付成功、去个人中心【我的订单、团购订单】
            //跳转到登录页如果点击的是以上这些地方就先跳转到登录页在去那个地方
            next('/login?redirect=' + topath)
        } else {
            //去的并非上面这些路由,放行
            next();
        }
    }
})
export default router


