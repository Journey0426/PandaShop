//home下的小仓库
import {reqCategoryList,reqGetBannerList,reqGetFloorList} from "@/api";
const state = {
    //state返回对象写对象返回数组写数组
    //三级联动列表数据
    categoryList:[],
    //轮播图数据
    bannerList:[],
    //floor轮播图数据
    floorList:[],
}
const mutations = {
    GETCATEGORY(state,categoryList){
        state.categoryList=categoryList
    },
    GETBANNERLIST(state,bannerList){
        state.bannerList=bannerList
    },
    GETFLOORLIST(state,floorList){
        state.floorList=floorList
    }
}
const actions={
    //因为涉及到服务器 所以通过API里面的接口函数调用
   async categoryList({commit}){

        let result=await reqCategoryList()
       if (result.code===200){
           commit('GETCATEGORY',result.data)
       }

    },
    //mock接口
    //获取首页banner的数据【轮播图】
    async getBannerList({commit}){
      let result=await reqGetBannerList()//查看reqGetBannerList有什么
        if (result.code===200){//如果获取数据成功
            commit('GETBANNERLIST',result.data)
        }
    },
    //getFloorList接口
    async getFloorList({commit}){
        let result= await reqGetFloorList()
        if (result.code===200){
            commit('GETFLOORLIST',result.data)
        }
    }

}
const getters={

}
//创建并暴露store
export default ({
    namespaced:true,
    state,actions,mutations,getters
})