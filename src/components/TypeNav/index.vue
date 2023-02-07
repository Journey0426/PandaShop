<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!--事件委托 移入h3显示 h2也想要显示 用个div包裹他俩 写事件 -->
      <div @mouseleave="leaveShow">
        <h2 class="all" @mouseenter="changeshow">全部商品分类</h2>
        <!-- 三级联动结构||过渡动画效果-->
        <transition-group
            appear
            name="animate__animated animate__bounce"
            enter-active-class="animate__fadeIn"
            leave-active-class="animate__fadeOut"

        >
        <!-- 三级联动-->
        <div class="sort" v-show="show" key="1">
          <!--事件委派+编程式导航 事件的委派更加合理一些-->
          <div class="all-sort-list2" @click="goSearch">
            <div class="item"
                 v-for="(c1,index) in categoryList.slice(0,16)"
                 :key="c1.categoryId"
                 @mouseenter="changeIndex(index)"
                 :class="{cur:currentIndex===index}">
              <h3>
                <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{ c1.categoryName }}</a>
              </h3>
              <!--二级三级分类 -->
              <div class="item-list clearfix" :style="{display:currentIndex===index?'block':'none'}">
                <div class="subitem"
                     v-for="(c2,index) in c1.categoryChild"
                     :key="c2.categoryId">
                  <dl class="fore">
                    <dt>
                      <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{ c2.categoryName }}</a>
                    </dt>
                    <dd>
                      <em v-for="(c3,index) in c2.categoryChild" :key="c3.categoryId">
                        <a :data-categoryName="c3.categoryName" :data-category3Id="c3.categoryId">{{ c3.categoryName }}</a>
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        </transition-group>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">熊猫商城超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>

    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
//按需引入引入节流
import throttle from 'lodash/throttle'

//引入animate.css
import 'animate.css';

export default {
  name: "TypeNav",
  data() {
    return {
      //索引值的存储
      currentIndex: -1,
      show:true,
    }
  }
  ,

  computed: {
    //mapState辅助函数中的对象右侧函数，注入的实参，是vuex的大仓库的state
    ...mapState({categoryList: (state) => state.home.categoryList})
  },
  //设计离开一级联动根据索引值改变显示问题
  //h3的鼠标移入事件:用户行为如果过快，会出现浏览器反应不过来的现象----【用户行为太快】
  //回调函数里面业务代码很多，卡顿、业务没有完整完成。
  //节流功能
  methods: {
    changeIndex: throttle(function (index) {
      this.currentIndex = index
    }, 30),
    leaveIndex() {
      this.currentIndex = -1
    },
    //编程式导航按钮的回调函数
    goSearch(event){
      //点击a标签进行路由跳转：父节点代理的子节点的类型很多 div h3 dd dt em a
      //通过event可以获取到当前触发事件的节点
      //给a标签添加自定义属性data-categoryName，保证这个节点带data-categoryName，一定是a标签
      //可以通过节点的dataset属性获取相应节点的自定义属性，返回的是一个对象KV【自定义属性相关的】
      let element=event.target
      //父元素中有(h1 h2 h3 a)如果带有categoryname字段的一定是a标签可以通过dataset获取自定义属性
      //小驼峰式命名 获取时一定要小写
      let {categoryname,category1id,category2id,category3id}=element.dataset
      if (categoryname){
        //整理跳转路由参数
        let location={name:'search'}
        let query={categoryName:categoryname}
        //判断一级分类二级分类三级分类
        //一级分类的a标签
        if (category1id){
          query.category1Id=category1id;
          //二级分类的a标签
        }else if (category2id){
          query.category2id=category2id;
          //三级分类a标签
        }else {
          query.category3Id=category3id;
        }
        //路由跳转之前：看一下有没有params参数，如果有params参数需要携带给search
        if (this.$route.params) {
          //整理完参数
          //query参数
          location.query = query
          //params
          //如有有params参数也需要携带给search模块
          location.params=this.$route.params
          //路由跳转
          this.$router.push(location)
        }
      }
    },
    //鼠标引入显示移出不显示修改show的属性的方法（鼠标进入）
    changeshow(){
      //下面代码只有在serach模块的时候，才会执行
      if (this.$route.path !=='/home'){
        this.show=true
      }
    },
    leaveShow(){
      //鼠标移出的时候，三级联动的一级菜单没有背景颜色
      this.currentIndex = -1;
      if (this.$route.path !=='/home'){
        this.show=false
      }
    }
  },
  //挂载完毕后向服务器发请求
  mounted() {
    //每一个路由跳转的时候，进行一次判断，如果【不是home路由】即为search 刚进入search应为不显示
    if (this.$route.path!=='/home'){
      this.show=false
    }
  }
}
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid darksalmon;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: darksalmon;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {

            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

        }

        .cur {
          background-color: palegoldenrod;
        }
      }
    }
  }
}
</style>
