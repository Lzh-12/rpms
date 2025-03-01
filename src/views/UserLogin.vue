<script setup>
import { ref } from "vue";
import router from "@/router";
import {
  loginService,
  registerService,

} from "@/api/auth/index.js";
import { tokenObj } from "@/utils/request.js";
import { getInstitutionsInfo } from "@/api/info/index.js";
import { projectAreas, projectTypes } from "@/api/project/index.js";
import { projectFundTypes } from "@/api/fund/index.js";
import { achieveTypes } from "@/api/achieve/index.js";

// 身份选择
const options = [
  {
    value: 1,
    label: "科研人员",
  },
  {
    value: 2,
    label: "项目负责人",
  },
  {
    value: 3,
    label: "科研机构管理员",
  },
];

// 获取所有机构信息
const getInstitution = async () => {
  getInstitutionsInfo()
    .then((response) => {
      if (response.data.code === 0) {
        // 缓存数据本地存储 (转换成字符串)
        localStorage.setItem("institution", JSON.stringify(response.data.data));
      } else {
        alert(response.data.msg || "获取机构信息失败");
      }
    })
    .catch((error) => {
      alert("获取机构信息错误");
      console.log("获取机构信息错误", error);
    });
};

// 获取项目所有领域信息
const getProjectAreas = async () => {
  projectAreas()
    .then((response) => {
      if (response.data.code === 0) {
        localStorage.setItem(
          "projectAreas",
          JSON.stringify(response.data.data)
        );
      } else {
        alert(response.data.msg || "获取项目领域信息失败");
      }
    })
    .catch((error) => {
      alert("获取项目领域信息错误");
      console.log("获取项目领域信息错误", error);
    });
};
// 获取项目所有类型信息
const getProjectTypes = async () => {
    projectTypes()
    .then((response) => {
      if (response.data.code === 0) {
        localStorage.setItem(
          "projectTypes",
          JSON.stringify(response.data.data)
        );
      } else {
        alert(response.data.msg || "获取项目类型失败");
      }
    })
    .catch((error) => {
      alert("获取项目类型错误");
      console.log("获取项目类型错误", error);
    });
};
// 获取经费所有类型信息
const getFundTypes = async () => {
    projectFundTypes()
    .then((response) => {
      if (response.data.code === 0) {
        localStorage.setItem(
          "fundTypes",
          JSON.stringify(response.data.data)
        );

        const storedData = JSON.parse(localStorage.getItem("fundTypes"));
        console.log(storedData);
      } else {
        alert(response.data.msg || "获取经费类型失败");
      }
    })
    .catch((error) => {
      alert("获取经费类型错误");
      console.log("获取经费类型错误", error);
    });
};
// 获取成果所有类型信息
const getAchieveTypes = async () => {
    achieveTypes()
    .then((response) => {
      if (response.data.code === 0) {
        localStorage.setItem(
          "achieveTypes",
          JSON.stringify(response.data.data)
        );

        const storedData = JSON.parse(localStorage.getItem("achieveTypes"));
        console.log(storedData);
      } else {
        alert(response.data.msg || "获取成果类型失败");
      }
    })
    .catch((error) => {
      alert("获取成果类型错误");
      console.log("获取成果类型错误", error);
    });
};

// 定义登录数据模型
const loginData = ref({
  email: "",
  password: "",
  type: null,
});

// 登录接口
const submitLogin = async () => {
  // 检查表单数据是否完整
  if (
    !loginData.value.email ||
    !loginData.value.password ||
    !loginData.value.type
  ) {
    alert("请确保输入完整数据");
    return;
  }
  
  loginService(loginData.value)
    .then((response) => {

      console.log(response)
      if (response.data.code === 0) {
        // 根据身份跳转
        if (loginData.value.type === 1) {
          router.push({
            name: "ScienceHome",
            query: { loginId: response.data.data.loginId },
          });
        } else if (loginData.value.type === 2) {
          // console.log("数据", response.data.data.loginId);
          router.push({
            name: "DirectorHome",
            query: { loginId: response.data.data.loginId },
          });
        } else if (loginData.value.type === 3) {
          router.push({
            name: "AdminHome",
            query: { loginId: response.data.data.loginId },
          });
        }
        loginData.value.email = "";
        loginData.value.password = "";
        loginData.value.type = null;
        // 保存 token
        tokenObj.tokenName = response.data.data.tokenName;
        tokenObj.tokenValue = response.data.data.tokenValue;
        getInstitution(); // 获取所有机构信息
        getProjectAreas(); // 获取项目所有领域信息
        getProjectTypes(); // 获取项目所有类型信息
        getFundTypes(); // 获取经费所有类型信息
        getAchieveTypes(); // 获取成果所有类型信息
        alert(response.data.msg || "登录成功");
      } else {
        alert(response.data.msg || "登录失败");
      }
    })
    .catch((error) => {
      alert("登录错误", error);
    });
};

