<script setup>
import { onMounted, ref } from "vue";
import router from "@/router";
import { loginOut } from "@/api/auth/index.js";
import { ElMessage } from "element-plus";
import { getUserInfoService } from "@/api/user/index.js";

const breadcrumbItems = ref([{ name: "首页", path: "/member" }]);

onMounted(() => {
  breadcrumbItems.value = [
    { name: "首页", path: "/member" },
    { name: "项目管理", path: "/member/project" },
    { name: "参与项目", path: "/member/project/apply" }
  ];
})

// 更新面包屑(一级菜单)
// function updateBreadcrumb(newItemName, newItemPath) {
//     breadcrumbItems.value = [
//         { name: '首页', path: '/'},
//         { name: newItemName, path: newItemPath },
//         // { name: newItemName, path: `/${newItemName}`} // 动态路径
//     ];
//     // router.push({ path: `/${newItemName}` }); // 使用Vue Router进行页面跳转
// }

// 更新面包屑（二级菜单）项目管理
function updateBreadcrumbSec(newItemName, newItemPath) {
  breadcrumbItems.value = [
    { name: "首页", path: "/member" },
    { name: "项目管理", path: "/member/project" },
    { name: newItemName, path: `/${newItemPath}` },
  ];
  router.push({ path: `/${newItemPath}` });
}

// 任务分配
function updateBreadcrumbSec2(newItemName, newItemPath) {
  breadcrumbItems.value = [
    { name: "首页", path: "/member" },
    { name: "任务管理", path: "/member/tasks" },
    { name: newItemName, path: `/${newItemPath}` },
  ];
  router.push({ path: `/${newItemPath}` });
}

// 经费管理
function updateBreadcrumbSec3(newItemName, newItemPath) {
  breadcrumbItems.value = [
    { name: "首页", path: "/member" },
    { name: "经费管理", path: "/member/funds" },
    { name: newItemName, path: `/${newItemPath}` },
  ];
  router.push({ path: `/${newItemPath}` });
}

// 成果管理
function updateBreadcrumbSec4(newItemName, newItemPath) {
  breadcrumbItems.value = [
    { name: "首页", path: "/member" },
    { name: "成果管理", path: "/member/achieve" },
    { name: newItemName, path: `/${newItemPath}` },
  ];
  router.push({ path: `/${newItemPath}` });
}

// 个人中心
function updateBreadcrumbSec5(newItemName, newItemPath) {
  breadcrumbItems.value = [
    { name: "首页", path: "/member" },
    { name: "个人中心", path: "/member/user" },
    { name: newItemName, path: `/${newItemPath}` },
  ];
  router.push({ path: `/${newItemPath}` });
}

const centerDialogVisible = ref(false);
// 用户登出接口
const userLoginOut = async () => {
  loginOut()
    .then((response) => {
      if (response.data.code === 0) {
        // 跳转到登录界面
        router.push({ path: `/login` });
        ElMessage.success("退出成功");
      }
    })
    .catch((error) => {
      ElMessage.error("退出错误");
      console.log("退出错误", error);
    })
    .finally(() => {
      centerDialogVisible.value = false;
    });
};

const userName = ref("");
const userInfo = ref({});
onMounted(() => {
  // 获取用户信息
  getUserInfoService()
    .then((response) => {
      if (response.data.code === 0) {
        userName.value = response.data.data.name;
        userInfo.value = response.data.data;
      } else {
        ElMessage.error(response.data.msg || "获取用户信息失败");
      }
    })
    .catch((error) => {
      ElMessage.error("获取用户信息错误");
      console.log("获取用户信息错误", error);
    });
});

const isCollapsed = ref(false); // 控制菜单栏是否折叠
const asideWidth = ref("200px"); // 默认宽度
// 切换菜单栏宽度的方法
const toggleMenu = () => {
  if (isCollapsed.value) {
    asideWidth.value = "200px"; // 恢复默认宽度
  } else {
    asideWidth.value = "40px"; // 折叠后的宽度
  }
  isCollapsed.value = !isCollapsed.value;
};

const gotoInfoPage = () => {
  breadcrumbItems.value = [
    { name: "首页", path: "/member" },
    { name: "个人中心", path: "/member/user" },
    { name: "个人信息", path: "/member/user/info" },
  ];
  router.push({ path: "/member/user/info" });
};
</script>

