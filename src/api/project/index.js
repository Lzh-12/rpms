import { sendRequest }  from '@/utils/request.js'

// 获取项目详情
export const getProjectDetails = (projectId) => {
    const params = new URLSearchParams()
    for(let key in projectId){
        params.append(key, projectId[key])
    }
    return sendRequest("get",`/project/${params.get('id')}`, params);
}

// 项目结题
export const projectConclude = (ProjectData) => {
    const params = new URLSearchParams()
    for(let key in ProjectData){
        params.append(key, ProjectData[key])
    }
    return sendRequest("put", `/project/${params.get('id')}/conclude`, params);
}

// 获取项目成员
export const projectMembers = (ProjectId) => {
    const params = new URLSearchParams()
    for(let key in ProjectId){
        params.append(key, ProjectId[key])
    }
    return sendRequest("get", `/project/${params.get('id')}/members`, params);
}

// 审核项目
export const projectReview = (ProjectData) => {
    const params = new URLSearchParams()
    for(let key in ProjectData){
        params.append(key, ProjectData[key])
    }
    return sendRequest("put", `/project/${params.get('id')}/review`, params);
}

// 申请项目
export const projectApply = (ProjectData) => {
    const params = new URLSearchParams()
    for(let key in ProjectData){
        params.append(key, ProjectData[key])
    }
    return sendRequest("post", `/project/`, params);
}

// 获取我的项目列表
export const projectMy = () => {
    return sendRequest("get", '/project/my');
}

// 修改项目
export const projectModify = (ProjectData) => {
    const params = new URLSearchParams()
    for(let key in ProjectData){
        params.append(key, ProjectData[key])
    }
    return sendRequest("put", `/project/${params.get('id')}/modify`, params);
}

// 删除项目
export const projectDelete = (ProjectData) => {
    const params = new URLSearchParams()
    for(let key in ProjectData){
        params.append(key, ProjectData[key])
    }
    return sendRequest("delete", `/project/${params.get('id')}`, params);
}

// 邀请|踢出项目成员
export const projectManageMember = (ProjectData) => {
    const params = new URLSearchParams()
    for(let key in ProjectData){
        params.append(key, ProjectData[key])
    }
    return sendRequest("put", `/project/${params.get('id')}/member/invite`, params);
}

// 提交项目
export const projectSubmit = (ProjectData) => {
    const params = new URLSearchParams()
    for(let key in ProjectData){
        params.append(key, ProjectData[key])
    }
    return sendRequest("put", `/project/${params.get('id')}/submit`, params);
}

// 获取项目统计信息
export const projectTally = (ProjectData) => {
    const params = new URLSearchParams()
    for(let key in ProjectData){
        params.append(key, ProjectData[key])
    }
    return sendRequest("get", `/project/tally/page/${params.get('page')}`, params);
}

// 获取项目统计页数
export const projectTallyPages = () => {
    return sendRequest("get", '/project/tally/pages');
}

// 获取所有领域信息
export const projectAreas = () => {
    return sendRequest("get", '/project/areas');
}

// 获取所有类型信息
export const projectTypes = () => {
    return sendRequest("get", '/project/types');
}