// 定义注册数据模型
const registerData = ref({
  email: "",
  password: ""
});
// 注册接口
const submitRegister = async () => {
  // 检查表单数据是否完整
  if (
    !loginData.value.email ||
    !loginData.value.password
  ) {
    alert("请确保输入完整数据");
    return;
  }
  registerData.value.email = loginData.value.email;
  registerData.value.password = loginData.value.password;
  registerService(registerData.value)
    .then((response) => {
      if (response.data.code === 0) {
        alert(response.data.msg || "注册成功");
      } else {
        alert(response.data.msg || "注册失败");
      }
    })
    .catch((error) => {
      alert("注册错误");
      console.log("注册错误", error);
    })
    .finally(() => {
      mode.value = !mode.value;
      registerData.value.email = "";
      registerData.value.password = "";
      // registerData.value.code = "";
    });
};

// 发送验证码接口
// const sendCaptcha = async () => {
//   registerData.value.email = loginData.value.email;
//   if (!registerData.value.email) {
//     alert("请输入邮箱地址");
//     return;
//   }

//   // 发送验证码
//   registerCodeService(registerData.value.email)
//     .then((response) => {
//       if (response.data.code === 0) {
//         alert(response.data.msg || "注册链接已发送到邮箱");
//       } else {
//         alert(response.data.msg || "注册链接发送失败");
//       }
//     })
//     .catch((error) => {
//       alert("发送错误");
//       console.log("发送错误", error);
//     });
// };

// 切换登录注册界面
const mode = ref(true);
// 切换登录注册界面
function changeMode() {
  mode.value = !mode.value;
}
</script>

