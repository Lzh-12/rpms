<script setup>
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import { achieveAllApproved } from "@/api/achieve/index.js";
import { projectMy } from "@/api/project/index.js";
import { convertTimestamp, formatTime } from "@/utils/timeConverter.js";
import { ElMessage } from "element-plus";
import { tableRowClassName } from "@/utils/tableUtils.js";

// 项目编号
const options = ref([]);

// 提交数据
const form = ref({
  id: null,
});

// 从后端获取选项数据
const fetchOptions = async () => {
  projectMy()
    .then((response) => {
      if (response.data.code === 0) {
        options.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
        }));
      } else {
        ElMessage.error(response.data.msg || "加载项目失败");
      }
    })
    .catch((error) => {
      ElMessage.error("加载项目错误");
      console.log("加载项目错误", error);
    });
};

// 成果类型
const optionTypes = ref([]);
// 创建映射对象，将 type 的整数值映射到对应的 name 字符串
let map = {};
// 加载后端数据
onMounted(() => {
  optionTypes.value = JSON.parse(localStorage.getItem("fundTypes"));
  optionTypes.value.forEach(({ id, name }) => {
    map[id] = name;
  });
  fetchOptions();
});

// 已通过的经费列表的数据模型
const tableData = ref([]);

// 项目已通过的经费列表的接口
const searchApproved = async () => {
  // form.value.id = BigInt(form.value.id);
  if (form.value.id === null) {
    ElMessage.warning("请选择项目");
    return;
  }
  achieveAllApproved(form.value)
    .then((response) => {
      if (response.data.code === 0) {
        tableData.value = response.data.data.map((item) => ({
          ...item,
          id: BigInt(item.id).toString(),
          submitterId: BigInt(item.submitterId).toString(),
          gmtReview:
            item.gmtReview === 0
              ? "未审核"
              : convertTimestamp(item.gmtReview).toString(),
          relativeReview:
            item.gmtReview === 0
              ? "未审核"
              : formatTime(item.gmtReview).toString(),
        }));
        // ElMessage.success(response.data.msg || "查询成功");
      } else {
        ElMessage.error(response.data.msg || "查询失败");
      }
    })
    .catch((error) => {
      ElMessage.error("查询错误");
      console.log("查询错误", error);
    });
};
</script>

<template>
  <div class="container">
    <div class="container-title">
      <el-form-item label="项目">
        <el-select v-model="form.id" placeholder="请选择项目">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-button
        type="primary"
        :icon="Search"
        class="search"
        @click="searchApproved"
        >查询</el-button
      >
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        :header-row-class-name="tableRowClassName"
      >
        <el-table-column
          fixed
          label="成果提交人"
          min-width="80"
          max-width="200"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>用户名: {{ scope.row.submitterName }}</div>
                <div>邮箱: {{ scope.row.submitterEmail }}</div>
              </template>
              <template #reference>
                <el-tag effect="plain" type="success">{{
                  scope.row.submitterName
                }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="成果标题"
          min-width="120"
          max-width="240"
          show-overflow-tooltip
        />
        <el-table-column
          prop="content"
          label="成果内容"
          min-width="120"
          max-width="250"
          show-overflow-tooltip
        />
        <el-table-column
          prop="type"
          label="成果类型"
          min-width="100"
          max-width="200"
          show-overflow-tooltip
        />
        <el-table-column
          label="审核时间"
          min-width="110"
          max-width="240"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="top"
              width="auto"
            >
              <template #default>
                <div>审核时间: {{ scope.row.gmtReview }}</div>
              </template>
              <template #reference>
                {{ scope.row.relativeReview }}
              </template>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          prop="reviewContent"
          label="审核意见"
          min-width="130"
          max-width="280"
          show-overflow-tooltip
        />
      </el-table>
    </div>
  </div>
</template>
  
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
}

.container-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100px;
  background-color: #ffffff;
  width: 100%;
  margin-bottom: 10px;
}

.el-table >>> .success-row th {
  background: #edf6fb !important;
  background: #525fad !important;
  color: #fff !important;
}

.el-form-item {
  width: 40%;
  margin-right: 20px;
}

.search {
  margin-bottom: 15px;
}

.table {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
}

.el-table {
  width: 95%;
}

@media screen and (min-width: 1500px) {
  .el-table {
    width: 100%;
  }
}
</style>