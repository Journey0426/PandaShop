<template>
    <!-- 头部 -->
    <header class="header">
      <!-- 头部的第一行 -->
      <div class="top">
        <div class="container">
          <div class="loginList">
            <p>熊猫商城欢迎您！</p>
            <p v-if="!userInfo.name">
              <span>请</span>
              <router-link to="/login">登录</router-link>
              <router-link class="register" to="/register">免费注册</router-link>
            </p>
            <p v-else>
              <span>{{userInfo.name}}</span>
              <span class="register" @click="getOut">退出</span>
            </p>
          </div>
          <div class="typeList">
            <router-link to="/center">我的订单</router-link>
            <router-link to="/shopcart">我的购物车</router-link>
            <a href="###">我的熊猫商城</a>
            <a href="###">熊猫商城会员</a>
            <a href="###">企业采购</a>
            <a href="###">关注熊猫商城</a>
            <a href="###">合作招商</a>
            <a href="###">商家后台</a>
          </div>
        </div>
      </div>
      <!--头部第二行 搜索区域-->
      <div class="bottom" >
        <h1 class="logoArea">
          <router-link class="logo" title="熊猫商城" to="/home" >
            <img src="./images/log.png" alt="">
          </router-link>
        </h1>
        <div class="searchArea">
          <form action="###" class="searchForm">
            <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model:width="keyword" />
            <button class="sui-btn btn-xlarge btn-danger"
                    type="button"
                    @click="goSearch">搜索</button>
          </form>
        </div>
      </div>
    </header>
</template>

<script>
/* eslint-disable */
import {mapState} from "vuex";
export default {
  name:"",
  data(){
    return{
      //收集表单数据---关键字的
      keyword:''
    }
  },
  methods:{
    goSearch() {
      /* 跳转路由并携带query参数，to的对象写法 */
      //搜索按钮的回调函数,点击的时候，home跳转到search
      //如果可传递|不传递，万一传递的是空字符串，会出现路径问题，
      //判断：点击搜索按钮之前，稍微判断一下是否有query参数，如果有query参数，携带给search
      //本身点击搜索按钮，当年只是携带params，如果路径当中存在query参数，是需要把query参数页携带给search
      if (this.$route.query) {
        let location={ name: 'search',params: {keyword:this.keyword ||undefined}}
        location.query= this.$route.query
        this.$router.push(location)
      }
    },
    //退出登录
    getOut(){
      this.$store.dispatch('user/getLogout')
    }
  },
  mounted() {
    //接受兄弟传来的数据
    this.$bus.$on('clear',()=>{
      this.keyword=''
    })
  },
  computed:{
    //获取用户信息
    ...mapState({
      userInfo:state => state.user.userInfo
    })
  }
}
</script>

<style scoped lang="less">
.header {
  background: whitesmoke;
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid darksalmon;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: darksalmon;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
