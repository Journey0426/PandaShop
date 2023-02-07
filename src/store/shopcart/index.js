//shopcart仓库
import {reqCartList,reqdeleteCart,requpdatecheckCart} from "@/api";
const state={
        shopList:[]
};
const mutations={
    GETCARLIST(state,shopList){
        state.shopList=shopList
    }

};
const actions={
    async getCarlist({commit}){
        let result=await reqCartList();
       if (result.code===200){
           commit('GETCARLIST',result.data)
       }
    },
    //删除
  async deletecart({commit},skuId){
        let result=await reqdeleteCart(skuId);
        if (result.code===200){
            //代表当前函数addShopCart返回的promise状态是成功 返回一个字符串代表为true
            return 'ok'
        }else {
            return Promise.reject(new Error('failed'))
        }
    },
    //获取cheched接口
    async getupdatechecked({commit},{skuId,isChecked}){
        let result=await requpdatecheckCart(skuId,isChecked)
        if (result.code===200){
            return 'ok'
        }else {
            return Promise.reject(new Error('failed'))
        }
    },
    //写全部删除接口
    getAlldelete({dispatch,state}) {
        //函数的参数不只有{commit}还有：
        //{getters: {…}, state: {…}, rootGetters: {…}, dispatch: ƒ, commit: ƒ,…}
        let PromiseAll=[]
       state.shopList[0].cartInfoList.forEach(item=>{
           //如果被选中的产品才删除
           //deletecart这个action需要传个id
        let result=item.isChecked==1?dispatch('deletecart',item.skuId):''
           PromiseAll.push(result)
       })
        return Promise.all(PromiseAll)
    },
    //写全选接口
    getALLchecked({dispatch,state},isChecked){
        let All=[]
        state.shopList[0].cartInfoList.forEach(item=>{
            let promise=  dispatch('getupdatechecked',{skuId:item.skuId,isChecked})
            All.push(promise)
        })
        return Promise.all(All)
    }
};
const getters={
    shopcartDate(){
        return state.shopList[0]||{}
    }

};
export default ({
    namespaced:true,
    state,mutations,actions,getters
})