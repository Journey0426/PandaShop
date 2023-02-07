//商品详情仓库
import {reqAddOrUpdateShopCart, reqDetailList} from "@/api";
import {getUUID} from "@/utils/useruuid";

const state={
    //程序运行起来的时候，仓库已经有了，用户临时身份存储到vuex
    UserUid:getUUID(),
    DetailList:{},
};
const mutations={
    GETDETAILLIST(state,DetailList){
        state.DetailList=DetailList
    }
};
const actions={
    async getDetailList({commit},skuid){
        //用户派发action时传一个id
        let result=await reqDetailList(skuid)
        if (result.code===200){
            //result.data传的时接口中的数据
            commit('GETDETAILLIST',result.data)

        }

    },
    //加入购物车产品||或者更新某一个产品的个数接口
   async addShopCart({commit},{skuId,skuNum}){
        let result=await reqAddOrUpdateShopCart(skuId,skuNum)
       //加入购物车成功
       if (result.code===200){
           //代表当前函数addShopCart返回的promise状态是成功 返回一个字符串代表为true
           return 'ok'
       }else {
           return Promise.reject(new Error('faile'))
       }
       //一个函数执行，默认返回的是undefined，代表promise成功，
       //函数执行默认返回的是undefined，永远是成功，什么时候undefined不起作用了
    }
};
const getters={
    categoryView(state){
        //imageList:detail父组件给子组件放大镜传递的图片的数据
        //如果skuInfo是一个空对象，skuInfo.skuImageList等于的是undefined，不能给子组件
        //至少给子组件一个空的数组
        return state.DetailList.categoryView||{}
    },
    skuInfo(state){
        return state.DetailList.skuInfo||{}
    },
    spuSaleAttrList(state) {
        return state.DetailList.spuSaleAttrList || []
    },

}
export default ({
    namespaced:true,
    state,mutations,actions,getters
})