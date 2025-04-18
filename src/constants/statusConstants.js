// src/constants/StatusConstants.js

// -------------- 项目管理
export const projectStatusContant = {
  STATUS_DRAFT: "预处理",
  STATUS_SUBMIT: "未处理",
  STATUS_LAUNCHED: "已立项",
  STATUS_REJECTED: "已驳回",
  STATUS_CLOSED: "已结项",
};

export const projectStatusMap = {
  0: projectStatusContant.STATUS_DRAFT,
  1: projectStatusContant.STATUS_SUBMIT, 
  2: projectStatusContant.STATUS_LAUNCHED,
  3: projectStatusContant.STATUS_REJECTED,
  4: projectStatusContant.STATUS_CLOSED,
};

// --------------- 任务管理
export const taskStatusContant = {
  STATUS_DRAFT: "草稿",
  STATUS_SUBMIT: "已提交",
  STATUS_AGREE: "已确认",
  STATUS_REJECT: "已完成",
};
// 后端的状态转换为字符串
export const taskStatusMap = {
  0: taskStatusContant.STATUS_DRAFT,
  1: taskStatusContant.STATUS_SUBMIT,
  2: taskStatusContant.STATUS_AGREE,
  3: taskStatusContant.STATUS_REJECT
};

// --------------- 经费管理
export const fundStatusContant = {
  STATUS_DRAFT: "草稿",
  STATUS_SUBMIT: "已提交",
  STATUS_AGREE: "已同意",
  STATUS_REJECT: "已拒绝",
};

export const fundStatusMap = {
  0: fundStatusContant.STATUS_DRAFT,
  1: fundStatusContant.STATUS_SUBMIT,
  2: fundStatusContant.STATUS_AGREE,
  3: fundStatusContant.STATUS_REJECT
};

// ---------------- 成果管理
export const achieveStatusContant = {
  STATUS_DRAFT: "草稿",
  STATUS_SUBMIT: "已提交",
  STATUS_AGREE: "已通过",
  STATUS_REJECT: "已拒绝"
};

export const achieveStatusMap = {
  0: achieveStatusContant.STATUS_DRAFT,
  1: achieveStatusContant.STATUS_SUBMIT,
  2: achieveStatusContant.STATUS_AGREE,
  3: achieveStatusContant.STATUS_REJECT,
};