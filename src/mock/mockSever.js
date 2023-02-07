//引入Mock
import Mock from 'mockjs'
//引入JSON数据
//对于一些模块：图片、json文件默认对外暴露【虽然你没有书写但是它已经暴露了】
import banner from './banner.json'
import floor from './floor.json'
import address from './address.json'
//mock数据：第一个参数:请求地址,第二个参数:请求数据
Mock.mock('/mock/banner',{code:200,data:banner})
Mock.mock('/mock/floor',{code:200,data:floor})
Mock.mock('/mock/address',{code:200,data:address})