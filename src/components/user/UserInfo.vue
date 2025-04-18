<script setup>
import { ref, onMounted } from "vue";
import { Edit } from "@element-plus/icons-vue";
import { getUserInfoService, updateUserInfoService } from "@/api/user/index.js";
import { ElMessage } from "element-plus";

// ------------- 查询用户信息模型
const id = ref(null);
const email = ref("");
const name = ref("");
const phone = ref("");
const qq = ref("");
const wechat = ref("");
const institution = ref(null);

// 从后端获取数据的函数
const fetchUserData = async () => {
  getUserInfoService()
    .then((response) => {
      if (response.data.code === 0) {
        id.value = response.data.data.id;
        phone.value = response.data.data.phone;
        qq.value = response.data.data.qq;
        wechat.value = response.data.data.wechat;
        institution.value = response.data.data.institution;
        name.value = response.data.data.name;
        email.value = response.data.data.email;
      } else {
        ElMessage.error(response.data.msg || "获取用户数据失败");
      }
    })
    .catch((error) => {
      ElMessage.error("获取用户数据失败");
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
  userInfoForm.value.name = name.value;
  userInfoForm.value.phone = phone.value;
  userInfoForm.value.qq = qq.value;
  userInfoForm.value.wechat = wechat.value;
  userInfoForm.value.institution = institution.value;
  for (let i = 0; i < institutionList.length; i++) {
    if (institutionList[i].name === institution.value) {
      userInfoForm.value.institution = institutionList[i].id;
      break;
    }
  }
};

// ------------- 用户信息模型
const userInfoForm = ref({
  name: "",
  phone: "",
  qq: "",
  wechat: "",
  institution: null,
});

const rules = {
  name: [{ required: false, message: "请输入用户名", trigger: "blur" }],
  phone: [
    {
      required: false,
      pattern: /^1[3-9]\d{9}$/,
      message: "手机号格式不正确",
      trigger: "blur",
    },
  ],
  qq: [{ required: false, message: "请输入QQ号", trigger: "blur" }],
  wechat: [{ required: false, message: "请输入微信号", trigger: "blur" }],
  institution: [
    { required: false, message: "请选择所属机构", trigger: "change" },
  ],
};

// 更新用户信息接口
const updateInfo = async () => {
  updateUserInfoService(userInfoForm.value)
    .then((response) => {
      if (response.data.code === 0) {
        fetchUserData(); // 获取后端数据
        ElMessage.success(response.data.msg || "更新成功");
      } else {
        ElMessage.error(response.data.msg || "更新失败");
      }
    })
    .catch((error) => {
      ElMessage.error("更新错误");
      console.log("更新错误", error);
    })
    .finally(() => {
      centerDialogVisible.value = false;
      (userInfoForm.value.name = ""),
        (userInfoForm.value.phone = ""),
        (userInfoForm.value.qq = ""),
        (userInfoForm.value.wechat = ""),
        (userInfoForm.value.institution = null);
    });
};

// 机构
const institutionList = JSON.parse(localStorage.getItem("institution"));
</script>

<template>
  <div class="container">
    <div class="container-content">
      <div class="container-card">
        <label for="" style="font-size: 24px; font-weight: bold"
          >基本信息</label
        >
      </div>
      <div class="container-card">
        <div>
          <el-icon><Message /></el-icon>
          <label for="" style="margin-left: 10px; font-weight: bold"
            >邮箱</label
          >
        </div>
        <label for="">{{ email }}</label>
      </div>
      <div class="container-card">
        <div>
          <el-icon><User /></el-icon>
          <label for="" style="margin-left: 10px; font-weight: bold"
            >用户名</label
          >
        </div>
        <label for="">{{ name }}</label>
      </div>
      <div class="container-card">
        <div>
          <el-icon><Cellphone /></el-icon>
          <label for="" style="margin-left: 10px; font-weight: bold"
            >手机号</label
          >
        </div>
        <label for="">{{ phone }}</label>
      </div>
      <div class="container-card">
        <div>
          <el-icon><Message /></el-icon>
          <label for="" style="margin-left: 10px; font-weight: bold"
            >QQ号</label
          >
        </div>
        <label for="">{{ qq }}</label>
      </div>
      <div class="container-card">
        <div>
          <el-icon><CollectionTag /></el-icon>
          <label for="" style="margin-left: 10px; font-weight: bold"
            >微信号</label
          >
        </div>
        <label for="">{{ wechat }}</label>
      </div>
      <div class="container-card">
        <div>
          <el-icon><House /></el-icon>
          <label for="" style="margin-left: 10px; font-weight: bold"
            >所属机构</label
          >
        </div>
        <label for="">{{ institution }}</label>
      </div>
      <div class="container-button">
        <el-button type="primary" :icon="Edit" circle @click="toggleEdit" />
      </div>
    </div>
  </div>
  <!-- 提示框 -->
  <el-dialog
    v-model="centerDialogVisible"
    title="修改个人信息"
    min-width="400"
    max-width="800"
    center
  >
    <div style="display: flex; align-items: center; justify-content: center;">
      <el-form :model="userInfoForm" :rules="rules" label-width="auto" style="width: 70%;">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userInfoForm.name" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userInfoForm.phone" clearable />
        </el-form-item>
        <el-form-item label="QQ号" prop="qq">
          <el-input v-model="userInfoForm.qq" clearable />
        </el-form-item>
        <el-form-item label="微信号" prop="wechat">
          <el-input v-model="userInfoForm.wechat" clearable />
        </el-form-item>
        <el-form-item label="所属机构" prop="institution">
          <el-select
            v-model="userInfoForm.institution"
            placeholder="请选择所属机构"
          >
            <el-option
              v-for="item in institutionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
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
  /* height: 80vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
}

.container-content {
  width: 70%;
  border: 2px solid #f0e6e6;
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background: linear-gradient(
    to bottom,
    rgba(230, 250, 255, 0.8),
    rgba(255, 255, 255, 0.8)
  ); /* 渐变色 */
}

.container-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* width: 60%; */
  /* border: 2px solid #f0e6e6; */
  border-bottom: 2px solid #f0e6e6;
  padding: 20px;
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