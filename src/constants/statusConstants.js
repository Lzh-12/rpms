// src/constants/StatusConstants.js

// -------------- 项目管理
export const projectStatusContant = {
  STATUS_PENDING: "预处理",
  STATUS_UNPROCESSED: "未处理",
  STATUS_LAUNCHED: "已立项",
  STATUS_REJECTED: "已驳回",
  STATUS_CLOSED: "已结项",
};
  
export const projectStatusMap = {
  0: projectStatusContant.STATUS_PENDING,
  1: projectStatusContant.STATUS_UNPROCESSED, 
  2: projectStatusContant.STATUS_LAUNCHED,
  3: projectStatusContant.STATUS_REJECTED,
  4: projectStatusContant.STATUS_CLOSED,
};

// --------------- 任务管理
export const taskStatusContant = {
  STATUS_UNPROCESSED: "未处理",
  STATUS_CLOSED: "已提交",
};
// 后端的状态转换为字符串
export const taskStatusMap = {
  0: taskStatusContant.STATUS_UNPROCESSED,
  1: taskStatusContant.STATUS_CLOSED,
};

// --------------- 经费管理
export const fundStatusContant = {
  STATUS_UNPROCESSED: "未处理",
  STATUS_AGREE: "同意报销",
  STATUS_REJECT: "拒绝报销",
};

export const fundStatusMap = {
  0: fundStatusContant.STATUS_UNPROCESSED,
  1: fundStatusContant.STATUS_AGREE,
  2: fundStatusContant.STATUS_REJECT,
};

// ---------------- 成果管理
export const achieveStatusContant = {
  STATUS_UNPROCESSED: "未处理",
  STATUS_AGREE: "审批同意",
  STATUS_REJECTED: "审批驳回",
};

export const achieveStatusMap = {
  0: achieveStatusContant.STATUS_UNPROCESSED,
  1: achieveStatusContant.STATUS_AGREE,
  2: achieveStatusContant.STATUS_REJECTED,
};