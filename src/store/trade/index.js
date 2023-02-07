import {reqAddressInfo,reqShopCartInfo,reqaddress} from "@/api";
const state={
    address:[],
    //商品信息
    orderinfo:{}
};
const mutations = {
    USERADDRESS(state,address){
        state.address=address
    },
    GTESHOPCART(state,orderinfo){
        state.orderinfo=orderinfo
    }
};
const actions = {
    async getUseraddress({commit}){
        let result=await reqaddress()
        if (result.code===200) {
            commit('USERADDRESS',result.data)
        }
    },
    //用户清单
   async getShopcart({commit}){
        let result=await  reqShopCartInfo()
       if (result.code===200){
           commit('GTESHOPCART',result.data)
       }
    }
};
const getters = {
    orderinfo(state){
        return state.orderinfo||{}
    }

}
export default ({
    namespaced:true,
    state, mutations, actions, getters
})