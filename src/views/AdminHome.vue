<script setup>
import { ref } from "vue";
import router from "@/router";
import { loginOut } from "@/api/auth/index.js";

const breadcrumbItems = ref([{ name: "首页", path: "/" }]);

// 更新面包屑(一级菜单)
// function updateBreadcrumb(newItemName, newItemPath) {
//     console.log("更新面包屑", newItemName);
//     breadcrumbItems.value = [
//         { name: '首页', path: '/'},
//         { name: newItemName, path: newItemPath },
//         // { name: newItemName, path: `/${newItemName}`} // 动态路径
//     ];
//     // router.push({ path: `/${newItemName}` }); // 使用Vue Router进行页面跳转
// }

// 更新面包屑（二级菜单）项目管理
function updateBreadcrumbSec(newItemName, newItemPath) {
  console.log("更新面包屑", newItemName);
  breadcrumbItems.value = [
    { name: "首页", path: "/admin" },
    { name: "项目管理", path: "/admin/project" },
    { name: newItemName, path: `/${newItemPath}` },
  ];
  router.push({ path: `/${newItemPath}` });
}

// 经费管理
function updateBreadcrumbSec2(newItemName, newItemPath) {
  console.log("更新面包屑", newItemName);
  breadcrumbItems.value = [
    { name: "首页", path: "/admin" },
    { name: "经费管理", path: "/admin/funds" },
    { name: newItemName, path: `/${newItemPath}` },
  ];
  router.push({ path: `/${newItemPath}` });
}

// 成果管理
function updateBreadcrumbSec3(newItemName, newItemPath) {
  console.log("更新面包屑", newItemName);
  breadcrumbItems.value = [
    { name: "首页", path: "/admin" },
    { name: "成果管理", path: "/admin/achieve" },
    { name: newItemName, path: `/${newItemPath}` },
  ];
  router.push({ path: `/${newItemPath}` });
}

// 个人中心
function updateBreadcrumbSec4(newItemName, newItemPath) {
  console.log("更新面包屑", newItemName);
  breadcrumbItems.value = [
    { name: "首页", path: "/admin" },
    { name: "个人中心", path: "/admin/user" },
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
        alert(response.data.msg || "退出成功");
      } else {
        alert(response.data.msg || "退出失败");
      }
    })
    .catch((error) => {
      alert("退出错误");
      console.log("退出错误", error);
    })
    .finally(() => {
      centerDialogVisible.value = false;
    });
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
          科研项目管理系统
          <el-button @click="centerDialogVisible = true">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-openeds="['1', '2']"
            default-active="1"
            class="el-menu-vertical-demo"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><message /></el-icon>项目管理
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="1-1"
                  @click="
                    () => updateBreadcrumbSec('审核项目', 'admin/project/apply')
                  "
                  >审核项目</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><Menu /></el-icon>经费管理
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="2-1"
                  @click="
                    () =>
                      updateBreadcrumbSec2('查看经费', 'admin/funds/reimburse')
                  "
                  >查看经费</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>

            <el-sub-menu index="3">
              <template #title>
                <el-icon><Checked /></el-icon>成果管理
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="3-1"
                  @click="
                    () => updateBreadcrumbSec3('查看成果', 'admin/achieve/result')
                  "
                  >查看成果</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>

            <el-sub-menu index="4">
              <template #title>
                <el-icon><Avatar /></el-icon>个人中心
              </template>
              <el-menu-item-group>
                <el-menu-item
                  index="4-1"
                  @click="
                    () => updateBreadcrumbSec4('个人信息', 'admin/user/info')
                  "
                  >个人信息</el-menu-item
                >
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item
                  index="4-2"
                  @click="
                    () => updateBreadcrumbSec4('用户权限', 'admin/user/grant')
                  "
                  >用户权限</el-menu-item
                >
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-container>
          <!-- 主窗体 -->
          <el-main>
            <!-- 面包屑导航 -->
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                v-for="(item, index) in breadcrumbItems"
                :key="index"
                :to="{ path: item.path }"
              >
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 路由视图容器 -->
            <router-view> </router-view>
          </el-main>
          <!-- <el-footer style="height: 40px;">科研项目管理系统 版权所有: Lzh and Ljy | 2025-03-01</el-footer> -->
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
  margin: 0px;
  padding: 0px;
  height: 100vh;
}
.el-header {
  background-color: #7856b6;
  color: #ffffff;
  text-align: left;
  line-height: 80px;
  font-size: 32px;
  font-weight: bold;
}

.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #e0f7ff;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-menu {
  background-color: #ecf7fd;
}

.el-menu-item-group {
  background-color: #ecf7fd;
}

.el-menu-item {
  background-color: #ddf4fa;
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