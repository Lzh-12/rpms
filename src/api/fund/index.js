import { sendRequest }  from '@/utils/request.js'

// 删除经费申请
export const deleteFund = (fundId) => {
    const params = new URLSearchParams()
    for(let key in fundId){
        params.append(key, fundId[key])
    }
    return sendRequest("delete", `/fund/${params.get('id')}`, params);
}

// 审核经费
export const reviewFund = (fundData) => {
    const params = new URLSearchParams()
    for(let key in fundData){
        params.append(key, fundData[key])
    }
    return sendRequest("put", `/fund/${params.get('id')}/review`, params);
}

// 获取当前用户发起的经费申请列表
export const myFund = () => {
    return sendRequest("get", `/fund/my`);
}

// 创建经费申请
export const projectFund = (fundData) => {
    const params = new URLSearchParams()
    for(let key in fundData){
        params.append(key, fundData[key])
    }
    return sendRequest("post", `/fund/project/${params.get('id')}`, params);
}

// 获取项目的全部状态的经费列表
export const projectAllFund = (fundId) => {
    const params = new URLSearchParams()
    for(let key in fundId){
        params.append(key, fundId[key])
    }
    return sendRequest("get", `/fund/project/${params.get('id')}/all`, params);
}

// 获取项目的已通过的经费列表
export const projectApproedFund = (fundId) => {
    const params = new URLSearchParams()
    for(let key in fundId){
        params.append(key, fundId[key])
    }
    return sendRequest("get", `/fund/project/${params.get('id')}/approved`, params);
}

// 获取所有类型信息
export const projectFundTypes = () => {
    return sendRequest("get", `/fund/types`)
}