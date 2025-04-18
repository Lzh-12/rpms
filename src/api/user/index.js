import { sendRequest }  from '@/utils/request.js'

// 查询当前登录用户的用户信息
export const getUserInfoService = () => {
    return sendRequest("get", '/user/info');
}

// 更新当前登录用户的用户信息
export const updateUserInfoService = (userInfoData) => {
    const params = new URLSearchParams()
    for(let key in userInfoData){
        params.append(key, userInfoData[key])
    }
    return sendRequest("put", '/user/info', params);
}

// 获取所有用户信息
export const getAllUserService = () => {
    return sendRequest("get", `/user/all`);
}

// 添加|撤销用户权限
export const updateUserGrantService = (userInfoData) => {
    const params = new URLSearchParams()
    for(let key in userInfoData){
        params.append(key, userInfoData[key])
    }
    return sendRequest("put", `/user/${params.get('id')}/grant`, params);
}

// 获取所有机构信息
export const getInstitutionsInfo = () => {
    return sendRequest("get", '/user/institutions');
}