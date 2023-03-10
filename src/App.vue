 <template>
  <div class="bg">
    <Header/>
    <!--路由组件出自的地方 -->
    <router-view></router-view>
    <!--在Home Search显示在注册登录时隐藏-->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
//引入组件
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default {
  name: 'App',
  components: {//注册组件
    Header,
    Footer
  },
  mounted() {
    //通知Vuex发请求获取数据，存储在仓库中 由于在Home Search都有每一次挂载完毕后都得执行 所以把它放在App目录下 数据是不变的储存一次就行了
    this.$store.dispatch('home/categoryList')
  }
}
</script>
 <style lang="less" scoped>
 .bg{
   background-color: whitesmoke;
 }
 </style>
