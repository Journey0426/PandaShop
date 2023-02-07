import Vue from "vue";
import Vuex from 'vuex'
//引用vuex
Vue.use(Vuex)
//引入相关模块的小仓库
import home from "@/store/home";
import search from "@/store/search";
import detail from "@/store/detail";
import shopcart from "@/store/shopcart";
import user from "@/store/user";
import trade from "@/store/trade";
//创建并暴露store
export default new Vuex.Store({
    //模块:务必注册，各个小仓库切记别不注册，不注册就和没写没区别了
    modules:{
        home,
        search,
        detail,
        shopcart,
         user,
        trade

    }
})