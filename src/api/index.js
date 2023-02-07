//统一管理项目全部接口的文件
import request from "@/api/request";
import mockRequest from "@/api/mockRequest";

//三级联动接口
//商品分类的数据接口 axios返回promise对象
export const reqCategoryList=()=>request({url:'product/getBaseCategoryList',method:"get"})
//获取banner数据的接口函数
export const  reqGetBannerList =()=>mockRequest({url:'/banner',method:'get'})
//获取Floor(楼层)数据接口的函数
export const reqGetFloorList=()=>mockRequest({url:'/floor',method:'get'})
//获取search接口//搜索产品的接口[真实的接口]
//URL:/api/list   method:post    参数：需要携带
//这个接口【携带参数：最多十个，十个属性可以传递，也可以不传递，但是至少给给服务器携带一个空值
export const reqSearchList=(data)=>request({url:'/list',method:'post',data})
//商品详情接口{get请求 skuid参数}
export const reqDetailList=(skuid)=>request({url:`/item/${skuid}`,method:'get'})
//6 添加到购物车(对已有物品进行数量改动)6. 添加到购物车(对已有物品进行数量改动)
//api/cart/addToCart/{ skuId }/{ skuNum }
export const reqAddOrUpdateShopCart=(skuId,skuNum)=>request({url:`/cart/addToCart/${skuId}/${skuNum}`,method:'post'})
//. 获取购物车列表
///api/cart/cartList get
export const reqCartList=()=>request({url:'/cart/cartList',method:'get'})
//购物车删除接口
///api/cart/deleteCart/{skuId}
export const reqdeleteCart=(skuId)=>request({url:`/cart/deleteCart/${skuId}`,method:'delete'})
// 切换商品选中状态
//    /api/cart/checkCart/{skuID}/{isChecked}
export const requpdatecheckCart=(skuId,isChecked)=>request({url:`/cart/checkCart/${skuId}/${isChecked}`,method:'get'})
// 获取注册验证码
//api/user/passport/sendCode/phone GET
export const reqcode=(phone)=>request({url:`/user/passport/sendCode/${phone}`,method:'get'})
//注册成功
///api/user/passport/register  POST phone password code
export const reqregister = (data)=>request({url:`/user/passport/register`,method:'post',data});
//9. 登录
///api/user/passport/login
export const reqlogin=(data)=>request({url:'/user/passport/login',method:'post',data})
//获取用户信息的接口
//api/user/passport/auth/getUserInfo  get
export const reqUserInfo = ()=>request({url:`/user/passport/auth/getUserInfo`,method:'get'});
//退出登录
///api/user/passport/logout
export const reqLogout=()=>request({url:"/user/passport/logout",method:'get'})
//获取用户地址信息
export const reqAddressInfo = ()=>request({url:`/user/userAddress/auth/findUserAddressList`,method:'get'});

//获取购物清单
export const reqShopCartInfo =()=>request({url:`/order/auth/trade`,method:'get'});
//获取自己造的地址信息
export const reqaddress=()=>mockRequest({url:'/address',method:'get'})
//提交订单 post
///api/order/auth/submitOrder?tradeNo={tradeNo}
export const reqSubmitOrder=(tradeNo,data)=>request({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'})
//获取订单支付信息
//api/payment/weixin/createNative/{orderId}
export const reqOrderPay = (orderId)=>request({url:`/payment/weixin/createNative/${orderId}`,method:'get'});
//查询支付状态
//api/payment/weixin/queryPayStatus/{orderId}
export const reqPaystate=(orderId)=>request({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})
//获取用户订单列表数据
///api/order/auth/{page}/{limit}   get
//page:代表当前第几页
//limit：代表的是每一页多少条数据

export const reqMyList = (page,limit)=>request({url:`/order/auth/${page}/${limit}`,method:'get'});



