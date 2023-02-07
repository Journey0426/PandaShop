//axios二次封装
import axios from "axios";
//引入进度条
import nprogress from 'nprogress';
//引入进度条样式
import 'nprogress/nprogress.css'
//引入Vuex仓库模块
import store from '@/store';
//创建axios实例[创建出来的实例即为axios，只不过可以配置一些东西]
const requests=axios.create({
    //可以给请求路径中添加一些参数
    baseURL:'/api',//postman接口前都有/api前缀加了后../api/product/getBaseCategoryList /只需写/product/getBaseCategoryList 即可
    //设置请求时间（5S）
    timeout:5000,
});
//请求拦截器:在发请求之前可以检测到，可以干一些事情
requests.interceptors.request.use((config)=>{
    //config配置对象，这里面有请求头
    //config，请求拦截器的一个配置对象
    //判断是否有uuid
    if (store.state.detail.UserUid){
        //请求头添加一个字段，这个字段不能瞎写是和后端老师商量好的
        config.headers.userTempId=store.state.detail.UserUid
    }
    //判断是否有token
    if (store.state.user.token){
        //请求头的这个属性token，和后台老师商量好的了，不能叫做别的名字
        config.headers.token=store.state.user.token
    }
    //检测到程序发请求，请求拦截器可以检测到，进度条开始动
    nprogress.start();
    return config
})
//响应拦截器：服务器的数据已经返回了，可以干一些事情
requests.interceptors.response.use((res)=>{
    //服务器数据返回进度条结束
    nprogress.done();
    return res.data;
},error => {
    //响应失败 终止promise链
    return Promise.reject(error)
})
export default requests;