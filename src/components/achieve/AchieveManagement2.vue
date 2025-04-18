<script setup>
import { ref } from "vue";
import AchieveApply from "./AchieveApply.vue";
import AchieveList from "./AchieveList2.vue";
import AchieveApprovedList from "./AchieveApprovedList.vue";
import AchieveSubmit from "./AchieveSubmit.vue";

const isCollapse = ref(false);
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};

// 选择哪个页面
const mode = ref("1");

const gotoPage = (number) => {
  mode.value = number;
};
</script>
  
<template>
  <div class="container">
    <el-aside :style="{ width: isCollapse ? '64px' : '200px' }" style="background-color: #ffffff;">
      <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :value="false">展开</el-radio-button>
        <el-radio-button :value="true">隐藏</el-radio-button>
      </el-radio-group> -->
      <el-button @click="isCollapse = !isCollapse"><el-icon><Operation /></el-icon></el-button>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="1" @click="gotoPage('1')">
          <el-icon><Plus /></el-icon>
          <template #title>创建项目成果</template>
        </el-menu-item>
        <el-menu-item index="2" @click="gotoPage('2')">
          <el-icon><Tickets /></el-icon>
          <template #title>我的成果申请</template>
        </el-menu-item>
        <el-menu-item index="3" @click="gotoPage('3')">
          <el-icon><Check /></el-icon>
          <template #title>已通过的成果</template>
        </el-menu-item>
        <el-menu-item index="4" @click="gotoPage('4')">
          <el-icon><Collection /></el-icon>
          <template #title>已提交的成果</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main style="background-color: #f8f8f8;">
        <div>
          <!-- 创建成果申请 -->
          <div
            v-if="mode === '1'"
            style="display: flex; align-items: center; justify-content: center"
          >
            <AchieveApply></AchieveApply>
          </div>
          <!-- 成果申请列表-->
          <div v-else-if="mode === '2'">
            <AchieveList></AchieveList>
          </div>
          <!-- 已通过的成果列表-->
          <div v-else-if="mode === '3'">
            <AchieveApprovedList></AchieveApprovedList>
          </div>
          <div v-else-if="mode === '4'">
            <AchieveSubmit></AchieveSubmit>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  /* min-height: 400px; */
  height: 81vh;
}

.container {
  display: flex;
  flex-direction: row;
  /* height: 93vh; */
}

/* .el-menu {
  height: 92%;
} */
</style>