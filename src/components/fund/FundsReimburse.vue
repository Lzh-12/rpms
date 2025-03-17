<script setup>
import { ref } from "vue";
import FundsApply from "./FundsApply.vue";
import FundsList from "./FundsList.vue";
import FundsApprovedList from "./FundsApprovedList.vue";

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
    <el-aside
      :style="{ width: isCollapse ? '64px' : '200px' }"
      style="background-color: #ffffff"
    >
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :value="false">展开</el-radio-button>
        <el-radio-button :value="true">隐藏</el-radio-button>
      </el-radio-group>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="1" @click="gotoPage('1')">
          <el-icon><DocumentAdd /></el-icon>
          <template #title>创建经费申请</template>
        </el-menu-item>
        <el-menu-item index="2" @click="gotoPage('2')">
          <el-icon><Document /></el-icon>
          <template #title>我的经费申请</template>
        </el-menu-item>
        <el-menu-item index="3" @click="gotoPage('3')">
          <el-icon><DocumentChecked /></el-icon>
          <template #title>已通过经费申请</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-main style="background-color: #ffffff">
        <div>
          <!-- 创建经费申请 -->
          <div
            v-if="mode === '1'"
            style="display: flex; align-items: center; justify-content: center"
          >
            <FundsApply></FundsApply>
          </div>
          <!-- 经费申请列表-->
          <div v-else-if="mode === '2'">
            <FundsList></FundsList>
          </div>
          <!-- 已通过经费申请列表-->
          <div v-else-if="mode === '3'">
            <FundsApprovedList></FundsApprovedList>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

  
  <style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.container {
  display: flex;
  flex-direction: row;
  height: 93vh;
}

.el-menu {
  height: 92%;
}
</style>