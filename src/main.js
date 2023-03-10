import Vue from 'vue'
import App from './App.vue'

//引入路由
import router from "@/router";
//注册全局组件---三级联动
import TypeNav from "@/components/TypeNav";
//全局组件注册方式:
//第一参数:组件名字  第二个参数：哪一个组件
Vue.component(TypeNav.name,TypeNav)
//引入store
import store from "@/store";
//引入mockSever.js  mock数据
import '@/mock/mockSever'
//引入swiper样式
import "swiper/css/swiper.css"
//注册全局的轮播图组件
import Carousel from "@/components/Carousel/Carousel";
Vue.component(Carousel.name,Carousel)
//注册分页器组件
import Pagination from "@/components/Pagination";
Vue.component(Pagination.name,Pagination)
//全局引入UI
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';
//按需引入eleui
import {MessageBox,Button,Form,FormItem,Input,InputNumber} from 'element-ui'
Vue.component(Button.name, Button);
Vue.component(MessageBox.name, MessageBox,);
Vue.component(Form.name,Form)
Vue.component(FormItem.name,FormItem)
Vue.component(Input.name,Input)
Vue.component(InputNumber.name,InputNumber)
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$msgbox = MessageBox;
//关闭Vue的生产提示
Vue.config.productionTip = false
//引入全部的请求函数
import * as API from '@/api'
//引入图片懒加载
import VueLazyload from "vue-lazyload";
//引入图片
import lazyImage from './assets/images/lazyimg.gif';
//注册插件
Vue.use(VueLazyload, {
  loading: lazyImage,
})


new Vue({
  render: h => h(App),
  //开启事件总线
  beforeCreate() {
    Vue.prototype.$bus=this
    //把全部的请求函数：作为Vue.prototype的属性，组件实例可以获取
    //请求函数只需要注册一次，可以在组件当中使用。
    Vue.prototype.$API=API
  },
  router,
  //一定要注册store
  store,
}).$mount('#app')
