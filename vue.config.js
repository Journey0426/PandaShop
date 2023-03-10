module.exports= {
  //关闭eslint
  lintOnSave: false, //关闭语法检查
  //打包文件不要map文件
  productionSourceMap:false,
  devServer: {
    proxy: {
      '/api': {
        target:'http://gmall-h5-api.atguigu.cn',
      }
    },
  }
}
