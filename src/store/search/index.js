//search下仓库
import {reqSearchList} from "@/api";

const state = {
    //存储搜索模块的数据
    searchList: {},
}
const mutations = {
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList
    }
}
const actions = {
    //获取搜索页面的数据
    async getSearchList({commit}, data) {
        let result = await reqSearchList(data)
        if (result.code === 200) {
            commit('GETSEARCHLIST', result.data)
        }
    }
}
//计算属性
//项目当中getters主要组件是：简化仓库中的数据（简化数组而生）
//可以把我们将来在组件当中需要的数据简化一下【将来组件获取数据的时候就方便了】
const getters = {
    //搜索模块【商品展示的数据】
    //state：它是当前小仓库（search）的st
//当前形参state：当前仓库中的state，并非大仓库的state
    goodsList(state) {
        return state.searchList.goodsList
    },
    //平台属性
    attrsList(state) {
        return state.searchList.attrsList
    },
    //品牌数据
    trademarkList(state) {
        return state.searchList.trademarkList
    }
}
//创建并暴露store
export default ({
    namespaced: true,
    state, actions, mutations, getters
})