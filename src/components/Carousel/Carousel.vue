<template>
  <div class="swiper-container" id="floor1Swiper">
    <div class="swiper-wrapper">
      <!-- 全局轮播图的结构，需要一个数组，数组里面有多少个元素，就有多少张图片 -->
      <div class="swiper-slide" v-for="(carousel,index) in bannerList" :key="carousel.id">
        <img :src="carousel.imgUrl"/>
      </div>

    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper";


export default {
  name: "Carousel",
  props:['bannerList'],
  watch:{
    //监听bannerList数据的变化，因为这条数据发生过变化---由空数组变为数组里面有四个元素

    bannerList:{
      //监听属性：立即监听，不管你属性有没有发生变化，立即执行一次。
      immediate: true,
      handler(newValue,oldValue){
        //现在通过watch监听bannerList属性的属性值的变化
        //如果执行handle方法，代表组件实例身上这个属性已经有了【数组：四个元素】
        //当前这个函数执行：只能保证bannerList数据已经有了但没办法保证V-for循环已经结束
        //v-for执行完毕，才有结构【你现在在watch当中没办法保证】
        //nextTick：在下次DOM更新 循环结束之后 执行延迟回调，在 修改数据之后 立即使用这个方法，过去更新后的DOM
        this.$nextTick(()=>{
          //当你执行这个回调的时候：保证服务器数据回来了，v-for执行完毕了【一定轮播图的解构一定有了】
          new Swiper ('.swiper-container', {
            loop: true, // 循环模式选项
            //自动切换
            autoplay:true,
            //变动效果
            effect : 'fade',
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              //分页器小球点击的时候切换图片
              clickable: true,
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            // 如果需要滚动条
            // scrollbar: {
            //   el: '.swiper-scrollbar',
            // },
          })
        })
      }
    }

  }
}
</script>

<style scoped>

</style>