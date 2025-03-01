import {sendRequest} from '@/utils/request.js'


// 用户登录
export const loginService = (loginData) => {
    // 借助于UrlSearchParams完成传递
    const params = new URLSearchParams()
    for(let key in loginData){
        params.append(key, loginData[key])
    }
    //不是json格式，不要直接传loginData
    return sendRequest("post", '/auth/login', params);
    // return request.post('/auth/login', params);
}

// 用户登出
export const loginOut = () => {
    return sendRequest("put", '/auth/logout');
}

// 用户注册
export const registerService = (registerData) => {
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key, registerData[key])
    }
    return sendRequest("post", '/auth/register', params);
}

// 获取注册验证码
export const registerCodeService = (registerCodeData) => {
    const params = new URLSearchParams()
    for(let key in registerCodeData){
        params.append(key, registerCodeData[key])
    }
    return sendRequest("post", '/auth/register/code', params);
}

