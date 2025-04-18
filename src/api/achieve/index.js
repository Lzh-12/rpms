import { sendRequest }  from '@/utils/request.js'

// 审核成果
export const achieveExamine = (achieveId) => {
    const params = new URLSearchParams()
    for(let key in achieveId){
        params.append(key, achieveId[key])
    }
    return sendRequest("put", `/achieve/${params.get('id')}/review`, params);
}

// 删除成果
export const achieveDelete = (achieveId) => {
    const params = new URLSearchParams()
    for(let key in achieveId){
        params.append(key, achieveId[key])
    }
    return sendRequest("delete", `/achieve/${params.get('id')}`, params);
}

// 获取当前用户发起的成果列表
export const achieveMyList = () => {
    return sendRequest("get", `/achieve/my`);
}

// 创建成果
export const achieveCreate = (achieveData) => {
    const params = new URLSearchParams()
    for(let key in achieveData){
        params.append(key, achieveData[key])
    }
    return sendRequest("post", `/achieve/project/${params.get('id')}`, params);
}

// 修改成果
export const achieveModify = (achieveData) => {
    const params = new URLSearchParams()
    for(let key in achieveData){
        params.append(key, achieveData[key])
    }
    return sendRequest("put", `/achieve/${params.get('id')}/modify`, params);
}

// 提交成果
export const achieveSubmit = (achieveData) => {
    const params = new URLSearchParams()
    for(let key in achieveData){
        params.append(key, achieveData[key])
    }
    return sendRequest("put", `/achieve/${params.get('id')}/submit`, params);
}

// 获取项目的全部状态的成果列表
export const achieveAll = (achieveId) => {
    const params = new URLSearchParams()
    for(let key in achieveId){
        params.append(key, achieveId[key])
    }
    return sendRequest("get", `/achieve/project/${params.get('id')}/all`, params);
}

// 获取项目的已通过的成果列表
export const achieveAllApproved = (achieveId) => {
    const params = new URLSearchParams()
    for(let key in achieveId){
        params.append(key, achieveId[key])
    }
    return sendRequest("get", `/achieve/project/${params.get('id')}/approved`, params);
}

// 获取所有类型信息
export const achieveTypes = () => {
    return sendRequest("get", `/achieve/types`);
}
