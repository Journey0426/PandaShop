<template>
  <div>
  <!--三级组件联动组件 -->
    <TypeNav/>
    <ListContainer/>
    <Recommend/>
    <Rank/>
    <Like/>
    <!--Home父组件：通过v-for遍历生成多个Floor组件-->
    <Floor v-for=" floor in floorList" :key="floor.id" :floorInfo="floor"></Floor>

    <Brand></Brand>

  </div>
</template>

<script>
//引入组件
//发现三级联动在search模块中也使用，咱们将三级联动的组件注册为全局组件
//下面引入的是局部组件：定义、引入、注册、使用
import Brand from "@/pages/Home/Brand";
import Floor from "@/pages/Home/Floor";
import Like from "@/pages/Home/Like";
import ListContainer from "@/pages/Home/ListContainer";
import Rank from "@/pages/Home/Rank";
import Recommend from "@/pages/Home/Recommend";
import TypeNav from "@/components/TypeNav";
import {mapState} from "vuex";

export default {
  name: "Home",
  components: {Brand,Floor,Like,ListContainer,Rank,Recommend,TypeNav},
  computed:{
    //借助mapState生成计算属性，从state中读取数据
    ...mapState({floorList:state => state.home.floorList}),

  },
  methods:{
  },
  mounted() {
    //父组件的生命周期函数（mounted），在这里通知Vuex发请求【获取Floor组件需要的数据】
    //由于Home父组件的mounted中通知Vuex发请求，请求回来以后，Floor组件才遍历出来。
    //当父组件的mounted执行的时候，Floor组件可能没有遍历完毕
    this.$store.dispatch('home/getFloorList')
  },

}
</script>
