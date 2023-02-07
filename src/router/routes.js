export default [
    {
        path: '/center',
        //这种写法称为路由的懒加载 用户访问的时候才引入组件
        component: () => import("../pages/Center"),
        children:[{
            path:'myorder',
            component:()=>import("../pages/Center/MyOrder"),
            meta: {show: true}
        },{
            path:'teamorder',
            component:()=>import("../pages/Center/TeamOrder"),
            meta: {show: true}
        },
            {
                path: "/center",
                redirect:"/center/myorder"
            }
        ],
        meta: {show: true},
    },
    {
        path: '/paysuccess',
        component: () => import("../pages/PaySuccess"),
        meta: {show: true}
    },
    {
        path: "/pay",
        component: () => import("../pages/Pay"),
        meta: {show: true},
        //路由独享守卫
        beforeEnter: (to, from, next) => {
            //进入支付页面，必须从交易页面而来
            if (from.path == '/trade') {
                next();
            } else {
                next(false);
            }
        }
    },
    {
        path: "/trade",
        component: () => import('../pages/Trade'),
        meta: {show: true},
        //路由独享守卫
       beforeEnter: (to, from,next) => {
            if (from.path=='/shopcart'){
                    next()
            }else {
                //哪里来的回哪里去
                next(false)
            }
       }
    },
    {
        path: "/shopcart",
        component: () => import('../pages/ShopCart'),
        meta: {show: true}
    },
    {
        path: '/addcartsuccess',
        component: () => import('../pages/AddCartSuccess'),
        name: 'addcartsuccess',
        meta: {show: true}
    },
    {
        path: '/detail/:skuid',
        component: () => import('../pages/Detail'),
        //true则显示footer
        meta: {show: true},

    }, {
        path: '/home',
        component: () => import('../pages/Home'),
        meta: {show: true}
    },
    {
        path: '/login',
        component: () => import('../pages/Login'),
        meta: {show: false}

    },
    {
        path: "/register",
        component: () => import('../pages/Register'),
        meta: {show: false}
    },
    {
        name: 'search',
        path: '/search/:keyword?',
        component: () => import('../pages/Search'),
        meta: {show: true}
    },
    // 重定向
    {
        path: '/',
        redirect: '/home'
    }
]