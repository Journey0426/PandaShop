<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="(shop,index) in shopList" :key="shop.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list"
                   v-model="shop.isChecked"
                   @change="updatechecked(shop.id,$event)">
          </li>
          <li class="cart-list-con2">
            <img :src="shop.imgUrl">
            <div class="item-msg">{{ shop.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ shop.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="updateSkuNum('minus',-1,shop)">-</a>
            <input autocomplete="off" type="text" minnum="1" class="itxt" :value="shop.skuNum"
                   @change="updateSkuNum('input',$event.target.value,shop)">
            <a href="javascript:void(0)" class="plus" @click="updateSkuNum('add',1,shop)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ shop.skuPrice * shop.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteshop(shop)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>

      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isCheckeds!=0" @change="updateALLchecked($event)">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="Alldelete">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ this.shopprice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import throttle from 'lodash/throttle'

export default {
  name: 'ShopCart',
  data() {
    return {}
  },
  mounted() {
    // 因为mounted只在挂载后执行一次，要写在方法里，封装成函数
    this.getData()
    console.log(this.shopList)
  },
  methods: {
    //因为每次操作都会发请求所以封装成函数放到方法里。交给mounted
    //为什么没有返回数据？前端把数据和请求发给后台（可能100个用户都发），后台接受后存起来但是在返给用户时不知道那个数据是哪个用户的所以需要token来识别用户，token存在localstorange里
    getData() {
      this.$store.dispatch('shopcart/getCarlist')
    },
    //给加减号加个节流
    updateSkuNum: throttle(async function (flag, num, shop) {
      //第一个参数：flag,用来区分（加、减、文本框标记）
      //第二个参数:num,目前(加减按钮)，数量发生变化的数值,如果是表单元素disNum【最终数值 - 起始数值】 这些在接口中定义好了
      // 接口文档：
      // skuNum	string	Y	商品数量
      //正数代表增加
      //负数代表减少
      //第三个参数:shop,点击的那个产品
      //判断数据并派发
      //flag 区分为哪个运算
      switch (flag) {
          //当为减时
        case 'minus':
          shop.skuNum > 1 ? num = -1 : num = 0
          break
          //当为加时
        case  'add':
          num = 1
          break;
        case 'input':
          if (isNaN(num) || num < 1) {
            num = 0
          } else {
            //当输入小数是就取整-当前的数
            num = parseInt(num) - shop.skuNum
          }
      }
      try {
        //更新数据并重新派发请求
        //发请求，通知服务器修改产品的数量，修改产品数量如果成功，需要再次获取购物车的数据进行展示，展示最新的数据。在detail仓库有管着数据更新的接口
        await this.$store.dispatch('detail/addShopCart', {
          skuId: shop.skuId,
          skuNum: num
        })
        this.getData()
      } catch (err) {
        console.log('你出现错误了')
      }

    }, 500),
    // async updateSkuNum(flag, num, shop) {

    //删除商品
    async deleteshop(shop) {
      try {
        await this.$store.dispatch('shopcart/deletecart', shop.skuId)
        this.getData()
        console.log(shop)
      } catch (err) {
        console.log('错误')
      }
    },
    //更新按钮
    async updatechecked(id, event) {
      let isChecked = event.target.checked ? '1' : '0'
      try {
        await this.$store.dispatch('shopcart/getupdatechecked', {skuId: id, isChecked})
      } catch (err) {
        alert('failed')
      }
    },
    //删除选中商品
    async Alldelete() {
      try {
        await this.$store.dispatch('shopcart/getAlldelete')
        this.getData()
      } catch (err) {
        alert('删除错误')
      }
    },
    //全部选中事件
   async updateALLchecked(event) {
     //获取当前全选的这个复选框的状态,你能获取到全选按钮的选中还是未选中状态
     let isChecked = event.target.checked ? "1" : "0";
      try {
        await this.$store.dispatch('shopcart/getALLchecked',isChecked)
        this.getData()
      }catch (err){
        alert('错误')
      }

    },
  },
  computed: {
    ...mapGetters({shopcartDate: 'shopcart/shopcartDate'}),
    //最终组件需要展示的购物车的数据
    shopList() {
      //数组：购物车的数据
      //假报错:至少有一个数据兜底
      return this.shopcartDate.cartInfoList || []
    },
    //计算单件物品的总价格
    shopprice() {
      let stuprice = 0
      this.shopList.forEach((shop) => {
        stuprice += shop.skuPrice * shop.skuNum
      })
      return stuprice
    },
    //计算全选
    /*
    * every () 方法用于检测非空数组中所有元素是否都符合指定条件（通过函数提供），
    * 如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
    *  如果所有元素都满足条件，则返回 true。*/
    isCheckeds() {
      return this.shopList.every((item) => item.isChecked == 1)&&this.shopList.length>0
    }
  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;

        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>