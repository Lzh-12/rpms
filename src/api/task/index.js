import { sendRequest }  from '@/utils/request.js'

// 提交任务
export const submitTask = (taskData) => {
    const params = new URLSearchParams()
    for(let key in taskData){
        params.append(key, taskData[key])
    }
    return sendRequest("put", `/task/${params.get('id')}`, params);
}

// 删除任务
export const deleteTask = (taskId) => {
    const params = new URLSearchParams()
    for(let key in taskId){
        params.append(key, taskId[key])
    }
    return sendRequest("delete", `/task/${params.get('id')}`, params);
}

// 获取分配给当前用户的任务列表
export const getMyTask = () => {
    return sendRequest("get", `/task/my`);
}

// 发布项目任务
export const publishTask = (taskData) => {
    const params = new URLSearchParams()
    for(let key in taskData){
        params.append(key, taskData[key])
    }
    return sendRequest("post", `/task/project/${params.get('id')}`, params);
}

// 获取对应项目的任务列表
export const getAllTask = (taskId) => {
    const params = new URLSearchParams()
    for(let key in taskId){
        params.append(key, taskId[key])
    }
    return sendRequest("get", `/task/project/${params.get('id')}/all`, params);
}
