<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getProjectDetails } from "@/api/project/index.js";
import { convertTimestamp } from '@/utils/timeConverter.js'


const route = useRoute();
const projectId = ref(BigInt(route.params.id)); // 获取参数
const value = projectId.value.toString();

const form = ref({
  id: null
})
form.value.id = BigInt(value)
// 项目详情数据模型
const projectDetails = ref({}); // 用于存储项目详情数据
// 获取项目详情的函数
const fetchProjectDetails = async () => {
  getProjectDetails(form.value)
    .then((response) => {
      if (response.data.code === 0) {
        console.log(response.data.data)
        projectDetails.value = response.data.data;
        projectDetails.value.gmtCreate = convertTimestamp(projectDetails.value.gmtCreate),
        projectDetails.value.gmtModify = convertTimestamp(projectDetails.value.gmtModify),
        projectDetails.value.gmtReview = projectDetails.value.gmtReview === 0 ? "未审核" : convertTimestamp(projectDetails.value.gmtReview),
        projectDetails.value.gmtConclude = projectDetails.value.gmtConclude === 0 ? "未结项" : convertTimestamp(projectDetails.value.gmtConclude)
        projectDetails.value.budget = BigInt(projectDetails.value.budget),
        projectDetails.value.taskNum = BigInt(projectDetails.value.taskNum),
        projectDetails.value.memberNum = BigInt(projectDetails.value.memberNum),
        projectDetails.value.achieveNum = BigInt(projectDetails.value.achieveNum),
        projectDetails.value.fundNum = BigInt(projectDetails.value.fundNum)
      } else {
        alert(response.data.msg || "获取项目详情失败");
      }
    })
    .catch((error) => {
        alert("加载项目详情失败，请稍后重试");
        console.log(error)
    });
};
// 在页面加载时调用 fetchProjectDetails
onMounted(() => {
  fetchProjectDetails();
});
</script>

<template>
  <div class="container">
    <div class="container-card">
      <el-card style="width: 100%">
        <template #header>
          <div class="card-header">
            <span class="card-header-title">负责人</span>
          </div>
        </template>
        <div class="container-card-content">
          <el-form-item label="姓名" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.leaderName
            }}</el-text>
          </el-form-item>
          <el-form-item label="邮箱" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.leaderEmail
            }}</el-text>
          </el-form-item>
        </div>
      </el-card>
      <el-card style="width: 100%">
        <template #header>
          <div class="card-header">
            <span class="card-header-title">项目信息</span>
          </div>
        </template>
        <div class="container-card-content">
          <el-form-item label="编号" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.id
            }}</el-text>
          </el-form-item>
          <el-form-item label="标题" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.title
            }}</el-text>
          </el-form-item>
          <el-form-item label="状态" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.status
            }}</el-text>
          </el-form-item>
          <el-form-item label="类型" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.type
            }}</el-text>
          </el-form-item>
          <el-form-item label="领域" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.area
            }}</el-text>
          </el-form-item>
          <el-form-item label="预算" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.budget
            }}</el-text>
          </el-form-item>
          <el-form-item label="内容" class="container-card-content-label">
            <el-text class="mx-1" style="width: 800px; white-space: pre-wrap;">{{
              projectDetails.content
            }}</el-text>
          </el-form-item>
        </div>
      </el-card>
      <el-card style="width: 100%">
        <template #header>
          <div class="card-header">
            <span class="card-header-title">项目进度</span>
          </div>
        </template>
        <div class="container-card-content">
          <el-form-item label="创建时间" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.gmtCreate
            }}</el-text>
          </el-form-item>
          <el-form-item label="审核时间" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.gmtReview
            }}</el-text>
          </el-form-item>
          <el-form-item label="结项时间" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.gmtConclude
            }}</el-text>
          </el-form-item>
        </div>
      </el-card>
      <el-card style="width: 100%" v-if="projectDetails.concludeTitle">
        <template #header>
          <div class="card-header">
            <span class="card-header-title">项目结项</span>
          </div>
        </template>
        <div class="container-card-content">
          <el-form-item label="结项标题" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.concludeTitle
            }}</el-text>
          </el-form-item>
          <el-form-item label="结项时间" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.gmtReview
            }}</el-text>
          </el-form-item>
          <el-form-item
            label="结项内容"
            class="container-card-content-label"
            style="width: 90%"
          >
            <el-text class="mx-1" style="width: 800px; white-space: pre-wrap;">{{
              projectDetails.concludeContent
            }}</el-text>
          </el-form-item>
        </div>
      </el-card>
      <el-card style="width: 100%">
        <template #header>
          <div class="card-header">
            <span class="card-header-title">项目统计</span>
          </div>
        </template>
        <div class="container-card-content">
          <el-form-item label="任务数量" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.taskNum
            }}</el-text>
          </el-form-item>
          <el-form-item label="成员数量" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.memberNum
            }}</el-text>
          </el-form-item>
          <el-form-item label="成果数量" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.achieveNum
            }}</el-text>
          </el-form-item>
          <el-form-item label="总花费" class="container-card-content-label">
            <el-text class="mx-1" style="width: 200px">{{
              projectDetails.fundNum
            }}</el-text>
          </el-form-item>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.container-card {
  width: 80%;
}

.card-header-title {
  color: blue;
  border-left: 5px solid blue;
  padding-left: 5px;
}

.text-item {
  background-color: #f8f8f8;
  padding: 20px;
  margin: 0;
}

.container-card-content {
  display: flex;
  flex-wrap: wrap; /* 允许子元素在必要时换行 */
  /* border: 2px solid red; */
  padding-left: 10px;
  padding-top: 10px;
}

.el-text {
  color: black;
}
.container-card-content-label {
  /* color: #150aad; */
  /* border: 2px solid red; */
  margin-right: 5%;
  width: 25%;
}
</style>