<template>
  <div id="app" class="container">
    <!-- 登录卡片 -->
    <div class="container-card">
      <!-- 左边 欢迎界面-->
      <div class="container-card-left">
        <label for="欢迎" class="container-card-left-title">Welcome</label>
        <label for="欢迎" class="container-card-left-content"
          >SCAU 科研项目管理系统</label
        >
      </div>
      <!-- 右边 登录输入-->
      <div class="container-card-right">
        <h2 class="container-card-right-title" v-show="mode">Login</h2>
        <h2 class="container-card-right-title" v-show="!mode">Register</h2>
        <!-- 输入邮箱 -->
        <div class="container-card-right-form">
          <label for="eamil address" class="container-card-right-form-title"
            >Eamil Address</label
          >
          <input
            type="email"
            v-model="loginData.email"
            placeholder="email address"
            class="container-card-right-form-content"
            required
          />
        </div>
        <!-- 输入密码 -->
        <div class="container-card-right-form">
          <label for="password" class="container-card-right-form-title"
            >Password</label
          >
          <input
            type="password"
            v-model="loginData.password"
            placeholder="password"
            class="container-card-right-form-content"
            required
          />
        </div>
        <!-- 选择身份 -->
        <div class="container-card-right-form" v-if="mode">
          <label for="identity" class="container-card-right-form-title"
            >Identity</label
          >
          <div class="container-card-right-form-radio">
            <el-select
              v-model="loginData.type"
              placeholder="Please select"
              style="width: 250px; background-color: #f5ebeb"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <!-- 验证码 -->
        <!-- <div class="container-card-right-form" v-if="!mode"> -->
          <!-- <label for="captcha" class="container-card-right-form-title"
            >Captcha</label
          > -->
          <!-- <div class="container-card-right-form-captcha"> -->
            <!-- <input
              type="text"
              v-model="registerData.captcha"
              placeholder="Captcha"
              class="container-card-right-form-content2"
              required
            /> -->
            <!-- <label for="captcha" class="container-card-right-form-title"
            >Captcha</label
          >
            <button
              class="container-card-right-form-captcha-button"
              @click="sendCaptcha"
            >
              captcha
            </button>
          </div>
        </div> -->
        <!-- 点击登录 -->
        <div class="container-card-right-form">
          <button
            class="container-card-right-form-button"
            v-on:click="submitLogin"
            v-if="mode"
          >
            Login
          </button>
          <button
            class="container-card-right-form-button"
            v-on:click="submitRegister"
            v-if="!mode"
          >
            Register
          </button>
        </div>
        <div class="container-card-right-change">
          <button
            class="container-card-right-form-button2"
            v-on:click="changeMode"
          >
            {{
              mode
                ? "Don't have an account? register"
                : "Already have an account? login"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* 登录注册界面样式 */
:root {
  height: 100vh;
}
html,
body {
  margin: 0; /* 移除默认的外边距 */
  padding: 0; /* 移除默认的内边距 */
  width: 100%; /* 设置宽度为100% */
  height: 100%; /* 设置高度为100% */
}

.container {
  /* height: 100%; */
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(
    to right,
    rgb(226, 229, 236),
    rgb(126, 127, 199)
  );
}

.container-card {
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
}

.container-card-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 430px;
  background-color: #ffffff;
  border-radius: 20px;
}

.container-card-right-title {
  font-size: 35px;
  font-weight: bold;
  margin-top: 0;
}

.container-card-right-form {
  display: flex;
  flex-direction: column;
}

.container-card-right-form-title {
  font-size: 16px;
  font-weight: bold;
}

.container-card-right-form-content {
  margin-bottom: 10px;
  margin-top: 10px;
  background-color: #f5ebeb;
  border-radius: 8px;
  width: 250px;
  height: 30px;
  border: #ffffff;
  outline: none;
  font-size: 15px;
}

.container-card-right-form-content2 {
  margin-bottom: 10px;
  margin-top: 10px;
  background-color: #f5ebeb;
  border-radius: 8px;
  width: 150px;
  height: 30px;
  border: #ffffff;
  outline: none;
  font-size: 15px;
  margin-right: 15px;
}

.container-card-right-form-captcha {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 250px;
}

.container-card-right-form-captcha-button {
  height: 30px;
  width: 80px;
  background-color: #5747b4;
  color: #ffffff;
  border-radius: 10px;
  outline: none;
  border: 0;
}

.container-card-right-form-captcha-button:active {
  transform: scale(0.95);
  background-color: #2c429b;
}

.container-card-right-form-captcha-button:hover {
  background-color: #2c429b;
}

.container-card-right-form-content:focus {
  outline: 1px solid #2b55df; /* 自定义轮廓颜色和宽度 */
}

.container-card-right-form-radio {
  margin-top: 10px;
  width: 260px;
  height: 30px;
  border: #ffffff;
  font-size: 15px;
  background-color: #ffffff;
  margin-bottom: 10px;
}

.container-card-right-form-button {
  margin-top: 10px;
  width: 260px;
  height: 35px;
  border-radius: 10px;
  background-color: #5747b4;
  color: #ffffff;
  font-size: 16px;
  border: #ffffff;
}

.container-card-right-form-button:active {
  transform: scale(0.95);
}

.container-card-right-form-button2 {
  background-color: #ffffff;
  border: 0;
}

.container-card-right-form-button:active {
  transform: scale(0.95);
}

.container-card-right-form-button:hover {
  background-color: #2c429b;
}

.container-card-right-change {
  font-size: 14px;
  margin-top: 10px;
}

.container-card-left {
  width: 380px;
  height: 430px;
  border-radius: 20px;
  border-top-right-radius: 50px;
  border-end-end-radius: 50px;
  background-color: #415cb6;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container-card-left-title {
  font-size: 35px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 15px;
}

.container-card-left-content {
  font-size: 25px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 50px;
}
</style>