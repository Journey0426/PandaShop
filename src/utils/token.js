//专门存token的
export const SetToken=(token)=>{
        //把token存在本地存储
    localStorage.setItem('TOKEN',token)
};
//一定要return
    export const GetToken=()=>{
    //把token存在本地存储
    return localStorage.getItem('TOKEN')
};
    export const DelToken=()=>{
        localStorage.removeItem('TOKEN')
    }