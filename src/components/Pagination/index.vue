<template>
    <div class="pagination">
      <button :disabled="pageNo===1" @click="$emit('getpageNo',pageNo-1)">上一页</button>
        <button v-if="StarNumAndEndNum.start>=2" @click="$emit('getpageNo',1)" :class="{active:pageNo===1}">1</button>
        <button v-if="StarNumAndEndNum.start>=3">···</button>
      <!--遍历中间数字 从连续数字的最后数字结束，从满足遍历要求的起点开始-->
        <button v-for="(page,index) in StarNumAndEndNum.end"
                :key="index"
                v-if="page>=StarNumAndEndNum.start"
                @click="$emit('getpageNo',page)"
                :class="{active:pageNo===page}">{{page}}</button>
        <button v-if="StarNumAndEndNum.end+2<=totalPage">···</button>
        <button v-if="StarNumAndEndNum.end+1<=totalPage"
                @click="$emit('getpageNo',totalPage)"
                :class="{active:pageNo===totalPage}">{{totalPage}}</button>
        <button :disabled="pageNo===totalPage" @click="$emit('getpageNo',pageNo+1)">下一页</button>

        <button style="margin-left: 30px">共 {{total}} 条</button>
    </div>
</template>

<script>
    export default {
        name: "Pagination",
        props: ["total", "pageSize", "pageNo", "continues"],
        computed:{
          //总共多少页
          totalPage(){
            //向上取整
            return Math.ceil(this.total/this.pageSize)
          },
          //计算出连续的页码的起始数字和结束数字
          StarNumAndEndNum(){
            //解构赋值
            const {continues,totalPage,pageNo}=this
            //定义两个变量储存起始数字和结束数字
            let start=0;let end=0
            //不正常情况 连续页码>总共的页数
            if (continues>totalPage){
                  start=1
                  end=totalPage
            }else {
              //正常情况
              start=pageNo-parseInt(continues/2)
              //连续有5页当前在6页 start=6-2=4 end=6+2=8 45678
              //连续有7页当前在6页 start=6-3=3 end=6+3=9 3456789
              end=pageNo+parseInt(continues/2)
              //考虑到异常情况比如当前页数在第一页 start就会小于1
              //比如当前页数为1 -1 0 1 2 3是错误的  应该为1 2 3 4 5 1是开始 continues是结束
              if (start<1){
                start=1
                end=continues
              }
              //另一种情况结束的页数比总页数大
              //比如 总共15页当前所在15页 13 14 15 16 17是错误的 应该为 11 12 13 14 15 start=15-5+1
               if (end>totalPage){
                start=totalPage-continues+1
                end=totalPage
              }
            }
            return {start,end}
          }
        }
    }
</script>

<style lang="less" scoped>
    .pagination {
      text-align: center;
        button {
            margin: 0 5px;
            background-color: #f4f4f5;
            color: #606266;
            outline: none;
            border-radius: 2px;
            padding: 0 4px;
            vertical-align: top;
            display: inline-block;
            font-size: 13px;
            min-width: 35.5px;
            height: 28px;
            line-height: 28px;
            cursor: pointer;
            box-sizing: border-box;
            text-align: center;
            border: 0;

            &[disabled] {
                color: #c0c4cc;
                cursor: not-allowed;
            }

            &.active {
                cursor: not-allowed;
                background-color: #409eff;
                color: #fff;
            }

        }
    }
</style>