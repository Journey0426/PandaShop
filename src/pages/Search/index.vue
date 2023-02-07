<template>
  <div>
    <TypeNav/>
    <div class="main">
      <div class="py-container">
        <!--bread-->  <!--面包屑的地方:带叉子的按钮-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!--分类面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }}<i
                @click="removecategoryName">×</i></li>
            <!--关键词面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <!--品牌面包屑 -->
            <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.split(':')[1] }}<i
                @click="removeTrademark">×</i></li>
            <!--品牌属性值面包屑 -->
             <li class="with-x" v-for="(prop,index) in this.searchParams.props" :key="index">{{ prop.split(':')[1]}} <i
                 @click="removeAttprop(index)">×</i></li>
          </ul>
        </div>

        <!--selector-->
        <!-- 通过父组件给子组件传递函数类型的props实现：子给父传递数据 -->
        <SearchSelector @TradeMarkInfo="TradeMarkInfo" @getAttrInfo="getAttrInfo"/>


        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!--排序结构 -->
              <ul class="sui-nav" >
                <!-- 判断综合或者价格有没有类名 有的显示-->
                <li :class="{active:isComprehensive}" @click="changeOrder('1')">
                  <a>综合<span v-show="isComprehensive" class="iconfont" :class="{'icon-jiangxu1':isDesc,'icon-shengxu1':isAsc}"></span></a>
                </li>
                <li :class="{active:isPrice}" @click="changeOrder('2')">
                  <a >价格<span v-show="isPrice" class="iconfont" :class="{'icon-jiangxu1':isDesc,'icon-shengxu1':isAsc}"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg"/>
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>&nbsp;
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html"
                       title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{ good.title }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>0</span>人评价</i>
                  </div>
                  <div class="operate">
                    <router-link :to="`/detail/${good.id}`" target="_blank" class="sui-btn btn-bordered btn-danger" >加入购物车</router-link>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!--分页器 -->
          <!-- 分页器的地方
        total:分页器需要一共展示多少条数据
        pageSize:每一页展示几条数据
        pageNo:当前第几页
        continues:连续页码数5 7 9 112
        -->
          <Pagination :total="total"  :pageNo="searchParams.pageNo" :continues="5"   :pageSize="searchParams.pageSize" @getpageNo="getpageNo"></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import {mapGetters,mapState} from 'vuex'

