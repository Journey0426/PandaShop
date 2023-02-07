//管用户注册登录的接口
import {reqcode, reqregister, reqlogin, reqUserInfo, reqLogout} from "@/api";
import {SetToken,GetToken,DelToken} from "@/utils/token";
const state = {
    code: '',
    token:GetToken(),
    //用户信息
    userInfo:{}

};
const mutations = {
    GETCODE(state,code){
        state.code= code
    },
    GETLOGIN(state,token){
        state.token=token
    },
    GETUSERINFO(state,userInfo){
        state.userInfo=userInfo
    },
    CLEARCODE(state){
        //把仓库中相关同户信息清空  token清空
        state.token = '';
        state.userInfo={}
        //本地存储数据【token】
        DelToken()
    }
};
const actions = {
    //验证码
   async getcode({commit},phone){
        let result=await reqcode(phone)
        if (result.code==200){
            //因为接口中有数据data所以要commit
           commit('GETCODE',result.data)
            return 'ok'
        }else {
          return   Promise.reject(new Error('faile'))
        }
    },
    //完成注册
   async getregister({commit},data){
    let result=await reqregister(data)
       //切记:当用户登录成功以后，服务器会返回相应数据信息，数据信息当中包含token
       //登录成功一定是有token，登录没有成功【没有token】
       //用户登录成功，一般只是返回token，很少返回用户名
       //将来需要在发请求（获取用户名字的）携带token给服务器【用户信息】
       //Vuex仓库储存数据不是持久化
       if (result.code==200){
           return 'ok'
       }else {
           //返回的是206不知道为什么 是验证码不对的问题
           console.log(result.code)
           return   Promise.reject(new Error('faile'))
       }


    },
    //登录
    async getlogin({commit},data){
      let result=await reqlogin(data)
        if (result.code==200){
            commit('GETLOGIN',result.data.token)
            //token回调函数
            SetToken(result.data.token)
            return 'ok'
        }else {
            return  Promise.reject(new Error('faile'))
        }
    },
    //获取用户信息
   async getuserinfo({commit}){
       let result=await reqUserInfo()
       if (result.code===200){
           commit('GETUSERINFO',result.data)
           return 'ok'
       }else {
           return Promise.reject(new Error('faile'))
       }
    },
    //退出登录
    async getLogout({commit}){
       let result=await reqLogout()
        if (result.code===200){
            //因为在action不能直接修改state
           commit('CLEARCODE')
            return 'ok'
        }
        else {
            return Promise.reject(new Error('faile'))
        }
    }
};
const getters = {}
export default ({
    namespaced:true,
    state, mutations, actions, getters
})