<template>
  <div id="app">
    <el-container>
      <el-header style="height: 80px">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="display: flex; align-items: center; color: #333; font-size: 32px;">
            <img
              src="@/assets/favicon.png"
              alt=""
              style="width: 50px; height: 50px; margin-right: 5px"
            />
            科研项目管理系统
          </div>
          <div style="color: #333; display: flex; align-items: center">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div style="padding: 5px">
                  <div style="margin-bottom: 5px; font-weight: bold;" @click="gotoInfoPage">
                    账号信息<el-icon><ArrowRight /></el-icon>
                  </div>
                  <div style="margin-bottom: 5px">
                    邮箱: {{ userInfo.email }}
                  </div>
                  <div style="margin-bottom: 5px">
                    手机号: {{ userInfo.phone }}
                  </div>
                  <div>所属机构: {{ userInfo.institution }}</div>
                </div>
              </template>
              <template #reference>
                {{ userName }}
              </template>
            </el-popover>
            <el-button @click="centerDialogVisible = true" style="margin-left: 10px;">退出</el-button>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
          <el-menu
            :default-openeds="['1']"
            default-active="1"
            class="el-menu-vertical-demo"
            :collapse="isCollapsed"
            :collapse-transition="false"
            unique-opened
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><message /></el-icon>项目管理
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="1-1"
                  @click="
                    () =>
                      updateBreadcrumbSec('参与项目', 'member/project/apply')
                  "
                  >· 参与项目</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><List /></el-icon>任务管理
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="2-1"
                  @click="
                    () => updateBreadcrumbSec2('我的任务', 'member/tasks/task')
                  "
                  >· 我的任务</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><Menu /></el-icon>经费管理
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="3-1"
                  @click="
                    () =>
                      updateBreadcrumbSec3('经费申请', 'member/funds/reimburse')
                  "
                  >· 经费申请</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>

            <el-sub-menu index="4">
              <template #title>
                <el-icon><Checked /></el-icon>成果管理
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="4-1"
                  @click="
                    () =>
                      updateBreadcrumbSec4('查看成果', 'member/achieve/result')
                  "
                  >· 查看成果</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>

            <el-sub-menu index="5">
              <template #title>
                <el-icon><Avatar /></el-icon>个人中心
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="5-1"
                  @click="
                    () => updateBreadcrumbSec5('个人信息', 'member/user/info')
                  "
                >
                  · 个人信息
                </el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-container>
          <!-- 主窗体 -->
          <el-main>
            <!-- 面包屑导航 -->
            <div
              style="
                display: flex;
                flex-direction: row;
                width: 100%;
                background-color: #ffffff;
                align-items: center;
                margin-bottom: 10px;
              "
            >
              <el-button @click="toggleMenu" style="border: none">
                <el-icon><Expand /></el-icon>
              </el-button>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item
                  v-for="(item, index) in breadcrumbItems"
                  :key="index"
                  :to="{ path: item.path }"
                >
                  {{ item.name }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>

            <!-- 路由视图容器 -->
            <router-view> </router-view>
          </el-main>
          <el-footer style="height: 40px; line-height: 40px"
            >Copyright ©2025 Ljy and Lzh 科研项目管理系统</el-footer
          >
        </el-container>
      </el-container>
    </el-container>
  </div>

  <!-- 对话框 -->
  <el-dialog v-model="centerDialogVisible" title="提示" width="500" center>
    <span>确定退出系统？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="userLoginOut"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<style scoped>
html,
body,
#app,
.el-container {
  margin: 0;
  padding: 0;
  height: 100vh;
}

.el-header {
  background: linear-gradient(to bottom right, white, #7856b6);
  /* border: 3px solid #e8e8e8; */
  color: #ffffff;
  text-align: left;
  line-height: 80px;
  /* font-size: 32px; */
  font-weight: bold;

  margin: 0px;
}

.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

/* 一级标题文字颜色 */
.el-menu-item,
::v-deep .el-sub-menu .el-sub-menu__title {
  color: #fff;
}

/* 穿透el-menu-item 鼠标悬停背景色 */
:deep(.el-menu-item:hover) {
  background-color: #727b8d;
}

/* 穿透el-sub-menu__title 鼠标悬停背景色 */
:deep(.el-sub-menu__title:hover) {
  background-color: #454c5a;
}

/* 有二级菜单的标题及子菜单菜单字体颜色 */
.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-sub-menu__title {
  color: #fff !important;
  background-color: rgb(5, 5, 5);
}

/* 二级菜单hover状态下字体颜色 */
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: rgb(58, 16, 112) !important;
}

.el-aside {
  /* background-color: #e0f7ff; */
  background-color: #333;
  /* color: #333; */
  text-align: center;
  line-height: 200px;
  justify-content: center;
  margin: 0px;
}

.el-menu {
  background-color: #333;
}

.el-menu-item-group {
  background-color: #333;
}

.el-menu-item {
  background-color: #333;
}

.el-main {
  color: #333;
  background-color: #f2f4f7;
  padding: 5px;
}

.el-breadcrumb {
  background-color: #fcfdfd;
  height: 5vh;
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-start;
}
</style>

