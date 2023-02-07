//引入uuid生成临时身份【1:身份只能有一个 2：持久化存储】
import { v4 as uuidv4 } from 'uuid'
export const getUUID=()=>{
    //定义userinfo存在localStorage并且获取查看是否有userinfo
    let userInfo=localStorage.getItem('Useruuid')
    if (!userInfo){
        //没有的话创造一个userinfo并赋值为uuid
        userInfo=uuidv4();
        //存储到本地存储当中:用户身份只需要存储一次，而且不能变
        localStorage.setItem('Useruuid',userInfo)
    }
    console.log(userInfo)
    console.log(uuidv4())
    //一定要返回结果
    return userInfo
}
