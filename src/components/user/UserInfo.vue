<script setup>
import { ref, onMounted } from "vue";
import { Edit } from "@element-plus/icons-vue";
import { getUserInfoService, updateUserInfoService } from "@/api/user/index.js";

// ------------- 查询用户信息模型
const id = ref(null);
const email = ref("");
const name = ref("");
const phone = ref("");
const qq = ref("");
const wechat = ref("");
const institution = ref("");

// 从后端获取数据的函数
const fetchUserData = async () => {
  getUserInfoService()
    .then((response) => {
      if (response.data.code === 0) {
        id.value = response.data.data.id;
        email.value = response.data.data.email;
        name.value = response.data.data.name;
        phone.value = response.data.data.phone;
      } else {
        alert(response.data.msg || "获取用户数据失败");
      }
    })
    .catch((error) => {
      console.log("加载错误", error);
    });
};
// 加载组件时调用 fetchUserData 函数
onMounted(() => {
  fetchUserData();
});

// ------------- 切换编辑状态
const centerDialogVisible = ref(false);
// 修改按钮点击事件
const toggleEdit = () => {
  centerDialogVisible.value = !centerDialogVisible.value; // 切换编辑状态
};

// ------------- 用户信息模型
const userInfoData = ref({
  name: "",
  phone: "",
});

const rules = {
  name: [{ required: false, message: "请输入用户名", trigger: "blur" }],
  phone: [
    { required: false, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
  ],
};

// 更新用户信息接口
const updateInfo = async () => {
  if (!userInfoData.value.name && !userInfoData.value.phone) {
    alert("请输入用户名或者手机号");
    return;
  }

  // 验证手机号格式
  if (
    userInfoData.value.phone &&
    !/^1[3-9]\d{9}$/.test(userInfoData.value.phone)
  ) {
    alert("请输入正确的手机号格式");
    return;
  }
  updateUserInfoService(userInfoData.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchUserData(); // 获取后端数据
      } else {
        alert(response.data.msg || "更新失败");
      }
    })
    .catch((error) => {
      alert("更新错误");
      console.log("更新错误", error);
    })
    .finally(() => {
      centerDialogVisible.value = false;
    });
};
</script>

<template>
  <div class="container">
    <div class="container-card">
      <label for="" class="container-card-label">编号</label>
      <el-input v-model="id" style="width: 80%" disabled />
    </div>
    <div class="container-card">
      <label for="" class="container-card-label">邮箱</label>
      <el-input v-model="email" style="width: 80%" disabled />
    </div>
    <div class="container-card">
      <label for="" class="container-card-label">用户名</label>
      <el-input v-model="name" style="width: 80%" disabled />
    </div>
    <div class="container-card">
      <label for="" class="container-card-label">手机号</label>
      <el-input v-model="phone" style="width: 80%" disabled />
    </div>
    <div class="container-card">
      <label for="" class="container-card-label">QQ号</label>
      <el-input v-model="qq" style="width: 80%" disabled />
    </div>
    <div class="container-card">
      <label for="" class="container-card-label">微信号</label>
      <el-input v-model="wechat" style="width: 80%" disabled />
    </div>
    <div class="container-card">
      <label for="" class="container-card-label">所属机构</label>
      <el-input v-model="institution" style="width: 80%" disabled />
    </div>
    <div class="container-button">
      <el-button type="primary" :icon="Edit" circle @click="toggleEdit" />
    </div>
  </div>
  <!-- 提示框 -->
  <el-dialog
    v-model="centerDialogVisible"
    title="修改个人信息"
    width="500"
    center
  >
    <el-form :model="userInfoData" :rules="rules" ref="userInfoForm">
      <div class="container-dialog">
        <label for="" class="container-dialog-label">用户名</label>
        <el-input
          v-model="userInfoData.name"
          style="width: 80%"
          placeholder="请输入用户名"
        />
      </div>
      <div class="container-dialog">
        <label for="" class="container-dialog-label">手机号</label>
        <el-input
          v-model="userInfoData.phone"
          style="width: 80%"
          placeholder="请输入手机号"
        />
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateInfo"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  background-color: #ffffff;
  /* height: 93vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 50%;
  padding-bottom: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0e6e6;
}

.container-button {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 50%;
  padding-bottom: 20px;
  margin-top: 10px;
  margin-bottom: 30px;
}

.container-dialog {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.container-dialog-label {
  margin-right: 10px;
}
</style>