export default {
  name: 'Search',
  data() {
    return {
      searchParams: {
        category1Id: "", //一级分类的id
        category2Id: "", //二级分类的id
        category3Id: "", //三级分类的id
        categoryName: "", //产品的名字
        keyword: "", //关键字
        props: [], //平台属性的选择参数
        trademark: "", //品牌参数
        //上面这七个参数：有用户选择决定的，因此初始值为空的
        //下面这三个：都有初始值
        //初始状态综合降序
        order: "1:desc", //携带给服务器参数order--->初始值"1:desc"[综合降序]2:desc[价格降序]
        pageNo: 1,
        // pageNo:parseInt(localStorage.getItem('pageNo'))||1, //获取第几页的数据，默认即为第一个的数据
        pageSize: 5, //每一页需要展示多少条数据
      }
    }
  },
  components: {
    SearchSelector
  },
  beforeMount() {
    //this.searchParams和this.$route.query共有的属性被this.$route.query替代,this.searchParams与this.$route.params共有的属性被后者替代
    Object.assign(this.searchParams, this.$route.query, this.$route.params)
  },
  mounted() {
    //从home跳转到search（searchparms发生变化）应该提前把数据传递给服务器
    this.getSearchList()
  },
  computed: {
    //加了命名空间前面要加所在仓库名
    ...mapGetters({goodsList: 'search/goodsList'}),
    //判断价格和默认哪个有类名
    //默认
    isComprehensive(){
      return this.searchParams.order.indexOf('1')!==-1
    },
    //价格
    isPrice(){
      return this.searchParams.order.indexOf('2')!==-1
    },
    //升序
    isAsc(){
      return this.searchParams.order.indexOf('asc')!==-1
    },
    //降序
    isDesc(){
      return this.searchParams.order.indexOf('desc')!==-1
    },
    //获取Search mapstate下的total
      ...mapState({total:state => state.search.searchList.total})
  },
  methods: {
    //派发action通知服务器发请求
    // 因为mounted只在挂载后执行一次，要写在方法里，封装成函数
    getSearchList() {
      this.$store.dispatch('search/getSearchList', this.searchParams)
    },
    //删除面包屑
    //删除分类的名字
    removecategoryName() {
      //把带给服务器的参数置空了，还需要向服务器发请求
      //带给服务器参数说明可有可无，若果属性值为空的字符串还是会把相应的字段带给服务器
      //但是你把相应的字段变为undfiend，当前这个字段不会带给服务器
      this.searchParams.categoryName = '';
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.getSearchList();
      //地址栏也需要修改，进行路由跳转（现在的路由跳转只是跳转到自己这里）
      //严谨：本意是删除query，如果路径当中有params不应该删除
      if (this.$route.params) {
        this.$router.push({name: 'search', params: this.$route.params})
      }
    },
    //删除关键字
    removeKeyword() {
      //给服务器的searchParams.keyword置空
      this.searchParams.keyword = '';
      //再次发请求
      this.getSearchList();
      //通知兄弟header传参清空keyword
      this.$bus.$emit('clear')
      //关键字清楚了，浏览框也要清楚params的keyword但是保留query的信息
      if (this.$route.query) {
        this.$router.push({name: 'search', query: this.$route.query})
      }
    },
    //自定义事件
    //获取自定义事件（子组件给父组件）品牌信息
    TradeMarkInfo(trademark) {
      // 整理参数：    "ID:品牌名称"
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      //再次发请求获取search进行展示
      this.getSearchList()
    },
    //删除品牌
    removeTrademark() {
      //trademark置空
      this.searchParams.trademark = undefined;
      //再次发请求
      this.getSearchList()
    },
    // //获取自定义事件（字组件给父组件）平台属性信息
    getAttrInfo(attr, attrValue) {
      //整理参数:['属性ID:属性值:属性名'],携带给服务器参数【看文档】
      //对于前端工程师而言。收集数据属于基本功
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`
      //添加到searchParams.props数组里面携带给服务器
      //需要进行判断：判断数组当中是否已包含这个属性值，如果有不需要添加，没有在添加
      //发请求(属性值相同的情况下不在发请求，属性不同在发请求)
      /*
      *  indexOf()
                    - 获取元素在数组中第一次出现的索引*/
      //如果
      if (this.searchParams.props.indexOf(prop)===-1){//=-1说明没找到
        this.searchParams.props.push(prop)
        this.getSearchList()}
    },
    //删除品牌面包屑
    removeAttprop(index){
      this.searchParams.props.splice(index,1)
      this.getSearchList()
    },
    //排序问题
    changeOrder(flag){
      //flag形参：用户点击综合或者价格标记
      //order默认初始值:综合降序  1:desc
      let orginFlag=this.searchParams.order.split(':')[0]//初始值默认还是价格
      let originSort=this.searchParams.order.split(":")[1]//初始值排序
      //准备一个新的排序方式---【页面效果永远不会变的】
      let newOrder = '';
      //判断多次点击是不是同一个按钮
      if (orginFlag===flag){
        newOrder=`${orginFlag}:${originSort==='desc'?'asc':"desc"}`
      }else {
        newOrder=`${flag}:desc`
      }
      this.searchParams.order=newOrder
      this.getSearchList()
    },
    //获取自定义时间
    //分页器的自定义事件，将用户点击的第几页数据传递给父组件
    getpageNo(pageNo){
      this.searchParams.pageNo=pageNo
      this.getSearchList()
    }
  },
  watch: {
    $route(newValue, oldValue) {
////组件实例身上是有$route这个属性的【包含：路由信息】
//只要路由发生变化，立即在向服务器发请求
//再次发起请求之前整理带给服务器数据
      Object.assign(this.searchParams, this.$route.query, this.$route.params)
//再次发起ajax请求
      this.getSearchList()
//分类名字与关键字不用清理，因为每一次路由发生变化，都会给他赋予新的数据 不过三级联动id要清空
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;

    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>